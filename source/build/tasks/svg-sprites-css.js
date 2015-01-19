'use strict';
var gulp      = require('gulp');
var svgSprite = require('gulp-svg-sprite');
var settings  = require('../../../settings');

var config = {
  mode: {
    css: {
      dest: '',       // Remove default containing 'css' directory
      render: {
        scss: {
          template: settings.paths.source + '/build/sprite-template.scss'
        }
      },
      sprite: 'images/svg-sprite.css.svg'
    }
  }
};

module.exports = function svgCSSSprites() {
  gulp.src(settings.src.site.sprites.css)
  .pipe(svgSprite(config))
  .pipe(gulp.dest(settings.dest.site.build));
};
