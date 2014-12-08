/* global Buffer */
'use strict';
var gutil        = require('gulp-util'),
    through      = require('through2'),
    Handlebars   = require('handlebars'),
    frontMatter  = require('front-matter'),
    fs           = require('fs'),
    path         = require('path'),
    settings     = require('../settings'),
    templateUtil = require('./templateUtil'),
    _            = require('underscore');

module.exports = function (data, opts) {

  var options = _.extend({
    extension: '.hbs'
  }, opts || {});

  var namePattern = new RegExp(settings.files.patternsPattern, 'g'),

  parsePartials = function(partialDir) {
    var partialFilenames = fs.readdirSync(partialDir);

    partialFilenames.forEach(function(filename) {
      var partial = partialDir + '/' + filename,
          stats   = fs.statSync(partial),
          content, template;
      if (stats && stats.isDirectory()) {
        parsePartials(partial, partialDir + '/' + filename);
      } else if (path.extname(filename) === options.extension) {
        template  = fs.readFileSync(partial, 'utf8');
        content   = frontMatter(template); // Strip out any YAML front matter. @TODO Review
        Handlebars.registerPartial(templateUtil.templateKey(partialDir + '/' + filename), content.body);
      }
    });
  };

  if (options.partialsDir) {
    parsePartials(options.partialsDir);
  }

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
          template     = Handlebars.compile(fileContents),
          context      = _.extend(file.data || {}, data);
      file.contents = new Buffer(template(context));
    } catch (err) {
      this.emit('error', new gutil.PluginError('Handlebars Compile', err));
    }

    this.push(file);
    cb();
  });
};
