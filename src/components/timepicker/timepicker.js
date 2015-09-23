
define( [], function() {

    "use strict";

    var
    namespace = "$ui.timepicker",

    Timepicker = function( target, settings ) {

        var
        instance = this,
        hoursHtml = "",
        mintuesHtml = "",

        defaultTime = new Date( settings.defaultTime );

        this.$node = target;
        this.settings = settings;

        for ( var i = 0; i <= 23; ++i ) {
            hoursHtml += "<span>" + i + "</span>";
        }

        for ( var i = 0; i <= 11; mintuesHtml += "<span>" + (i++ * 5) + "</span>" );

        if ( !isNaN( +defaultTime ) ) {
            target.find( settings.selector4hour ).val( defaultTime.getHours() );
            target.find( settings.selector4mintue ).val( defaultTime.getMinutes() );
        }

        target
        .append( "<div tabindex=-1 class='md-timepicker-hours'><p>请选择小时</p><div>" + hoursHtml + "</div></div>" )
        .append( "<div tabindex=-1 class='md-timepicker-mintues'><p>请选择分钟</p><div>" + mintuesHtml + "</div></div>" )

        .delegate( "input", "click", function( e ) {

            var self = $( this );

            if ( target.is( "[disabled]" ) ) { return; }

            target
            .find( self.hasClass( "md-timepicker-hour" ) ? ".md-timepicker-hours" : ".md-timepicker-mintues" )
            .addClass( "show" )
            .focus();
        } )

        .delegate( "input", "focusout", function() {

            var
            self = $( this ),
            value = +self.val(),
            isValid = true,
            popover = target.find( ".md-timepicker-hours" );

            if ( isValid = !isNaN( value ), isValid ) {

                if ( self.hasClass( "md-timepicker-mintue" ) ) {
                    popover = target.find( ".md-timepicker-mintues" );

                    if ( settings.strict ) {

                        if ( self.val() !== "00" ) {
                            popover.find( "span" ).filter( function() {
                                if ( $( this ).text() == self.val() ) {
                                    isValid = false;
                                }
                            } );
                        }
                    } else if ( value > 59 ) {
                        isValid = false;
                    }
                } else {

                    /** Check the hour */
                    if ( value > 23 ) {
                        isValid = false;
                    }
                }
            }

            if ( !isValid ) {
                popover.find( "span" ).removeClass( "selected" );
                self.click();
            }
        } )

        .delegate( ".md-timepicker-hours span", "click", function() {
            target.find( settings.selector4hour ).val( this.innerHTML ).select();
        } )

        .delegate( ".md-timepicker-mintues span", "click", function() {
            target.find( settings.selector4mintue ).val( this.innerHTML ).select();
        } )

        .delegate( "span", "click", function() {

            $( this ).addClass( "selected" ).parent().find( "span" ).not( this ).removeClass( "selected" );
            settings.onApplied.call( instance, instance.val() );
        } )

        .delegate( ".md-timepicker-hours, .md-timepicker-mintues", "focusout", function() {
            $( this ).removeClass( "show" );
        } );
    };

    Timepicker.prototype = {

        val: function( value ) {

            var
            settings = this.settings,
            hour,
            mintue;

            if ( value ) {

                value = value.split( ":" );
                hour = value[0];
                mintue = value[1];

                hour = hour >= 0 && hour < 24 ? hour : "00";
                mintue = mintue >= 0 && mintue < 60 ? mintue : "00";

                this.$node.find( settings.selector4hour ).val( hour );
                this.$node.find( settings.selector4mintue ).val( mintue );
            } else {
                return this.$node.find( settings.selector4hour ).val() + ":" + this.$node.find( settings.selector4mintue ).val();
            }

            return this;
        },

        disabled: function() {

            var settings = this.settings;

            this
            .$node
            .attr( "disabled", true )
            .find( settings.selector4hour + "," + settings.selector4mintue )
            .attr( "disabled", true );
            return this;
        },

        enabled: function() {

            var settings = this.settings;

            this
            .$node
            .removeAttr( "disabled" )
            .find( settings.selector4hour + "," + settings.selector4mintue )
            .removeAttr( "disabled" );
            return this;
        }
    };

    $.fn.timepicker = function( options ) {

        var instance = this.data( namespace );

        if ( !instance ) {
            instance = new Timepicker( this, $.extend( {}, $.fn.timepicker.defaults, options ) );
            this.data( namespace, instance );
        }

        return instance;
    };

    $.fn.timepicker.defaults = {
        defaultTime         : new Date(),
        strict              : false,
        selector4hour       : ".md-timepicker-hour",
        selector4mintue     : ".md-timepicker-mintue",
        onApplied           : $.noop
    };
} );

