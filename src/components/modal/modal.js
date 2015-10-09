
define( [ "ui/loading/loading", "ui/progress/progress" ], function() {

	$.fn.modal = function( options ) {

		var

        template = [ "<div class='md-modal'>",
                    "<div style='height: 100%;'>",
                        "<div class='md-modal-head'></div><div class='md-icon-clear md-modal-close'></div>",
                        "<div class='md-loading'></div>",
                        "<div class='md-progress'></div>",
                        "<div class='md-modal-body'></div>",
                    "</div>",

                "</div>",
                "<div class='md-modal-overlay'></div>" ].join( "" ),

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
			$( e.target ).hasClass( "md-modal-overlay" ) && close();
		},

		loading = modal.find( ".md-loading:first" ).loading(),
		progress = modal.find( ".md-progress:first" ).progress(),

		deferred = $.Deferred(),

		show = function() {

			var
			  head = modal.find( ".md-modal-head" ),
			  body = modal.find( ".md-modal-body" ),
			  overlay = modal.last();

			/** ~Head~ */
			options.showTitle ? head.html( options.title ) : head.hide().next().hide();

			/** ~Body~ */
			if ( options.render instanceof Function ) {
				options.render.call( body, deferred, loading, close );
			} else {
				body.html( options.render );
				deferred.resolve();
			}

			modal.first().addClass( [ "md-modal-animation-" + options.animation, options.class4modal || "" ].join( " " ) );

			/** Show the overlay */
			overlay.addClass( options.mask ? "show" : "blank" );

			/** Close the modal */
			if ( options.closeByESC || options.closeByDocument ) {

				var trigger = $( document ).add( modal );

				true === options.closeByDocument
					&& modal.off( "click", closeByDocument ).on( "click", closeByDocument );

				if ( "boolean" === typeof options.closeByESC ) {
					trigger.off( "keyup", closeByESC ).on( "keyup", closeByESC );
				}
			}

			modal.delegate( ".md-modal-close", "click", close );

			setTimeout( function() {
				modal.first().addClass( "show" );
			}, 100 );

			if ( options.draggable ) {

                var handle = options.draggable;

                head.css( "cursor", "move" );

				modal.drag( function( ev, dd ) {

					$( this ).css( {
						top: dd.offsetY,
						left: dd.offsetX,
                        "width": modal.width(),
                        "height": modal.height(),
						"-webkit-transform": "none",
						"-moz-transform": "none",
						"-ms-transform": "none",
						"transform": "none",
					} );
				}, { handle: handle === true ? ".md-modal-head" : handle } );
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

		title 		    : "Modal",
		showTitle 	    : true,
		mask        	: true,
		draggable       : true,

		class4modal     : "",

		closeByESC 	    : true,
		closeByDocument : false,

		animation 	    : "slide",
		render 		    : "",

		autoShow 	    : true,
		onClose 		: $.noop,
	};

	/** Export to $ */
	$.modal = $.fn.modal;
} );

