
define( function() {
	
	var 
	storageName = "sessionStorage",

	isSupport = (function() {
		
		try {
			return (storageName in window && window[storageName]);
		} catch( e ) { return false; }
	})(),

	serialize = function( value ) {
		
		return JSON.stringify( value || "" );
	},

	deserialize = function( value ) {
		
		if ( "string" !== typeof value ) {
			
			return value;
		}

		try {
			return JSON.parse( value );
		} catch( e ) { return value || ""; }
	},

	store = {
		
		/**
		 * sessionStorage or localStorage
		 *
		 * @param name 		String
		 * */
		use: function( name ) {},

		/**
		 * Add an item
		 *
		 * @param key 		String
		 * @param value 	String
		 * @param [scope] 	Boolean
		 * */
		set: function( key, value, scope ) {},

		/**
		 * Get an item by key
		 *
		 * @param key 		String
		 * @param [scope] 	Boolean
		 * */
		get: function( key, scope ) {},

		/** Get all */
		all: function() {},

		/** 
		 * Foreach the storage
		 *
		 * @param callback 	Function
		 * */
		foreach: function( callback ) {},

		/**
		 * Remove from storage
		 *
		 * @param key 		String
		 * */
		remove: function( key ) {},

		/** Remove all */
		clear: function() {}
	},
	
	_storage;

	if ( isSupport ) {
		
		_storage = window[ storageName ];

		store.use = function( name ) {
			
			name &&
				({ "sessionStorage": 1, "localStorage": 1 }).hasOwnProperty( name ) &&
				(_storage = window[ name ]);

			return this;
		};

		store.get = function( key, scope ) {
			
			this.use( scope === true ? "localStorage" : "sessionStorage" );

			return deserialize( _storage[ key ] );
		};

		store.set = function( key, value, scope ) {
			
			this.use( scope === true ? "localStorage" : "sessionStorage" );

			return (_storage[ key ] = serialize( value ));
		};

		store.foreach = function( callback ) {
			
			var key;

			for ( var i = _storage.length; --i >= 0; ) {
				
				key = _storage.key( i );

				callback( key, deserialize( _storage[ key ] ) );
			}
		};

		store.all = function( scope ) {
			
			var result = {};

			this.use( scope === true ? "localStorage" : "sessionStorage" );	

			this.foreach( function( key, value ) {
				
				result[ key ] = value;
			} );

			return result;
		};

		store.remove = function( key, scope ) {
		
			this.use( scope === true ? "localStorage" : "sessionStorage" );	
			_storage.removeItem( key );
		};

		store.clear = function( scope ) {

			this.use( scope === true ? "localStorage" : "sessionStorage" );	
			_storage.clear();
		};
	}

	return store;
} );

