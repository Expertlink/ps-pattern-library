$(function() {
  'use strict';
  FastClick.attach(document.body);

  // Truncate (succinct) plugin
  // Elements with `[data-truncate]` attr
  // Initialize to truncate them.
  $('[data-truncate]').each(function() {
    var length = $(this).data('truncate') || 240;
    $(this).succinct({
      size: length
    });
  });
});
