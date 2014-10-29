/* global console */
'use strict';
var gulp       = require('gulp');
var settings   = require('../../settings');
var watchers   = [];

module.exports = function () {
  watchers.styles   = gulp.watch(settings.src.styles, ['styles']);
  watchers.patterns = gulp.watch(settings.src.patterns, ['patternTemplates']);
};
