/* global console, define, jQuery, require */
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

  function getCursorPosition($inputEl) {
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

    function setCursorRange(input, selectionStart, selectionEnd) {
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

    function setCursorPosition($inputEl, pos) {
      setCursorRange($inputEl.get(0), pos, pos);
    }

    $.fn.c4inputMask = function() {
      var $el       = this,
      $inputEl      = $el.find('input'),
      isValid       = false,
      isError       = false,
      isComplete    = false,
      currentValue  = '',
      lastValue     = '',
      maskValue     = '',
      lastMaskValue = '',
      errorMessage  = '',
      maskEvents,
      lastPos;

      function InputMask() {
        this.fetchValue = function() {
          var newValue = $inputEl.val();
          this.setCurrentValue(newValue);
          return newValue;
        };
        this.fetchMaskValue = function() {
          return $inputEl.val();
        };
        this.getErrorMessage = function() {
          return errorMessage;
        };
        this.setErrorMessage = function(newErrorMessage) {
          errorMessage = newErrorMessage;
        };
        this.setCurrentValue = function(newValue) {
          lastValue = currentValue;
          if (newValue != currentValue) {
            $el.trigger('maskFieldValueChanged', [newValue, this]);
            currentValue = newValue;
          }
        };
        this.validate = function() {};
        this.afterValidate = function(validateValid, validateError, validateComplete) {
          var $els = $el.add($inputEl);
          if (validateValid !== isValid) {
            isValid = validateValid;
            if (isValid) {
              $el.trigger('maskValid', [this]);
            } else {
              $el.trigger('maskInvalid', [this]);
            }
            $el.trigger('maskValidChange', [isValid, this]);
            $els.toggleClass('is-valid', isValid);
          }
          if (validateError !== isError) {
            isError = validateError;
            if (isError) {
              $el.trigger('maskValueError', [this]);
            } else {
              $el.trigger('maskValueOK', [this]);
            }
            $el.trigger('maskValueErrorChange', [isError, this]);
            $els.toggleClass('is-error', isError);
          }
          if (validateComplete !== isComplete) {
            isComplete = validateComplete;
            if (isComplete) {
              $el.trigger('maskValueComplete', [this]);
            } else {
              $el.trigger('maskValueIncomplete', [this]);
            }
            $el.trigger('maskValueCompleteChange', [isComplete, this]);
            $els.toggleClass('is-complete', isComplete);
          }
        };
        this.formatMask = function() {
          lastMaskValue = maskValue;
          maskValue = currentValue;
        };
        this.afterFormatMask = function() {
          var maskChanged       = (lastMaskValue !== maskValue),
          valueChanged      = (lastValue !== currentValue),
          maskLengthChange  = (maskValue.length - lastMaskValue.length),
          valueLengthChange = (currentValue.length - lastValue.length),
          valueReplaced     = (valueLengthChange === currentValue.length),
          maskReplaced      = (maskLengthChange === maskValue.length),
          fieldNeedsSync    = (this.fetchMaskValue() !== maskValue),
          posBeforeChange   = null,
          movePos           = false,
          maskSubString     = '',
          valueSubString    = '',
          maskOffset        = 0,
          i, movePosTo;

          lastPos           = getCursorPosition($inputEl);
          posBeforeChange   = lastPos - valueLengthChange;

          maskSubString     = maskValue.substring(posBeforeChange, posBeforeChange + maskLengthChange);
          valueSubString    = currentValue.substring(posBeforeChange, posBeforeChange + maskLengthChange);
          if (maskChanged && valueSubString.length) {
            for (i=0; i<maskSubString.length; i++) {
              while ((maskSubString.length >= i + maskOffset + 1) &&
                maskSubString[i+maskOffset] !== valueSubString[i]) {
                  maskOffset++;
                }
              }
              movePosTo = lastPos + maskOffset;
              if ((movePosTo !== maskValue.length) && lastMaskValue.length) {
                //console.log('Move to : ' + movePosTo);
                movePos = true;
              }
              //console.log('Last Mask: ' + lastMaskValue);
              //console.log('Current Mask: ' + maskValue);
              //console.log('Mask Length Change: ' + maskLengthChange);
              //console.log('Offset: ' + maskOffset);
              //console.log('Last Pos: ' + lastPos);
              //console.log('Move Cursor To : ' + (lastPos + maskOffset));
              //console.log('Position Before Change : ' + posBeforeChange);
              //console.log('Mask Substring: "' + maskSubString + '"');
              //console.log('Value SubString: "' + valueSubString + '"');

            } else {
              //console.log('Mask did not change or there is no value substring');
              //console.log('Mask Changed: ' + maskChanged);
              //console.log('Substring: ' + valueSubString);
              //console.log('Position before change: ' + posBeforeChange);
              //console.log('Mask Length Changed: ' + maskLengthChange);
            }

            if (maskChanged || valueReplaced || fieldNeedsSync) {
              $el.trigger('maskChanged', [this] );
              $inputEl.val(maskValue);
              if (movePos) {
                setCursorPosition($inputEl, movePosTo);
              }
            }
          };
          if ($('html').hasClass('android')) {
            maskEvents = 'change';
          } else {
            maskEvents = 'keypress keyup change';
          }
          $el.find('input').on(maskEvents, $.proxy(function(event) {
            this.fetchValue(event);
            if (event.keyCode && event.keyCode === 8) {
              if ((lastValue.length - currentValue.length) <= 1) {
                //console.log('backspace exemption');
                // Allow user to backspace without intercepting/reformatting
                // If only one character is removed
                return;
              }
            }
            this.validate(currentValue, event);
            this.formatMask(event);

          }, this));
        }

        function CVVInputMask() {
          InputMask.call(this);

          var cardNumberMaskName,
          $cardNumberMaskEl,
          cardType = null,
          completeLength = 3,
          that;

          if ($el.data('mask-cvv-for')) {
            cardNumberMaskName = $el.data('mask-cvv-for');
            that = this;
            $cardNumberMaskEl = $('input[name="' + cardNumberMaskName + '"]').parents('[data-mask]').first();
            $cardNumberMaskEl.on('cardTypeChange', function(event, newCardType) {
              cardType = newCardType;
              that.validate(that.fetchValue());
              //$el.find('[data-complete-length]').html(completeLength);
            });
          }

          this.getErrorMessage = function() {
            return 'Please enter your card\'s ' + completeLength + '-digit security code';
          };
          this.validate = function(fieldValue) {
            var valueValid    = false,
            valueComplete = false,
            valueError    = false;
            completeLength = (cardType && cardType === 'amex') ? 4 : 3;
            if (/[^0-9]+/.test(fieldValue) || fieldValue.length > completeLength) {
              valueError = true;
            } else if (fieldValue.length === completeLength) {
              valueComplete = true;
            }

            this.afterValidate(valueValid, valueError, valueComplete);
          };
        }

        function ExpirationDateInputMask() {
          var charPatterns = [/[01]/,/[0-9]/,/[012]/,/[0-9]/];
          InputMask.call(this);
          errorMessage = 'Please enter your card\'s future expiration date in the format MM/YY';

          this.fetchValue = function() {
            var newValue = $inputEl.val().replace(/\//g, '');
            if (newValue.length === 1 && parseInt(newValue[0], 10) > 1) {
              newValue = '0' + newValue;
            } else if (newValue.length === 3 && parseInt(newValue[0], 10) > 0) {
              // This state can only occur on input masks that aren't validating
              // on every key press (e.g. Android workaround hack).
              newValue = '0' + newValue;
            }
            this.setCurrentValue(newValue);
            return newValue;
          };

          this.formatMask = function() {
            var mask = currentValue, month, year;
            if (currentValue.length === 2) {
              mask = currentValue + '/';
            } else if (currentValue.length > 2) {
              month = currentValue.substring(0, 2);
              year = currentValue.substring(2);
              mask = month + '/' + year;
            }

            lastMaskValue = maskValue;
            maskValue     = mask;
            this.afterFormatMask();
          };

          this.validate = function(currentValue) {
            var i,
            valueValid    = false,
            valueError    = false,
            valueComplete = false,
            valueChars    = currentValue.split(''),
            month, year, dateNow, yearNow, monthNow;

            if (/[^0-9-\/]+/.test(currentValue)) {
              valueError = true;
            } else if (currentValue.length <= 4) {
              for (i = 0; i < valueChars.length; i++) {
                if (!charPatterns[i].test(valueChars[i])) {
                  valueError = true;
                }
              }
            }
            if (currentValue.length >= 2) {
              month = parseInt(currentValue.substring(0, 2), 10);
              if (!month || month > 12) {
                valueError = true;
              }
            }
            if (currentValue.length === 4 && !valueError) {
              dateNow = new Date();
              yearNow = dateNow.getFullYear();
              year  = parseInt('20' + currentValue.substring(2, 4), 10);
              if (year < yearNow) {
                valueError = true;
              } else if (year === yearNow) {
                month = parseInt(currentValue.substring(0, 2), 10);
                monthNow = dateNow.getMonth() + 1;
                if (month < monthNow) {
                  valueError = true;
                }
              }

              if (!valueError) {
                valueComplete = true;
              }
            }
            this.afterValidate(valueValid, valueError, valueComplete);
          };
        }

        function CreditCardInputMask() {
          var minLength = 15,
          maxLength = 16;
          InputMask.call(this);
          errorMessage = 'Sorry, that doesn\'t look like a valid card number';

          var cardType         = null,
          validCardTypes   = ['visa', 'amex', 'discover', 'mastercard'],
          cardClasses      = ['is-default'],
          cardPatterns     = {
            'visa'              : /^4/,
            'mastercard'        : /^5[1-5]/,
            'amex'              : /^3(4|7)/,
            'discover'          : /^6011(?!31)(?=\d{2})/
          };

          for (var thing in validCardTypes) {
            cardClasses.push('is-' + validCardTypes[thing]);
          }
          cardClasses = cardClasses.join(' ');

          this.fetchValue = function() {
            var newValue = $inputEl.val().replace(/\s*/g, '');
            this.setCurrentValue(newValue);
            this.checkCardType(currentValue);
            return newValue;
          };

          this.checkCardType = function(cardNumber) {
            var newCardType = null;
            for (var card in cardPatterns) {
              if (cardPatterns[card].test(cardNumber)) {
                newCardType = card;
              }
            }
            if (newCardType !== cardType) {
              cardType = newCardType;
              $el.trigger('cardTypeChange', [cardType, this]);
              this.updateCardType();
            }
          };

          this.updateCardType = function() {
            var newTypeName = (cardType !== null) ? cardType : 'default';
            $el.removeClass(cardClasses).addClass('is-' + newTypeName);
          };

          this.validate = function(cardNumber) {
            var numberValid     = false,
            numberError     = false,
            numberComplete  = false,
            nCheck          = 0,
            nDigit          = 0,
            bEven           = false;

            if (/[^0-9-\s]+/.test(cardNumber) || cardNumber.length > maxLength) {
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
            this.afterValidate(numberValid, numberError, numberComplete);
            return numberValid;
          };

          this.formatMask = function(event) {
            var cardDigits = currentValue.split(''),
            chunks       = [],
            numberLength = cardDigits.length,
            chunkLength  = 4,
            masked        = '',
            separator     = ' ';
            if (!isError) {
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
                numberLength < maxLength) {
                  masked += separator; // Add a trailing space
                }
                lastMaskValue = maskValue;
                maskValue     = masked;
                this.afterFormatMask();
              }
            };
          }

          var maskType = $(this).data('mask-type');
          if (maskType === 'credit-card') {
            return new CreditCardInputMask();
          } else if (maskType === 'expiration-date') {
            return new ExpirationDateInputMask();
          } else if (maskType === 'cvv') {
            return new CVVInputMask();
          }
        };

        (function() {
          var $errorTemplate = $('<p></p>').addClass('field-note danger');

          $('[data-mask]').each(function() {
            $(this).c4inputMask();
          });
          $('[data-mask]').on('maskValueErrorChange', function(event, isError, mask) {
            var $errorEl,
            maskType = $(this).data('mask-type');

            // Always remove any existing field-notes in danger state
            $(this).find('.danger').remove();

            if (isError) {
              $(this).find('input').after(function () {
                return $errorTemplate.clone().html(mask.getErrorMessage());
              });
            }
          });
        })();

      }));
