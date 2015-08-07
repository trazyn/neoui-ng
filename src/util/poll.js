
(function( factory ) {

	if ( "function" === typeof define && define.amd ) {
		define( factory );
	} else {
		
		var exports = window || this;

		exports.Poll = factory();
	}
})( function() {

	"use strict";

	var 
	tasks = {},

	config = {

		interval: 5000,
		delay: false

		/** TODO: */
	},

	create = function( task ) {

		var 
		deferred = $.Deferred(),

		wait = function() {

			task.action( deferred );

			return deferred.promise();
		},
		
		runner = function() {
		
			return setTimeout( function() {

				$.when( wait() )

				.done( function() {

					/** Already removed */
					if ( void 0 === tasks[ task.name ] ) {

						/** Force to clean the queue of tasks */
						destory( task.name );

						return;
					}

					delete task.delay;

					/** Update the task */
					create( task );
				} )

				.fail( function() {

					destory( task.name );
				} );

			}, task.interval );
		};

		/** Apply the default configuration */
		task = $.extend( {}, config, task );

		task.name = task.name || "Task$" + Math.random().toString( 16 ).replace( /^0\./, "" );

		tasks[ task.name ] = {

			deferred: deferred,

			value: true === task.delay ? runner : runner()
		};

		return task.name;
	},

	destory = function( id ) {

		if ( id ) {

			var instance = tasks[ id ];

			if ( instance ) {
			
				clearTimeout( instance.value );

				delete tasks[ id ];
			}

		} else tasks = {};
	};

	return {

		/**
		 * Add a task and return the task id
		 *
		 * @param task 	Array/Object
		 * */
		add: function( task ) {

			var 
			register = function( task ) {

				return "function" === typeof task.action && create( task );
			},

			id, ids = [];

			if ( $.isArray( task ) ) {

				for ( var i = task.length; --i >= 0; ) {

					id = register( task[ i ] );

					id && ids.push( id );
				}

			} else (id = register( task )) && ids.push( id );

			return ids;
		},

		/**
		 * Start a task
		 *
		 * @param taskid 	String
		 * */
		start: function( taskid ) {
		
			var task = tasks[ taskid ];

			if ( task && "function" === typeof task.value ) {
				
				return task.value = task.value();
			}

			return 0;
		},

		/**
		 * Remove task
		 *
		 * @param [id] String, Without id will be remove all
		 * */
		remove: destory
	};
} );
