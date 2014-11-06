'use strict';

var path     = require('path');
var settings = require('../settings');
var _        = require('underscore');

module.exports = {};

function formatName(name) {
  name = name.replace(/\d{1,4}-?/, '');
  name = name.replace(/[_-]/g, ' ');
  // http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
  name = name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  return name;
}

module.exports.patternName = function patternName(name) {
  return formatName(name);
};

module.exports.patternFileName = function patternFileName(filename) {
  // Remove extension
  var name = path.basename(filename, path.extname(filename));
  return formatName(name);
};

module.exports.pathName = function pathName(dir) {
  return dir.replace(/\.\/source\/patterns\/?/, '');
};

module.exports.pathRoot = function pathRoot(dirPath, rootPath) {
  var relative =  path.relative(path.resolve(dirPath), path.resolve(rootPath));
  return relative || '.';
};

module.exports.patternId = (function() {
  var ids = {};
  return function patternId(filename) {
    if (typeof ids[filename] !== 'undefined') {
      return ids[filename];
    }
    ids[filename] = _.uniqueId('pattern_');
    return ids[filename];
  };
}());
