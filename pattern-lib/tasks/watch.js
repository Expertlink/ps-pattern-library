'use strict';

var gulp        = require('gulp');
var browserSync = require('browser-sync');
var settings    = require('../../settings');

module.exports = function() {
  gulp.watch(settings.src.site.assets,       ['assets', browserSync.reload]);
  gulp.watch(settings.src.patterns,          ['library', browserSync.reload]);
  gulp.watch(settings.src.templates,         ['library', browserSync.reload]);
  gulp.watch(settings.src.site.styles,       ['styles', browserSync.reload]);
  gulp.watch(settings.src.library.styles,    ['library-styles', browserSync.reload]);
  gulp.watch(settings.src.library.scripts,   ['library-scripts', browserSync.reload]);
  gulp.watch(settings.src.site.scripts,      ['scripts', browserSync.reload]);
  gulp.watch(settings.src.vendor,            ['vendor', browserSync.reload]);
};
