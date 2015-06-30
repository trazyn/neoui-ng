
define( [ "ui/tab/tab-ng" ], function() {

    "use strict";

    angular
    .module( "demo.tab", [ "$ui.tab" ] )
    .controller( "tabController", function( $scope, $sce ) {

        var last;

        $scope.canAddTab = true;

        $scope.selected = "2";

        $scope.tabs = [ {

            header: "One",
            index: "1",
            disabled: true,
            content: $sce.trustAsHtml( "<img src='/images/lorempixel-1.jpg' alt=''><blockquote>'Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem.' <br>— Aliquam Libero</blockquote><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p>" )
        }, {
            header: "Two",
            index: "2",
            content: $sce.trustAsHtml( "<img src='/images/lorempixel-2.jpg' alt=''><blockquote>'Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem.' <br>— Aliquam Libero</blockquote><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p>" )
        }, {
            header: "Three",
            index: "3",
            content: $sce.trustAsHtml( "<img src='/images/lorempixel.jpg' alt=''><blockquote>'Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem.' <br>— Aliquam Libero</blockquote><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p>" )
        }, {
            header: "Ajax - 1",
            index: "4",
            page: "/src/demo/tab/tab4.html"
        }, {
            header: "Ajax - 2",
            index: "5",
            page: "/src/demo/tab/error.html"
        } ];

        last = $scope.tabs.length;

        $scope.addTab = function() {

            var index = ++last + "";

            if ( $scope.tabs.length < 8 ) {

                $scope.tabs.push( {
                    header: "Tab - " + last,
                    index: index,
                    content: $sce.trustAsHtml( "Tab: " + index ),
                } );
            }

            $scope.canAddTab = $scope.tabs.length < 8;
        };

        $scope.removeTab = function() {

            var
            tabs = $scope.tabs,
            index;

            for ( var i = tabs.length; --i >= 0; ) {

                var tab = tabs[ i ];

                if ( tab.index === $scope.selected ) {
                    index = i;
                    break;
                }
            }

            $scope.canAddTab = tabs.length < 8;

            tabs.splice( index, 1 );
        };

        $scope.toggleTabState = function() {

            var
            tabs = $scope.tabs,
            index;

            for ( var i = tabs.length; --i >= 0; ) {

                var tab = tabs[ i ];

                if ( tab.index === $scope.selected ) {
                    index = i;
                    break;
                }
            }

            tabs[ index ][ "disabled" ] = !tabs[ index ][ "disabled" ];
        };

        $scope.onSelected = function() {
            console.log( $scope.selected );
        };
    } );
} );
