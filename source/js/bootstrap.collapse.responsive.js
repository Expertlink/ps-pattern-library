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

  var init = function initResponsiveCollapse() {
    $(['[data-responsive-toggle="collapse"]']).each(function() {
      $(this).off('click.toggle-trigger');
      $(this).one('click', function(event) {
        event.preventDefault();
        var targetHref = $(this).attr('href'),
            $hiddenTargets =  $(targetHref + ':hidden');

        if (targetHref && $hiddenTargets.length) {
          $hiddenTargets.collapse('show');
          $(this).toggleClass('collapsed'); // https://github.com/twbs/bootstrap/issues/13636
          $(this).on('click.toggle-trigger', function(event) {
            event.preventDefault();
            $hiddenTargets.collapse('toggle');
            $(this).toggleClass('collapsed');
          });
        } else {
          $(this).on('click.toggle-trigger', function(event) {
            event.preventDefault();
          });
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
