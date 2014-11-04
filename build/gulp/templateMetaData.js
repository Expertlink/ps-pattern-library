'use strict';

var util   = require('gulp-util'),
  through  = require('through2'),
  path     = require('path'),
  fs       = require('fs'),
  _        = require('underscore'),
  settings = require('../settings');

module.exports = function (options) {
  options = _.extend({
    property: 'meta'
  }, options || {});
  return through.obj(function (file, enc, cb) {
    var jsonData = {},
        relPath, absPath;

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new util.PluginError('Template Data', 'Streaming not supported'));
      return cb();
    }

    file[options.property] = _.extend({
      name: 'Foo',
      description: ''
    }, file.meta || {});


    this.push(file);
    cb();
  });
};
