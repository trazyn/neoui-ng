
define( [ "ui/calendar/calendar-ng" ], function() {

    "use strict";

    angular
    .module( "demo.calendar", [ "$ui.calendar" ] )
    .controller( "calendarController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $( document.body ).anchor( { offset: 0 } );
        };
    } ] );
} );
