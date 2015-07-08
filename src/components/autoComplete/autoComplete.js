
;(function( $, undefined ) {

	"use strict";

	var

	namespace = "$ui.autoComplete",

	AutoComplete = function( ele, settings ) {

		var
		  self = this,

		  /** Cache the matched result */
		  cache = {},

		  /** Current input value */
		  query,

		  /** Current suggestion item */
		  suggestion,

		  /** The raw data */
		  data,

		  /** Loading, error, success */
		  indicator,

		  /** Front input */
		  fg,

		  /** Backend input */
		  bg;

		this.$node = ele;
		this.settings = settings;
		this.list = $( "<div tabindex=-1 style='position: absolute; outline: 0;' class='" + settings.class4list + "'>" ).appendTo( ele );

		function setupCache( key, data ) {

		    if ( key ) {
                cache[ settings.fuzzy ? key.toLowerCase() : key ] = data;
		    } else {
		        /** Clean the cache */
		        cache = {};
		    }
		}

		function fromCache( key ) {
            return cache[ settings.fuzzy ? key.toLowerCase() : key ];
		}

		function highlight( text, query ) {

		    var
		    regex = {
		        "^": new RegExp( "^" + query, "i" ),
		        "*": new RegExp( query, "ig" ),
		        "$": new RegExp( query + "$", "i" )
		    }[ settings.localMatch ];

            if ( regex && settings.highlight ) {
                return text.replace( regex, "<span class='" + settings.class4highlight + "'>" + query + "</span>" );
            }

            return text;
		}

		function suggest( force ) {

			var keyCode;

			self.stopSuggest();

			if ( window.event ) {
				keyCode = window.event.keyCode;
			}

			if ( settings.delimiter &&
				(keyCode === undefined
					? fg.value && settings.delimiter === fg.value.substr( -1 )
					: keyCode === settings.delimiter.charCodeAt()) ) {

				if ( data && data.length === 1 ) {

					var
					  match = new RegExp( settings.delimiter + "?([^" + settings.delimiter + "]*)" + settings.delimiter + "$" ).exec( fg.value ),
					  value = match && match[ 1 ];

					if ( value && value.toLowerCase() === data[ 0 ][ settings.textKey ][ "toLowerCase" ]() ) {
						setupCache( value, data );
					}
				}
				return;
			}

			settings.timer = setTimeout( function post() {

				var
				  value = fg.value,
				  currentValue = value ? value.replace( new RegExp( "^.{1,}" + settings.delimiter + "", "g" ), "" ) : "",

				  showSuggestion = function() {

					  if ( data.length ) {

						  /** Cache current result */
						  setupCache( query, data );

						  for ( var html = "", i = 0, length = data.length; i < length; ++i ) {

						      var
						        value = data[i][ settings.valueKey ],
						        text = data[i][ settings.textKey ] || value;

							  html += settings.formatter( value, text, data[i], i, highlight( text, query ), query, settings );
						  }

						  setbg();
						  self.list.html( "<ul>" + html + "</ul>" );

						  /** Only one result that just select it */
						  if ( 1 === data.length
							  && settings.autoSelect
							  && query.toLowerCase() === data[ 0 ][ settings.textKey ][ "toLowerCase" ]() ) {

								  select( data[ 0 ] );
								  return;
							  }
					  } else {
                          /** Invalid input, reset the component value */
					      $( fg ).trigger( "focusout" );
						  return finishSuggest();
					  }

					  self.list
					  .css( {
						  "top": fg.offsetHeight,
						  "left": 0,
						  "width": fg.offsetWidth
					  } )
					  .addClass( "show" );
				  };

				query = currentValue;

				if ( query.length >= settings.minChars ) {

					if ( !force ) {

						/** Try to get data from cache */
						data = fromCache( query ) || (function( key ) {

							var i = 0, res;

							while ( key = key.replace( new RegExp( ".{1}$" ), "" ), key ) {

								res = fromCache( key );
								if ( res && res.length < settings.breaksize ) {
									break;
								}
							}
							return res;
						})( query );
					} else {
						data = false;
					}

					if ( data && fromCache( query ) ) {
						showSuggestion();
					} else {

						filter.call( self, data, query, indicator )
							.done( function() {

								data = this.userData;

								/** Bind cache to DOM for debug */
								settings.cacheKey && ele.data( settings.cacheKey, cache );

								showSuggestion();
							} );
					}

				} else {
					bg.value = "";
					self.list.removeClass( "show" );
				}

			}, 100 );
		}

		function finishSuggest() {

			bg.value = "";
			self.stopSuggest();
			self.list.removeClass( "show" );
		}

		function setbg() {

			var prefix = fg.value.indexOf( "," ) !== -1 ? fg.value.replace( /\,[^,]+$/, " " ) : "";

			return query && (bg.value = prefix + data[ 0 ][ settings.textKey ][ "replace" ]( new RegExp( "^" + query, "i" ), query ));
		}

		function setfg( value ) {

			if ( fg.value.indexOf( settings.delimiter ) === -1 ) {
				return (fg.value = value);
			}

			return (fg.value = fg.value.replace( new RegExp( settings.delimiter + "[^+" + settings.delimiter + "]+$" ), "," ) + value);
		}

		function select( item, multiple ) {

			var value, index, valid = [];

			if ( !item ) { return; }

            value = ele.data( "data-value" );
            index = fg.value.toLowerCase().split( settings.delimiter ).lastIndexOf( item[ settings.textKey ][ "toLowerCase" ]() );

			if ( index !== -1 ) {

				query = item[ settings.textKey ];

				bg.value = fg.value = fg.value.replace( new RegExp( query, "i" ), query );

				/** Remove other suggestion */
				data = [ item ];

				value = value instanceof Array ? value : [];
				value.length = fg.value.split( settings.delimiter ).length;
				value[ index ] = item;
                value.forEach( function( v ) { valid.push( v ); } );
				ele.data( "data-value", valid );
			}

            /** When the input just focused, don't invoke the callbacks */
			if ( multiple || multiple === undefined ) {

				settings.set.call( ele, valid, settings );

				/** Remove other suggestion */
				self.list.find( "ul" ).html( suggestion.attr( "data-index", 0 ) );

				/** Cache this result for fast suggest */
				setupCache( query, data );

				finishSuggest();
			}
		}

		/** 'true': up, 'false': down */
		function move( current, direction ) {

			if ( data && !data.length
					|| (settings.ajax && settings.ajax.request && settings.ajax.request.state() === "pending") ) {
						return;
					}

			/** If just one item don't show the list */
			if ( 1 === data.length && settings.autoSelect
			    	&& fg.value.toLowerCase() === data[ 0 ][ settings.textKey ][ "toLowerCase" ]() ) { return; }

			bg.value = "";

			if ( !self.list.get( 0 ).parentNode ) {

				/** Show the result */
				setbg();
				return self.list.addClass( "show" );
			}

			var index, item;

			if ( current.length ) {
				suggestion = direction
                    ? current.prev()
                    : current.next()
                    ;

				suggestion.addClass( settings.class4selected );

				self.list.scrollTop( suggestion.attr( "data-index" ) * suggestion.height() );

				if ( suggestion.length ) {
					setfg( data[ suggestion.attr( "data-index" ) ][ settings.textKey ] );
					index = suggestion.attr( "data-index" );
				} else {
					setbg();
					setfg( query );
				}
			} else {
				self.list.find( direction ? "li:last" : "li:first" ).addClass( settings.class4selected );
				setfg( data[ index = (direction ? data.length - 1 : 0) ][ settings.textKey ] );
			}

			if ( index !== undefined ) {

				item = data[ index ];

				setupCache( item[ settings.textKey ][ "toLowerCase" ](), [ item ] );
			}
		}

		(fg = ele.find( settings.selector4input ), bg = fg.next(), fg)

			/** Prevent default event */
			.attr( "autocomplete", "off" )

			/** Keys navigation */
			.on( "keydown", function( e ) {

				var
				  keys = {
					  ESC: 27,
					  TAB: 9,
					  RETURN: 13,
					  UP: 38,
					  DOWN: 40
				  },

				  which = e.which;

				if ( ele.is( "[disabled]" ) ) { return; }

				switch ( true ) {

					case which === keys.DOWN || which === keys.UP || which === keys.RETURN || which === keys.TAB:
						var
						  hint = self.list.find( "li." + settings.class4selected ),
						  index = hint.attr( "data-index" );

						/** Reset current hint */
						suggestion = hint.removeClass( settings.class4selected );
						break;

					case which === keys.ESC || which === keys.RETURN || which === keys.TAB:
						finishSuggest();
						break;
				}

				switch ( which ) {

					case keys.DOWN:
						move( hint, 0 );
						break;

					case keys.UP:
						move( hint, 1 );
						break;

					case keys.ESC:
						setfg( query );
						break;

					case keys.RETURN:

						if ( index !== undefined ) {
							select( data[ index ] );
						} else {

							/** Reset query string */
							query = "";

							if ( settings.ajax && settings.ajax.enterforce ) {
								suggest( true );
							} else {
								finishSuggest();
							}
						}
						break;

					case keys.TAB:

						if ( settings.tabComplete ) {

							if ( data.length
									&& (fg.value.length && bg.value !== fg.value) ) {
										setfg( data[ 0 ][ settings.textKey ] );
										select( data[ 0 ] );

										e.preventDefault();
										e.stopPropagation();
									}
						}
						break;

					default:
						suggest();
				}
			} )

			/** Clear suggestion, apply value to component */
			.on( "focusout", function( e ) {

				var
				values = fg.value ? fg.value.split( settings.delimiter ) : 0,
				valid = [];

				e.preventDefault();
				e.stopPropagation();

				if ( e.relatedTarget === self.list[ 0 ] ) { return; }

                ele.removeData( "data-value" );

				if ( values.length ) {

                    for ( var i = 0, length = values.length; i < length; ++i ) {

                        var
                        value = values[ i ],
                        matched = fromCache( value );

                        if ( value
                                && matched
                                && matched.length === 1
                                && matched[0][ settings.textKey ] === value ) {
                            valid.push( value );
                        } else if ( settings.inputAnything === false ) {
                            indicator.addClass( settings.class4error );
                        }
                    }

                    if ( valid.length ) {
                        /** Set the value */
                        for ( var i = 0, length = valid.length; i < length; ++i ) {
                            select( fromCache( valid[i] )[0], i === length - 1 );
                        }
                    } else settings.set.call( ele, [], settings );
				} else {

                    /** Clear the component data */
				    settings.set.apply( ele, [ [], settings ] );
				}

				query = "";
				finishSuggest();
			} )

			/** Suggest current content */
			.on( "focus", function() {

                suggestion = self.list.find( "li:first" );
				indicator.removeClass( settings.class4error );
				suggest();
			} );

			fg = fg[ 0 ];
			bg = bg[ 0 ];

			indicator = self
				.$node
				.find( settings.selector4indicator )
				.on( "click", function( e ) {

					/** Clear the input value */
					if ( indicator.hasClass( settings.class4error ) ) {
						$( fg ).val( bg.value = "" ).trigger( "focusout" );
						indicator.removeClass( "error" );
					}
				} );

			self.list
				.delegate( "li", "click", function( e ) {

					var item = data[ this.getAttribute( "data-index" ) ];

                    if ( item ) {
                        setfg( item[ settings.textKey ] );
                        select( item );
                    }

					query = "";

					e.preventDefault();
					e.stopPropagation();
				} )

				.delegate( "li", "mouseout", function( e ) {

					suggestion.removeClass( settings.class4selected );

					e.preventDefault();
					e.stopPropagation();
				} )

				.delegate( "li", "mouseover", function( e ) {

					suggestion.removeClass( settings.class4selected );

					suggestion = $( this ).addClass( settings.class4selected );

					e.preventDefault();
					e.stopPropagation();
				} );

		fg.setAttribute( "placeholder", settings.placeholder );

		this.setupCache = setupCache;
		this.fromCache = fromCache;

		!settings.showHint && bg && (bg.style.display = "none");
	};

	function filter( data, query, indicator ) {

		var
		  self = this,
		  settings = this.settings,

		  res = [],

		  deferred,

		  regexs = {
			"^": "^${text}",
			"$": "${text}$",
			"*": "${text}"
		  },

		  ajax = settings.ajax,

	      request,

		  regex;

		if ( !data && settings.lookup && settings.lookup.length ) {
			res = res.concat( settings.lookup );
		}

		if ( !data && ajax ) {

			indicator.addClass( settings.class4loading );

			deferred = $.Deferred();

			request = ajax.request = ajax.dataProxy( query );

			request
                .then( function( data ) {

                    if ( "function" === typeof ajax.dataFilter ) {
                        data = ajax.dataFilter( data );
                    }
                    res = res.concat( data );
                    deferred.resolve();
                } )
                .done( ajax.done )
                .fail( ajax.fail )
                .always( ajax.always, function() { indicator.removeClass( settings.class4loading ); } );
		} else if ( data ) {
			res = res.concat( data );
		}

		if ( settings.localMatch instanceof RegExp ) {
			regex = settings.localMatch;
		} else {
			regex = new RegExp( (regexs[ settings.localMatch.toLowerCase() ] || regexs[ (settings.localMatch = "^") ]).replace( /\${text}/, query )
						, settings.fuzzy ? "i" : "");
		}

		return $.when( deferred || (deferred = $.Deferred().resolve()) ).done( function() {

			res = $.grep( res, function( item ) {
				return regex.test( item[ settings.textKey ] );
			} );

			this.userData = res;
		} );
	}

	AutoComplete.prototype = {

		disabled: function() {

			this.stopSuggest();
			this.$node.attr( "disabled", true );

			var
			settings = this.settings,
			input = this.$node.find( settings.selector4input );

            input.add( input.next() ).attr( "disabled", true );

			return this;
		},

		enabled: function() {

			var input = this.$node.find( this.settings.selector4input );
			input.add( input.next() ).removeAttr( "disabled" );
			return this;
		},

		stopSuggest: function() {

			var settings = this.settings;

			clearTimeout( settings.timer );

			settings.ajax && settings.ajax.request
				&& settings.ajax.request.abort();
			return this;
		},

		val: function( value ) {

			var
			settings = this.settings,
			text = [], dataValue = [];

			if ( value ) {

				value = value instanceof Array ? value : [ value ];

				for ( var i = 0, length = value.length; i < length; ++i ) {

					var v = value[i];

					text.push( v[ settings.textKey ] );
					dataValue.push( v[ settings.valueKey ] );

					this.setupCache( text[i], [v] );
				}

				this
				.$node
				.data( "data-value", value )
				.find( settings.selector4input ).val( text.join() );
				return this;
			} else
			return this.$node.data( "data-value" );
		}
	};

	$.fn.autoComplete = function( options ) {

		var instance = this.data( namespace );

		if ( !instance ) {
			instance = new AutoComplete( this, $.extend( {}, $.fn.autoComplete.defaults, options || {} ) );
			this.data( namespace, instance );
		}

		return instance;
	};

	$.fn.autoComplete.defaults = {

		delimiter 		    : ",",
		minChars 		    : 1,
		cacheKey 		    : "autoComplete-data",

		class4loading 		: "sync",
		class4error 		: "error",
		class4selected 		: "selected",
		class4highlight 	: "highlight",
		class4list 		    : "list",

		selector4input 		: "input:first",
		selector4indicator 	: ".icon:first",

		valueKey 		    : "value",
		textKey 		    : "text",

		breaksize 		    : 10,

		inputAnything 		: true,

		highlight 		    : false,

		showHint 		    : true,

		/** Case sensitive */
		fuzzy 			    : true,

		/** 'first', 'contains', 'last' */
		localMatch 		    : "^",

		autoSelect 		    : false,
		tabComplete 		: true,

		placeholder         : "",

		/** Local data */
		lookup 			    : [],

		set                 : $.noop,

		/** From service */
		ajax 		        : undefined,

		formatter: function( value, text, item, index, highlightText, query, settings ) {

			return settings.highlight
				? "<li value='" + value + "' data-index='" + index + "'>" + highlightText + "</li>"
				: "<li value='" + value + "' data-index='" + index + "'>" + text + "</li>"
				;
		}
	};
})( window.jQuery );
