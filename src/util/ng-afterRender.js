
define( [], function() {

    "use strict";

    angular
    .module( "afterRender", [] )

    .directive( "afterRender", [ "$timeout", function( $timeout ) {

        return {
            restric: "A",
            terminal: true,
            link: function( $scope, $element, $attrs ) {
                $timeout( function() {
                    $scope.$eval( $attrs.afterRender );
                }, 0 );
            }
        };
    } ] );
} );
