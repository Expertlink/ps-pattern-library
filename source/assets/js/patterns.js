/* global $ */
'use strict';
$(function() {
  $('.js-c4-pattern-source-toggle').click(function (event) {
    var $this = $(this),
       $parent = $this.closest('.js-c4-pattern-source'),
       $source = $parent.find('.js-c4-pattern-source-body');
    event.preventDefault();
    $source.slideToggle(250);
  });
});
