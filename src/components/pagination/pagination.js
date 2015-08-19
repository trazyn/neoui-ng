
define( function() {

	return function( target, index, max, callback ) {

		var
		page = [],

		head = "",
		tail = "",

		self = arguments.callee,

		goPage = function( idx ) {

			if ( (idx = +idx) > 0 && idx !== index && idx <= max ) {
				return self( target, idx, max, callback ), true;
			}

			return false;
		},

		render = function() {

			page = [];

			if ( max <= 7 ) {

				for ( var i = 1; i <= max; page += " " + i++ );
			} else {

				/** Need a head? */
				index - 3 > 2 && ( head = "1 2 ..." );

				/** Has tail? */
				index + 3 < max && ( tail = "..." );

				if ( head ) {
					max - index > 3 && page.push( index - 2, index - 1, index );
				} else
					for ( var i = index < 3 ? 6 : index + 3; --i >= 1; page.unshift( i ) );

				if ( tail ) {
					index > 5 && page.push( index + 1, index + 2 );
				} else
					for ( var i = max - (3 === max - index ? 6 : 5); ++i <= max; page.push( i ) );

				page.unshift( head );
				page.push( tail );
			}

			/** Trim the blank item */
			page = ($.isArray( page ) ? page : [page]).join( " " ).replace( /^\s+|\s$/g, "" ).split( " " );

			for ( var i = 0, length = page.length; i < length; ++i ) {

				if ( +page[i] ) {
					page[i] = page[i] == index ? "<span class=current>" + index + "</span>" :

						$( "<a>" ).html( page[i] ).click( function() { goPage( this.innerHTML ); } );
				} else
					page[i] = "<span class='normal'>...</span>";
			}

			/** Show PREV */
			index > 1 && page.unshift( $( "<a>" ).html( "«" ).click( function() { goPage( index - 1 ); } ) );

			/** Show NEXT */
			index < max && page.push( $( "<a>" ).html( "»" ).click( function() { goPage( index + 1 ); } ) );

			page.push( "<span class='normal'>跳转至</span> <input maxleng=4 type='text' /><span name='go'>GO</span>" );
			target.html( page ).find( ":text:first" ).val( index );
		};

		if ( !target || 0 === (target = $( target )).length ) {
			return;
		}

		if ( "function" === typeof index ) {

			callback = index;
			index = 1;
			total = 1;
		}

		index = +index || 1;
		max = +max || index;

		/** Swap index and max */
		index > max && ( index ^= max, max ^= index, index ^= max );

		render();

		target
		.undelegate( ":text", "keydown" )
		.delegate( ":text", "keydown focusout", function( e ) {

			var value = this.value;

			if ( isNaN( value ) || value < 0 ) {
				return this.select();
			}

			13 === e.keyCode && goPage( value );
		} )
		.undelegate( "span[name=go]", "click" )
		.delegate( "span[name=go]", "click", function( e ) {
			goPage( $( this ).prev( ":text" ).val() );
		} );

		/** After draw the pagination, invoke the callback */
		"function" === typeof callback
			&& callback.call( {
				setPageCount: function( pageCount, refresh ) {
					max = pageCount;
					!!refresh && render();
				}
			}, index, max );
	};
} );
