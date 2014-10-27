'use strict';

var gulp   = require('gulp');
var rename = require('gulp-rename');

module.exports = function() {
  return gulp.src('./source/patterns/**/*.hbs')
    .pipe(rename({extname: '.html'}))
    .pipe(gulp.dest('./static'));
};
