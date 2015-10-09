
define( [ "ui/modal/modal" ], function() {

    "use strict";

    var modal;

    function show( message, position, delay, class4toast ) {

        if ( void 0 === class4toast && typeof delay === "string"  ) {
            class4toast = delay;
            delay = false;
        }

        modal && modal.close();

        modal = $.modal( {
            showTitle       : false,
            mask            : false,
            animation       : "scale",
            css             : { "min-width": "" },
            class4modal     : "md-toast " + [ position, class4toast || "" ].join( " " ),

            render          : function( ready, loading, close ) {

                var template = "<p class='md-toast-message'>" + message + "</p>" +
                                "<p class='md-toast-close text-uppercase'>undo</p>";

                this
                .html( template )
                .parent()
                .css( "height", "" )
                .delegate( ".md-toast-close", "click", close );

                setTimeout( close, delay || 3000 );
            }
        } );

        modal.$node.last().remove();
    }

    $.toast = {

        top: function( message, delay, class4toast ) {

            return {

                left: function() {
                    show( message, "md-toast-topleft", delay, class4toast );
                },

                right: function() {
                    show( message, "md-toast-topright", delay, class4toast );
                }
            };
        },

        bottom: function( message, delay, class4toast ) {

            return {

                left: function() {
                    show( message, "md-toast-bottomleft", delay, class4toast );
                },

                right: function() {
                    show( message, "md-toast-bottomright", delay, class4toast );
                }
            };
        }
    };
} );
