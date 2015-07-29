
define( [ "ui/progress/progress-ng" ], function() {

    "use strict";

    angular
    .module( "demo.progress", [ "$ui.progress" ] )
    .controller( "progressContorller", [ "$scope", function( $scope ) {

        $scope.stop = function() {
            $scope.progress.done();
        };
    } ] );
} );

