
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
    .directive( "sAutocomplete", [ "$rootScope", function( $rootScope ) {

        function controller( $scope, $element, $attrs ) {

            var
            options = {},

            isolateBindings = $scope.$$isolateBindings;

            for ( var key in isolateBindings ) {

                var attr = isolateBindings[ key ];

                if ( attr.attrName in $attrs.$attr ) {
                    options[ key ] = $scope[ key ];
                }
            }

            this[ "$autoComplete" ] = $( $element ).autoComplete( options );
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
                formatter       : "&",
            },

            replace     : true,
            template    : '<div class="ui autoComplete">' +
                            '<input class="ui text front" type="text" />' +
                            '<input class="ui text hint" type="text" tabindex="-1" />' +
                            '<i class="icon"></i>' +
                          '</div>',
            controller  : controller
        };
    } ] );
} );
