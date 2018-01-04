'use strict';

/**
 * Build Process for LESS + JS
 */
const gulp = require( 'gulp' );
const include = require( 'gulp-include' );
const sass = require( 'gulp-sass' );
const path = require( 'path' );
const uglify = require( 'gulp-uglify' );
const pump = require( 'pump' );
const autoprefixer = require( 'gulp-autoprefixer' );
const cleanCSS = require( 'gulp-clean-css' );
const rename = require( 'gulp-rename' );
const replace = require( 'gulp-replace' );
const fs = require( 'fs' );
const util = require( 'gulp-util' );
const jsValidate = require( 'gulp-jsvalidate' );
const jshint = require( 'gulp-jshint' );
const stylish = require( 'jshint-stylish' );
const nunjucks = require( 'gulp-nunjucks' );

// Runs relative to ./
//process.chdir( __dirname + '/assets' );

// Build tasks
gulp.task( 'sass', compileSASS );
gulp.task( 'js', compileJS );
gulp.task( 'js-debug', debugJS );
gulp.task( 'default', watch );
gulp.task( 'html', [ 'js', 'sass' ], compileHTML );
gulp.task( 'build', [ 'html' ] );

// Adds a version string to a file
var appendVersion = function( filename ) {
	var version = getVersion( filename );
	var src = filename.substring( 1 );
	return src + '?v=' + version;
};

// Get version string for a file
var getVersion = function( filename ) {
	var filepath = path.resolve( __dirname, 'assets', filename );
	var stats = fs.statSync( filepath );
	return new Date( stats.mtime ).getTime();
};

// Error handler
function pumpDone( error ) {
	if ( !error ) return;
	console.log( error );
}

// Debug JavaScript
function debugJS() {
	return pump( [
		gulp.src( 'js/main.js' ),
		include( {
			extensions: 'js'
		} ),
		jshint(),
		jshint.reporter( stylish )
	], pumpDone );
}

// HTML compile
function compileHTML() {
	var context = {
		js: {
			main: '/assets/' + appendVersion( './dist/main.min.js' )
		},
		css: {
			main: '/assets/' + appendVersion( './dist/main.min.css' )
		},
		versions: {
			js: getVersion( './dist/main.min.js' ),
			css: getVersion( './dist/main.min.css' )
		}
	};

	var config = {
		tags: {
			blockStart: '<%',
			blockEnd: '%>',
			variableStart: '<$',
			variableEnd: '$>',
			commentStart: '<#',
			commentEnd: '#>'
		}
	};

	return pump( [
		gulp.src( 'index.njk' ),
		nunjucks.compile( context, config ),
		rename( 'index.html' ),
		gulp.dest( '.' )
	], pumpDone );
}

// Compile App JavaScript
function compileJS() {
	return pump( [
		gulp.src( 'js/main.js' ),
		include( {
			extensions: 'js'
		} ),
		jsValidate(),
		uglify(),
		rename( {
			suffix: ".min"
		} ),
		gulp.dest( './dist' )
	], pumpDone );
}

// Compile SASS
function compileSASS() {
	return pump( [
		gulp.src( 'sass/main.scss' ),
		sass(),
		autoprefixer( {
			browsers: [ 'last 2 versions' ],
			cascade: false
		} ),
		cleanCSS( {
			compatibility: 'ie9'
		} ),
		rename( {
			suffix: ".min"
		} ),
		gulp.dest( 'dist' )
	], pumpDone );
}

// Watch files and run tasks if they change
function watch() {
	gulp.watch( [ 'sass/*.scss' ], [ 'html' ] );
	gulp.watch( 'js/*.js', [ 'html' ] );
	gulp.watch( '*.njk', [ 'html' ] );
}
