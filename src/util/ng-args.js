
define( [], function() {

    function args( $scope, $attrs, types ) {

        var
        options = {},
        isolateBindings = $scope.$$isolateBindings;

        for ( var key in isolateBindings ) {

            var
            attr = isolateBindings[ key ],
            type;

            if ( attr.attrName in $attrs.$attr ) {

                if ( type = types[ key ], type ) {
                    options[ key ] = args[ type ]( $scope[ key ] );
                } else
                    options[ key ] = $scope[ key ];
            }
        }

        return options;
    }

    args.boolean = function( value ) {
        return [ "true", "1" ].indexOf( (value || "").toString() ) > -1;
    };

    args.int = function( value ) {
        return +value;
    };

    args.date = function( value ) {

        var date = new Date( value );

        if ( isNaN( +date ) ) {
            return new Date();
        }
    };

    args.string = function( value ) {
        return (value || "") + "";
    };

    args.json = function( value ) {
        try {
            return JSON.parse( value );
        } catch( ex ) {
            return {};
        }
    };

    /** Get the arguments definition */
    return args;
} );
