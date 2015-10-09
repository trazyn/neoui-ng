
define( [ "ui/modal/modal" ], function() {

    "use strict";

    var instance;

    function show( options ) {

        return $.modal( $.extend( {}, $.extend( {}, $.sidenav.defaults, options ), {
            showTitle       : false,
            animation       : options.class4nav,
            class4modal     : "md-modal-sidenav",
            closeByDocument : true
        } ) );
    }

    $.sidenav = function( options ) {

        instance && instance.close();

        return {

            right   : function() {
                options.animation = "right";
                return (instance = show( options ));
            },

            left    : function() {
                options.animation = "left";
                return (instance = show( options ));
            },

            close   : function() {
                instance && instance.close();
            }
        };
    };

    $.sidenav.defaults = {

        /** Same to the modal component */
        render      : "",
        class4nav   : " ",
        onClose     : $.noop
    };
} );

