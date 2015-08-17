
define( [ "ui/loading/loading" ], function() {

"use strict";

/**
 * example:
 *
    <s-loading class="global"></s-loading>
 * */

angular.module( "$ui.loading", [] )
    .directive( "sLoading", function() {

        function link( $scope, $element, $attrs ) {

            var loading;

            $scope.controller = loading = $( $element ).loading();

            if ( [ "1", "true" ].indexOf( $attrs.autoShow ) !== -1 ) {
                loading.show();
            }
        }

        return {

            scope           : {
                controller  : "=",
                autoShow    : "@"
            },

            template        : "<div class='ui loading'></div>",
            replace         : true,
            restric         : "E",
            link            : link
        };
    } );
} );
