/* global console */
'use strict';
var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    settings     = require('../../../settings'),
    sass         = require('gulp-ruby-sass');

module.exports = function () {
  return gulp.src(settings.src.site.styles)
    .pipe(sass())
    .on('error', function(err) { console.log(err.message); })
    .pipe(autoprefixer())
    .pipe(gulp.dest(settings.dest.site.css));
};
