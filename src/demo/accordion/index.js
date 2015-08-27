
define( [ "ui/accordion/accordion-ng" ], function() {

    "use strict";

    angular
    .module( "demo.accordion", [ "$ui.accordion" ] )
    .controller( "accordionController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor( { offset: 270 } );
        };

        $scope.multiple = true;

        $scope.onExpand = function( index ) {
            console.log( "Expand: " + index );
        };

        $scope.onCollapse = function( index ) {
            console.log( "Collapse: " + index );
        };

        $scope.isOpen = true;
    } ] );
} );

