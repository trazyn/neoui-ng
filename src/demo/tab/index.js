
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
        } ];

        last = $scope.tabs.length;

        $scope.addTab = function() {

            var index = +new Date();

            if ( $scope.tabs.length < 6 ) {

                $scope.tabs.push( {
                    header: +new Date(),
                    index: ++last + "",
                    content: $sce.trustAsHtml( "Tab: " + index ),
                } );
            }

            $scope.canAddTab = $scope.tabs.length < 6;
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

            $scope.canAddTab = tabs.length < 6;

            tabs.splice( index, 1 );
            $scope.selected = tabs[ tabs.length - 1 ][ "index" ];
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
    } );
} );
