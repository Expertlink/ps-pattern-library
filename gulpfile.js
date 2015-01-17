/* global console */
'use strict';

var gulp     = require('gulp');
var settings = require('./settings');
var watchers = {};

var svgSprite = require('gulp-svg-sprite');

/**
 * These modules contain tasks to build the site content onto the pattern library.
 */
var taskModules = ['browserSync',
                   'scripts',
                   'styles',
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


gulp.task('site', ['styles', 'scripts', 'assets']);
gulp.task('default', ['site', 'library', 'watch', 'browserSync']);
