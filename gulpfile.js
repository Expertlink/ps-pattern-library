/* global console */
'use strict';

var gulp     = require('gulp');
var settings = require('./build/settings');
var watchers = {};

var tasks = ['assets',
             'browserSync',
             'patternTemplates',
             'styleGuide',
             'styles',
             'watch'];

/**
 * Task modules should be in build/gulp/tasks
 */
tasks.forEach(function(task) {
  task = (typeof task === 'string') ? { name: task } : task;
  task.deps = task.deps || [];
  gulp.task(task.name, task.deps, require('./build/gulp/tasks/' + task.name));
});

gulp.task('default', ['styles', 'patternTemplates', 'assets', 'watch']);
