/* global console */
'use strict';

var gulp     = require('gulp');
var settings = require('./settings');
var watchers = {};

var taskModules = ['browserSync',
                   'styles',
                   'watch',
                   'library-styles'];
/**
 * Task modules should be in build/gulp/tasks
 */
taskModules.forEach(function(task) {
  task = (typeof task === 'string') ? { name: task } : task;
  task.deps = task.deps || [];
  gulp.task(task.name, task.deps, require(settings.paths.gulpTasks + '/' + task.name));
});

/**
 * Style guide support. Keeping this separate because it's its own thing.
 */
gulp.task('library', ['library-styles'], require(settings.paths.library + '/gulp-library-build'));

/**
 * Simple tasks not worthy of module
 */
gulp.task('assets', function() {
  return gulp.src(settings.src.assets)
    .pipe(gulp.dest(settings.dest.assets));
});
gulp.task('vendor', function() {
  return gulp.src(settings.src.vendor)
    .pipe(gulp.dest(settings.dest.vendor));
});
gulp.task('dist', function() {
  return gulp.src(settings.src.static)
    .pipe(gulp.dest(settings.paths.dist));
});
/**
 * Composite tasks
 */
gulp.task('default', ['styles', 'assets', 'vendor', 'library', 'watch', 'browserSync']);
