/* global Buffer */
'use strict';
var gutil      = require('gulp-util'),
    through    = require('through2'),
    Handlebars = require('handlebars'),
    fs         = require('fs'),
    path       = require('path'),
    settings   = require('../settings'),
    _          = require('underscore');

module.exports = function (data, opts) {

  var options = _.extend({
    extension: '.hbs'
  }, opts || {});
  var namePattern = new RegExp(settings.files.patternsPattern, 'g');
  data        = data || {};

  var parsePartials = function(partialDir) {
    var partialFilenames = fs.readdirSync(partialDir),
        keyDir           = partialDir.split('/').pop();

    partialFilenames.forEach(function(filename) {
      var partial = partialDir + '/' + filename,
          stats   = fs.statSync(partial),
          key, name, template;
      if (stats && stats.isDirectory()) {
        parsePartials(partial, partialDir + '/' + filename);
      } else if (path.extname(filename) === options.extension) {
        name      = path.basename(filename, options.extension);
        key       = (keyDir + '/' + name).replace(namePattern, '');
        template  = fs.readFileSync(partial, 'utf8');
        Handlebars.registerPartial(key, template);
      }
    });
  };

  if (options.partialsDir) {
    parsePartials(options.partialsDir);
  }

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
