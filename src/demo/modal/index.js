
define( [ "ui/modal/modal-ng" ], function() {

	"use strict";

	angular
	.module( "demo.modal", [ "$ui.modal", "$ui.message" ] )
	.controller( "modalController", [ "$scope", "$modal", function( $scope, $modal ) {

        $scope.name = "test";

		$scope.open = function( animate ) {

			$modal.open( {
				controller: "modalController",
				animate: animate,
				templateUrl: "src/demo/modal/page.html",
				title: "Instagram Handbook for Brands",
				class4modal: "demo"
			} );
		};

	    $scope.init = function() {
            $.anchor( { offset: -80 } );
	    };
	} ] );
} );

