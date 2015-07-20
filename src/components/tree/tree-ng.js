
define( [ "ui/tree/tree" ], function() {

"use strict";

angular.module( "$ui.tree", [] )
    .directive( "sTree", [ "$rootScope", function( $rootScope ) {

        function link( $scope, $element, $attrs ) {

        }

        return {
            scope               : {
                rootIds         : "=",
                parentId        : "@",
                textKey         : "@",
                valueKey        : "@",
                collapsed       : "@",
                closeSameLevel  : "@",
                duration        : "@",
                placeholder     : "@",
                data            : "=",
                filter          : "=",
                dataProxy       : "&",
                render          : "&"
            },

            restric         : "E",

            transclude      : true,
            replace         : true,
            template        : "",
            link            : link
        };
    } ] );
} );
