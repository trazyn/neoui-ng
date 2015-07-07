
define( [ "ui/autoComplete/autoComplete-ng" ], function() {

    "use strict";

    angular
    .module( "demo.autoComplete", [ "$ui.autoComplete" ] )
    .controller( "autoCompleteController", [ "$scope", function( $scope ) {

        $scope.name = "Test";
        $scope.data = [ {
			value: "AD",
			text: "Andorra"
		}, {
			value: "AZ",
			text: "Azerbaijan"
		}, {
			value: "AW",
			text: "Aruba"
		}, {
			value: "BI",
			text: "Bulgaria"
		}, {
			value: "BS",
			text: "Bahamas"
		}, {
			value: "CH",
			text: "Switzerland"
		}, {
			value: "CK",
			text: "Cook Island"
		}, {
			value: "CL",
			text: "Chile"
		}, {
			value: "CN",
			text: "China"
		}, {
			value: "CM",
			text: "Cambodia"
		}, {
			value: "AE",
			text: "United Arab Emirates"
		}, {
			value: "AF",
			text: "Afghanistan"
		}, {
			value: "AG",
			text: "Antigua and Barbuda"
		}, {
			value: "AO",
			text: "Angola"
		} ];

		$scope.address = [ {
			value: "AG",
			text: "Antigua and Barbuda"
		}, {
			value: "AO",
			text: "Angola"
		} ];
    } ] );
} );
