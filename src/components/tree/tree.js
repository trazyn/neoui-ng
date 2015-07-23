
(function( $ ) {

    "use strict";

	var
	namespace = "$ui.tree",

	Tree = function( target, settings ) {
		var
		selected,
        self = this,
		cache = [],
        inHandle = false,
        delay = settings.duration + 100;

		target
        .undelegate( "li[data-level]", "click" )
        .delegate( "li[data-level]", "click", function( e ) {

            var hash = settings.hash;

            e.stopPropagation();
            e.preventDefault();

            if ( !inHandle ) {

                var
                self = $( this ),
                level = +self.attr( "data-level" ),
                duration = settings.duration,
                operation = self.hasClass( "open" ) ? function() { close( self, duration ); } : function() { open( self, duration ); };

                inHandle = 1;

                if ( settings.closeSameLevel ) {

                    var
                    recent = cache[ level ];

                    cache[ level ] = self;
                    recent && recent.get( 0 ) !== this && close( recent );
                }

                if ( !self.hasClass( "node" ) || $( e.target ).is( "span" ) ) {

                    selected && selected.removeClass( "selected" );
                    selected = self.addClass( "selected" );

                    settings.onSelect.call( self, e, hash[ self.attr( "data-key" ) ], hash, level );
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

		target
		.find( settings.selector4filter )
		.attr( "placeholder", settings.placeholder )
		.on( "keyup", function( e ) {
            self.filter( this.value );
		} );

        self.$node = target;
		self.settings = settings;
		self.render( settings.data );
	};

	Tree.prototype = {

        render: function( data ) {

            var
            deferred,
            self = this,
            settings = this.settings;

            if ( typeof data === "function" ) {
                deferred = data();
            }

            $.when( deferred ).done( function() {

                var node = $( "<ul>" );

                data = data && (data instanceof Array ? data : this);

                if ( data ) {

                    settings.hash = {};

                    /** Use '[].concat()' get data copy */
                    settings.data = ([].concat( data ));
                    renderTree( node, data, settings, true );
                    self.$node.find( settings.selector4content ).html( node.html() );
                }
            } );
        },

        add: function( item ) {

            var
            $node = this.$node,
            settings = this.settings,
            parentId = item[ settings.parentKey ],
            node = $node.find( "[data-key='" + parentId + "']" );

            /** Add data memory */
            settings.data.push( item );

            /** After the angularjs $apply() */
            setTimeout( function() {
                /** Generate the dom */
                renderTree( node, item, settings, false );

                /** Add child to sington node */
                node.hasClass( "node" ) || node.addClass( "node close" );

                /** Sington node */
                node.find( "[data-key='" + item[ settings.valueKey ] + "']" ).removeClass( "node" );

                /** Expand the parent */
                open( node, settings.duration );
            } );
        },

        remove: function( nodeid ) {

            var
            settings = this.settings,
            index = settings.data.indexOf( settings.hash[ nodeid ] ),
            node = this.$node.find( "[data-key='" + nodeid + "']" ),
            parentNode = node.parents( ".node:first" );

            settings.data.splice( index, 1 );
            delete this.settings.hash[ nodeid ];

            node.remove();
            if ( !parentNode.find( "[data-key]" ).length ) {
                parentNode.removeClass( "node open close" );
            }
        },

        toggle: function( nodeid ) {

            var
            duration = this.settings.duration,
            node = this.$node.find( ".node[data-key='" + nodeid + "']" );

            (node.hasClass( "open" ) ? close : open)( node, duration );
        },

		collapse: function( nodeid ) {
            close( this.$node.find( ".node[data-key='" + nodeid + "']" ), this.settings.duration );
		},

        expand: function( nodeid ) {
            open( this.$node.find( ".node[data-key='" + nodeid + "']" ), this.settings.duration );
        },

        filter: function( text ) {

            var
            self = this,
            $node = self.$node,
            settings = self.settings;

            self.filter.timer && clearTimeout( self.filter.timer );
            self.filter.timer = setTimeout( function() {

                var
                matched,

                /** Prevent multiple reflow */
                node = $node.css( "display", "none" ),
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
            }, 500 );
        }
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

	function renderTree( node, data, settings, recursion ) {

		var
		html = "",
		hash = settings.hash,
		key = node.attr( "data-key" ) || settings.rootIds,
		level = +node.attr( "data-level" ) || 0,
		filter = settings.filter[ level ] || function() { return true; };

		data = data instanceof Array ? data : [ data ];
		key = key instanceof Array ? key : [ key ];

		for ( var i = 0, length = data.length; i < length; ++i ) {

			var item = data[ i ];

			hash[ item[ settings.valueKey ] ] = item;

			/** Match undefined */
			if ( key[ 0 ] == (item[ settings.parentKey ] || "")
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

