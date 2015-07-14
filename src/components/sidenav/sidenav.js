
define( [ "ui/modal/modal" ], function() {

    "use strict";

    function show( options ) {

        return $.modal( $.extend( {}, $.extend( {}, $.slidenav.defaults, options ), {
            showHead    : false,
            animate     : options.class4nav,
            css         : { "height": "100%" }
        } ) );
    }

    $.slidenav = function( options ) {

        return {

            right   : function() {
                options.class4nav += " right";
                return show( options );
            },

            left    : function() {
                options.class4nav += " left";
                return show( options );
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
