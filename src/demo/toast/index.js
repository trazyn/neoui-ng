
define( [ "ui/toast/toast-ng" ], function() {

    "use strict";

    angular
    .module( "demo.toast", [ "$ui.toast" ] )
    .controller( "toastController", [ "$scope", "$toast", function( $scope, $toast ) {

        $scope.init = function() {
            $.anchor( { offset: 0 } );
        };

        $scope.theme = "default";

        $scope.changeTheme = function( theme ) {
            $scope.theme = theme;
        };

        angular.extend( $scope, {

            topLeft: function() {
                $toast.top( "On the top left!", $scope.theme ).left();
            },

            topRight: function() {
                $toast.top( "On the top left!", $scope.theme ).right();
            },

            bottomLeft: function() {
                $toast.bottom( "On the bottom left!", $scope.theme ).left();
            },

            bottomRight: function() {
                $toast.bottom( "On the bottom right!", $scope.theme ).right();
            }
        } );
    } ] );
} );
