
define( [ "ui/rate/rate" ], function() {

    "use strict";

    angular
    .module( "demo.rate", [] )
    .controller( "rateController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $( document.body ).anchor( { offset: 0 } );
        };

        $( ".ui.rate" ).each( function() {
            $( this ).rate();
        } );
    } ] );
} );
