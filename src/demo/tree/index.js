
define( [ "ui/tree/tree-ng" ], function() {

    "use strict";

    angular
    .module( "demo.tree", [ "$ui.tree" ] )
    .controller( "treeController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $( document.body ).anchor( { offset: 0 } );
        };
    } ] );
} );
