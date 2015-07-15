
define( [ "ui/modal/modal" ], function() {

    "use strict";

    function show( message, position, class4toast, delay ) {

        var modal = $.modal( {
            showHead        : false,
            showOverlay     : false,
            showProgress    : false,
            closeByDocument : false,
            fadeIn          : false,
            animate         : "scale",
            class4modal     : "ui toast " + [ position, class4toast || "" ].join( " " ),

            render          : function( ready, loading, close ) {

                var template = "<p class='message'>" + message + "</p>" +
                                "<i class='icon close transition rotate'></i>";

                this
                .html( template )
                .delegate( "i.icon.close", "click", close );

                setTimeout( close, delay || 3000 );
            }
        } );

        modal.$node.last().remove();
    }

    $.toast = {

        top: function( message, delay, class4toast ) {

            return {

                left: function() {
                    show( message, "topleft", class4toast, delay );
                },

                right: function() {
                    show( message, "topright", class4toast, delay );
                }
            };
        },

        bottom: function( message, delay, class4toast ) {

            return {

                left: function() {
                    show( message, "bottomleft", class4toast, delay );
                },

                right: function() {
                    show( message, "bottomright", class4toast, delay );
                }
            };
        }
    };
} );
