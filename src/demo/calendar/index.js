
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

            date: $.dateutil( now ).tomorrow().val(),
            isDisabled: false,
            minDate: $.dateutil( now ).lastWeek().val(),
            maxDate: $.dateutil( now ).nextWeek().val(),
            onSelected: function( value ) {
                console.log( value );
            }
        } );
    } ] );
} );
