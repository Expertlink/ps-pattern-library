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

 (function( $, window, document, undefined ){
  'use strict';

  var Plugin = function( elem, options ) {
    this.elem    = elem;
    this.$elem   = $(elem);
    this.options = options;
  };

  var _getTargetElem = function($elem) {
    return $elem.data('target') || $elem.attr('href');
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
  var enableToggle = function(config) {
    var $elem          = this.$elem;
    var targetElem     = _getTargetElem($elem);
    var $hiddenTargets = $(targetElem + ':hidden');
    var data           = $hiddenTargets.data('bs.collapse');
    var option         = data ? 'toggle' : $.extend({}, $elem.data(), { trigger: this.elem, toggle: true });
    $.fn.collapse.call($hiddenTargets, option);
    $elem.toggleClass('collapsed');
    $hiddenTargets.collapse('show');
    $elem.on('click.toggle-trigger', function(event) {
      $hiddenTargets.collapse('toggle');
      event.preventDefault();
    });
  };
  // Default disable callback
  var disableToggle = function($elem) {
    // Default behavior to "do nothing"
    $elem.on('click.toggle-trigger', function(event) {
      event.preventDefault();
    });
  };
  // Behavior on "first" click of trigger
  // Default to "do nothing" and squelch click event
  var onInit = function($elem, event) {
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
      var config = $.extend({}, this.defaults, this.options),
          $elem = this.$elem;
      this.$elem.off('click.toggle-trigger');
      if (config.isToggle($elem)) {
        config.enableToggle.call(this, config);
      } else {
        config.disableToggle($elem, config);
      }
      if (typeof config.onInit === 'function') {
        config.onInit($elem, event);
      }
      return this;
    }
  };

  Plugin.defaults = Plugin.prototype.defaults;

  $.fn.responsiveCollapse = function(options) {
    return this.each(function() {
      $(this).one('click', function() {
        new Plugin(this, options).init();
      });
    });
  };
  $(function() {
    $(document).off('.collapse.data-api');
    // Reattach default bootstrap handling, but only
    // for a subset
    $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]:not([data-responsive])', function (e) {
      var $this   = $(this);

      if (!$this.attr('data-target')) e.preventDefault();

      //var $target = getTargetFromTrigger($this)
      var $target = $(_getTargetElem($this));
      var data    = $target.data('bs.collapse');
      var option  = data ? 'toggle' : $.extend({}, $this.data(), { trigger: this });

      $.fn.collapse.call($target, option);
    });

  });

})( jQuery, window , document );
