'use strict';

var gulp       = require('gulp');
var settings   = require('../settings');
var template   = require('gulp-compile-handlebars');
var rename     = require('gulp-rename');

var templateData = {'foo' : 'bar'};

module.exports = function() {

  return gulp.src(settings.src.patterns)
    .pipe(template(templateData))
    .pipe(rename({extname: '.html'}))
    .pipe(gulp.dest(settings.dest.patterns));
};
