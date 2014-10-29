'use strict';

var gulp         = require('gulp');
var settings     = require('../../settings');
var template     = require('../handlebarsCompile');
var templateData = require('../templateData');
var rename       = require('gulp-rename');

module.exports = function() {

  return gulp.src(settings.src.patterns)
    .pipe(templateData({ dataDir: settings.paths.data }))
    .pipe(template({'foo' : 'bar'},
                   { partialsDir: settings.paths.partials }))
    .pipe(rename({extname: '.html'}))
    .pipe(gulp.dest(settings.dest.patterns));
};
