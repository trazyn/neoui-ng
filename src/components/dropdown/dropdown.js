
define( [ "ui/ripple/ripple" ], function() {

	"use strict";

	var
	namespace = "$ui.dropdown",

	Dropdown = function( target, settings ) {

		var
		self = this,

		/** Shortcutts */
		title,
		content;

		target = $( target ).attr( "tabindex", 1 );

		this.$node = target;
		this.settings = settings;

		title = target.find( settings.selector4title ).html( settings.nothing );
		content = target.find( settings.selector4content );

		target
		.on( "focusout", function( e, immediate ) {
			setTimeout( function() {
                if ( immediate ||
                        (!target.is( ":focus" ) && !content.is( ":focus" )) ) {
                    target.removeClass( "open" );
                }
			}, 300 );
		} )

		/** Update the text */
		.on( "update.dropdown", function( e ) {

			var
			text = [],
			lis = content.find( "li.selected" );

			for ( var i = 0; i < lis.length; text.push( settings.data[ lis.eq( i++ ).attr( "data-index" ) ][ settings.textKey ] ) );

			text = text.join( "," ) || settings.nothing;

			title
			.html( text )
			.attr( "title", text );

            if ( settings.autoWidth ) {
                content
                .css( {
                    "width": target.width(),
                    "display": "block"
                } );
            } else {
                content.css( "display", "" );
            }
		} )

		/** Show the content */
		.delegate( settings.selector4title, settings.type, function( e ) {

            var
            deferred,
            data = settings.data;

            if ( target.is( "[disabled]" ) || target.hasClass( settings.class4loading ) ) {
                return;
            }

            if ( data instanceof Array ) {

                if ( !target.hasClass( "open" ) ) {
                    target
                    .addClass( "open" )
                    .focus();
                }
                return;
            }

            /** Ajax loading */
            deferred = (data || $.noop)();

            target.addClass( settings.class4loading );

            $.when( deferred ).done( function( result ) {

                if ( result instanceof Array ) {
                    data = result;
                } else if ( this instanceof Array ) {
                    data = this;
                } else {
                    throw new Error( "Invalid data" );
                }

                settings.data = data;
                renderList( target.find( settings.selector4content ), settings );
                target.addClass( "open" );
            } )

            .fail( function() {
                target.addClass( settings.class4error );
            } )

            .always( function() {
                target.removeClass( settings.class4loading );
            } );
		} )

		/** Select an item */
		.delegate( "li", "select.dropdown", function() {

			var self = $( this );

			if ( false === settings.multiple ) {
				content.find( "li.selected" ).removeClass( "selected" );
			}

			self.addClass( "selected" );
		} )

		/** Deselect */
		.delegate( "li", "deselect.dropdown", function() {

			var self = $( this );

			if ( true === settings.required
				&& self.hasClass( "selected" )
				&& content.find( "li.selected" ).length === 1 ) {

				return;
			}

			self.removeClass( "selected" );
		} )

		/** Item toggle */
		.delegate( "li", "click toggle", function( e ) {

			var
			item = $( this ),
            selected;

            if ( !item.is( "[disabled]" ) ) {

                selected = item.hasClass( "selected" );

                if ( selected ) {
                    item.trigger( "deselect.dropdown" );
                } else {
                    item.trigger( "select.dropdown" );
                }

                target.trigger( "update.dropdown" );

                settings.onSelect.call( item, settings.data[ item.attr( "data-index" ) ], settings );

                if ( settings.closeOnSelect ) {
                    target.trigger( "focusout", "Force close the dropdown~" );
                }
            }
		} );

		self.render( settings.data );
	};

	Dropdown.prototype = {

        render: function( data ) {

            var settings = this.settings;

            settings.data = data;

            if ( settings.data instanceof Array ) {
                renderList( this.$node.find( settings.selector4content ), settings );
            }
        },

		val: function( value ) {

			var
			settings = this.settings,
			res = [];

			if ( value ) {

				value = value instanceof Array ? value : [value];

				for ( var i = value.length; --i >= 0; ) {

					var
					item = this.$node.find( "ul li[data-value='" + value[ i ][ settings.valueKey ] + "']" );

					if ( item.length ) {
						item.trigger( "select.dropdown" );
						res.push( value[ i ][ settings.valueKey ] );
					}
				}
				this.$node.trigger( "update.dropdown" );
			} else {
				this.$node
					.find( "li.selected" )
					.each( function() {
						res.push( settings.valueKey ? this.getAttribute( "data-value" ) : settings.data[ this.getAttribute( "data-index" ) ] );
					} );
			}

			return res;
		},

		add: function( data ) {

			var
            settings = this.settings,
            data = settings.data.concat( data );

			this.settings.data = data;
			renderList( this.$node.find( settings.selector4content ), this.settings );
			return this;
		},

		selectAll: function() {

            var
            $node = this.$node,
            settings = this.settings,
            selected = $node.find( "ul li" );

            if ( settings.multiple ) {
                selected.addClass( "selected" );
            } else if ( !selected.filter( ".selected" ).length ) {
                selected.first().addClass( "selected" );
            }
            $node.trigger( "update.dropdown" );
            return this;
		},

		deselectAll: function() {
			this.$node.find( "ul li" ).removeClass( "selected" );
			this.$node.trigger( "update.dropdown" );
			return this;
		},

		disabled: function() {
			this.$node.attr( "disabled", true );
			return this;
		},

		enabled: function() {
			this.$node.removeAttr( "disabled" );
			return this;
		}
	};

	function renderList( content, settings ) {

		var
		lis = function() {

			var res = "";

			for ( var data = settings.data, i = 0, length = settings.data.length;
					i < length; ++i ) {

                var
                item = data[ i ],
				li = "<li data-value='" + item[ settings.valueKey ] + "' data-index='" + i + "' title='" + item[ settings.textKey ] + "'>" +
                        settings.formatter( item, settings ) +
                     "</li>";

				res += $( "<p>" ).append( $( li ).attr( "data-index", i ) ).html();
			}
			return res;
		}();

		content
        .css( "display", "none" )
		.html( "<ul>" + lis + "</ul>" )
		.trigger( "update.dropdown" );

		if ( settings.ripple ) {
		    content
		    .find( "> ul > li" ).
		    addClass( "ui ripple" ).each( function() {
		        $( this ).ripple();
		    } ).ripple();
		}
	}

	$.fn.dropdown = function( options ) {

		var instance = this.data( namespace );

		if ( !instance ) {
			instance = new Dropdown( this, $.extend( {}, $.fn.dropdown.defaults, options ) );
			this.data( namespace, instance );
		}

		return instance;
	};

	$.fn.dropdown.defaults = {

		nothing 	    : "Please select",
		selector4title 	: ".title:first",
		selector4content: ".content:first",

		class4loading   : "sync",
		class4error     : "error",

		type 	        : "click",

		multiple 	    : false,
		required 	    : false,

		data            : [],
		textKey 	    : "text",
		valueKey 	    : "value",

        ripple          : true,
		autoWidth       : false,
		closeOnSelect 	: true,
		onSelect        : undefined,

		formatter: function( item, settings ) {
			return "<span>" + (item[ settings.textKey ] || item[ settings.valueKey ]) + "</span>";
		}
	};
} );

