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

  InputMask.DEFAULTS = {};
  InputMask.PLUGIN_NAME = 'c4-input-mask';

  InputMask.factory = function(element, maskType, options) {
    var ctor = maskType,
    newMask;

    if (typeof InputMask[ctor] !== 'function') {
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
    this.minLength = 15;
    this.maxLength = 16;
    this.errorMessage = 'Sorry, that doesn\'t look like a valid card number';
    this.cardType     = null;
    this.validCardTypes = ['visa', 'amex', 'discover', 'mastercard']; // TODO
    this.cardClasses  = ['is-default'];
    this.cardPatterns =  {
      'visa'              : /^4/,
      'mastercard'        : /^5[1-5]/,
      'amex'              : /^3(4|7)/,
      'discover'          : /^6011(?!31)(?=\d{2})/
    }; // TODO

    for (var thing in this.validCardTypes) {
      this.cardClasses.push('is-' + this.validCardTypes[thing]);
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
      for (var card in this.cardPatterns) {
        if (this.cardPatterns[card].test(cardNumber)) {
          newCardType = card;
        }
      }
      if (newCardType !== this.cardType) {
        this.cardType = newCardType;
        this.$element.trigger('cardTypeChange', [this.cardType, this]);
        this.updateCardType();
      }
    };

    this.updateCardType = function() {
      var newTypeName = (this.cardType !== null) ? this.cardType : 'default';
      this.$element.removeClass(this.cardClasses).addClass('is-' + newTypeName);
    };

    this.validate = function(cardNumber) {
      var numberValid     = false,
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

/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
* Build: http://modernizr.com/download/#-csstransforms3d-shiv-cssclasses-teststyles-testprop-testallprops-prefixes-domprefixes
*/
;window.Modernizr=function(a,b,c){function z(a){j.cssText=a}function A(a,b){return z(m.join(a+";")+(b||""))}function B(a,b){return typeof a===b}function C(a,b){return!!~(""+a).indexOf(b)}function D(a,b){for(var d in a){var e=a[d];if(!C(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function E(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:B(f,"function")?f.bind(d||b):f}return!1}function F(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+o.join(d+" ")+d).split(" ");return B(b,"string")||B(b,"undefined")?D(e,b):(e=(a+" "+p.join(d+" ")+d).split(" "),E(e,b,c))}var d="2.8.3",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n="Webkit Moz O ms",o=n.split(" "),p=n.toLowerCase().split(" "),q={},r={},s={},t=[],u=t.slice,v,w=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},x={}.hasOwnProperty,y;!B(x,"undefined")&&!B(x.call,"undefined")?y=function(a,b){return x.call(a,b)}:y=function(a,b){return b in a&&B(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e}),q.csstransforms3d=function(){var a=!!F("perspective");return a&&"webkitPerspective"in g.style&&w("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a};for(var G in q)y(q,G)&&(v=G.toLowerCase(),e[v]=q[G](),t.push((e[v]?"":"no-")+v));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)y(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},z(""),i=k=null,function(a,b){function l(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function m(){var a=s.elements;return typeof a=="string"?a.split(" "):a}function n(a){var b=j[a[h]];return b||(b={},i++,a[h]=i,j[i]=b),b}function o(a,c,d){c||(c=b);if(k)return c.createElement(a);d||(d=n(c));var g;return d.cache[a]?g=d.cache[a].cloneNode():f.test(a)?g=(d.cache[a]=d.createElem(a)).cloneNode():g=d.createElem(a),g.canHaveChildren&&!e.test(a)&&!g.tagUrn?d.frag.appendChild(g):g}function p(a,c){a||(a=b);if(k)return a.createDocumentFragment();c=c||n(a);var d=c.frag.cloneNode(),e=0,f=m(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function q(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return s.shivMethods?o(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+m().join().replace(/[\w\-]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(s,b.frag)}function r(a){a||(a=b);var c=n(a);return s.shivCSS&&!g&&!c.hasCSS&&(c.hasCSS=!!l(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),k||q(a,c),a}var c="3.7.0",d=a.html5||{},e=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,f=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,g,h="_html5shiv",i=0,j={},k;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",g="hidden"in a,k=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){g=!0,k=!0}})();var s={elements:d.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:c,shivCSS:d.shivCSS!==!1,supportsUnknownElements:k,shivMethods:d.shivMethods!==!1,type:"default",shivDocument:r,createElement:o,createDocumentFragment:p};a.html5=s,r(b)}(this,b),e._version=d,e._prefixes=m,e._domPrefixes=p,e._cssomPrefixes=o,e.testProp=function(a){return D([a])},e.testAllProps=F,e.testStyles=w,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+t.join(" "):""),e}(this,this.document);

(function() {
  var $, SimpleSlideView, defaults, outerHeight, outerWidth, pushOrPop, resetStyles, scrollCallback;

  $ = typeof jQuery !== "undefined" && jQuery !== null ? jQuery : Zepto;

  scrollCallback = ($.scrollTo != null) && (typeof jQuery !== "undefined" && jQuery !== null) ? function(top, duration, callback) {
    return $.scrollTo(top, duration, {
      'axis': 'y',
      'onAfter': callback
    });
  } : $.scrollTo != null ? $.scrollTo : function(top, duration, callback) {
    window.scrollTo(0, top);
    if (callback) {
      return callback();
    }
  };

  defaults = {
    views: '.view',
    activeView: null,
    deferOn: false,
    duration: ($.fx != null) && ($.fx.cssPrefix != null) ? $.fx.speeds._default : 400,
    easing: typeof Zepto !== "undefined" && Zepto !== null ? 'ease-out' : 'swing',
    useTransformProps: typeof Zepto !== "undefined" && Zepto !== null,
    use3D: (typeof Modernizr !== "undefined" && Modernizr !== null) && Modernizr.csstransforms3d,
    cssPrefix: ($.fx != null) && ($.fx.cssPrefix != null) ? $.fx.cssPrefix : '',
    resizeHeight: true,
    heightDuration: null,
    concurrentHeightChange: typeof Zepto === "undefined" || Zepto === null,
    scrollOn: 'start',
    scrollCallback: scrollCallback,
    scrollDuration: null,
    scrollToContainerTop: true,
    concurrentScroll: typeof Zepto === "undefined" || Zepto === null,
    maintainViewportHeight: null,
    dataAttrEvent: 'click',
    dataAttr: {
      push: 'pushview',
      pop: 'popview'
    },
    classNames: {
      container: 'SimpleSlideView-container',
      view: 'SimpleSlideView-view',
      activeView: 'SimpleSlideView-view-active'
    },
    eventNames: {
      on: 'slideViewOn',
      off: 'slideViewOff',
      beforeOn: 'slideViewBeforeOn',
      beforeOff: 'slideViewBeforeOff',
      deferred: 'slideViewDeferred',
      viewChangeStart: 'viewChangeStart',
      viewChangeEnd: 'viewChangeEnd'
    }
  };

  resetStyles = function(el, styles) {
    var $el, reset, style, _i, _len;
    $el = $(el);
    reset = {};
    for (_i = 0, _len = styles.length; _i < _len; _i++) {
      style = styles[_i];
      reset[style] = '';
    }
    return $el.css(reset);
  };

  outerHeight = function(el) {
    if ($.fn.outerHeight != null) {
      return $(el).outerHeight();
    }
    return $(el).height();
  };

  outerWidth = function(el) {
    if ($.fn.outerWidth != null) {
      return $(el).outerWidth();
    }
    return $(el).width();
  };

  pushOrPop = function(action, pushResult, popResult) {
    if (pushResult == null) {
      pushResult = true;
    }
    if (popResult == null) {
      popResult = false;
    }
    if (action === 'push') {
      return pushResult;
    } else {
      return popResult;
    }
  };

  SimpleSlideView = (function() {
    function SimpleSlideView(element, options) {
      this.options = $.extend(true, {}, defaults, options);
      if (this.options.heightDuration == null) {
        this.options.heightDuration = this.options.duration;
      }
      if (this.options.scrollDuration == null) {
        this.options.scrollDuration = this.options.duration;
      }
      if (this.options.maintainViewportHeight == null) {
        this.options.maintainViewportHeight = this.options.resizeHeight && this.options.scrollOnStart;
      }
      if (window.innerHeight == null) {
        this.options.maintainViewportHeight = false;
      }
      this.$container = $(element);
      this.$views = typeof this.options.views === 'string' ? this.$container.find(this.options.views) : $(this.options.views);
      this.$activeView = this.options.activeView != null ? $(this.options.activeView) : this.$views.first();
      this.isActive = false;
      if (this.options.deferOn) {
        this.$container.trigger(this.options.eventNames.deferred);
      } else {
        this.on();
      }
    }

    SimpleSlideView.prototype.on = function() {
      var _this = this;
      if (this.isActive) {
        return;
      }
      this.$container.trigger(this.options.eventNames.beforeOn);
      this.queue = [];
      this.isActive = true;
      this.isSliding = false;
      this.$container.addClass(this.options.classNames.container);
      this.$views.addClass(this.options.classNames.view);
      this.$activeView.addClass(this.options.classNames.activeView);
      this.$views.not(this.$activeView).css('display', 'none');
      if (this.options.maintainViewportHeight) {
        this.lastViewportHeight = window.innerHeight;
      }
      if (this.options.dataAttrEvent != null) {
        this.$container.on(this.options.dataAttrEvent, '[data-' + this.options.dataAttr.push + ']', function(event) {
          var $el, target;
          $el = $(event.currentTarget);
          target = $el.data(_this.options.dataAttr.push);
          if (!target.length) {
            target = $el.attr('href');
          }
          if (target.length) {
            event.preventDefault();
            return _this.pushView(target);
          }
        });
        this.$container.on(this.options.dataAttrEvent, '[data-' + this.options.dataAttr.pop + ']', function(event) {
          var $el, target;
          $el = $(event.currentTarget);
          target = $el.data(_this.options.dataAttr.pop);
          if (!target.length) {
            target = $el.attr('href');
          }
          if (target.length) {
            event.preventDefault();
            return _this.popView(target);
          }
        });
      }
      return this.$container.trigger(this.options.eventNames.on);
    };

    SimpleSlideView.prototype.off = function() {
      if (!this.isActive) {
        return;
      }
      this.$container.trigger(this.options.eventNames.beforeOff);
      this.queue = [];
      this.isActive = false;
      this.isSliding = false;
      this.$container.removeClass(this.options.classNames.container);
      this.$views.removeClass(this.options.classNames.view + ' ' + this.options.classNames.activeView);
      this.$views.css('display', '');
      if (this.options.maintainViewportHeight) {
        $('html').css('min-height', '');
      }
      if (this.options.dataAttrEvent != null) {
        this.$container.off(this.options.dataAttrEvent, '[data-' + this.options.dataAttr.push + ']');
        this.$container.off(this.options.dataAttrEvent, '[data-' + this.options.dataAttr.pop + ']');
      }
      return this.$container.trigger(this.options.eventNames.off);
    };

    SimpleSlideView.prototype.toggle = function(activate) {
      if (activate == null) {
        activate = !this.isActive;
      }
      if (activate) {
        return this.on();
      }
      return this.off();
    };

    SimpleSlideView.prototype.changeView = function(targetView, action) {
      var $bothViews, $targetView, activeCSS, args, beforeChangeEnd, bothCSS, changeAction, containerCSS, containerWidth, inAnimProps, onChangeEnd, onScrollEnd, outAnimProps, resetProps, targetCSS, transformProp, translateAfter, translateBefore,
        _this = this;
      $targetView = $(targetView);
      if (!$targetView.length || $targetView[0] === this.$activeView[0]) {
        return;
      }
      args = arguments;
      if (this.isSliding || this.queue.length) {
        return this.queue.push(args);
      }
      this.isSliding = true;
      this.$container.trigger(this.options.eventNames.viewChangeStart, args);
      $bothViews = this.$activeView.add($targetView);
      outAnimProps = {};
      inAnimProps = {};
      resetProps = ['left', 'position', 'top', 'width'];
      containerWidth = outerWidth(this.$container);
      containerCSS = {
        height: outerHeight(this.$container),
        overflow: 'hidden',
        position: 'relative',
        width: '100%'
      };
      activeCSS = {};
      targetCSS = {};
      bothCSS = {
        position: 'absolute',
        top: 0,
        width: containerWidth
      };
      if (this.options.useTransformProps) {
        transformProp = this.options.cssPrefix + 'transform';
        translateBefore = this.options.use3D ? 'translate3d(' : 'translateX(';
        translateAfter = this.options.use3D ? ', 0, 0)' : ')';
        resetProps.push(transformProp);
        bothCSS['left'] = 0;
        targetCSS[transformProp] = translateBefore + pushOrPop(action, 100, -100) + '%' + translateAfter;
        outAnimProps[transformProp] = translateBefore + pushOrPop(action, -100, 100) + '%' + translateAfter;
        inAnimProps[transformProp] = translateBefore + '0' + translateAfter;
      } else {
        activeCSS['left'] = 0;
        targetCSS['left'] = pushOrPop(action, containerWidth, containerWidth * -1);
        outAnimProps['left'] = pushOrPop(action, containerWidth * -1, containerWidth);
        inAnimProps['left'] = 0;
      }
      onScrollEnd = function() {
        _this.isSliding = false;
        _this.$container.trigger(_this.options.eventNames.viewChangeEnd, args);
        if (_this.queue.length) {
          return _this.changeView.apply(_this, _this.queue.shift());
        }
      };
      onChangeEnd = function() {
        resetStyles(_this.$container, ['height', 'overflow', 'position', 'width']);
        _this.$activeView.removeClass(_this.options.classNames.activeView);
        $targetView.addClass(_this.options.classNames.activeView);
        _this.$activeView = $targetView;
        if (_this.options.scrollCallback && _this.options.scrollOn === 'end') {
          return _this._scrollToTop(onScrollEnd);
        } else {
          return onScrollEnd();
        }
      };
      beforeChangeEnd = function() {
        if (_this.options.resizeHeight) {
          if (_this.options.maintainViewportHeight && window.innerHeight > _this.lastViewportHeight) {
            _this.lastViewportHeight = window.innerHeight;
            $html.css('min-height', (_this.lastViewportHeight + top) + 'px');
          }
          return _this.$container.animate({
            height: outerHeight($targetView)
          }, _this.options.heightDuration, _this.options.easing, onChangeEnd);
        } else {
          return onChangeEnd();
        }
      };
      changeAction = function() {
        _this.$container.css(containerCSS);
        $bothViews.css(bothCSS);
        _this.$activeView.css(activeCSS);
        $targetView.css(targetCSS);
        $targetView.show();
        _this.$activeView.animate(outAnimProps, _this.options.duration, _this.options.easing, function() {
          return resetStyles(this, resetProps).hide();
        });
        $targetView.animate(inAnimProps, _this.options.duration, _this.options.easing, function() {
          resetStyles($targetView, resetProps);
          if (!_this.options.concurrentHeightChange) {
            return beforeChangeEnd();
          }
        });
        if (_this.options.concurrentHeightChange) {
          return beforeChangeEnd();
        }
      };
      if (this.options.scrollCallback && this.options.scrollOn === 'start') {
        if (this.options.concurrentScroll) {
          this._scrollToTop();
        } else {
          return this._scrollToTop(changeAction);
        }
      }
      return changeAction();
    };

    SimpleSlideView.prototype._scrollToTop = function(callback) {
      var top;
      top = this.options.scrollToContainerTop ? this.$container.position().top : 0;
      if ($(window).scrollTop() > top) {
        return this.options.scrollCallback(top, this.options.scrollDuration, callback);
      } else if (callback != null) {
        return callback();
      }
    };

    SimpleSlideView.prototype.pushView = function(targetView) {
      return this.changeView(targetView, 'push');
    };

    SimpleSlideView.prototype.popView = function(targetView) {
      return this.changeView(targetView, 'pop');
    };

    return SimpleSlideView;

  })();

  $.fn.simpleSlideView = function(options, extras) {
    if (options == null) {
      options = {};
    }
    if (typeof options !== 'object') {
      options = {
        views: options
      };
    }
    if (typeof extras === 'object') {
      $.extend(options, extras);
    }
    return new SimpleSlideView(this, options);
  };

}).call(this);

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
