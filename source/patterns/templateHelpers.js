'use strict';
var Handlebars  = require('handlebars');
/* These helpers are available to all Handlebars templates
 * compiled by the gulp library task */
module.exports = {
  count: function count (list) {
    return list.length;
  },
  times: function times (n, block) {
    var accum = '', data;
    for (var i = 0; i < n; ++i) {
      data = Handlebars.createFrame(block.data || {});
      data.index = i;
      accum += block.fn(i, { data: data });
    }
    return accum;
  },
  randomIf: function randomIf (block) {
    if (Math.round(Math.random())) {
      return block.fn(this);
    } else {
      return block.inverse(this);
    }
  },
  random: function random () {
    var args = Array.prototype.slice.call(arguments, 0, -1);
    return args[Math.floor(Math.random() * args.length)];
  },
  formatCurrency: function formatCurrency (value) {
    return value.toFixed(2);
  },
  formatFraction: function formatFraction (value) {
    var fractionCodes = {
      25: 188,
      50: 189,
      75: 190,
      33: 8531,
      66: 8532,
      20: 8533,
      40: 8534,
      60: 8535,
      80: 8536,
      16: 8537,
      83: 8538,
      12: 8539,
      37: 8540,
      62: 8541,
      87: 8542
    };
    if (parseInt(value) !== value) {
      var integer = Math.floor(value);
      var decimal = value - integer;
      var key = Math.floor(decimal * 100);
      if (fractionCodes.hasOwnProperty(key)) {
        value = integer + '&#' + fractionCodes[key] + ';';
      }
    }
    return value;
  },
  replace: function replace (str, a, b) {
    str = str + '';
    return str.split(a).join(b);
  },
  formatSlug: function formatSlug (str) {
    return str
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')       // Replace spaces with -
      .replace(/[^\w\-]+/g, '-')  // Remove all non-word chars
      .replace(/\-\-+/g, '-')     // Replace multiple - with single -
      .replace(/^-+/, '')         // Trim - from start of text
      .replace(/-+$/, '');        // Trim - from end of text
  },

  /** inspired by https://github.com/assemble/handlebars-helpers */

  withFirst: function withFirst (array, count, options) {
    count = count ? parseFloat(count) : 1;
    array = array.slice(0, count);
    var result = '';
    for (var item in array) {
      result += options.fn(array[item]);
    }
    return result;
  },

  /** https://github.com/assemble/handlebars-helpers */

  gt: function gt (value, test, options) {
    if (value > test) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },

  gte: function gte (value, test, options) {
    if (value >= test) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },

  lt: function lt (value, test, options) {
    if (value < test) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },

  lte: function lte (value, test, options) {
    if (value <= test) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },

  ifNth: function ifNth (denominator, numerator, options) {
    numerator = numerator+1;
    if (numerator % denominator === 0) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  }

};
