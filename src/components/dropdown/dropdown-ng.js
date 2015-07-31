
define( [ "util/ng-args", "ui/dropdown/dropdown" ], function( args ) {

"use strict";

/**
 * example:
 *
 * */

angular.module( "$ui.dropdown", [] )
    .directive( "sDropdown", [ "$rootScope", function( $rootScope ) {

        function link( $scope, $element, $attrs ) {

            var
            options = args( $scope, $attrs, {
                "closeOnSelect" : "boolean",
                "autoWidth"     : "boolean"
            } ),

            dropdown;

            options.onSelect = function( item ) {

                if ( !$rootScope.$$phase ) {

                    $scope.value = item;
                    $scope.$apply();

                    ($scope.onSelect() || $.noop).apply( this, arguments );
                }
            };

            dropdown = $( $element ).dropdown( options );

            $scope.$watch( "value", function( value ) {

                if ( !$rootScope.$$phase ) {
                    dropdown.val( value );
                }
            } );

            $scope.$watch( "multiple", function( value ) {
                options.multiple = +value === 1;
            } );

            $scope.$watch( "required", function( value ) {
                options.required = [ "true", 1 ].indexOf( value ) > -1;
            } );

            dropdown.val( $scope.value );
        }

        return {
            scope               : {
                disabled        : "=ngDisabled",
                value           : "=ngModel",
                data            : "=",
                textKey         : "@",
                valueKey        : "@",
                autoWidth       : "@",
                closeOnSelect   : "@",
                onSelect        : "&",
                type            : "@",
                nothing         : "@",
                multiple        : "=",
                required        : "="
            },

            restric             : "E",
            replace             : true,
            template            : "<div class='ui dropdown'>" +
                                    "<i class='icon status'></i>" +
                                    "<p class='title'></p>" +
                                    "<div class='content'></div>" +
                                  "</div>",
            link                : link
        };
    } ] );

} );
