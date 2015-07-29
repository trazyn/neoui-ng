
define( [ "ui/progress/progress" ], function() {

"use strict";

/**
 * example:
 *
    <s-progress
        theme="ios"
        auto-start="true"
        controller="progress">
    </s-progress>
 * */

angular.module( "$ui.progress", [] )
    .directive( "sProgress", function() {

        function link( $scope, $element, $attrs ) {

            var progress;

            $element.addClass( $scope.theme );

            /** Some function on the prototype don't extend it */
            $scope.controller = progress = $( $element ).progress( { theme: $scope.theme } );

            if ( [ "true", "1" ].indexOf( $scope.autoStart ) > -1 ) {
                progress.start();
            }
        }

        return {

            scope           : {
                theme       : "@",
                autoStart   : "@",
                controller  : "="
            },

            restric         : "E",

            replace         : true,
            template        : "<div class='ui progress'></div>",

            link            : link
        };
    } );
} );
