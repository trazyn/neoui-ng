
define( [ "util/ng-args", "ui/ripple/ripple" ], function( args ) {

"use strict";

/**
 * example:
 *
    <div class="block example"
        s-ripple
        duration="800"
        speed="800"
        random="true"
        color="color"
        controller="ripple"
        auto-bind="false">
    </div>
 * */

angular.module( "$ui.ripple", [] )
    .directive( "sRipple", function() {

        function link( $scope, $element, $attrs ) {

            var
            options = args( $scope, $attrs, {
                random      : "boolean",
                autoBind    : "boolean"
            } ),
            ripple;

            $scope.controller = ripple = $( $element ).addClass( "ui ripple" ).ripple( options );

            $scope.$watch( "color", function( value ) {
                ripple.hide();
                ripple.settings.color = value;
            } );

            $scope.$watch( "disabled", function( value ) {
                (value ? ripple.disabled : ripple.enabled).call( ripple );
            } );
        }

        return {

            scope           : {
                controller  : "=",
                disabled    : "=ngDisabled",
                speed       : "@",
                duration    : "@",
                random      : "@",
                autoBind    : "@",
                color       : "="
            },

            restric         : "A",
            link            : link
        };
    } );
} );
