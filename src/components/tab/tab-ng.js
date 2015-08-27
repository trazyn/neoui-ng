
define( [ "util/ng-args", "ui/tab/tab" ], function( args ) {

"use strict";

/**
 * example:
 *
    <s-tab-set selected="selected" on-select="onSelect">
        <s-tab ng-repeat="tab in tabs" header="{{ tab.header }}" index="{{ tab.index }}" ng-disabled="tab.disabled" template-url="{{ tab.page }}">
            <div ng-bind-html="tab.content"></div>
        </s-tab>
    </s-tab-set>
 * */

angular.module( "$ui.tab", [] )
    .directive( "sTabSet", [ "$rootScope", "$parse", function( $rootScope, $parse ) {

        function controller( $scope, $element, $attrs ) {

            var
            options = args( $scope, $attrs, { "ripple": "boolean", "lavalamp": "boolean" } ),
            instance = $( $element ).tab( angular.extend( options, {

                ripple      : { duration: 1800 },

                onSelect    : function( tab, settings ) {

                    var self = this;

                    /** Change bound variable */
                    if ( !$rootScope.$$phase ) {

                        $scope.$apply( function( scope ) {
                            selectedAccessor.assign( $scope, self.attr( settings.rule ) );
                        } );
                        "function" === typeof $scope.onSelect && $scope.onSelect().apply( instance, arguments );
                    }
                }
            } ) ),

            selectedAccessor = $parse( $attrs.selected );

            $scope.$watch( selectedAccessor, function( value ) {
                instance.active( value );
            } );

            this[ "$tab" ] = instance;
        }

        return {
            scope: {
                ripple      : "@ripple",
                lavalamp    : "@lavalamp",
                selected    : "=selected",
                onSelect    : "&"
            },

            restric         : "EA",

            transclude      : true,
            replace         : true,
            template        : '<div class="ui tab" style="min-height: 300px;">' +
                                '<div class="nav"></div>' +
                                '<div class="content" ng-transclude></div>' +
                                '<div class="menu ui dropdown icon left"><i class="icon more"></i><div class="content"/></div>' +
                              '</div>',

            controller      : controller
        };
    } ] )
    .directive( "sTab", [ "$parse", function( $compile ) {

        function link( $scope, $element, $attrs, controller ) {

            var
            $tab = controller[ "$tab" ],
            item = {
                name        : $scope.header,
                index       : $scope.index,
                immediate   : true
            };

            /** Load content via ajax request */
            if ( $scope.templateUrl ) {
                $element.empty();
                item.page = $scope.templateUrl;
            } else {
                item.render = function() {
                    return $element[0][ "childNodes" ];
                };
            }

            $scope.$watch( "disabled", function( value ) {

                var
                index = $scope.index,
                isActive = $tab.isActive( index );

                if ( !!value ) {

                    isActive && $tab.disabled( index );
                } else {
                    isActive || $tab.enabled( index );
                }
                !!value ? $tab.disabled( index ) : $tab.enabled( index );
            } );

            $scope.$on( "$destroy", function() {
                $tab.remove( $scope.index );
            } );

            $tab.add( item );
        }

        return {

            scope: {

                index       : "@",
                header      : "@",
                templateUrl : "@templateUrl",
                disabled    : "=ngDisabled"
            },

            transclude      : true,
            template        : "<div style='display: none;' ng-transclude></div>",
            replace         : true,

            restric         : "EA",

            require         : "^sTabSet",
            link            : link
        };
    } ] );

} );
