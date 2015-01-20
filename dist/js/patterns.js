// Scripts for pattern at ../source/patterns/01-elements/fields/02-password.hbs

$(function() {
  $('[data-password]').showPassword('focus');
});

// Scripts for pattern at ../source/patterns/01-elements/fields/09-tel-field.hbs

$(function() {
  $('[data-mask-type="tel"]').intlTelInput();
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

// Scripts for pattern at ../source/patterns/02-components/forms/00-offer-select.hbs


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


// Scripts for pattern at ../source/patterns/pages/signup/02-billing.hbs

  $(function() {
    $('.toggle-trigger').click(function (e) {
      e.preventDefault();

      var $trigger = $(e.target);
      $trigger.toggleClass('active');
      $($trigger.attr('href')).toggleClass('hidden');
    });
  });
