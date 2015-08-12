
define( [ "util/dateutil" ], function() {

    "use strict";

    angular
    .module( "demo.dateutil", [] )
    .controller( "dateutilController", [ "$scope", function( $scope ) {

        var
        now = new Date(),
        justAgo = new Date( now - 50 * 1000 ),
        minuteAgo = new Date( now  - 200 * 1000 ),
        hourAgo = new Date( now - 3600 * 1000 ),
        yesterday = new Date( $.dateutil( now ).yesterday() ),
        morethan = new Date( $.dateutil( now ).day( -31 ) );

        $scope.init = function() {
            $.anchor();
        };

        angular.extend( $scope, {

            now: now,
            now2: $.dateutil( now ).format( "%Y - %m - %d" ),
            now3: $.dateutil( now ).format( "%B %A, %Y" ),
            now4: $.dateutil( now ).format( "%x %X" ),

            justAgo: justAgo,
            justAgo2: $.dateutil( justAgo ).nice(),

            minuteAgo: minuteAgo,
            minuteAgo2: $.dateutil( minuteAgo ).nice(),

            hourAgo: hourAgo,
            hourAgo2: $.dateutil( hourAgo ).nice(),

            yesterday: yesterday,
            yesterday2: $.dateutil( yesterday ).nice(),

            morethan: morethan,
            morethan2: $.dateutil( morethan ).nice()
        } );
    } ] );
} );
