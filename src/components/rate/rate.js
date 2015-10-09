
define( function() {

    "use strict";

	var
	namespace = "$ui.rate",

	Rate = function( target, settings ) {

		var
		self = this,
		enabled = true,
		stars = target.find( settings.selector4star );

        target
		/** Highlight */
		.on( "mouseover", function( e ) {

            var
            star = e.target;

			if ( !enabled ) { return; }

            stars
            .removeClass( settings.class4selected )
            .find( "i[style]" )
            .removeAttr( "style" );

            star = $( star );
            star.prevAll().add( star ).addClass( settings.class4highlight );
            star.nextAll().removeClass( settings.class4highlight );
		} )

		.on( "mouseleave", function( e ) {
            setTimeout( function() {
                if ( !target.is( ":hover" ) ) {
                    stars.removeClass( settings.class4highlight );
                    self.val( self.val() );
                }
            } );
		} )

		/** Selected */
		.delegate( settings.selector4star, "click", function( e ) {

            var
            star = e.target,
            value;

			if ( enabled ) {

                value = stars.index( star ) + 1;
                settings.onSelect.call( star, value );

                /** Hack the firefox event bubbles */
                self.disabled().val( value );
                setTimeout( self.enabled, 50 );
			}
		} );

		this.disabled = function() {
			enabled = 0;
			return this;
		};

		this.enabled = function() {
			enabled = true;
			return this;
		};

		this.$node = target;
		this.settings = settings;

		if ( settings.defaultValue ) {
		    self.val( settings.defaultValue );
		}
	};

	Rate.prototype = {

		val: function( value ) {

            var
            settings = this.settings;

			if ( value ) {

                var
                index = 0,
                stars = this.$node.find( settings.selector4star );

				this
				.$node
				.attr( "data-value", value = +parseFloat( value ).toFixed( 1 ) );

				index = Math.floor( value );

                /** Reset recent state */
				stars
                .removeClass( settings.class4selected )
                .find( "> i[style]" ).removeAttr( "style" );

				$( stars.splice( 0, index ) ).addClass( settings.class4selected );

				if ( index < 5 ) {
				    stars
				    .first()
				    .removeClass( settings.class4highlight )
				    .addClass( settings.class4selected )
				    .find( "> i" )
				    .css( {
				        width: ((value - index) * 100) + "%"
				    } );
				}

				return this;
			} else
				return +(this.$node.attr( "data-value" )) || 0;
		}
	};

	$.fn.rate = function( options ) {

		var instance = this.data( namespace );

		if ( !instance ) {
			this.data( namespace, instance = new Rate( this, $.extend( {}, $.fn.rate.defaults, options ) ) );
		}

		return instance;
	};

	$.fn.rate.defaults = {
	    onSelect        : $.noop,
	    selector4star   : "> span",
	    class4highlight : "md-rate-highlight",
	    class4selected  : "md-rate-selected",
	    defaultValue    : 0
	};
} );

