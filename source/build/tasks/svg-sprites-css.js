'use strict';
var gulp      = require('gulp');
var svgSprite = require('gulp-svg-sprite');
var settings  = require('../../../settings');

var config = {
  mode: {
    css: {
      render: {
        scss: {
          template: settings.paths.source + '/build/sprite-template.scss'
        }
      }
    }
  }
};

module.exports = function svgCSSSprites() {
  gulp.src(settings.src.site.sprites.css)
  .pipe(svgSprite(config))
  .pipe(gulp.dest(settings.paths.static));
};
