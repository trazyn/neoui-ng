
define( function() {

    var
    namespace = "$ui.pagination",

    Pagination = function( target, settings ) {

        var
        index = settings.index,
        max = settings.max;

        index = +index || 0;
        max = +max || index;

		/** Swap index and max */
		index > max && ( index ^= max, max ^= index, index ^= max );

        settings.index = index;
        settings.max = max;

        this.$node = target;
        this.settings = settings;

        render( target, settings );

        target
        .delegate( "[data-index]:not(.current)", "click", function( e ) {

            e.stopPropagation();
            e.preventDefault();

            settings.index = +this.getAttribute( "data-index" );
            settings.onPageChange( settings.index, settings );
            render( target, settings );
        } )

        .delegate( settings.selector4input, "keydown", function( e ) {

            if ( e.keyCode === 13 ) {
                $( this ).next().trigger( "click" );
            }
        } )

        .delegate( settings.selector4button, "click", function( e ) {

            var
            input = $( this ).prev(),
            value = +input.val();

            if ( value >= 1 && value <= settings.max ) {
                settings.index = value;
                settings.onPageChange( value, settings );
                render( target, settings );
            } else {
                input.select();
            }
        } );
    };

    function render( target, settings ) {

        var
        index = settings.index,
        max = settings.max,
		head = "",
		tail = "",
        page = [],
        content = target.find( settings.selector4content );

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

                page[i] = page[i] == index

                        ? "<span class=current>" + index + "</span>"
                        : "<a data-index='" + page[i] + "'>" + page[i] + "</a>"
                        ;
            } else
                page[i] = "<span class='normal'>...</span>";
        }

        /** Show PREV */
        index > 1 && page.unshift( $( "<a class='icon prev' data-index='" + (index - 1) + "'></a>" ) );

        /** Show NEXT */
        index < max && page.push( $( "<a class='icon next' data-index='" + (index + 1) + "'></a>" ) );

        content.html( page );
        target.find( settings.selector4input ).val( index );
    }

    Pagination.prototype = {
        val: function( value ) {

            var settings = this.settings;

            if ( !value ) {
                return settings.index;
            } else {
                settings.index = value;
                render( this.$node, settings );
            }
            return this;
        }
    };

    $.fn.pagination = function( options ) {

        var instance = this.data( namespace );

        if ( !instance ) {
            instance = new Pagination( this, $.extend( {}, $.fn.pagination.defaults, options ) );
            this.data( namespace, instance );
        }
        return instance;
    };

    $.fn.pagination.defaults = {
        index               : 1,
        max                 : 1,
        onPageChange        : $.noop,

        selector4content    : ".content",
        selector4input      : "input:text",
        selector4button     : "[name=go]"
    };
} );
