/**
 * TODO: This should be rewritten to be more plugin-like. Moving here ahead of
 * time because it was no longer working from within the template.
 */

(function ($) {
  'use strict';

  /**
   * Collapsing is now handled by the Bootstrap Collapse plugin. All that's left
   * for us to do is update some values wehn controls are updated...
   */

  /** Update badge counts on change of checkbox for all parents */
  $(document).on('change', '.filter input:checkbox', function () {
    $(this).parents('.filter-collapse').each(function(){
      var $this = $(this);
      var $trigger = $('.filter-parent[href^="#' + $this.attr('id') + '"]');
      var $badge = $trigger.find('.filter-badge');
      $badge.text($this.find('input:checkbox:checked').length || '');
    });
  });

  /** Update summaries on change of radios for immediate parent */
  $(document).on('change', '.filter input:radio', function () {
    var $this = $(this);
    var $label = $this.closest('label');
    var $parent = $this.closest('.filter-collapse');
    var $trigger = $('.filter-parent[href^="#' + $parent.attr('id') + '"]');
    var $summary = $trigger.find('.filter-summary');
    $summary.text($label.text());
  });

})(jQuery);
