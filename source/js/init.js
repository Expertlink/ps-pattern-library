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
    var canZoom = true,         // keep track of state
        removeZoomDelay = 2000, // delay before restoring zoom
        removeZoomTimeout;      // stores timeout

    $('input, select, textarea').on({
      // on focus, clear timeout and disable zoom
      'focus.vse.no-zoom': function () {
        clearTimeout(removeZoomTimeout);
        if (canZoom) {
          $.mobile.zoom.disable(true);
          canZoom = false;
        }
      },
      // on blur, create new timeout for re-enabling zoom
      'blur.vse.no-zoom': function () {
        clearTimeout(removeZoomTimeout);
        removeZoomTimeout = setTimeout(function () {
          if (!canZoom) {
            $.mobile.zoom.enable(true);
            canZoom = true;
          }
        }, removeZoomDelay);
      }
    });
  }
});
