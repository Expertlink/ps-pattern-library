/* global console */
/**
* gulpfile for site-/project-specific tasks
*/
'use strict';

var gulp     = require('gulp');
var settings = require('../../../settings');
var runSequence = require('run-sequence');

gulp.task('svg-sprites-inline', require('./svg-sprites-inline'));
gulp.task('svg-sprites-css',    require('./svg-sprites-css'));
gulp.task('sprites', ['svg-sprites-inline', 'svg-sprites-css']);
gulp.task('styles', ['assets', 'sprites'], require('./styles'));

gulp.task('assets', ['sprites'], function() {
  return gulp.src(settings.src.site.assets)
  .pipe(gulp.dest(settings.dest.assets));
});
gulp.task('dist', function() {
  return gulp.src(settings.src.static)
  .pipe(gulp.dest(settings.paths.dist));
});
