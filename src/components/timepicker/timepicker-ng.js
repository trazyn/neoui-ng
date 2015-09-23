
define( [ "ui/timepicker/timepicker" ], function() {

"use strict";

/**
 * example:
 *
    <s-time-picker
        ng-model="value"
        ng-disabled="isDisabled">
    </s-time-picker>
 * */

angular.module( "$ui.timepicker", [] )
    .directive( "sTimepicker", [ "$rootScope", function( $rootScope ) {

        function link( $scope, $element, $attrs ) {

            var
            options = {
                strict      : [ 1, "true" ].indexOf( $scope.strict ) > -1,
                onApplied   : function( value ) {

                    if ( !$rootScope.$$phase ) {

                        $scope.value = timepicker.val();
                        $scope.$apply();

                        ($scope.onApplied() || $.noop).apply( this, arguments );
                    }
                }
            },

            timepicker = $( $element ).timepicker( options );

            if ( $scope.value ) {
                timepicker.val( $scope.value );
            }

            $scope.$watch( "value", function( value ) {
                timepicker.val( value );
            } );
        }

        return {
            scope           : {
                disabled    : "=ngDisabled",
                value       : "=ngModel",
                strict      : "@",
                onApplied   : "&"
            },

            restric         : "EA",
            transclude      : true,
            replace         : true,
            template        : "<div class='md-timepicker form-control'>" +
                                "<input class='md-timepicker-hour' type='text' maxlength='2' value='00'>" +
                                "<span>:</span>" +
                                "<input class='md-timepicker-mintue' type='text' maxlength='2' value='00'>" +
                              "</div>",

            link            : link
        };
    } ] );
} );
