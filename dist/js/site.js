/* global jQuery, window, document */
/**
 * A rif on bootstrap's collapse. On the first
 * click on a collapse-trigger (elements w/
 * data-responsive-collapse), determine whether
 * the associated content element should be treated
 * as a collapsible toggle or not based on its
 * current visibility.
 *
 */

 (function (factory) {
   'use strict';
   if (typeof define === 'function' && define.amd) {
     // AMD. Register as an anonymous module.
     define(['jquery'], factory);
   } else if (typeof exports === 'object') {
     // Node/CommonJS
     factory(require('jquery'));
   } else {
     // Browser globals
     factory(jQuery);
   }
 }(function ($) {
   'use strict';

  var Plugin = function( elem, options ) {
    this.elem    = elem;
    this.$elem   = $(elem);
    this.options = options;
  };

  var _getTargetElem = function($trigger) {
    var href;
    var target = $trigger.attr('data-target') ||
                 (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7
    return target;
  };
  // Default test for whether something should be a toggle
  var isToggle = function($elem) {
    var targetElem     = _getTargetElem($elem);
    var $hiddenTargets = $(targetElem + ':hidden');
    if (targetElem && $hiddenTargets.length) {
      return true;
    }
    return false;
  };
  // Default enable callback
  // Some of this is pulled from collapse.js's initialization
  var enableToggle = function(config) {
    var $elem          = this.$elem;
    var targetElem     = _getTargetElem($elem);
    var $hiddenTargets = $(targetElem + ':hidden');
    var data           = $hiddenTargets.data('bs.collapse');
    var option         = data ? 'toggle' : $.extend({}, $elem.data(), { trigger: this.elem, show: true });

    $.fn.collapse.call($hiddenTargets, option);

    $elem.on('click.toggle-trigger', function(event) {
      $hiddenTargets.collapse('toggle');
      event.preventDefault();
    });
  };
  // Default disable callback
  var disableToggle = function(config) {
    // Default behavior to "do nothing"
    // This allows there to be `href` attributes
    this.$elem.on('click.toggle-trigger', function(event) {
      event.preventDefault();
    });
  };
  // Behavior on "first" click of trigger
  // Default to "do nothing" and squelch click event
  var onInit = function(event) {
    event.preventDefault();
  };

  Plugin.prototype = {
    defaults: {
      isToggle      : isToggle,
      enableToggle  : enableToggle,
      disableToggle : disableToggle,
      onInit        : onInit
    },
    init: function() {
      var config = $.extend({}, this.defaults, this.options);
      this.$elem.off('click.toggle-trigger');
      if (config.isToggle(this.$elem)) {
        config.enableToggle.call(this, config);
      } else {
        config.disableToggle.call(this, config);
      }
      if (typeof config.onInit === 'function') {
        config.onInit.call(this, event);
      }
      return this;
    }
  };

  Plugin.defaults = Plugin.prototype.defaults;

  $.fn.responsiveCollapse = function(options) {
    return this.each(function() {
      $(this).one('click', function() { // Lazy init
        new Plugin(this, options).init();
      });
    });
  };
  $(function() {
    $(document).off('.collapse.data-api');
    // Reattach default bootstrap handling, but only
    // for a subset. This requires fully re-defining what
    // it was doing as there is no API-supported way to inspect
    // event handlers in modern versions of jQuery.
    $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]:not([data-responsive])', function (e) {
      var $this   = $(this);

      if (!$this.attr('data-target')) e.preventDefault();
      var $target = $(_getTargetElem($this));
      var data    = $target.data('bs.collapse');
      var option  = data ? 'toggle' : $.extend({}, $this.data(), { trigger: this });
      $.fn.collapse.call($target, option);
    });
  });

}));

/*! fixed-fixed - v0.1.0 - 2014-05-23
* Copyright (c) 2014 ; Licensed MIT */
/*! Fixedfixed: a CSS position:fixed qualifier. (c)2012 @scottjehl, Filament Group, Inc. Dual license: MIT and/or GPLv2 */
(function(w, undefined) {
    var htmlclass = "fixed-supported", el = w.document.createElement("div"), ua = w.navigator.userAgent, docEl = w.document.documentElement;
    // fix the test element
    el.style.position = "fixed";
    el.style.top = 0;
    // support test
    function checkFixed() {
        var scroll = "scrollTop" in w.document.body ? w.document.body.scrollTop : docEl.scrollTop;
        // only run test if there's a scroll we can compare
        if (scroll !== undefined && scroll > 0 && w.document.body) {
            w.document.body.insertBefore(el, w.document.body.firstChild);
            if (!el.getBoundingClientRect || el.getBoundingClientRect().top !== 0) {
                // Fixed is not working or can't be tested
                docEl.className = docEl.className.replace(htmlclass, "");
            }
            // remove the test element
            w.document.body.removeChild(el);
            // unbind the handlers
            if (w.removeEventListener) {
                w.removeEventListener("scroll", checkFixed, false);
            } else {
                w.detachEvent("onscroll", checkFixed);
            }
        }
    }
    // if a particular UA is known to return false results with this feature test, try and avoid that UA here.
    if (// Android 2.1, 2.2, 2.5, and 2.6 Webkit
    !(ua.match(/Android 2\.[1256]/) && ua.indexOf("AppleWebKit") > -1) || // Opera Mobile less than version 11.0 (7458)
    !(ua.match(/Opera Mobi\/([0-9]+)/) && RegExp.$1 < 7458) || // Opera Mini
    !(w.operamini && {}.toString.call(w.operamini) === "[object OperaMini]") || // Firefox Mobile less than version 6
    !(ua.match(/Fennec\/([0-9]+)/) && RegExp.$1 < 6)) {
        //add the HTML class for now.
        docEl.className += " " + htmlclass;
        // bind to scroll event so we can test and potentially degrade
        if (w.addEventListener) {
            w.addEventListener("scroll", checkFixed, false);
        } else {
            w.attachEvent("onscroll", checkFixed);
        }
    }
    w.FixedFixed = checkFixed;
})(this);
$(function() {
  'use strict';
  FastClick.attach(document.body);

  // Truncate (succinct) plugin
  // Elements with `[data-truncate]` attr
  // Initialize to truncate them.
  $('[data-truncate]').each(function() {
    var length = $(this).data('truncate') || 240;
    if ($(this).html().length > length) {
      $(this).succinct({
        size: length
      });
      $(this).siblings('[data-truncate-more]').removeClass('hidden');
    }
  });
});

/**
 * When options are selected in filter menus—either as checkbox
 * or radio button options—reflect those selected options in
 * a badge (checkbox count) or summary (selected radio label) in
 * a parent element.
 */
 (function ($) {
  'use strict';
  function filterMenu() {
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
  filterMenu.call();
})(jQuery);

/* global console, define, jQuery, require */
/* jshint eqeqeq: false */
/**
 * NOTE: This is a temporary location for this code. It will be moving.
 */
/* Tools for masking and processing payment input fields */
(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  'use strict';

  function _getCursorPosition($inputEl) {
    var input = $inputEl.get(0);
    if (!input) return; // No (input) element found
    if ('selectionStart' in input) {
      // Standard-compliant browsers
      return input.selectionStart;
    } else if (document.selection) {
      // IE
      input.focus();
      var sel = document.selection.createRange();
      var selLen = document.selection.createRange().text.length;
      sel.moveStart('character', -input.value.length);
      return sel.text.length - selLen;
    }
  }

  function _setCursorRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    } else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    }
  }

  function _setCursorPosition($inputEl, pos) {
    _setCursorRange($inputEl.get(0), pos, pos);
  }

  var InputMask = function(element, options) {
    this.$element      = $(element);
    this.$inputEl      = this.$element.find('input');
    this.options       = $.extend({}, InputMask.DEFAULTS, options);

    this.lastValue     = '';
    this.currentValue  = '';
    this.maskValue     = '';
    this.lastMaskValue = '';

    this.isValid       = false;
    this.isError       = false;
    this.isComplete    = false;

  };

  InputMask.DEFAULTS = {
    validCards     : ['visa', 'amex', 'discover', 'mastercard', 'dinersclub'],
    cards          : {
      amex :   {
        pattern: /^3(4|7)/,
        minLength: 15,
        maxLength: 15,
        chunks: [4,6,5],
        cvvLength: 4
      },
      dinersclub: {
        pattern: /3(?:0[0-5]|[68][0-9])/,
        minLength: 14,
        maxLength: 14,
        chunks: [5,4,5],
        cvvLength: 3
      },
      discover: {
        pattern: /^6011(?!31)(?=\d{2})/,
        minLength: 16,
        maxLength: 16,
        chunks: [4,4,4,4],
        cvvLength: 3
      },
      mastercard: {
        pattern: /^5[1-5]/,
        minLength: 16,
        maxLength: 16,
        chunks: [4,4,4,4],
        cvvLength: 3
      },
      visa: {
        pattern: /^4/,
        minLength: 13,
        maxLength: 16,
        chunks: [4,4,4,4],
        cvvLength: 3
      }
    }
  };
  InputMask.PLUGIN_NAME = 'c4-input-mask';

  InputMask.factory = function(element, maskType, options) {
    var ctor = maskType,
    newMask;

    if (typeof InputMask[ctor] !== 'function') {
      console.log(ctor, 'problem');
      throw {
        name: 'Error',
        message: ctor + ' does not exist (is not an available mask-type)'
      };
    }
    if (typeof InputMask[ctor].prototype.fetchValue !== 'function') {
      InputMask[ctor].prototype = new InputMask(element, options);
    }
    newMask = new InputMask[ctor](element, options);
    /*
    if ($('html').hasClass('android')) {
    maskEvents = 'change';
  } else {
  maskEvents = 'keypress keyup change';
    }
    */
    newMask.$inputEl.on('keypress keyup change', $.proxy(function(event) {
      this.fetchValue(event);
      this.validate(this.currentValue, event);
      if (event.keyCode && event.keyCode === 8) {
        if ((this.lastValue.length - this.currentValue.length) <= 1) {
          // backspace exemption
          return;
        }
      }
      this.formatMask(event);
    }, newMask));
    return newMask;
  };

  InputMask.prototype.fetchValue = function() {
    var newValue = this.$inputEl.val();
    this.setCurrentValue(newValue);
    return newValue;
  };
  InputMask.prototype.fetchMaskValue = function() {
    return this.$inputEl.val();
  };

  InputMask.prototype.setCurrentValue = function(newValue) {
    this.lastValue = this.currentValue;
    if (newValue != this.currentValue) {
      this.$element.trigger('maskFieldValueChanged', [newValue, this.lastValue, this]);
      this.currentValue = newValue;
    }
  };
  InputMask.prototype.validate = function() {};
  InputMask.prototype.afterValidate = function(validateError, validateComplete) {
    var $els = this.$element.add(this.$inputEl);
    if (validateError !== this.isError) {
      this.isError = validateError;
      this.$element.trigger('maskErrorChange', [this.isError, this]);
    }
    if (validateComplete !== this.isComplete) {
      this.isComplete = validateComplete;
      this.$element.trigger('maskCompleteChange', [this.isComplete, this]);
    }
    $els.toggleClass('has-error', this.isError);
    $els.toggleClass('has-success', this.isComplete);
  };
  InputMask.prototype.formatMask = function() {
      this.lastMaskValue = this.maskValue;
      this.maskValue     = this.currentValue;
  };

  InputMask.prototype.afterFormatMask = function() {
    var maskHasChanged       = (this.lastMaskValue !== this.maskValue);
    var valueHasChanged      = (this.lastValue     !== this.currentValue);

    var valueLengthChange    = this.currentValue.length - this.lastValue.length;
    var maskLengthChange     = this.maskValue.length    - this.lastMaskValue.length;

    var valueWasReplaced     = (valueLengthChange === this.currentValue.length);
    var maskWasReplaced      = (maskLengthChange  === this.maskValue.length);

    var lastPosition         = _getCursorPosition(this.$inputEl);
    var positionBeforeChange = lastPosition - valueLengthChange;

    var valueDiff            = this.currentValue.substring(positionBeforeChange, positionBeforeChange + maskLengthChange);
    var maskDiff             = this.maskValue.substring(positionBeforeChange, positionBeforeChange + maskLengthChange);

    var maskOffset           = 0;
    var compareIndex         = 0;

    var newPosition;

    if (maskHasChanged && valueDiff.length) {
      for (var i = 0, diffLength = maskDiff.length; i < diffLength; i++) {
        compareIndex = i + maskOffset;
        while (diffLength >= compareIndex + 1 && maskDiff[compareIndex] !== valueDiff[i]) {
          maskOffset++;
          compareIndex++;
        }
      }
      newPosition = lastPosition + maskOffset;
    }
    if (maskHasChanged || valueWasReplaced || (this.fetchMaskValue() !== this.maskValue)) {
      this.$element.trigger('maskChanged', [this]);
      this.$inputEl.val(this.maskValue);
      if (newPosition && this.lastMaskValue.length && newPosition !== this.maskValue.length) {
        _setCursorPosition(this.$inputEl, newPosition);
      }
    }
  };

  InputMask.CreditCardMask = function(element, options) {
    this.validCardTypes = options.validCards;
    //this.cards          = options.cards;
    this.cards          = {};
    this.cardType       = '';
    this.cardClasses    = ['is-default'];
    var cardName;

    for (var cardIndex in this.validCardTypes) {
      cardName = this.validCardTypes[cardIndex];
      if (typeof options.cards[cardName] !== 'undefined') {
        this.cards[cardName]          = options.cards[cardName];
        this.cards[cardName].cssClass = 'is-' + cardName;
        this.cardClasses.push(this.cards[cardName].cssClass);
      }
    }
    this.cardClasses = this.cardClasses.join(' ');

    this.fetchValue = function() {
      var newValue = this.$inputEl.val().replace(/\s*/g, '');
      this.setCurrentValue(newValue);
      this.checkCardType(this.currentValue);
      return newValue;
    };

    this.checkCardType = function(cardNumber) {
      var newCardType = null;
      var cardName;
      for (cardName in this.cards) {
        if (this.cards[cardName].pattern.test(cardNumber)) {
          newCardType = cardName;
        }
      }
      if (newCardType !== this.cardType) {
        this.cardType = newCardType;
        this.$element.trigger('cardTypeChange', [this.cardType, this.cards[this.cardType], this]);
        this.updateCardType();
      }
    };

    this.hasCardType = function() {
      return (this.cardType &&
              this.cardType !== 'default' &&
              this.cards[this.cardType]);
    };

    this.getCardInfo = function() {
      return (this.hasCardType()) ? this.cards[this.cardType] : false;
    };

    this.updateCardType = function() {
      var newTypeName = this.cardType || 'default';
      this.$element.removeClass(this.cardClasses).addClass('is-' + newTypeName);
    };

    this.validate = function(cardNumber) {
      var numberValid = false,
      numberError     = false,
      numberComplete  = false,
      nCheck          = 0,
      nDigit          = 0,
      bEven           = false,
      minLength       = 16,
      maxLength       = 16,
      cardInfo        = this.getCardInfo();

      if (cardInfo) {
        minLength = cardInfo.minLength;
        maxLength = cardInfo.maxLength;
      }

      if (/[^0-9\s]+/.test(cardNumber) || cardNumber.length > maxLength) {
        numberError = true;
      } else { // Luhn check
        cardNumber = cardNumber.replace(/\D/g, '');
        for (var n = cardNumber.length - 1; n >= 0; n--) {
          var cDigit = cardNumber.charAt(n);
          nDigit = parseInt(cDigit, 10);
          if (bEven) {
            if ((nDigit *= 2) > 9) nDigit -= 9;
          }
          nCheck += nDigit;
          bEven  = !bEven;
        }
        numberValid = (nCheck % 10) === 0;
      }
      if (numberValid && cardNumber.length >= minLength) {
        numberComplete = true;
      } else if (cardNumber.length >= maxLength && !numberValid) {
        numberError = true;
      }
      this.afterValidate(numberError, numberComplete);
      return numberValid;
    };

    this.formatMask = function(event) {
      var cardDigits = this.currentValue.split(''),
      chunks         = [],
      numberLength   = cardDigits.length,
      masked         = '',
      separator      = ' ',
      chunkIndex     = 0,
      cardInfo, i;

      function chunkIsFull(cardInfo, chunkIndex) {
        if (typeof cardInfo.chunks !== 'undefined' ||
            typeof cardInfo.chunks[chunkIndex] !== 'undefined') {
          // If this chunk is full _and_ there is a subsequent chunk to fill
          if (chunks[chunkIndex].length >= cardInfo.chunks[chunkIndex] &&
              cardInfo.chunks[chunkIndex + 1] !== undefined) {
            return true;
          }
        }
        return false;
      }

      if (!this.isError &&
           this.hasCardType()) {
        chunks.push([]);
        cardInfo = this.getCardInfo();
        for (i = 0; i <= numberLength; i++) {
          if (chunkIsFull(cardInfo, chunkIndex)) {
            chunks.push([]); // Create a new chunk
          }
          chunkIndex = chunks.length - 1;
          chunks[chunkIndex].push(cardDigits[i]); // Push to current chunk
        }
        for (var chunk in chunks) {
          chunks[chunk] = chunks[chunk].join('');
        }
        masked        = chunks.join(separator); // New masked value
        this.lastMaskValue = this.maskValue;
        this.maskValue     = masked;
        this.afterFormatMask();
      }
    };

  };

  InputMask.ExpirationDateMask = function(element, options) {
    this.charPatterns = [/[01]/,/[0-9]/,/[012]/,/[0-9]/];

    this.fetchValue = function() {
      // Strip out `/`s from value
      var newValue = this.$inputEl.val().replace(/\//g, '');
      if (newValue.length === 1 &&
          (parseInt(newValue[0], 10) > 1)) {
        // The only valid values in the first position are 0 or 1
        // We can help them along if the first value is
        // not one of these.
        newValue = '0' + newValue;
      } else if (newValue.length === 3 &&
                 parseInt(newValue[0], 10) > 1) {
        newValue = '0' + newValue;
      }
      this.setCurrentValue(newValue);
      return newValue;
    };

    this.formatMask = function() {
      if (this.isError) { return; }
      var mask = this.currentValue,
          currentValue, month, year;
      if (this.currentValue.length === 2) {
        mask = this.currentValue + '/';
      } else if (this.currentValue.length > 2) {
        month = this.currentValue.substring(0, 2);
        year = this.currentValue.substring(2);
        mask = month + '/' + year;
      }
      this.lastMaskValue = this.maskValue;
      this.maskValue     = mask;

      this.afterFormatMask();
    };

    this.validate = function(fieldValue) {
      var valueError    = false,
          valueComplete = false,
          valueChars    = fieldValue.split(''),
          month, day, year, dateNow, yearNow, monthNow, i;

      if (/[^0-9-\/]+/.test(fieldValue)) {
        // Failed regexp against 0-9, - and /
        valueError = true;
      } else if (fieldValue.length <= 4) {
        for (i = 0; i < valueChars.length; i++) {
          if (!this.charPatterns[i].test(valueChars[i])) {
            valueError = true;
          }
        }
      }

      if (fieldValue.length >= 2) {
        month = parseInt(fieldValue.substring(0, 2), 10);
        if (!month || month > 12) {
          valueError = true;
        }
      }

      if (fieldValue.length === 4 && !valueError) {
        dateNow   = new Date();
        yearNow   = dateNow.getFullYear();
        year      = parseInt('20' + fieldValue.substring(2, 4), 10);
        if (year < yearNow) {
          valueError = true;
        } else if (year === yearNow) {
          month = parseInt(fieldValue.substring(0, 2), 10);
          monthNow = dateNow.getMonth() + 1;
          if (month < monthNow) {
            valueError = true;
          }
        }
        if (!valueError) {
          valueComplete = true;
        }
      }
      this.afterValidate(valueError, valueComplete);
    };
  };

  InputMask.CVVMask = function(element, options) {
    this.cardNumberInputName = this.$element.data('mask-cvv-for');
    this.cardType            = 'default';
    this.cardInfo            = {};

    if (this.cardNumberInputName) { // "Link" to card number input
      this.$cardEl = $('input[name="' + this.cardNumberInputName + '"]').parents('[data-mask]').first();
      this.$cardEl.on('cardTypeChange', $.proxy(function(event, newCardType, newCardInfo) {
        if (newCardInfo !== undefined) {
          this.cardType = newCardType;
          this.cardInfo = newCardInfo;
          this.validate(this.fetchValue());
        }
      }, this));
    }
    this.validate = function(fieldValue) {
      var valueComplete  = false,
          valueError     = false,
          completeLength = (this.cardInfo.cvvLength) ? this.cardInfo.cvvLength : 3;
      if (/[^0-9]+/.test(fieldValue) || fieldValue.length > completeLength) {
        valueError = true;
      } else if(fieldValue.length === completeLength) {
        valueComplete = true;
      }
      this.afterValidate(valueError, valueComplete);
    };
  };

  function Plugin(option) {
    return this.each(function() {
      var $this   = $(this);
      var data    = $this.data(InputMask.PLUGIN_NAME + '_plugin');
      var options = $.extend({}, InputMask.DEFAULTS, $this.data(), typeof option == 'object' && option);
      var maskType = $this.data('mask-type');
      if (!data && maskType) {
        $this.data(InputMask.PLUGIN_NAME + '_plugin', InputMask.factory(this, maskType + 'Mask', options));
      }
    });
  }

  $.fn.c4inputMask = Plugin;

  $(function() {
    $('[data-mask]').each(function() {
      $(this).c4inputMask();
    });
  });

}));

/**
 * jQuery Mobile has a really useful zoom enable/disable component that doesn't
 * actually depend on any other aspects of jQuery Mobile. Unfortunately if you
 * build it using the jQuery Mobile build tool, it includes all of "core," so
 * we're including it here on its own in a very manual fashion.
 *
 * https://github.com/jquery/jquery-mobile
 */

(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  'use strict';

  var	meta = $( 'meta[name=viewport]' ),
		  initialContent = meta.attr( 'content' ),
		  disabledZoom = initialContent + ',maximum-scale=1, user-scalable=no',
		  enabledZoom = initialContent + ',maximum-scale=10, user-scalable=yes',
		  disabledInitially = /(user-scalable[\s]*=[\s]*no)|(maximum-scale[\s]*=[\s]*1)[$,\s]/.test( initialContent );

  $.mobile = $.mobile || {};

	$.mobile.zoom = $.extend( {}, {
		enabled: !disabledInitially,
		locked: false,
		disable: function( lock ) {
			if ( !disabledInitially && !$.mobile.zoom.locked ) {
				meta.attr( 'content', disabledZoom );
				$.mobile.zoom.enabled = false;
				$.mobile.zoom.locked = lock || false;
			}
		},
		enable: function( unlock ) {
			if ( !disabledInitially && ( !$.mobile.zoom.locked || unlock === true ) ) {
				meta.attr( 'content', enabledZoom );
				$.mobile.zoom.enabled = true;
				$.mobile.zoom.locked = false;
			}
		},
		restore: function() {
			if ( !disabledInitially ) {
				meta.attr( 'content', initialContent );
				$.mobile.zoom.enabled = true;
			}
		}
	});


}));

/**
 * I'm doing my best Bootstrap impression here for how this is structured.
 * Life's short, y'know?
 *
 * (This does depend on Bootstrap transitions, though.)
 */

(function ($) {
  'use strict';

  // PRAIRIE-DOG CLASS DEFINITION
  // ============================

  var PrairieDog = function (element, options) {
    this.options  = options;
    this.$element = $(element);
    this.$parent  = this.options.parent ? $(this.options.parent) : this.$element.parent();
    this.$trigger = $(this.options.trigger).filter('[href="#' + element.id + '"], [data-target="#' + element.id + '"]');
    this.$overlay = this.$parent.find('.prairie-dog-overlay');
    this.$bg      = this.$parent.find('.prairie-dog-bg');
    this.isShown  = null;
    this.handoff  = null;
  };

  PrairieDog.TRANSITION_DURATION = 300;

  PrairieDog.DEFAULTS = {
    show: true,
    trigger: '[data-toggle="prairie-dog"]'
  };

  PrairieDog.prototype.toggle = function () {
    return this.isShown ? this.hide() : this.show();
  };

  PrairieDog.prototype.show = function () {
    var e = $.Event('show.vse.prairie-dog');
    this.$element.trigger(e);
    if (this.isShown || e.isDefaultPrevented()) return;
    this.isShown = true;

    var $openSiblings = this.$parent.find('.prairie-dog-dialog.open').not(this.$element);
    if ($openSiblings.length) {
      $openSiblings.one('hidden.vse.prairie-dog', $.proxy(this.showPrairieDog, this));
      $openSiblings.prairieDog('startHandoff');
      $openSiblings.prairieDog('hide');
    } else {
      this.showPrairieDog();
    }
  };

  PrairieDog.prototype.showPrairieDog = function () {
    // parent
    if (!this.$parent.hasClass('open')) {
      this.adjustHeight();
      this.$parent.addClass('open');
      this.$parent[0].offsetWidth; // force reflow
      this.$parent.addClass('in');
    }
    // this dialog
    this.$element.addClass('open');
    this.$element[0].offsetWidth; // force reflow
    this.$element.addClass('in');
    this.$element.on('click.dismiss.vse.prairie-dog', '[data-dismiss="prairie-dog"]', $.proxy(this.hide, this));
    this.$overlay.on('click.dismiss.vse.prairie-dog', $.proxy(this.hide, this));
    this.$trigger.addClass('active');
  };

  PrairieDog.prototype.hide = function (e) {
    if (e) e.preventDefault();
    e = $.Event('hide.vse.prairie-dog');
    this.$element.trigger(e);
    if (!this.isShown || e.isDefaultPrevented()) return;
    this.isShown = false;

    this.$element
      .removeClass('in')
      .off('click.dismiss.vse.prairie-dog');

    if (!this.handoff) {
      this.$parent.removeClass('in');
    }

    this.$trigger.removeClass('active');

    if ($.support.transition) {
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hidePrairieDog, this))
        .emulateTransitionEnd(PrairieDog.TRANSITION_DURATION);
    } else {
      this.hidePrairieDog();
    }
  };

  PrairieDog.prototype.hidePrairieDog = function () {
    this.$element.removeClass('open');
    if (this.handoff) {
      this.stopHandoff();
    } else {
      this.$parent.removeClass('open');
      this.resetHeight();
    }
    this.$overlay.off('click.dismiss.vse.prairie-dog');
    this.$element.trigger('hidden.vse.prairie-dog');
  };

  PrairieDog.prototype.adjustHeight = function () {
    var bgHeight = this.$bg.outerHeight();
    var borderTop = parseInt(this.$parent.css('border-top-width'), 10);
    var borderBottom = parseInt(this.$parent.css('border-bottom-width'), 10);
    this.$parent.css('min-height', bgHeight + borderTop + borderBottom);
  };

  PrairieDog.prototype.resetHeight = function () {
    this.$parent.css('min-height', '');
  };

  PrairieDog.prototype.startHandoff = function () {
    this.handoff = true;
  };

  PrairieDog.prototype.stopHandoff = function () {
    this.handoff = null;
  };

  // PRAIRIE-DOG PLUGIN DEFINITION
  // =============================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('vse.prairie-dog');
      var options = $.extend(
        {},
        PrairieDog.DEFAULTS,
        $this.data(),
        typeof option === 'object' && option
      );

      if (!data) {
        $this.data('vse.prairie-dog', (data = new PrairieDog(this, options)));
      }

      if (typeof option === 'string') {
        data[option]();
      } else if (options.show) {
        data.show();
      }
    });
  }

  $.fn.prairieDog             = Plugin;
  $.fn.prairieDog.Constructor = PrairieDog;

  // PRAIRIE-DOG DATA-API
  // ====================

  $(document).on('click.vse.prairie-dog', '[data-toggle="prairie-dog"]', function (e) {
    var $this   = $(this);
    var href    = $this.attr('href');
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))); // strip for ie7
    var option  = $target.data('vse.prairie-dog') ? 'toggle' : $.extend($target.data(), $this.data());

    if ($this.is('a')) e.preventDefault();

    Plugin.call($target, option, this);
  });

})(jQuery);

/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
* Build: http://modernizr.com/download/#-csstransforms3d-shiv-cssclasses-teststyles-testprop-testallprops-prefixes-domprefixes
*/
;window.Modernizr=function(a,b,c){function z(a){j.cssText=a}function A(a,b){return z(m.join(a+";")+(b||""))}function B(a,b){return typeof a===b}function C(a,b){return!!~(""+a).indexOf(b)}function D(a,b){for(var d in a){var e=a[d];if(!C(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function E(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:B(f,"function")?f.bind(d||b):f}return!1}function F(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+o.join(d+" ")+d).split(" ");return B(b,"string")||B(b,"undefined")?D(e,b):(e=(a+" "+p.join(d+" ")+d).split(" "),E(e,b,c))}var d="2.8.3",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n="Webkit Moz O ms",o=n.split(" "),p=n.toLowerCase().split(" "),q={},r={},s={},t=[],u=t.slice,v,w=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},x={}.hasOwnProperty,y;!B(x,"undefined")&&!B(x.call,"undefined")?y=function(a,b){return x.call(a,b)}:y=function(a,b){return b in a&&B(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e}),q.csstransforms3d=function(){var a=!!F("perspective");return a&&"webkitPerspective"in g.style&&w("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a};for(var G in q)y(q,G)&&(v=G.toLowerCase(),e[v]=q[G](),t.push((e[v]?"":"no-")+v));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)y(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},z(""),i=k=null,function(a,b){function l(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function m(){var a=s.elements;return typeof a=="string"?a.split(" "):a}function n(a){var b=j[a[h]];return b||(b={},i++,a[h]=i,j[i]=b),b}function o(a,c,d){c||(c=b);if(k)return c.createElement(a);d||(d=n(c));var g;return d.cache[a]?g=d.cache[a].cloneNode():f.test(a)?g=(d.cache[a]=d.createElem(a)).cloneNode():g=d.createElem(a),g.canHaveChildren&&!e.test(a)&&!g.tagUrn?d.frag.appendChild(g):g}function p(a,c){a||(a=b);if(k)return a.createDocumentFragment();c=c||n(a);var d=c.frag.cloneNode(),e=0,f=m(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function q(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return s.shivMethods?o(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/[\w\-]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(s,b.frag)}function r(a){a||(a=b);var c=n(a);return s.shivCSS&&!g&&!c.hasCSS&&(c.hasCSS=!!l(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),k||q(a,c),a}var c="3.7.0",d=a.html5||{},e=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,f=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,g,h="_html5shiv",i=0,j={},k;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",g="hidden"in a,k=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){g=!0,k=!0}})();var s={elements:d.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:c,shivCSS:d.shivCSS!==!1,supportsUnknownElements:k,shivMethods:d.shivMethods!==!1,type:"default",shivDocument:r,createElement:o,createDocumentFragment:p};a.html5=s,r(b)}(this,b),e._version=d,e._prefixes=m,e._domPrefixes=p,e._cssomPrefixes=o,e.testProp=function(a){return D([a])},e.testAllProps=F,e.testStyles=w,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+t.join(" "):""),e}(this,this.document);

/* ========================================================================
* Bootstrap: button.js v3.3.1
* http://getbootstrap.com/javascript/#buttons
* ========================================================================
* Copyright 2011-2014 Twitter, Inc.
* Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
* ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.1'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

      // push to event loop to allow forms to submit
      setTimeout($.proxy(function () {
        $el[val](data[state] == null ? this.options[state] : data[state])

        if (state == 'loadingText') {
          this.isLoading = true
          $el.addClass(d).attr(d, d)
        } else if (this.isLoading) {
          this.isLoading = false
          $el.removeClass(d).removeAttr(d)
        }
      }, this), 0)
    }

    Button.prototype.toggle = function () {
      var changed = true
      var $parent = this.$element.closest('[data-toggle="buttons"]')

      if ($parent.length) {
        var $input = this.$element.find('input')
        if ($input.prop('type') == 'radio') {
          if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
            else $parent.find('.active').removeClass('active')
            }
            if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
            } else {
              this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
            }

            if (changed) this.$element.toggleClass('active')
            }


            // BUTTON PLUGIN DEFINITION
            // ========================

            function Plugin(option) {
              return this.each(function () {
                var $this   = $(this)
                var data    = $this.data('bs.button')
                var options = typeof option == 'object' && option

                if (!data) $this.data('bs.button', (data = new Button(this, options)))

                  if (option == 'toggle') data.toggle()
                    else if (option) data.setState(option)
                    })
                  }

                  var old = $.fn.button

                  $.fn.button             = Plugin
                  $.fn.button.Constructor = Button


                  // BUTTON NO CONFLICT
                  // ==================

                  $.fn.button.noConflict = function () {
                    $.fn.button = old
                    return this
                  }


                  // BUTTON DATA-API
                  // ===============

                  $(document)
                  .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
                    var $btn = $(e.target)
                    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
                      Plugin.call($btn, 'toggle')
                      e.preventDefault()
                    })
                    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
                      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
                    })

                  }(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.1
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $(this.options.trigger).filter('[href="#' + element.id + '"], [data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.1'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true,
    trigger: '[data-toggle="collapse"]'
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $.extend({}, $this.data(), { trigger: this })

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.1
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.1'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--                        // up
    if (e.which == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.1
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.3.1'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.1
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

;(function () {
  'use strict';

  /**
  * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
  *
  * @codingstandard ftlabs-jsv2
  * @copyright The Financial Times Limited [All Rights Reserved]
  * @license MIT License (see LICENSE.txt)
  */

  /*jslint browser:true, node:true*/
  /*global define, Event, Node*/


  /**
  * Instantiate fast-clicking listeners on the specified layer.
  *
  * @constructor
  * @param {Element} layer The layer to listen on
  * @param {Object} [options={}] The options to override the defaults
  */
  function FastClick(layer, options) {
    var oldOnClick;

    options = options || {};

    /**
    * Whether a click is currently being tracked.
    *
    * @type boolean
    */
    this.trackingClick = false;


    /**
    * Timestamp for when click tracking started.
    *
    * @type number
    */
    this.trackingClickStart = 0;


    /**
    * The element being tracked for a click.
    *
    * @type EventTarget
    */
    this.targetElement = null;


    /**
    * X-coordinate of touch start event.
    *
    * @type number
    */
    this.touchStartX = 0;


    /**
    * Y-coordinate of touch start event.
    *
    * @type number
    */
    this.touchStartY = 0;


    /**
    * ID of the last touch, retrieved from Touch.identifier.
    *
    * @type number
    */
    this.lastTouchIdentifier = 0;


    /**
    * Touchmove boundary, beyond which a click will be cancelled.
    *
    * @type number
    */
    this.touchBoundary = options.touchBoundary || 10;


    /**
    * The FastClick layer.
    *
    * @type Element
    */
    this.layer = layer;

    /**
    * The minimum time between tap(touchstart and touchend) events
    *
    * @type number
    */
    this.tapDelay = options.tapDelay || 200;

    /**
    * The maximum time for a tap
    *
    * @type number
    */
    this.tapTimeout = options.tapTimeout || 700;

    if (FastClick.notNeeded(layer)) {
      return;
    }

    // Some old versions of Android don't have Function.prototype.bind
    function bind(method, context) {
      return function() { return method.apply(context, arguments); };
    }


    var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
    var context = this;
    for (var i = 0, l = methods.length; i < l; i++) {
      context[methods[i]] = bind(context[methods[i]], context);
    }

    // Set up event handlers as required
    if (deviceIsAndroid) {
      layer.addEventListener('mouseover', this.onMouse, true);
      layer.addEventListener('mousedown', this.onMouse, true);
      layer.addEventListener('mouseup', this.onMouse, true);
    }

    layer.addEventListener('click', this.onClick, true);
    layer.addEventListener('touchstart', this.onTouchStart, false);
    layer.addEventListener('touchmove', this.onTouchMove, false);
    layer.addEventListener('touchend', this.onTouchEnd, false);
    layer.addEventListener('touchcancel', this.onTouchCancel, false);

    // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
    // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
    // layer when they are cancelled.
    if (!Event.prototype.stopImmediatePropagation) {
      layer.removeEventListener = function(type, callback, capture) {
        var rmv = Node.prototype.removeEventListener;
        if (type === 'click') {
          rmv.call(layer, type, callback.hijacked || callback, capture);
        } else {
          rmv.call(layer, type, callback, capture);
        }
      };

      layer.addEventListener = function(type, callback, capture) {
        var adv = Node.prototype.addEventListener;
        if (type === 'click') {
          adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
            if (!event.propagationStopped) {
              callback(event);
            }
          }), capture);
        } else {
          adv.call(layer, type, callback, capture);
        }
      };
    }

    // If a handler is already declared in the element's onclick attribute, it will be fired before
    // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
    // adding it as listener.
    if (typeof layer.onclick === 'function') {

      // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
      // - the old one won't work if passed to addEventListener directly.
      oldOnClick = layer.onclick;
      layer.addEventListener('click', function(event) {
        oldOnClick(event);
      }, false);
      layer.onclick = null;
    }
  }

  /**
  * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
  *
  * @type boolean
  */
  var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

  /**
  * Android requires exceptions.
  *
  * @type boolean
  */
  var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


  /**
  * iOS requires exceptions.
  *
  * @type boolean
  */
  var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


  /**
  * iOS 4 requires an exception for select elements.
  *
  * @type boolean
  */
  var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


  /**
  * iOS 6.0(+?) requires the target element to be manually derived
  *
  * @type boolean
  */
  var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);

  /**
  * BlackBerry requires exceptions.
  *
  * @type boolean
  */
  var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

  /**
  * Determine whether a given element requires a native click.
  *
  * @param {EventTarget|Element} target Target DOM element
  * @returns {boolean} Returns true if the element needs a native click
  */
  FastClick.prototype.needsClick = function(target) {
    switch (target.nodeName.toLowerCase()) {

      // Don't send a synthetic click to disabled inputs (issue #62)
      case 'button':
        case 'select':
          case 'textarea':
            if (target.disabled) {
              return true;
            }

            break;
            case 'input':

              // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
              if ((deviceIsIOS && target.type === 'file') || target.disabled) {
                return true;
              }

              break;
              case 'label':
                case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
                case 'video':
                  return true;
                }

                return (/\bneedsclick\b/).test(target.className);
              };


              /**
              * Determine whether a given element requires a call to focus to simulate click into element.
              *
              * @param {EventTarget|Element} target Target DOM element
              * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
              */
              FastClick.prototype.needsFocus = function(target) {
                switch (target.nodeName.toLowerCase()) {
                  case 'textarea':
                    return true;
                    case 'select':
                      return !deviceIsAndroid;
                      case 'input':
                        switch (target.type) {
                          case 'button':
                            case 'checkbox':
                              case 'file':
                                case 'image':
                                  case 'radio':
                                    case 'submit':
                                      return false;
                                    }

                                    // No point in attempting to focus disabled inputs
                                    return !target.disabled && !target.readOnly;
                                    default:
                                      return (/\bneedsfocus\b/).test(target.className);
                                    }
                                  };


                                  /**
                                  * Send a click event to the specified element.
                                  *
                                  * @param {EventTarget|Element} targetElement
                                  * @param {Event} event
                                  */
                                  FastClick.prototype.sendClick = function(targetElement, event) {
                                    var clickEvent, touch;

                                    // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
                                    if (document.activeElement && document.activeElement !== targetElement) {
                                      document.activeElement.blur();
                                    }

                                    touch = event.changedTouches[0];

                                    // Synthesise a click event, with an extra attribute so it can be tracked
                                    clickEvent = document.createEvent('MouseEvents');
                                    clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
                                    clickEvent.forwardedTouchEvent = true;
                                    targetElement.dispatchEvent(clickEvent);
                                  };

                                  FastClick.prototype.determineEventType = function(targetElement) {

                                    //Issue #159: Android Chrome Select Box does not open with a synthetic click event
                                    if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
                                      return 'mousedown';
                                    }

                                    return 'click';
                                  };


                                  /**
                                  * @param {EventTarget|Element} targetElement
                                  */
                                  FastClick.prototype.focus = function(targetElement) {
                                    var length;

                                    // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
                                    if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
                                      length = targetElement.value.length;
                                      targetElement.setSelectionRange(length, length);
                                    } else {
                                      targetElement.focus();
                                    }
                                  };


                                  /**
                                  * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
                                  *
                                  * @param {EventTarget|Element} targetElement
                                  */
                                  FastClick.prototype.updateScrollParent = function(targetElement) {
                                    var scrollParent, parentElement;

                                    scrollParent = targetElement.fastClickScrollParent;

                                    // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
                                    // target element was moved to another parent.
                                    if (!scrollParent || !scrollParent.contains(targetElement)) {
                                      parentElement = targetElement;
                                      do {
                                        if (parentElement.scrollHeight > parentElement.offsetHeight) {
                                          scrollParent = parentElement;
                                          targetElement.fastClickScrollParent = parentElement;
                                          break;
                                        }

                                        parentElement = parentElement.parentElement;
                                      } while (parentElement);
                                    }

                                    // Always update the scroll top tracker if possible.
                                    if (scrollParent) {
                                      scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
                                    }
                                  };


                                  /**
                                  * @param {EventTarget} targetElement
                                  * @returns {Element|EventTarget}
                                  */
                                  FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

                                    // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
                                    if (eventTarget.nodeType === Node.TEXT_NODE) {
                                      return eventTarget.parentNode;
                                    }

                                    return eventTarget;
                                  };


                                  /**
                                  * On touch start, record the position and scroll offset.
                                  *
                                  * @param {Event} event
                                  * @returns {boolean}
                                  */
                                  FastClick.prototype.onTouchStart = function(event) {
                                    var targetElement, touch, selection;

                                    // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
                                    if (event.targetTouches.length > 1) {
                                      return true;
                                    }

                                    targetElement = this.getTargetElementFromEventTarget(event.target);
                                    touch = event.targetTouches[0];

                                    if (deviceIsIOS) {

                                      // Only trusted events will deselect text on iOS (issue #49)
                                      selection = window.getSelection();
                                      if (selection.rangeCount && !selection.isCollapsed) {
                                        return true;
                                      }

                                      if (!deviceIsIOS4) {

                                        // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
                                        // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
                                        // with the same identifier as the touch event that previously triggered the click that triggered the alert.
                                        // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
                                        // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
                                        // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
                                        // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
                                        // random integers, it's safe to to continue if the identifier is 0 here.
                                        if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
                                          event.preventDefault();
                                          return false;
                                        }

                                        this.lastTouchIdentifier = touch.identifier;

                                        // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
                                        // 1) the user does a fling scroll on the scrollable layer
                                        // 2) the user stops the fling scroll with another tap
                                        // then the event.target of the last 'touchend' event will be the element that was under the user's finger
                                        // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
                                        // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
                                        this.updateScrollParent(targetElement);
                                      }
                                    }

                                    this.trackingClick = true;
                                    this.trackingClickStart = event.timeStamp;
                                    this.targetElement = targetElement;

                                    this.touchStartX = touch.pageX;
                                    this.touchStartY = touch.pageY;

                                    // Prevent phantom clicks on fast double-tap (issue #36)
                                    if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
                                      event.preventDefault();
                                    }

                                    return true;
                                  };


                                  /**
                                  * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
                                  *
                                  * @param {Event} event
                                  * @returns {boolean}
                                  */
                                  FastClick.prototype.touchHasMoved = function(event) {
                                    var touch = event.changedTouches[0], boundary = this.touchBoundary;

                                    if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
                                      return true;
                                    }

                                    return false;
                                  };


                                  /**
                                  * Update the last position.
                                  *
                                  * @param {Event} event
                                  * @returns {boolean}
                                  */
                                  FastClick.prototype.onTouchMove = function(event) {
                                    if (!this.trackingClick) {
                                      return true;
                                    }

                                    // If the touch has moved, cancel the click tracking
                                    if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
                                      this.trackingClick = false;
                                      this.targetElement = null;
                                    }

                                    return true;
                                  };


                                  /**
                                  * Attempt to find the labelled control for the given label element.
                                  *
                                  * @param {EventTarget|HTMLLabelElement} labelElement
                                  * @returns {Element|null}
                                  */
                                  FastClick.prototype.findControl = function(labelElement) {

                                    // Fast path for newer browsers supporting the HTML5 control attribute
                                    if (labelElement.control !== undefined) {
                                      return labelElement.control;
                                    }

                                    // All browsers under test that support touch events also support the HTML5 htmlFor attribute
                                    if (labelElement.htmlFor) {
                                      return document.getElementById(labelElement.htmlFor);
                                    }

                                    // If no for attribute exists, attempt to retrieve the first labellable descendant element
                                    // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
                                    return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
                                  };


                                  /**
                                  * On touch end, determine whether to send a click event at once.
                                  *
                                  * @param {Event} event
                                  * @returns {boolean}
                                  */
                                  FastClick.prototype.onTouchEnd = function(event) {
                                    var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

                                    if (!this.trackingClick) {
                                      return true;
                                    }

                                    // Prevent phantom clicks on fast double-tap (issue #36)
                                    if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
                                      this.cancelNextClick = true;
                                      return true;
                                    }

                                    if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
                                      return true;
                                    }

                                    // Reset to prevent wrong click cancel on input (issue #156).
                                    this.cancelNextClick = false;

                                    this.lastClickTime = event.timeStamp;

                                    trackingClickStart = this.trackingClickStart;
                                    this.trackingClick = false;
                                    this.trackingClickStart = 0;

                                    // On some iOS devices, the targetElement supplied with the event is invalid if the layer
                                    // is performing a transition or scroll, and has to be re-detected manually. Note that
                                    // for this to function correctly, it must be called *after* the event target is checked!
                                    // See issue #57; also filed as rdar://13048589 .
                                    if (deviceIsIOSWithBadTarget) {
                                      touch = event.changedTouches[0];

                                      // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
                                      targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
                                      targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
                                    }

                                    targetTagName = targetElement.tagName.toLowerCase();
                                    if (targetTagName === 'label') {
                                      forElement = this.findControl(targetElement);
                                      if (forElement) {
                                        this.focus(targetElement);
                                        if (deviceIsAndroid) {
                                          return false;
                                        }

                                        targetElement = forElement;
                                      }
                                    } else if (this.needsFocus(targetElement)) {

                                      // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
                                      // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
                                      if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
                                        this.targetElement = null;
                                        return false;
                                      }

                                      this.focus(targetElement);
                                      this.sendClick(targetElement, event);

                                      // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
                                      // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
                                      if (!deviceIsIOS || targetTagName !== 'select') {
                                        this.targetElement = null;
                                        event.preventDefault();
                                      }

                                      return false;
                                    }

                                    if (deviceIsIOS && !deviceIsIOS4) {

                                      // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
                                      // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
                                      scrollParent = targetElement.fastClickScrollParent;
                                      if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
                                        return true;
                                      }
                                    }

                                    // Prevent the actual click from going though - unless the target node is marked as requiring
                                    // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
                                    if (!this.needsClick(targetElement)) {
                                      event.preventDefault();
                                      this.sendClick(targetElement, event);
                                    }

                                    return false;
                                  };


                                  /**
                                  * On touch cancel, stop tracking the click.
                                  *
                                  * @returns {void}
                                  */
                                  FastClick.prototype.onTouchCancel = function() {
                                    this.trackingClick = false;
                                    this.targetElement = null;
                                  };


                                  /**
                                  * Determine mouse events which should be permitted.
                                  *
                                  * @param {Event} event
                                  * @returns {boolean}
                                  */
                                  FastClick.prototype.onMouse = function(event) {

                                    // If a target element was never set (because a touch event was never fired) allow the event
                                    if (!this.targetElement) {
                                      return true;
                                    }

                                    if (event.forwardedTouchEvent) {
                                      return true;
                                    }

                                    // Programmatically generated events targeting a specific element should be permitted
                                    if (!event.cancelable) {
                                      return true;
                                    }

                                    // Derive and check the target element to see whether the mouse event needs to be permitted;
                                    // unless explicitly enabled, prevent non-touch click events from triggering actions,
                                    // to prevent ghost/doubleclicks.
                                    if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

                                      // Prevent any user-added listeners declared on FastClick element from being fired.
                                      if (event.stopImmediatePropagation) {
                                        event.stopImmediatePropagation();
                                      } else {

                                        // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
                                        event.propagationStopped = true;
                                      }

                                      // Cancel the event
                                      event.stopPropagation();
                                      event.preventDefault();

                                      return false;
                                    }

                                    // If the mouse event is permitted, return true for the action to go through.
                                    return true;
                                  };


                                  /**
                                  * On actual clicks, determine whether this is a touch-generated click, a click action occurring
                                  * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
                                  * an actual click which should be permitted.
                                  *
                                  * @param {Event} event
                                  * @returns {boolean}
                                  */
                                  FastClick.prototype.onClick = function(event) {
                                    var permitted;

                                    // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
                                    if (this.trackingClick) {
                                      this.targetElement = null;
                                      this.trackingClick = false;
                                      return true;
                                    }

                                    // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
                                    if (event.target.type === 'submit' && event.detail === 0) {
                                      return true;
                                    }

                                    permitted = this.onMouse(event);

                                    // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
                                    if (!permitted) {
                                      this.targetElement = null;
                                    }

                                    // If clicks are permitted, return true for the action to go through.
                                    return permitted;
                                  };


                                  /**
                                  * Remove all FastClick's event listeners.
                                  *
                                  * @returns {void}
                                  */
                                  FastClick.prototype.destroy = function() {
                                    var layer = this.layer;

                                    if (deviceIsAndroid) {
                                      layer.removeEventListener('mouseover', this.onMouse, true);
                                      layer.removeEventListener('mousedown', this.onMouse, true);
                                      layer.removeEventListener('mouseup', this.onMouse, true);
                                    }

                                    layer.removeEventListener('click', this.onClick, true);
                                    layer.removeEventListener('touchstart', this.onTouchStart, false);
                                    layer.removeEventListener('touchmove', this.onTouchMove, false);
                                    layer.removeEventListener('touchend', this.onTouchEnd, false);
                                    layer.removeEventListener('touchcancel', this.onTouchCancel, false);
                                  };


                                  /**
                                  * Check whether FastClick is needed.
                                  *
                                  * @param {Element} layer The layer to listen on
                                  */
                                  FastClick.notNeeded = function(layer) {
                                    var metaViewport;
                                    var chromeVersion;
                                    var blackberryVersion;

                                    // Devices that don't support touch don't need FastClick
                                    if (typeof window.ontouchstart === 'undefined') {
                                      return true;
                                    }

                                    // Chrome version - zero for other browsers
                                    chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

                                    if (chromeVersion) {

                                      if (deviceIsAndroid) {
                                        metaViewport = document.querySelector('meta[name=viewport]');

                                        if (metaViewport) {
                                          // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
                                          if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                                            return true;
                                          }
                                          // Chrome 32 and above with width=device-width or less don't need FastClick
                                          if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
                                            return true;
                                          }
                                        }

                                        // Chrome desktop doesn't need FastClick (issue #15)
                                      } else {
                                        return true;
                                      }
                                    }

                                    if (deviceIsBlackBerry10) {
                                      blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

                                      // BlackBerry 10.3+ does not require Fastclick library.
                                      // https://github.com/ftlabs/fastclick/issues/251
                                      if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
                                        metaViewport = document.querySelector('meta[name=viewport]');

                                        if (metaViewport) {
                                          // user-scalable=no eliminates click delay.
                                          if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                                            return true;
                                          }
                                          // width=device-width (or less than device-width) eliminates click delay.
                                          if (document.documentElement.scrollWidth <= window.outerWidth) {
                                            return true;
                                          }
                                        }
                                      }
                                    }

                                    // IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
                                    if (layer.style.msTouchAction === 'none') {
                                      return true;
                                    }

                                    // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
                                    // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
                                    if (layer.style.touchAction === 'none') {
                                      return true;
                                    }

                                    return false;
                                  };


                                  /**
                                  * Factory method for creating a FastClick object
                                  *
                                  * @param {Element} layer The layer to listen on
                                  * @param {Object} [options={}] The options to override the defaults
                                  */
                                  FastClick.attach = function(layer, options) {
                                    return new FastClick(layer, options);
                                  };


                                  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {

                                    // AMD. Register as an anonymous module.
                                    define(function() {
                                      return FastClick;
                                    });
                                  } else if (typeof module !== 'undefined' && module.exports) {
                                    module.exports = FastClick.attach;
                                    module.exports.FastClick = FastClick;
                                  } else {
                                    window.FastClick = FastClick;
                                  }
                                }());

(function (factory, global) {

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals.
    factory(global.jQuery);
  }

}(function ($, undef) {

  var dataKey = 'plugin_hideShowPassword'
    , shorthandArgs = ['show', 'innerToggle']
    , SPACE = 32
    , ENTER = 13;

  var canSetInputAttribute = (function(){
    var body = document.body
      , input = document.createElement('input')
      , result = true;
    if (! body) {
      body = document.createElement('body');
    }
    input = body.appendChild(input);
    try {
      input.setAttribute('type', 'text');
    } catch (e) {
      result = false;
    }
    body.removeChild(input);
    return result;
  }());

  var defaults = {
    // Visibility of the password text. Can be true, false, 'toggle'
    // or 'infer'. If 'toggle', it will be the opposite of whatever
    // it currently is. If 'infer', it will be based on the input
    // type (false if 'password', otherwise true).
    show: 'infer',

    // Set to true to create an inner toggle for this input. Can
    // also be sent to an event name to delay visibility of toggle
    // until that event is triggered on the input element.
    innerToggle: false,

    // If false, the plugin will be disabled entirely. Set to
    // the outcome of a test to insure input attributes can be
    // set after input has been inserted into the DOM.
    enable: canSetInputAttribute,

    // Class to add to input element when the plugin is enabled.
    className: 'hideShowPassword-field',

    // Event to trigger when the plugin is initialized and enabled.
    initEvent: 'hideShowPasswordInit',

    // Event to trigger whenever the visibility changes.
    changeEvent: 'passwordVisibilityChange',

    // Properties to add to the input element.
    props: {
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      spellcheck: 'false'
    },

    // Options specific to the inner toggle.
    toggle: {
      // The element to create.
      element: '<button type="button">',
      // Class name of element.
      className: 'hideShowPassword-toggle',
      // Whether or not to support touch-specific enhancements.
      // Defaults to the value of Modernizr.touch if available,
      // otherwise false.
      touchSupport: (typeof Modernizr === 'undefined') ? false : Modernizr.touch,
      // Non-touch event to bind to.
      attachToEvent: 'click',
      // Event to bind to when touchSupport is true.
      attachToTouchEvent: 'touchstart mousedown',
      // Key event to bind to if attachToKeyCodes is an array
      // of at least one keycode.
      attachToKeyEvent: 'keyup',
      // Key codes to bind the toggle event to for accessibility.
      // If false, this feature is disabled entirely.
      // If true, the array of key codes will be determined based
      // on the value of the element option.
      attachToKeyCodes: true,
      // Styles to add to the toggle element. Does not include
      // positioning styles.
      styles: { position: 'absolute' },
      // Styles to add only when touchSupport is true.
      touchStyles: { pointerEvents: 'none' },
      // Where to position the inner toggle relative to the
      // input element. Can be 'right', 'left' or 'infer'. If
      // 'infer', it will be based on the text-direction of the
      // input element.
      position: 'infer',
      // Where to position the inner toggle on the y-axis
      // relative to the input element. Can be 'top', 'bottom'
      // or 'middle'.
      verticalAlign: 'middle',
      // Amount by which to "offset" the toggle from the edge
      // of the input element.
      offset: 0,
      // Attributes to add to the toggle element.
      attr: {
        role: 'button',
        'aria-label': 'Show Password',
        tabIndex: 0
      }
    },

    // Options specific to the wrapper element, created
    // when the innerToggle is initialized to help with
    // positioning of that element.
    wrapper: {
      // The element to create.
      element: '<div>',
      // Class name of element.
      className: 'hideShowPassword-wrapper',
      // If true, the width of the wrapper will be set
      // unless it is already the same width as the inner
      // element. If false, the width will never be set. Any
      // other value will be used as the width.
      enforceWidth: true,
      // Styles to add to the wrapper element. Does not
      // include inherited styles or width if enforceWidth
      // is not false.
      styles: { position: 'relative' },
      // Styles to "inherit" from the input element, allowing
      // the wrapper to avoid disrupting page styles.
      inheritStyles: [
        'display',
        'verticalAlign',
        'marginTop',
        'marginRight',
        'marginBottom',
        'marginLeft'
      ],
      // Styles for the input element when wrapped.
      innerElementStyles: {
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0
      }
    },

    // Options specific to the 'shown' or 'hidden'
    // states of the input element.
    states: {
      shown: {
        className: 'hideShowPassword-shown',
        changeEvent: 'passwordShown',
        props: { type: 'text' },
        toggle: {
          className: 'hideShowPassword-toggle-hide',
          content: 'Hide',
          attr: { 'aria-pressed': 'true' }
        }
      },
      hidden: {
        className: 'hideShowPassword-hidden',
        changeEvent: 'passwordHidden',
        props: { type: 'password' },
        toggle: {
          className: 'hideShowPassword-toggle-show',
          content: 'Show',
          attr: { 'aria-pressed': 'false' }
        }
      }
    }

  };

  function HideShowPassword (element, options) {
    this.element = $(element);
    this.wrapperElement = $();
    this.toggleElement = $();
    this.init(options);
  }

  HideShowPassword.prototype = {

    init: function (options) {
      if (this.update(options, defaults)) {
        this.element.addClass(this.options.className);
        if (this.options.innerToggle) {
          this.wrapElement(this.options.wrapper);
          this.initToggle(this.options.toggle);
          if (typeof this.options.innerToggle === 'string') {
            this.toggleElement.hide();
            this.element.one(this.options.innerToggle, $.proxy(function(){
              this.toggleElement.show();
            }, this));
          }
        }
        this.element.trigger(this.options.initEvent, [ this ]);
      }
    },

    update: function (options, base) {
      this.options = this.prepareOptions(options, base);
      if (this.updateElement()) {
        this.element
          .trigger(this.options.changeEvent, [ this ])
          .trigger(this.state().changeEvent, [ this ]);
      }
      return this.options.enable;
    },

    toggle: function (showVal) {
      showVal = showVal || 'toggle';
      return this.update({ show: showVal });
    },

    prepareOptions: function (options, base) {
      var keyCodes = []
        , testElement;
      base = base || this.options;
      options = $.extend(true, {}, base, options);
      if (options.enable) {
        if (options.show === 'toggle') {
          options.show = this.isType('hidden', options.states);
        } else if (options.show === 'infer') {
          options.show = this.isType('shown', options.states);
        }
        if (options.toggle.position === 'infer') {
          options.toggle.position = (this.element.css('text-direction') === 'rtl') ? 'left' : 'right';
        }
        if (! $.isArray(options.toggle.attachToKeyCodes)) {
          if (options.toggle.attachToKeyCodes === true) {
            testElement = $(options.toggle.element);
            switch(testElement.prop('tagName').toLowerCase()) {
              case 'button':
              case 'input':
                break;
              case 'a':
                if (testElement.filter('[href]').length) {
                  keyCodes.push(SPACE);
                  break;
                }
              default:
                keyCodes.push(SPACE, ENTER);
                break;
            }
          }
          options.toggle.attachToKeyCodes = keyCodes;
        }
      }
      return options;
    },

    updateElement: function () {
      if (! this.options.enable || this.isType()) return false;
      this.element
        .prop($.extend({}, this.options.props, this.state().props))
        .addClass(this.state().className)
        .removeClass(this.otherState().className);
      this.updateToggle();
      return true;
    },

    isType: function (comparison, states) {
      states = states || this.options.states;
      comparison = comparison || this.state(undef, undef, states).props.type;
      if (states[comparison]) {
        comparison = states[comparison].props.type;
      }
      return this.element.prop('type') === comparison;
    },

    state: function (key, invert, states) {
      states = states || this.options.states;
      if (key === undef) {
        key = this.options.show;
      }
      if (typeof key === 'boolean') {
        key = key ? 'shown' : 'hidden';
      }
      if (invert) {
        key = (key === 'shown') ? 'hidden' : 'shown';
      }
      return states[key];
    },

    otherState: function (key) {
      return this.state(key, true);
    },

    wrapElement: function (options) {
      var enforceWidth = options.enforceWidth
        , targetWidth;
      if (! this.wrapperElement.length) {
        targetWidth = this.element.outerWidth();
        $.each(options.inheritStyles, $.proxy(function (index, prop) {
          options.styles[prop] = this.element.css(prop);
        }, this));
        this.element.css(options.innerElementStyles).wrap(
          $(options.element).addClass(options.className).css(options.styles)
        );
        this.wrapperElement = this.element.parent();
        if (enforceWidth === true) {
          enforceWidth = (this.wrapperElement.outerWidth() === targetWidth) ? false : targetWidth;
        }
        if (enforceWidth !== false) {
          this.wrapperElement.css('width', enforceWidth);
        }
      }
      return this.wrapperElement;
    },

    initToggle: function (options) {
      if (! this.toggleElement.length) {
        // Create element
        this.toggleElement = $(options.element)
          .attr(options.attr)
          .addClass(options.className)
          .css(options.styles)
          .appendTo(this.wrapperElement);
        // Update content/attributes
        this.updateToggle();
        // Position
        this.positionToggle(options.position, options.verticalAlign, options.offset);
        // Events
        if (options.touchSupport) {
          this.toggleElement.css(options.touchStyles);
          this.element.on(options.attachToTouchEvent, $.proxy(this.toggleTouchEvent, this));
        } else {
          this.toggleElement.on(options.attachToEvent, $.proxy(this.toggleEvent, this));
        }
        if (options.attachToKeyCodes.length) {
          this.toggleElement.on(options.attachToKeyEvent, $.proxy(this.toggleKeyEvent, this));
        }
      }
      return this.toggleElement;
    },

    positionToggle: function (position, verticalAlign, offset) {
      var styles = {};
      styles[position] = offset;
      switch (verticalAlign) {
        case 'top':
        case 'bottom':
          styles[verticalAlign] = offset;
          break;
        case 'middle':
          styles['top'] = '50%';
          styles['marginTop'] = this.toggleElement.outerHeight() / -2;
          break;
      }
      return this.toggleElement.css(styles);
    },

    updateToggle: function (state, otherState) {
      var paddingProp
        , targetPadding;
      if (this.toggleElement.length) {
        paddingProp = 'padding-' + this.options.toggle.position;
        state = state || this.state().toggle;
        otherState = otherState || this.otherState().toggle;
        this.toggleElement
          .attr(state.attr)
          .addClass(state.className)
          .removeClass(otherState.className)
          .html(state.content);
        targetPadding = this.toggleElement.outerWidth() + (this.options.toggle.offset * 2);
        if (this.element.css(paddingProp) !== targetPadding) {
          this.element.css(paddingProp, targetPadding);
        }
      }
      return this.toggleElement;
    },

    toggleEvent: function (event) {
      event.preventDefault();
      this.toggle();
    },

    toggleKeyEvent: function (event) {
      $.each(this.options.toggle.attachToKeyCodes, $.proxy(function(index, keyCode) {
        if (event.which === keyCode) {
          this.toggleEvent(event);
          return false;
        }
      }, this));
    },

    toggleTouchEvent: function (event) {
      var toggleX = this.toggleElement.offset().left
        , eventX
        , lesser
        , greater;
      if (toggleX) {
        eventX = event.pageX || event.originalEvent.pageX;
        if (this.options.toggle.position === 'left') {
          toggleX+= this.toggleElement.outerWidth();
          lesser = eventX;
          greater = toggleX;
        } else {
          lesser = toggleX;
          greater = eventX;
        }
        if (greater >= lesser) {
          this.toggleEvent(event);
        }
      }
    }

  };

  $.fn.hideShowPassword = function () {
    var options = {};
    $.each(arguments, function (index, value) {
      var newOptions = {};
      if (typeof value === 'object') {
        newOptions = value;
      } else if (shorthandArgs[index]) {
        newOptions[shorthandArgs[index]] = value;
      } else {
        return false;
      }
      $.extend(true, options, newOptions);
    });
    return this.each(function(){
      var $this = $(this)
        , data = $this.data(dataKey);
      if (data) {
        data.update(options);
      } else {
        $this.data(dataKey, new HideShowPassword(this, options));
      }
    });
  };

  $.each({ 'show':true, 'hide':false, 'toggle':'toggle' }, function (verb, showVal) {
    $.fn[verb + 'Password'] = function (innerToggle, options) {
      return this.hideShowPassword(showVal, innerToggle, options);
    };
  });

}, this));

/*
International Telephone Input v3.8.6
https://github.com/Bluefieldscom/intl-tel-input.git
*/
// wrap in UMD - see https://github.com/umdjs/umd/blob/master/jqueryPlugin.js
(function(factory) {
    if (typeof define === "function" && define.amd) {
        define([ "jquery" ], function($) {
            factory($, window, document);
        });
    } else {
        factory(jQuery, window, document);
    }
})(function($, window, document, undefined) {
    "use strict";
    var pluginName = "intlTelInput", id = 1, // give each instance it's own id for namespaced event handling
    defaults = {
        // automatically format the number according to the selected country
        autoFormat: true,
        // if there is just a dial code in the input: remove it on blur, and re-add it on focus
        autoHideDialCode: true,
        // default country
        defaultCountry: "",
        // token for ipinfo - required for https or over 1000 daily page views support
        ipinfoToken: "",
        // don't insert international dial codes
        nationalMode: false,
        // number type to use for placeholders
        numberType: "MOBILE",
        // display only these countries
        onlyCountries: [],
        // the countries at the top of the list. defaults to united states and united kingdom
        preferredCountries: [ "us", "gb" ],
        // stop the user from typing invalid numbers
        preventInvalidNumbers: false,
        // make the dropdown the same width as the input
        responsiveDropdown: false,
        // specify the path to the libphonenumber script to enable validation/formatting
        utilsScript: ""
    }, keys = {
        UP: 38,
        DOWN: 40,
        ENTER: 13,
        ESC: 27,
        PLUS: 43,
        A: 65,
        Z: 90,
        ZERO: 48,
        NINE: 57,
        SPACE: 32,
        BSPACE: 8,
        DEL: 46,
        CTRL: 17,
        CMD1: 91,
        // Chrome
        CMD2: 224
    }, windowLoaded = false;
    // keep track of if the window.load event has fired as impossible to check after the fact
    $(window).load(function() {
        windowLoaded = true;
    });
    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        // event namespace
        this.ns = "." + pluginName + id++;
        // Chrome, FF, Safari, IE9+
        this.isGoodBrowser = Boolean(element.setSelectionRange);
        this.hadInitialPlaceholder = Boolean($(element).attr("placeholder"));
        this._name = pluginName;
        this.init();
    }
    Plugin.prototype = {
        init: function() {
            var that = this;
            // if defaultCountry is set to "auto", we must do a lookup first
            if (this.options.defaultCountry == "auto") {
                // reset this in case lookup fails
                this.options.defaultCountry = "";
                var ipinfoURL = "//ipinfo.io";
                if (this.options.ipinfoToken) {
                    ipinfoURL += "?token=" + this.options.ipinfoToken;
                }
                $.get(ipinfoURL, function(response) {
                    if (response && response.country) {
                        that.options.defaultCountry = response.country.toLowerCase();
                    }
                }, "jsonp").always(function() {
                    that._ready();
                });
            } else {
                this._ready();
            }
        },
        _ready: function() {
            // if in nationalMode, disable options relating to dial codes
            if (this.options.nationalMode) {
                this.options.autoHideDialCode = false;
            }
            // IE Mobile doesn't support the keypress event (see issue 68) which makes autoFormat impossible
            if (navigator.userAgent.match(/IEMobile/i)) {
                this.options.autoFormat = false;
            }
            // auto enable responsiveDropdown mode on small screens (dropdown is currently set to 430px in CSS)
            if (window.innerWidth < 500) {
                this.options.responsiveDropdown = true;
            }
            // process all the data: onlyCountries, preferredCountries etc
            this._processCountryData();
            // generate the markup
            this._generateMarkup();
            // set the initial state of the input value and the selected flag
            this._setInitialState();
            // start all of the event listeners: autoHideDialCode, input keydown, selectedFlag click
            this._initListeners();
        },
        /********************
   *  PRIVATE METHODS
   ********************/
        // prepare all of the country data, including onlyCountries and preferredCountries options
        _processCountryData: function() {
            // set the instances country data objects
            this._setInstanceCountryData();
            // set the preferredCountries property
            this._setPreferredCountries();
        },
        // add a country code to this.countryCodes
        _addCountryCode: function(iso2, dialCode, priority) {
            if (!(dialCode in this.countryCodes)) {
                this.countryCodes[dialCode] = [];
            }
            var index = priority || 0;
            this.countryCodes[dialCode][index] = iso2;
        },
        // process onlyCountries array if present, and generate the countryCodes map
        _setInstanceCountryData: function() {
            var i;
            // process onlyCountries option
            if (this.options.onlyCountries.length) {
                this.countries = [];
                for (i = 0; i < allCountries.length; i++) {
                    if ($.inArray(allCountries[i].iso2, this.options.onlyCountries) != -1) {
                        this.countries.push(allCountries[i]);
                    }
                }
            } else {
                this.countries = allCountries;
            }
            // generate countryCodes map
            this.countryCodes = {};
            for (i = 0; i < this.countries.length; i++) {
                var c = this.countries[i];
                this._addCountryCode(c.iso2, c.dialCode, c.priority);
                // area codes
                if (c.areaCodes) {
                    for (var j = 0; j < c.areaCodes.length; j++) {
                        // full dial code is country code + dial code
                        this._addCountryCode(c.iso2, c.dialCode + c.areaCodes[j]);
                    }
                }
            }
        },
        // process preferred countries - iterate through the preferences,
        // fetching the country data for each one
        _setPreferredCountries: function() {
            this.preferredCountries = [];
            for (var i = 0; i < this.options.preferredCountries.length; i++) {
                var countryCode = this.options.preferredCountries[i], countryData = this._getCountryData(countryCode, false, true);
                if (countryData) {
                    this.preferredCountries.push(countryData);
                }
            }
        },
        // generate all of the markup for the plugin: the selected flag overlay, and the dropdown
        _generateMarkup: function() {
            // telephone input
            this.telInput = $(this.element);
            // prevent autocomplete as there's no safe, cross-browser event we can react to, so it can easily put the plugin in an inconsistent state e.g. the wrong flag selected for the autocompleted number, which on submit could mean the wrong number is saved (esp in nationalMode)
            this.telInput.attr("autocomplete", "off");
            // containers (mostly for positioning)
            this.telInput.wrap($("<div>", {
                "class": "intl-tel-input"
            }));
            var flagsContainer = $("<div>", {
                "class": "flag-dropdown"
            }).insertAfter(this.telInput);
            // currently selected flag (displayed to left of input)
            var selectedFlag = $("<div>", {
                "class": "selected-flag"
            }).appendTo(flagsContainer);
            this.selectedFlagInner = $("<div>", {
                "class": "flag"
            }).appendTo(selectedFlag);
            // CSS triangle
            $("<div>", {
                "class": "arrow"
            }).appendTo(this.selectedFlagInner);
            // country list contains: preferred countries, then divider, then all countries
            this.countryList = $("<ul>", {
                "class": "country-list v-hide"
            }).appendTo(flagsContainer);
            if (this.preferredCountries.length) {
                this._appendListItems(this.preferredCountries, "preferred");
                $("<li>", {
                    "class": "divider"
                }).appendTo(this.countryList);
            }
            this._appendListItems(this.countries, "");
            // now we can grab the dropdown height, and hide it properly
            this.dropdownHeight = this.countryList.outerHeight();
            this.countryList.removeClass("v-hide").addClass("hide");
            // and set the width
            if (this.options.responsiveDropdown) {
                this.countryList.outerWidth(this.telInput.outerWidth());
            }
            // this is useful in lots of places
            this.countryListItems = this.countryList.children(".country");
        },
        // add a country <li> to the countryList <ul> container
        _appendListItems: function(countries, className) {
            // we create so many DOM elements, I decided it was faster to build a temp string
            // and then add everything to the DOM in one go at the end
            var tmp = "";
            // for each country
            for (var i = 0; i < countries.length; i++) {
                var c = countries[i];
                // open the list item
                tmp += "<li class='country " + className + "' data-dial-code='" + c.dialCode + "' data-country-code='" + c.iso2 + "'>";
                // add the flag
                tmp += "<div class='flag " + c.iso2 + "'></div>";
                // and the country name and dial code
                tmp += "<span class='country-name'>" + c.name + "</span>";
                tmp += "<span class='dial-code'>+" + c.dialCode + "</span>";
                // close the list item
                tmp += "</li>";
            }
            this.countryList.append(tmp);
        },
        // set the initial state of the input value and the selected flag
        _setInitialState: function() {
            var val = this.telInput.val();
            // if there is a number, and it's valid, we can go ahead and set the flag, else fall back to default
            if (this._getDialCode(val)) {
                this._updateFlagFromNumber(val);
            } else {
                var defaultCountry;
                // check the defaultCountry option, else fall back to the first in the list
                if (this.options.defaultCountry) {
                    defaultCountry = this._getCountryData(this.options.defaultCountry, false, false);
                } else {
                    defaultCountry = this.preferredCountries.length ? this.preferredCountries[0] : this.countries[0];
                }
                this._selectFlag(defaultCountry.iso2);
                // if empty, insert the default dial code (this function will check !nationalMode and !autoHideDialCode)
                if (!val) {
                    this._updateDialCode(defaultCountry.dialCode, false);
                }
            }
            // format
            if (val) {
                // this wont be run after _updateDialCode as that's only called if no val
                this._updateVal(val, false);
            }
        },
        // initialise the main event listeners: input keyup, and click selected flag
        _initListeners: function() {
            var that = this;
            this._initKeyListeners();
            // autoFormat prevents the change event from firing, so we need to check for changes between focus and blur in order to manually trigger it
            if (this.options.autoHideDialCode || this.options.autoFormat) {
                this._initFocusListeners();
            }
            // hack for input nested inside label: clicking the selected-flag to open the dropdown would then automatically trigger a 2nd click on the input which would close it again
            var label = this.telInput.closest("label");
            if (label.length) {
                label.on("click" + this.ns, function(e) {
                    // if the dropdown is closed, then focus the input, else ignore the click
                    if (that.countryList.hasClass("hide")) {
                        that.telInput.focus();
                    } else {
                        e.preventDefault();
                    }
                });
            }
            // toggle country dropdown on click
            var selectedFlag = this.selectedFlagInner.parent();
            selectedFlag.on("click" + this.ns, function(e) {
                // only intercept this event if we're opening the dropdown
                // else let it bubble up to the top ("click-off-to-close" listener)
                // we cannot just stopPropagation as it may be needed to close another instance
                if (that.countryList.hasClass("hide") && !that.telInput.prop("disabled") && !that.telInput.prop("readonly")) {
                    that._showDropdown();
                }
            });
            // if the user has specified the path to the utils script, fetch it on window.load
            if (this.options.utilsScript) {
                // if the plugin is being initialised after the window.load event has already been fired
                if (windowLoaded) {
                    this.loadUtils();
                } else {
                    // wait until the load event so we don't block any other requests e.g. the flags image
                    $(window).load(function() {
                        that.loadUtils();
                    });
                }
            }
        },
        _initKeyListeners: function() {
            var that = this;
            if (this.options.autoFormat) {
                // format number and update flag on keypress
                // use keypress event as we want to ignore all input except for a select few keys,
                // but we dont want to ignore the navigation keys like the arrows etc.
                // NOTE: no point in refactoring this to only bind these listeners on focus/blur because then you would need to have those 2 listeners running the whole time anyway...
                this.telInput.on("keypress" + this.ns, function(e) {
                    // 32 is space, and after that it's all chars (not meta/nav keys)
                    // this fix is needed for Firefox, which triggers keypress event for some meta/nav keys
                    // Update: also ignore if this is a metaKey e.g. FF and Safari trigger keypress on the v of Ctrl+v
                    // Update: also check that we have utils before we do any autoFormat stuff
                    if (e.which >= keys.SPACE && !e.metaKey && window.intlTelInputUtils && !that.telInput.prop("readonly")) {
                        e.preventDefault();
                        // allowed keys are just numeric keys and plus
                        // we must allow plus for the case where the user does select-all and then hits plus to start typing a new number. we could refine this logic to first check that the selection contains a plus, but that wont work in old browsers, and I think it's overkill anyway
                        var isAllowedKey = e.which >= keys.ZERO && e.which <= keys.NINE || e.which == keys.PLUS, input = that.telInput[0], noSelection = that.isGoodBrowser && input.selectionStart == input.selectionEnd, max = that.telInput.attr("maxlength"), val = that.telInput.val(), // assumes that if max exists, it is >0
                        isBelowMax = max ? val.length < max : true;
                        // first: ensure we dont go over maxlength. we must do this here to prevent adding digits in the middle of the number
                        // still reformat even if not an allowed key as they could by typing a formatting char, but ignore if there's a selection as doesn't make sense to replace selection with illegal char and then immediately remove it
                        if (isBelowMax && (isAllowedKey || noSelection)) {
                            var newChar = isAllowedKey ? String.fromCharCode(e.which) : null;
                            that._handleInputKey(newChar, true);
                            // if something has changed, trigger the input event (which was otherwised squashed by the preventDefault)
                            if (val != that.telInput.val()) {
                                that.telInput.trigger("input");
                            }
                        }
                        if (!isAllowedKey) {
                            that.telInput.trigger("invalidkey");
                        }
                    }
                });
            }
            // handle keyup event
            // for autoFormat: we use keyup to catch cut/paste events and also delete events (after the fact)
            this.telInput.on("keyup" + this.ns, function(e) {
                // the "enter" key event from selecting a dropdown item is triggered here on the input, because the document.keydown handler that initially handles that event triggers a focus on the input, and so the keyup for that same key event gets triggered here. weird, but just make sure we dont bother doing any re-formatting in this case (we've already done preventDefault in the keydown handler, so it wont actually submit the form or anything).
                // ALSO: ignore keyup if readonly
                if (e.which == keys.ENTER || that.telInput.prop("readonly")) {} else if (that.options.autoFormat && window.intlTelInputUtils) {
                    var isCtrl = e.which == keys.CTRL || e.which == keys.CMD1 || e.which == keys.CMD2, input = that.telInput[0], // noSelection defaults to false for bad browsers, else would be reformatting on all ctrl keys e.g. select-all/copy
                    noSelection = that.isGoodBrowser && input.selectionStart == input.selectionEnd, // cursorAtEnd defaults to false for bad browsers else they would never get a reformat on delete
                    cursorAtEnd = that.isGoodBrowser && input.selectionStart == that.telInput.val().length;
                    // if delete in the middle: reformat with no suffix (no need to reformat if delete at end)
                    // if backspace: reformat with no suffix (need to reformat if at end to remove any lingering suffix - this is a feature)
                    // if ctrl and no selection (i.e. could have just been a paste): reformat (if cursorAtEnd: add suffix)
                    if (e.which == keys.DEL && !cursorAtEnd || e.which == keys.BSPACE || isCtrl && noSelection) {
                        // important to remember never to add suffix on any delete key as can fuck up in ie8 so you can never delete a formatting char at the end
                        that._handleInputKey(null, isCtrl && cursorAtEnd);
                    }
                    // prevent deleting the plus (if not in nationalMode)
                    if (!that.options.nationalMode) {
                        var val = that.telInput.val();
                        if (val.substr(0, 1) != "+") {
                            // newCursorPos is current pos + 1 to account for the plus we are about to add
                            var newCursorPos = that.isGoodBrowser ? input.selectionStart + 1 : 0;
                            that.telInput.val("+" + val);
                            if (that.isGoodBrowser) {
                                input.setSelectionRange(newCursorPos, newCursorPos);
                            }
                        }
                    }
                } else {
                    // if no autoFormat, just update flag
                    that._updateFlagFromNumber(that.telInput.val());
                }
            });
        },
        // when autoFormat is enabled: handle various key events on the input: the 2 main situations are 1) adding a new number character, which will replace any selection, reformat, and preserve the cursor position. and 2) reformatting on backspace, or paste event (etc)
        _handleInputKey: function(newNumericChar, addSuffix) {
            var val = this.telInput.val(), numericBefore = this._getNumeric(val), originalLeftChar, // raw DOM element
            input = this.telInput[0], digitsOnRight = 0;
            if (this.isGoodBrowser) {
                // cursor strategy: maintain the number of digits on the right. we use the right instead of the left so that A) we dont have to account for the new digit (or digits if paste event), and B) we're always on the right side of formatting suffixes
                digitsOnRight = this._getDigitsOnRight(val, input.selectionEnd);
                // if handling a new number character: insert it in the right place
                if (newNumericChar) {
                    // replace any selection they may have made with the new char
                    val = val.substr(0, input.selectionStart) + newNumericChar + val.substring(input.selectionEnd, val.length);
                } else {
                    // here we're not handling a new char, we're just doing a re-format (e.g. on delete/backspace/paste, after the fact), but we still need to maintain the cursor position. so make note of the char on the left, and then after the re-format, we'll count in the same number of digits from the right, and then keep going through any formatting chars until we hit the same left char that we had before.
                    originalLeftChar = val.charAt(input.selectionStart - 1);
                }
            } else if (newNumericChar) {
                val += newNumericChar;
            }
            // update the number and flag
            this.setNumber(val, addSuffix);
            val = this.telInput.val();
            var numericAfter = this._getNumeric(val), numericIsSame = numericBefore == numericAfter;
            if (this.options.preventInvalidNumbers && newNumericChar) {
                if (numericIsSame) {
                    // if we're trying to add a new numeric char and the numeric digits haven't changed, then trigger invalid
                    this.telInput.trigger("invalidkey");
                } else if (numericBefore.length == numericAfter.length) {
                    // preventInvalidNumbers edge case: adding digit in middle of full number, so a digit gets dropped from the end (numeric digits have changed but are same length)
                    digitsOnRight--;
                }
            }
            // update the cursor position
            if (this.isGoodBrowser) {
                var newCursor;
                // if it was at the end, keep it there
                if (!digitsOnRight) {
                    newCursor = val.length;
                } else {
                    // else count in the same number of digits from the right
                    newCursor = this._getCursorFromDigitsOnRight(val, digitsOnRight);
                    // but if delete/paste etc, keep going left until hit the same left char as before
                    if (!newNumericChar) {
                        newCursor = this._getCursorFromLeftChar(val, newCursor, originalLeftChar);
                    }
                }
                // set the new cursor
                input.setSelectionRange(newCursor, newCursor);
            }
        },
        // we start from the position in guessCursor, and work our way left until we hit the originalLeftChar or a number to make sure that after reformatting the cursor has the same char on the left in the case of a delete etc
        _getCursorFromLeftChar: function(val, guessCursor, originalLeftChar) {
            for (var i = guessCursor; i > 0; i--) {
                var leftChar = val.charAt(i - 1);
                if (leftChar == originalLeftChar || $.isNumeric(leftChar)) {
                    return i;
                }
            }
            return 0;
        },
        // after a reformat we need to make sure there are still the same number of digits to the right of the cursor
        _getCursorFromDigitsOnRight: function(val, digitsOnRight) {
            for (var i = val.length - 1; i >= 0; i--) {
                if ($.isNumeric(val.charAt(i))) {
                    if (--digitsOnRight === 0) {
                        return i;
                    }
                }
            }
            return 0;
        },
        // get the number of numeric digits to the right of the cursor so we can reposition the cursor correctly after the reformat has happened
        _getDigitsOnRight: function(val, selectionEnd) {
            var digitsOnRight = 0;
            for (var i = selectionEnd; i < val.length; i++) {
                if ($.isNumeric(val.charAt(i))) {
                    digitsOnRight++;
                }
            }
            return digitsOnRight;
        },
        // listen for focus and blur
        _initFocusListeners: function() {
            var that = this;
            if (this.options.autoHideDialCode) {
                // mousedown decides where the cursor goes, so if we're focusing we must preventDefault as we'll be inserting the dial code, and we want the cursor to be at the end no matter where they click
                this.telInput.on("mousedown" + this.ns, function(e) {
                    if (!that.telInput.is(":focus") && !that.telInput.val()) {
                        e.preventDefault();
                        // but this also cancels the focus, so we must trigger that manually
                        that.telInput.focus();
                    }
                });
            }
            this.telInput.on("focus" + this.ns, function(e) {
                var value = that.telInput.val();
                // save this to compare on blur
                that.telInput.data("focusVal", value);
                // on focus: if empty, insert the dial code for the currently selected flag
                if (that.options.autoHideDialCode && !value && !that.telInput.prop("readonly")) {
                    that._updateVal("+" + that.selectedCountryData.dialCode, true);
                    // after auto-inserting a dial code, if the first key they hit is '+' then assume they are entering a new number, so remove the dial code. use keypress instead of keydown because keydown gets triggered for the shift key (required to hit the + key), and instead of keyup because that shows the new '+' before removing the old one
                    that.telInput.one("keypress.plus" + that.ns, function(e) {
                        if (e.which == keys.PLUS) {
                            // if autoFormat is enabled, this key event will have already have been handled by another keypress listener (hence we need to add the "+"). if disabled, it will be handled after this by a keyup listener (hence no need to add the "+").
                            var newVal = that.options.autoFormat && window.intlTelInputUtils ? "+" : "";
                            that.telInput.val(newVal);
                        }
                    });
                    // after tabbing in, make sure the cursor is at the end we must use setTimeout to get outside of the focus handler as it seems the selection happens after that
                    setTimeout(function() {
                        var input = that.telInput[0];
                        if (that.isGoodBrowser) {
                            var len = that.telInput.val().length;
                            input.setSelectionRange(len, len);
                        }
                    });
                }
            });
            this.telInput.on("blur" + this.ns, function() {
                if (that.options.autoHideDialCode) {
                    // on blur: if just a dial code then remove it
                    var value = that.telInput.val(), startsPlus = value.substr(0, 1) == "+";
                    if (startsPlus) {
                        var numeric = that._getNumeric(value);
                        // if just a plus, or if just a dial code
                        if (!numeric || that.selectedCountryData.dialCode == numeric) {
                            that.telInput.val("");
                        }
                    }
                    // remove the keypress listener we added on focus
                    that.telInput.off("keypress.plus" + that.ns);
                }
                // if autoFormat, we must manually trigger change event if value has changed
                if (that.options.autoFormat && window.intlTelInputUtils && that.telInput.val() != that.telInput.data("focusVal")) {
                    that.telInput.trigger("change");
                }
            });
        },
        // extract the numeric digits from the given string
        _getNumeric: function(s) {
            return s.replace(/\D/g, "");
        },
        // show the dropdown
        _showDropdown: function() {
            this._setDropdownPosition();
            // update highlighting and scroll to active list item
            var activeListItem = this.countryList.children(".active");
            this._highlightListItem(activeListItem);
            // show it
            this.countryList.removeClass("hide");
            this._scrollTo(activeListItem);
            // bind all the dropdown-related listeners: mouseover, click, click-off, keydown
            this._bindDropdownListeners();
            // update the arrow
            this.selectedFlagInner.children(".arrow").addClass("up");
        },
        // decide where to position dropdown (depends on position within viewport, and scroll)
        _setDropdownPosition: function() {
            var inputTop = this.telInput.offset().top, windowTop = $(window).scrollTop(), // dropdownFitsBelow = (dropdownBottom < windowBottom)
            dropdownFitsBelow = inputTop + this.telInput.outerHeight() + this.dropdownHeight < windowTop + $(window).height(), dropdownFitsAbove = inputTop - this.dropdownHeight > windowTop;
            // dropdownHeight - 1 for border
            var cssTop = !dropdownFitsBelow && dropdownFitsAbove ? "-" + (this.dropdownHeight - 1) + "px" : "";
            this.countryList.css("top", cssTop);
        },
        // we only bind dropdown listeners when the dropdown is open
        _bindDropdownListeners: function() {
            var that = this;
            // when mouse over a list item, just highlight that one
            // we add the class "highlight", so if they hit "enter" we know which one to select
            this.countryList.on("mouseover" + this.ns, ".country", function(e) {
                that._highlightListItem($(this));
            });
            // listen for country selection
            this.countryList.on("click" + this.ns, ".country", function(e) {
                that._selectListItem($(this));
            });
            // click off to close
            // (except when this initial opening click is bubbling up)
            // we cannot just stopPropagation as it may be needed to close another instance
            var isOpening = true;
            $("html").on("click" + this.ns, function(e) {
                if (!isOpening) {
                    that._closeDropdown();
                }
                isOpening = false;
            });
            // listen for up/down scrolling, enter to select, or letters to jump to country name.
            // use keydown as keypress doesn't fire for non-char keys and we want to catch if they
            // just hit down and hold it to scroll down (no keyup event).
            // listen on the document because that's where key events are triggered if no input has focus
            var query = "", queryTimer = null;
            $(document).on("keydown" + this.ns, function(e) {
                // prevent down key from scrolling the whole page,
                // and enter key from submitting a form etc
                e.preventDefault();
                if (e.which == keys.UP || e.which == keys.DOWN) {
                    // up and down to navigate
                    that._handleUpDownKey(e.which);
                } else if (e.which == keys.ENTER) {
                    // enter to select
                    that._handleEnterKey();
                } else if (e.which == keys.ESC) {
                    // esc to close
                    that._closeDropdown();
                } else if (e.which >= keys.A && e.which <= keys.Z || e.which == keys.SPACE) {
                    // upper case letters (note: keyup/keydown only return upper case letters)
                    // jump to countries that start with the query string
                    if (queryTimer) {
                        clearTimeout(queryTimer);
                    }
                    query += String.fromCharCode(e.which);
                    that._searchForCountry(query);
                    // if the timer hits 1 second, reset the query
                    queryTimer = setTimeout(function() {
                        query = "";
                    }, 1e3);
                }
            });
        },
        // highlight the next/prev item in the list (and ensure it is visible)
        _handleUpDownKey: function(key) {
            var current = this.countryList.children(".highlight").first();
            var next = key == keys.UP ? current.prev() : current.next();
            if (next.length) {
                // skip the divider
                if (next.hasClass("divider")) {
                    next = key == keys.UP ? next.prev() : next.next();
                }
                this._highlightListItem(next);
                this._scrollTo(next);
            }
        },
        // select the currently highlighted item
        _handleEnterKey: function() {
            var currentCountry = this.countryList.children(".highlight").first();
            if (currentCountry.length) {
                this._selectListItem(currentCountry);
            }
        },
        // find the first list item whose name starts with the query string
        _searchForCountry: function(query) {
            for (var i = 0; i < this.countries.length; i++) {
                if (this._startsWith(this.countries[i].name, query)) {
                    var listItem = this.countryList.children("[data-country-code=" + this.countries[i].iso2 + "]").not(".preferred");
                    // update highlighting and scroll
                    this._highlightListItem(listItem);
                    this._scrollTo(listItem, true);
                    break;
                }
            }
        },
        // check if (uppercase) string a starts with string b
        _startsWith: function(a, b) {
            return a.substr(0, b.length).toUpperCase() == b;
        },
        // update the input's value to the given val
        // if autoFormat=true, format it first according to the country-specific formatting rules
        _updateVal: function(val, addSuffix) {
            var formatted;
            if (this.options.autoFormat && window.intlTelInputUtils) {
                formatted = intlTelInputUtils.formatNumber(val, this.selectedCountryData.iso2, addSuffix, this.options.preventInvalidNumbers);
                // ensure we dont go over maxlength. we must do this here to truncate any formatting suffix, and also handle paste events
                var max = this.telInput.attr("maxlength");
                if (max && formatted.length > max) {
                    formatted = formatted.substr(0, max);
                }
            } else {
                // no autoFormat, so just insert the original value
                formatted = val;
            }
            this.telInput.val(formatted);
        },
        // check if need to select a new flag based on the given number
        _updateFlagFromNumber: function(number) {
            // if we're in nationalMode and we're on US/Canada, make sure the number starts with a +1 so _getDialCode will be able to extract the area code
            // update: if we dont yet have selectedCountryData, but we're here (trying to update the flag from the number), that means we're initialising the plugin with a number that already has a dial code, so fine to ignore this bit
            if (this.options.nationalMode && this.selectedCountryData && this.selectedCountryData.dialCode == "1" && number.substr(0, 1) != "+") {
                number = "+1" + number;
            }
            // try and extract valid dial code from input
            var dialCode = this._getDialCode(number);
            if (dialCode) {
                // check if one of the matching countries is already selected
                var countryCodes = this.countryCodes[this._getNumeric(dialCode)], alreadySelected = false;
                if (this.selectedCountryData) {
                    for (var i = 0; i < countryCodes.length; i++) {
                        if (countryCodes[i] == this.selectedCountryData.iso2) {
                            alreadySelected = true;
                        }
                    }
                }
                // if a matching country is not already selected (or this is an unknown NANP area code): choose the first in the list
                if (!alreadySelected || this._isUnknownNanp(number, dialCode)) {
                    // if using onlyCountries option, countryCodes[0] may be empty, so we must find the first non-empty index
                    for (var j = 0; j < countryCodes.length; j++) {
                        if (countryCodes[j]) {
                            this._selectFlag(countryCodes[j]);
                            break;
                        }
                    }
                }
            }
        },
        // check if the given number contains an unknown area code from the North American Numbering Plan i.e. the only dialCode that could be extracted was +1 but the actual number's length is >=4
        _isUnknownNanp: function(number, dialCode) {
            return dialCode == "+1" && this._getNumeric(number).length >= 4;
        },
        // remove highlighting from other list items and highlight the given item
        _highlightListItem: function(listItem) {
            this.countryListItems.removeClass("highlight");
            listItem.addClass("highlight");
        },
        // find the country data for the given country code
        // the ignoreOnlyCountriesOption is only used during init() while parsing the onlyCountries array
        _getCountryData: function(countryCode, ignoreOnlyCountriesOption, allowFail) {
            var countryList = ignoreOnlyCountriesOption ? allCountries : this.countries;
            for (var i = 0; i < countryList.length; i++) {
                if (countryList[i].iso2 == countryCode) {
                    return countryList[i];
                }
            }
            if (allowFail) {
                return null;
            } else {
                throw new Error("No country data for '" + countryCode + "'");
            }
        },
        // select the given flag, update the placeholder and the active list item
        _selectFlag: function(countryCode) {
            // do this first as it will throw an error and stop if countryCode is invalid
            this.selectedCountryData = this._getCountryData(countryCode, false, false);
            this.selectedFlagInner.attr("class", "flag " + countryCode);
            // update the selected country's title attribute
            var title = this.selectedCountryData.name + ": +" + this.selectedCountryData.dialCode;
            this.selectedFlagInner.parent().attr("title", title);
            // and the input's placeholder
            this._updatePlaceholder();
            // update the active list item
            var listItem = this.countryListItems.children(".flag." + countryCode).first().parent();
            this.countryListItems.removeClass("active");
            listItem.addClass("active");
        },
        // update the input placeholder to an example number from the currently selected country
        _updatePlaceholder: function() {
            if (window.intlTelInputUtils && !this.hadInitialPlaceholder) {
                var iso2 = this.selectedCountryData.iso2, numberType = intlTelInputUtils.numberType[this.options.numberType || "FIXED_LINE"], placeholder = intlTelInputUtils.getExampleNumber(iso2, this.options.nationalMode, numberType);
                this.telInput.attr("placeholder", placeholder);
            }
        },
        // called when the user selects a list item from the dropdown
        _selectListItem: function(listItem) {
            // update selected flag and active list item
            var countryCode = listItem.attr("data-country-code");
            this._selectFlag(countryCode);
            this._closeDropdown();
            this._updateDialCode(listItem.attr("data-dial-code"), true);
            // always fire the change event as even if nationalMode=true (and we haven't updated the input val), the system as a whole has still changed - see country-sync example. think of it as making a selection from a select element.
            this.telInput.trigger("change");
            // focus the input
            this.telInput.focus();
        },
        // close the dropdown and unbind any listeners
        _closeDropdown: function() {
            this.countryList.addClass("hide");
            // update the arrow
            this.selectedFlagInner.children(".arrow").removeClass("up");
            // unbind key events
            $(document).off(this.ns);
            // unbind click-off-to-close
            $("html").off(this.ns);
            // unbind hover and click listeners
            this.countryList.off(this.ns);
        },
        // check if an element is visible within it's container, else scroll until it is
        _scrollTo: function(element, middle) {
            var container = this.countryList, containerHeight = container.height(), containerTop = container.offset().top, containerBottom = containerTop + containerHeight, elementHeight = element.outerHeight(), elementTop = element.offset().top, elementBottom = elementTop + elementHeight, newScrollTop = elementTop - containerTop + container.scrollTop(), middleOffset = containerHeight / 2 - elementHeight / 2;
            if (elementTop < containerTop) {
                // scroll up
                if (middle) {
                    newScrollTop -= middleOffset;
                }
                container.scrollTop(newScrollTop);
            } else if (elementBottom > containerBottom) {
                // scroll down
                if (middle) {
                    newScrollTop += middleOffset;
                }
                var heightDifference = containerHeight - elementHeight;
                container.scrollTop(newScrollTop - heightDifference);
            }
        },
        // replace any existing dial code with the new one (if not in nationalMode)
        // also we need to know if we're focusing for a couple of reasons e.g. if so, we want to add any formatting suffix, also if the input is empty and we're not in nationalMode, then we want to insert the dial code
        _updateDialCode: function(newDialCode, focusing) {
            var inputVal = this.telInput.val(), newNumber;
            // save having to pass this every time
            newDialCode = "+" + newDialCode;
            if (this.options.nationalMode && inputVal.substr(0, 1) != "+") {
                // if nationalMode, we just want to re-format
                newNumber = inputVal;
            } else if (inputVal) {
                // if the previous number contained a valid dial code, replace it
                // (if more than just a plus character)
                var prevDialCode = this._getDialCode(inputVal);
                if (prevDialCode.length > 1) {
                    newNumber = inputVal.replace(prevDialCode, newDialCode);
                } else {
                    // if the previous number didn't contain a dial code, we should persist it
                    var existingNumber = inputVal.substr(0, 1) != "+" ? $.trim(inputVal) : "";
                    newNumber = newDialCode + existingNumber;
                }
            } else {
                newNumber = !this.options.autoHideDialCode || focusing ? newDialCode : "";
            }
            this._updateVal(newNumber, focusing);
        },
        // try and extract a valid international dial code from a full telephone number
        // Note: returns the raw string inc plus character and any whitespace/dots etc
        _getDialCode: function(number) {
            var dialCode = "";
            // only interested in international numbers (starting with a plus)
            if (number.charAt(0) == "+") {
                var numericChars = "";
                // iterate over chars
                for (var i = 0; i < number.length; i++) {
                    var c = number.charAt(i);
                    // if char is number
                    if ($.isNumeric(c)) {
                        numericChars += c;
                        // if current numericChars make a valid dial code
                        if (this.countryCodes[numericChars]) {
                            // store the actual raw string (useful for matching later)
                            dialCode = number.substr(0, i + 1);
                        }
                        // longest dial code is 4 chars
                        if (numericChars.length == 4) {
                            break;
                        }
                    }
                }
            }
            return dialCode;
        },
        /********************
   *  PUBLIC METHODS
   ********************/
        // remove plugin
        destroy: function() {
            // make sure the dropdown is closed (and unbind listeners)
            this._closeDropdown();
            // key events, and focus/blur events if autoHideDialCode=true
            this.telInput.off(this.ns);
            // click event to open dropdown
            this.selectedFlagInner.parent().off(this.ns);
            // label click hack
            this.telInput.closest("label").off(this.ns);
            // remove markup
            var container = this.telInput.parent();
            container.before(this.telInput).remove();
        },
        // format the number to E164
        getCleanNumber: function() {
            if (window.intlTelInputUtils) {
                return intlTelInputUtils.formatNumberE164(this.telInput.val(), this.selectedCountryData.iso2);
            }
            return "";
        },
        // get the type of the entered number e.g. landline/mobile
        getNumberType: function() {
            if (window.intlTelInputUtils) {
                return intlTelInputUtils.getNumberType(this.telInput.val(), this.selectedCountryData.iso2);
            }
            return -99;
        },
        // get the country data for the currently selected flag
        getSelectedCountryData: function() {
            // if this is undefined, the plugin will return it's instance instead, so in that case an empty object makes more sense
            return this.selectedCountryData || {};
        },
        // get the validation error
        getValidationError: function() {
            if (window.intlTelInputUtils) {
                return intlTelInputUtils.getValidationError(this.telInput.val(), this.selectedCountryData.iso2);
            }
            return -99;
        },
        // validate the input val - assumes the global function isValidNumber (from utilsScript)
        isValidNumber: function() {
            var val = $.trim(this.telInput.val()), countryCode = this.options.nationalMode ? this.selectedCountryData.iso2 : "", // libphonenumber allows alpha chars, but in order to allow that, we'd need a method to retrieve the processed number, with letters replaced with numbers
            containsAlpha = /[a-zA-Z]/.test(val);
            if (!containsAlpha && window.intlTelInputUtils) {
                return intlTelInputUtils.isValidNumber(val, countryCode);
            }
            return false;
        },
        // load the utils script
        loadUtils: function(path) {
            var utilsScript = path || this.options.utilsScript;
            if (!$.fn[pluginName].loadedUtilsScript && utilsScript) {
                // don't do this twice! (dont just check if the global intlTelInputUtils exists as if init plugin multiple times in quick succession, it may not have finished loading yet)
                $.fn[pluginName].loadedUtilsScript = true;
                // dont use $.getScript as it prevents caching
                $.ajax({
                    url: utilsScript,
                    success: function() {
                        // tell all instances the utils are ready
                        $(".intl-tel-input input").intlTelInput("utilsLoaded");
                    },
                    dataType: "script",
                    cache: true
                });
            }
        },
        // update the selected flag, and update the input val accordingly
        selectCountry: function(countryCode) {
            // check if already selected
            if (!this.selectedFlagInner.hasClass(countryCode)) {
                this._selectFlag(countryCode);
                this._updateDialCode(this.selectedCountryData.dialCode, false);
            }
        },
        // set the input value and update the flag
        setNumber: function(number, addSuffix) {
            // ensure starts with plus
            if (!this.options.nationalMode && number.substr(0, 1) != "+") {
                number = "+" + number;
            }
            // we must update the flag first, which updates this.selectedCountryData, which is used later for formatting the number before displaying it
            this._updateFlagFromNumber(number);
            this._updateVal(number, addSuffix);
        },
        // this is called when the utils are ready
        utilsLoaded: function() {
            // if autoFormat is enabled and there's an initial value in the input, then format it
            if (this.options.autoFormat && this.telInput.val()) {
                this._updateVal(this.telInput.val());
            }
            this._updatePlaceholder();
        }
    };
    // adapted to allow public functions
    // using https://github.com/jquery-boilerplate/jquery-boilerplate/wiki/Extending-jQuery-Boilerplate
    $.fn[pluginName] = function(options) {
        var args = arguments;
        // Is the first parameter an object (options), or was omitted,
        // instantiate a new instance of the plugin.
        if (options === undefined || typeof options === "object") {
            return this.each(function() {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(this, "plugin_" + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === "string" && options[0] !== "_" && options !== "init") {
            // If the first parameter is a string and it doesn't start
            // with an underscore or "contains" the `init`-function,
            // treat this as a call to a public method.
            // Cache the method call to make it possible to return a value
            var returns;
            this.each(function() {
                var instance = $.data(this, "plugin_" + pluginName);
                // Tests that there's already a plugin-instance
                // and checks that the requested public method exists
                if (instance instanceof Plugin && typeof instance[options] === "function") {
                    // Call the method of our plugin instance,
                    // and pass it the supplied arguments.
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }
                // Allow instances to be destroyed via the 'destroy' method
                if (options === "destroy") {
                    $.data(this, "plugin_" + pluginName, null);
                }
            });
            // If the earlier cached method gives a value back return the value,
            // otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
    };
    /********************
 *  STATIC METHODS
 ********************/
    // get the country data object
    $.fn[pluginName].getCountryData = function() {
        return allCountries;
    };
    // set the country data object
    $.fn[pluginName].setCountryData = function(obj) {
        allCountries = obj;
    };
    // Tell JSHint to ignore this warning: "character may get silently deleted by one or more browsers"
    // jshint -W100
    // Array of country objects for the flag dropdown.
    // Each contains a name, country code (ISO 3166-1 alpha-2) and dial code.
    // Originally from https://github.com/mledoze/countries
    // then modified using the following JavaScript (NOW OUT OF DATE):
    /*
var result = [];
_.each(countries, function(c) {
  // ignore countries without a dial code
  if (c.callingCode[0].length) {
    result.push({
      // var locals contains country names with localised versions in brackets
      n: _.findWhere(locals, {
        countryCode: c.cca2
      }).name,
      i: c.cca2.toLowerCase(),
      d: c.callingCode[0]
    });
  }
});
JSON.stringify(result);
*/
    // then with a couple of manual re-arrangements to be alphabetical
    // then changed Kazakhstan from +76 to +7
    // and Vatican City from +379 to +39 (see issue 50)
    // and Caribean Netherlands from +5997 to +599
    // and Curacao from +5999 to +599
    // Removed: Åland Islands, Christmas Island, Cocos Islands, Guernsey, Isle of Man, Jersey, Kosovo, Mayotte, Pitcairn Islands, South Georgia, Svalbard, Western Sahara
    // Update: converted objects to arrays to save bytes!
    // Update: added "priority" for countries with the same dialCode as others
    // Update: added array of area codes for countries with the same dialCode as others
    // So each country array has the following information:
    // [
    //    Country name,
    //    iso2 code,
    //    International dial code,
    //    Order (if >1 country with same dial code),
    //    Area codes (if >1 country with same dial code)
    // ]
    var allCountries = [ [ "Afghanistan (‫افغانستان‬‎)", "af", "93" ], [ "Albania (Shqipëri)", "al", "355" ], [ "Algeria (‫الجزائر‬‎)", "dz", "213" ], [ "American Samoa", "as", "1684" ], [ "Andorra", "ad", "376" ], [ "Angola", "ao", "244" ], [ "Anguilla", "ai", "1264" ], [ "Antigua and Barbuda", "ag", "1268" ], [ "Argentina", "ar", "54" ], [ "Armenia (Հայաստան)", "am", "374" ], [ "Aruba", "aw", "297" ], [ "Australia", "au", "61" ], [ "Austria (Österreich)", "at", "43" ], [ "Azerbaijan (Azərbaycan)", "az", "994" ], [ "Bahamas", "bs", "1242" ], [ "Bahrain (‫البحرين‬‎)", "bh", "973" ], [ "Bangladesh (বাংলাদেশ)", "bd", "880" ], [ "Barbados", "bb", "1246" ], [ "Belarus (Беларусь)", "by", "375" ], [ "Belgium (België)", "be", "32" ], [ "Belize", "bz", "501" ], [ "Benin (Bénin)", "bj", "229" ], [ "Bermuda", "bm", "1441" ], [ "Bhutan (འབྲུག)", "bt", "975" ], [ "Bolivia", "bo", "591" ], [ "Bosnia and Herzegovina (Босна и Херцеговина)", "ba", "387" ], [ "Botswana", "bw", "267" ], [ "Brazil (Brasil)", "br", "55" ], [ "British Indian Ocean Territory", "io", "246" ], [ "British Virgin Islands", "vg", "1284" ], [ "Brunei", "bn", "673" ], [ "Bulgaria (България)", "bg", "359" ], [ "Burkina Faso", "bf", "226" ], [ "Burundi (Uburundi)", "bi", "257" ], [ "Cambodia (កម្ពុជា)", "kh", "855" ], [ "Cameroon (Cameroun)", "cm", "237" ], [ "Canada", "ca", "1", 1, [ "204", "236", "249", "250", "289", "306", "343", "365", "387", "403", "416", "418", "431", "437", "438", "450", "506", "514", "519", "548", "579", "581", "587", "604", "613", "639", "647", "672", "705", "709", "742", "778", "780", "782", "807", "819", "825", "867", "873", "902", "905" ] ], [ "Cape Verde (Kabu Verdi)", "cv", "238" ], [ "Caribbean Netherlands", "bq", "599", 1 ], [ "Cayman Islands", "ky", "1345" ], [ "Central African Republic (République centrafricaine)", "cf", "236" ], [ "Chad (Tchad)", "td", "235" ], [ "Chile", "cl", "56" ], [ "China (中国)", "cn", "86" ], [ "Colombia", "co", "57" ], [ "Comoros (‫جزر القمر‬‎)", "km", "269" ], [ "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)", "cd", "243" ], [ "Congo (Republic) (Congo-Brazzaville)", "cg", "242" ], [ "Cook Islands", "ck", "682" ], [ "Costa Rica", "cr", "506" ], [ "Côte d’Ivoire", "ci", "225" ], [ "Croatia (Hrvatska)", "hr", "385" ], [ "Cuba", "cu", "53" ], [ "Curaçao", "cw", "599", 0 ], [ "Cyprus (Κύπρος)", "cy", "357" ], [ "Czech Republic (Česká republika)", "cz", "420" ], [ "Denmark (Danmark)", "dk", "45" ], [ "Djibouti", "dj", "253" ], [ "Dominica", "dm", "1767" ], [ "Dominican Republic (República Dominicana)", "do", "1", 2, [ "809", "829", "849" ] ], [ "Ecuador", "ec", "593" ], [ "Egypt (‫مصر‬‎)", "eg", "20" ], [ "El Salvador", "sv", "503" ], [ "Equatorial Guinea (Guinea Ecuatorial)", "gq", "240" ], [ "Eritrea", "er", "291" ], [ "Estonia (Eesti)", "ee", "372" ], [ "Ethiopia", "et", "251" ], [ "Falkland Islands (Islas Malvinas)", "fk", "500" ], [ "Faroe Islands (Føroyar)", "fo", "298" ], [ "Fiji", "fj", "679" ], [ "Finland (Suomi)", "fi", "358" ], [ "France", "fr", "33" ], [ "French Guiana (Guyane française)", "gf", "594" ], [ "French Polynesia (Polynésie française)", "pf", "689" ], [ "Gabon", "ga", "241" ], [ "Gambia", "gm", "220" ], [ "Georgia (საქართველო)", "ge", "995" ], [ "Germany (Deutschland)", "de", "49" ], [ "Ghana (Gaana)", "gh", "233" ], [ "Gibraltar", "gi", "350" ], [ "Greece (Ελλάδα)", "gr", "30" ], [ "Greenland (Kalaallit Nunaat)", "gl", "299" ], [ "Grenada", "gd", "1473" ], [ "Guadeloupe", "gp", "590", 0 ], [ "Guam", "gu", "1671" ], [ "Guatemala", "gt", "502" ], [ "Guinea (Guinée)", "gn", "224" ], [ "Guinea-Bissau (Guiné Bissau)", "gw", "245" ], [ "Guyana", "gy", "592" ], [ "Haiti", "ht", "509" ], [ "Honduras", "hn", "504" ], [ "Hong Kong (香港)", "hk", "852" ], [ "Hungary (Magyarország)", "hu", "36" ], [ "Iceland (Ísland)", "is", "354" ], [ "India (भारत)", "in", "91" ], [ "Indonesia", "id", "62" ], [ "Iran (‫ایران‬‎)", "ir", "98" ], [ "Iraq (‫العراق‬‎)", "iq", "964" ], [ "Ireland", "ie", "353" ], [ "Israel (‫ישראל‬‎)", "il", "972" ], [ "Italy (Italia)", "it", "39", 0 ], [ "Jamaica", "jm", "1876" ], [ "Japan (日本)", "jp", "81" ], [ "Jordan (‫الأردن‬‎)", "jo", "962" ], [ "Kazakhstan (Казахстан)", "kz", "7", 1 ], [ "Kenya", "ke", "254" ], [ "Kiribati", "ki", "686" ], [ "Kuwait (‫الكويت‬‎)", "kw", "965" ], [ "Kyrgyzstan (Кыргызстан)", "kg", "996" ], [ "Laos (ລາວ)", "la", "856" ], [ "Latvia (Latvija)", "lv", "371" ], [ "Lebanon (‫لبنان‬‎)", "lb", "961" ], [ "Lesotho", "ls", "266" ], [ "Liberia", "lr", "231" ], [ "Libya (‫ليبيا‬‎)", "ly", "218" ], [ "Liechtenstein", "li", "423" ], [ "Lithuania (Lietuva)", "lt", "370" ], [ "Luxembourg", "lu", "352" ], [ "Macau (澳門)", "mo", "853" ], [ "Macedonia (FYROM) (Македонија)", "mk", "389" ], [ "Madagascar (Madagasikara)", "mg", "261" ], [ "Malawi", "mw", "265" ], [ "Malaysia", "my", "60" ], [ "Maldives", "mv", "960" ], [ "Mali", "ml", "223" ], [ "Malta", "mt", "356" ], [ "Marshall Islands", "mh", "692" ], [ "Martinique", "mq", "596" ], [ "Mauritania (‫موريتانيا‬‎)", "mr", "222" ], [ "Mauritius (Moris)", "mu", "230" ], [ "Mexico (México)", "mx", "52" ], [ "Micronesia", "fm", "691" ], [ "Moldova (Republica Moldova)", "md", "373" ], [ "Monaco", "mc", "377" ], [ "Mongolia (Монгол)", "mn", "976" ], [ "Montenegro (Crna Gora)", "me", "382" ], [ "Montserrat", "ms", "1664" ], [ "Morocco (‫المغرب‬‎)", "ma", "212" ], [ "Mozambique (Moçambique)", "mz", "258" ], [ "Myanmar (Burma) (မြန်မာ)", "mm", "95" ], [ "Namibia (Namibië)", "na", "264" ], [ "Nauru", "nr", "674" ], [ "Nepal (नेपाल)", "np", "977" ], [ "Netherlands (Nederland)", "nl", "31" ], [ "New Caledonia (Nouvelle-Calédonie)", "nc", "687" ], [ "New Zealand", "nz", "64" ], [ "Nicaragua", "ni", "505" ], [ "Niger (Nijar)", "ne", "227" ], [ "Nigeria", "ng", "234" ], [ "Niue", "nu", "683" ], [ "Norfolk Island", "nf", "672" ], [ "North Korea (조선 민주주의 인민 공화국)", "kp", "850" ], [ "Northern Mariana Islands", "mp", "1670" ], [ "Norway (Norge)", "no", "47" ], [ "Oman (‫عُمان‬‎)", "om", "968" ], [ "Pakistan (‫پاکستان‬‎)", "pk", "92" ], [ "Palau", "pw", "680" ], [ "Palestine (‫فلسطين‬‎)", "ps", "970" ], [ "Panama (Panamá)", "pa", "507" ], [ "Papua New Guinea", "pg", "675" ], [ "Paraguay", "py", "595" ], [ "Peru (Perú)", "pe", "51" ], [ "Philippines", "ph", "63" ], [ "Poland (Polska)", "pl", "48" ], [ "Portugal", "pt", "351" ], [ "Puerto Rico", "pr", "1", 3, [ "787", "939" ] ], [ "Qatar (‫قطر‬‎)", "qa", "974" ], [ "Réunion (La Réunion)", "re", "262" ], [ "Romania (România)", "ro", "40" ], [ "Russia (Россия)", "ru", "7", 0 ], [ "Rwanda", "rw", "250" ], [ "Saint Barthélemy (Saint-Barthélemy)", "bl", "590", 1 ], [ "Saint Helena", "sh", "290" ], [ "Saint Kitts and Nevis", "kn", "1869" ], [ "Saint Lucia", "lc", "1758" ], [ "Saint Martin (Saint-Martin (partie française))", "mf", "590", 2 ], [ "Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)", "pm", "508" ], [ "Saint Vincent and the Grenadines", "vc", "1784" ], [ "Samoa", "ws", "685" ], [ "San Marino", "sm", "378" ], [ "São Tomé and Príncipe (São Tomé e Príncipe)", "st", "239" ], [ "Saudi Arabia (‫المملكة العربية السعودية‬‎)", "sa", "966" ], [ "Senegal (Sénégal)", "sn", "221" ], [ "Serbia (Србија)", "rs", "381" ], [ "Seychelles", "sc", "248" ], [ "Sierra Leone", "sl", "232" ], [ "Singapore", "sg", "65" ], [ "Sint Maarten", "sx", "1721" ], [ "Slovakia (Slovensko)", "sk", "421" ], [ "Slovenia (Slovenija)", "si", "386" ], [ "Solomon Islands", "sb", "677" ], [ "Somalia (Soomaaliya)", "so", "252" ], [ "South Africa", "za", "27" ], [ "South Korea (대한민국)", "kr", "82" ], [ "South Sudan (‫جنوب السودان‬‎)", "ss", "211" ], [ "Spain (España)", "es", "34" ], [ "Sri Lanka (ශ්‍රී ලංකාව)", "lk", "94" ], [ "Sudan (‫السودان‬‎)", "sd", "249" ], [ "Suriname", "sr", "597" ], [ "Swaziland", "sz", "268" ], [ "Sweden (Sverige)", "se", "46" ], [ "Switzerland (Schweiz)", "ch", "41" ], [ "Syria (‫سوريا‬‎)", "sy", "963" ], [ "Taiwan (台灣)", "tw", "886" ], [ "Tajikistan", "tj", "992" ], [ "Tanzania", "tz", "255" ], [ "Thailand (ไทย)", "th", "66" ], [ "Timor-Leste", "tl", "670" ], [ "Togo", "tg", "228" ], [ "Tokelau", "tk", "690" ], [ "Tonga", "to", "676" ], [ "Trinidad and Tobago", "tt", "1868" ], [ "Tunisia (‫تونس‬‎)", "tn", "216" ], [ "Turkey (Türkiye)", "tr", "90" ], [ "Turkmenistan", "tm", "993" ], [ "Turks and Caicos Islands", "tc", "1649" ], [ "Tuvalu", "tv", "688" ], [ "U.S. Virgin Islands", "vi", "1340" ], [ "Uganda", "ug", "256" ], [ "Ukraine (Україна)", "ua", "380" ], [ "United Arab Emirates (‫الإمارات العربية المتحدة‬‎)", "ae", "971" ], [ "United Kingdom", "gb", "44" ], [ "United States", "us", "1", 0 ], [ "Uruguay", "uy", "598" ], [ "Uzbekistan (Oʻzbekiston)", "uz", "998" ], [ "Vanuatu", "vu", "678" ], [ "Vatican City (Città del Vaticano)", "va", "39", 1 ], [ "Venezuela", "ve", "58" ], [ "Vietnam (Việt Nam)", "vn", "84" ], [ "Wallis and Futuna", "wf", "681" ], [ "Yemen (‫اليمن‬‎)", "ye", "967" ], [ "Zambia", "zm", "260" ], [ "Zimbabwe", "zw", "263" ] ];
    // loop over all of the countries above
    for (var i = 0; i < allCountries.length; i++) {
        var c = allCountries[i];
        allCountries[i] = {
            name: c[0],
            iso2: c[1],
            dialCode: c[2],
            priority: c[3] || 0,
            areaCodes: c[4] || null
        };
    }
});
/*
 * Copyright (c) 2014 Mike King (@micjamking)
 *
 * jQuery Succinct plugin
 * Version 1.1.0 (October 2014)
 *
 * Licensed under the MIT License
 */

 /*global jQuery*/
(function($) {
  'use strict';

  $.fn.succinct = function(options) {

    var settings = $.extend({
        size: 240,
        omission: '...',
        ignore: true
      }, options);

    return this.each(function() {

      var textDefault,
        textTruncated,
        elements = $(this),
        regex    = /[!-\/:-@\[-`{-~]$/,
        init     = function() {
          elements.each(function() {
            textDefault = $(this).html();

            if (textDefault.length > settings.size) {
              textTruncated = $.trim(textDefault)
                      .substring(0, settings.size)
                      .split(' ')
                      .slice(0, -1)
                      .join(' ');

              if (settings.ignore) {
                textTruncated = textTruncated.replace(regex, '');
              }

              $(this).html(textTruncated + settings.omission);
            }
          });
        };
      init();
    });
  };
})(jQuery);

(function (factory) {

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }

}(function ($) {

  // Constructor
  // ===========

  var Leveller = function (elements, options) {
    this.$elements = $(elements);
    this.options = $.extend({}, Leveller.DEFAULTS, options);
  };

  Leveller.DATA_KEY = 'plugin_leveller';

  Leveller.DEFAULTS = {
    level: true,
    resetBefore: true,
    cssProperty: 'height',
    heightMethod: 'height',
    offsetMethod: 'offset',
    alignment: 'top'
  };

  Leveller.prototype.level = function () {
    var i = 0;
    var perRow = this.options.columns || this.getPerRow();
    if (this.options.resetBefore) {
      this.reset();
    }
    for ( ; i < this.$elements.length; i += perRow) {
      this.adjustElements(this.$elements.slice(i, i + perRow));
    }
  };

  Leveller.prototype.reset = function () {
    var $styleElements = this.options.cssSelector ? this.$elements.find(this.options.cssSelector) : this.$elements;
    $styleElements.css(this.options.cssProperty, '');
  };

  Leveller.prototype.adjustElements = function ($elements) {
    var i = 0;
    var targetHeight = this.getTallestHeight($elements);
    for ( ; i < $elements.length; i++) {
      this.adjustElement($elements.eq(i), targetHeight);
    }
  };

  Leveller.prototype.adjustElement = function ($element, targetHeight) {
    var currentHeight = $element[this.options.heightMethod]();
    var diff = targetHeight - currentHeight;
    if (diff === 0) return;

    var $styleElement = this.options.cssSelector ? $element.find(this.options.cssSelector) : $element;
    var styleValue = targetHeight;
    if (this.options.cssProperty.indexOf('eight') < 0) {
      styleValue = parseInt($styleElement.css(this.options.cssProperty), 10) + diff;
    }
    if (typeof this.options.adjustBy === 'string') {
      styleValue += parseInt($element.css(this.options.adjustBy), 10);
    } else if (typeof this.options.adjustBy === "number") {
      styleValue += this.options.adjustBy;
    }
    $styleElement.css(this.options.cssProperty, styleValue);
  };

  Leveller.prototype.getPerRow = function () {
    var i = 0;
    var offset = {};
    var $element, current, last;
    for ( ; i < this.$elements.length; i++) {
      $element = this.$elements.eq(i);
      offset = $element[this.options.offsetMethod]();
      current = offset.top;
      if (this.options.alignment === 'middle') {
        current += $element[this.options.heightMethod]() / 2;
      } else if (this.options.alignment === 'bottom') {
        current += $element[this.options.heightMethod]();
      }
      if (typeof last !== 'undefined' && current > last) {
        break;
      }
      last = current;
    }
    return i;
  };

  Leveller.prototype.getTallestHeight = function ($elements) {
    var heightMethod = this.options.heightMethod;
    $elements = $elements || this.$elements;
    var heights = $.map($elements, function (element, i) {
      return $(element)[heightMethod]();
    });
    return Math.max.apply(null, heights);
  };

  // Plugin
  // ======

  function Plugin (option) {
    var data = this.data(Leveller.DATA_KEY);
    var options = $.extend({}, Leveller.DEFAULTS, typeof option === 'object' && option);

    if (!data) {
      if (options.level && option === 'reset') options.level = false;
      this.data(Leveller.DATA_KEY, (data = new Leveller(this, options)));
    }

    if (typeof option === 'string') {
      data[option]();
    } else if (options.level) {
      data.level();
    }

    return this;
  }

  $.fn.leveller = Plugin;
  $.fn.leveller.Constructor = Leveller;

}));

/*! Picturefill - v2.2.0 - 2014-10-30
* http://scottjehl.github.io/picturefill
* Copyright (c) 2014 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT */
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
	"use strict";

	// For browsers that support matchMedium api such as IE 9 and webkit
	var styleMedia = (window.styleMedia || window.media);

	// For those that don't support matchMedium
	if (!styleMedia) {
		var style       = document.createElement('style'),
			script      = document.getElementsByTagName('script')[0],
			info        = null;

		style.type  = 'text/css';
		style.id    = 'matchmediajs-test';

		script.parentNode.insertBefore(style, script);

		// 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
		info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

		styleMedia = {
			matchMedium: function(media) {
				var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

				// 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
				if (style.styleSheet) {
					style.styleSheet.cssText = text;
				} else {
					style.textContent = text;
				}

				// Test if media query is true or false
				return info.width === '1px';
			}
		};
	}

	return function(media) {
		return {
			matches: styleMedia.matchMedium(media || 'all'),
			media: media || 'all'
		};
	};
}());
/*! Picturefill - Responsive Images that work today.
*  Author: Scott Jehl, Filament Group, 2012 ( new proposal implemented by Shawn Jansepar )
*  License: MIT/GPLv2
*  Spec: http://picture.responsiveimages.org/
*/
(function( w, doc, image ) {
	// Enable strict mode
	"use strict";

	// If picture is supported, well, that's awesome. Let's get outta here...
	if ( w.HTMLPictureElement ) {
		w.picturefill = function() { };
		return;
	}

	// HTML shim|v it for old IE (IE9 will still need the HTML video tag workaround)
	doc.createElement( "picture" );

	// local object for method references and testing exposure
	var pf = {};

	// namespace
	pf.ns = "picturefill";

	// srcset support test
	(function() {
		pf.srcsetSupported = "srcset" in image;
		pf.sizesSupported = "sizes" in image;
	})();

	// just a string trim workaround
	pf.trim = function( str ) {
		return str.trim ? str.trim() : str.replace( /^\s+|\s+$/g, "" );
	};

	// just a string endsWith workaround
	pf.endsWith = function( str, suffix ) {
		return str.endsWith ? str.endsWith( suffix ) : str.indexOf( suffix, str.length - suffix.length ) !== -1;
	};

	/**
	 * Shortcut method for https://w3c.github.io/webappsec/specs/mixedcontent/#restricts-mixed-content ( for easy overriding in tests )
	 */
	pf.restrictsMixedContent = function() {
		return w.location.protocol === "https:";
	};
	/**
	 * Shortcut method for matchMedia ( for easy overriding in tests )
	 */

	pf.matchesMedia = function( media ) {
		return w.matchMedia && w.matchMedia( media ).matches;
	};

	// Shortcut method for `devicePixelRatio` ( for easy overriding in tests )
	pf.getDpr = function() {
		return ( w.devicePixelRatio || 1 );
	};

	/**
	 * Get width in css pixel value from a "length" value
	 * http://dev.w3.org/csswg/css-values-3/#length-value
	 */
	pf.getWidthFromLength = function( length ) {
		// If a length is specified and doesn’t contain a percentage, and it is greater than 0 or using `calc`, use it. Else, use the `100vw` default.
		length = length && length.indexOf( "%" ) > -1 === false && ( parseFloat( length ) > 0 || length.indexOf( "calc(" ) > -1 ) ? length : "100vw";

		/**
		 * If length is specified in  `vw` units, use `%` instead since the div we’re measuring
		 * is injected at the top of the document.
		 *
		 * TODO: maybe we should put this behind a feature test for `vw`?
		 */
		length = length.replace( "vw", "%" );

		// Create a cached element for getting length value widths
		if ( !pf.lengthEl ) {
			pf.lengthEl = doc.createElement( "div" );

			// Positioning styles help prevent padding/margin/width on `html` or `body` from throwing calculations off.
			pf.lengthEl.style.cssText = "border:0;display:block;font-size:1em;left:0;margin:0;padding:0;position:absolute;visibility:hidden";
		}

		pf.lengthEl.style.width = length;

		doc.body.appendChild(pf.lengthEl);

		// Add a class, so that everyone knows where this element comes from
		pf.lengthEl.className = "helper-from-picturefill-js";

		if ( pf.lengthEl.offsetWidth <= 0 ) {
			// Something has gone wrong. `calc()` is in use and unsupported, most likely. Default to `100vw` (`100%`, for broader support.):
			pf.lengthEl.style.width = doc.documentElement.offsetWidth + "px";
		}

		var offsetWidth = pf.lengthEl.offsetWidth;

		doc.body.removeChild( pf.lengthEl );

		return offsetWidth;
	};

	// container of supported mime types that one might need to qualify before using
	pf.types =  {};

	// Add support for standard mime types
	pf.types[ "image/jpeg" ] = true;
	pf.types[ "image/gif" ] = true;
	pf.types[ "image/png" ] = true;

	// test svg support
	pf.types[ "image/svg+xml" ] = doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");

	// test webp support, only when the markup calls for it
	pf.types[ "image/webp" ] = function() {
		// based on Modernizr's lossless img-webp test
		// note: asynchronous
		var type = "image/webp";

		image.onerror = function() {
			pf.types[ type ] = false;
			picturefill();
		};
		image.onload = function() {
			pf.types[ type ] = image.width === 1;
			picturefill();
		};
		image.src = "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=";
	};

	/**
	 * Takes a source element and checks if its type attribute is present and if so, supported
	 * Note: for type tests that require a async logic,
	 * you can define them as a function that'll run only if that type needs to be tested. Just make the test function call picturefill again when it is complete.
	 * see the async webp test above for example
	 */
	pf.verifyTypeSupport = function( source ) {
		var type = source.getAttribute( "type" );
		// if type attribute exists, return test result, otherwise return true
		if ( type === null || type === "" ) {
			return true;
		} else {
			// if the type test is a function, run it and return "pending" status. The function will rerun picturefill on pending elements once finished.
			if ( typeof( pf.types[ type ] ) === "function" ) {
				pf.types[ type ]();
				return "pending";
			} else {
				return pf.types[ type ];
			}
		}
	};

	// Parses an individual `size` and returns the length, and optional media query
	pf.parseSize = function( sourceSizeStr ) {
		var match = /(\([^)]+\))?\s*(.+)/g.exec( sourceSizeStr );
		return {
			media: match && match[1],
			length: match && match[2]
		};
	};

	// Takes a string of sizes and returns the width in pixels as a number
	pf.findWidthFromSourceSize = function( sourceSizeListStr ) {
		// Split up source size list, ie ( max-width: 30em ) 100%, ( max-width: 50em ) 50%, 33%
		//                            or (min-width:30em) calc(30% - 15px)
		var sourceSizeList = pf.trim( sourceSizeListStr ).split( /\s*,\s*/ ),
			winningLength;

		for ( var i = 0, len = sourceSizeList.length; i < len; i++ ) {
			// Match <media-condition>? length, ie ( min-width: 50em ) 100%
			var sourceSize = sourceSizeList[ i ],
				// Split "( min-width: 50em ) 100%" into separate strings
				parsedSize = pf.parseSize( sourceSize ),
				length = parsedSize.length,
				media = parsedSize.media;

			if ( !length ) {
				continue;
			}
			if ( !media || pf.matchesMedia( media ) ) {
				// if there is no media query or it matches, choose this as our winning length
				// and end algorithm
				winningLength = length;
				break;
			}
		}

		// pass the length to a method that can properly determine length
		// in pixels based on these formats: http://dev.w3.org/csswg/css-values-3/#length-value
		return pf.getWidthFromLength( winningLength );
	};

	pf.parseSrcset = function( srcset ) {
		/**
		 * A lot of this was pulled from Boris Smus’ parser for the now-defunct WHATWG `srcset`
		 * https://github.com/borismus/srcset-polyfill/blob/master/js/srcset-info.js
		 *
		 * 1. Let input (`srcset`) be the value passed to this algorithm.
		 * 2. Let position be a pointer into input, initially pointing at the start of the string.
		 * 3. Let raw candidates be an initially empty ordered list of URLs with associated
		 *    unparsed descriptors. The order of entries in the list is the order in which entries
		 *    are added to the list.
		 */
		var candidates = [];

		while ( srcset !== "" ) {
			srcset = srcset.replace( /^\s+/g, "" );

			// 5. Collect a sequence of characters that are not space characters, and let that be url.
			var pos = srcset.search(/\s/g),
				url, descriptor = null;

			if ( pos !== -1 ) {
				url = srcset.slice( 0, pos );

				var last = url.slice(-1);

				// 6. If url ends with a U+002C COMMA character (,), remove that character from url
				// and let descriptors be the empty string. Otherwise, follow these substeps
				// 6.1. If url is empty, then jump to the step labeled descriptor parser.

				if ( last === "," || url === "" ) {
					url = url.replace( /,+$/, "" );
					descriptor = "";
				}
				srcset = srcset.slice( pos + 1 );

				// 6.2. Collect a sequence of characters that are not U+002C COMMA characters (,), and
				// let that be descriptors.
				if ( descriptor === null ) {
					var descpos = srcset.indexOf( "," );
					if ( descpos !== -1 ) {
						descriptor = srcset.slice( 0, descpos );
						srcset = srcset.slice( descpos + 1 );
					} else {
						descriptor = srcset;
						srcset = "";
					}
				}
			} else {
				url = srcset;
				srcset = "";
			}

			// 7. Add url to raw candidates, associated with descriptors.
			if ( url || descriptor ) {
				candidates.push({
					url: url,
					descriptor: descriptor
				});
			}
		}
		return candidates;
	};

	pf.parseDescriptor = function( descriptor, sizesattr ) {
		// 11. Descriptor parser: Let candidates be an initially empty source set. The order of entries in the list
		// is the order in which entries are added to the list.
		var sizes = sizesattr || "100vw",
			sizeDescriptor = descriptor && descriptor.replace( /(^\s+|\s+$)/g, "" ),
			widthInCssPixels = pf.findWidthFromSourceSize( sizes ),
			resCandidate;

			if ( sizeDescriptor ) {
				var splitDescriptor = sizeDescriptor.split(" ");

				for (var i = splitDescriptor.length - 1; i >= 0; i--) {
					var curr = splitDescriptor[ i ],
						lastchar = curr && curr.slice( curr.length - 1 );

					if ( ( lastchar === "h" || lastchar === "w" ) && !pf.sizesSupported ) {
						resCandidate = parseFloat( ( parseInt( curr, 10 ) / widthInCssPixels ) );
					} else if ( lastchar === "x" ) {
						var res = curr && parseFloat( curr, 10 );
						resCandidate = res && !isNaN( res ) ? res : 1;
					}
				}
			}
		return resCandidate || 1;
	};

	/**
	 * Takes a srcset in the form of url/
	 * ex. "images/pic-medium.png 1x, images/pic-medium-2x.png 2x" or
	 *     "images/pic-medium.png 400w, images/pic-medium-2x.png 800w" or
	 *     "images/pic-small.png"
	 * Get an array of image candidates in the form of
	 *      {url: "/foo/bar.png", resolution: 1}
	 * where resolution is http://dev.w3.org/csswg/css-values-3/#resolution-value
	 * If sizes is specified, resolution is calculated
	 */
	pf.getCandidatesFromSourceSet = function( srcset, sizes ) {
		var candidates = pf.parseSrcset( srcset ),
			formattedCandidates = [];

		for ( var i = 0, len = candidates.length; i < len; i++ ) {
			var candidate = candidates[ i ];

			formattedCandidates.push({
				url: candidate.url,
				resolution: pf.parseDescriptor( candidate.descriptor, sizes )
			});
		}
		return formattedCandidates;
	};

	/**
	 * if it's an img element and it has a srcset property,
	 * we need to remove the attribute so we can manipulate src
	 * (the property's existence infers native srcset support, and a srcset-supporting browser will prioritize srcset's value over our winning picture candidate)
	 * this moves srcset's value to memory for later use and removes the attr
	 */
	pf.dodgeSrcset = function( img ) {
		if ( img.srcset ) {
			img[ pf.ns ].srcset = img.srcset;
			img.removeAttribute( "srcset" );
		}
	};

	// Accept a source or img element and process its srcset and sizes attrs
	pf.processSourceSet = function( el ) {
		var srcset = el.getAttribute( "srcset" ),
			sizes = el.getAttribute( "sizes" ),
			candidates = [];

		// if it's an img element, use the cached srcset property (defined or not)
		if ( el.nodeName.toUpperCase() === "IMG" && el[ pf.ns ] && el[ pf.ns ].srcset ) {
			srcset = el[ pf.ns ].srcset;
		}

		if ( srcset ) {
			candidates = pf.getCandidatesFromSourceSet( srcset, sizes );
		}
		return candidates;
	};

	pf.applyBestCandidate = function( candidates, picImg ) {
		var candidate,
			length,
			bestCandidate;

		candidates.sort( pf.ascendingSort );

		length = candidates.length;
		bestCandidate = candidates[ length - 1 ];

		for ( var i = 0; i < length; i++ ) {
			candidate = candidates[ i ];
			if ( candidate.resolution >= pf.getDpr() ) {
				bestCandidate = candidate;
				break;
			}
		}

		if ( bestCandidate && !pf.endsWith( picImg.src, bestCandidate.url ) ) {
			if ( pf.restrictsMixedContent() && bestCandidate.url.substr(0, "http:".length).toLowerCase() === "http:" ) {
				if ( typeof console !== undefined ) {
					console.warn( "Blocked mixed content image " + bestCandidate.url );
				}
			} else {
				picImg.src = bestCandidate.url;
				// currentSrc attribute and property to match
				// http://picture.responsiveimages.org/#the-img-element
				picImg.currentSrc = picImg.src;

				var style = picImg.style || {},
					WebkitBackfaceVisibility = "webkitBackfaceVisibility" in style,
					currentZoom = style.zoom;

				if (WebkitBackfaceVisibility) { // See: https://github.com/scottjehl/picturefill/issues/332
					style.zoom = ".999";

					WebkitBackfaceVisibility = picImg.offsetWidth;

					style.zoom = currentZoom;
				}
			}
		}
	};

	pf.ascendingSort = function( a, b ) {
		return a.resolution - b.resolution;
	};

	/**
	 * In IE9, <source> elements get removed if they aren't children of
	 * video elements. Thus, we conditionally wrap source elements
	 * using <!--[if IE 9]><video style="display: none;"><![endif]-->
	 * and must account for that here by moving those source elements
	 * back into the picture element.
	 */
	pf.removeVideoShim = function( picture ) {
		var videos = picture.getElementsByTagName( "video" );
		if ( videos.length ) {
			var video = videos[ 0 ],
				vsources = video.getElementsByTagName( "source" );
			while ( vsources.length ) {
				picture.insertBefore( vsources[ 0 ], video );
			}
			// Remove the video element once we're finished removing its children
			video.parentNode.removeChild( video );
		}
	};

	/**
	 * Find all `img` elements, and add them to the candidate list if they have
	 * a `picture` parent, a `sizes` attribute in basic `srcset` supporting browsers,
	 * a `srcset` attribute at all, and they haven’t been evaluated already.
	 */
	pf.getAllElements = function() {
		var elems = [],
			imgs = doc.getElementsByTagName( "img" );

		for ( var h = 0, len = imgs.length; h < len; h++ ) {
			var currImg = imgs[ h ];

			if ( currImg.parentNode.nodeName.toUpperCase() === "PICTURE" ||
			( currImg.getAttribute( "srcset" ) !== null ) || currImg[ pf.ns ] && currImg[ pf.ns ].srcset !== null ) {
				elems.push( currImg );
			}
		}
		return elems;
	};

	pf.getMatch = function( img, picture ) {
		var sources = picture.childNodes,
			match;

		// Go through each child, and if they have media queries, evaluate them
		for ( var j = 0, slen = sources.length; j < slen; j++ ) {
			var source = sources[ j ];

			// ignore non-element nodes
			if ( source.nodeType !== 1 ) {
				continue;
			}

			// Hitting the `img` element that started everything stops the search for `sources`.
			// If no previous `source` matches, the `img` itself is evaluated later.
			if ( source === img ) {
				return match;
			}

			// ignore non-`source` nodes
			if ( source.nodeName.toUpperCase() !== "SOURCE" ) {
				continue;
			}
			// if it's a source element that has the `src` property set, throw a warning in the console
			if ( source.getAttribute( "src" ) !== null && typeof console !== undefined ) {
				console.warn("The `src` attribute is invalid on `picture` `source` element; instead, use `srcset`.");
			}

			var media = source.getAttribute( "media" );

			// if source does not have a srcset attribute, skip
			if ( !source.getAttribute( "srcset" ) ) {
				continue;
			}

			// if there's no media specified, OR w.matchMedia is supported
			if ( ( !media || pf.matchesMedia( media ) ) ) {
				var typeSupported = pf.verifyTypeSupport( source );

				if ( typeSupported === true ) {
					match = source;
					break;
				} else if ( typeSupported === "pending" ) {
					return false;
				}
			}
		}

		return match;
	};

	function picturefill( opt ) {
		var elements,
			element,
			parent,
			firstMatch,
			candidates,
			options = opt || {};

		elements = options.elements || pf.getAllElements();

		// Loop through all elements
		for ( var i = 0, plen = elements.length; i < plen; i++ ) {
			element = elements[ i ];
			parent = element.parentNode;
			firstMatch = undefined;
			candidates = undefined;

			// immediately skip non-`img` nodes
			if ( element.nodeName.toUpperCase() !== "IMG" ) {
				continue;
			}

			// expando for caching data on the img
			if ( !element[ pf.ns ] ) {
				element[ pf.ns ] = {};
			}

			// if the element has already been evaluated, skip it unless
			// `options.reevaluate` is set to true ( this, for example,
			// is set to true when running `picturefill` on `resize` ).
			if ( !options.reevaluate && element[ pf.ns ].evaluated ) {
				continue;
			}

			// if `img` is in a `picture` element
			if ( parent.nodeName.toUpperCase() === "PICTURE" ) {

				// IE9 video workaround
				pf.removeVideoShim( parent );

				// return the first match which might undefined
				// returns false if there is a pending source
				// TODO the return type here is brutal, cleanup
				firstMatch = pf.getMatch( element, parent );

				// if any sources are pending in this picture due to async type test(s)
				// remove the evaluated attr and skip for now ( the pending test will
				// rerun picturefill on this element when complete)
				if ( firstMatch === false ) {
					continue;
				}
			} else {
				firstMatch = undefined;
			}

			// Cache and remove `srcset` if present and we’re going to be doing `picture`/`srcset`/`sizes` polyfilling to it.
			if ( parent.nodeName.toUpperCase() === "PICTURE" ||
			( element.srcset && !pf.srcsetSupported ) ||
			( !pf.sizesSupported && ( element.srcset && element.srcset.indexOf("w") > -1 ) ) ) {
				pf.dodgeSrcset( element );
			}

			if ( firstMatch ) {
				candidates = pf.processSourceSet( firstMatch );
				pf.applyBestCandidate( candidates, element );
			} else {
				// No sources matched, so we’re down to processing the inner `img` as a source.
				candidates = pf.processSourceSet( element );

				if ( element.srcset === undefined || element[ pf.ns ].srcset ) {
					// Either `srcset` is completely unsupported, or we need to polyfill `sizes` functionality.
					pf.applyBestCandidate( candidates, element );
				} // Else, resolution-only `srcset` is supported natively.
			}

			// set evaluated to true to avoid unnecessary reparsing
			element[ pf.ns ].evaluated = true;
		}
	}

	/**
	 * Sets up picture polyfill by polling the document and running
	 * the polyfill every 250ms until the document is ready.
	 * Also attaches picturefill on resize
	 */
	function runPicturefill() {
		picturefill();
		var intervalId = setInterval( function() {
			// When the document has finished loading, stop checking for new images
			// https://github.com/ded/domready/blob/master/ready.js#L15
			picturefill();
			if ( /^loaded|^i|^c/.test( doc.readyState ) ) {
				clearInterval( intervalId );
				return;
			}
		}, 250 );

		function checkResize() {
			var resizeThrottle;

			if ( !w._picturefillWorking ) {
				w._picturefillWorking = true;
				w.clearTimeout( resizeThrottle );
				resizeThrottle = w.setTimeout( function() {
					picturefill({ reevaluate: true });
					w._picturefillWorking = false;
				}, 60 );
			}
		}

		if ( w.addEventListener ) {
			w.addEventListener( "resize", checkResize, false );
		} else if ( w.attachEvent ) {
			w.attachEvent( "onresize", checkResize );
		}
	}

	runPicturefill();

	/* expose methods for testing */
	picturefill._ = pf;

	/* expose picturefill */
	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// CommonJS, just export
		module.exports = picturefill;
	} else if ( typeof define === "function" && define.amd ) {
		// AMD support
		define( function() { return picturefill; } );
	} else if ( typeof w === "object" ) {
		// If no AMD and we are in the browser, attach to window
		w.picturefill = picturefill;
	}

} )( this, this.document, new this.Image() );

/*! svg4everybody v1.0.0 | github.com/jonathantneal/svg4everybody */
(function (document, uses, requestAnimationFrame, CACHE, IE9TO11) {
	function embed(svg, g) {
		if (g) {
			var
			viewBox = g.getAttribute('viewBox'),
			fragment = document.createDocumentFragment(),
			clone = g.cloneNode(true);

			if (viewBox) {
				svg.setAttribute('viewBox', viewBox);
			}

			while (clone.childNodes.length) {
				fragment.appendChild(clone.childNodes[0]);
			}

			svg.appendChild(fragment);
		}
	}

	function onload() {
		var xhr = this, x = document.createElement('x'), s = xhr.s;

		x.innerHTML = xhr.responseText;

		xhr.onload = function () {
			s.splice(0).map(function (array) {
				embed(array[0], x.querySelector('#' + array[1].replace(/(\W)/g, '\\$1')));
			});
		};

		xhr.onload();
	}

	function onframe() {
		var use;

		while ((use = uses[0])) {
			var
			svg = use.parentNode,
			url = use.getAttribute('xlink:href').split('#'),
			url_root = url[0],
			url_hash = url[1];

			svg.removeChild(use);

			if (url_root.length) {
				var xhr = CACHE[url_root] = CACHE[url_root] || new XMLHttpRequest();

				if (!xhr.s) {
					xhr.s = [];

					xhr.open('GET', url_root);

					xhr.onload = onload;

					xhr.send();
				}

				xhr.s.push([svg, url_hash]);

				if (xhr.readyState === 4) {
					xhr.onload();
				}

			} else {
				embed(svg, document.getElementById(url_hash));
			}
		}

		requestAnimationFrame(onframe);
	}

	if (IE9TO11) {
		onframe();
	}
})(
	document,
	document.getElementsByTagName('use'),
	window.requestAnimationFrame || window.setTimeout,
	{},
	/Trident\/[567]\b/.test(navigator.userAgent) || (navigator.userAgent.match(/AppleWebKit\/(\d+)/) || [])[1] < 537
);
