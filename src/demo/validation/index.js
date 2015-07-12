
define( [ "ui/validation/validation-ng" ], function() {

    "use strict";

    angular
    .module( "demo.validation", [ "$ui.validation" ] )
    .controller( "validationController", [ "$scope", function( $scope ) {

        $scope.push = function( info ) {
            console.log( info );
        };

        $scope.uniqueName = function( name ) {
            return name !== "abc";
        };

	    $scope.init = function() {
            $( document.body ).anchor( { offset: 310 } );
	    };
    } ] );
} );
