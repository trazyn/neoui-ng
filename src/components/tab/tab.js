
define( [ "ui/lavalamp/lavalamp", "ui/ripple/ripple" ], function() {

    "use strict";

    var
    namespace = "$ui.tab",

    Tab = function( target, settings ) {

        var
        instance = this,

		/** Recent actived item */
		currentNav, currentTab;

		this.settings = settings;
		this.$node = target;

		this.$navs = target.find( "> .md-tab-nav > .md-tab-nav-item" );
		this.$tabs = target.find( "> .md-tab-content > .md-tab-content-item" );

        /**
         * Set current tab
         * Priority:
         *  .selected > settings.selected > :first
         * */
		currentNav = this.$navs.filter( ".md-tab-selected:first" );
		if ( currentNav.length ) {

		    if ( settings.selected !== undefined ) {
		        currentNav = this.$navs.filter( "[" + settings.rule + "=" + settings.selected + "]" );
		    } else {
                currentNav = this.$navs.first();
		    }
		    currentNav.addClass( "md-tab-selected" );
		}

		currentTab = this.$tabs.filter( "[" + settings.rule + "=" + currentNav.attr( settings.rule ) + "]" ).addClass( "md-tab-selected" );

		this.$navs.not( currentNav ).removeClass( "md-tab-selected" );
		this.$tabs.not( currentTab ).removeClass( "md-tab-selected" );

        /** After the tab has rendered */
        setTimeout( function() {

            var options = {
                selector4item   : ".md-tab-nav-item",
                selector4current: ".md-tab-selected",
                indicator       : "<div class='md-tab-indicator' />",
                holdByClick     : false,
                animation       : settings.duration
            };

            if ( settings.lavalamp ) {
                instance.lavalamp = target.find( "> .md-tab-nav" ).lavalamp( options );
            }
        }, 300 );

        if ( settings.ripple ) {
            this.$navs.each( function() {
                $( this ).addClass( "md-ripple" ).ripple( settings.ripple );
            } );
        }

        target
        .delegate( ".md-tab-menu.md-dropdown", "click", function( e ) {

            var
            dropdown = $( this ).dropdown( {
                onSelect: function( item ) {
                    instance.active( item.value );
                }
            } ),
            list = [],
            selected;

            instance.$navs.each( function() {

                var
                self = $( this ),
                text = self.text().trim();

                list.push( {
                    text: text,
                    value: self.attr( "data-index" ),
                    disabled: self.is( "[disabled]" )
                } );

                if ( self.hasClass( "md-tab-selected" ) ) {
                    selected = list[ list.length - 1 ];
                }
            } );

            dropdown
            .render( list )
            .val( selected )
            .open();
        } )
		.delegate( ".md-tab-nav-item", "click", function( e ) {

			var
			self = $( this ),
			tab,

			/** Show page after the ajax has been completed */
			startup,
			index = self.attr( settings.rule ),

			/** Loaded page via ajax */
			page = self.attr( "data-page" ),

			dispatch = function() {

				var onSelect = settings.onSelect || {};

				if ( "function" === typeof onSelect
					|| typeof (onSelect = onSelect[ index ]) === "function" ) {

                    /** Wait angularjs digest(), use setTimeout() reduce the execution priority */
                    setTimeout( function() {
                        onSelect.call( self, tab, settings );
                    } );
				}
			},

			finish = function() {

				if ( tab.length ) {

					tabs.length
						? tabs.last().after( tab )
						: target.find( "> .md-tab-content" ).append( tab )
						;

					instance.$tabs = tabs = tabs.add( tab );
					instance.active( startup );
				}
			},

			focus = function() {

			    var
			    scroller = self.parent(),
			    offset = self.offset().left - scroller.offset().left + self.width();

                scroller.scrollLeft( offset );
			},

			/** Shortcuts */
			navs = instance.$navs,
			tabs = instance.$tabs,
			class4success = settings.class4success, class4error = settings.class4error, class4loading = settings.class4loading;

            if ( self.is( "[disabled]" ) || self.hasClass( "md-tab-selected" ) ) {

                e.stopImmediatePropagation();
                e.preventDefault();
                return;
            }

			if ( !self.hasClass( "md-tab-selected" ) && index !== undefined ) {

				tab = tabs.filter( "[" + settings.rule + "=" + index + "]:first" );

				/** Has been loaded */
				if ( tab.length ) {

					/** Clear the queue */
					startup = undefined;

					currentNav && currentNav.removeClass( "md-tab-selected" );
					currentNav = self.removeClass( class4success ).addClass( "md-tab-selected" );

					if ( currentTab ) {
						currentTab.removeClass( "md-tab-selected" );
					}

                    /** Set animation direction */
					if ( currentTab.nextAll().index( tab ) !== -1 ) {
					    tab.removeClass( "md-tab-right" ).addClass( "md-tab-left" );
					} else tab.removeClass( "md-tab-left" ).addClass( "md-tab-right" );

                    focus();

					currentTab = tab.addClass( "md-tab-selected" );
                    settings.lavalamp && instance.lavalamp && instance.lavalamp.hold( self );
					dispatch( index, tab, settings );
					return;
				}

                /** Lazy load */
				if ( instance.render && instance.render[ index ] ) {

					var
					render = instance.render[ index ];

					startup = index;
					delete instance[ "render" ][ "index" ];

					tab = $( "<div class='md-tab-content-item' " + settings.rule + "='" + index + "'>" )
						.attr( settings.rule, index )
						.html( typeof render === "string" ? render : render.call( self, settings ) );
				}

				/** Do Ajax call */
				else if ( page = page && page.replace( /^\s+|\s+$/g, "" ), page ) {

					if ( self.hasClass( class4loading ) ) {
						startup = index;
					} else {

						$.ajax( {
							url: page,
							dataType: "html"
						} )
						.done( function( responseText ) {

							tab = $( "<div class='md-tab-content-item'>" ).attr( settings.rule, index ).html( responseText );
							self.removeClass( class4loading ).addClass( class4success );
                            finish();
						} )
						.fail( function( xhr ) {
							self.removeClass( [ class4loading, class4success ].join( " " ) ).addClass( class4error );
							tab = $( "<div class='md-tab-content-item md-tab-fail'>" ).attr( settings.rule, index ).html(
							        "<h5>Faild to load: </h5>'" + page + "'" +
							        "<blockquote>" + xhr.statusText + "</blockquote>"
							        );
							finish();
						} );

                        startup = index;
                        self.removeClass( class4error + " " + class4success ).addClass( class4loading );
					}
				} else
				/** Invalid tab */
				self.removeClass( [ class4loading, class4success ].join( " " ) ).addClass( class4error );

                finish();
			}
		} );
    };

	Tab.prototype = {

		add: function( items ) {

			var

			navs = this.$navs, tabs = this.$tabs,
			settings = this.settings,

			/** Active the tab */
			actived;

			items = items instanceof Array ? items : [ items ];

			for ( var i = 0, length = items.length; i < length; ++i ) {

				var item = items[ i ];

				if ( item.index &&
						/** Duplicate */
						!navs.filter( "[" + settings.rule + "=" + item.index + "]" ).length ) {

					var nav = $( [ "<div class='md-tab-nav-item' ", settings.rule, "='", item.index, "'>",
							item.name || item.index,
							"</div>" ].join( "" ) );

					item.page && nav.attr( "data-page", item.page );

					if ( "string function".indexOf( typeof item.render ) > -1 ) {

						if ( item.immediate ) {
							var
							tab,
							html = "",
							render = item.render;

							html = typeof render === "string" ? render : render.call( nav, settings );

							tab = $( "<div class='md-tab-content-item' " + settings.rule + "='" + item.index + "'>" ).html( html );

							tabs.length
								? tabs.last().after( tab )
								: this.$node.find( "> .md-tab-content" ).append( tab )
								;

							tabs = this.$tabs = tabs.add( tab );
						} else {

							(this.render = this.render || {})

								/** Render tab content by HTML string or a function */
								[ item.index ] = item.render;
						}
					}

					/** Render the content by an ajax call */
					else if ( item.page ) {
						nav.attr( "data-page", item.page );
					}

					/** Update index */
					if ( !navs.length ) {
						this.$node.find( "> .md-tab-nav" ).append( nav );
					} else {
						navs.last().after( nav );
					}

					navs = this.$navs = navs.add( nav );

                    /** Add ink ripple effect */
					settings.ripple && nav.ripple( settings.ripple );

                    /** Set the default selected */
					if ( settings.selected == item.index ) {
					    item.actived = true;
					}

					/** Set startup tab */
					actived = item.actived ? item.index : actived;
				}
			}

			actived && this.active( actived );

			return this;
		},

		remove: function( index ) {

			var
			settings = this.settings,
			navs = this.$navs,
			tabs = this.$tabs,

			selector;

            selector = "[" + settings.rule + "=" + index + "]";

            if ( index ) {

                navs.add( tabs ).filter( selector ).remove();

                index = navs.index( navs.filter( selector ) );
                navs.splice( index, 1 );
                /** Content can be lazy load, so they have different index value */
                index = tabs.index( tabs.filter( selector ) );
                tabs.splice( index, 1 );

                this.render && (delete this.render[ index ]);
                this.active( navs.last().attr( settings.rule ) );
            }

            return this;
		},

		getTab: function( index ) {

			var settings = this.settings;

            if ( index ) {
                return this.$tabs.filter( "[" + settings.rule + "=" + index + "]" );
            } else {
                return this.$tabs.filter( "div.md-tab-selected" );
            }
		},

		active: function( index ) {

			var
			nav,
			settings = this.settings;

            nav = this.$navs.filter( "[" + settings.rule + "='" + index + "']" ).trigger( "click" );
			return this;
		},

		isActive: function( index ) {

			var settings = this.settings;
            return this.$navs.filter( "[" + settings.rule + "=" + index + "]" ).is( ".md-tab-selected" );
		},

		disabled: function( indexes ) {

		    var
		    navs = this.$navs,
		    settings = this.settings;

		    if ( indexes ) {
		        indexes = indexes instanceof Array ? indexes : [ indexes ];
		        while ( indexes.length ) {
		            navs.filter( "[" + settings.rule + "=" + indexes.pop() + "]" ).attr( "disabled", true );
		        }
		    } else {
		        navs.attr( "disabled", true );
		    }

		    return this;
		},

		enabled: function( indexes ) {

		    var
		    navs = this.$navs,
		    settings = this.settings;

		    if ( indexes ) {

                var i, nav;

		        indexes = indexes instanceof Array ? indexes : [ indexes ];

		        while ( indexes.length ) {

                    i = indexes.pop();
		            nav = navs.filter( "[" + settings.rule + "=" + i + "]" );
		            if ( nav.is( "[disabled]" ) ) {
		                nav.removeAttr( "disabled" );
                        this.active( i );
		            }
		        }
		    } else {
		        navs.removeAttr( "disabled" );
		    }
		    return this;
		}
	};

	$.fn.tab = function( options ) {

		var instance = this.data( namespace );

		if ( !instance ) {
			instance = new Tab( this, $.extend( {}, true, $.fn.tab.defaults, options || {} ) );
			this.data( namespace, instance );
		}
		return instance;
	};

	$.fn.tab.defaults = {

		rule 		    : "data-index",
		class4loading 	: "md-tab-sync",
		class4error 	: "md-tab-error",
		class4success 	: "md-tab-success",

		selected        : 0,

		ripple          : {
		    duration    : 800
		},
		lavalamp 	    : true
	};
} );
