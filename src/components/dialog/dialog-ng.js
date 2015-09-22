
define( [ "ui/dialog/dialog" ], function() {

    "use strict";

    angular.module( "$ui.dialog", [] )

    .factory( "$dialog", function() {
        return $.dialog;
    } );
} );
