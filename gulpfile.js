/* global console */
'use strict';

var gulp     = require('gulp');
var settings = require('./build/settings');
var watchers = {};

var taskModules = ['browserSync',
                   'styles',
                   'watch'];
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
gulp.task('styleGuide', [], require(settings.paths.styleGuide + '/styleGuide'));

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
gulp.task('default', ['styles', 'assets', 'vendor', 'styleGuide', 'watch', 'browserSync']);
