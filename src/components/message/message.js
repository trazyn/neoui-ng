
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
				onOk        : noop,
				onClose     : noop
			}, options || {} );

			show( {

				title       : settings.title || "Confirm",
				showTitle   : true,
				class4modal : "confirm",

				content: function( ready, loading, close ) {

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

