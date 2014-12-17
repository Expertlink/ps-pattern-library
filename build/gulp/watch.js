'use strict';

var gulp        = require('gulp');
var browserSync = require('browser-sync');
var settings    = require('../settings');

module.exports = function() {
  gulp.watch(settings.src.assets,    ['assets', browserSync.reload]);
  gulp.watch(settings.src.patterns,  ['library', browserSync.reload]);
  gulp.watch(settings.src.templates, ['library', browserSync.reload]);
  gulp.watch(settings.src.styles,    ['styles', browserSync.reload]);
  gulp.watch(settings.src.vendor,    ['vendor', browserSync.reload]);
};
