
define( [], function() {

    "use strict";

    angular
    .module( "demo.tooltip", [] )
    .controller( "tooltipController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $( document.body ).anchor( { offset: 0 } );
        };
    } ] );
} );
