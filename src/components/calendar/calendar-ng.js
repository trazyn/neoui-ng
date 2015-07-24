
define( [ "ui/calendar/calendar" ], function() {

"use strict";

angular.module( "$ui.calendar", [] )
    .directive( "sCalendar", [ "$rootScope", function( $rootScope ) {

        function link( $scope, $element, $attrs ) {

            var
            calendar = $( $element ).calendar();
        }

        return {

            scope:  {

                disabled    : "=ngDisabled",
                showTime    : "@",
                placeholder : "@",
                format      : "=",
                months      : "="
            },

            restric         : "E",
            replace         : true,
            template        : '<div class="ui calendar">' +
                                '<input class="ui text" type="text" placeholder="Year - Month - Day" readonly />' +
                                '<i class="icon calendar"></i>' +
                              '</div>',
            link            : link
        };
    } ] );
} );
