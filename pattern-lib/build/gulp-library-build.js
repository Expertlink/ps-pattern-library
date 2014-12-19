'use strict';

var gulp             = require('gulp');

// node
var fs               = require('fs');

// npm
var glob             = require('glob');
var merge            = require('merge-stream');
var through          = require('through2');

// npm gulp-*
var concat           = require('gulp-concat');
var frontMatter      = require('gulp-front-matter');
var gulpif           = require('gulp-if');
var rename           = require('gulp-rename');
var wrap             = require('gulp-wrap');

// local
var templateData     = require('./gulp-template-data');
var templateMetaData = require('./gulp-library-metadata');
var template         = require('./gulp-library-template');
var templateUtil     = require('./library-template-util');
var util             = require('./library-util');

var settings         = require('../../settings');
var templateHelpers  = require('../../' + settings.paths.patterns + '/templateHelpers');

var Handlebars       = require('handlebars');

module.exports.prepare = function() {
  return gulp.src(settings.src.patterns)
    .pipe(frontMatter({
      property: 'meta',
      remove: true
    }))
    .pipe(through.obj(function (file, enc, cb) {
      var templateKey;
      if (file.isNull()) {
        this.push(file);
        return cb();
      }
      templateKey = templateUtil.templateKey(file.path);
      Handlebars.registerPartial(templateKey, file.contents.toString());
      this.push(file);
      cb();
    }));
};

module.exports.build =  function() {

  /* Glob and traverse directories and filter to only directories (not files) */
  var dirs = glob.sync(settings.src.patternDirs).filter(function(filePath) {
    return fs.statSync(filePath).isDirectory();
  });

  dirs.push(settings.paths.patterns); // Add the top-level patterns directory

  /**
   * Build out the style guide for the directory dirPath.
   *
   * @param {string} dirPath
   * @param {Boolean} isPatternPage   Should this path be treated
   *                                  as one containing patterns to be
   *                                  wrapped and indexed?
   * @return Vinyl stream
   */
  var styleStream = function(dirPath, isPatternPage) {
    // Build context for this directory and its files
    var templateContext = templateUtil.pathData(dirPath);
    var pathTemplates   = templateUtil.pathTemplates(dirPath);
    var destPath        = util.pathName(dirPath);

    var templateOptions = {
      partialsDir: settings.paths.partials,
      helpers    : templateHelpers,
      Handlebars : Handlebars
    };

    // Note several of the following steps are conditional upon isPatternPage
    return gulp.src([dirPath + '/*.hbs', '!' + dirPath + '/_*.hbs'])
      // Convert YAML front matter into file property (meta)
      .pipe(frontMatter({
        property: 'meta',
        remove: true
      }))
      // Get template context data for this template
      .pipe(templateData({ dataDir: settings.paths.data, localDataDir: settings.paths.partials }))
      // compile the individual template
      .pipe(template(templateContext, templateOptions))
      // Process template metadata
      .pipe(templateMetaData())
      // Wrap each pattern with the nearest pattern template (if pattern dir)
      .pipe(gulpif(isPatternPage, wrap({src: pathTemplates.patternFile})))
      // Concat all compiled, wrapped patterns in this dir into a single output file (if pattern dir)
      .pipe(gulpif(isPatternPage, concat('index.html')))
      // Wrap concatenated patterns in nearest index template (if pattern dir)
      .pipe(gulpif(isPatternPage, wrap({src: pathTemplates.templateFile}, templateContext)))
      // Compile the index template as hbs (if pattern dir)
      .pipe(gulpif(isPatternPage, template(Handlebars, templateContext, templateOptions)))
      // And done.
      .pipe(gulpif(!isPatternPage, rename({extname: '.html'}))) // Only in the "pages" dirs
      .pipe(gulp.dest(settings.dest.patterns + '/' + destPath));
  };

  /**
   * Lightly based on this recipe:
   * https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md
   * We need to create streams for the operations we're going to take on each
   * directory full of pattern files.
   *
   * Constructs an array of streams
   */
  var patternPages = dirs.map(function(dirPath) {
    // Note that a few steps below will not take place if this
    // is not a pattern page—that is, if it is a composed "page"
    // in the pages directory
    var isPatternPage = util.isPatternPage(dirPath);

    var patternStream = styleStream(dirPath, isPatternPage);
    if (!isPatternPage) {
      // Page/templates/composed things need to go through the style
      // building process twice: Once to generate HTML output for the
      // Individual templates (NOT wrapping them with __INDEX or
      // __PATTERN), and then again as if they were pattern pages,
      // to get an index file generated.
      // Explicitly set isPatternPage argument to true; merge into
      // previous stream
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
