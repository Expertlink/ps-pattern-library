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
 * More site-building tasks, not modules.
 */
gulp.task('assets', function() {
 return gulp.src(settings.src.assets)
 .pipe(gulp.dest(settings.dest.assets));
});
gulp.task('dist', function() {
 return gulp.src(settings.src.static)
 .pipe(gulp.dest(settings.paths.dist));
});

var svgInlineConfig = {
  mode: {
    symbol: {}
  }
};
/**
 * Site-building specific to this project
 */
 gulp.task('sprites-inline', function(){
   gulp.src(settings.src.site.sprites.inline)
   .pipe(svgSprite(svgInlineConfig))
   .pipe(gulp.dest(settings.dest.site.sprites));
 });

gulp.task('site', ['styles', 'scripts', 'assets']);
gulp.task('default', ['site', 'library', 'watch', 'browserSync']);
