/* global console */
'use strict';
var gulp         = require('gulp'),
    gulpif       = require('gulp-if'),
    concat       = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    settings     = require('../../settings'),
    sass         = require('gulp-ruby-sass');

module.exports = function () {
  return gulp.src(settings.src.library.styles)
    .pipe(gulpif(/[.]scss/, sass()))
    .on('error', function(err) { console.log(err.message); })
    .pipe(autoprefixer())
    .pipe(concat('pattern-library.css'))
    .pipe(gulp.dest(settings.dest.library.css));
};
