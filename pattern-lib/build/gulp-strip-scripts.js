/* global Buffer */
'use strict';
var through = require('through2');
var gutil   = require('gulp-util');
var cheerio = require('cheerio');

module.exports = function gulpStripScripts() {
  // Do some stuff here if you want
  return through.obj(function(file, enc, cb) {
    var $, content;
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('myPlugin', 'Streaming not supported'));
      return;
    }

    content = file.contents.toString();
    file.scripts = file.scripts || [];
    try {
      $ = cheerio.load(content);
    } catch (e) {
      console.log(e);
      return;
    }
    $('script').each(function(i, elem) {
      if (!$(elem).attr('src')) {
        var scriptContent = $(elem).text();
        file.scripts.push(scriptContent);
        content = content.replace($(elem).text(), '');
      }
    });
    content = content.replace(/<script><\/script>/g, '');
    file.contents = Buffer(content);

    // Do stuff
    this.push(file);
    cb();
  });
};
