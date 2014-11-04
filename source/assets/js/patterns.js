/* global $ */
'use strict';
$(function() {
  var $nav = $('.js-c4-nav');
  var $navToggle = $('.js-c4-nav-toggle');

  $navToggle.click(function(){
    $nav.slideToggle(250, function(){
      $nav.toggleClass('c4-open', $nav.is(':visible'));
      $nav.removeAttr('style');
    });
  });

  $('.js-c4-source-toggle').click(function (event) {
    var $this = $(this);
    var href = $this.attr('href');
    $(href).toggleClass('c4-open');
    event.preventDefault();
  });
});
