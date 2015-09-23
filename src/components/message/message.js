
define( [ "ui/modal/modal" ], function() {

	var show = function( options ) {

		var defaults = {
            showTitle      : false,
            closeByDocument: true
		};

		setTimeout( function() {
			$.modal( $.extend( true, {}, defaults, options ) );
		}, 250 );
	};

	$.message = {

		message: function( type, message, delay ) {

			var options = {

                content: function( ready, loading, close ) {

					var template = [ "<div class='md-message ", type," md-tooltip md-tooltip-top' data-tooltip='Close outside close the message'>",
								"<div class='md-message-flag'><i class='md-icon'></i></div>",
								"<div class='md-message-content'><p>", message, "</p></div>",
							"</div>" ];
					this.parent().css( "overflow", "visible" );

					this
					.css( {
						"overflow": "visible",
						"display": "table",
						"padding": 0
					} ).html( template.join( "" ) ).parent().css( "background", "none" );

					if ( delay = +delay, delay > 100 ) {
						setTimeout( close, delay );
					}
					ready.resolve();
				}
			};

			show( options );
		},

		danger: function( message, delay ) {
			this.message( "md-message-danger", message, delay );
		},

		info: function( message, delay ) {
			this.message( "md-message-info", message, delay );
		},

		warning: function( message, delay ) {
			this.message( "md-message-warning", message, delay );
		},

		success: function( message, delay ) {
			this.message( "md-message-success", message, delay );
		},

		confirm: function( options ) {

			var
			noop = function() {},
			settings = $.extend( {}, {
				onOk            : noop,
				onClose         : noop
			}, options || {} );

			show( {

				showTitle       : false,
				class4modal     : "md-confirm",
                closeByDocument : false,

				content: function( ready, loading, close ) {

					this
					.html( "<div class='md-modal-content'>" +
					            "<div class='md-confirm-content'>" +
                                    "<h2>" + (settings.title || "Confirm") + "</h2>" +
                                    "<p>" + settings.message + "</p>" +
                                "</div>" +
                            "</div>" +
                            "<div class='md-modal-action text-right'>" +
                                "<button class='md-btn md-btn-flat md-btn-success text-uppercase' name='ok'>Ok</button>" +
                                "<button class='md-btn md-btn-flat md-btn-default text-uppercase' name='close'>Cancel</button>" +
                            "</div>" );

					this
					.delegate( "button[name=ok]", "click", function( e ) {

						var res = settings.onOk();

						if ( res === undefined || res ) {
							close();
						}
					} )
					.delegate( "button[name=close]", "click", function( e ) {
						settings.onClose();
						close();
					} );

					ready.resolve();
				}
			} );
		}
	};
} );

