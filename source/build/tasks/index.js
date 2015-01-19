/* global console */
/**
* gulpfile for site-/project-specific tasks
*/
'use strict';

var gulp     = require('gulp');
var settings = require('../../../settings');

gulp.task('svg-sprites-inline', require('./svg-sprites-inline'));
gulp.task('svg-sprites-css',    require('./svg-sprites-css'));
gulp.task('sprites', ['svg-sprites-inline', 'svg-sprites-css']);
gulp.task('styles', ['sprites'], require('./styles'));

gulp.task('assets', ['sprites'], function() {
  return gulp.src(settings.src.assets)
  .pipe(gulp.dest(settings.dest.assets));
});
gulp.task('dist', function() {
  return gulp.src(settings.src.static)
  .pipe(gulp.dest(settings.paths.dist));
});
