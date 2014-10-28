'use strict';

var gulp         = require('gulp');
var settings     = require('../../settings');
var template     = require('../handlebarsCompile');
var templateData = require('../templateData');
var rename       = require('gulp-rename');

module.exports = function() {

  return gulp.src(settings.src.patterns)
    .pipe(templateData({dataDir: './source/data'}))
    .pipe(template({'foo' : 'bar'}, {partialsDir: './source/patterns'}))
    .pipe(rename({extname: '.html'}))
    .pipe(gulp.dest(settings.dest.patterns));
};
