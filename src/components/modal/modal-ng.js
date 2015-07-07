
define( [ "ui/modal/modal" ], function( undefined ) {

"use strict";

angular.module( "$ui.modal", [] )
	.factory( "$modal", [ "$rootScope", "$controller", "$q", "$http", "$templateCache", "$compile",

function( $rootScope, $controller, $q, $http, $templateCache, $compile ) {

	var
	defaults = {

		/** For angularjs */
		controller 	    : undefined,
		controllerAs 	: "modal",
		scope 		    : undefined

		/** Overwrite the jQuery plugin default settings */
	},

	Modal = function( options ) {

		var

		$modal,

		controller,
		scope,

		deferred;

		if ( !options.template && !options.templateUrl ) {
			throw new Error( "Expected modal to have exacly one of either 'template' or 'templateUrl'" );
		}

		if ( options.template ) {
			deferred = $q.when( options.template );
		} else {
			deferred = $http.get( options.templateUrl, {
				cache: $templateCache
			} )
			.then( function( html ) {
				return response.data;
			} );
		}

		$q
		.when( deferred )
		.then( function( html ) {

			var
			settings = angular.extend( {}, defaults, options, {

				/** Overwite the jQuery plugin default settings */
				render 	: html,
				autoShow: true,
				success : $.noop,
				error 	: $.noop
			} );

			if ( settings.controller ) {

				scope = (settings.scope || $rootScope).$new();
				controller = $controller( settings.controller, { $scope: scope } );

				if ( typeof settings.controllerAs === "string" ) {
					scope[ settings.controllerAs ] = controller;
				}
			}

			$modal = $.modal( settings );
			$compile( $modal.$node )( scope );

			return $modal;
		} );
	};

	return {
		open: function( options ) {
			return Modal( options );
		}
	};
} ] );

} );
