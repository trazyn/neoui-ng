
define( [ "ui/modal/modal" ], function( undefined ) {

"use strict";

angular.module( "$ui.modal", [] )
	.factory( "$modal", [ "$rootScope", "$compile",

function( $rootScope, $compile ) {

	var
	defaults = {

		scope 		    : undefined,
		template        : undefined,
		templateUrl     : undefined
		/** Overwrite the jQuery plugin default settings */
	},

	Modal = function( options ) {

		var
		$modal,
        settings,
		html,
		waiting;

		if ( !options.template && !options.templateUrl ) {
			throw new Error( "Expected modal to have exacly one of either 'template' or 'templateUrl'" );
		}

		if ( options.template ) {
            html = options.template;
		} else {

            waiting = $.Deferred();

            html = function( deferred, loading, close ) {
                var
                self = $( this );

                $.ajax( {
                    url: options.templateUrl,
                    dataType: "html"
                } )
                .done( function( data ) {
                    self.html( data );
                    deferred.resolve();

                    waiting.resolve();
                } );
            };
		}

        $.when( waiting )
        .done( function() {
            $compile( $modal.$node[0] )( options.scope || $rootScope.$new() );
            options.scope.$apply();
        } );

        settings = angular.extend( {}, defaults, options, {

            /** Overwite the jQuery plugin default settings */
            render: html,
            autoShow: true
        } );

        $modal = $.modal( settings );

        return $modal;
	};

	return {
		open: function( options ) {
			return Modal( options );
		}
	};
} ] );

} );
