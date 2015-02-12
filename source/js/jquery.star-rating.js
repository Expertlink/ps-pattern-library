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

  // CONSTRUCTOR
  // ===========

  var StarRating = function (element, options) {
    this.options   = options;
    this.$element  = $(element);
    this.$target   = (this.options.target) ? $(this.options.target) : this.$element;
    this.isEditing = null;

    // Update value and appearance
    this.setValue(this.$target.is('[value]') ? this.$target.val() : this.options.value, true);

    // Bind events
    this.$element.on({
      'mouseenter.vse.star-rating': $.proxy(this.mouseEnterHandler, this),
      'mouseleave.vse.star-rating': $.proxy(this.mouseLeaveHandler, this),
      'click.vse.star-rating':      $.proxy(this.clickHandler, this),
      'touchstart.vse.star-rating': $.proxy(this.touchStartHandler, this),
      'touchend.vse.star-rating':   $.proxy(this.touchEndHandler, this)
    });
  };

  StarRating.DEFAULTS = {
    value: null,

    max:  5,
    step: 1,

    snapToZero: 0.5,
    zeroValue:  null,

    classTemplate: 'stars-${rating}',
    classDecimal:  '-',
    editingClass:  'editing'
  };

  StarRating.prototype.setValue = function (value, forceUpdate) {
    if (!$.isNumeric(value)) return;
    value = this.cleanValue(value, this.options.zeroValue);

    if (value !== this.options.value || forceUpdate) {
      this.options.value = value;
      this.$target.val( (value === null) ? '' : value);
      this.updateAppearance();
      this.$target.trigger('change.vse.star-rating');
    }
  };

  StarRating.prototype.cleanValue = function (value, zeroValue) {
    // If not a number, make it a number
    if (typeof value !== 'number') {
      value = parseFloat(value);
    }
    // If zero or close enough to snap to zero, set to zero
    if (value <= Math.max(0, this.options.snapToZero)) {
      value = 0;
    }
    // If greater than or equal to max, cap off at max
    else if (value >= this.options.max) {
      value = this.options.max;
    }
    // Otherwise, round up to nearest step
    else {
      value = Math.ceil(value * (1 / this.options.step)) / (1 / this.options.step);
    }
    // If zeroValue is provided, replace zero with that
    if (value === 0 && typeof zeroValue !== 'undefined') {
      value = zeroValue;
    }
    return value;
  };

  StarRating.prototype.updateAppearance = function (value) {
    // if value is not defined...
    if (typeof value === 'undefined') {
      // ...use the stored value or assume zero
      value = this.options.value || 0;
    }

    // editing class to preview rating state
    this.$element.toggleClass('editing', !!this.isEditing);

    // toggle step-specific class names
    var valueString, className, i;
    for (i = 0; i <= this.options.max; i += this.options.step) {
      valueString = ('' + i).replace(/\./g, this.options.classDecimal);
      className = this.options.classTemplate.replace('${rating}', valueString);
      this.$element.toggleClass(className, i === value);
    }
  };

  StarRating.prototype.eventToValue = function (event) {
    var eventX = event.pageX || event.originalEvent.pageX;
    var offset = this.$element.offset();
    var width  = this.$element.outerWidth();
    var ratio  = (eventX - offset.left) / width;

    return this.cleanValue(ratio * this.options.max);
  };

  // EVENT HANDLERS
  // ==============

  StarRating.prototype.mouseEnterHandler = function (event) {
    this.isEditing = true;
    this.updateAppearance(this.eventToValue(event));
    this.$element.on('mousemove.vse.star-rating', $.proxy(this.mouseMoveHandler, this));
  };

  StarRating.prototype.mouseMoveHandler = function (event) {
    this.updateAppearance(this.eventToValue(event));
  };

  StarRating.prototype.mouseLeaveHandler = function (event) {
    this.$element.off('mousemove.vse.star-rating');
    this.isEditing = false;
    this.updateAppearance();
  };

  StarRating.prototype.clickHandler = function (event) {
    this.$element.off('mousemove.vse.star-rating');
    this.isEditing = false;
    this.setValue(this.eventToValue(event));
  };

  StarRating.prototype.touchStartHandler = function (event) {
    event.preventDefault(); // disable mouse emulation
    this.updateAppearance(this.eventToValue(event));
    this.$element.on('touchmove.vse.star-rating', $.proxy(this.touchMoveHandler, this));
  };

  StarRating.prototype.touchMoveHandler = function (event) {
    event.preventDefault(); // disable mouse emulation
    this.updateAppearance(this.eventToValue(event));
  };

  StarRating.prototype.touchEndHandler = function (event) {
    event.preventDefault(); // disable mouse emulation
    this.$element.off('touchmove.vse.star-rating');
    this.setValue(this.eventToValue(event));
  };

  // PLUGIN
  // ======

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
