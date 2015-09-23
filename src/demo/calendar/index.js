
define( [ "ui/calendar/calendar-ng", "util/dateutil" ], function() {

    "use strict";

    angular
    .module( "demo.calendar", [ "$ui.calendar" ] )
    .controller( "calendarController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor( { offset: -60 } );
        };

        var now = new Date();

        angular.extend( $scope, {

            date: $.dateutil( now ).tomorrow(),
            isDisabled: false,
            minDate: $.dateutil( now ).lastWeek(),
            maxDate: $.dateutil( now ).nextWeek(),
            onSelected: function( value ) {
                console.log( value );
            }
        } );
    } ] );
} );
