
require.config( {

	baseUrl: "/src",

	paths: {
		ui: "/src/components",
		util: "/src/util",
		modules: "/src/modules"
	}
} );

require( [
        "ui/anchor/anchor",
        "ui/sidenav/sidenav-ng",
        "demo/modal/index",
        "demo/tab/index",
        "demo/message/index",
        "demo/autoComplete/index",
        "demo/validation/index" ], function() {

	"use strict";

	angular

	.module( "neoui", [ "ngRoute", "$ui.sidenav", "demo.modal", "demo.tab", "demo.message", "demo.autoComplete", "demo.validation" ] )

	.config( [ "$routeProvider", function( $routeProvider ) {

		$routeProvider
			.when( "/modal", {
				templateUrl: "/src/demo/modal/index.html"
			} )
		    .when( "/tab", {
		        templateUrl: "/src/demo/tab/index.html"
		    } )
		    .when( "/message", {
		        templateUrl: "/src/demo/message/index.html"
		    } )
		    .when( "/autoComplete", {
		        templateUrl: "/src/demo/autoComplete/index.html"
		    } )
		    .when( "/validation", {
		        templateUrl: "/src/demo/validation/index.html"
		    } )
		    .when( "/home", {
		        templateUrl: "/src/demo/home/index.html"
		    } )
			.otherwise( {
				redirectTo: "/home"
			} );
	} ] )

    .controller( "mainController", [ "$scope", "$location", function( $scope, $location ) {

        $scope.openMenu = function( menu ) {

            $scope.title = location.hash.split( "/" )[1];

            menu
            .left()
            .$node
            .delegate( "[data-url]", "click", function( e ) {
                $location.path( "/" + this.getAttribute( "data-url" ) );
                document.body.scrollTop = 0;
                menu.close();
                $scope.$apply();
            } );
        };

        $scope.menu;
    } ] );

	angular.bootstrap( document, [ "neoui" ] );
} );
