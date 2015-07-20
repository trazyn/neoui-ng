
define( [ "util/poll" ], function( poll ) {

	"use strict";

	var
	namespace = "$ui.progress",

	Progress = function( target, settings ) {

		var self = this;

		this.$node = target;
		this.settings = settings;

		if ( settings.template ) {
			this.$node.html( settings.template );
		}
	};

	Progress.prototype = {

		start: function() {

			var settings = this.settings;

			this.set( 0 );
			this.runner && poll.remove( this.runner );
			this.runner = runner.call( this, settings );

			/** Fadein */
			this.$node.find( settings.selector4bar + "," + settings.selector4icon ).css( {

				"opacity": 1,
				"visibility": "visible",
				"display": ""
			} );

			poll.start( this.runner );

			return this;
		},

		set: function( status ) {

			var
			settings = this.settings,

			node = this.$node;

			this.status = status;
			this.settings.render.call( node.find( settings.selector4bar ), (1 - status) * 100, node.find( settings.selector4icon ) );

			return this;
		},

		done: function() {

			var self = this, settings = this.settings;

			self.set( 1 );

			setTimeout( function() {

				self.$node.find( settings.selector4bar + "," + settings.selector4icon ).css( {

					"opacity": 0,
					"visibility": "hidden"
				} );

				setTimeout( function() {

					self.$node.find( settings.selector4icon ).css( "display", "none" );
					self.set( 0 );
				}, 200 );

			/** After '-webkit-transform' */
			}, 277 );

			poll.remove( self.runner );

			return this;
		}
	};

	function render( status, icon ) {

		this.css( {
			"-webkit-transform": "translate3d(-" + status + "%,0px,0px)",
			"-moz-transform": "translate3d(-" + status + "%,0px,0px)",
			"-ms-transform": "translate3d(-" + status + "%,0px,0px)",
			"-o-transform": "translate3d(-" + status + "%,0px,0px)",
			"transform": "translate3d(-" + status + "%,0px,0px)",
			"-webkit-transition": "all 200ms ease",
			"-moz-transition": "all 200ms ease",
			"-ms-transition": "all 200ms ease",
			"-o-transition": "all 200ms ease",
			"transition": "all 200ms ease",
		} );
	}

	function runner( settings ) {

		var self = this;

		return poll.add( {

			action: function( deferred ) {

				var status = +self.status || 0;

				status += Math.random() * settings.seed;
				status = status > settings.max ? settings.max : status;
				self.set( status );
				deferred.resolve();
			},

            delay: true,
            interval: settings.speed
		} );
	}

	$.fn.progress = function( options ) {

		var instance = this.data( namespace );

		if ( !instance ) {

			options = $.extend( {}, $.fn.progress.defaults, options || {} );
			"function" !== typeof options.render && (options.render = render);
			options.max = options.max > 1 ? 0.99123 : options.max;
			instance = new Progress( this, options );
			this.data( namespace, instance );
		}

		return instance;
	};

	$.fn.progress.defaults = {

		seed 		    : 0.05,
		speed 		    : 800,

		max 		    : 0.99123,

		template 	    : "<div class='bar'><div></div></div><div class='spinner'><div></div></div>",

		selector4bar 	: ".bar",
		selector4icon 	: ".spinner"
	};
} );

