'use strict';

var gulp         = require('gulp');
var fs           = require('fs');
var path         = require('path');
var merge        = require('merge-stream');
var concat       = require('gulp-concat');
var glob         = require('glob');
var findup       = require('findup');
var wrap         = require('gulp-wrap');
var settings     = require('../../settings');
var templateData = require('../templateData');
var template     = require('../handlebarsCompile');


module.exports =  function() {
  /**
   * Build our own glob to traverse patterns *directories*
   * Filter out files that are not directories.
   */
  var dirs = glob.sync('./source/patterns/**/*').filter(function(filePath) {
    return fs.statSync(filePath).isDirectory();
  });
  /**
   * Lightly based on this recipe: https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md
   * We need to create streams for the operations we're going to take on each
   * directory full of pattern files.
   */
  var tasks = dirs.map(function(dirPath) {
    // Find nearest index.template, going up.
    var templateFile = findup.sync(path.resolve(dirPath), 'index.template') + '/index.template';
    var destPath     = dirPath.replace('./source/patterns/', '');
    /**
     * For each directory, take all of the pattern template files,
     * render them, concatenate into a single index.html file stream.
     * Wrap that with the contents of the nearest `index.template`
     * and output.
     */
    return gulp.src(dirPath + '/*.hbs')
      .pipe(templateData({ dataDir: settings.paths.data }))
      .pipe(template({},{ partialsDir: settings.paths.partials }))
      .pipe(concat('index.html'))
      .pipe(wrap({src: templateFile}))
      .pipe(gulp.dest('./static/patterns-test/' + destPath));

  });

  /**
   * There will be one element in `tasks` for each directory
   * in the nested directory structure of patterns, and it is
   * an individual stream. Merge
   * all of these tasks streams into one stream and return.
   */
  return merge(tasks);
};
