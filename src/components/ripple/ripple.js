
(function( $ ) {

	var

	namespace = "$ui.ripple",

	Ripple = function( target, settings ) {

		var
		self = this,
		ripple = target.find( "span.ripple" );

		this.$node = target.css( "position", "relative" );
		this.settings = settings;

		if ( !ripple.length ) {
            var max = Math.max( target.innerHeight(), target.innerWidth() );
			ripple = $( "<span class='ripple'>" )
				.css( {
					width: max,
					height: max
				} )
				.appendTo( target );
		}

		if ( settings.autoBind ) {

		    target.on( "click", function( e ) {
                !self.$node.is( "[disabled]" ) && self.show( e );
		    } );
		}

		settings.duration = settings.duration + "ms";

		ripple.css( {

		    "-webkit-animation-duration": settings.duration,
		    "-moz-animation-duration": settings.duration,
		    "-ms-animation-duration": settings.duration,
		    "-o-animation-duration": settings.duration,
		    "animation-duration": settings.duration,
		} );
	};

	Ripple.prototype = {

		disabled: function() {
			this.$node.attr( "disabled", true );
			return this;
		},

		enabled: function() {
			this.$node.attr( "disabled", false );
			return this;
		},

		show: function( e ) {

			var
			self = this,

			settings = self.settings,
			offset = this.$node.offset(),
			X = e ? e.pageX : (offset.left + this.$node.outerWidth() / 2),
			Y = e ? e.pageY : (offset.top + this.$node.outerHeight() / 2),
			rect = this.$node[ 0 ].getBoundingClientRect(),
			ripple = this.$node.find( "span.ripple" ),
			doc = $( document ),
			position = {
				top: Y - rect.top - ripple[0].offsetHeight / 2 - doc.scrollTop(),
				left: X - rect.left - ripple[0].offsetWidth / 2 - doc.scrollLeft(),
			};

			settings.speed = settings.speed || settings.originalSpeed;
			settings.speed && self.disabled().$node.addClass( settings.class4progress );

			(function f( self, ripple, speed, position ) {

				self.timer = setTimeout( function() {

					ripple.removeClass( "show" )
						.css( {
							top: position.top,
							left: position.left,
							background: settings.color || ("#" + Math.floor( Math.random() * 0xFFF + 0 ).toString( 0xF ))
						} );

					setTimeout( function() {
                        ripple.addClass( "show" );
                        speed && f( self, ripple, speed, position );
					}, 100 );
				}, self.settings.speed );

				if ( self.settings.random ) {

					var height = ripple[ 0 ][ "offsetHeight" ], width = ripple[ 0 ][ "offsetWidth" ];

					position = {
						top: Y - rect.top - document.body.scrollTop - (Math.random() * (0 - height) + height),
						left: X - rect.left - document.body.scrollLeft - (Math.random() * (0 - width) + width)
					};
				}

			})( self, ripple, self.settings.speed, position );

			return this;
		},

		hide: function( status ) {

			var
			self = this,
			$node = this.$node,
			settings = this.settings,
			clazz;

            if ( settings.originalSpeed === void 0 ) {
                settings.originalSpeed = settings.speed;
            }
			settings.speed = 0;

			clearTimeout( self.timer );

			$node.removeClass( settings.class4progress );
			clazz = (status === true || undefined === status) ? settings.class4done : settings.class4fail;
			$node.addClass( clazz ) ;
			setTimeout( function() {
				self.enabled();
				$node.removeClass( clazz );
			}, settings.speed );

			return this;
		}
	};

	$.fn.ripple = function( options ) {

		var instance = this.data( namespace );

		if ( !instance ) {
			instance = new Ripple( this.addClass( "ui ripple" ), $.extend( {}, $.fn.ripple.defaults, options || {} ) );
			this.data( namespace, instance );
		}

		return instance;
	};

	$.fn.ripple.defaults = {

		speed 		    : 0,
		duration        : 400,

		random 		    : false,
		color           : false,
        autoBind        : true,

		class4progress 	: "ripple-progress",
		class4done 	    : "ripple-done",
		class4fail 	    : "ripple-fail"
	};

})( window.jQuery );
