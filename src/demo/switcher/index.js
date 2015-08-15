
define( [], function() {

    "use strict";

    angular
    .module( "demo.switcher", [] )
    .controller( "switcherController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor();
        };
    } ] );
} );
