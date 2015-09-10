
define( [ "ui/modal/modal-ng" ], function() {

	"use strict";

	angular
	.module( "demo.modal", [ "$ui.modal", "$ui.message" ] )
	.controller( "modalController", [ "$scope", "$modal", function( $scope, $modal ) {

        $scope.name = "test";

		$scope.open = function( animation ) {

			return $modal.open( {
				controller: "modalController",
				animation: animation,
				templateUrl: "src/demo/modal/page.html",
				title: "Instagram Handbook for Brands",
				class4modal: "demo",
				scope: $scope
			} );
		};

		$scope.showProgress = function() {

			$modal.open( {
				controller: "modalController",
				templateUrl: "src/demo/modal/page1.html",
				title: "弹出框标题 18PX 加粗 #333",
				class4modal: "demo",
				scope: $scope
			} )

			.progress.start();
		};

		$scope.dragMe = function() {

			$modal.open( {
				controller: "modalController",
				draggable: true,
				templateUrl: "src/demo/modal/page1.html",
				title: "弹出框标题 18PX 加粗 #333",
				class4modal: "demo",
				scope: $scope
			} );
		};

	    $scope.init = function() {
            $.anchor( { offset: -80 } );
	    };
	} ] );
} );

