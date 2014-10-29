/* global console */
'use strict';
var gulp       = require('gulp'),
    settings   = require('../../settings'),
    sass       = require('gulp-ruby-sass');

module.exports = function () {
  return gulp.src(settings.src.styles)
    .pipe(sass())
    .on('error', function(err) { console.log(err.message); })
    .pipe(gulp.dest(settings.dest.css));
};
