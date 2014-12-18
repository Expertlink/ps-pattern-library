/* global $ */
'use strict';
$(function() {
  var $nav = $('.js-c4-nav');
  var $navToggle = $('.js-c4-nav-toggle');

  $navToggle.click(function(){
    $nav.slideToggle(250, function(){
      $nav.toggleClass('c4-is-open', $nav.is(':visible'));
      $nav.removeAttr('style');
    });
  });

  $('[data-c4-toggle-source]').click(function(){
    var $toggle = $(this);
    var id = $toggle.data('c4-toggle-source');
    var $content = $('[data-c4-source-id="' + id + '"]');
    $toggle.toggleClass('c4-is-active');
    $content.slideToggle(250, function(){
      var isVisible = $content.is(':visible');
      $toggle.toggleClass('c4-is-active', isVisible);
      $content.toggleClass('c4-is-open');
      $content.removeAttr('style');
    });
  });
});
