
require.config( {

	baseUrl: "/src",

	paths: {
		ui: "/src/components",
		util: "/src/util",
		modules: "/src/modules"
	}
} );

require( [ "demo/modal/index", "demo/tab/index" ], function() {

	"use strict";

	angular

	.module( "neoui", [ "ngRoute", "demo.modal", "demo.tab" ] )

	.config( [ "$routeProvider", function( $routeProvider ) {

		$routeProvider
			.when( "/modal", {
				templateUrl: "/src/demo/modal/index.html"
			} )
		    .when( "/tab", {
		        templateUrl: "/src/demo/tab/index.html"
		    } )
			.otherwise( {
				redirectTo: "/tab"
			} );
	} ] );

	angular.bootstrap( document, [ "neoui" ] );
} );
