
define( [ "ui/sidenav/sidenav" ], function() {

"use strict";

/**
 * example:
 *
    <s-sidenav id="profile" controller="profile">
        <ul>
            <li class="avatar">
                <a href="//github.com/trayn" class="ui tooltip right" data-tooltip="View On GitHub">
                    <img src="/images/5271843.jpg" alt="fs3kuu">
                </a>
            </li>
            <li>News</li>
            <li>Feeds</li>
            <li>Messages</li>
            <li>Friends</li>
            <li>Photos</li>
            <li>Music</li>
            <li class="exit">
                <i class="icon exit"></i>
            </li>
        </ul>
    </s-sidenav>
 * */

angular.module( "$ui.sidenav", [] )
    .directive( "sSidenav", [ "$rootScope", "$compile", function( $rootScope, $compile ) {

        function link( $scope, $element, $attrs ) {

            var
            sidenav,
            render = function( deferred, loading, close ) {

                $compile( this.html( $element ) )( $scope );
                $scope.$apply();
                deferred.resolve();
            };

            if ( $scope.templateUrl ) {

                render = function( deferred, loading, close ) {

                    var self = this;

                    $.ajax( {
                        url: templateUrl,
                        dataType: "html"
                    } )
                    .done( function( data ) {
                        self.html( data );
                        $compile( self )( $scope );
                        $scope.$apply();
                    } )
                    .always( function() {
                        deferred.resolve();
                    } );
                };
            } else {
                /** Detach from the document root */
                $element.detach();
            }

            sidenav = $.sidenav( {
                render  : render,
                unload  : $scope.unload
            } );

            $scope.instance = sidenav;
            $rootScope.$$phase || $scope.$apply();
        }

        return {

            scope           : {
                instance    : "=controller",
                templateUrl : "@",
                unload      : "&"
            },

            restric         : "E",

            transclude      : true,
            replace         : true,
            template        : "<div class='ui sidenav' ng-transclude></div>",
            link            : link
        };
    } ] );
} );
