
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
        "demo/modal/index",
        "demo/tab/index",
        "demo/message/index",
        "demo/autoComplete/index",
        "demo/validation/index" ], function() {

	"use strict";

	angular

	.module( "neoui", [ "ngRoute", "demo.modal", "demo.tab", "demo.message", "demo.autoComplete", "demo.validation" ] )

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
			.otherwise( {
				redirectTo: "/tab"
			} );
	} ] );

	angular.bootstrap( document, [ "neoui" ] );
} );
