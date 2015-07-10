
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
            autoComplete,
            transclude,
            markup,
            html,
            inProgress = false,
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
                options.formatter = function( value, text, item, index, highlightText, query, settings ) {

                    html = markup
                        .replace( /\{\{\s*\$value\s*\}\}/g, value )
                        .replace( /\{\{\s*\$index\s*\}\}/g, index )
                        .replace( /\{\{\s*\$text\s*\}\}/g, highlightText )
                        ;

                    html = $compile( html )( angular.extend( $scope.$parent.$new(), item ) );
                    $scope.$parent.$apply();
                    html = angular.element( "<w>" ).append( html ).html();

                    return "<li value='" + value + "' data-index='" + index + "'>" + html + "</li>";
                };
            }

            options.set = function( data, settings ) {

                if ( !$rootScope.$$phase ) {

                    inProgress = !inProgress;

                    $scope.value = data;
                    $scope.$apply();

                    inProgress = !inProgress;
                }
            };

            autoComplete = $( $element ).autoComplete( options );

            $scope.$watch( "value", function( value ) {
                !inProgress && autoComplete.val( value );
            } );

            $scope.$watch( "lookup", function( value ) {

                if ( value !== autoComplete.settings.lookup ) {

                    autoComplete.settings.lookup = value;
                    autoComplete.setupCache();
                }
            } );

            $scope.$watch( "disabled", function( value ) {

                var disabled = $scope.disabled;

                if ( disabled === "true" || disabled ) {
                    autoComplete.disabled();
                } else {
                    autoComplete.enabled();
                }
            } );

            $scope.$watch( "localMatch", function( value ) {

                var
                modes = [ "^", "$", "*" ],
                settings = autoComplete.settings;

                if ( modes.indexOf( value ) !== -1 && value !== settings.localMatch ) {

                    autoComplete.setupCache();
                    settings.localMatch = value;
                    autoComplete.val( autoComplete.val() );
                }
            } );

            $scope.$watch( "highlight", function( value ) {
                autoComplete.settings.highlight = value;
            } );

            $scope.$watch( "fuzzy", function( value ) {

                var
                settings = autoComplete.settings;

                if ( settings.fuzzy !== value ) {

                    settings.fuzzy = value;
                    autoComplete.setupCache();

                    /** Use current value rebuild the cache */
                    autoComplete.val( autoComplete.val() );
                }
            } );

            $scope.$watch( "tabComplete", function( value ) {
                autoComplete.settings.tabComplete = value;
            } );
        }

        return {
            scope: {
                lookup          : "=",
                ajax            : "=",
                minChars        : "@",
                valueKey        : "@",
                textKey         : "@",
                breaksize       : "@",
                placeholder     : "@",
                delimiter       : "@",
                inputAnything   : "@",
                showHint        : "=",
                fuzzy           : "=",
                tabComplete     : "=",
                highlight       : "=",
                localMatch      : "=",
                disabled        : "=ngDisabled",
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
