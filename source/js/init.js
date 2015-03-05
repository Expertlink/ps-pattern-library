$(function() {
  'use strict';
  FastClick.attach(document.body);

  // Truncate (succinct) plugin
  // Elements with `[data-truncate]` attr
  // Initialize to truncate them.
  $('[data-truncate]').each(function() {
    var length = $(this).data('truncate') || 240;
    if ($(this).html().length > length) {
      $(this).succinct({
        size: length
      });
      $(this).siblings('[data-truncate-more]').removeClass('hidden');
    }
  });

  // Counteract input zoom on some touch devices
  if (Modernizr.touch) {
    // Must trigger on touchstart or emulated mousedown, as either could fire
    // (and touchend/mouseup events can fire too late)
    $('.form-control').on('touchstart.vse.no-zoom mousedown.vse.no-zoom', function () {
      // Store this element
      var $element = $(this);
      // Clear preexisting timeouts
      clearTimeout($element.data('vse.no-zoom.removal-timeout'));
      clearTimeout($element.data('vse.no-zoom.focus-timeout'));
      // Add the no-zoom helper class
      $element.addClass('no-zoom');
      // On touchend or mouseup, remove the class after a brief delay
      $element.one('touchend.vse.no-zoom mouseup.vse.no-zoom', function () {
        $element.data('vse.no-zoom.removal-timeout', setTimeout(function () {
          $element.removeClass('no-zoom');
        }, 300)); // Increase this delay if ineffective
      });
      // On focus, attach an additional class that will prevent the font-size
      // from changing (for example, on text selection or movement of the caret)
      $element.one('focus.vse.no-zoom', function () {
        $element.data('vse.no-zoom.focus-timeout', setTimeout(function () {
          $element.addClass('no-zoom-focused');
          $element.one('blur.vse.no-zoom', function () {
            $element.removeClass('no-zoom-focused');
          });
        }, 500)); // Increase this delay if this conflicts with touchend event
      });
    });
  }
});
