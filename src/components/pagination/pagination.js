
define( function() {

    var
    namespace = "$ui.pagination",

    Pagination = function( target, settings ) {

        var
        index = settings.index,
        total = settings.total;

        index = +index || 0;
        total = +total || index;

		/** Swap index and total */
		index > total && ( index ^= total, total ^= index, index ^= total );

        settings.index = index;
        settings.total = total;

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

        .delegate( settings.selector4jump, "click", function( e ) {

            var
            input = $( this ).prev(),
            value = +input.val();

            if ( value >= 1 && value <= settings.total ) {
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
        total = settings.total,
		head = "",
		tail = "",
        page = [],
        content = target.find( settings.selector4content );

        if ( total <= 7 ) {
            for ( var i = 1; i <= total; page += " " + i++ );
        } else {

            /** Need a head? */
            index - 3 > 2 && ( head = "1 2 ..." );

            /** Has tail? */
            index + 3 < total && ( tail = "..." );

            if ( head ) {
                total - index > 3 && page.push( index - 2, index - 1, index );
            } else
                for ( var i = index < 3 ? 6 : index + 3; --i >= 1; page.unshift( i ) );

            if ( tail ) {
                index > 5 && page.push( index + 1, index + 2 );
            } else
                for ( var i = total - (3 === total - index ? 6 : 5); ++i <= total; page.push( i ) );

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
        index < total && page.push( $( "<a class='icon next' data-index='" + (index + 1) + "'></a>" ) );

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
        total               : 1,
        onPageChange        : $.noop,

        selector4content    : ".content",
        selector4input      : "input:text",
        selector4jump       : "[name=go]"
    };
} );
