
define( [ "ui/pagination/pagination" ], function() {

"use strict";

/**
 * example:
 *
    <s-pagination index="index" max="20"></s-pagination>
 * */

angular.module( "$ui.pagination", [] )
    .directive( "sPagination", [ "$rootScope", function( $rootScope ) {

        function link( $scope, $element, $attrs ) {

            var
            pagination = $( $element ).pagination( {
                index       : $scope.index,
                total       : $scope.total,
                onPageChange: function( index, settings ) {

                    if ( !$rootScope.$$pahse ) {
                        $scope.index = index;
                        $scope.$apply();

                        ($scope.onPageChange() || $.noop)( index, settings );
                    }
                }
            } );

            $scope.$watch( "index", function( value ) {
                pagination.val( value );
            } );

            $scope.$watch( "total", function( total ) {

                pagination.settings.total = total;
                pagination.val( pagination.val() );
            } );
        }

        return {

            scope           : {
                index       : "=",
                total       : "=",
                onPageChange: "&"
            },

            template        : "<div class='ui pagination'>" +
                                "<div class='content'></div>" +
                                "<span class='normal'>跳转至</span>" +
                                "<input type='text' maxleng='4'>" +
                                "<span name='go'>GO</span>" +
                              "</div>",
            replace         : true,
            restric         : "EA",
            link            : link
        };
    } ] );
} );
