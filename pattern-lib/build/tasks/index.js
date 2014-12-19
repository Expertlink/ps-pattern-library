/* global console */
'use strict';

var gulp     = require('gulp');
var settings = require('../../../settings');

gulp.task('library-styles', require('./library-styles'));
gulp.task('library-scripts', require('./library-scripts'));
gulp.task('library', ['library-styles', 'library-scripts'], require('../gulp-library-build'));
