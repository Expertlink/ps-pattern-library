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

  $(document).on('touchstart.vse.no-zoom mousedown.vse.no-zoom', '.form-control', function () {
    var $element = $(this);
    clearTimeout($element.data('vse.no-zoom.removal-timeout'));
    clearTimeout($element.data('vse.no-zoom.focus-timeout'));
    $element.addClass('no-zoom');
    $element.one('touchend.vse.no-zoom mouseup.vse.no-zoom', function () {
      $element.data('vse.no-zoom.removal-timeout', setTimeout(function () {
        $element.removeClass('no-zoom');
      }, 300));
    });
    $element.one('focus.vse.no-zoom', function () {
      $element.data('vse.no-zoom.focus-timeout', setTimeout(function () {
        $element.addClass('no-zoom-focused');
      }, 500));
    });
    $element.one('blur.vse.no-zoom', function () {
      $element.removeClass('no-zoom-focused');
    });
  });
});
