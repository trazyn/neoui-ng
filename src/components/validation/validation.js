
(function( $, undefined ) {

    var

    namespace = "$ui.validation",

    Validation = function( container, settings ) {

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
        validate: function() {

            var
            settings = this.settings,
            deferreds = [],
            eles = this.$node.find( settings.selector ),
            shims = settings.shims;

            function getMessage( target ) {

                var
                messages = target.attr( "messages" ),
                matched = (messages || "").match( /(\w+\s*:\s*'[^']+')+/g );

                messages = {};

                for ( var expr = matched.pop().split( ":" ); matched.length; ) {
                    messages[ expr[0].trim() ] = expr[1].replace( /^\s*'|'\s*/g, "" );
                }
            }

            function handle( target, validator ) {

                var
                deferred,
                result,
                parameter;

                if ( "string" === typeof validator ) {
                    validator = settings.validators[ validator ];
                } else {

                    /** Use the first validator, ignore others */
                    var key = Object.keys( validator )[0];
                    validator = target.data( "validator-" + key );
                    parameter = validator[ key ];
                }

                result = validator.call( settings.validators, target.val(), parameter, target );

                if ( result === false ) {
                    deferred = $.Deferred();
                    deferred.reject();
                } else {
                    deferred = result;
                }

                $.when( deferred )
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

                deferreds.push( deferred );

                target.off( "change", change ).on( "change"
                        , { args: { target: target, validator: validator, settings: settings } }
                        , change );

                return result;
            }

            if ( shims instanceof Array && shims.length ) {
                for ( var i = shims.length; --i >= 0;
                        handle( this.container.find( shim.selector ), shims[ i ][ "validator" ] ));
            }

            for ( var i = eles.length; --i >= 0; ) {

                var
                ele = eles.eq( i ),
                messages = getMessage( ele ),
                validators = ele.attr( "validators" );

                try {
                    validators = eval( validators );
                } catch( ex ) {
                    validators = [];
                }

                for ( var i = 0, length = validators.length; i < length; ++i ) {

                    if ( !handle( ele, validators[ i ] ) ) {
                        break;
                    }
                }
            }

            return $.when.apply( $, deferreds );
        },

        clean: function() {

        }
    };

    $.fn.validation = function( options ) {

        var
        instance = this.data( namespace );

        if ( !instance ) {
            instance = new Validation( this, $.extend( true, {}, $.fn.validation.defaults, options ) );
            this.data( namespace, instance );
        }

        return instance;
    };


    $.fn.validation.defaults = {

        class4error     : "error",
        class4success   : "success",
        selector        : ":input[validators]:visible:not(button)",

        validators      : $.extend( {}, {

            /** Check if the value matches the comparison */
            equals: function( value, comparison ) {
                return value === comparison;
            },

            /** Check if the value contains the seed */
            contains: function( value, seed ) {
                return value && seed && value.indexOf( seed ) > -1;
            },

            /** String start with a given startWith parameter */
            startWith: function( value, startWith ) {
                return value && startWith && value.indexOf( startWith ) === 0;
            },

            /** String end with a given endWith parameter */
            endWith: function( value, endWith ) {
                return value && endWith && value.lastIndexOf( endWith ) === value.length - endWith.length;
            },

            /** Is number under comparison parameter */
            min: function( value, comparison ) {
                return value && comparison && +value.replace( /,/g, "" ) < comparison.replace( /,/g, "" );
            },

            /** Is number above comparison parameter */
            max: function( value, comparison ) {
                return !this.min( value, comparison );
            },

            /** String length is less length */
            minLength: function( value, length ) {
                return value && !isNan( +length ) && value.length < length;
            },

            /** String length is greater than length */
            maxLength: function( value, length ) {
                return !this.minLength( value, length );
            },

            /** Is a given date past? */
            past: function( value ) {
                var now = new Date();
                return new Date( value ) > +now;
            },

            /** Is a given date future? */
            future: function( value ) {
                return !this.past( value );
            },

            /** Check if the value is a date that's after the specified date(defaults to now) */
            after: function( value, comparison ) {

                return +new Date( value ) > new Date( comparison );
            },

            /** Value that's before the specified date */
            before: function( value, comparison ) {
                !this.after.apply( this, arguments );
            }
        }, (function() {

            var
            regexps = {
                required: /[^\s]+/,
                int: /^(?:[-+]?(?:0|[1-9][0-9]*))$/,
                float: /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/,
                alpha: /^[A-Z]+$/i,
                numeric: /^[-+]?[0-9]+$/,
                hexadecimal: /^[0-9a-fA-F]+$/,
                alphaNumeric: /^[A-Za-z0-9]+$/,
                email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e])|(\\[\x01-\x09\x0b\x0c\x0d-\x7f])))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))$/i,
                phone: /^(\+?0?86\-?)?1[345789]\d{9}$/,
                url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
                zipCode: /^[1-9]d{5}$/,
                timeString: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
                dateString: /^(1[0-2]|0?[1-9])\/(3[01]|[12][0-9]|0?[1-9])\/(?:[0-9]{2})?[0-9]{2}$/,
                hexColor: /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
                ip: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/
            },

            validators = {},

            regexpCheck = function( key, regexp ) {

                validators[ key ] = function( value ) {
                    return regexp.test( value );
                };
            };

            /** Create regexp checks methods from 'regexp' object */
            for ( var key in regexps ) {
                if ( regexps.hasOwnProperty( key ) ) {
                    regexpCheck( key, regexps[ key ] );
                }
            }

            return validators;
        })() )
    };

})( window.jQuery );
