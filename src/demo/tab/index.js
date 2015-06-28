
define( [ "ui/tab/tab-ng" ], function() {

    "use strict";

    angular
    .module( "demo.tab", [ "$ui.tab" ] )
    .controller( "tabController", function( $scope, $sce ) {

        $scope.selected = 2;

        $scope.tabs = [ {

            header: "One",
            index: 1,
            content: $sce.trustAsHtml( "<img src='/images/lorempixel-1.jpg' alt=''><blockquote>'Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem.' <br>— Aliquam Libero</blockquote><ol><li>Lorem ipsum dolor sit amet</li><li>Nullam dignissim convallis est</li><li>Praesent mattis</li></ol><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p>" )
        }, {
            header: "Two",
            index: 2,
            content: $sce.trustAsHtml( "<img src='/images/lorempixel-2.jpg' alt=''><blockquote>'Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem.' <br>— Aliquam Libero</blockquote><ol><li>Lorem ipsum dolor sit amet</li><li>Nullam dignissim convallis est</li><li>Praesent mattis</li></ol><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p>" )
        }, {
            header: "Three",
            index: 3,
            content: $sce.trustAsHtml( "<img src='/images/lorempixel.jpg' alt=''><blockquote>'Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem.' <br>— Aliquam Libero</blockquote><ol><li>Lorem ipsum dolor sit amet</li><li>Nullam dignissim convallis est</li><li>Praesent mattis</li></ol><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p>" )
        } ];

        $scope.addTab = function() {

            $scope.tabs.push( {
                name: +new Date(),
                index: +new Date(),
                content: $sce.trustAsHtml( "<img src='/images/lorempixel.jpg' alt=''><blockquote>'Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem.' <br>— Aliquam Libero</blockquote><ol><li>Lorem ipsum dolor sit amet</li><li>Nullam dignissim convallis est</li><li>Praesent mattis</li></ol><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p>" )
            } );
        };

        $scope.set = function() {

            $scope.selected = $scope.index;
        };
    } );
} );
