
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
    .directive( "sTree", [ "$rootScope", "$compile", function( $rootScope, $compile ) {

        function link( $scope, $element, $attrs, undefined, link ) {

            var
            options = args( $scope, $attrs, { "collapsed": "boolean", "closeSameLevel": "boolean" } ),
            tree,
            transclude,
            markup,
            html;

            transclude = link( $scope );
            if ( transclude.length ) {

                markup = transclude.parent().html().trim();
                transclude.remove();

                if ( markup ) {
                    options.formatter = function( item, level, settings ) {

                        var
                        value = item[ settings.valueKey ],
                        text = item[ settings.textKey ];

                        html = $compile( markup )( angular.extend( $scope.$parent.$new(), item ) );
                        $scope.$parent.$apply();
                        html = angular.element( "<p>" ).css( "padding-left", (level - 1) * 2 + "em" ).html( html );
                        html = angular.element( "<w>" ).html( html ).html();

                        return html;
                    };
                }
            }

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
                                        '<input type="text" class="ui text" name="filter" value="">' +
                                    '</div>' +
                                    '<div class="content"></div>' +
                                  '</div>',
            link                : link
        };
    } ] );
} );
