
define( [], function() {

    "use strict";

    angular
    .module( "demo.checkbox", [] )
    .controller( "checkboxController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor();
        };
    } ] );
} );
