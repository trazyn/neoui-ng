
define( [ "ui/rate/rate-ng" ], function() {

    "use strict";

    angular
    .module( "demo.rate", [ "$ui.rate" ] )
    .controller( "rateController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor( { offset: -60 } );
        };

        $scope.heart = 2.3;
    } ] );
} );
