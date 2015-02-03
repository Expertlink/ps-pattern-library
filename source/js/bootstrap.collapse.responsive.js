/* global jQuery, window, document */
'use strict';
/**
 * A rif on bootstrap's collapse. On the first
 * click on a collapse-trigger (elements w/
 * data-responsive-collapse), determine whether
 * the associated content element should be treated
 * as a collapsible toggle or not based on its
 * current visibility.
 *
 */

 (function( $, window, document, undefined ){

  // our plugin constructor
  var Plugin = function( elem, options ) {
    this.elem    = elem;
    this.$elem   = $(elem);
    this.options = options;
  };

  var _getTargetElem = function($elem) {
    return $elem.data('target') || $elem.attr('href');
  };
  var isToggle = function($elem) {
    var targetElem     = _getTargetElem($elem);
    var $hiddenTargets = $(targetElem + ':hidden');
    if (targetElem && $hiddenTargets.length) {
      return true;
    }
    return false;
  };
  var enableToggle = function($elem) {
    var targetElem = _getTargetElem($elem);
    var $hiddenTargets = $(targetElem + ':hidden');
    $elem.toggleClass('collapsed');
    $hiddenTargets.collapse('show');
    $elem.on('click.toggle-trigger', function(event) {
      event.preventDefault();
      $hiddenTargets.collapse('toggle');
      $(this).toggleClass('collapsed');
    });
  };
  var disableToggle = function($elem) {
    // Default behavior to "do nothing"
    $elem.on('click.toggle-trigger', function(event) {
      event.preventDefault();
    });
  };

  Plugin.prototype = {
    defaults: {
      isToggle      : isToggle,
      enableToggle  : enableToggle,
      disableToggle : disableToggle
    },
    init: function() {
      // Introduce defaults that can be extended either
      // globally or using an object literal.
      this.config = $.extend({}, this.defaults, this.options);
      this.$elem.off('click.toggle-trigger');
      this.$elem.one('click', function(event) {
        event.preventDefault();
        if (this.config.isToggle(this.$elem)) {
          this.config.enableToggle(this.$elem);
        } else {
          this.config.disableToggle(this.$elem);
        }
      });

      return this;
    }
  };

  Plugin.defaults = Plugin.prototype.defaults;

  $.fn.responsiveCollapse = function(options) {
    return this.each(function() {
      new Plugin(this, options).init();
    });
  };
  $(function() {
    $('[data-responsive-toggle="collapse"]').responsiveCollapse();
  });

})( jQuery, window , document );
