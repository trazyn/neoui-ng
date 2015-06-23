
(function( $ ) {

	"use strict";
	
	var 

	namespace = "$ui.loading",

	Loading = function( target, settings ) {
	
		this.$node = target = $( target );
		this.settings = settings;

		target.parent().css( "position", "relative" );
	};

	Loading.prototype = {
	
		show: function( callback ) {
			
			var before = this.settings.before;

			before instanceof Function && before.call( this.$node );
			callback instanceof Function && callback.call( this.$node );

			this.$node.css( {
				
				"visibility": "visible",
				"opacity": 0.5,
				"-webkit-transition": "all .25s linear",
				"transition": "all .25s linear"
			} );

			return this;
		},

		hide: function( callback ) {
			
			var after = this.settings.after, node = this.$node;

			node.css( {
				
				"visibility": "hidden",
				"opacity": 0,
				"-webkit-transition": "all .25s linear",
				"transition": "all .25s linear"
			} );

			setTimeout( function() {
			
				typeof callback === "function" && callback.call( node );
				"function" === typeof after && after.call( node );
			}, 277 );

			return this;
		}
	};

	$.fn.loading = function( options ) {
		
		var instance = this.data( namespace );

		if ( !instance ) {
		
			instance = new Loading( this, options || {} );
			this.data( namespace, instance );
		}

		return instance;
	};

})( window.jQuery );

