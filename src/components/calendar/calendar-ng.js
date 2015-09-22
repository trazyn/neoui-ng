
define( [ "util/ng-args", "ui/calendar/calendar" ], function( args ) {

"use strict";

/**
 * example:
 *
    <s-calendar
        ng-disabled="isDisabled"
        ng-model="date"
        placeholder="Year-Month-Day"
        double="twoMonths"
        show-time="showTime"
        min-date="minDate"
        max-date="maxDate"
        on-select="onClick"
        default-date="defaultDate"
        ng-model="date">
    </s-calendar>
 * */

angular.module( "$ui.calendar", [] )
    .directive( "sCalendar", [ "$rootScope", function( $rootScope ) {

        function link( $scope, $element, $attrs ) {

            var
            options = args( $scope, $attrs ),
            calendar,
            settings;

            options.onClick = function( value ) {

                if ( $rootScope.$$pahse ) { return; }

                ($scope.onClick() || $.noop)( value );
                $scope.defaultDate = value;
                $scope.$apply();
            };

            $scope.$watch( "minDate", function( value ) {
                $rootScope.$$phase || (settings.minDate = value);
            } );

            $scope.$watch( "maxDate", function( value ) {
                !$rootScope.$$phase && (settings.maxDate = value);
            } );

            $scope.$watch( "double", function( value ) {
                settings.double = value;
            } );

            $scope.$watch( "defaultValue", function( value ) {

                if ( !$rootScope.$$phase ) {
                    settings.defaultDate = value;
                }
            } );

            $scope.$watch( "disabled", function( value ) {
                calendar[ value ? "disabled" : "enabled" ]();
            } );

            $element.find( $.fn.selector4input ).attr( "placeholder", $scope.placeholder );

            calendar = $( $element ).calendar( options ),
            settings = calendar.settings;
        }

        return {

            scope:  {

                disabled    : "=ngDisabled",
                showTime    : "=",
                placeholder : "@",
                format      : "@",
                defaultDate : "=ngModel",
                minDate     : "=",
                maxDate     : "=",
                onClick     : "&",
                double      : "="
            },

            restric         : "E",
            replace         : true,
            template        : '<div class="ui calendar">' +
                                '<input class="ui text" type="text" readonly="readonly" placeholder="Year - Month - Day" />' +
                                '<i class="icon calendar"></i>' +
                              '</div>',
            link            : link
        };
    } ] );
} );
