
define( [ "ui/modal/modal" ], function() {

    "use strict";

    function show( message, position ) {

        var modal = $.modal( {
            showHead        : false,
            showOverlay     : false,
            showProgress    : false,
            closeByDocument : false,
            fadeIn          : false,
            animate         : "scale",
            class4modal     : "ui toast " + position,

            render          : function( ready, loading, close ) {

                var template = "<p class='message'>" + message + "</p>" +
                                "<i class='icon close'></i>";

                this
                .html( template )
                .delegate( "i.icon.close", "click", close );
            }
        } );

        modal.$node.last().remove();
    }

    $.toast = {

        top: function( message ) {
            show( message, "top" );
        },

        bottom: function() {
            show( message, "bottom" );
        },

        left: function() {
            show( message, "left" );
        },

        right: function() {
            show( message, "right" );
        }
    };
} );
