
define( [ "ui/tree/tree-ng" ], function() {

    "use strict";

    angular
    .module( "demo.tree", [ "$ui.tree" ] )
    .controller( "treeController", [ "$scope", function( $scope ) {

        var deferred = $.Deferred();

        $scope.init = function() {
            $.anchor( { offset: -60 } );
        };

        $scope.test = function() {

            $.ajax( {
                url: "src/demo/tree/color.json",
                dataType: "text"
            } )
            .done( function( data ) {
                deferred.resolveWith( eval( "(" + data + ")" ) );
            } );

            return deferred.promise();
        };

        /** Custom */
        $scope.files = function() {

            return $.ajax( {
                url: "src/demo/tree/files.json"
            } );
        };

        $scope.addBranch = function( tree, parentId ) {

            var
            settings = tree.settings,
            item = {};

            item[ settings.parentKey ] = parentId;
            item[ settings.valueKey ] = +new Date();
            item[ settings.textKey ] = "New Branch";

            tree.add( item );
        };

        $scope.afterInit = function( tree ) {

            $.when( deferred ).done( function() {

                tree
                .expand( "multicolor" )
                .expand( "white" )
                .expand("green" )
                .disabled( "green" );
            } );
        };
    } ] );
} );

