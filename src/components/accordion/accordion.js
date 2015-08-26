
(function( $ ) {

    "use strict";

    var
    namespace = "$ui.accordion",

    Accordion = function( target, settings ) {

        var
        panes = target.find( settings.selector4pane ),
        recent;

        target
        .delegate( settings.selector4pane, "click", function( e ) {

            var
            self = $( this ),
            height = self.innerHeight(),
            content = self.find( settings.selector4content );

            e.stopPropagation();
            e.preventDefault();

            if ( !settings.multiple
                    && recent
                    && recent.get(0) !== this ) {

                +function( recent ) {
                    recent
                    .height( recent.innerHeight() )
                    .animate( {
                        height: recent.attr( "data-height" )
                    }, settings.duration, function() {
                        recent.removeClass( "open" );
                    } );
                }( recent );
            }

            self
            .toggleClass( "open" );

            if ( self.hasClass( "open" ) ) {

                self
                .height( height )
                .attr( "data-height", height )
                .animate( {
                    height: height + content.innerHeight()
                }, settings.duration, function() {
                    self.css( "height", "" );
                } );

                recent = self;
            } else {

                self.animate( {
                    height: self.attr( "data-height" )
                }, settings.duration, function() {
                    self
                    .css( "height", "" )
                    .removeAttr( "data-height" );
                } );
            }
        } );

        this.$node = target;
        this.settings = settings;
    };

    Accordion.prototype = {

        expandAll: function() {

        },

        collapseAll: function() {

        },

        expand: function( index ) {

        },

        collapse: function( index ) {

        },

        toggle: function( index ) {

        }
    };

    $.fn.accordion = function( options ) {

        var instance = this.data( namespace );

        if ( !instance ) {
            instance = new Accordion( this, $.extend( {}, $.fn.accordion.defaults, options ) );
            this.data( namespace, instance );
        }
        return instance;
    };

    $.fn.accordion.defaults = {
        multiple        : false,
        duration        : 300,
        selector4pane   : ">.pane",
        selector4content: ".content:first",
        selector4head   : ".head:first"
    };

})( window.jQuery || window.$ );

