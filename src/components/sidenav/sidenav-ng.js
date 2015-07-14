
define( [ "ui/sidenav/sidenav" ], function() {

"use strict";

angular.module( "$ui.sidenav", [] )
    .directive( "sSidenav", [ "$rootScope", function( $rootScope ) {

        function link( $scope, $element, $attrs ) {

            var slidenav;

            /** Detach from the document root */
            $element.detach();

            slidenav = $.slidenav( {
                render  : function( deferred, loading, close ) {

                    this.css( "padding", 0 ).html( $element );
                    deferred.resolve();
                },
                unload  : $scope.unload
            } );

            $scope.instance = slidenav;

            $rootScope.$$phase || $scope.$apply();
        }

        return {

            scope       : {
                instance: "=ngModel",
                unload  : "&"
            },

            restric     : "E",

            transclude  : true,
            replace     : true,
            template    : "<div class='ui sidenav' ng-transclude></div>",
            link        : link
        };
    } ] );
} );
