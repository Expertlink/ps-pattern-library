'use strict';

var fs       = require('fs');
var glob     = require('glob');
var path     = require('path');
var settings = require('./settings');
var dirName  = require('./util').patternName;

var getDirs = function getDirs(fullPath) {
  return fs.readdirSync(fullPath).filter(function(filePath) {
    var resolvedPath = path.resolve(fullPath + '/' + filePath);
    return fs.statSync(resolvedPath).isDirectory();
  });
};
module.exports = function buildNav() {
  var topPath = path.resolve(settings.paths.patterns);
  var topDirs = getDirs(topPath);

  var structure = topDirs.map(function(dir) {
    var resolvedPath = path.resolve(settings.paths.patterns + '/' + dir);
    var contentDirs = getDirs(resolvedPath).filter(function(childDir) {
      var files = fs.readdirSync(path.resolve(settings.paths.patterns + '/' + dir + '/' + childDir));
      return files.length > 0;
    });
    contentDirs = contentDirs.map(function(contentDir) {
      return {
        dir: contentDir,
        name: dirName(contentDir)
      };
    });
    return {
      dir: dir,
      name: dirName(dir),
      children: contentDirs
    };
  });
  structure = structure.filter(function(topDir) {
    return topDir.children.length;
  });

  return structure;
};
