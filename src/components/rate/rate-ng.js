
define( [ "ui/rate/rate" ], function() {

"use strict";

/**
 * example:
 *
    <s-rate
        ng-model="value"
        ng-disabled="false"
        on-click="onClick( value )">
    </s-rate>
 * */

angular.module( "$ui.rate", [] )
    .directive( "sRate", function() {

        function link( $scope, $element, $attrs ) {

            var rate = $( $element ).rate( {
                onClick     : function( value ) {
                    $scope.value = value;
                    $scope.$apply();

                    if ( "function" === typeof $scope.onClick ) {
                        $scope.onClick.apply( this, arguments );
                    }
                }
            } );

            $scope.$watch( "value", function( value ) {
                rate.val( value );
            } );

            $scope.$watch( "disabled", function( value ) {
                (value ? rate.disabled : rate.enabled)();
            } );
        }

        return {

            scope           : {
                value       : "=ngModel",
                disabled    : "=ngDisabled",
                onClick     : "&"
            },

            restric         : "E",

            replace         : true,
            template        : "<div class='ui rate'>" +
                                "<span> <i></i> </span> <span> <i></i> </span> <span> <i></i> </span> <span> <i></i> </span> <span> <i></i> </span>" +
                              "</div>",

            link            : link
        };
    } );
} );
