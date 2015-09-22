
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

            var
            self = $( this ),
            hash = settings.hash;

            e.stopPropagation();
            e.preventDefault();

            if ( !inHandle && !self.is( "[disabled]" ) ) {

                var
                level = +self.attr( "data-level" ),
                duration = settings.duration,
                operation = self.hasClass( "md-tree-open" ) ? function() { close( self, duration ); } : function() { open( self, duration ); };

                inHandle = 1;

                if ( settings.closeSameLevel ) {

                    var
                    recent = cache[ level ];

                    cache[ level ] = self;
                    recent && recent.get( 0 ) !== this && close( recent );
                }

                if ( !self.hasClass( "md-tree-node" ) || $( e.target ).is( "span" ) ) {

                    selected && selected.removeClass( "selected" );
                    selected = self.addClass( "selected" );

                    settings.onSelect( {
                        item: hash[ self.attr( "data-key" ) ],
                        level: level
                    } );
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

            $.when( deferred ).done( function( result ) {

                var node = $( "<ul>" );

                if ( result instanceof Array ) {
                    data = result;
                }

                data = data && (data instanceof Array ? data : this);

                if ( data ) {

                    settings.hash = {};

                    /** Use '[].concat()' get data copy, used by text filter */
                    settings.data = ([].concat( data ));
                    renderTree( node, data, settings, true );
                    self.$node.html( node.html() );
                }
            } );

            return this;
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
                node.hasClass( "md-tree-node" ) || node.addClass( "md-tree-node md-tree-close" );

                /** Sington node */
                node.find( "[data-key='" + item[ settings.valueKey ] + "']" ).removeClass( "md-tree-node" );

                /** Expand the parent */
                open( node, settings.duration );
            } );

            return this;
        },

        remove: function( nodeid ) {

            var
            settings = this.settings,
            index = settings.data.indexOf( settings.hash[ nodeid ] ),
            node = this.$node.find( "[data-key='" + nodeid + "']" ),
            parentNode = node.parents( ".md-tree-node:first" );

            settings.data.splice( index, 1 );
            delete this.settings.hash[ nodeid ];

            node.remove();
            if ( !parentNode.find( "[data-key]" ).length ) {
                parentNode.removeClass( "md-tree-node md-tree-open md-tree-close" );
            }

            return this;
        },

        toggle: function( nodeid ) {

            var
            duration = this.settings.duration,
            node = this.$node.find( ".md-tree-node[data-key='" + nodeid + "']" );

            (node.hasClass( "md-tree-open" ) ? close : open)( node, duration );

            return this;
        },

		collapse: function( nodeid ) {
            close( this.$node.find( ".md-tree-node[data-key='" + nodeid + "']" ), this.settings.duration );
            return this;
		},

        expand: function( nodeid ) {
            open( this.$node.find( ".md-tree-node[data-key='" + nodeid + "']" ), this.settings.duration );
            return this;
        },

        disabled: function( nodeid ) {

            var
            $node = this.$node,
            nodeid = nodeid instanceof Array ? nodeid : [ nodeid ];

            for ( var i = 0, length = nodeid.length; i < length; ++i ) {
                $node
                .find( ".md-tree-node[data-key='" + nodeid[i] + "']" )
                .attr( "disabled", "disabled" )
                .find( "li[data-key]" )
                .attr( "disabled", "disabled" );
            }
            return this;
        },

        enabled: function( nodeid ) {

            var
            $node = this.$node,
            nodeid = nodeid instanceof Array ? nodeid : [ nodeid ];

            for ( var key = nodeid.pop(); key; ) {
                $node
                .find( ".md-tree-node[data-key='" + key + "']" )
                .removeAttr( "disabled" )
                .find( "li[data-key]" )
                .removeAttr( "disabled" );
            }
            return this;
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
                lis = node.find( "li[data-filter]" ).not( "li[data-key][disabled]" ).css( "display", "" );

                /** Close all parent node */
                lis.filter( "li.md-tree-open" ).each( function() {
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

            return this;
        }
	};

	function close( target, duration ) {

        var post = function() {
            $( this ).css( "display", "" ).parent().removeClass( "md-tree-open" ).addClass( "md-tree-close" ).css( "display", "" );
        };

        /** Close all the children */
        if ( target.hasClass( "md-tree-open" ) ) {

            if ( duration ) {
                target.find( "ul[style='display: block;']" )

                .each( function() {

                    var self = $( this );

                    if ( !self.parent().is( "[disabled]" ) ) {
                        self.slideToggle( duration, function() {
                            post.call( this );
                        } );
                    }
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

        if ( target.hasClass( "md-tree-close" ) ) {

            target.find( "ul:first" ).slideToggle( duration || 0, function() {
                target.removeClass( "md-tree-close" ).addClass( "md-tree-open" );
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

                    html += "<li class='md-tree-node " + (settings.collapsed ? "md-tree-close" : "md-tree-open") +
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
            node.removeClass( "md-tree-node md-tree-open md-tree-close" );
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

		onSelected      : $.noop,

		/** Start with collapsed menu( only level 1 items visible ) */
		collapsed       : true,

		/** Close element on same level when open new node */
		closeSameLevel  : false,

		/** Animation duration should be tweaked according to easing */
		duration        : 150,

        /** Local array or return a promise */
		data            : undefined,

		filter          : {},

		formatter       : function( item, level, settings ) {
			return "<p style='padding-left: " + ((level - 1) * 2) + "em;'><i class='md-icon'></i><span>" + item[ settings.textKey ] + "</span></p>";
		}
	};
} )( window.jQuery );

