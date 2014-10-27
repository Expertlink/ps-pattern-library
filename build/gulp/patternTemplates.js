'use strict';

var gulp       = require('gulp');
var template   = require('gulp-compile-handlebars');
var rename     = require('gulp-rename');

var templateData = {'foo' : 'bar'};

module.exports = function() {

  return gulp.src('./source/patterns/**/*.hbs')
    .pipe(template(templateData))
    .pipe(rename({extname: '.html'}))
    .pipe(gulp.dest('./static'));
};
