'use strict';

var gulp             = require('gulp');

// node
var fs               = require('fs');

// npm
var glob             = require('glob');
var merge            = require('merge-stream');

// npm gulp-*
var concat           = require('gulp-concat');
var frontMatter      = require('gulp-front-matter');
var wrap             = require('gulp-wrap');

// local
var templateData     = require('./templateData');
var templateMetaData = require('./templateMetaData');
var template         = require('./handlebarsCompile');
var templateUtil     = require('./templateUtil');

var settings         = require('../settings');
var templateHelpers  = require('../../' + settings.paths.patterns + '/templateHelpers');

module.exports =  function() {
  var pathPattern = new RegExp('\./source\/patterns\/?');

  /* Glob and traverse directories and filter to only directories (not files) */
  var dirs = glob.sync(settings.src.patternDirs).filter(function(filePath) {
    return fs.statSync(filePath).isDirectory();
  });

  dirs.push(settings.paths.patterns);

  /**
   * Lightly based on this recipe:
   * https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md
   * We need to create streams for the operations we're going to take on each
   * directory full of pattern files.
   */
  var tasks = dirs.map(function(dirPath) {
    // Find nearest index.template, going up.
    var pathData        = templateUtil.pathData(dirPath);
    var destPath        = dirPath.replace(pathPattern, '');
    var templateContext = {
      nav      : pathData.nav,
      pathRoot : pathData.pathRoot,
      dirName : pathData.name
    };
    var templateOptions = {
      partialsDir: settings.paths.partials,
      helpers    : templateHelpers
    };

    return gulp.src([dirPath + '/*.hbs', '!' + dirPath + '/_*.hbs'])
      // Convert YAML front matter into file property (meta)
      .pipe(frontMatter({
        property: 'meta',
        remove: true
      }))
      // Get template data for this template
      .pipe(templateData({ dataDir: settings.paths.data }))
      // compile the template
      .pipe(template(templateContext, templateOptions))
      // Process template metadata
      .pipe(templateMetaData())
      // Wrap each pattern with the nearest pattern template
      .pipe(wrap({src: pathData.patternFile}))
      // Concat all compiled, wrapped patterns in this dir into a single output file
      .pipe(concat('index.html'))
      // Wrap concatenated patterns in nearest index template
      .pipe(wrap({src: pathData.templateFile}, pathData))
      // Compile the index template as hbs
      .pipe(template(templateContext, templateOptions))
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
