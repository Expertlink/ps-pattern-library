'use strict';

var gulp         = require('gulp');
var settings     = require('../../settings');
var rename       = require('gulp-rename');

module.exports = function() {

  return gulp.src(settings.src.assets)
    .pipe(gulp.dest(settings.dest.assets));
};
