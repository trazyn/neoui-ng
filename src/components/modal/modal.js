
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

			options.onClose();
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
			options.showTitle ? head.html( options.title ) : head.hide().next().hide();

			/** ~Body~ */
			if ( options.content instanceof Function ) {
				options.content.call( body, deferred, loading, close );
			} else {
				body.html( options.content );
				deferred.resolve();
			}

			modal.addClass( [ options.animation, options.class4modal || "" ].join( " " ) );

			/** Show the overlay */
			overlay.addClass( options.modal ? "show" : "blank" );

			/** Close the modal */
			if ( options.closeByESC || options.closeByDocument ) {

				var trigger = $( document ).add( modal );

				true === options.closeByDocument
					&& modal.off( "click", closeByDocument ).on( "click", closeByDocument );

				if ( "boolean" === typeof options.closeByESC ) {
					trigger.off( "keyup", closeByESC ).on( "keyup", closeByESC );
				}
			}

			modal.delegate( ".close", "click", close );
			modal.first().css( options.css ).attr( options.attr );

			setTimeout( function() {
				modal.first().addClass( "show" );
			}, 100 );

			if ( options.draggable ) {

                var handle = options.draggable;

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

			modal.appendTo( document.body );
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
		showTitle 	    : true,
		modal        	: true,
		draggable       : true,

		css 		    : { "min-width": 480 },
		attr 		    : {},
		class4modal     : "",

		closeByESC 	    : true,
		closeByDocument : false,

		animation 	    : "slide",
		content 		: "<p>This is a modal window. You can do the following things with it:</p><ul> <li><strong>Read:</strong> modal windows will probably tell you something important so don't forget to read what they say.</li> <li><strong>Look:</strong> a modal window enjoys a certain kind of attention; just look at it and appreciate its presence.</li> <li><strong>Close:</strong> click the outside close the modal.</li> </ul>",

		autoShow 	    : true,
		onClose 		: $.noop,
	};

	/** Export to $ */
	$.modal = $.fn.modal;
} );

