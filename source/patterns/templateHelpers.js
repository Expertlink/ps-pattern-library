'use strict';
var Handlebars  = require('handlebars');
/* These helpers are available to all Handlebars templates
 * compiled by the styleGuide task */
module.exports = {
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
  random: function random() {
    var args = Array.prototype.slice.call(arguments, 0, -1);
    return args[Math.floor(Math.random() * args.length)];
  }
};
