
define( [ "ui/modal/modal" ], function() {

    "use strict";

    var instance;

    function show( options ) {

        return $.modal( $.extend( {}, $.extend( {}, $.sidenav.defaults, options ), {
            showHead    : false,
            animate     : options.class4nav,
            class4modal : "sidenav",
            css         : { "height": "100%" }
        } ) );
    }

    $.sidenav = function( options ) {

        instance && instance.close();

        return {

            right   : function() {
                options.animate = "right";
                return (instance = show( options ));
            },

            left    : function() {
                options.animate = "left";
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
        unload      : $.noop,
        class4nav   : " "
    };
} );

