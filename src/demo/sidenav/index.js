
define( [ "ui/sidenav/sidenav-ng" ], function() {

    "use strict";

    angular
    .module( "demo.sidenav", [ "$ui.sidenav" ] )
    .controller( "sidenavController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $( document.body ).anchor( { offset: -60 } );
        };

        $scope.showProfile = function( sidenav ) {

            sidenav
            .left()
            .$node
            .delegate( ".exit", "click", function() {
                sidenav.close();
            } );
        };
    } ] );
} );
