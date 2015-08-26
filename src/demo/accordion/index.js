
define( [ "ui/accordion/accordion" ], function() {

    "use strict";

    angular
    .module( "demo.accordion", [] )
    .controller( "accordionController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor( { offset: -30 } );
        };

        $( ".ui.accordion" ).each( function() {
            $( this ).accordion();
        } );
    } ] );
} );

