
define( [ "util/ng-args", "ui/accordion/accordion" ], function( args ) {

"use strict";

/**
 * example:
 *
    <s-accordion>
        <s-accordion-pane
            index="1"
            head="Subpane 1">
                <s-accordion>
                    <s-accordion-pane index="1">
                        <s-accordion-head>
                            Inner Subpane 1
                        </s-accordion-head>
                        <s-accordion-content>
                            Quisque lorem tortor fringilla sed, vestibulum id, eleifend justo vel bibendum sapien massa ac turpis faucibus orci luctus non.
                        </s-accordion-content>
                    </s-accordion-pane>

                    <s-accordion-pane
                        index="2"
                        head="Inner Subpane 2"
                        content="Curabitur et ligula. Ut molestie a, ultricies porta urna. Quisque lorem tortor fringilla sed, vestibulum id.">
                    </s-accordion-pane>
                </s-accordion>
        </s-accordion-pane>

        <s-accordion-pane
            index="2"
            head="Subpane 2"
            content="Curabitur et ligula. Ut molestie a, ultricies porta urna. Quisque lorem tortor fringilla sed, vestibulum id.">
        </s-accordion-pane>
    </s-accordion>
 * */

angular.module( "$ui.accordion", [] )
    .directive( "sAccordion", [ "$rootScope", function( $rootScope ) {

        function controller( $scope, $element, $attrs ) {

            var
            accordion = $( $element ).accordion( {

                multiple        : $scope.multiple,
                onExpand        : ($scope.onExpand || $.noop)(),
                onCollapse      : ($scope.onCollapse || $.noop)()
            } );

            $scope.$watch( "multiple", function( value ) {

                accordion.settings.multiple = !!value;
                accordion.collapseAll();
            } );

            this[ "$accordion" ] = $scope.controller = accordion;
        }

        return {
            scope               : {
                multiple        : "=",
                controller      : "=",
                onExpand        : "&",
                onCollapse      : "&"
            },

            restric             : "EA",
            transclude          : true,
            replace             : true,
            template            : "<div class='ui accordion' ng-transclude></div>",
            controller          : [ "$scope", "$element", "$attrs", controller ]
        };
    } ] )

    .directive( "sAccordionPane", function() {

        function link( $scope, $element, $attrs, controller ) {

            var
            accordion = controller["$accordion"],
            head = $element.find( ">.head" ),
            content = $element.find( ">.content" );

            if ( $scope.head ) {
                head.length
                    ? head.html( $scope.head )
                    : $element.append( $( "<div class='head'>" + $scope.head + "</div>" ) )
                    ;
            }

            if ( $scope.content ) {

                if ( content.length ) {
                    content.html( $scope.content );
                } else {
                    $( "<div class='content'>" + $scope.content + "</div>" ).appendTo( $element );
                }
            } else {
                $element.append( $( "<div class='content'></div>" ).html( $element.find( ">:not(.head)" ) ) );
            }

            $element.attr( "index", $scope.index );

            if ( $scope.index && [ "true", "1" ].indexOf( $scope.isOpen ) > -1 ) {
                /** Reduce execution priority, after $digest */
                setTimeout( function() {
                    accordion.expand( $scope.index );
                } );
            }
        }

        return {
            scope               : {
                isOpen          : "@",
                index           : "@",
                head            : "@",
                content         : "@"
            },
            restric             : "EA",
            require             : "^sAccordion",
            transclude          : true,
            replace             : true,
            template            : "<div class='pane' ng-transclude></div>",
            link                : link
        };
    } )

    .directive( "sAccordionHead", function() {

        return {

            restric             : "EA",
            transclude          : true,
            replace             : true,
            template            : "<div class='head' ng-transclude></div>"
        };
    } )

    .directive( "sAccordionContent", function() {

        return {

            restric             : "EA",
            transclude          : true,
            replace             : true,
            template            : "<div class='content' ng-transclude></div>"
        };
    } );
} );
