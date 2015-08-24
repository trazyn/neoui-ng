
define( [], function() {

    "use strict";

    angular
    .module( "demo.accordion", [] )
    .controller( "accordionController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor( { offset: -30 } );
        };

        $( ".ui.accordion:first" )

        .delegate( ".pane", "click", function( e ) {

            var
            self = $( this ),
            height = self.innerHeight(),
            content = self.find( ".content:first" );

            self
            .toggleClass( "open" );

            if ( self.hasClass( "open" ) ) {

                self
                .height( height )
                .attr( "data-height", height )
                .animate( {
                    height: height + content.innerHeight()
                }, 200 );
            } else {

                self.animate( {
                    height: self.attr( "data-height" )
                }, 200, function() {
                    self.removeAttr( "data-height" );
                } );
            }
        } );
    } ] );
} );

