(function ($) {
  'use strict';

  function FilterAccordion (container, options) {
    this.$container = $(container);
    this.options = options;
  }

  FilterAccordion.prototype.toggle = function () {

  };

  // document ready
  $(function(){
    $('.js-filter-container').each(function(){
      // var data = $(this).
    });
  });


  /*  var $container = $('.js-filter-container');
      var $parents = $container.find('.js-filter-parent');
      var $lists = $container.find('.js-filter-list');
      var $controls = $container.find('.js-filter-control');

      function toggleFilterList (parent) {
      var $parent = $(parent);
      var $list = $($parent.attr('href'));
      return $list.slideToggle(250, function(){
      $parent.toggleClass('collapsed', !$list.is(':visible'));
    });
    }

    function updateBadges (control) {
    var $lists = $(control).parents('.js-filter-list');
    $lists.each(function(){
    var $list = $(this);
    var $parent = $('.js-filter-parent.collapsible[href="#' + $list.attr('id') + '"]');
    var count = $list.find('.js-filter-control:checked').length;
    var $badge = $parent.find('.js-filter-badge');
    $badge.text(count || '');
    });
    }

    $parents.on({
    click: function (event) {
    if (toggleFilterList(this).length) {
    event.preventDefault();
    }
    },
    keypress: function (event) {
    // spacebar press for consistency with checkboxes
    if (event.keyCode === 0 || event.keyCode === 32) {
    toggleFilterList(this);
    }
    }
    });

    $controls.on('click change', function(){
    updateBadges(this);
    });

    $parents.addClass('collapsible collapsed');
    $lists.hide();*/

}(jQuery));
