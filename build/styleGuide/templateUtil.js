'use strict';
var path    = require('path');

var findup   = require('findup');

var navigation  = require('./navigation');
var settings    = require('../settings');
var pathRoot    = require('./util').pathRoot;
var patternName = require('./util').patternName;



module.exports.registerPartial = function registerPartial(filename) {};

module.exports.pathData        = function pathData(dirPath) {
  var nav = navigation.buildNav(dirPath);
  var root = pathRoot(dirPath, settings.paths.patterns);
  var dirName = patternName(dirPath.split('/').pop());
  dirName = (dirName === 'Patterns') ? 'Welcome' : dirName;
  return {
    templateFile : findup.sync(path.resolve(dirPath), '__INDEX.template') + '/__INDEX.template',
    patternFile  : findup.sync(path.resolve(dirPath), '__PATTERN.template') + '/__PATTERN.template',
    pathRoot     : root,
    name         : dirName,
    nav          : nav
  };
};
