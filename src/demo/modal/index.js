
define( [ "ui/modal/modal-ng", "ui/message/message-ng" ], function() {

	"use strict";

	angular
	.module( "demo.modal", [ "$ui.modal", "$ui.message" ] )
	.controller( "modalController", [ "$scope", "$modal", "$message", function( $scope, $modal, $message ) {

        $scope.name = "trazyn";

		$scope.open = function( animate ) {

			$modal.open( {
				controller: "modalController",
				template: "{{ name }}<br/><p>This is a modal window. You can do the following things with it:</p><ul> <li><strong>Read:</strong> modal windows will probably tell you something important so don't forget to read what they say.</li> <li><strong>Look:</strong> a modal window enjoys a certain kind of attention; just look at it and appreciate its presence.</li> <li><strong>Close:</strong> click the outside close the modal.</li> </ul>",
				animate: animate
			} );
		};

		$scope.showSuccess = function() {
			$message.success.apply( $message, arguments );
		};
		$scope.showError = function() {
			$message.error.apply( $message, arguments );
		};
		$scope.showInfo = function() {
			$message.info.apply( $message, arguments );
		};
		$scope.showWarn = function() {
			$message.warn.apply( $message, arguments );
		};
		$scope.showConfirm = function() {

			$message.confirm( {
				title: "Please confirm",
				message: "Exported successfully. Do you want to open the export query page?",
				onOk: function() {
					window.open( "//www.google.com", "_blank" );
				}
			} );
		};
	} ] );
} );

