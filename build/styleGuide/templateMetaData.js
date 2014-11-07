'use strict';

var util            = require('gulp-util');
var marked          = require('marked');
var through         = require('through2');
var path            = require('path');
var _               = require('underscore');
var moment          = require('moment');
var settings        = require('../settings');
var patternFileName = require('./util').patternFileName;
var patternId       = require('./util').patternId;
var escape          = require('escape-html');
var pathRoot        = require('./util').pathRoot;
var metaData        = require('./templateUtil').metaData;

/**
 * This gulp PLUGIN sets reasonable defaults on a file
 * object's meta property (or whatever is passed as options.property)
 * YAML should already have been stripped from the file when it gets here
 */
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
    file[options.property] = metaData(file.path, {
      format: true,
      meta: file[options.property],
      contents: file.contents.toString()
    });
    this.push(file);
    cb();
  });
};
