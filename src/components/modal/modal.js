
define( [ "ui/loading/loading", "ui/progress/progress" ], function() {

	$.fn.modal = function( options ) {

		var

        template = [ "<div class='ui modal animate'>",
                    "<div style='height: 100%;'>",
                        "<h3 class='title'></h3><div class='icon close transition rotate'></div>",
                        "<div class='ui loading'></div>",
                        "<div class='ui progress'></div>",
                        "<div class='content'></div>",
                    "</div>",

                "</div>",
                "<div class='ui overlay'></div>" ].join( "" ),

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

		loading = modal.find( ".ui.loading:first" ).loading(),
		progress = modal.find( ".ui.progress:first" ).progress(),

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
			modal.addClass( options.animate ).addClass( options.class4modal );

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

                var handle = options.selector4drag;

                head.css( "cursor", "move" );

				modal.drag( function( ev, dd ) {

					$( this ).css( {
                        "width": modal.width(),
                        "height": modal.height(),
						top: dd.offsetY,
						left: dd.offsetX,
						"-webkit-transform": "none",
						"-moz-transform": "none",
						"-ms-transform": "none",
						"transform": "none",
					} );
				}, { handle: handle === true ? ".title" : handle } );
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
			loading: loading,
			progress: progress,
			$node: modal
		};
	};

	$.fn.modal.defaults = {

		title 		    : "Modal.JS",
		class4modal     : "",

		css 		    : {},
		attr 		    : {},

		showHead 	    : true,
		showOverlay 	: true,
		showProgress 	: false,
		autoShow 	    : true,

		fadeIn 		    : true,

		closeByESC 	    : true,
		closeByDocument : true,

		selector4drag	: false,

		animate 	    : "slide",
		render 		    : "<p>This is a modal window. You can do the following things with it:</p><ul> <li><strong>Read:</strong> modal windows will probably tell you something important so don't forget to read what they say.</li> <li><strong>Look:</strong> a modal window enjoys a certain kind of attention; just look at it and appreciate its presence.</li> <li><strong>Close:</strong> click the outside close the modal.</li> </ul>",

		unload 		    : $.noop,
	};

	/** Export to $ */
	$.modal = $.fn.modal;
} );


