

define( [ "util/dateutil" ], function() {

    "use strict";

	var

	namespace = "$ui.calendar",

	Calendar = function( target, settings ) {

		var
        defaultDate,
		current,
		inAnimate = false,
		show = function( step ) {

            var
            container = calendar.find( ".content .dates.current" ),
            label = [],
            steps = [ step ];

            if ( inAnimate ) { return; }

            if ( settings.double ) {

                if ( step instanceof Date ) {
                    steps.push( new Date( step.getFullYear(), step.getMonth() + 1 ) );
                } else {
                    steps.push( step > 0 ? 1 : -1 );
                }
            }

            for ( var i = 0, length = steps.length; i < length; ++i ) {

                var step = steps[i];

                (function( container, step ) {

                    var
                    prev,
                    next,
                    animation,
                    html;

                    prev = container.prev();
                    next = container.next();
                    step = step || new Date();

                    switch ( step ) {

                        /** Previous month */
                        case -1:
                            if ( 1 === current[ 1 ] ) {
                                --current[ 0 ];
                                current[ 1 ] = 12;
                            } else
                                --current[ 1 ];
                            break;
                        /** Next month */
                        case 1:
                            if ( 12 === current[ 1 ] ) {
                                ++current[ 0 ];
                                current[ 1 ] = 1;
                            }
                            else ++current[ 1 ];
                            break;
                        /** Next year */
                        case 12:
                            ++current[ 0 ];
                            break;

                        /** Previous year */
                        case -12:
                            --current[ 0 ];
                            break;

                        default:
                            current = [ step.getFullYear(), step.getMonth() + 1, 1 ];
                    }

                    label.push( settings.months[ current[ 1 ] - 1 ] + " , " + current[ 0 ] );

                    html = calc( new Date( current.join( "/" ) ), defaultDate, settings );

                    if ( step instanceof Date || steps[0] === void 0 ) {
                        return container.html( html ).css( "height", "auto" );
                    }

                    inAnimate = true;
                    animation = step > 0 ? next : prev;
                    animation.html( html );
                    container.animate( { "height": animation.height() }, 200 );
                    animation.animate( { "left": "1%" }, 200, function() {
                        container.html( html );
                        animation.css( "left", step > 0 ? "100%" : "-100%" );

                        /** Unlock animation */
                        i === steps.length && (inAnimate = 0);
                    } );
                })( container.eq( step > -1 ? i : length - 1 - i ), step );

                if ( step < 0 ) {
                    label = label.reverse();
                }

                calendar.find( ".date" ).html( label.join( " - " ) );
            }
		},

		input = target.find( settings.selector4input ),
		trigger = target.find( settings.selector4trigger ),

        header = [],

		template = "<div tabindex=-1 class='container' >" +
					"<div class='control'>" +
					"<div class='icon first'></div>" +
					"<div class='icon prev'></div>" +
					"<div class='date'>Today</div>" +
					"<div class='icon next'></div>" +
					"<div class='icon last'></div>" +
				"</div>" +

				"<div class='content'>" +
				    "<div class='days'>" +
                        "<div class='header'></div>" +
                        "<div class='dates prev'></div>" +
                        "<div class='dates current'></div>" +
                        "<div class='dates next'></div>" +
				    "</div>" +
                "</div>",

		calendar;

		this.$node = target;
		this.settings = settings;


		input.attr( {
			"name": target.attr( "name" )
		} );

		if ( settings.showTime ) {

            template += "<div class='time'>" +

                "<input name='hour' maxlength=2 value='00' />" +
                "<input name='minute' maxlength=2 value='00' />" +
                "<input name='second' maxlength=2 value='00' />" +

                "</div>";
		}

        for ( var i = 0, length = settings.daysOfTheWeek.length; i < length;
                header.push( "<div>" + settings.daysOfTheWeek[i++] + "</div>" ) );

		switch ( true ) {

            case "string" === typeof settings.defaultDate:
				defaultDate = new Date( settings.defaultDate );
				input.val( $.dateutil( defaultDate ).format( settings.format ) );
				break;

			default:
				if ( input.val() ) {
                    defaultDate = new Date( input.val() );

					if ( isNaN( +defaultDate ) ) {

						input.val( "" );
						defaultDate = new Date();
					}
				} else
                    defaultDate = new Date();
		}

		trigger
        .on( "click", function( e ) {

            var
            rect,
            container;

            /** Prevent multiple instance */
			if ( inAnimate
			        || trigger.is( "[disabled]" )
			        || (calendar && calendar.hasClass( "show" )) ) { return; }

            rect = input[ 0 ].getBoundingClientRect();

			e.preventDefault();
			e.stopPropagation();

			calendar = $( template );

            if ( settings.double ) {
                container = calendar.find( ".content .days" );
                container.clone().appendTo( calendar.addClass( "double" ).find( ".content" ) );
            }

            calendar.find( ".header" ).html( header.join( "" ) );
			show( defaultDate );
			calendar.appendTo( target )

				.css( {
					"top": rect.height + 20,
					"z-index": 999
				} )

				.delegate( ".icon.prev", "click", function( e ) {
					show( -1 );
					e.preventDefault();
				} )

				.delegate( ".icon.next", "click", function( e ) {
					show( 1 );
					e.preventDefault();
				} )

				.delegate( ".date", "click", function() {
					show();
				} )

				.delegate( ".icon.first", "click", function( e ) {

					show( -12 );
					e.preventDefault();
				} )

				.delegate( ".icon.last", "click", function( e ) {

					show( 12 );
					e.preventDefault();
				} )

				.delegate( "div.day", "click", function() {

					var
					self = $( this ),
                    date,
                    value;

                    if ( !self.hasClass( "invalid" ) ) {

                        date = new Date( this.getAttribute( "data-date" ) + " " +
                                (calendar.find( "input[name=hour]" ).val()   || 0) + ":" +
                                (calendar.find( "input[name=minute]" ).val() || 0) + ":" +
                                (calendar.find( "input[name=second]" ).val() || 0) );
                        value = $.dateutil( date ).format( settings.format );

                        input.val( value ).focus();
                        settings.onSelected( value );

                        input.trigger( "change" );

                        defaultDate = date;
                        setTimeout( function() {
                            calendar.remove();
                        } );
                    }
				} )

				.delegate( "input", "focusout", function( e ) {

                    var self = $( this );

                    switch ( true ) {

                        case this.name === "hour" && (+self.val() || 99) > 23:
                            self.val( "00" );
                            break;

                        case (+self.val() || 99) > 59:
                            self.val( "00" );
                            break;
                    }
				} )

				.delegate( "input", "keyup", function( e ) {

				        var self = $( this );

                        if ( e.keyCode !== 38 && e.keyCode !== 40 ) {
                            return;
                        }

                        if ( isNaN( self.val() ) || +self.val() < 0 ) {
                            return self.val( "00" );
                        }

                        /** Handle key down */
                        if ( e.keyCode === 40 ) {

                            if ( +self.val() > 0 ) {
                                self.val( ("0" + (+self.val() - 1)).slice( -2 ) );
                            } else {
                                self.val( this.name === "hour" ? "23" : "59" );
                            }
                            return;
                        }

                        /** Handle key up */
                        if ( (this.name === "hour" && this.value === "23") || +this.value === 59 ) {
                            return self.val( "00" );
                        }

                        self.val( ("0" + (+self.val() + 1)).slice( -2 ) );
				} )

                .on( "focusout", function( e ) {

                    if ( calendar.is( ":hover" ) ) {
                        return;
                    }

                    inAnimate = 1;

                    calendar.removeClass( "show" );
                    setTimeout( function() {
                        calendar.remove();
                        inAnimate = 0;
                    }, 300 );
                } );

                /** Force reflow */
                calendar.offset();
                calendar.addClass( "show" );
                setTimeout( function() {
                    /** After the transition hold the focus */
                    calendar.focus();
                }, 300 );
		} );
	};

    function calc( date, defaultDate, settings ) {

        var
        prev = new Date( date.getFullYear(), date.getMonth(), 0 ),
        next = new Date( date.getFullYear(), date.getMonth() + 1, 1 ),

        now = new Date(),

        range = {
            prev: [ prev.getDate() - prev.getDay(), prev.getDate() ],
            current: [ 1, new Date( date.getFullYear(), date.getMonth() + 1, 0 ).getDate() ],
            next: [ 1, 6 - next.getDay() + 1 ]
        },

        isValid = function( date, start ) {

            var
            minDate = settings.minDate && new Date( settings.minDate ),
            maxDate = settings.maxDate && new Date( settings.maxDate ),

            date = new Date( date.getFullYear(), date.getMonth(), start );

            if ( "function" === typeof settings.selectable
                    && !settings.selectable( date ) ) {
                return " invalid";
            }

            if ( settings.selectableDOW instanceof Array
                    && settings.selectableDOW.indexOf( date.getDay() ) ) {
                return " invalid";
            }

            if ( minDate || maxDate ) {

                if ( (date >= minDate && date <= maxDate)
                        || (!maxDate  && date >= minDate)
                        || (!minDate  && date <= maxDate) ) {

                    return " valid ";
                }

                return " invalid ";
            }

            return " ";
        },

        html = "";

        for ( var start = range.prev[ 0 ], end = range.prev[ 1 ]; end - start !== 6 && start <= end; ++start ) {

            html += "<div class='day " + isValid( prev, start ) + " adjacent prev' " +
                        "data-date='" + [ prev.getFullYear(), prev.getMonth() + 1, start ].join( "/" ) + "'>" +
                        start +
                    "</div>";
        }

        for ( var start = range.current[ 0 ], end = range.current[ 1 ]; start <= end; ++start ) {

            var clazz = isValid( date, start );

            start < now.getDate() && (clazz += " past ");

            date.getFullYear() === defaultDate.getFullYear()
                && date.getMonth() === defaultDate.getMonth()
                && start === defaultDate.getDate()
                && (clazz += " current ");

            date.getFullYear() === now.getFullYear()
                && date.getMonth() === now.getMonth()
                && start ===  now.getDate()
                && (clazz += " today ");

            html += "<div class='day " + clazz + "' data-date='" + [ date.getFullYear(), date.getMonth() + 1, start ].join( "/" ) + "'>" +
                start +
                "</div>";
        }

        for ( var start = range.next[ 0 ], end = range.next[ 1 ]; end - start !== 6 && start <= end; ++start ) {

            html += "<div class='day " + isValid( next, start ) + " adjacent next' " +
                        " data-date='" + [ next.getFullYear(), next.getMonth() + 1, start ].join( "/" ) + "'>" +
                        start +
                    "</div>";
        }

        return html;
    }

	Calendar.prototype = {

		val: function( value ) {

			var input = this.$node.find( ":input" );

			if ( value && !isNaN( +new Date( value ) ) ) {
				var date = new Date( value );
                input.val( $.dateutil( date ).format( this.settings.format ) );
			} else
				return input.val();
		},

		disabled: function() {

            var settings = this.settings;

			this
			.$node
			.find( settings.selector4input + " , " + settings.selector4trigger )
			.attr( "disabled", true );
		},

		enabled: function() {

            var settings = this.settings;

			this
			.$node
			.find( settings.selector4input + " , " + settings.selector4trigger )
			.removeAttr( "disabled" );
		},

		focus: function() {
			this.$node.find( ":input" ).focus();
		}
	};

	$.fn.calendar = function( options, force ) {

		var
		settings,
		instance = this.data( namespace );

		if ( !instance || true === force ) {
            settings = $.extend( {}, $.fn.calendar.defaults, options || {} ),
			instance = new Calendar( this, settings );
			this.data( namespace, instance );
		}
		return instance;
	};

	$.fn.calendar.defaults = {

		months          : [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
		daysOfTheWeek   : [ "S", "M", "T", "W", "T", "F", "S" ],

		format          : "%Y-%m-%d",
		formatter4cell  : $.noop(),

		onSelected      : $.noop,

		showTime        : false,
		double          : false,

		minDate         : undefined,
		maxDate         : undefined,

        selectable      : undefined,

        /** List of selectable days of the week, 0 is Sunday, 1 is Monday, and so on. */
        selectableDOW   : [ 1, 2, 3, 4, 5 ],

		defaultDate     : new Date(),

		selector4input  : ":input",
		selector4trigger: ".icon.calendar"
	};
} );
