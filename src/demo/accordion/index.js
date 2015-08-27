
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

        $scope.panes = [ {
            head: "Pane 1",
            content: "Pane - 1"
        }, {
            head: "Pane 2",
            content: "Pane - 2"
        } ];

        $scope.addPane = function() {

            var index = +new Date();

            $scope.panes.push( {
                head: "Pane " + index,
                content: "Pane - " + index
            } );
        };

        $scope.removePane = function() {
            $scope.panes.splice( -1 );
        };
    } ] );
} );

