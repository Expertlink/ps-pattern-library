/* global jQuery, window, document */
/**
 * A rif on bootstrap's collapse. On the first
 * click on a collapse-trigger (elements w/
 * data-responsive-collapse), determine whether
 * the associated content element should be treated
 * as a collapsible toggle or not based on its
 * current visibility.
 *
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

  var Plugin = function( elem, options ) {
    this.elem    = elem;
    this.$elem   = $(elem);
    this.options = options;
  };

  var _getTargetElem = function($trigger) {
    var href;
    var target = $trigger.attr('data-target') ||
                 (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7
    return target;
  };
  // Default test for whether something should be a toggle
  var isToggle = function($elem) {
    var targetElem     = _getTargetElem($elem);
    var $hiddenTargets = $(targetElem + ':hidden');
    if (targetElem && $hiddenTargets.length) {
      return true;
    }
    return false;
  };
  // Default enable callback
  // Some of this is pulled from collapse.js's initialization
  var enableToggle = function(config) {
    var $elem          = this.$elem;
    var targetElem     = _getTargetElem($elem);
    var $hiddenTargets = $(targetElem + ':hidden');
    var data           = $hiddenTargets.data('bs.collapse');
    var option         = data ? 'toggle' : $.extend({}, $elem.data(), { trigger: this.elem, show: true });

    $.fn.collapse.call($hiddenTargets, option);

    $elem.on('click.toggle-trigger', function(event) {
      $hiddenTargets.collapse('toggle');
      event.preventDefault();
    });
  };
  // Default disable callback
  var disableToggle = function(config) {
    // Default behavior to "do nothing"
    // This allows there to be `href` attributes
    this.$elem.on('click.toggle-trigger', function(event) {
      event.preventDefault();
    });
  };
  // Behavior on "first" click of trigger
  // Default to "do nothing" and squelch click event
  var onInit = function(event) {
    event.preventDefault();
  };

  Plugin.prototype = {
    defaults: {
      isToggle      : isToggle,
      enableToggle  : enableToggle,
      disableToggle : disableToggle,
      onInit        : onInit
    },
    init: function() {
      var config = $.extend({}, this.defaults, this.options);
      this.$elem.off('click.toggle-trigger');
      if (config.isToggle(this.$elem)) {
        config.enableToggle.call(this, config);
      } else {
        config.disableToggle.call(this, config);
      }
      if (typeof config.onInit === 'function') {
        config.onInit.call(this, event);
      }
      return this;
    }
  };

  Plugin.defaults = Plugin.prototype.defaults;

  $.fn.responsiveCollapse = function(options) {
    return this.each(function() {
      $(this).one('click', function() { // Lazy init
        new Plugin(this, options).init();
      });
    });
  };
  $(function() {
    $(document).off('.collapse.data-api');
    // Reattach default bootstrap handling, but only
    // for a subset. This requires fully re-defining what
    // it was doing as there is no API-supported way to inspect
    // event handlers in modern versions of jQuery.
    $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]:not([data-responsive])', function (e) {
      var $this   = $(this);

      if (!$this.attr('data-target')) e.preventDefault();
      var $target = $(_getTargetElem($this));
      var data    = $target.data('bs.collapse');
      var option  = data ? 'toggle' : $.extend({}, $this.data(), { trigger: this });
      $.fn.collapse.call($target, option);
    });
  });

}));
