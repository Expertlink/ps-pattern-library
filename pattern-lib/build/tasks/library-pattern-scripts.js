/* global console */
'use strict';
var gulp         = require('gulp');
var gulpignore   = require('gulp-ignore');
var concat       = require('gulp-concat');
var path         = require('path');
var stripScripts = require('../gulp-strip-scripts');
var settings     = require('../../../settings');
var through      = require('through2');

module.exports = function () {
  return gulp.src(settings.src.patterns)
  .pipe(stripScripts())
  .pipe(gulpignore(function(file) {
    return !(file.scripts && file.scripts.length);
  }))
  .pipe(through.obj(function(file, enc, cb) {
    var newContent, realPath, pathReference;
    if (file.isNull()) {
      this.push(file);
      return cb();
    }
    if (file.scripts && file.scripts.length) {
      file.scripts = file.scripts || [];
      realPath = path.resolve(file.path);
      pathReference = path.relative(settings.paths.static, realPath);

      newContent = file.scripts.join('');
      newContent = '// Scripts for pattern at ' + pathReference + '\n\r' + newContent;
      file.contents = new Buffer(newContent);
      this.push(file);
      cb();
    } else {

    }
  }))
  .pipe(concat('patterns.js'))
  .pipe(gulp.dest(settings.dest.site.scripts));
};
