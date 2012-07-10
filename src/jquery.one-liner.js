/*
 *  Sizing v1.0 - jQuery One Liner
 *
 *  Copyright (c) 2012 Deux Huit Huit (http://www.deuxhuithuit.com/)
 *  Licensed under the MIT (https://github.com/DeuxHuitHuit/jQuery-one-liner/blob/master/LICENSE.txt)
 */

(function ($, undefined) {
	
	"use strict";

	var 
	
	fontSize = function (c) {
		// get ratio for this child
		var ratio = $.sdiv(t.width(), c.find(opts.wrapper+'.'+opts.wrapperClass).outerWidth(true));
		
		if (ratio !== 0 && ratio != null) {
			var currentSize = c.css('font-size'),
				currentSizeFloat = parseFloat(currentSize, 10),
				currentSizeUnit = currentSize.replace(/[0-9]+/, '');
			
			// change the font-size according to the ratio
			c.css('font-size', ((currentSizeFloat * ratio) * opts.factor) + currentSizeUnit);
		}
	},
	
	letterSpacing = function (c) {
		// get the diff between the target and the child
		var diff = t.width() - c.find(opts.wrapper+'.'+opts.wrapperClass).outerWidth(true),
		// get the count of chars in the children
			length = t.text().length;
		
		if (diff !== 0 && !isNaN(diff)) {
			var dir = diff > 0 ? '+' : '-';
			
			// distribute the free space across all letters
			c.css('letter-spacing', dir + $.sdiv(diff * opts.factor, length) + 'px');
		}
	},
	
	_oneLiner =  function (options) {
		var t = $(this),
			children = t.children(),
			fx = $.noop,
			opts = {
				factor: 0.98,
				wrapper: 'span',
				wrapperClass : 'one-liner',
				fx: 'font-size', // can be either be `font-size` or `letter-spacing` 
				childSelector: null
			};
		
		if (!!options) {
			opts = $.extend(opts, options);
		}
		
		// capture the children, if we need to
		if (!!opts.childSelector) {
			children = t.find(opts.childSelector);
		}
		
		// check for the fx param
		switch (opts.fx) {
			case 'font-size':
				fx = fontSize;
				break;
			
			case 'letter-spacing':
				fx = letterSpacing;
				break;
				
			default:
				if ($.isFunction(opts.fx)) {
					fx = opts.fx;
				} else {
					fx = $.oneLiner.strategies[opts.fx];
				}
				if (!$.isFunction(fx)) {
					console.log('[oneLiner] the `fx` parameter is not valid!');
					return this;
				}
		}
		
		// set overflow to hidden on container
		t.css('overflow','hidden');
		
		// pass through each children
		children.each(function forEachChildren () {
			var c = $(this);
			
			// make it large enough
			c.width(100000000);
			
			// reset font-size and letter spacing
			c.css('font-size','');
			c.css('letter-spacing','');
			
			if (!c.find('.one-liner').length) {			
				// wrap inner content
				c.html('<'+opts.wrapper+' class="'+opts.wrapperClass+'">' + c.html() + '</'+opts.wrapper+'>');
			}
			
			// call the actual function
			fx.call(t, c);
			
			// reset width
			c.css('width', '');
		}); // end each
		
		// reset container overflow
		t.css('overflow','');
	};
	
	// ACTUAL PLUGINS
	$.fn.extend({
		oneLiner: _oneLiner
	});
	
	// strategies 
	$.extend({
		oneLiner: {
			strategies: {
				fontSize: fontSize,
				letterSpacing: letterSpacing
			}
		}
	});
	
})(jQuery);