
require.config( {
	
	baseUrl: "/src",

	paths: {
		ui: "/src/components",
		util: "/src/util",
		modules: "/src/modules"
	}
} );

require( [ "demo/modal/index" ], function() {

	"use strict";
	
	angular

	.module( "neoui", [ "ngRoute", 
			"modal.controllers" ] )

	.config( [ "$routeProvider", function( $routeProvider ) {
		
		$routeProvider
			.when( "/modal", {
				templateUrl: "/src/demo/modal/index.html"
			} )
			.otherwise( {
				redirectTo: "/modal"
			} );
	} ] );

	angular.bootstrap( document, [ "neoui" ] );
} );
