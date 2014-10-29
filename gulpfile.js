/* global console */
'use strict';

var gulp     = require('gulp');
var settings = require('./build/settings');
var watchers = {};

var tasks = ['assets',
             'browserSync',
             'patternTemplates',
             'styles'];

/**
 * Task modules should be in build/gulp
 */
tasks.forEach(function(task) {
  task = (typeof task === 'string') ? { name: task } : task;
  task.deps = task.deps || [];
  gulp.task(task.name, task.deps, require('./build/gulp/tasks/' + task.name));
});

gulp.task('default', ['styles', 'patternTemplates', 'assets']);

watchers.styles   = gulp.watch(settings.src.styles, ['styles']);
watchers.patterns = gulp.watch(settings.src.patterns, ['patternTemplates']);
