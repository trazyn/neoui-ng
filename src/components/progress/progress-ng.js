
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

            /** Some function on the prototype don't extend it */
            $scope.controller = progress = $( $element ).progress();

            if ( [ "true", "1" ].indexOf( $scope.autoStart ) > -1 ) {
                progress.start();
            }
        }

        return {

            scope           : {
                autoStart   : "@",
                controller  : "="
            },

            restric         : "E",

            replace         : true,
            template        : "<div class='md-progress'></div>",

            link            : link
        };
    } );
} );
