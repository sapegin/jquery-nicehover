/**
@title: Nice Hover
@version: 0.0.1
@author: Artem Sapegin
@author: Three Dub Media
@date: 2011-01-21
@license: http://www.opensource.org/licenses/mit-license.php
@copyright: 2011 Artem Sapegin (sapegin.ru)
@copyright: 2008 Three Dub Media (http://threedubmedia.com)

@does:
Based on jquery.event.hover.js by Three Dub Media (http://threedubmedia.com)

@howto:

@customization:
Defines the delay (msec) while mouse is inside the element before checking the speed:
$.event.special.hover.delay = 10; 
Defines the maximum speed (px/sec) the mouse may be moving to trigger the hover event:
$.event.special.hover.speed = 100; 

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