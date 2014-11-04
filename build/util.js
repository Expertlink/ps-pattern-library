'use strict';

var path     = require('path');
var settings = require('./settings');
var _        = require('underscore');

module.exports = {};

module.exports.patternName = function patternName(filename) {
  // Remove extension
  var name = path.basename(filename, path.extname(filename));
  name = name.replace(settings.files.patternPattern, '');
  name = name.replace(/[_-]/g, ' ');
  // http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
  name = name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  return name;
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