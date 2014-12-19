/* global console */
/**
 * gulpfile for library building
 */
'use strict';

var gulp     = require('gulp');
var settings = require('../../../settings');

var builder = require('../gulp-library-build');

gulp.task('library-styles', require('./library-styles'));
gulp.task('library-scripts', require('./library-scripts'));
gulp.task('library-prepare', builder.prepare);
gulp.task('library', ['library-styles', 'library-scripts', 'library-prepare'], builder.build);
