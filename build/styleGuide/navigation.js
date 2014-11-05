'use strict';

var fs       = require('fs');
var glob     = require('glob');
var path     = require('path');
var settings = require('../settings');
var dirName  = require('./util').patternName;

/* For a given fully-resolved path, return any directories in it */
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
    /**
     * Get the immediate child dirs of the top dir. These are
     * considered the "heading" level. Ignore any that don't have
     * any files in them.
     */
    var contentDirs = getDirs(resolvedPath).filter(function(childDir) {
      var files = fs.readdirSync(path.resolve(settings.paths.patterns + '/' + dir + '/' + childDir));
      return files.length > 0;
    });
    /**
     * Flesh out the information object about each of these content dirs
     */
    contentDirs = contentDirs.map(function(contentDir) {
      return {
        dir: dir + '/' + contentDir,
        name: dirName(contentDir)
      };
    });
    /**
     * Back to the heading-level directories. Flesh out the objects
     * for those as well.
     */
    return {
      dir      : dir,
      name     : dirName(dir),
      children : contentDirs
    };
  });
  /**
   * Prune any heading-level directories that have no children.
   */
  structure = structure.filter(function(topDir) {
    return topDir.children.length;
  });
  return structure;
};
