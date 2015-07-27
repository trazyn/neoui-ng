
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
            options = args( $scope, $attrs, { "collapsed": "boolean", "closeSameLevel": "boolean", "showFilterBar": "boolean" } ),
            tree,
            filterBar,
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
                        $rootScope.$$phase || $scope.$parent.$apply();
                        html = angular.element( "<p>" ).css( "padding-left", (level - 1) * 2 + "em" ).html( html );
                        html = angular.element( "<w>" ).html( html ).html();

                        return html;
                    };
                }
            }

            options.onSelect = function( node ) {

                if ( !$rootScope.$$phase ) {

                    $scope.ngModel = node.item;
                    ($scope.onSelect() || $.noop).apply( tree, arguments );
                    $scope.$apply();
                }
            };

            filterBar = $element.find( $.fn.tree.defaults.selector4filter );
            if ( options.showFilterBar ) {
                filterBar.attr( "placeholder", options.placeholder );
            } else {
                filterBar.parent().remove();
            }

            tree = $( $element ).tree( options );

            if ( typeof $scope.controller === "object" ) {
                angular.extend( $scope.controller, tree );
            } else {
                $scope.controller = tree;
            }

            $scope.$watch( "data", function( value ) {

                if ( !$rootScope.$$phase ) {
                    tree.render( value );
                    $scope.ngModel = void 0;
                    $scope.$apply();
                }
            } );

            $scope.$watch( "rootIds", function( value ) {

                if ( $rootScope.$$phase ) {
                    return;
                }

                tree.render( tree.settings.data );
                $scope.ngModel = void 0;
                $scope.$apply();
            } );

            $scope.$watch( "filterValue", function( text ) {

                tree.filter( text );
            } );
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
                showFilterBar   : "@",
                data            : "=",
                onSelect        : "&",
                controller      : "=",
                filterValue     : "=",
                ngModel         : "="
            },

            restric             : "E",

            transclude          : true,
            replace             : true,
            template            : '<div class="ui tree">' +
                                    '<div class="icon">' +
                                        '<input type="text" class="ui text" name="filter" placeholder="Type to search..." value="">' +
                                    '</div>' +
                                    '<div class="content"></div>' +
                                  '</div>',
            link                : link
        };
    } ] );
} );
