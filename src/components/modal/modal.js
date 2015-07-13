
define( [ "ui/loading/loading", "ui/progress/progress" ], function() {

	$.fn.modal = function( options ) {

		var
		modal = $( template ),

		close = function() {
			$( document ).off( "keyup", closeByESC ).off( "click", closeByDocument );

			options.unload();
			modal.removeClass( "show" );
			setTimeout( function() { modal.remove(); }, 300 );
		},

		closeByESC = function( e ) {
			27 === e.keyCode && close();
		},

		closeByDocument = function( e ) {
			$( e.target ).hasClass( "overlay" ) && close();
		},

		loading = modal.find( ".ui.loading:first" ).loading( {

			before: function() {
				this.css( "z-index", 10000 );
			},
			after: function() {
				this.css( "z-index", -999 );
			}
		} ),

		progress = modal.find( ".ui.progress:first" ).progress( {

			seed: 0.7,
			render: function( status, icon ) {
				this.css( {
					"-webkit-transform": "translate3d(-" + status + "%,0px,0px)",
					"transition": "all 200ms ease",
					"-webkit-transition": "all 200ms ease"
				} );
				icon.css( {
					"top": 54,
					"right": 14
				} );
			}
		} ),

		deferred = $.Deferred(),

		show = function() {

			var
			  head = modal.find( ".title" ),
			  body = modal.find( ".content" ),
			  overlay = modal.last();

			/** ~Head~ */
			options.showHead ? head.html( options.title ) : head.hide().next().hide();

			/** ~Body~ */
			if ( options.render instanceof Function ) {
				options.render.call( body, deferred, loading, close );
			} else {
				body.html( options.render );
				deferred.resolve();
			}

			modal.delegate( ".close", "click", close );

			/** Set animate */
			modal.addClass( options.animate );

			/** Show the overlay */
			overlay.addClass( options.showOverlay ? "show" : "blank" );

			/** Show progress */
			true === options.showProgress && progress.start();

			/** Content fade in */
			true === options.fadeIn && body.addClass( "fade out" );

			/** Do something for init */
			deferred
			.always( function() {

				true === options.fadeIn && setTimeout( function() { body.removeClass( "out" ); } );
				true === options.showProgress && setTimeout( function() { progress.done(); }, 300 );
			} );

			/** Close the modal */
			if ( options.closeByESC || options.closeByDocument ) {

				var trigger = $( document ).add( modal );

				true === options.closeByDocument
					&& modal.off( "click", closeByDocument ).on( "click", closeByDocument );

				if ( "boolean" === typeof options.closeByESC ) {
					trigger.off( "keyup", closeByESC ).on( "keyup", closeByESC );
				}
			}

			modal.first().css( options.css ).attr( options.attr );
			modal.appendTo( document.body );

			setTimeout( function() {
				modal.first().addClass( "show" );
			}, 100 );

			if ( options.selector4drag ) {

				modal.drag( function( ev, dd ) {

					$( this ).css( {
						top: dd.offsetY,
						left: dd.offsetX,
						"-webkit-transform": "none",
						"-moz-transform": "none",
						"-ms-transform": "none",
						"transform": "none",
					} );
				}, { handle: ".title" } );
			}
		};

		options = $.extend( {}, $.fn.modal.defaults, options || {} );

		if ( this === $ ) {
			options.target ? $( options.target ).on( "click", show ) : (options.autoShow && show());
		/** Use a dom as trigger */
		} else this.on( "click", show );

		return {
			open: show,
			close: close,
			$node: modal
		};
	};

	var
	noop = function() {},

	template = [ "<div class='ui modal animate'>",
				"<div style='height: 100%;'>",
					"<h3 class='title'></h3><div class='icon close transition rotate'></div>",
					"<div class='ui loading'></div>",
					"<div class='ui progress'></div>",
					"<div class='content'></div>",
				"</div>",

			"</div>",
			"<div class='ui overlay'></div>" ].join( "" );

	$.fn.modal.defaults = {

		title 		    : "Modal.JS",
		class4dialog    : "",

		css 		    : {},
		attr 		    : {},

		showHead 	    : true,
		showOverlay 	: true,
		showProgress 	: true,
		autoShow 	    : true,

		fadeIn 		    : true,

		closeByESC 	    : true,
		closeByDocument : true,

		selector4drag	: false,

		animate 	    : "slide",
		render 		    : "<p>This is a modal window. You can do the following things with it:</p><ul> <li><strong>Read:</strong> modal windows will probably tell you something important so don't forget to read what they say.</li> <li><strong>Look:</strong> a modal window enjoys a certain kind of attention; just look at it and appreciate its presence.</li> <li><strong>Close:</strong> click the outside close the modal.</li> </ul>",

		unload 		    : noop,
	};

	/** Export to $ */
	$.modal = $.fn.modal;
} );


