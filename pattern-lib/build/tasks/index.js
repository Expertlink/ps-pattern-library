/* global console */
'use strict';

var gulp     = require('gulp');
var settings = require('../../../settings');

gulp.task('library', ['library-styles', 'library-scripts'], require('../gulp-library-build'));
