
define( [ "ui/tree/tree-ng" ], function() {

    "use strict";

    angular
    .module( "demo.tree", [ "$ui.tree" ] )
    .controller( "treeController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $( document.body ).anchor( { offset: 0 } );
        };

        $scope.rootIds = [ "C000000000481935" ];
        $scope.data = function() {

            var deferred = $.Deferred();

            $.ajax( {
                url: "/src/demo/tree/tree.json",
                dataType: "json"
            } )

            .done( function( data ) {

                data = data.result.catalog;
                deferred.resolveWith( JSON.parse( data ) );
            } );

            return deferred.promise();
        };

        $scope.files = function() {

            var deferred = $.Deferred();

            $.ajax( {
                url: "/src/demo/tree/files.json",
            } )

            .done( function( data ) {
                deferred.resolveWith( data );
            } );

            return deferred;
        };
    } ] );
} );
