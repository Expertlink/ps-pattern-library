'use strict';

var util            = require('gulp-util');
var through         = require('through2');
var path            = require('path');
var _               = require('underscore');
var moment          = require('moment');
var settings        = require('../settings');
var patternFileName = require('./util').patternFileName;
var patternId       = require('./util').patternId;
var escape          = require('escape-html');
var pathRoot        = require('./util').pathRoot;

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
      name        : patternFileName(file.path),
      filename    : path.basename(file.path),
      compileTime : moment().format(settings.dateFormat),
      link        : path.basename(file.path, '.hbs') + '.html',
      description : '',
      id          : patternId(file.path),
      showHeading : true,
      showSource  : true,
      source      : escape(file.contents.toString())
    }, file.meta || {});
    this.push(file);
    cb();
  });
};
