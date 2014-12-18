/* global console */
'use strict';
var gulp         = require('gulp'),
    gulpif       = require('gulp-if'),
    concat       = require('gulp-concat'),
    settings     = require('../../settings');

module.exports = function () {
  return gulp.src(settings.src.site.scripts)
    .on('error', function(err) { console.log(err.message); })
    .pipe(concat('site.js'))
    .pipe(gulp.dest(settings.dest.site.scripts));
};
