
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

		show: function() {

            this.$node.addClass( "show" );
			return this;
		},

		hide: function( callback ) {

            this.$node.removeClass( "show" );
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

