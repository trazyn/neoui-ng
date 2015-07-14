
define( [ "ui/modal/modal" ], function() {

	var show = function( options ) {

		var defaults = {

			showHead 	    : false,
			showOverlay 	: true,
			showProgress 	: false,
			fadeIn 		    : false
		};

		setTimeout( function() {

			$.modal( $.extend( true, {}, defaults, options ) );
		}, 250 );
	};

	$.message = {

		bubble: function( message, delay ) {

			var options = {

				width: 200,

				showOverlay: true,

				render: function( ready, loading, close ) {

					this.css( "padding", 0 )

					.html( "<div class='bubble'> <p>" + message + "</p> </div>" )

					.parent().css( { "background": "none", "overflow": "visible" } );

					loading.show( function() {

						var self = this
						.html( "<span class='love love1'></span><span class='love love2'></span><span class='love love3'></span><span class='love love4'></span><span class='love love5'></span>" )
						.css( {
							height: 0,
							top: -40,
						} );

						/** Hack the opacity */
						setTimeout( function() {
							self.css( "opacity", 1 );
						} );
					} );

					if ( delay = +delay, delay > 100 ) {
						setTimeout( close, delay );
					}
					ready.resolve();
				}
			};
			show( options );
		},

		message: function( type, message, delay ) {

			var options = {

				render: function( ready, loading, close ) {

					var template = [ "<div class='ui message ", type," tooltip top' data-tooltip='Close outside close the message'>",
								"<div class='flag'><i class='icon'></i></div>",
								"<div class='content'><p>", message, "</p></div>",
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

		error: function( message, delay ) {

			this.message( "error", message, delay );
		},

		info: function( message, delay ) {

			this.message( "info", message, delay );
		},

		warn: function( message, delay ) {

			this.message( "warn", message, delay );
		},

		success: function( message, delay ) {

			this.message( "success", message, delay );
		},

		confirm: function( options ) {

			var
			noop = function() {},
			settings = $.extend( {}, {
				onOk: noop,
				onClose: noop
			}, options || {} );

			show( {

				title: settings.title || "Confirm",
				showHead: true,
				showProgress: false,

				render: function( ready, loading, close ) {

					this
					.html( "<div style='margin-top: 10px'>" +
							settings.message +
						"</div>" +
						"<div class='action'>" +
							"<button class='ui transition button success' name='ok'>Ok</button>" +
							"<button class='ui transition button' name='close'>Cancel</button>" +
						"</div>" )
					.parents( ".modal:first" ).css( "max-width", 400 );

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

