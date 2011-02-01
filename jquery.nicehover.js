/**
 * jQuery Nice Hover
 *
 * Adds nicehover event to jQuery. It’s similar to hover but fires only if mouse has stopped for a while on a target
 * element. It can be useful to prevent “effect of Christmas tree” on pages with a lot of hoverable elements.
 *
 * Based on jquery.event.hover.js by Three Dub Media (http://threedubmedia.com)
 *
 * Demos and documentation: http://sapegin.github.com/jquery-nicehover/
 *
 * @version 0.0.2
 * @requires jQuery 1.4.2
 * @author Artem Sapegin
 * @author Three Dub Media
 * @copyright 2011 Artem Sapegin (sapegin.ru)
 * @copyright 2008 Three Dub Media (http://threedubmedia.com)
 * @license http://www.opensource.org/licenses/mit-license.php
 */

(function($){

// Special event configuration
$.event.special.nicehover = {
	delay: 10, // Milliseconds
	speed: 100, // Pixels per second
	add: function(data){
		data = $.extend(
			{speed: $.event.special.nicehover.speed, delay: $.event.special.nicehover.delay, hovered: 0},
			data || {}
		);
		$.event.add(this, 'mouseenter mouseleave', hoverHandler, data);
	},
	remove: function(){
		$.event.remove(this, 'mouseenter mouseleave', hoverHandler);
	}
};

function hoverHandler(event) {
	// Timeout/recursive function
	function compare() {
		hoverHandler(data);
	}

	var data = event.data || event;
	switch (event.type) {
		case 'mouseenter':
			data.dist2 = 0; // Init mouse distance?
			data.event = event; // Store the event
			data.elem = this; // Reference to the current element
			$.event.add(this, 'mousemove', hoverHandler, data); // Track the mouse
			data.timer = setTimeout(compare, data.delay); // Start async compare
			break;
		case 'mousemove':
			data.dist2 += Math.pow(event.pageX-data.event.pageX, 2) +
				Math.pow(event.pageY-data.event.pageY, 2);
			data.event = event; // Store current event
			break;
		case 'mouseleave':
			clearTimeout(data.timer); // Uncompare
			if (data.hovered) {
				data.event.type = 'nicehover'; // Hijack event
				data.event.liveFired = null; // Fixing jQuery
				$.event.handle.call(data.elem, data.event); // Handle "hoverend"
				data.hovered--; // Reset flag
			}
			else {
				$.event.remove(data.elem, 'mousemove', hoverHandler);
			}
			break;
		default:
			if (data.dist2 <= Math.pow(data.speed*(data.delay/1e3), 2)) { // Speed acceptable
				$.event.remove(data.elem, 'mousemove', hoverHandler);
				data.event.type = 'nicehover'; // Hijack event
				if ($.event.handle.call(data.elem, data.event) !== false) { // Handle "hover"
					data.hovered++; // Flag for "hoverend"
				}
			}
			else data.timer = setTimeout(compare, data.delay); // Async recurse
			data.dist2 = 0; // Reset distance? for next compare
			break;			
	}
}

})(jQuery);