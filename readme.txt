jQuery Nice Hover
© 2011 Artem Sapegin / http://sapegin.ru

Adds 'nicehover' event to jQuery. It’s similar to hover but fires only if mouse stopped for a while on target element.


How to use it:

$('.wrapper img').bind('nicehover', function(e){ $(this).toggleClass('hover'); });
$('.wrapper').delegate('img', 'nicehover', function(e){ $(this).toggleClass('hover'); });


Based on jquery.event.hover.js by Three Dub Media (http://threedubmedia.com)