
(function( $, undefined ) {

    var

    namespace = "$ui.validation",

    validators = $.extend( {}, {

        /** Field is required */
        required: function( value, nothing, target, instance ) {

            if ( target.is( ":checkbox" ) ) {
                return target.is( ":checked" );
            } else if ( target.is( ":radio" ) ) {
                var name = target.attr( "name" );
                return !!instance.$node.find( ":radio[name='" + name + "']:checked" ).length;
            }

            return /[^\s]+/.test( value );
        },

        /** Check if the value matches the comparison */
        equals: function( value, comparison ) {
            return value === comparison;
        },

        equalsIgnoreCase: function( value, comparison ) {
            return this.equals( (value || "").toLowerCase(), (comparison || "").toLowerCase() );
        },

        equalsTo: function( value, selector, target, instance ) {
            return this.equals( value, instance.$node.find( selector ).val() );
        },

        equalsIgnoreCaseTo: function( value, selector, target, instance ) {
            return this.equalsIgnoreCase( value, instance.$node.find( selector ).val() );
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
            return value && comparison && +value.replace( /,/g, "" ) < comparison.toString().replace( /,/g, "" );
        },

        /** Is number above comparison parameter */
        max: function( value, comparison ) {
            return !this.min( value, comparison );
        },

        /** String length is less length */
        minLength: function( value, length, target, instance ) {

            if ( target.is( ":checkbox" ) ) {
                var name = target.attr( "name" );
                return instance.$node.find( ":checkbox[name='" + name + "']:checked" ).length > length;
            }

            return !!(value && !isNaN( +length ) && value.length > length);
        },

        /** String length is greater than length */
        maxLength: function() {
            return !this.minLength.apply( this, arguments );
        },

        /** Is a given date past? */
        past: function( value ) {
            var now = new Date();
            return new Date( value ) > +now;
        },

        /** Is a given date future? */
        future: function() {
            return !this.past.apply( this, arguments );
        },

        /** Check if the value is a date that's after the specified date(defaults to now) */
        after: function( value, comparison ) {
            return +new Date( value ) > new Date( comparison );
        },

        /** Value that's before the specified date */
        before: function() {
            !this.after.apply( this, arguments );
        }
    }, (function() {

        var
        regexps = {
            int: /^(?:[-+]?(?:0|[1-9][0-9]*))$/,
            float: /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/,
            alpha: /^[A-Z]+$/i,
            numeric: /^[-+]?[0-9]+$/,
            hexadecimal: /^[0-9a-fA-F]+$/,
            alphaNumeric: /^[A-Za-z0-9]+$/,
            uppercase: /[A-Z]+/,
            lowercase: /[a-z]+/,
            email: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i,
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
    })() ),

    Validation = function( container, settings ) {

        var self = this;

        settings.validators = $.extend( {}, validators, settings.validators );

        this.$node = container;
        this.settings = settings;

        container.delegate( ":reset", "click", function() {
            self.clean();
        } );
    };

    function mouseenter( e ) {

        var
        self = $( this ),
        container = e.data.container,
        message = e.data.message,
        tooltipOffset = e.data.tooltipOffset,
        offset = self.offset(),
        containerOffset = container.offset(),
        tooltip;

        if ( self.hasClass( "md-validation-tooltiped" ) ) { return; }

        tooltip = $( "<div class='md-validation-message'><p>" + message + "</p></div>" )
            .css( {
                "position": "absolute",
                "top": offset.top - 30 - containerOffset.top + (tooltipOffset.top || 0),
                "left": offset.left - containerOffset.left + (tooltipOffset.left || 0)
            } )
            .appendTo( container );

        self.addClass( "md-validation-tooltiped" ).data( "tooltip", tooltip );
        self.off( "mouseleave", mouseleave ).on( "mouseleave", { target: self, tooltip: tooltip }, mouseleave );
        setTimeout( function() { tooltip.addClass( "md-error-show" ); } );
    }

    function mouseleave( e ) {

        var tooltip = e.data.tooltip;

        tooltip.removeClass( "md-error-show" );
        setTimeout( function() { tooltip.remove(); }, 300 );
        e.data.target.removeClass( "md-validation-tooltiped" );
    }

    function clean( target, settings ) {

        target
        /** Remove all events and classes */
        .removeClass( settings.class4error )
        .off( "mouseenter", mouseenter )
        .off( "mouseleave", mouseleave )
        .removeClass( "md-validation-tooltiped" )
        .removeData( "tooltip" );
    }

    function change( e ) {

        var
        instance = e.data.args.instance,
        settings = instance.settings,
        target = e.data.args.target,
        parameter = e.data.args.parameter,
        validator = e.data.args.validator;

        $.when( validator.call( settings.validators, target.val(), parameter, target, instance ) )
            .done( function() {
                var tooltip = target.data( "tooltip" );

                clean( target, settings );

                tooltip && tooltip.remove();
            } );
    }

    Validation.prototype = {
        validate: function() {

            var
            self = this,
            settings = this.settings,
            deferreds = [],
            eles = this.$node.find( settings.selector ),
            shims = settings.shims;

            function getMessage( target ) {

                var
                messages = target.attr( "messages" ),
                matched = (messages || "").match( /(\w+\s*:\s*'[^']+')+/g ) || [];

                messages = {};

                while ( matched.length ) {
                    var expr = matched.pop().split( ":" );
                    messages[ expr[0].trim() ] = expr[1].replace( /^\s*'|'\s*/g, "" );
                }

                return messages;
            }

            function handle( target, validator, messages ) {

                var
                deferred,
                result,
                parameter,
                message;

                if ( "string" === typeof validator ) {
                    message = messages[ validator ];
                    validator = settings.validators[ validator ];
                } else {

                    var
                    /** Use the first validator, ignore others */
                    key = Object.keys( validator )[0],
                    parameter = validator[ key ],
                    validator = settings.validators[ key ],
                    message = messages[ key ];

                    if ( !validator && parameter instanceof Function ) {
                        validator = parameter;
                        parameter = void 0;
                    }
                }

                message = message || settings.message;

                result = validator.call( settings.validators, target.val(), parameter, target, self );

                if ( result === false ) {
                    deferred = $.Deferred();
                    deferred.reject();
                } else {
                    deferred = result;
                }

                target = settings.parseElement( target, settings );

                $.when( deferred )
                    .fail( function() {
                        target
                        .addClass( settings.class4error )
                        .off( "mouseenter", mouseenter )
                        .on( "mouseenter", { message: message, container: self.$node, tooltipOffset: settings.tooltipOffset || {} }, mouseenter );
                    } )
                    .done( function() {
                        target
                        .removeClass( settings.class4error )
                        .off( "mouseenter", mouseenter )
                        .off( "mouseleave", mouseleave );
                    } );

                deferreds.push( deferred );

                target.off( "change", change ).on( "change"
                        , { args: { target: target, validator: validator, parameter: parameter, instance: self } }
                        , change );

                return result;
            }

            if ( shims instanceof Array && shims.length ) {

                for ( var i = shims.length; --i >= 0; ) {
                    var shim = shims[i];
                    handle( this.container.find( shim.selector ), shim.validator );
                }
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

                for ( var m = 0, length = validators.length; m < length; ++m ) {

                    if ( !handle( ele, validators[ m ], messages ) && settings.breakOnError ) {
                        break;
                    }
                }
            }

            return $.when.apply( $, deferreds );
        },

        clean: function() {

            var settings = this.settings;

            this
            .$node
            .find( settings.selector )
            .each( function() {
                clean( settings.parseElement( $( this ).val( "" ) ), settings );
            } );

            return this;
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

        class4error     : "md-error",
        selector        : ":input[validators]:visible:not(button)",

        custom          : {},
        message         : "Invalid input",
        breakOnError    : true,

        /** TODO: bootstrap form-control */
        parseElement    : function( target ) {

            var parent = target.parent();

            if ( target.is( "select, :checkbox, :radio" ) && parent.is( ".md-select, .md-switch, .md-radio" ) ) {

                if ( target.is( ":radio" ) && parent.parent().is( ".ui.radioes" ) ) {
                    return parent.parent();
                }

                return parent;
            } else if ( target.is( ":checkbox" ) && (parent = target.parents( ".ui.checkboxes:first" ), parent.length) ) {
                return parent;
            }

            return target;
        },

        validators      : {}
    };
})( window.jQuery );
