'use strict';

var gulp         = require('gulp');
var settings     = require('../../settings');
var template     = require('gulp-compile-handlebars');
var templateData = require('../templateData');
var rename       = require('gulp-rename');


module.exports = function() {

  return gulp.src(settings.src.patterns)
    .pipe(templateData())
    .pipe(template({'foo' : 'bar'}))
    .pipe(rename({extname: '.html'}))
    .pipe(gulp.dest(settings.dest.patterns));
};
