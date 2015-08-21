
define( [ "ui/dropdown/dropdown-ng" ], function() {

    "use strict";

    angular
    .module( "demo.dropdown", [ "$ui.dropdown" ] )
    .controller( "dropdownController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor( { offset: -10 } );
        };

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

        $( ".ui.dropdown.icon" ).each( function() {
            $( this ).dropdown( { data: $scope.data } );
        } );

        angular.extend( $scope, {

            ajax: function() {

                var deferred = $.Deferred();

                $.ajax( {
                    url: "src/demo/dropdown/result.json",
                    dataType: "json"
                } )

                .done( function( data ) {
                    data = data.items;
                    deferred.resolveWith( data );
                } )

                .fail( deferred.reject );

                return deferred;
            },

            required: true,
            multiple: true
        } );
    } ] );
} );
