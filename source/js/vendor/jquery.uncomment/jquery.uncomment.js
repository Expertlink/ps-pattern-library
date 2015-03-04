/* vim: noet ts=4 sw=4
 * Version: 1.0
 * Date: 2010-01-28
 * Author: Romuald Brunet <romuald@chivil.com>
 */
(function($) {
	$.fn.uncomment = function(recurse) {
		$(this).contents().each(function() {
			if ( recurse && this.hasChildNodes() ) {
				$(this).uncomment(recurse);
			} else if ( this.nodeType == 8 ) {
				// Need to "evaluate" the HTML content,
				// otherwise simple text won't replace
				var e = $('<span>' + this.nodeValue + '</span>');
				$(this).replaceWith(e.contents());
			}
		});
	};
})(jQuery);
