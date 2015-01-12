/* global Buffer, console */
/**
* Strip inline <script> elements and push each
* <script> tag's contents to `file.scripts`
* (Array; each element is the contents of a script element)
*/
'use strict';
var through = require('through2');
var gutil   = require('gulp-util');
var cheerio = require('cheerio');

module.exports = function gulpStripScripts(opts) {

  opts = opts || {};
  opts.property = opts.property || 'scripts';

  return through.obj(function(file, enc, cb) {
    var $, content;

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('stripScripts', 'Streaming not supported'));
      return;
    }

    content = file.contents.toString();

    try {
      $ = cheerio.load(content);
    } catch (e) {
      console.warn(e);
      return;
    }
    file[opts.property] = (typeof file[opts.property] !== 'undefined' &&
                           Array.isArray(file[opts.property])) ? file[opts.property] : [];
    $('script').each(function(i, elem) {
      if (!$(elem).attr('src')) { // Don't strip external scripts
        var scriptContent = $(elem).text();
        file.scripts.push(scriptContent);
        content = content.replace($(elem).toString(), '');
      }
    });
    
    file.contents = Buffer(content);
    this.push(file);
    cb();
  });
};
