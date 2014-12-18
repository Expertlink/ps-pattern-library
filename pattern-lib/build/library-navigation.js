/**
 * Generates a navigation object for the
 * pattern library. Can be used by templates, etc.
 */
'use strict';

var fs       = require('fs');
var glob     = require('glob');
var path     = require('path');
var settings = require('../../settings');
var util     = require('./library-util');

/* For a given fully-resolved path, return any directories in it */
var getDirs = function getDirs(fullPath) {
  return fs.readdirSync(fullPath).filter(function(filePath) {
    var resolvedPath = path.resolve(fullPath + '/' + filePath);
    return fs.statSync(resolvedPath).isDirectory();
  });
};

module.exports.buildNav = function buildNav(currentDir) {
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
     * These are the actual nav elements here.
     */
    contentDirs = contentDirs.map(function(contentDir) {
      var link = dir + '/' + contentDir;
      return {
        dir: link,
        name: util.patternName(contentDir),
        isCurrent: (link === util.pathName(currentDir))
      };

    });
    /**
     * Back to the heading-level directories. Flesh out the objects
     * for those as well.
     */
    return {
      dir      : dir,
      name     : util.patternName(dir),
      children : contentDirs
    };

  });
  /**
   * Prune any heading-level directories that have no children.
   */
  structure = structure.filter(function(topDir) {
    return topDir.children.length;
  });

  /**
   * Are we on the landing page?
   */
  structure.isHome = (currentDir === settings.paths.patterns);

  return structure;
};
