
(function( $ ) {

	var
	Anchor = function( target, settings ) {

		var
		current,
		mappings = {};

		target
		.find( settings.selector4anchor + "[" + settings.symbol + "]" )
		.filter( ".md-anchor [" + settings.symbol + "]" )
		.each( function() {

			var
			name = this.getAttribute( settings.symbol ),
			self = $( this ),
			content = target.find( settings.selector4content ).filter( "[" + settings.symbol + "='" + name + "']" );

			if ( content.length ) {
				if ( !current ) {
					current = self.addClass( "active" );
				}

				mappings[ name ] = {
					offsetTop: content.offset().top - content.height() + settings.offset,
					anchor: self
				};
			}
		} );

		target
		.undelegate( settings.selector4delegate + "[" + settings.symbol + "]", "click" )
		.delegate( settings.selector4delegate + "[" + settings.symbol + "]", "click", function( e, args ) {

			var
			self = $( this ),
			name = this.getAttribute( settings.symbol ),
			item = mappings[ name ];

			if ( self.is( "[data-forceAnchor]" ) ) {
			    var
			    offset = +self.attr( "data-forceAnchor" ),
			    dest = target.find( settings.selector4content ).filter( "[" + settings.symbol + "=" + name + "]" );

			    item.offsetTop = dest.offset().top + offset;

                self.removeAttr( "data-forceAnchor" );
			}

			if ( item ) {

				current.removeClass( "active" );
				current = item.anchor.addClass( "active" );

				args === undefined && $( target ).animate( {
					"scrollTop": item.offsetTop
				}, 400 );

				e.stopPropagation();
				e.preventDefault();
			}
		} );

        $( document )
		.off( "scroll", autoAnchor )
		.on( "scroll", { mappings: mappings, offset: settings.offset }, autoAnchor );
	},

	timer;

	function autoAnchor( e ) {

		clearTimeout( timer );

		timer = setTimeout( function() {

			var
			/** Shortcuts */
			mappings = e.data.mappings,
            offset = e.data.offset,
            containerOffsetTop = document.body.scrollTop,
            sort = [];

			for ( var i in mappings ) {

				var item = mappings[ i ];

				sort.push( {
					offset: Math.abs( containerOffsetTop - item.offsetTop ),
					item: item
				} );
			}

			sort.sort( function( x, y ) {

				if ( x.offset > y.offset ) {
					return 1;
				}

				if ( x.offset === y.offset ) {
					return 0;
				}

				return -1;
			} );

			var destination = sort[ 0 ][ "item" ][ "anchor" ];

			if ( !destination.hasClass( "active" ) ) {
				e.stopPropagation();
				e.preventDefault();
				destination.trigger( "click", { animate: false } );
			}
		}, 400 );
	}

	$.anchor = function( options ) {

        new Anchor( $( "html, body" ), $.extend( {}, $.anchor.defaults, options || {} ) );
	};

	$.anchor.defaults = {

		symbol 			    : "data-anchor",
		offset 			    : 0,

		selector4anchor 	: "#anchors li",
		selector4delegate   : "#anchors li, a",
		selector4content 	: "#container header, #canvas h3, .md-ribbon"
	};

})( window.jQuery );

define("ui/anchor/anchor", function(){});


(function( $ ) {

	"use strict";

	var

	namespace = "$ui.loading",

	Loading = function( target, settings ) {

		this.$node = target = $( target );
		this.settings = settings;
		target.parent().css( "position", "relative" );
	};

	Loading.prototype = {

		show: function() {

            this.$node.addClass( "show" );
			return this;
		},

		hide: function( callback ) {

            this.$node.removeClass( "show" );
			return this;
		}
	};

	$.fn.loading = function( options ) {

		var instance = this.data( namespace );

		if ( !instance ) {
			instance = new Loading( this, options || {} );
			this.data( namespace, instance );
		}

		return instance;
	};

})( window.jQuery );


define("ui/loading/loading", function(){});


(function( factory ) {

	if ( "function" === typeof define && define.amd ) {
		define( 'util/poll',factory );
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


define( 'ui/progress/progress',[ "util/poll" ], function( poll ) {

	"use strict";

	var
	namespace = "$ui.progress",

	Progress = function( target, settings ) {

		var self = this;

		this.$node = target;
		this.settings = settings;

		if ( settings.template ) {
			this.$node.html( settings.template );
		}
	};

	Progress.prototype = {

		start: function() {

			var settings = this.settings;

			this.set( 0 );
			this.runner && poll.remove( this.runner );
			this.runner = runner.call( this, settings );

			/** Fadein */
			this.$node.find( settings.selector4bar + "," + settings.selector4icon ).css( {

				"opacity": 1,
				"visibility": "visible",
				"display": ""
			} );

			poll.start( this.runner );
			return this;
		},

		set: function( status ) {

			this.status = status;
			this.settings.render.call( this, status );

			return this;
		},

		done: function() {

			var self = this, settings = this.settings;

			self.set( 1 );

			setTimeout( function() {

				self.$node.find( settings.selector4bar + "," + settings.selector4icon ).css( {
					"opacity": 0,
					"visibility": "hidden"
				} );

				setTimeout( function() {
					self.set( 0 );
					self.$node.find( settings.selector4icon ).css( "display", "none" );
				}, 800 );
			}, 400 );

			poll.remove( self.runner );

			return this;
		},

		inc: function() {

            var
            status = this.status,
            settings = this.settings;

		    status += Math.random() * settings.seed;
            status = status > settings.max ? settings.max : status;
            this.status = status;
            return this;
		},

		dec: function() {

            var
            status = this.status,
            settings = this.settings,
            value = Math.random() * settings.seed;

		    status -= value;
            status = status < 0.02 ? value : status;
            this.status = status;
            return this;
		}
	};

	function runner( settings ) {

		var self = this;

		return poll.add( {

			action: function( deferred ) {

				var status = +self.status || 0;

				status += Math.random() * settings.seed;
				status = status > settings.max ? settings.max : status;
				self.set( status );
				deferred.resolve();
			},

            delay: true,
            interval: settings.speed
		} );
	}

	$.fn.progress = function( options ) {

		var
		settings,
		instance = this.data( namespace );

		if ( !instance ) {

			settings = $.extend( {}, $.fn.progress.defaults, options || {} );
			settings.max = settings.max > 1 ? 0.99123 : settings.max;
			instance = new Progress( this, settings );
			this.data( namespace, instance );
		}

		return instance;
	};

	$.fn.progress.defaults = {

		seed 		    : 0.05,
		speed 		    : 800,

		max 		    : 0.99123,

		template 	    : "<div class='md-progress-bar'><div></div></div><div class='md-progress-spinner'><div></div></div>",

		selector4bar 	: ".md-progress-bar",
		selector4icon 	: ".md-progress-spinner",

		render          : function( status ) {

            this
            .$node
            .find( this.settings.selector4bar )
            .css( {
                "width": status * 100 + "%",
                "-webkit-transition": "all .2s ease-out",
                "-moz-transition": "all .2s ease-out",
                "-ms-transition": "all .2s ease-out",
                "-o-transition": "all .2s ease-out",
                "transition": "all .2s ease-out",
            } );
		}
	};
} );



define( 'ui/modal/modal',[ "ui/loading/loading", "ui/progress/progress" ], function() {

	$.fn.modal = function( options ) {

		var

        template = [ "<div class='md-modal'>",
                    "<div style='height: 100%;'>",
                        "<div class='md-modal-head'></div><div class='md-icon-clear md-modal-close'></div>",
                        "<div class='md-loading'></div>",
                        "<div class='md-progress'></div>",
                        "<div class='md-modal-body'></div>",
                    "</div>",

                "</div>",
                "<div class='md-modal-overlay'></div>" ].join( "" ),

		modal = $( template ),

		close = function() {
			$( document ).off( "keyup", closeByESC ).off( "click", closeByDocument );

			options.onClose();
			modal.removeClass( "show" );
			setTimeout( function() { modal.remove(); }, 300 );
		},

		closeByESC = function( e ) {
			27 === e.keyCode && close();
		},

		closeByDocument = function( e ) {
			$( e.target ).hasClass( "md-modal-overlay" ) && close();
		},

		loading = modal.find( ".md-loading:first" ).loading(),
		progress = modal.find( ".md-progress:first" ).progress(),

		deferred = $.Deferred(),

		show = function() {

			var
			  head = modal.find( ".md-modal-head" ),
			  body = modal.find( ".md-modal-body" ),
			  overlay = modal.last();

			/** ~Head~ */
			options.showTitle ? head.html( options.title ) : head.hide().next().hide();

			/** ~Body~ */
			if ( options.content instanceof Function ) {
				options.content.call( body, deferred, loading, close );
			} else {
				body.html( options.content );
				deferred.resolve();
			}

			modal.first().addClass( [ "md-modal-animation-" + options.animation, options.class4modal || "" ].join( " " ) );

			/** Show the overlay */
			overlay.addClass( options.modal ? "show" : "blank" );

			/** Close the modal */
			if ( options.closeByESC || options.closeByDocument ) {

				var trigger = $( document ).add( modal );

				true === options.closeByDocument
					&& modal.off( "click", closeByDocument ).on( "click", closeByDocument );

				if ( "boolean" === typeof options.closeByESC ) {
					trigger.off( "keyup", closeByESC ).on( "keyup", closeByESC );
				}
			}

			modal.delegate( ".md-modal-close", "click", close );

			setTimeout( function() {
				modal.first().addClass( "show" );
			}, 100 );

			if ( options.draggable ) {

                var handle = options.draggable;

                head.css( "cursor", "move" );

				modal.drag( function( ev, dd ) {

					$( this ).css( {
						top: dd.offsetY,
						left: dd.offsetX,
                        "width": modal.width(),
                        "height": modal.height(),
						"-webkit-transform": "none",
						"-moz-transform": "none",
						"-ms-transform": "none",
						"transform": "none",
					} );
				}, { handle: handle === true ? ".md-modal-head" : handle } );
			}

			modal.appendTo( document.body );
		};

		options = $.extend( {}, $.fn.modal.defaults, options || {} );

		if ( this === $ ) {
			options.target ? $( options.target ).on( "click", show ) : (options.autoShow && show());
		/** Use a dom as trigger */
		} else this.on( "click", show );

		return {
			open: show,
			close: close,
			loading: loading,
			progress: progress,
			$node: modal
		};
	};

	$.fn.modal.defaults = {

		title 		    : "Modal",
		showTitle 	    : true,
		modal        	: true,
		draggable       : true,

		class4modal     : "",

		closeByESC 	    : true,
		closeByDocument : false,

		animation 	    : "slide",
		content 		: "",

		autoShow 	    : true,
		onClose 		: $.noop,
	};

	/** Export to $ */
	$.modal = $.fn.modal;
} );



define( 'ui/dialog/dialog',[ "ui/modal/modal" ], function() {

    $.dialog = function( options ) {

        var
        modal,
        deferred,
        settings,
        events = {},
        buttons = "",
        body = "";

        modal = $.modal( settings = $.extend( {
            css: {
                width: options.width || $.dialog.defaults.width,
                height: options.height || $.dialog.defaults.height
            }
        },
        $.dialog.defaults,
        options, {
            content: "<div class='dialog'>" +
                    "<div class='dialog-content'><div></div></div>" +
                    "<div class='dialog-action'></div>" +
                    "</div>"
        } ) );

        if ( "string" === typeof options.content ) {
            body = options.content;
        } else if ( "function" === typeof options.content ) {

            deferred = $.Deferred();
            options.content().done( function( data ) {
                body = data;
                deferred.resolve();
            } );
        }

        for ( var key in settings.buttons ) {

            var button = settings.buttons[ key ];
            buttons += "<button name='" + key + "'>" + button.label + "</button>";
            events[ key ] = button.onClick;
        }

        $.when( deferred ).done( function() {
            modal.$node.find( ".dialog-content > div" ).html( body );
        } );

        modal
        .$node
        .find( ".dialog-action" )
        .html( buttons )
        .delegate( "button", "click", function() {
            (events[ this.getAttribute( name ) ] || $.noop).apply( this, arguments );
        } );
    };

    $.dialog.defaults = {

        width: 600,
        height: 400,
        title: "Dialog",

        buttons: {
            "cancel": {
                label: "取消",
                onClick: function( modal ) {
                    modal.close();
                }
            },
            "ok": {
                label: "确定",
                onClick: $.noop
            }
        }
    };
} );


define( 'ui/dialog/dialog-ng',[ "ui/dialog/dialog" ], function() {

    "use strict";

    angular.module( "$ui.dialog", [] )

    .factory( "$dialog", function() {
        return $.dialog;
    } );
} );


define( 'demo/modal/index',[ "ui/modal/modal-ng", "ui/dialog/dialog-ng" ], function() {

	"use strict";

	angular
	.module( "demo.modal", [ "$ui.modal", "$ui.message" ] )
	.controller( "modalController", [ "$scope", "$modal", function( $scope, $modal ) {

        $scope.name = "test";

		$scope.open = function( animation ) {

			return $modal.open( {
				controller: "modalController",
				animation: animation,
				templateUrl: "src/demo/modal/page.html",
				title: "Mango (Fruit)",
				class4modal: "demo",
				scope: $scope
			} );
		};

		$scope.showProgress = function() {

			$modal.open( {
				controller: "modalController",
				templateUrl: "src/demo/modal/page1.html",
				title: "弹出框标题 18PX 加粗 #333",
				class4modal: "demo",
				scope: $scope
			} )

			.progress.start();
		};

	    $scope.init = function() {
            $.anchor( { offset: -60 } );
	    };
	} ] );
} );



define( 'demo/tab/index',[ "ui/tab/tab-ng" ], function() {

    "use strict";

    angular
    .module( "demo.tab", [ "$ui.tab" ] )
    .controller( "tabController", [ "$scope", "$sce", function( $scope, $sce ) {

        var last;

        $scope.selected = "2";

        $scope.tabs = [ {

            header: "One",
            index: "1",
            disabled: true,
            content: $sce.trustAsHtml( "<img src='images/lorempixel-1.jpg' alt=''><blockquote>'Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem.' <br>— Aliquam Libero</blockquote><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p>" )
        }, {
            header: "Two",
            index: "2",
            content: $sce.trustAsHtml( "<img src='images/lorempixel-2.jpg' alt=''><blockquote>'Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem.' <br>— Aliquam Libero</blockquote><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p>" )
        }, {
            header: "Three",
            index: "3",
            content: $sce.trustAsHtml( "<img src='images/lorempixel.jpg' alt=''><blockquote>'Quisque aliquam. Donec faucibus. Nunc iaculis suscipit dui. Nam sit amet sem.' <br>— Aliquam Libero</blockquote><p>Lorem ipsum dolor sit amet, <em>consectetuer adipiscing elit</em></p>" )
        }, {
            header: "Ajax - 1",
            index: "4",
            page: "src/demo/tab/tab4.html"
        }, {
            header: "Ajax - 2",
            index: "5",
            page: "src/demo/tab/error.html"
        } ];

        last = $scope.tabs.length;

        $scope.addTab = function() {

            var index = ++last + "";

            $scope.tabs.push( {
                header: "Tab - " + last,
                index: index,
                content: $sce.trustAsHtml( "Tab: " + index ),
            } );
        };

        $scope.removeTab = function() {

            var
            tabs = $scope.tabs,
            index;

            for ( var i = tabs.length; --i >= 0; ) {

                var tab = tabs[ i ];

                if ( tab.index === $scope.selected ) {
                    index = i;
                    break;
                }
            }

            tabs.splice( index, 1 );
        };

        $scope.toggleTabState = function() {

            var
            tabs = $scope.tabs,
            index;

            for ( var i = tabs.length; --i >= 0; ) {

                var tab = tabs[ i ];

                if ( tab.index === $scope.selected ) {
                    index = i;
                    break;
                }
            }

            tabs[ index ][ "disabled" ] = !tabs[ index ][ "disabled" ];
        };

        $scope.onSelect = function() {
            console.log( $scope.selected );
        };

	    $scope.init = function() {
            $.anchor( { offset: 190 } );
	    };
    } ] );
} );


define( 'demo/message/index',[ "ui/message/message-ng" ], function() {

    "use strict";

    angular
    .module( "demo.message", [ "$ui.message" ] )
    .controller( "messageController", [ "$scope", "$message", function( $scope, $message ) {

        $scope.init = function() {
            $.anchor( { offset: 20 } );
        };

        angular.extend( $scope, {

            showSuccess: function() {
                $message.success( "This is a message telling you that everything is a-okay" );
            },

            showError: function() {
                $message.error( "This is a notification that something is wrong..." );
            },

            showInfo: function() {
                $message.info( "This is an 'information message' div." );
            },

            showWarn: function() {
                $message.warn( "It warns the users that to expect some changes or limitations." );
            },

            showConfirm: function() {

                $message.confirm( {
                    title: "Please confirm",
                    message: "Exported successfully. Do you want to open the export query page?",
                    onOk: function() {
                        window.open( "//www.google.com", "_blank" );
                    }
                } );
            },

            showBubble: function() {
                $.message.bubble( "Thank You~", 3000 );
            }
        } );
    } ] );
} );


define( 'demo/autoComplete/index',[ "ui/autoComplete/autoComplete-ng" ], function() {

    "use strict";

    angular
    .module( "demo.autoComplete", [ "$ui.autoComplete" ] )
    .controller( "autoCompleteController", [ "$scope", function( $scope ) {

        $scope.name = "Test";

        /** AutoComplete options */
        angular.extend( $scope, {

            isDisabled: false,
            localMatch: "^",
            tabComplete: true,
            highlight: true,
            fuzzy: true
        } );

        $scope.data = [ {
			value: "AD",
			text: "Andorra"
		}, {
			value: "AZ",
			text: "Azerbaijan"
		}, {
			value: "AW",
			text: "Aruba"
		}, {
			value: "BI",
			text: "Bulgaria"
		}, {
			value: "BS",
			text: "Bahamas"
		}, {
			value: "CH",
			text: "Switzerland"
		}, {
			value: "CK",
			text: "Cook Island"
		}, {
			value: "CL",
			text: "Chile"
		}, {
			value: "CN",
			text: "China"
		}, {
			value: "CM",
			text: "Cambodia"
		}, {
			value: "AE",
			text: "United Arab Emirates"
		}, {
			value: "AF",
			text: "Afghanistan"
		}, {
			value: "AG",
			text: "Antigua and Barbuda"
		}, {
			value: "AO",
			text: "Angola"
		} ];

		$scope.address = [ {
			value: "AG",
			text: "Antigua and Barbuda"
		}, {
			value: "AO",
			text: "Angola"
		} ];

		/** Ajax example */
		$scope.ajax = {
		    dataProxy: function( key ) {
                return $.ajax( {
                    url: "https://api.github.com/search/repositories?q=" + key + "&sort=stars&order=desc"
                } );
		    },
            enterforce: true,
            dataFilter: function( data ) {
                return data.items || [];
            }
		};

	    $scope.init = function() {
            $.anchor( { offset: -60 } );
	    };
    } ] );
} );


define( 'demo/toast/index',[ "ui/toast/toast-ng" ], function() {

    "use strict";

    angular
    .module( "demo.toast", [ "$ui.toast" ] )
    .controller( "toastController", [ "$scope", "$toast", function( $scope, $toast ) {

        $scope.init = function() {
            $.anchor( { offset: 0 } );
        };

        $scope.theme = "default";

        $scope.changeTheme = function( theme ) {
            $scope.theme = theme;
        };

        angular.extend( $scope, {

            topLeft: function() {
                $toast.top( "On the top left!", $scope.theme ).left();
            },

            topRight: function() {
                $toast.top( "On the top left!", $scope.theme ).right();
            },

            bottomLeft: function() {
                $toast.bottom( "On the bottom left!", $scope.theme ).left();
            },

            bottomRight: function() {
                $toast.bottom( "On the bottom right!", $scope.theme ).right();
            }
        } );
    } ] );
} );


define( 'demo/getstarted/index',[], function() {

    "use strict";

    angular
    .module( "demo.getstarted", [] )
    .controller( "getstartedController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor( { offset: -20 } );
        };
    } ] );
} );


define( 'demo/tooltip/index',[], function() {

    "use strict";

    angular
    .module( "demo.tooltip", [] )
    .controller( "tooltipController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor( { offset: 0 } );
        };
    } ] );
} );


define( 'demo/sidenav/index',[ "ui/sidenav/sidenav-ng" ], function() {

    "use strict";

    angular
    .module( "demo.sidenav", [ "$ui.sidenav" ] )
    .controller( "sidenavController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor( { offset: -60 } );
        };

        $scope.showProfile = function( sidenav ) {

            sidenav
            .left()
            .$node
            .delegate( ".exit", "click", function() {
                sidenav.close();
            } );
        };
    } ] );
} );


define( 'demo/dateutil/index',[ "util/dateutil" ], function() {

    "use strict";

    angular
    .module( "demo.dateutil", [] )
    .controller( "dateutilController", [ "$scope", function( $scope ) {

        var
        now = new Date(),
        justAgo = new Date( now - 50 * 1000 ),
        minuteAgo = new Date( now  - 200 * 1000 ),
        hourAgo = new Date( now - 3600 * 1000 ),
        yesterday = new Date( $.dateutil( now ).yesterday() ),
        morethan = new Date( $.dateutil( now ).day( -31 ) );

        $scope.init = function() {
            $.anchor();
        };

        angular.extend( $scope, {

            now: now,
            now2: $.dateutil( now ).format( "%Y - %m - %d" ),
            now3: $.dateutil( now ).format( "%B %A, %Y" ),
            now4: $.dateutil( now ).format( "%x %X" ),

            justAgo: justAgo,
            justAgo2: $.dateutil( justAgo ).nice(),

            minuteAgo: minuteAgo,
            minuteAgo2: $.dateutil( minuteAgo ).nice(),

            hourAgo: hourAgo,
            hourAgo2: $.dateutil( hourAgo ).nice(),

            yesterday: yesterday,
            yesterday2: $.dateutil( yesterday ).nice(),

            morethan: morethan,
            morethan2: $.dateutil( morethan ).nice()
        } );
    } ] );
} );


define( 'demo/tree/index',[ "ui/tree/tree-ng" ], function() {

    "use strict";

    angular
    .module( "demo.tree", [ "$ui.tree" ] )
    .controller( "treeController", [ "$scope", function( $scope ) {

        var deferred = $.Deferred();

        $scope.init = function() {
            $.anchor( { offset: -60 } );
        };

        $scope.test = function() {

            $.ajax( {
                url: "src/demo/tree/test.json",
                dataType: "text"
            } )
            .done( function( data ) {
                deferred.resolveWith( eval( "(" + data + ")" ) );
            } );

            return deferred.promise();
        };

        /** Custom */
        $scope.files = function() {

            return $.ajax( {
                url: "src/demo/tree/files.json"
            } );
        };

        $scope.addBranch = function( tree, parentId ) {

            var
            settings = tree.settings,
            item = {};

            item[ settings.parentKey ] = parentId;
            item[ settings.valueKey ] = +new Date();
            item[ settings.textKey ] = "New Branch";

            tree.add( item );
        };

        $scope.afterInit = function( szseTree ) {

            $.when( deferred ).done( function() {

                szseTree
                .expand( "szse" )
                .expand( "zhyjs" )
                .disabled("zhyjs" )
                .disabled( "szzqjysyyb" );
            } );
        };
    } ] );
} );


define( 'demo/rate/index',[ "ui/rate/rate-ng" ], function() {

    "use strict";

    angular
    .module( "demo.rate", [ "$ui.rate" ] )
    .controller( "rateController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor( { offset: -60 } );
        };

        $scope.heart = 2.3;
    } ] );
} );


define( 'demo/progress/index',[ "ui/progress/progress-ng" ], function() {

    "use strict";

    angular
    .module( "demo.progress", [ "$ui.progress" ] )
    .controller( "progressContorller", [ "$scope", function( $scope ) {

        $scope.stop = function() {
            $scope.progress.done();
        };
    } ] );
} );



define( 'demo/calendar/index',[ "ui/calendar/calendar-ng", "util/dateutil" ], function() {

    "use strict";

    angular
    .module( "demo.calendar", [ "$ui.calendar" ] )
    .controller( "calendarController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor( { offset: -60 } );
        };

        var now = new Date();

        angular.extend( $scope, {

            showTime: false,
            double: true,
            date: $.dateutil( now ).tomorrow(),
            isDisabled: false,
            minDate: $.dateutil( now ).lastWeek(),
            maxDate: $.dateutil( now ).nextWeek(),
            onClick: function( value ) {
                console.log( value );
            }
        } );
    } ] );
} );


define( 'demo/dropdown/index',[ "ui/dropdown/dropdown-ng" ], function() {

    "use strict";

    angular
    .module( "demo.dropdown", [ "$ui.dropdown" ] )
    .controller( "dropdownController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor( { offset: -10 } );
        };

        $scope.data = [ {
			value: "AD",
			text: "Andorra"
		}, {
			value: "AZ",
			text: "Azerbaijan"
		}, {
			value: "AW",
			text: "Aruba"
		}, {
			value: "BI",
			text: "Bulgaria"
		}, {
			value: "BS",
			text: "Bahamas"
		}, {
			value: "CH",
			text: "Switzerland"
		}, {
			value: "CK",
			text: "Cook Island"
		}, {
			value: "CL",
			text: "Chile"
		}, {
			value: "CN",
			text: "China"
		}, {
			value: "CM",
			text: "Cambodia"
		}, {
			value: "AE",
			text: "United Arab Emirates"
		}, {
			value: "AF",
			text: "Afghanistan"
		}, {
			value: "AG",
			text: "Antigua and Barbuda"
		}, {
			value: "AO",
			text: "Angola"
		} ];

        $( ".ui.dropdown.icon" ).each( function() {
            $( this ).dropdown( { data: $scope.data } );
        } );

        angular.extend( $scope, {

            ajax: function() {

                var deferred = $.Deferred();

                $.ajax( {
                    url: "src/demo/dropdown/result.json",
                    dataType: "json"
                } )

                .done( function( data ) {
                    data = data.items;
                    deferred.resolveWith( data );
                } )

                .fail( deferred.reject );

                return deferred;
            },

            required: true,
            multiple: true
        } );
    } ] );
} );


define( 'demo/ripple/index',[ "ui/ripple/ripple-ng" ], function() {

    "use strict";

    angular
    .module( "demo.ripple", [ "$ui.ripple" ] )
    .controller( "rippleController", [ "$scope", function( $scope ) {

        var colors = {
            grape: "#ED5565",
            bittersweet: "#FC6E51",
            sunflower: "#FFCE54",
            grass: "#A0D468",
            mint: "#48CFAD",
            auqa: "#4FC1E9",
            blueJeans: "#5D9CEC",
            lavender: "#AC92EC",
            pinkRose: "#EC87C0",
            lightGray: "#F5F7FA",
            mediumGray: "#CCD1D9",
            darkGray: "#656D78",
            success: "#0f9d58",
            error: "#f44336",
            info: "#039be5",
            warn: "#ff5722"
        };

        $scope.changeColor = function( name ) {

            var color = colors[ $scope.theme = name ];

            if ( $scope.color === color ) {
                $scope.color = $scope.theme = void color;
            } else
                $scope.color = color;
        };
    } ] );
} );


define( 'demo/checkbox/index',[], function() {

    "use strict";

    angular
    .module( "demo.checkbox", [] )
    .controller( "checkboxController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor();
        };
    } ] );
} );


define( 'demo/switcher/index',[], function() {

    "use strict";

    angular
    .module( "demo.switcher", [] )
    .controller( "switcherController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor();
        };
    } ] );
} );


define( 'demo/button/index',[], function() {

    "use strict";

    angular
    .module( "demo.button", [] )
    .controller( "buttonController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor( { offset: -30 } );
        };
    } ] );
} );


define( 'demo/radio/index',[], function() {

    "use strict";

    angular
    .module( "demo.radio", [] )
    .controller( "radioController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor();
        };
    } ] );
} );


define( 'demo/loading/index',[ "ui/loading/loading-ng" ], function() {

    "use strict";

    angular
    .module( "demo.loading", [ "$ui.loading" ] )
    .controller( "loadingController", [ "$scope", function( $scope ) {

    } ] );
} );


define( 'demo/pagination/index',[ "ui/pagination/pagination-ng" ], function() {

    "use strict";

    angular
    .module( "demo.pagination", [ "$ui.pagination" ] )
    .controller( "paginationController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor( { offset: -60 } );
        };

        $scope.index = 7;

        $( ".ui.pagination:last" ).pagination( {
            total: 20,
            index: 1
        } );
    } ] );
} );



define( 'ui/timepicker/timepicker',[], function() {

    "use strict";

    var
    namespace = "$ui.timepicker",

    Timepicker = function( target, settings ) {

        var
        instance = this,
        hoursHtml = "",
        mintuesHtml = "";

        this.$node = target;
        this.settings = settings;

        for ( var i = 0; i <= 23; ++i ) {
            hoursHtml += "<span>" + i + "</span>";
        }

        for ( var i = 0; i <= 11; mintuesHtml += "<span>" + (i++ * 5) + "</span>" );

        target
        .append( "<div tabindex=-1 class='hours'><p>请选择小时</p><div>" + hoursHtml + "</div></div>" )
        .append( "<div tabindex=-1 class='mintues'><p>请选择分钟</p><div>" + mintuesHtml + "</div></div>" )

        .delegate( "input", "click", function( e ) {

            var self = $( this );

            if ( target.is( "[disabled]" ) ) { return; }

            target
            .find( self.hasClass( "hour" ) ? ".hours" : ".mintues" )
            .addClass( "show" )
            .focus();
        } )

        .delegate( "input", "focusout", function() {

            var
            self = $( this ),
            value = +self.val(),
            isValid = true,
            popover = target.find( ".hours" );

            if ( isValid = !isNaN( value ), isValid ) {

                if ( self.hasClass( "mintue" ) ) {
                    popover = target.find( ".mintues" );

                    if ( settings.strict ) {

                        if ( self.val() !== "00" ) {
                            popover.find( "span" ).filter( function() {
                                if ( $( this ).text() == self.val() ) {
                                    isValid = false;
                                }
                            } );
                        }
                    } else if ( value > 59 ) {
                        isValid = false;
                    }
                } else {

                    /** Check the hour */
                    if ( value > 23 ) {
                        isValid = false;
                    }
                }
            }

            if ( !isValid ) {
                popover.find( "span" ).removeClass( "selected" );
                self.click();
            }
        } )

        .delegate( ".hours span", "click", function() {
            target.find( settings.selector4hour ).val( this.innerHTML ).select();
        } )

        .delegate( ".mintues span", "click", function() {
            target.find( settings.selector4mintue ).val( this.innerHTML ).select();
        } )

        .delegate( "span", "click", function() {

            $( this ).addClass( "selected" ).parent().find( "span" ).not( this ).removeClass( "selected" );
            settings.onApplied.call( instance, instance.val() );
        } )

        .delegate( ".hours, .mintues", "focusout", function() {
            $( this ).removeClass( "show" );
        } );
    };

    Timepicker.prototype = {

        val: function( value ) {

            var
            settings = this.settings,
            hour,
            mintue;

            if ( value ) {

                value = value.split( ":" );
                hour = value[0];
                mintue = value[1];

                hour = hour >= 0 && hour < 24 ? hour : "00";
                mintue = mintue >= 0 && mintue < 60 ? mintue : "00";

                this.$node.find( settings.selector4hour ).val( hour );
                this.$node.find( settings.selector4mintue ).val( mintue );
            } else {
                return this.$node.find( settings.selector4hour ).val() + ":" + this.$node.find( settings.selector4mintue ).val();
            }

            return this;
        },

        disabled: function() {

            var settings = this.settings;

            this
            .$node
            .attr( "disabled", true )
            .find( settings.selector4hour + "," + settings.selector4mintue )
            .attr( "disabled", true );
            return this;
        },

        enabled: function() {

            var settings = this.settings;

            this
            .$node
            .removeAttr( "disabled" )
            .find( settings.selector4hour + "," + settings.selector4mintue )
            .removeAttr( "disabled" );
            return this;
        }
    };

    $.fn.timepicker = function( options ) {

        var instance = this.data( namespace );

        if ( !instance ) {
            instance = new Timepicker( this, $.extend( {}, $.fn.timepicker.defaults, options ) );
            this.data( namespace, instance );
        }

        return instance;
    };

    $.fn.timepicker.defaults = {
        defaultValue        : new Date(),
        strict              : false,
        selector4hour       : ".hour",
        selector4mintue     : ".mintue",
        onApplied           : $.noop
    };
} );



define( 'ui/timepicker/timepicker-ng',[ "ui/timepicker/timepicker" ], function() {



/**
 * example:
 *
    <s-time-picker
        ng-model="value"
        ng-disabled="isDisabled">
    </s-time-picker>
 * */

angular.module( "$ui.timepicker", [] )
    .directive( "sTimepicker", [ "$rootScope", function( $rootScope ) {

        function link( $scope, $element, $attrs ) {

            var
            options = {
                strict      : [ 1, "true" ].indexOf( $scope.strict ) > -1,
                onApplied   : function( value ) {

                    if ( !$rootScope.$$phase ) {

                        $scope.value = timepicker.val();
                        $scope.$apply();

                        ($scope.onApplied() || $.noop).apply( this, arguments );
                    }
                }
            },

            timepicker = $( $element ).timepicker( options );

            if ( $scope.value ) {
                timepicker.val( $scope.value );
            }

            $scope.$watch( "value", function( value ) {

                timepicker.val( value );
            } );
        }

        return {
            scope           : {
                disabled    : "=ngDisabled",
                value       : "=ngModel",
                strict      : "@",
                onApplied   : "&"
            },

            restric         : "EA",
            transclude      : true,
            replace         : true,
            template        : "<div class='ui timepicker'>" +
                                "<input class='hour' type='text' maxlength='2' value='00'>" +
                                "<span>:</span>" +
                                "<input class='mintue' type='text' maxlength='2' value='00'>" +
                              "</div>",

            link            : link
        };
    } ] );
} );



define( 'demo/timepicker/index',[ "ui/timepicker/timepicker-ng" ], function() {

    "use strict";

    angular
    .module( "demo.timepicker", [ "$ui.timepicker" ] )
    .controller( "timePickerController", [ "$scope", function( $scope ) {

    } ] );
} );


define( 'demo/accordion/index',[ "ui/accordion/accordion-ng" ], function() {

    "use strict";

    angular
    .module( "demo.accordion", [ "$ui.accordion" ] )
    .controller( "accordionController", [ "$scope", function( $scope ) {

        $scope.init = function() {
            $.anchor( { offset: 270 } );
        };

        $scope.multiple = true;

        $scope.onExpand = function( index ) {
            console.log( "Expand: " + index );
        };

        $scope.onCollapse = function( index ) {
            console.log( "Collapse: " + index );
        };

        $scope.isOpen = true;

        $scope.panes = [ {
            head: "Pane 1",
            content: "Pane - 1"
        }, {
            head: "Pane 2",
            content: "Pane - 2"
        } ];

        $scope.addPane = function() {

            var index = +new Date();

            $scope.panes.push( {
                head: "Pane " + index,
                content: "Pane - " + index
            } );
        };

        $scope.removePane = function() {
            $scope.panes.splice( -1 );
        };
    } ] );
} );



define( 'demo/validation/index',[ "ui/validation/validation-ng" ], function() {

    "use strict";

    angular
    .module( "demo.validation", [ "$ui.validation" ] )
    .controller( "validationController", [ "$scope", function( $scope ) {

        $scope.push = function( info ) {
            console.log( info );
        };

        $scope.uniqueName = function( name ) {
            return name !== "abc";
        };

	    $scope.init = function() {
            $.anchor( { offset: 310 } );
	    };
    } ] );
} );


require.config( {

	baseUrl: "src",

	paths: {
		ui: "../src/components",
		util: "../src/util",
		modules: "../src/modules"
	}
} );

require( [
        "ui/anchor/anchor",
        "ui/sidenav/sidenav-ng",
        "demo/modal/index",
        "demo/tab/index",
        "demo/message/index",
        "demo/autoComplete/index",
        "demo/toast/index",
        "demo/getstarted/index",
        "demo/tooltip/index",
        "demo/sidenav/index",
        "demo/dateutil/index",
        "demo/tree/index",
        "demo/rate/index",
        "demo/progress/index",
        "demo/calendar/index",
        "demo/dropdown/index",
        "demo/ripple/index",
        "demo/checkbox/index",
        "demo/switcher/index",
        "demo/button/index",
        "demo/radio/index",
        "demo/loading/index",
        "demo/pagination/index",
        "demo/timepicker/index",
        "demo/accordion/index",
        "demo/validation/index" ], function() {

	"use strict";

	var app = angular

	.module( "neoui", [ "ngRoute", "$ui.sidenav",
	        "demo.modal",
	        "demo.tab",
	        "demo.message",
	        "demo.autoComplete",
	        "demo.validation",
	        "demo.toast",
	        "demo.getstarted",
	        "demo.tooltip",
	        "demo.sidenav",
	        "demo.dateutil",
	        "demo.tree",
	        "demo.checkbox",
	        "demo.switcher",
	        "demo.radio",
	        "demo.rate",
	        "demo.dropdown",
	        "demo.ripple",
	        "demo.button",
	        "demo.loading",
	        "demo.pagination",
	        "demo.accordion",
	        "demo.timepicker",
	        "demo.progress",
	        "demo.calendar" ] )

    .config( [ "$httpProvider", function( $httpProvider ) {

        var progress;

        setTimeout( function() {

            progress = $( ".md-progress:first" ).progress();

            $httpProvider.defaults.transformResponse.push( function( data, headers ) {
                setTimeout( function() {
                    progress.done();
                }, 1000 );
                return data;
            } );
            $httpProvider.defaults.transformRequest.push( function( data, headers ) {
                progress.start();
                return data;
            } );
        } );
    } ] )

	.config( [ "$routeProvider", function( $routeProvider ) {

		$routeProvider
		    .when( "/home", {
		        templateUrl: "src/demo/home/index.html"
		    } )
			.when( "/color", {
				templateUrl: "src/demo/color/index.html"
			} )
			.when( "/getstarted", {
				templateUrl: "src/demo/getstarted/index.html"
			} )
			.when( "/tooltip", {
				templateUrl: "src/demo/tooltip/index.html"
			} )
			.when( "/modal", {
				templateUrl: "src/demo/modal/index.html"
			} )
		    .when( "/tab", {
		        templateUrl: "src/demo/tab/index.html"
		    } )
		    .when( "/message", {
		        templateUrl: "src/demo/message/index.html"
		    } )
		    .when( "/autoComplete", {
		        templateUrl: "src/demo/autoComplete/index.html"
		    } )
		    .when( "/validation", {
		        templateUrl: "src/demo/validation/index.html"
		    } )
		    .when( "/toast", {
		        templateUrl: "src/demo/toast/index.html"
		    } )
		    .when( "/tree", {
		        templateUrl: "src/demo/tree/index.html"
		    } )
		    .when( "/loading", {
		        templateUrl: "src/demo/loading/index.html"
		    } )
		    .when( "/sidenav", {
		        templateUrl: "src/demo/sidenav/index.html"
		    } )
		    .when( "/dateutil", {
		        templateUrl: "src/demo/dateutil/index.html"
		    } )
		    .when( "/editor", {
		        templateUrl: "src/demo/editor/index.html"
		    } )
		    .when( "/calendar", {
		        templateUrl: "src/demo/calendar/index.html"
		    } )
		    .when( "/rate", {
		        templateUrl: "src/demo/rate/index.html"
		    } )
		    .when( "/ripple", {
		        templateUrl: "src/demo/ripple/index.html"
		    } )
		    .when( "/progress", {
		        templateUrl: "src/demo/progress/index.html"
		    } )
		    .when( "/button", {
		        templateUrl: "src/demo/button/index.html"
		    } )
		    .when( "/checkbox", {
		        templateUrl: "src/demo/checkbox/index.html"
		    } )
		    .when( "/switcher", {
		        templateUrl: "src/demo/switcher/index.html"
		    } )
		    .when( "/radio", {
		        templateUrl: "src/demo/radio/index.html"
		    } )
		    .when( "/dropdown", {
		        templateUrl: "src/demo/dropdown/index.html"
		    } )
		    .when( "/accordion", {
		        templateUrl: "src/demo/accordion/index.html"
		    } )
		    .when( "/pagination", {
		        templateUrl: "src/demo/pagination/index.html"
		    } )
		    .when( "/timepicker", {
		        templateUrl: "src/demo/timepicker/index.html"
		    } )
			.otherwise( {
				redirectTo: "/home"
			} );
	} ] )

	.directive( "afterRender", [ "$timeout", function( $timeout ) {

	    return {
	        restric: "A",
	        terminal: true,
	        link: function( $scope, $element, $attrs ) {
                $timeout( function() {
                    $scope.$eval( $attrs.afterRender );
                }, 0 );
	        }
	    };
	} ] )

    .controller( "mainController", [ "$scope", "$location", function( $scope, $location ) {

        $scope.openMenu = function( menu ) {

            $scope.title = location.hash.split( "/" )[1];

            setTimeout( function() {

            menu
            .left()
            .$node
            .delegate( "[data-url]", "click", function( e ) {

                $location.path( "/" + this.getAttribute( "data-url" ) );
                $scope.$apply();

                setTimeout( function() {
                menu.close();
                $( "html, body" ).scrollTop( 0 );
                }, 500 );
            } );
            }, 500 );
        };
    } ] );

    $( function() {
        setTimeout( function() {
            $( ".md-loading:first" ).loading().hide();
        }, 1000 );
    } );

	angular.bootstrap( document, [ "neoui" ] );
} );

define("bootstrap", function(){});

