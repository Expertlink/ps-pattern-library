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
