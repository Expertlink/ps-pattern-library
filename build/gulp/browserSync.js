'use strict';

var browserSync = require('browser-sync');
var settings    = require('../settings');

module.exports = function() {
  browserSync({
    server: {
      baseDir: settings.paths.static
    },
    notify: false
  });
};
