
(function( $ ) {

	var
	namespace = "$ui.anchor",

	Anchor = function( target, settings ) {

		var
		current,
		mappings = {};

		target
		.find( settings.selector4anchor + "[" + settings.symbol + "]" )
		.filter( ".ui.anchor [" + settings.symbol + "]" )
		.each( function() {

			var
			name = this.getAttribute( settings.symbol ),
			self = $( this ),
			content = target.find( settings.selector4content ).filter( "[" + settings.symbol + "='" + name + "']" );

			if ( content.length ) {
				if ( !current ) {
					current = self.addClass( "active" );
				}

				mappings[ name ] = {
					offsetTop: content.offset().top - content.height() + settings.offset,
					anchor: self
				};
			}
		} );

		target
		.undelegate( settings.selector4delegate + "[" + settings.symbol + "]", "click" )
		.delegate( settings.selector4delegate + "[" + settings.symbol + "]", "click", function( e, args ) {

			var
			self = $( this ),
			name = this.getAttribute( settings.symbol ),
			item = mappings[ name ];

			if ( self.is( "[data-forceAnchor]" ) ) {
			    var
			    offset = +self.attr( "data-forceAnchor" ),
			    dest = target.find( settings.selector4content ).filter( "[" + settings.symbol + "=" + name + "]" );

			    item.offsetTop = dest.offset().top + offset;

                self.removeAttr( "data-forceAnchor" );
			}

			if ( item ) {

				current.removeClass( "active" );
				current = item.anchor.addClass( "active" );

				args === undefined && $( target ).animate( {
					"scrollTop": item.offsetTop
				}, 400 );

				e.stopPropagation();
				e.preventDefault();
			}
		} );

		$( document )
		.off( "scroll", autoAnchor )
		.on( "scroll", { mappings: mappings, offset: settings.offset }, autoAnchor );
	},

	timer;

	function autoAnchor( e ) {

		clearTimeout( timer );

		timer = setTimeout( function() {

			var
			/** Shortcuts */
			mappings = e.data.mappings,
            offset = e.data.offset,
            containerOffsetTop = document.body.scrollTop,
            sort = [];

			for ( var i in mappings ) {

				var item = mappings[ i ];

				sort.push( {
					offset: Math.abs( containerOffsetTop - item.offsetTop ),
					item: item
				} );
			}

			sort.sort( function( x, y ) {

				if ( x.offset > y.offset ) {
					return 1;
				}

				if ( x.offset === y.offset ) {
					return 0;
				}

				return -1;
			} );

			var destination = sort[ 0 ][ "item" ][ "anchor" ];

			if ( !destination.hasClass( "active" ) ) {
				e.stopPropagation();
				e.preventDefault();
				destination.trigger( "click", { animate: false } );
			}
		}, 400 );
	}

	$.fn.anchor = function( options ) {

		this.each( function() {
			new Anchor( $( this ), $.extend( {}, $.fn.anchor.defaults, options || {} ) );
		} );
	};

	$.fn.anchor.defaults = {

		symbol 			    : "data-anchor",
		offset 			    : 0,

		selector4anchor 	: "#anchors li",
		selector4delegate   : "#anchors li, a",
		selector4content 	: "#container header, #canvas h3, .ui.ribbon"
	};

})( window.jQuery );
