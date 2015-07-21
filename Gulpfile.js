
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
		minifyCSS = require( "gulp-minify-css" ),
    cleancss = new (require( "less-plugin-clean-css" ))( { advanced: true } ),
    autoprefix = new (require( "less-plugin-autoprefix" ))( { browsers: [ "last 4 versions" ] } );

		return gulp.src( [ "src/style/main.less", "src/components/**/*.less", "src/demo/**/*.less" ] )
			.pipe( debug() )
			.pipe( less( { plugins: [ autoprefix, cleancss ] } ) )
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

	.task( "treeData", function() {

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

                        result.push( {
                            id: file,
                            parent: dir,
                            name: file.substr( dir.length ).replace( "/", "" )
                        } );

						if ( !/(node_modules|\.git)/i.test( file )
						        && stat && stat.isDirectory() ) {

							walk( file, function( err, res ) {
								result = result.concat( res );
								next();
							} );
						} else {
                            /** Regular file */
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

	.task( "init", [ "vendor", "css" ] )

	.task( "default", [ "watch", "css", "start" ] );

pkg.dest = pkg.dest || "dist";
fs.existsSync( pkg.dest ) || fs.mkdirSync( pkg.dest );
