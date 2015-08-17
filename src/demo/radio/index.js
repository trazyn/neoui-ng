
define( [], function() {

    "use strict";

    angular
    .module( "demo.radio", [] )
    .controller( "radioController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor();
        };
    } ] );
} );
