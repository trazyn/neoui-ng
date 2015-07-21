
define( [ "util/ng-args", "ui/tree/tree" ], function( args ) {

"use strict";

/**
 * example:
 *
 <s-autoComplete items="items" value-key="value" text-key="text">
     {{ $name }} - {{ $value }}
 </s-autoComplete>
 * */

angular.module( "$ui.tree", [] )
    .directive( "sTree", [ "$rootScope", function( $rootScope ) {

        function link( $scope, $element, $attrs, undefined, link ) {

            var
            options = args( $scope, $attrs, { "collapsed": "boolean", "closeSameLevel": "boolean" } ),
            tree,
            transclude;

            tree = $( $element ).tree( options );

            if ( typeof $scope.controller === "object" ) {
                angular.extend( $scope.controller, tree );
            } else if ( !$rootScope.$$phase ) {
                $scope.controller = tree;
                $scope.$apply();
            }
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
            template            : '<div class="ui tree">' +
                                    '<div class="icon">' +
                                        '<input type="text" class="ui text" name="filter" value="" placeholder="Type for search..">' +
                                    '</div>' +
                                    '<div class="content"></div>' +
                                  '</div>',
            link                : link
        };
    } ] );
} );
