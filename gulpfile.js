/* global console */
'use strict';

var gulp     = require('gulp');
var settings = require('./settings');
var runSequence = require('run-sequence');
var watchers = {};

/**
 * These modules contain tasks to build the site content onto the pattern library.
 */
var taskModules = [{name: 'browserSync', deps: ['build']},
                   'scripts',
                   'watch'];

taskModules.forEach(function(task) {
  task = (typeof task === 'string') ? { name: task } : task;
  task.deps = task.deps || [];
  gulp.task(task.name, task.deps, require(settings.paths.gulpTasks + '/' + task.name));
});

/**
 * Include tasks for building the pattern library.
 */
require(settings.paths.library + '/tasks/');

/**
 * Include site and project-specific tasks.
 */
require(settings.paths.gulpSiteTasks);

gulp.task('site', function(callback) {
  runSequence(['styles', 'scripts', 'assets'], callback);
});
gulp.task('build', function(callback) {
  runSequence('library', 'site', callback);
});
gulp.task('default', ['build', 'browserSync', 'watch']);
