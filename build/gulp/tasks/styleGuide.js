'use strict';

var fs = require('fs');
var path = require('path');
var merge = require('merge-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var glob   = require('glob');
var findup = require('findup');
var wrap   = require('gulp-wrap');
var settings = require('../../settings');
var templateData = require('../templateData');
var template  = require('../handlebarsCompile');


module.exports =  function() {
  var dirs = glob.sync('./source/patterns/**/*').filter(function(filePath) {
    return fs.statSync(filePath).isDirectory();
  });
  var tasks = dirs.map(function(dirPath) {
    var templateFile = findup.sync(path.resolve(dirPath), 'index.template') + '/index.template';
    var destPath     = dirPath.replace('./source/patterns/', '');
    return gulp.src(dirPath + '/*.hbs')
      .pipe(templateData({ dataDir: settings.paths.data }))
      .pipe(template({},{ partialsDir: settings.paths.partials }))
      .pipe(concat('index.html'))
      .pipe(wrap({src: templateFile}))
      .pipe(gulp.dest('./static/patterns-test/' + destPath));

  });

  return merge(tasks);
};
