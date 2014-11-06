'use strict';

var gulp             = require('gulp');

// node
var fs               = require('fs');

// npm
var glob             = require('glob');
var merge            = require('merge-stream');

// npm gulp-*
var concat           = require('gulp-concat');
var frontMatter      = require('gulp-front-matter');
var gulpif           = require('gulp-if');
var rename           = require('gulp-rename');
var wrap             = require('gulp-wrap');

// local
var templateData     = require('./templateData');
var templateMetaData = require('./templateMetaData');
var template         = require('./handlebarsCompile');
var templateUtil     = require('./templateUtil');
var util             = require('./util');

var settings         = require('../settings');
var templateHelpers  = require('../../' + settings.paths.patterns + '/templateHelpers');

module.exports =  function() {

  /* Glob and traverse directories and filter to only directories (not files) */
  var dirs = glob.sync(settings.src.patternDirs).filter(function(filePath) {
    return fs.statSync(filePath).isDirectory();
  });

  dirs.push(settings.paths.patterns); // Add the top-level patterns directory

  var styleStream = function(dirPath, isPatternPage) {
    // Find nearest index.template, going up.
    var pathData        = templateUtil.pathData(dirPath);
    var destPath        = util.pathName(dirPath);
    var templateContext = {
      nav      : pathData.nav,
      pathRoot : pathData.pathRoot,
      dirName : pathData.name
    };
    var templateOptions = {
      partialsDir: settings.paths.partials,
      helpers    : templateHelpers
    };

    return gulp.src([dirPath + '/*.hbs', '!' + dirPath + '/_*.hbs'])
      // Convert YAML front matter into file property (meta)
      .pipe(frontMatter({
        property: 'meta',
        remove: true
      }))
      // Get template data for this template
      .pipe(templateData({ dataDir: settings.paths.data }))
      // compile the template
      .pipe(template(templateContext, templateOptions))
      // Process template metadata
      .pipe(templateMetaData())
      // Wrap each pattern with the nearest pattern template
      .pipe(gulpif(isPatternPage, wrap({src: pathData.patternFile})))
      // Concat all compiled, wrapped patterns in this dir into a single output file
      .pipe(gulpif(isPatternPage, concat('index.html')))
      // Wrap concatenated patterns in nearest index template
      .pipe(gulpif(isPatternPage, wrap({src: pathData.templateFile}, pathData)))
      // Compile the index template as hbs
      .pipe(gulpif(isPatternPage, template(templateContext, templateOptions)))
      // And done.
      .pipe(gulpif(!isPatternPage, rename({extname: '.html'}))) // Only in the "pages" dirs
      .pipe(gulp.dest(settings.dest.patterns + '/' + destPath));
  };

  /**
   * Lightly based on this recipe:
   * https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md
   * We need to create streams for the operations we're going to take on each
   * directory full of pattern files.
   */
  var patternPages = dirs.map(function(dirPath) {
    // Note that a few steps below will not take place if this
    // is not a pattern page—that is, if it is a composed "page"
    // in the pages directory
    var isPatternPage = util.isPatternPage(dirPath);

    var patternStream = styleStream(dirPath, isPatternPage);
    if (!isPatternPage) {
      return(merge(patternStream, styleStream(dirPath, true)));
    } else {
      return patternStream;
    }
  });

  /**
   * There will be one element in `tasks` for each directory
   * in the nested directory structure of patterns, and it is
   * an individual stream. Merge
   * all of these tasks streams into one stream and return.
   */
  return merge(patternPages);
};
