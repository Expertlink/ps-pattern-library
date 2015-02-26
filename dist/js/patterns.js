// Scripts for pattern at ../source/patterns/01-elements/fields/02-password.hbs

$(function() {
  $('[data-password]').showPassword('focus');
});

// Scripts for pattern at ../source/patterns/01-elements/fields/05-custom-select.hbs


$(function(){

  $('.select').each(function(){
    // Save some elements as variables
    var $element = $(this);
    var $select = $element.find('select');
    var $value = $element.find('.js-select-value');

    // Allow for a delegate for state classes (useful for avoiding duplication
    // in button styles, etc.)
    var $delegate = $element.find('.js-select-delegate');
    if (!$delegate.length) $delegate = $element;

    // Bind event handlers to <select>
    $select.on({
      // On change or keyup, update the value text
      'change keyup': function () {
        $value.text($select.find('option:selected').text());
      },
      // Focus/blur
      'focus blur': function (event) {
        $delegate.toggleClass('focus', event.type === 'focus');
      }
    });
    // Trigger the change event so the value is current
    $select.trigger('change');
  });

});


// Scripts for pattern at ../source/patterns/01-elements/fields/09-tel-field.hbs

$(function() {
  $('[data-mask-type="tel"]').intlTelInput();
});

// Scripts for pattern at ../source/patterns/01-elements/ratings/03-editable-stars.hbs

$(function(){
  $('.stars-control').starRating();
});

// Scripts for pattern at ../source/patterns/02-components/advisors/02-advisor-grid.hbs

$(window).load(function(){
  var $tiles = $('.advisor-tiles .advisor-tile');
  $tiles.leveller({
    cssSelector: '.advisor-tile-actions',
    cssProperty: 'margin-top'
  });
  $(window).resize(function(){
    $tiles.leveller();
  });
});

// Scripts for pattern at ../source/patterns/02-components/carousel/01-carousel.hbs

  /* Auto-play only if there is ONE slide showing (desktop layout) */
  $(function () {
    var $carousel = $('.carousel');
    var visibleCount = $carousel.find('.carousel-item:visible').length;
    var autoPlay = visibleCount === 1;

    if (autoPlay) {
      $carousel.carousel('play');
    }
  });

// Scripts for pattern at ../source/patterns/02-components/forms/06-phone-country.hbs

$(function() {
  var countryData     = $.fn.intlTelInput.getCountryData(),
  countryCount    = countryData.length,
  countryOptions  = [];

  for (i = 0; i < countryCount; i++) { // Build <option>s for country select(s)
    countryOptions.push($('<option></option>')
    .attr('value', countryData[i].iso2)
    .text(countryData[i].name)
  );
  }

  $('[data-mask-type="tel"]').each(function() { // Set up phone masking
    var $el         = $(this),
    countrySelector = $el.data('country-select'),
    $country        = $(countrySelector);

    $country.append(countryOptions).val('us');  // Add <option>s and set to 'us' by default
    $country.change(function() {
      $el.intlTelInput('selectCountry', $(this).val());
    });
  });
});

// Scripts for pattern at ../source/patterns/02-components/forms/_promo-code.hbs


  $(function() {

    $('.promo-group').each(function() {
      var $promoGroup = $(this);
      var $applyBtn   = $promoGroup.find('.apply-btn');
      var $input      = $promoGroup.find('input');

      $applyBtn.click(function(e) {
        var code          = $input.val();
        var codeIsValid   = !!code.match(/^\d{6}/);
        var $els          = {
          discounts     : $('[data-discount-for="' + $promoGroup.attr('id') + '"]'),
          promoGroup    : $promoGroup,
          success       : $('[data-promo-success-for="' + $promoGroup.attr('id') + '"]'),
          toggleControl : $('[href="#' + $promoGroup.attr('id') + '"]'),
          input         : $input
        };
        var eventName  = (codeIsValid) ? 'c4.codeIsValid' : 'c4.codeIsInvalid';
        $promoGroup.trigger('c4.codeValidation', [code, codeIsValid, $els]);
        $promoGroup.trigger(eventName, [code, $els]);
        e.preventDefault();
      });

      $('.promo-group').on('c4.codeValidation', function(e, code, codeIsValid, $els) {
        $els.promoGroup.toggleClass('has-error', !codeIsValid);
        $els.promoGroup.toggleClass('has-success', codeIsValid);
        $els.success.toggleClass('has-success', codeIsValid);
      });

      $('.promo-group').on('c4.codeIsValid', function(e, code, $els) {
        $els.success.find('.js-code-slot').text(code);
        $promoGroup.collapse('hide');
        $els.toggleControl.show().html('Change code');
        $els.discounts.find('.js-price-amount').each(function() {
          $(this).html('<del>$' + $(this).data('amount') + '</del>');
        });
        $els.discounts.find('.js-price-discounted').each(function() {
          $(this).html('$' + $(this).data('amount'));
        });
      });

      $('.promo-group').on('c4.codeIsInvalid', function(e, code, $els) {
        $els.toggleControl.html('Cancel');
        $promoGroup.one('hidden.bs.collapse', function() {
          $els.toggleControl.html('Have a promo code?');
        });
        $els.discounts.find('.js-price-amount').each(function() {
          $(this).html('$' + $(this).data('amount'));
        });
        $els.discounts.find('.js-price-discounted').each(function() {
          $(this).html('');
        });
      });
    });
  });


// Scripts for pattern at ../source/patterns/02-components/masthead/02-masthead.hbs


$(function(){

  var $masthead = $('.masthead');
  var $toggle   = $('.masthead-search-toggle');
  var $fields   = $masthead.find('input, select, button');
  var $types    = $('#search-types');
  var $query    = $('#q');

  var hideDelay = 2000;
  var hideTimeout;

  // When the toggle is clicked, make sure the masthead is in the "open search"
  // state (so the search is visible but other elements are not)
  $toggle.on('click', function (event) {
    event.preventDefault();
    $masthead.addClass('is-search-open');
    $query.click().focus();
  });

  // When the search type is changed, automatically focus the query field
  $types.on('change', function () {
    $query.click().focus();
  });

  // With any of the form fields...
  $fields.on({
    // On focus, disable browser zoom and stop any hiding that may occur
    'focus': function () {
      $.mobile.zoom.disable(true);
      clearTimeout(hideTimeout);
    },
    // On blur, wait the time of hideDelay before enabling zoom and hiding
    'blur': function () {
      hideTimeout = setTimeout(function () {
        $.mobile.zoom.enable(true);
        $masthead.removeClass('is-search-open');
      },  hideDelay);
    }
  });

});


// Scripts for pattern at ../source/patterns/02-components/overflow-nav/01-overflow-nav.hbs

+function ($) {
  'use strict';

  var CustomNav = function (element) {
    this.$element = $(element);
    this.$element.on('click', '[data-toggle="collapse"]:not(.js-custom-nav-more)', $.proxy(this.show, this));
  };

  CustomNav.prototype.show = function (event) {
    var $trigger = $(event.currentTarget);
    var $target = $($trigger.data('target'));
    var $current = this.$element.find('.collapse.in, .collapsing').not($target);
    var shouldBypass = this.$element.find('.js-custom-nav-more:visible').length;

    if (shouldBypass) {
      event.stopPropagation();
      return true;
    }
    // If you're being a click-happy maniac, be patient
    if ($current.hasClass('collapsing')) {
      return false;
    }
    // If there is one showing, collapse it first...
    if ($current.length) {
      $current.one('hidden.bs.collapse', function () {
        $target.collapse('show');
      });
      $current.collapse('hide');
    } else {
      // Otherwise just show the selection
      $target.collapse('toggle');
    }
    // Don't let the document do our collapsing
    return false;
  };

  function Plugin () {
    return this.each(function () {
      var $this = $(this);
      var instance = $this.data('customNav');
      if (!instance) {
        $this.data('customNav', new CustomNav(this));
      }
    });
  }

  $.fn.customNav = Plugin;
}(jQuery);

$(function() {
  $('.js-custom-nav').customNav();
});

// Scripts for pattern at ../source/patterns/02-components/quicklist/01-quicklist.hbs

$(function(){

  var $body = $('body');
  var $quicklist = $('#quicklist');
  var $toggle = $('#quicklist-toggle, .quicklist-header a');

  function hideQuicklist () {
    $quicklist.removeClass('open');
  }

  $toggle.click(function (event) {
    event.preventDefault();

    if ($quicklist.hasClass('open')) {
      $body.removeClass('quicklist-open');
      $quicklist.removeClass('in');
      if ($.support.transition) {
        $quicklist
          .one('bsTransitionEnd', hideQuicklist)
          .emulateTransitionEnd(300);
      } else {
        hideQuicklist();
      }
    }
    else {
      $body.addClass('quicklist-open');
      $quicklist.addClass('open');
      $quicklist[0].offsetWidth;
      $quicklist.addClass('in');
    }
  });

});

// Scripts for pattern at ../source/patterns/pages/account/02-add.hbs

$(function () {
  var $paymentOptions = $('.js-payment-options');

  $paymentOptions.on('change', '.js-payment-option', function (event) {
    var $trigger = $(event.currentTarget);
    var triggerData = $trigger.data();
    var hasCollapseTarget = triggerData.target !== undefined;

    if (hasCollapseTarget) {
      $(triggerData.target)
        .collapse('show')
        .addClass('js-expanded')
    } else {
      $paymentOptions.find('.js-expanded')
        .collapse('hide')
        .removeClass('js-expanded');
    }
  });
});

// Scripts for pattern at ../source/patterns/pages/advisor-bio/01-advisor-bio.hbs

$(function() {
  $('[data-toggle="collapse"][data-responsive="bio"]').responsiveCollapse();
});

// Scripts for pattern at ../source/patterns/pages/home/_rotating-promo.hbs

  /* Auto-play only if there is ONE slide showing (desktop layout) */
  $(function () {
    var $carousel = $('.carousel');
    var visibleCount = $carousel.find('.carousel-item:visible').length;
    var autoPlay = visibleCount === 1;

    if (autoPlay) {
      $carousel.carousel('play');
    }
  });

// Scripts for pattern at ../source/patterns/pages/our-psychics/_sidebar-sort.hbs


/**
 * TODO: This needs some TLC from a good JS developer, probably after (or in
 * conjunction with) improvement of the existing filter-menu plugin
 * (see issue #94)
 */

$(function(){

  // close prairie dog dialog on radio change
  $('#sort-show .filter-item input').on('change', function () {
    $(this).closest('.prairie-dog-dialog').prairieDog('hide');
  });

  // control expand/collapse for different browser sizes
  function manageSortCollapseState () {
    // if the filter menu is not immediately visible...
    if (!$('#sort-show').closest('.filter').is(':visible')) {
      // ...assume it is hidden for mobile and expand it ahead of time
      $('#sort-show').collapse('show');
    }
  };
  $(window).on('resize', manageSortCollapseState);
  manageSortCollapseState();

});

