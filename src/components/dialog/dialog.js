
define( [ "ui/modal/modal" ], function() {

    $.dialog = function( options ) {

        var
        modal,
        deferred,
        settings,
        events = {},
        buttons = "",
        body = "";

        modal = $.modal( settings = $.extend( {
            css: {
                width: options.width || $.dialog.defaults.width,
                height: options.height || $.dialog.defaults.height
            }
        },
        $.dialog.defaults,
        options, {
            content: "<div class='dialog'>" +
                    "<div class='dialog-content'><div></div></div>" +
                    "<div class='dialog-action'></div>" +
                    "</div>"
        } ) );

        if ( "string" === typeof options.content ) {
            body = options.content;
        } else if ( "function" === typeof options.content ) {

            deferred = $.Deferred();
            options.content().done( function( data ) {
                body = data;
                deferred.resolve();
            } );
        }

        for ( var key in settings.buttons ) {

            var button = settings.buttons[ key ];
            buttons += "<button name='" + key + "'>" + button.label + "</button>";
            events[ key ] = button.onClick;
        }

        $.when( deferred ).done( function() {
            modal.$node.find( ".dialog-content > div" ).html( body );
        } );

        modal
        .$node
        .find( ".dialog-action" )
        .html( buttons )
        .delegate( "button", "click", function() {
            (events[ this.getAttribute( name ) ] || $.noop).apply( this, arguments );
        } );
    };

    $.dialog.defaults = {

        width: 600,
        height: 400,
        title: "Dialog",

        buttons: {
            "cancel": {
                label: "取消",
                onClick: function( modal ) {
                    modal.close();
                }
            },
            "ok": {
                label: "确定",
                onClick: $.noop
            }
        }
    };
} );
