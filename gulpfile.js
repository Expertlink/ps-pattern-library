'use strict';

var gulp = require('gulp');

var tasks = ['browserSync',
             'patternTemplates'];

/**
 * Task modules should be in build/gulp
 */
tasks.forEach(function(task) {
  task = (typeof task === 'string') ? { name: task } : task;
  task.deps = task.deps || [];
  gulp.task(task.name, task.deps, require('./build/gulp/' + task.name));
});

gulp.task('default', ['browserSync']);
