
var

/** Plugin list */
rename = require( "gulp-rename" ),
concat = require( "gulp-concat" ),
uglify = require( "gulp-uglify" ),
jshint = require( "gulp-jshint" ),
browserSync = require( "browser-sync" ),
less = require( "gulp-less" ),
debug = require( "gulp-debug" ),
streamqueue = require( "streamqueue" ),
clean = require( "gulp-clean" ),
rev = require( "gulp-rev" ),
rjs = require( "requirejs" ),
amdclean = require( "amdclean" ),

fs = require( "fs" ),
pkg = require( "./package.json" ),

/** Task definitions */
bs, gulp = require( "gulp" )

	.task( "start", function() {

		bs = browserSync( {
			files: [ "**/*.css", "**/*.js", "src/demo/**/*.html" ],
			server: {
				baseDir: "./",
				index: "index.html"
			}
		} );
	} )

	.task( "dist", function() {

		var
		dest = pkg.dest,
		minifyCSS = require( "gulp-minify-css" ),
        cleancss = new (require( "less-plugin-clean-css" ))( { advanced: true, compatibility: "ie8" } ),
        autoprefix = new (require( "less-plugin-autoprefix" ))( { browsers: [ "last 4 versions" ] } );

        gulp.src( "dist", { read: false } ).pipe( clean() );

        streamqueue( { objectMode: true },
                gulp.src( "src/style/main.less" ),
                gulp.src( [ "src/components/**/*.less", "!src/components/**/*-bs.less"] ),
                gulp.src( "src/demo/**/*.less" ) )
			.pipe( debug() )
			.pipe( less( { plugins: [ autoprefix, cleancss ] } ) )
			.pipe( concat( "css.css" ) )
			.pipe( gulp.dest( dest ) )
			.pipe( minifyCSS() )
			.pipe( rename( "css.min.css" ) )
			.pipe( gulp.dest( dest ) )
			.pipe( rev() )
			.pipe( gulp.dest( dest ) );

		gulp.src( [ "bower_components/jquery/dist/jquery.js",
		        "bower_components/jquery.event.drag-new/event.drag/jquery.event.drag.js",
				"bower_components/angular/angular.js",
				"bower_components/angular-route/angular-route.js",
				"bower_components/requirejs/require.js" ] )

			.pipe( debug() )
            .pipe( concat( "vendor.js" ) )
			.pipe( gulp.dest( dest ) )
			.pipe( uglify() )
			.pipe( rename( "vendor.min.js" ) )
			.pipe( gulp.dest( dest ) );

		rjs.optimize( {
		    baseUrl: "src",
            include: "bootstrap",
            out: "dist/app.js",
            paths: {
                "ui": "components",
                "ui/accordion/accordion-ng": "empty:",
                "ui/autoComplete/autoComplete-ng": "empty:",
                "ui/calendar/calendar-ng": "empty:",
                "ui/dropdown/dropdown-ng": "empty:",
                "ui/loading/loading-ng": "empty:",
                "ui/message/message-ng": "empty:",
                "ui/modal/modal-ng": "empty:",
                "ui/pagination/pagination-ng": "empty:",
                "ui/progress/progress-ng": "empty:",
                "ui/rate/rate-ng": "empty:",
                "ui/ripple/ripple-ng": "empty:",
                "ui/sidenav/sidenav-ng": "empty:",
                "ui/tab/tab-ng": "empty:",
                "ui/toast/toast-ng": "empty:",
                "ui/tree/tree-ng": "empty:",
                "ui/validation/validation-ng": "empty:",
                "util/dateutil": "empty:"
            }
		} );

        rjs.optimize( {
            baseUrl: "src",
            paths: {
                ui: "components"
            },
            include: "bundle",
            out: "dist/neoui-ng-rjs.js",
            onModuleBundleComplete: function( data ) {
                fs.writeFileSync( "dist/neoui-ng.js", amdclean.clean( { "filePath": data.path } ) );
            }
        } );
	} )

	.task( "watch", function() {
		gulp.watch( "src/**/*.less", [ "dist" ] );
	} )

    /** Build the test data */
	.task( "data", function() {

		var walk = function( dir, done ) {

			var result = [];

			fs.readdir( dir, function( err, list ) {

                var i = 0;

				if ( err ) return done( err );

				(function next() {

					var file = list[ i++ ];

					if ( !file ) return done( null, result );

					file = (dir + "/" + file).replace( ".//", "./" );

					fs.stat( file, function( err, stat ) {

                        if ( !/(node_modules|\.git|\.svn|\.DS_Store|dist)/i.test( file ) ) {

                            result.push( {
                                id: file,
                                parent: dir,
                                name: file.substr( dir.length ).replace( "/", "" )
                            } );

                            if ( stat && stat.isDirectory() ) {

                                walk( file, function( err, res ) {
                                    result = result.concat( res );
                                    next();
                                } );
                            } else {
                                next();
                            }
					    } else {
					        next();
					    }
					} );
				})();
			} );
		};

		walk( "./", function( err, result ) {

		    if ( err ) throw err;
            fs.writeFile( "./src/demo/tree/files.json", JSON.stringify( result ) );
		} );
	} )

	.task( "jshint", function() {

		return gulp.src( "src/**/*.js" )
			.pipe( jshint( eval( "(" + fs.readFileSync( "./.jshintrc" ) + ")" ) ) )
			.pipe( jshint.reporter( "default" ) );
	} )

	.task( "default", [ "data", "watch", "dist", "start" ] );

pkg.dest = pkg.dest || "dist";
fs.existsSync( pkg.dest ) || fs.mkdirSync( pkg.dest );
