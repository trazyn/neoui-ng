
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
				title: "Mango (Fruit)",
				class4modal: "demo",
				scope: $scope
			} );
		};

		$scope.showProgress = function() {

			var modal = $modal.open( {
				controller: "modalController",
				templateUrl: "src/demo/modal/page1.html",
				title: "弹出框标题 18PX 加粗 #333",
				class4modal: "demo",
				closeByDocument: true,
				scope: $scope
			} );

			modal
			.$promise
			.done( function() {
				modal.$node.find( ".md-progress" ).progress().start();
			} );

			return modal;
		};

		$scope.showLoading = function() {

			var modal = $modal.open( {
				controller: "modalController",
				templateUrl: "src/demo/modal/page1.html",
				title: "弹出框标题 18PX 加粗 #333",
				class4modal: "demo",
				closeByDocument: true,
				scope: $scope
			} );

			modal
			.$promise
			.done( function() {
				modal.$node.find( ".md-loading" ).loading().show();
			} );

			return modal;
		};

	    $scope.init = function() {
            $.anchor( { offset: -60 } );
	    };
	} ] );
} );
