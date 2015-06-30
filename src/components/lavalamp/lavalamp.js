
(function( $, window ) {

	var
	namespace = "$ui.lavalamp",

	Lavalamp = function( target, settings ) {

		var
		current = target.find( settings.selector4current ),
		indicator = $( settings.indicator ).appendTo( target );

		function move( ele, animate ) {

			var position, properties;

			if ( ele.is( "[disabled]" ) ) { return; }

			position = ele.position(),
			properties = settings.properties( position, ele );

			(animate = animate === undefined ? true : animate)

				? indicator.stop( true, false ).animate( properties, settings.speed )
				: indicator.css( properties );
		}

		function hold( ele ) {
		    move( ele );
		    current = $( ele );
		}

		this.$node = target;
		this.settings = settings;

		if ( current.length === 0 ) {
			current = target.find( settings.selector4item ).eq( 0 );
		}

		current.length && move( current, false );

		target
		.delegate( settings.selector4item, "mouseover", function( e ) {

			move( $( this ) );
		} )
		.delegate( settings.selector4item, "mouseout", function( e ) {

			move( current );
		} )
		.delegate( settings.selector4item, "click", function( e ) {

			settings.holdByClick && hold( this );
		} );

		this.move = move;
		this.hold = hold;
	};

	$.fn.lavalamp = function( options ) {

		var
		instance = this.data( namespace );

		if ( !instance ) {

			instance = new Lavalamp( this, $.extend( {}, $.fn.lavalamp.defaults, options || {} ) );
			this.data( namespace, instance );
		}

		return instance;
	};

	$.fn.lavalamp.defaults = {

		selector4current 	: ".selected",
		selector4item 		: "li:not(.indicator)",
		indicator 		    : "<li class='indicator'/>",
		speed 			    : 222,
		holdByClick         : true,
		properties: function( position, ele ) {

			return {
				left 	    : position.left + "px",
				top 	    : (ele.innerHeight() + ele[0]["offsetTop"]) + "px",
				width 	    : ele.innerWidth() + "px",
				height 	    : 0
			};
		}
	};

})( window.jQuery, window );

