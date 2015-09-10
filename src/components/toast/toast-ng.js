
define( [ "ui/toast/toast" ], function( undefined ) {

    "use strict";

    angular.module( "$ui.toast", [] )

    .factory( "$toast", function() {
        return $.toast;
    } );
} );
