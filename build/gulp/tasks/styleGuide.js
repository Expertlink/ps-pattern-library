'use strict';

var gulp             = require('gulp');

// node
var fs               = require('fs');
var path             = require('path');

// npm
var findup           = require('findup');
var glob             = require('glob');
var merge            = require('merge-stream');

// npm gulp-*
var concat           = require('gulp-concat');
var frontMatter      = require('gulp-front-matter');
var wrap             = require('gulp-wrap');

// local
var templateData     = require('../templateData');
var templateMetaData = require('../templateMetaData');
var template         = require('../handlebarsCompile');
var buildNav          = require('../../nav');
var relPaths         = require('../../util').relPaths;

var settings         = require('../../settings');
var templateHelpers  = require('../../../' + settings.paths.patterns + '/templateHelpers');

module.exports =  function() {
  var pathPattern = new RegExp('\./source\/patterns\/?');
  /* Glob and traverse directories and filter to only directories (not files) */
  var dirs = glob.sync(settings.src.patternDirs).filter(function(filePath) {
    return fs.statSync(filePath).isDirectory();
  });

  dirs.push(settings.paths.patterns);

  /* Find local templates, build relative paths */
  var getPathData = function(dirPath) { // @TODO this might want to be its own module.
    var paths = relPaths(dirPath, settings.paths.source);
    return {
      templateFile : findup.sync(path.resolve(dirPath), 'index.template') + '/index.template',
      patternFile  : findup.sync(path.resolve(dirPath), 'pattern.template') + '/pattern.template',
      paths        : paths
    };
  };

  /**
   * Lightly based on this recipe:
   * https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md
   * We need to create streams for the operations we're going to take on each
   * directory full of pattern files.
   */
  var tasks = dirs.map(function(dirPath) {
    // Find nearest index.template, going up.
    var pathData     = getPathData(dirPath);
    var destPath     = dirPath.replace(pathPattern, '');

    return gulp.src(dirPath + '/*.hbs')
      // Convert YAML front matter into file property (meta)
      .pipe(frontMatter({
        property: 'meta',
        remove: true
      }))
      // Get template data for this template
      .pipe(templateData({ dataDir: settings.paths.data }))
      // compile the template
      .pipe(template({},{
        partialsDir: settings.paths.partials,
        helpers    : templateHelpers
      }))
      // Process template metadata
      .pipe(templateMetaData())
      // Wrap each pattern with the nearest pattern template
      .pipe(wrap({src: pathData.patternFile}))
      // Concat all compiled, wrapped patterns in this dir into a single output file
      .pipe(concat('index.html'))
      // Wrap concatenated patterns in nearest index template
      .pipe(wrap({src: pathData.templateFile}, pathData))
      // And done.
      .pipe(gulp.dest(settings.dest.patterns + '/' + destPath));
  });

  /**
   * There will be one element in `tasks` for each directory
   * in the nested directory structure of patterns, and it is
   * an individual stream. Merge
   * all of these tasks streams into one stream and return.
   */
  return merge(tasks);
};
