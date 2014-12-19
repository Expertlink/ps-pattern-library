/* global Buffer */
/**
 * Gulp plugin to register partials and helpers,
 * and also to compile templates (with handlebars).
 * Context comes from `file.data` on streamed files.
 * @TODO Any way to remove YAML coupling?
 */
'use strict';

var gutil       = require('gulp-util'),
    through     = require('through2'),
    frontMatter = require('front-matter'),
    Handlebars  = require('handlebars'),
    fs          = require('fs'),
    path        = require('path'),
    _           = require('underscore'),
    settings    = require('../../settings'),
    templateUtil = require('./library-template-util');

module.exports = function (data, opts) {

  var options = _.extend({
    extension: '.hbs',
    Handlebars: Handlebars // Allows use of a particular Handlebars instance, optionally
  }, opts || {});

  var namePattern = new RegExp(settings.files.patternsPattern, 'g');

  if (options.helpers) {
    for (var helper in options.helpers) {
      Handlebars.registerHelper(helper, options.helpers[helper]);
    }
  }

  data            = data || {};

  return through.obj(function (file, enc, cb) {

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('Handlebars Compile', 'Streaming not supported'));
      return cb();
    }

    try {
      var fileContents = file.contents.toString(),
          template     = options.Handlebars.compile(fileContents),
          context      = _.extend(file.data || {}, data);
      file.contents = new Buffer(template(context));
    } catch (err) {
      this.emit('error', new gutil.PluginError('Handlebars Compile', err));
    }

    this.push(file);
    cb();
  });
};
