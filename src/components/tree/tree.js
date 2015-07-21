
(function( $ ) {

	var
	namespace = "$ui.tree",

	Tree = function( target, settings ) {
		var
		deferred,
		selected,
		cache = [],
        hash = {},
        self = this,
		data = settings.data;

		this.$node = target;
		this.settings = settings;

        if ( typeof settings.data === "function" ) {
            deferred = settings.data();
        }

		$.when( deferred ).done( function() {

			var node = $( "<ul>" );

			data = data && (data instanceof Array ? data : this);

            if ( data ) {

                /** Filter support */
                settings.data = ([].concat( data ));
                renderTree( node, data, settings, hash, true );
                target.find( settings.selector4content ).html( node.html() );
            }
		} );

		var
        inHandle = false,
        delay = settings.duration + 100,
        timer;

		target
        .undelegate( "li[data-level]", "click.tree" )
        .delegate( "li[data-level]", "click.tree", function( e ) {

            e.stopPropagation();
            e.preventDefault();

            if ( !inHandle ) {

                var
                self = $( this ),
                duration = settings.duration,
                operation = self.hasClass( "open" ) ? function() { close( self, duration ); } : function() { open( self, duration ); };

                inHandle = 1;

                if ( settings.closeSameLevel ) {

                    var
                    level = self.attr( "data-level" ),
                    recent = cache[ level ];

                    cache[ level ] = self;
                    recent && recent.get( 0 ) !== this && close( recent );
                }

                if ( $( e.target ).is( "span" ) ) {

                    selected && selected.removeClass( "selected" );
                    selected = self.addClass( "selected" );

                    clearTimeout( timer );

                    timer = setTimeout( function() {
                        settings.onSelect.call( self, e, hash[ self.attr( "data-key" ) ], hash, level );
                    }, delay );
                } else {
                    operation();
                }

                setTimeout( function() {
                    /** Unlock operation */
                    target.resize();
                    inHandle = 0;
                }, delay );
            }
		} );

        var timer;

		target
		.find( settings.selector4filter )
		.attr( "placeholder", settings.placeholder )
		.on( "keyup", function( e ) {

            var value = this.value;

            clearTimeout( timer );
            timer = setTimeout( function() {
                self.filter( value );
            }, 300 );
		} );
	};

	function close( target, duration ) {

        var post = function() {
            $( this ).css( "display", "" ).parent().removeClass( "open" ).addClass( "close" ).css( "display", "" );
        };

        /** Close all the children */
        if ( target.hasClass( "open" ) ) {

            if ( duration ) {
                target.find( "ul[style='display: block;']" ).slideToggle( duration, function() {
                    post.call( this );
                } );
            } else {
                /** Disable animate */
                target.find( "ul[style='display: block;']" ).each( function() {
                    post.call( this );
                } );
            }
        }
    }

    function open( target, duration ) {

        if ( target.hasClass( "close" ) ) {

            target.find( "ul:first" ).slideToggle( duration || 0, function() {
                target.removeClass( "close" ).addClass( "open" );
            } );
        }
    }

	Tree.prototype = {
        toggle: function( nodeid ) {

        },

		collapsed: function( nodeid ) {

		},

        expand: function( nodeid ) {

        },

        filter: function( text ) {

            var
            matched,
            settings = this.settings,

            /** Prevent multiple reflow */
            node = this.$node.css( "display", "none" ),
            lis = node.find( "li[data-filter]" ).css( "display", "" );

            /** Close all parent node */
            lis.filter( "li.open" ).each( function() {
                close( $( this ) );
            } );

            if ( text ) {
                matched = lis.filter( "[data-filter*='" + text.toLowerCase() + "']" );
                lis.not( matched ).css( "display", "none" );

                matched.each( function() {

                    var self = $( this );

                    if ( !self.find( "li[data-level][style!='display: none;']" ).length ) {
                        /** Show the subitem */
                        self.find( "li[data-level]" ).css( "display", "" );
                    }

                    /** Expand the matched node */
                    self.parents( "li[data-filter]" ).each( function() {
                        open( $( this ).show() );
                    } );
                } );
            }

            node.css( "display", "" );
        }
	};

	function renderTree( node, data, settings, hash, recursion ) {

		var
		html = "",
		key = node.attr( "data-key" ) || settings.rootIds,
		level = +node.attr( "data-level" ) || 0,
		filter = settings.filter[ level ] || function() { return true; };

		data = data instanceof Array ? data : [ data ];
		key = key instanceof Array ? key : [ key ];

		for ( var i = 0, length = data.length; i < length; ++i ) {

			var item = data[ i ];

			hash[ item[ settings.valueKey ] ] = item;

			/** Match undefined */
			if ( key[ 0 ] === (item[ settings.parentKey ] || "")
					|| key.indexOf( item[ settings.parentKey ] ) !== -1 ) {

				/** Remove this entry and fallback the step */
				--length;
				data.splice( i--, 1 );

                if ( filter( item ) ) {

                    html += "<li class='node " + (settings.collapsed ? "close" : "open") +
                            "' value='" + item[ settings.valueKey ] +
                            "' data-filter='" + item[ settings.textKey ][ "toLowerCase" ]() +
                            "' data-level=" + (level + 1) + " data-key='" + item[ settings.valueKey ] +
                            "'>" +
                            settings.formatter( item, level + 1, settings ) +
                            "</li>";
                }
			}
		}

        if ( html ) {

            html = $( "<ul>" + html + "</ul>" );

            recursion && html.children( "li[data-level]" ).each( function( item ) {
                renderTree( $( this ), data, settings, hash, true );
            } );

            node.append( "<ul>" + html.html() + "</ul>" );
        } else {
            node.removeClass( "node open close" );
		}
	}

	$.fn.tree = function( options ) {

		var instance = this.data( namespace );

		if ( !instance ) {
			instance = new Tree( this, $.extend( {}, $.fn.tree.defaults, options || {} ) );
			this.data( namespace, instance );
		}

		return instance;
	};

	$.fn.tree.defaults = {

		rootIds         : "",

		parentKey       : "parentId",
		textKey         : "text",
		valueKey        : "value",

		onSelect        : $.noop,

		/** Start with collapsed menu( only level 1 items visible ) */
		collapsed       : true,

		/** Close element on same level when open new node */
		closeSameLevel  : false,

		/** Animation duration should be tweaked according to easing */
		duration        : 150,

		/** Same to input placeholder */
		placeholder     : "Type for search...",

		selector4content: ".content",
		selector4filter : "input[name=filter]",

        /** Local array or return a promise */
		data            : undefined,

		filter          : {},

		formatter       : function( item, level, settings ) {
			return "<p style='padding-left: " + ((level - 1) * 2) + "em;'><i class='icon'></i><span>" + item[ settings.textKey ] + "</span></p>";
		}
	};
} )( window.jQuery );

