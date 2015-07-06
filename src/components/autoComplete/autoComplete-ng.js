
define( [ "ui/autoComplete/autoComplete" ], function() {

"use strict";

/**
 * example:
 *
 <s-autoComplete items="items" value-key="value" text-key="text">
     {{ $name }} - {{ $value }}
 </s-autoComplete>
 * */

angular.module( "$ui.autoComplete", [] )
    .directive( "sAutocomplete", [ "$rootScope", "$compile", function( $rootScope, $compile ) {

        function link( $scope, $element, $attrs, undefined, link ) {

            var
            options = {},
            transclude,
            markup,
            isolateBindings = $scope.$$isolateBindings;

            for ( var key in isolateBindings ) {

                var attr = isolateBindings[ key ];

                if ( attr.attrName in $attrs.$attr ) {
                    options[ key ] = $scope[ key ];
                }
            }

            transclude = link( $scope );
            markup = transclude.parent().html().trim();
            transclude.remove();

            if ( markup ) {
                options.formatter = function( item, index, query, settings ) {

                };
            }

            $( $element ).autoComplete( options );
        }

        return {
            scope: {
                lookup          : "=data",
                minChars        : "@",
                valueKey        : "@",
                textKey         : "@",
                breaksize       : "@",
                inputAnything   : "@",
                hightlight      : "@",
                showHint        : "@",
                fuzzy           : "@",
                localMatch      : "@",
                autoSelect      : "@",
                tabComplete     : "@",
                placeholder     : "@",
                value           : "=ngModel"
            },

            transclude          : true,
            replace             : true,
            template            : '<div class="ui autoComplete">' +
                                    '<input class="ui text front" type="text" />' +
                                    '<input class="ui text hint" type="text" tabindex="-1" />' +
                                    '<i class="icon"></i>' +
                                  '</div>',
            link                : link
        };
    } ] );
} );
