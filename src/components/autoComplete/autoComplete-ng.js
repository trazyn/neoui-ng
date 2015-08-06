
define( [ "util/ng-args", "ui/autoComplete/autoComplete" ], function( args ) {

"use strict";

/**
 * example:
 *
     <s-autocomplete
         ng-model="reps"
         ajax="ajax"
         highlight="true"
         value-key="full_name"
         text-key="name"
         local-match="'*'"
         show-hint="false"
         placeholder="Search GitHub Repository">
         <div class="rep">
             <p>
             {{ $text }} - <a href="{{ owner.html_url }}" title="Author by {{ owner.login }}">{{ owner.login }}</a>
             </p>
             <p>
             <code><i class="icon github3"></i><a href="{{ html_url }}" title="{{ full_name }}">{{ html_url }}</a></code>
             </p>
             <p>
             <code>{{ watchers.toLocaleString() }} Watchers</code>
             <code>{{ forks.toLocaleString() }} Forks</code>
             <code>{{ language }}</code>
             <code>Last update: {{ updated_at }}</code>
             <code class="issue"><i class="icon issue"></i>{{ open_issues_count }}</code>
             </p>
         </div>
     </s-autocomplete>
 * */

angular.module( "$ui.autoComplete", [] )
    .directive( "sAutocomplete", [ "$rootScope", "$compile", function( $rootScope, $compile ) {

        function link( $scope, $element, $attrs, undefined, link ) {

            var
            options = args( $scope, $attrs, { "showHint": "boolean" } ),
            autoComplete,
            transclude,
            markup,
            html,
            inProgress = false;

            transclude = link( $scope );
            markup = transclude.parent().html().trim();
            transclude.remove();

            if ( markup ) {
                options.formatter = function( item, index, highlightText, query, settings ) {

                    var
                    value = item[ settings.valueKey ],
                    text = item[ settings.textKey ] || value;

                    html = markup
                        .replace( /\{\{\s*\$value\s*\}\}/g, value )
                        .replace( /\{\{\s*\$index\s*\}\}/g, index )
                        .replace( /\{\{\s*\$text\s*\}\}/g, highlightText )
                        ;

                    html = $compile( html )( angular.extend( $scope.$parent.$new(), item ) );
                    $scope.$parent.$apply();
                    html = angular.element( "<w>" ).append( html ).html();

                    return html;
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

            $element.find( $.fn.autoComplete.defaults.selector4input ).attr( "placeholder", options.placeholder || "" );

            autoComplete = $( $element ).autoComplete( options );

            $scope.$watch( "value", function( value ) {
                !inProgress && autoComplete.val( value );
            } );

            $scope.$watch( "lookup", function( value ) {

                if ( value !== autoComplete.settings.lookup ) {
                    autoComplete.settings.lookup = value;
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
                showHint        : "@",
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
                                    '<input class="ui text front" type="text" placeholder="Type for search..." />' +
                                    '<input class="ui text hint" type="text" tabindex="-1" />' +
                                    '<i class="icon"></i>' +
                                  '</div>',
            link                : link
        };
    } ] );
} );
