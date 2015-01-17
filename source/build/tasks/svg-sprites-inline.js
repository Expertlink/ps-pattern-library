'use strict';
var gulp      = require('gulp');
var settings  = require('../../../settings');
var svgSprite = require('gulp-svg-sprite');

var svgInlineConfig = {
  mode: {
    symbol: {}
  }
};

module.exports = function svgInlineSprites() {
  gulp.src(settings.src.site.sprites.inline)
  .pipe(svgSprite(svgInlineConfig))
  .pipe(gulp.dest(settings.dest.site.sprites));
};
