
define( [ "ui/tree/tree-ng" ], function() {

    "use strict";

    angular
    .module( "demo.tree", [ "$ui.tree" ] )
    .controller( "treeController", [ "$scope", function( $scope ) {

        var deferred = $.Deferred();

        $scope.init = function() {
            $.anchor( { offset: -60 } );
        };

        /** Simple */
        angular.extend( $scope, {

            rootIds: [ "C000000000481935" ],
            data: function() {

                var deferred = $.Deferred();

                $.ajax( {
                    url: "src/demo/tree/tree.json",
                    dataType: "json"
                } )

                .done( function( data ) {

                    data = data.result.catalog;
                    deferred.resolveWith( JSON.parse( data ) );
                } );

                return deferred.promise();
            },

            onSelected: function( node ) {
                console.log( node );
            }
        } );

        $scope.test = function() {

            $.ajax( {
                url: "src/demo/tree/test.json",
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

        $scope.afterInit = function( szseTree ) {

            $.when( deferred ).done( function() {

                szseTree
                .expand( "szse" )
                .expand( "zhyjs" )
                .disabled("zhyjs" )
                .disabled( "szzqjysyyb" );
            } );
        };
    } ] );
} );
