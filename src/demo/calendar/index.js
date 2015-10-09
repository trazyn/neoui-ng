
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

            date: $.dateutil( now ).tomorrow().format(),
            isDisabled: false,
            minDate: $.dateutil( now ).month(-1).format( "%m/%d, %Y" ),
            maxDate: $.dateutil( now ).month(1).format( "%m/%d, %Y" ),
            onSelected: function( value ) {
                console.log( value );
            }
        } );
    } ] );
} );
