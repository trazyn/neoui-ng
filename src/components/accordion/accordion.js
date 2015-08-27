
(function( $ ) {

    "use strict";

    var
    namespace = "$ui.accordion",

    Accordion = function( target, settings ) {

        var recent;

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
                        settings.onCollapse( recent.attr( "index" ) );
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
                    settings.onExpand( self.attr( "index" ) );
                } );

                recent = self;
            } else {

                self.animate( {
                    height: self.attr( "data-height" )
                }, settings.duration, function() {
                    self
                    .css( "height", "" )
                    .removeAttr( "data-height" );
                    settings.onCollapse( self.attr( "index" ) );
                } );
            }
        } );

        this.$node = target;
        this.settings = settings;
    };

    Accordion.prototype = {

        expandAll: function() {

            this
            .$node
            .find( this.settings.selector4pane )
            .each( function() {
                var self = $( this );
                !self.hasClass( "open" ) && self.trigger( "click" );
            } );
        },

        collapseAll: function() {

            this
            .$node
            .find( this.settings.selector4pane )
            .filter( ".open" )
            .trigger( "click" );
        },

        expand: function( index ) {

            this
            .$node
            .find( this.settings.selector4pane )
            .filter( "[index='" + index + "']:not(.open)" )
            .trigger( "click" );
        },

        collapse: function( index ) {

            this
            .$node
            .find( this.settings.selector4pane )
            .filter( ".open[index='" + index + "']" )
            .trigger( "click" );
        },

        toggle: function( index ) {

            this
            .$node
            .find( this.settings.selector4pane )
            .filter( "[index='" + index + "']" )
            .trigger( "click" );
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
        onExpand        : $.noop,
        onCollapse      : $.noop,
        selector4pane   : ">.pane",
        selector4content: ".content:first",
        selector4head   : ".head:first"
    };

})( window.jQuery || window.$ );

