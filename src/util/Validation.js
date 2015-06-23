
(function( $, undefined ) {

        var defaults = {

                class4error: "error",
                class4success: "success",

                validators: {
                
                	/** Not null */
                        REQUIRED: function() {

                                var deferred = $.Deferred();

                                !!$( this ).val()
                                ? deferred.resolve()
                                : deferred.rejectWith( {
                                        message: "This field is required"
                                } );

                                return deferred;
                        },

                        /** TODO: */

                        /** Is a email */
                        EMAIL: function() {
                        
                        },

			/**
			* Check if the value matches the comparison
			*
			* @param String comparison
			* */
                        EQUALS: function( comparison ) {
                        
                        },

			/** 
			* Check if the value contains the seed
			*
			* @param String seed
			* */
                        CONTAINER: function( seed ) {
                        
                        },

			/** Check if the value is an ip */
                        IP: function() {
                        
                        },

			/** 
			* Check if the value matches the pattern 
			* 
			* @param Regex 	pattern
			* */
                        MATCHES: function( pattern ) {
                        
                        },

			/** Check if the value is lowercase */
                        LOWERCASE: function() {
                        
                        },

			/** Check if the value is uppercase */
                        UPPERCASE: function() {
                        
                        },

			/** Check if the value is integer */
                        INT: function() {
                        
                        },

			/** Check if the value is float */
                        FLOAT: function() {
                        
                        },

			/**
			* Check if the value's length falls in a range
			*
			* @param Number 	min
			* @param Number 	[max]
			* */
                        LENGTH: function( min, max ) {
                        
                        },

			/** Check if the value is a date */
                        DATE: function() {
                        
                        },

			/**
			* Check if the value is a date that's after the specified date(defaults to now)
			*
			* @param Date 	[date]
			* */
                        AFTER: function( date ) {
                        
                        },

			/**
			* Value that's before the specified date
			*
			* @param Date 	[date]
			* */
                        BEFORE: function( date ) {
                        
                        },
			
			/**
			* Check if the value is in a array of allowed values
			*
			* @param Array 	values
			* */
			IN: function( values ) {
			
			}
                },

                selector: ":input[data-validation]:visible:not(button)",

        }

        , Validation = function( container, settings ) {

                this.$node = container;
                this.settings = settings;
        };

        function mouseenter( e ) {
        
                var 
                self = $( this ),
                args = e.data.args,
                message = self.attr( "data-validation-message" ),
                offset = self.offset(),
                tooltip;

		if ( self.is( ".tooltiped" ) ) { return; }

                tooltip = $( "<div class='ui tooltip error arrow down animate scale'><p>" + (message || args.message) + "</p></div>" )
                                .css( {
                                        "position": "absolute",
                                        "top": offset.top + 10,
                                        "left": offset.left
                                } )
                                .appendTo( document.body );

                self.addClass( "tooltiped" ).data( "tooltip", tooltip );

                self.off( "mouseleave", mouseleave ).on( "mouseleave", { target: self, tooltip: tooltip }, mouseleave );

                setTimeout( function() { tooltip.addClass( "show" ); } );
        }

        function mouseleave( e ) {

                var tooltip = e.data.tooltip;

                tooltip.removeClass( "show" );
                setTimeout( function() { tooltip.remove(); }, 333 );
                e.data.target.removeClass( "tooltiped" );
        }

        function change( e ) {
        
                var
                settings = e.data.args.settings,
                target = e.data.args.target,
                validator = e.data.args.validator;

                $.when( validator.call( target ) )
                        .done( function() {
                                var tooltip = target.data( "tooltip" );

                                target
                                /** Remove all events and classes */
                                .removeClass( settings.class4error )
                                .removeClass( settings.class4success )
                                .off( "mouseenter", mouseenter )
                                .off( "mouseleave", mouseleave )
                                .removeClass( "tooltiped" )
                                .removeData( "tooltip" );

                                tooltip && tooltip.remove();
                        } );
        }

        Validation.prototype = {
                valid: function() {

                        var 
                        settings = this.settings,
                        deferreds = [],
                        eles = this.$node.find( settings.selector ),
                        shims = settings.shims;

                        function handle( target, validator ) {
                        
                                var promise = validator.call( target );

                                $.when( promise )
                                .fail( function() {
                                        target
                                        .removeClass( settings.class4success )
                                        .addClass( settings.class4error )
                                        .off( "mouseenter", mouseenter )
                                        .on( "mouseenter", { args: this }, mouseenter );
                                } )
                                .done( function() {
                                        target
                                        .removeClass( settings.class4error )
                                        .addClass( settings.class4success )
                                        .off( "mouseenter", mouseenter )
                                        .off( "mouseleave", mouseleave );
                                } );

                                deferreds.push( promise );

                                target.off( "change", change ).on( "change"
                                                                        , { args: { target: target, validator: validator, settings: settings } }
                                                                        , change );
                        }

                        if ( shims instanceof Array && shims.length ) {
                                for ( var i = shims.length; --i >= 0;
                                                handle( this.container.find( shim.selector ), shims[ i ][ "validator" ] ));
                        }

                        for ( var i = eles.length; --i >= 0; ) {
                                var 
                                ele = eles.eq( i ),
                                validator = settings.validators[ ele.attr( "data-validation" )[ "toUpperCase" ]() ];

                                typeof validator === "function" && handle( ele, validator );
                        }

                        return $.when.apply( $, deferreds );
                }
        };

        $.fn.validation = function( options ) {
        
                var 
                identifier = "$util.validation",
                instance = this.data( identifier );

                if ( !instance ) {
                        instance = new Validation( this, $.extend( {}, options, defaults ) );
                        this.data( identifier, instance );
                }

                return instance;
        };
})( $ );
