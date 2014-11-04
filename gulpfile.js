/* global console */
'use strict';

var gulp     = require('gulp');
var settings = require('./build/settings');
var watchers = {};

var taskModules = ['browserSync',
                   'styleGuide',
                   'styles'];
/**
 * Task modules should be in build/gulp/tasks
 */
taskModules.forEach(function(task) {
  task = (typeof task === 'string') ? { name: task } : task;
  task.deps = task.deps || [];
  gulp.task(task.name, task.deps, require(settings.paths.gulpTasks + '/' + task.name));
});

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
 gulp.task('watch', function() {
   gulp.watch(settings.src.assets,   ['assets']);
   gulp.watch(settings.src.patterns, ['styleGuide']);
   gulp.watch(settings.src.styles,   ['styles']);
   gulp.watch(settings.src.vendor,   ['vendor']);
 });

/**
 * Composite tasks
 */
gulp.task('default', ['styles', 'assets', 'vendor', 'styleGuide', 'watch', 'browserSync']);
