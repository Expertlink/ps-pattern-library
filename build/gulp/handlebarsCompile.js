/* global Buffer */
'use strict';
var gutil      = require('gulp-util'),
    through    = require('through2'),
    Handlebars = require('handlebars'),
    fs         = require('fs'),
    _          = require('underscore');

module.exports = function (data, opts) {

  var options = opts || {};
  data        = data || {};

  return through.obj(function (file, enc, cb) {

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('Handlebars Compile', 'Streaming not supported'));
      return cb();
    }

    try {
      var fileContents = file.contents.toString();
      var template = Handlebars.compile(fileContents);
      var context = file.data || {};
      context = _.extend(context, data);
      file.contents = new Buffer(template(context));
    } catch (err) {
      this.emit('error', new gutil.PluginError('Handlebars Compile', err));
    }

    this.push(file);
    cb();
  });
};
