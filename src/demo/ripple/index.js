
define( [ "ui/ripple/ripple-ng" ], function() {

    "use strict";

    angular
    .module( "demo.ripple", [ "$ui.ripple" ] )
    .controller( "rippleController", [ "$scope", function( $scope ) {

        var colors = {
            grape: "#ED5565",
            bittersweet: "#FC6E51",
            sunflower: "#FFCE54",
            grass: "#A0D468",
            mint: "#48CFAD",
            auqa: "#4FC1E9",
            blueJeans: "#5D9CEC",
            lavender: "#AC92EC",
            pinkRose: "#EC87C0",
            lightGray: "#F5F7FA",
            mediumGray: "#CCD1D9",
            darkGray: "#656D78",
            success: "#0f9d58",
            error: "#f44336",
            info: "#039be5",
            warn: "#ff5722"
        };

        $scope.changeColor = function( name ) {

            var color = colors[ $scope.theme = name ];

            if ( $scope.color === color ) {
                $scope.color = $scope.theme = void color;
            } else
                $scope.color = color;
        };
    } ] );
} );
