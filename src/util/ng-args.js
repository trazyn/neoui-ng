
define( [], function() {

    /** Get the arguments definition */
    return function( isolateBindings, $attrs ) {

        var options = {};

        for ( var key in isolateBindings ) {

            var attr = isolateBindings[ key ];

            if ( attr.attrName in $attrs.$attr ) {
                options[ key ] = $scope[ key ];
            }
        }

        return options;
    };
} );
