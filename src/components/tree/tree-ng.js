
define( [ "ui/tree/tree", "util/ng-args" ], function( args ) {

"use strict";

angular.module( "$ui.tree", [] )
    .directive( "sTree", [ "$rootScope", function( $rootScope ) {

        function link( $scope, $element, $attrs, undefined, link ) {

            var
            options = args( $scope.$isolateBindings, $attrs ),
            tree,
            transclude,
            isolateBindings = $scope.$isolateBindings;
        }

        return {
            scope               : {
                rootIds         : "=",
                parentKey       : "@",
                textKey         : "@",
                valueKey        : "@",
                collapsed       : "@",
                closeSameLevel  : "@",
                placeholder     : "@",
                dataProxy       : "&",
                render          : "&",
                data            : "=",
                filter          : "=",
                controller      : "="
            },

            restric             : "E",

            transclude          : true,
            replace             : true,
            template            : "",
            link                : link
        };
    } ] );
} );
