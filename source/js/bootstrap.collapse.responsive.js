/**
 * A rif on bootstrap's collapse. On the first
 * click on a collapse-trigger (elements w/
 * data-responsive-collapse), determine whether
 * the associated content element should be treated
 * as a collapsible toggle or not based on its
 * current visibility.
 *
 */

(function responsiveCollapse($) {
  'use strict';

  var getTargetElem = function($elem) {
    return $elem.data('target') || $elem.attr('href');
  };

  var testIsToggle = function($elem) {
    var targetElem = getTargetElem($elem);
    var $hiddenTargets = $(targetElem + ':hidden');
    if (targetElem && $hiddenTargets.length) {
      return true;
    }
    return false;
  };

  var enableToggle = function($elem) {
    var targetElem = getTargetElem($elem);
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

  var init = function initResponsiveCollapse(options) {
    options = $.extend({
      testIsToggle: testIsToggle,
      enableToggle: enableToggle,
      disableToggle: disableToggle
    }, options || {});
    $(['[data-responsive-toggle="collapse"]']).each(function() {
      $(this).off('click.toggle-trigger');
      $(this).one('click', function(event) {
        var $elem = $(this);
        event.preventDefault();
        if (options.testIsToggle($elem)) {
          options.enableToggle($elem);
        } else {
          options.disableToggle($elem);
        }
      });
    });
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  $(function() {
    init.call();
    $(window).on('resize', debounce(init, 250));
  });
})(jQuery);
