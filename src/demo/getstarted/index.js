
define( [], function() {

    "use strict";

    angular
    .module( "demo.getstarted", [] )
    .controller( "getstartedController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $( document.body ).anchor( { offset: 20 } );
        };
    } ] );
} );
