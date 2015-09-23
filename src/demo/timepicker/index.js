

define( [ "ui/timepicker/timepicker-ng" ], function() {

    "use strict";

    angular
    .module( "demo.timepicker", [ "$ui.timepicker" ] )
    .controller( "timePickerController", [ "$scope", function( $scope ) {

        $scope.time = "11:11";
    } ] );
} );
