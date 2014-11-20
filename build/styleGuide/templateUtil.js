'use strict';
var path        = require('path');

var escape = require('escape-html');
var findup = require('findup');
var marked = require('marked');
var moment = require('moment');
var _      = require('underscore');

var settings    = require('../settings');
var navigation  = require('./navigation');
var util        = require('./util');

module.exports.pathData        = function pathData(dirPath) {
  var nav     = navigation.buildNav(dirPath);
  var root    = util.pathRoot(dirPath, settings.paths.patterns);
  var dirName = util.patternName(dirPath.split('/').pop());
  dirName = (dirName === 'Patterns') ? 'Welcome' : dirName;
  return {
    pathRoot     : root,
    dirName      : dirName,
    nav          : nav
  };
};

module.exports.pathTemplates = function pathTemplates(dirPath) {
  return {
    templateFile : findup.sync(path.resolve(dirPath), '__INDEX.template') + '/__INDEX.template',
    patternFile  : findup.sync(path.resolve(dirPath), '__PATTERN.template') + '/__PATTERN.template'
  };
};

/**
 * Munge and extend template metadata
 */
module.exports.metaData = function metaData(filePath, options) {
  var defaults = {},
      data     = {};
  options = _.extend({
    format: false,        // Prepare for rendering with extra metadata
    meta:   {},            // existing metadata
    contents: ''          // File Contents
  }, options || {});

  defaults = {
    compileTime:    moment().format(settings.dateFormat),
    description:    '',
    filename   :    path.basename(filePath),
    id         :    util.patternId(filePath),
    link       :    path.basename(filePath, path.extname(filePath)) + '.html',
    name       :    util.patternFileName(filePath),
    status     :    'none'
  };

  if (options.format) {
    defaults.showHeading = true;
    defaults.showSource = true;
    defaults.isPattern  = true;
  }

  data = _.defaults(options.meta, defaults);
  if (options.format) {
    data.description = marked(data.description);
    if (options.contents) {
      data.source = escape(options.contents).trim();
    }
  }
  return data;
};
