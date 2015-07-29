
define( [ "ui/progress/progress-ng" ], function() {

    "use strict";

    angular
    .module( "demo.progress", [ "$ui.progress" ] )
    .controller( "progressContorller", [ "$scope", function( $scope ) {

        $scope.start = function( progress ) {
            console.log( progress );
        };
    } ] );
} );
