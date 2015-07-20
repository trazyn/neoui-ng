
(function( exports ) {

    /**
     * See python date format
     *
     * %a - Abbreviated weekday name
     * %A - Full weekday name
     * %b - Abbreviated month name
     * %B - Full month name
     * %c - date and time, as "%a %b %e %H:%M:%S %Y"
     * %d - Zero-padded day of the month as a decimal number[01, 31]
     * %e - Space-padded day of the month as a decimal number [1, 31]
     * %H - Hour(24-hour clock) as decimal number[00, 23]
     * %I - Hour(12-hour clock) as a decimal number[01, 12]
     * %j - Day of the year as a decimal number[001, 366]
     * %m - Month as a decimal number[01, 12]
     * %M - Minute as a decimal number[00, 59]
     * %L - Milliseconds as a decimal number[000, 999]
     * %p - Either AM or PM
     * %S - Second as a decimal number[00, 59]
     * %U - Week nunber of the year(Sunday as the first day of the week) as a decimal number[00, 53]
     * %w - Weekday as a decimal number[0(Sunday), 6]
     * %x - Date, as "%m/%d/%Y"
     * %X - Time, as "%H:%M:%S"
     * %y - Year without century as a decimal number[00, 99]
     * %Y - Year with century as a decimal number
     * %Z - Tiem zone offset, such as "-0700"
     * %% - A literal "%" character
     * */

    var Dateutil = function( value, options ) {

        switch( true ) {

            case value instanceof Date:
                break;

            case typeof value === "number":
                value = new Date( value );
                break;

            case typeof value === "string":
                value = new Date( value );
                break;

            default:
                value = new Date();
        }

        this.value = defaultValue = isNaN( value ) ? new Date() : value;
        this.settings = $.extend( {}, Dateutil.defaults, options || {} );
    };

    Dateutil.defaults = {
    	format: "%Y-%m-%d",
    	abbreviatedWeekdayName: [ "Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat" ],
    	weekdayName: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Satruday" ],
    	abbreviatedMonthName: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ],
    	monthName: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
    };

    Dateutil.prototype = {
        format: function( format ) {

            var
            self = this,
            value = this.value,
            settings = this.settings,

            /** Shortcuts */
            abbreviatedWeekdayName = settings.abbreviatedWeekdayName,
            weekdayName = settings.weekdayName,
            abbreviatedMonthName = settings.abbreviatedMonthName,
            monthName = settings.monthName,
            fullYear = value.getFullYear(),
            year = value.getYear(),
            month = value.getMonth(),
            date = value.getDate(),
            day = value.getDay(),
            hour = value.getHours(),
            minute = value.getMinutes(),
            second = value.getSeconds(),
            milliSecond = value.getMilliseconds(),
            timeZoneOffset = value.getTimezoneOffset();

            return (format || settings.format)
                .replace( /(yyyy|MM|dd|HH|mm|ss|%a|%A|%b|%B|%c|%d|%e|%H|%I|%j|%m|%M|%L|%p|%S|%U|%w|%x|%X|%y|%Y|%Z|%%)/g, function( match, post, originalText ) {

                    switch ( match ) {

                        case "yyyy":
                            return fullYear;
                        case "MM":
                            return month + 1;
                        case "dd":
                            return date;
                        case "HH":
                            return hour;
                        case "mm":
                            return minute;
                        case "ss":
                            return second;
                        case "%a":
                            return abbreviatedWeekdayName[ day ];
                        case "%A":
                            return weekdayName[ day ];
                        case "%b":
                            return abbreviatedMonthName[ month ];
                        case "%B":
                            return monthName[ month ];
                        case "%c":
                            return self.format.call( { settings: settings, value: value }, "%a %b %e %H:%M:%S %Y" );
                        case "%d":
                            return ("0" + date).slice( -2 );
                        case "%e":
                            return date;
                        case "%H":
                            return ("0" + hour).slice( -2 );
                        case "%I":
                            return hour <= 12 ? hour : (hour - 12);
                        case "%j":

                            var i = 0, increment = 0;

                            while ( i++ < month ) {
                                    increment += new Date( fullYear, i, 0 ).getDate();
                            }

                            return ("00" + (increment + date)).slice( -3 );

                        case "%m":
                            return ("0" + (month + 1)).slice( -2 );
                        case "%M":
                            return ("0" + minute).slice( -2 );
                        case "%L":
                            return ("00" + milliSecond).slice( -3 );
                        case "%p":
                            return hour > 11 ? "PM" : "AM";
                        case "%S":
                            return ("0" + second).slice( -2 );
                        case "%U":
                            return ("0" + Math.ceil( self.format.call( { settings: settings, value: value }, "%j" ) / 7 )).slice( -2 );
                        case "%w":
                            return day;
                        case "%x":
                            return self.format.call( { settings: settings, value: value }, "%m/%d/%Y" );
                        case "%X":
                            return self.format.call( { settings: settings, value: value }, "%H:%M:%S" );
                        case "%y":
                            return year;
                        case "%Y":
                            return fullYear;
                        case "%Z":
                            return timeZoneOffset;

                        case "%%":
                            return "%";
                    }
                } );
        },

        nice: function() {

            var
            diff  = (new Date() - this.value) / 1000,
            days = Math.floor( diff / 86400 );

            if ( diff < 0 ) {

                return this.format.call( {
                        settings: this.settings,
                        value: this.value
                } );
            } else if ( diff < 60 ) {
                return "just ago";
            } else if ( diff < 120 ) {
                return "1 minute ago";
            } else if ( diff < 3600 ) {
                return Math.floor( diff / 60 ) + " minutes ago";
            } else if ( diff < 7200 ) {
                return "1 hour ago";
            } else if ( diff < 86400 ) {
                return Math.floor( diff / 3600 ) + " hours ago";
            } else if ( days === 1 ) {
                return "Yesterday";
            } else if ( days < 7 ) {
                return days + " days ago";
            } else if ( days < 31 ) {
                Math.ceil( days / 7 ) + " weeks ago";
            } else if ( days >= 31 ) {
                return "more than 5 weeks ago";
            }
        },

        day: function( value ) {
            return new Date( +this.value + value * 3600 * 1000 * 24 );
        },

        name: function( name, format ) {

            var
            date = this.value,
            offset,
            mapping = {
                "monday"        : 1,
                "tuesday"       : 2,
                "wednesday"     : 3,
                "thursday"      : 4,
                "friday"        : 5,
                "saturday"      : 6,
                "sunday"        : 7
            };

            if ( date.getDay() === 0 ) {
                offset = date.getDay() + (mapping[ name ] - 7);
            } else {
                offset = -(date.getDay() - mapping[ name ]);
            }

            return this.format.call( {
                    settings: this.settings,
                    value: this.day( offset )
            }, format );
        },

        monday: function( format ) {
            return this.name( "monday", format );
        },

        tuesday: function( format ) {
            return this.name( "tuesday", format );
        },

        wednesday: function( format ) {
            return this.name( "wednesday", format );
        },

        thursday: function( format ) {
            return this.name( "thursday", format );
        },

        friday: function( format ) {
            return this.name( "friday", format );
        },

        saturday: function( format ) {
            return this.name( "saturday", format );
        },

        sunday: function( format ) {
            return this.name( "sunday", format );
        },

        yesterday: function( format ) {
            return this.format.call( {
                    settings: this.settings,
                    value: this.day( -1 )
            }, format );
        },

        tomorrow: function( format ) {
            return this.format.call( {
                    settings: this.settings,
                    value: this.day( 1 )
            }, format );
        },

        week: function( value ) {
            return this.day( value * 7 );
        },

        lastWeek: function( format ) {
            return this.format.call( {
                    settings: this.settings,
                    value: this.week( -1 )
            }, format );
        },

        nextWeek: function( format ) {
            return this.format.call( {
                    settings: this.settings,
                    value: this.week( 1 )
            }, format );
        },

        month: function( value ) {

            var
            date = this.value,
            current = [ date.getFullYear(), date.getMonth() ],
            offset = [ Math.floor( value / 12 ), value % 12 ];

            return new Date( current[ 0 ] + offset[ 0 ], current[ 1 ] + offset[ 1 ]
                                , date.getDay()
                                , date.getHours()
                                , date.getMinutes()
                                , date.getSeconds() );
        }
    };

    exports = exports || window;

    exports.dateutil = function() {

        var instance = {};
        Dateutil.apply( instance, arguments );
        return $.extend( instance, Dateutil.prototype );
    };

})( window.jQuery );
