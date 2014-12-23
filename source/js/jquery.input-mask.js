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
        minlength: 15,
        maxlength: 15,
        chunks: [4,6,5]
      },
      dinersclub: {
        pattern: /3(?:0[0-5]|[68][0-9])/,
        minlength: 14,
        maxlength: 14,
        chunks: [5,4,5]
      },
      discover: {
        pattern: /^6011(?!31)(?=\d{2})/,
        minlength: 16,
        maxlength: 16,
        chunks: [4,4,4,4]
      },
      mastercard: {
        pattern: /^5[1-5]/,
        minlength: 16,
        maxlength: 16,
        chunks: [4,4,4,4]
      },
      visa: {
        pattern: /^4/,
        minlength: 13,
        maxlength: 16,
        chunks: [4,4,4,4]
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
  InputMask.prototype.setErrorMessage = function(newErrorMessage) { }; // REFACTORME
  InputMask.prototype.getErrorMessage = function() { }; // REFACTORME

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
    console.log('credit');
    this.minLength      = 15; // TODO
    this.maxLength      = 16; // TODO
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
      bEven           = false;

      if (/[^0-9\s]+/.test(cardNumber) || cardNumber.length > this.maxLength) {
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
      if (numberValid && cardNumber.length >= this.minLength) {
        numberComplete = true;
      } else if (cardNumber.length >= this.maxLength && !numberValid) {
        numberError = true;
      }
      this.afterValidate(numberError, numberComplete);
      return numberValid;
    };

    this.formatMask = function(event) {
      var cardDigits = this.currentValue.split(''),
      chunks         = [],
      numberLength   = cardDigits.length,
      chunkLength    = 4,
      masked         = '',
      separator      = ' ';
      if (!this.isError) {
        for(var i=0; i <= numberLength; i+= chunkLength) {
          if (numberLength >= i + chunkLength) {
            chunks.push(cardDigits.slice(i, i+chunkLength).join(''));
          } else if ( numberLength > i) {
            chunks.push(cardDigits.slice(i).join(''));
          }
        }
        masked        = chunks.join(separator); // New masked value
        if (numberLength % chunkLength === 0 &&
          numberLength > 0 &&
          numberLength < this.maxLength) {
            masked += separator; // Add a trailing space
        }
        this.lastMaskValue = this.maskValue;
        this.maskValue     = masked;
        this.afterFormatMask();
      }
    };

  };

  InputMask.ExpirationDateMask = function(element, options) {
    console.log('expiration');
    this.errorMessage = 'Please enter your card\'s future expiration date in the format MM/YY'; // TODO
    this.charPatterns = [/[01]/,/[0-9]/,/[012]/,/[0-9]/];

    this.fetchValue = function() {
      var newValue = this.$inputEl.val().replace(/\//g, '');
      if (newValue.length === 1 && parseInt(newValue[0], 10) > 1) {
        newValue = '0' + newValue;
      } else if (newValue.length === 3 && parseInt(newValue[0], 10) > 0) {
        // This state can only occur on input masks that aren't validating
        // on every key press (e.g. Android workaround hack).
        newValue = '0' + newValue; // TODO
      }
      this.setCurrentValue(newValue);
      return newValue;
    };

    this.formatMask = function() {
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
    console.log('cvv');
    this.cardNumberInputName = this.$element.data('mask-cvv-for');
    this.cardType            = 'default';
    this.completeLength      = 3;

    if (this.cardNumberInputName) {
      this.$cardEl = $('input[name="' + this.cardNumberInputName + '"]').parents('[data-mask]').first();
      this.$cardEl.on('cardTypeChange', $.proxy(function(event, newCardType) {
        this.cardType = newCardType;
        this.validate(this.fetchValue());
      }, this));
    }
    this.getErrorMessage = function() {
      return 'Please enter your card\'s ' + this.completeLength + '-digit security code'; // TODO
    };
    this.validate = function(fieldValue) {
      var valueComplete = false,
      valueError    = false;
      this.completeLength = (this.cardType && this.cardType === 'amex') ? 4 : 3;
      if (/[^0-9]+/.test(fieldValue) || fieldValue.length > this.completeLength) {
        valueError = true;
      } else if(fieldValue.length === this.completeLength) {
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
