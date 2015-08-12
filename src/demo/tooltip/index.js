
define( [], function() {

    "use strict";

    angular
    .module( "demo.tooltip", [] )
    .controller( "tooltipController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor( { offset: 0 } );
        };
    } ] );
} );
