
var

/** Plugin list */
rename = require( "gulp-rename" ),
concat = require( "gulp-concat" ),
uglify = require( "gulp-uglify" ),
jshint = require( "gulp-jshint" ),
browserSync = require( "browser-sync" ),
less = require( "gulp-less" ),
debug = require( "gulp-debug" ),

fs = require( "fs" ),
pkg = require( "./package.json" ),

/** Task definitions */
bs, gulp = require( "gulp" )

	.task( "vendor", function() {

		return gulp.src( [ "bower_components/jquery/dist/jquery.js",
				"bower_components/angular/angular.js",
				"bower_components/angular-route/angular-route.js",
				"bower_components/requirejs/require.js" ] )

			.pipe( concat( "vendor.js" ) )
			.pipe( gulp.dest( pkg.dest ) )
			.pipe( uglify() )
			.pipe( rename( "vendor.min.js" ) )
			.pipe( gulp.dest( pkg.dest ) );
	} )

	.task( "start", function() {

		bs = browserSync( {
			files: [ "css/**/*.css", "js/**/*.js" ],
			server: {
				baseDir: "./",
				index: "index.html"
			}
		} );
	} )

	.task( "css", function() {

		var 
		dest = pkg.dest,
		minifyCSS = require( "gulp-minify-css" );

		return gulp.src( [ "src/style/main.less", "src/components/**/*.less", "src/demo/**/*.less" ] )
			.pipe( debug() )
			.pipe( less() )
			.pipe( concat( "css.css" ) )
			.pipe( gulp.dest( dest ) )
			.pipe( minifyCSS() )
			.pipe( rename( "css.min.css" ) )
			.pipe( gulp.dest( dest ) );
	} )

	.task( "watch", function() {
		gulp.watch( "src/**/*.less", [ "css" ] );
		gulp.watch( "dist/style/css.min.css", function() {
			bs && bs.reload();
		} );
	} )

	.task( "jshint", function() {
		
		return gulp.src( "src/**/*.js" )
			.pipe( jshint( eval( "(" + fs.readFileSync( "./.jshintrc" ) + ")" ) ) )
			.pipe( jshint.reporter( "default" ) );
	} )

	.task( "default", [ "watch", "css", "start" ] );

pkg.dest = pkg.dest || "dist";
fs.existsSync( pkg.dest ) || fs.mkdirSync( pkg.dest );
