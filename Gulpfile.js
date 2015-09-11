
var

NAME = "neoui-0.1.0",

/** Plugin list */
rename = require( "gulp-rename" ),
concat = require( "gulp-concat" ),
uglify = require( "gulp-uglify" ),
jshint = require( "gulp-jshint" ),
browserSync = require( "browser-sync" ),
compress = require( "compression" ),
less = require( "gulp-less" ),
debug = require( "gulp-debug" ),
streamqueue = require( "streamqueue" ),
rev = require( "gulp-rev" ),
revReplace = require( "gulp-rev-replace" ),
useref = require( "gulp-useref"),
gulpif = require( "gulp-if" ),
rjs = require( "requirejs" ),
amdclean = require( "amdclean" ),
minifyCSS = require( "gulp-minify-css" ),
cleancss = new (require( "less-plugin-clean-css" ))( { advanced: true, compatibility: "ie8" } ),
autoprefix = new (require( "less-plugin-autoprefix" ))( { browsers: [ "last 4 versions" ] } ),

fs = require( "fs" ),
pkg = require( "./package.json" ),

dest = pkg.dest,

/** Task definitions */
bs, gulp = require( "gulp" )

    /** Combine and uglify all js css */
	.task( "www:dist", function() {

		bs = browserSync( {
            server: {
				baseDir: "./dist",
                middleware: [ compress() ]
            }
		} );
	} )

    /** Standard file without uglify */
    .task( "www:dev", function() {

		bs = browserSync( {
			files: [ "src/**/*.css", "src/**/*.js", "src/demo/**/*.html" ],
            server: {
				baseDir: "./",
                index: "index-dev.html"
            }
		} );
    } )

    .task( "clean", function() {
        gulp.src( "dist" ).pipe( clean() );
    } )

    /** Project dependency */
    .task( "dist:vendor", function() {

		return gulp.src( [ "bower_components/jquery/dist/jquery.js",
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
    } )

    /** Component js and css */
    .task( "dist:neoui", function() {

        rjs.optimize( {
            baseUrl: "src",
            paths: {
                ui: "components"
            },
            optimize: "none",
            include: "bundle",
            out: "dist/" + NAME + ".js",
            onModuleBundleComplete: function( data ) {
                fs.writeFileSync( "dist/" + NAME + "+std.js", amdclean.clean( { "filePath": data.path } ) );

                gulp.src( "dist/" + NAME + ".js" )
                    .pipe( uglify() )
                    .pipe( rename( NAME + ".min.js" ) )
                    .pipe( gulp.dest( dest ) );

                gulp.src( "dist/" + NAME + "+std.js" )
                    .pipe( uglify() )
                    .pipe( rename( NAME + "+std.min.js" ) )
                    .pipe( gulp.dest( dest ) );
            }
        } );

	    return streamqueue( { objectMode: true },
                gulp.src( [ "src/style/main.less", "src/components/**/*.less", "!src/components/**/*-bs.less" ] ) )
			.pipe( debug() )
			.pipe( less( { plugins: [ autoprefix, cleancss ] } ) )
			.pipe( concat( NAME + ".css" ) )
			.pipe( gulp.dest( dest ) )
			.pipe( minifyCSS() )
            .pipe( rename( NAME + ".min.css" ) )
            .pipe( gulp.dest( dest ) );

    } )

    /** Demo page */
    .task( "dist:app", function() {

		rjs.optimize( {
		    baseUrl: "src",
            include: "bootstrap",
            optimize: "none",
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
            },
            onModuleBundleComplete: function( data ) {
                fs.writeFileSync( "dist/app+std.js", amdclean.clean( { "filePath": data.path } ) );

                gulp.src( "dist/app.js" )
                    .pipe( uglify() )
                    .pipe( rename( "app.min.js" ) )
                    .pipe( gulp.dest( dest ) );

                gulp.src( "dist/app+std.js" )
                    .pipe( uglify() )
                    .pipe( rename( "app+std.min.js" ) )
                    .pipe( gulp.dest( dest ) );
            }
		} );

        return gulp.src( [ "src/demo/**/*.less" ] )
			.pipe( debug() )
			.pipe( less( { plugins: [ autoprefix, cleancss ] } ) )
			.pipe( concat( "app.css" ) )
			.pipe( gulp.dest( dest ) )
			.pipe( minifyCSS() )
			.pipe( rename( "app.min.css" ) )
			.pipe( gulp.dest( dest ) );

    } )

    /** Hot deployment */
	.task( "dist", [ "dist:vendor", "dist:neoui", "dist:app" ], function() {

		var assets = useref.assets();

		gulp.src( [ "src/demo/**/*.html", "src/demo/**/*.json", "fonts/**/*", "images/**/*" ], { base: "." } )
			.pipe( gulp.dest( dest ) );

		gulp.src( "index.html" )
			.pipe( assets )
			.pipe( gulpif( "*.js", uglify() ) )
			.pipe( gulpif( "*.css", minifyCSS() ) )
			.pipe( rev() )
			.pipe( assets.restore() )
			.pipe( useref() )
			.pipe( revReplace() )
			.pipe( gulp.dest( dest ) );
	} )

    /** Auto compile */
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

	.task( "default", [ "data", "watch", "dist", "www:dev" ] );

pkg.dest = pkg.dest || "dist";
fs.existsSync( pkg.dest ) || fs.mkdirSync( pkg.dest );
