
define( [ "ui/rate/rate-ng" ], function() {

    "use strict";

    angular
    .module( "demo.rate", [ "$ui.rate" ] )
    .controller( "rateController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $( document.body ).anchor( { offset: 0 } );
        };

        $scope.star = 4.6;
        $scope.heart = 2.3;
    } ] );
} );
