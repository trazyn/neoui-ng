
define( [], function() {

    "use strict";

    angular
    .module( "demo.button", [] )
    .controller( "buttonController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor( { offset: -30 } );
        };
    } ] );
} );
