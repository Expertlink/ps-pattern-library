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

  $('.js-c4-source-toggle').click(function (event) {
    var $content = $($(this).attr('href')).find('.js-c4-source-content');
    event.preventDefault();
    $content.slideToggle(250, function(){
      $content.toggleClass('c4-is-open', $content.is(':visible'));
      $content.removeAttr('style');
    });
  });
});
