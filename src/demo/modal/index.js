
define( [ "ui/modal/modal-ng", "ui/message/message-ng" ], function() {

	"use strict";

	angular
	.module( "demo.modal", [ "$ui.modal", "$ui.message" ] )
	.controller( "modalController", [ "$scope", "$modal", function( $scope, $modal ) {

        $scope.name = "test";

		$scope.open = function( animate ) {

			$modal.open( {
				controller: "modalController",
				template: "{{ name }}<br/><p>This is a modal window. You can do the following things with it:</p><ul> <li><strong>Read:</strong> modal windows will probably tell you something important so don't forget to read what they say.</li> <li><strong>Look:</strong> a modal window enjoys a certain kind of attention; just look at it and appreciate its presence.</li> <li><strong>Close:</strong> click the outside close the modal.</li> </ul>",
				animate: animate
			} );
		};

	    $scope.init = function() {
            $( document.body ).anchor( { offset: -80 } );
	    };
	} ] );
} );

