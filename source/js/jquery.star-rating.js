/* global jQuery */
/**
 * Editable star rating components that play nice with mouse and touch.
 */

(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  'use strict';

  var StarRating = function (element, options) {
    this.options  = options;
    this.$element = $(element);
    this.$target  = this.options.target ? $(this.options.target) : this.$element.find('input');

    if (this.$target.length) {
      var val = this.$target.val();
      if (val !== 'undefined') this.val(val);
    }

    this.$element.on({
      'mouseenter.vse.star-rating': $.proxy(function (event) {
        this.$element.addClass('editing');
        this.setClassFromEvent(event);
        this.$element.on({
          'mousemove.vse.star-rating': $.proxy(this.setClassFromEvent, this)
        });
      }, this),

      'mouseleave.vse.star-rating': $.proxy(function (event) {
        this.$element.off('mousemove.vse.star-rating');
        this.$element.removeClass('editing');
        this.setClassFromVal();
      }, this),

      'click.vse.star-rating': $.proxy(function (event) {
        this.$element.off('mousemove.vse.star-rating');
        this.$element.removeClass('editing');
        this.setValFromEvent(event);
      }, this),

      'touchstart.vse.star-rating': $.proxy(function (event) {
        event.preventDefault();
        this.setClassFromEvent(event);
        this.$element.on({
          'touchmove.vse.star-rating': $.proxy(function (event) {
            event.preventDefault();
            this.setClassFromEvent(event);
          }, this)
        });
      }, this),

      'touchend.vse.star-rating': $.proxy(function (event) {
        event.preventDefault();
        this.$element.off('touchmove.vse.star-rating');
        this.setValFromEvent(event);
      }, this)
    });
  };

  StarRating.DEFAULTS = {
    value: null,
    min: 0,
    max: 5,
    step: 1,
    minOffset: 0.4,
    minClearsValue: true,
    valClassTemplate: 'stars-${rating}',
    valClassDecimal: '-'
  };

  StarRating.prototype.val = function (newVal) {
    if (typeof newVal !== 'undefined') {
      newVal = this.prepVal(parseFloat(newVal));
      if (this.options.minClearsValue && newVal === this.options.min) {
        newVal = null;
      }
      if (newVal !== this.options.value) {
        this.options.value = newVal;
        this.$target.val(newVal);
        this.$target.trigger('change.vse.star-rating');
        this.setClassFromVal();
      }
    }
    return this.options.value;
  };

  StarRating.prototype.setValFromEvent = function (event) {
    return this.val(this.getValFromEvent(event));
  };

  StarRating.prototype.prepVal = function (val) {
    // If less than min or minOffset, return min
    if (val <= Math.max(this.options.min, this.options.minOffset)) {
      return this.options.min;
    }
    // If greater than or equal to max, return max
    if (val >= this.options.max) {
      return this.options.max;
    }
    // Otherwise, round to nearest step
    return Math.ceil(val * (1 / this.options.step)) / (1 / this.options.step);
  };

  StarRating.prototype.getValFromEvent = function (event) {
    var eventX = event.pageX || event.originalEvent.pageX;
    var offset = this.$element.offset();
    var width  = this.$element.outerWidth();
    var ratio  = (eventX - offset.left) / width;

    return this.prepVal(ratio * this.options.max);
  };

  StarRating.prototype.setClassFromVal = function (val) {
    if (typeof val === 'undefined') val = this.val();
    var valString, className, i;
    for (i = this.options.min; i <= this.options.max; i += this.options.step) {
      valString = ('' + i).replace(/\./g, this.options.valClassDecimal);
      className = this.options.valClassTemplate.replace('${rating}', valString);
      this.$element.toggleClass(className, i === val);
    }
  };

  StarRating.prototype.setClassFromEvent = function (event) {
    this.setClassFromVal(this.getValFromEvent(event));
  };

  function Plugin (option) {
    return this.each(function () {
      var $this = $(this);
      var data  = $this.data('vse.star-rating');
      if (!data) {
        var options = $.extend(
          {},
          StarRating.DEFAULTS,
          $this.data(),
          typeof option === 'object' && option
        );
        $this.data('vse.star-rating', new StarRating(this, options));
      }
    });
  }

  $.fn.starRating             = Plugin;
  $.fn.starRating.Constructor = StarRating;

}));
