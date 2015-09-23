
define( [ "ui/message/message-ng" ], function() {

    "use strict";

    angular
    .module( "demo.message", [ "$ui.message" ] )
    .controller( "messageController", [ "$scope", "$message", function( $scope, $message ) {

        $scope.init = function() {
            $.anchor( { offset: 20 } );
        };

        angular.extend( $scope, {

            showSuccess: function() {
                $message.success( "This is a message telling you that everything is a-okay" );
            },

            showDanger: function() {
                $message.danger( "This is a notification that something is wrong..." );
            },

            showInfo: function() {
                $message.info( "This is an 'information message' div." );
            },

            showWarning: function() {
                $message.warning( "It warns the users that to expect some changes or limitations." );
            },

            showConfirm: function() {

                $message.confirm( {
                    title: "Please confirm",
                    message: "Exported successfully. Do you want to open the export query page?",
                    onOk: function() {
                        window.open( "//www.google.com", "_blank" );
                    }
                } );
            },

            showBubble: function() {
                $.message.bubble( "Thank You~", 3000 );
            }
        } );
    } ] );
} );
