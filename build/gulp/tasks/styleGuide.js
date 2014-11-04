'use strict';

var gulp             = require('gulp');
var fs               = require('fs');
var path             = require('path');
var merge            = require('merge-stream');
var concat           = require('gulp-concat');
var glob             = require('glob');
var findup           = require('findup');
var wrap             = require('gulp-wrap');
var settings         = require('../../settings');
var templateData     = require('../templateData');
var templateMetaData = require('../templateMetaData');
var template         = require('../handlebarsCompile');
var frontMatter      = require('gulp-front-matter');


module.exports =  function() {
  /**
   * Build our own glob to traverse patterns *directories*
   * Filter out files that are not directories.
   */
  var dirs = glob.sync('./source/patterns/**/*').filter(function(filePath) {
    return fs.statSync(filePath).isDirectory();
  });

  var getPathData = function(dirPath) { // @TODO this might want to be its own module.
    var relPath = path.relative(path.resolve(dirPath), path.resolve(settings.paths.source));
    return {
      templateFile : findup.sync(path.resolve(dirPath), 'index.template') + '/index.template',
      patternFile  : findup.sync(path.resolve(dirPath), 'pattern.template') + '/pattern.template',
      paths        : {
        css    : relPath + '/css',
        static : relPath,
        vendor : relPath + '/vendor',
        js     : relPath + '/js'
      }
    };
  };

  /**
   * Lightly based on this recipe: https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md
   * We need to create streams for the operations we're going to take on each
   * directory full of pattern files.
   */
  var tasks = dirs.map(function(dirPath) {
    // Find nearest index.template, going up.
    var pathData     = getPathData(dirPath);
    var destPath     = dirPath.replace('./source/patterns/', '');
    /**
     * For each directory, take all of the pattern template files,
     * extract YAML front matter,
     * render them, wrap them in pattern templates,
     * concatenate into a single index.html file stream.
     * Wrap that with the contents of the nearest `index.template`
     * and output.
     */
    return gulp.src(dirPath + '/*.hbs')
      .pipe(frontMatter({
        property: 'meta',
        remove: true
      }))
      .pipe(templateData({ dataDir: settings.paths.data }))
      .pipe(template({},{ partialsDir: settings.paths.partials }))
      .pipe(templateMetaData())
      .pipe(wrap({src: pathData.patternFile}))
      .pipe(concat('index.html'))
      .pipe(wrap({src: pathData.templateFile}, pathData))
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
