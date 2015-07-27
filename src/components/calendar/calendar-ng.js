
define( [ "util/ng-args", "ui/calendar/calendar" ], function( args ) {

"use strict";

angular.module( "$ui.calendar", [] )
    .directive( "sCalendar", [ "$rootScope", function( $rootScope ) {

        function link( $scope, $element, $attrs ) {

            var
            options = args( $scope, $attrs ),
            calendar,
            settings;

            options.onSelect = function( value ) {

                if ( $rootScope.$$pahse ) { return; }

                ($scope.onSelect() || $.noop)( value );
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
                onSelect    : "&",
                double      : "="
            },

            restric         : "E",
            replace         : true,
            template        : '<div class="ui calendar">' +
                                '<input class="ui text" type="text" readonly="readonly" />' +
                                '<i class="icon calendar"></i>' +
                              '</div>',
            link            : link
        };
    } ] );
} );
