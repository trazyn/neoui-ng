
define( [ "ui/modal/modal" ], function() {

    "use strict";

    var instance;

    function show( options ) {

        return $.modal( $.extend( {}, $.extend( {}, $.slidenav.defaults, options ), {
            showHead    : false,
            animate     : options.class4nav,
            css         : { "height": "100%" }
        } ) );
    }

    $.slidenav = function( options ) {

        instance && instance.close();

        return {

            right   : function() {
                options.class4nav += " right";
                return (instance = show( options ));
            },

            left    : function() {
                options.class4nav += " left";
                return (instance = show( options ));
            },

            close   : function() {
                instance && instance.close();
            }
        };
    };

    $.slidenav.defaults = {

        /** Same to the modal component */
        render      : "",
        unload      : $.noop,
        class4nav   : ""
    };
} );
