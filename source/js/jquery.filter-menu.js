/**
 * When options are selected in filter menus—either as checkbox
 * or radio button options—reflect those selected options in
 * a badge (checkbox count) or summary (selected radio label) in
 * a parent element.
 */
 (function ($) {
  'use strict';
  function Plugin() {
    $(document).on('change', '.filter input', function(event) {
      $('.filter-parent').each(function() {
        var $filters      = $($(this).attr('href')),
          selectedCount   = $filters.find('input:checkbox:checked').length || '',
          selectedText    = $filters.find('input:radio:checked')
                              .first().closest('label').text();
        $(this).find('.filter-badge').text(selectedCount);
        $(this).find('.filter-summary').text(selectedText);
      });
    });
   }
   $.fn.filterSummary             = Plugin;
  Plugin.call();
})(jQuery);
