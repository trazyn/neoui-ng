
define( [ "ui/message/message" ], function( undefined ) {

    "use strict";

    angular.module( "$ui.message", [] )

    .factory( "$message", function() {

        return $.message;
    } );
} );
