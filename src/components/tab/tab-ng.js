
define( [ "ui/tab/tab" ], function() {

"use strict";

/**
 * example:
 *
  <ng-tab-set tab-selected="2">
      <ng-tab ng-repeat="tab in tabs" tab-index="tab.index" tab-header="{{ tab.title }}" tab-templateUrl="./tab1.html">
          {{ tab.content }}
      </ng-tab>
  </ng-tab-set>
 * */

angular.module( "$ui.tab", [] )
    .directive( "ngTabSet", [ "$rootScope", "$parse", function( $rootScope, $parse ) {

        function compile( $element, $attrs ) {

            var
            markup = $element.html(),
            style = $element.attr( "style" ),
            node = $(
                    '<div class="ui tab" style="min-height: 300px;">' +
                        '<div class="nav"></div>' +
                        '<div class="content"></div>' +
                    '</div>'
                    ).replaceAll( $element );

            node
            .attr( "style", style )
            .append( markup );
        }

        function controller( $scope, $element, $attrs ) {

            var
            instance = $( $element ).tab( {
                ripple      : !($scope.noRipple === "true"),
                lavalamp    : !($scope.noLavalamp === "true"),
                vertical    : $scope.vertial === "true",
                selected    : $scope.selected || 0,
                onSelect    : function( tab, settings ) {

                    var self = this;

                    /** Change bound variable */
                    if ( !$rootScope.$$phase ) {

                        $scope.$apply( function( scope ) {
                            selectedAccessor.assign( $scope, self.attr( settings.rule ) );
                        } );
                        "function" === typeof $scope.onSelected && $scope.onSelected()();
                    }
                }
            } ),

            selectedAccessor = $parse( $attrs.tabSelected );

            $scope.$watch( selectedAccessor, function( value ) {
                instance.active( value );
            } );

            this[ "$tab" ] = instance;
        }

        return {
            scope: {
                noRipple    : "@tabNoRipple",
                noLavalamp  : "@tabNoLavalamp",
                vertical    : "@tabVertical",
                selected    : "=tabSelected",
                onSelected  : "&tabOnSelected"
            },

            restrict        : "E",

            controller      : controller,
            compile         : compile
        };
    } ] )
    .directive( "ngTab", [ "$parse", function( $compile ) {

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

                index       : "@tabIndex",
                header      : "@tabHeader",
                templateUrl : "@tabTemplateUrl",
                disabled    : "=ngDisabled"
            },

            restric         : "E",
            template        : "",
            replace         : true,

            require         : "^ngTabSet",
            link            : link
        };
    } ] );

} );
