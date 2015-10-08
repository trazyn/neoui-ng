
define( [ "util/ng-args", "ui/dropdown/dropdown" ], function( args ) {

"use strict";

/**
 * example:
 *
    <s-dropdown
        data="ajax"
        ng-disabled="isDisabled"
        ng-model="reps"
        required="required"
        auto-width="true"
        text-key="full_name"
        value-key="false"
        multiple="multiple"
        close-on-select="false"
        nothing="Multiple and less one item">
        <p>
            {{ name }} - <a href="{{ owner.html_url }}" title="Author by {{ owner.login }}">{{ owner.login }}</a>
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
    </s-dropdown>
 * */

angular.module( "$ui.dropdown", [] )
    .directive( "sDropdown", [ "$rootScope", "$compile", function( $rootScope, $compile ) {

        function link( $scope, $element, $attrs, undefined, link ) {

            var
            options = args( $scope, $attrs, {
                "closeOnSelect" : "boolean",
                "autoWidth"     : "boolean"
            } ),
            dropdown,
            transclude,
            markup,
            html;

            options.onSelect = function( item, settings ) {

                if ( !$rootScope.$$phase ) {

                    $scope.value = dropdown.val();
                    $scope.$apply();

                    ($scope.onSelect() || $.noop).apply( this, arguments );
                }
            };

            options.valueKey = options.valueKey === "false" ? false : options.valueKey;
            transclude = link( $scope );

            if ( transclude.length ) {

                markup = transclude.parent().html().trim();
                transclude.remove();

                if ( markup ) {
                    options.formatter = function( item, settings ) {

                        markup;

                        html = $compile( markup )( angular.extend( $scope.$parent.$new(), item ) );
                        $scope.$parent.$apply();
                        html = angular.element( "<w>" ).append( html ).html();

                        return html;
                    };
                }
            }

            dropdown = $( $element ).dropdown( options );

            /** Get the reference */
            options = dropdown.settings;

            $scope.$watch( "value", function( value ) {
                dropdown.val( value );
            } );

            $scope.$watch( "data", function( data ) {
                dropdown.render( data );
            } );

            $scope.$watch( "multiple", function( value ) {
                options.multiple = +value === 1;
            } );

            $scope.$watch( "required", function( value ) {
                options.required = !!value;
            } );

            $scope.$watch( "disabled", function( value ) {
                value ? dropdown.disabled() : dropdown.enabled();
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
                onSelect        : "&",
                type            : "@",
                nothing         : "@",
                closeOnSelect   : "@",
                multiple        : "=",
                required        : "="
            },

            restric             : "E",
            transclude          : true,
            replace             : true,
            template            : "<div class='md-dropdown'>" +
                                    "<i class='md-icon md-dropdown-status'></i>" +
                                    "<p class='md-dropdown-title'></p>" +
                                    "<div class='md-dropdown-content'></div>" +
                                  "</div>",
            link                : link
        };
    } ] );
} );
