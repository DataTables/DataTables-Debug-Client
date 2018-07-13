var gulp = require('gulp');
var browserify = require('browserify');
var log = require('gulplog');
var tap = require('gulp-tap');
var buffer = require('gulp-buffer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ts = require('gulp-typescript');
var sass = require("gulp-sass");


gulp.task( 'debug-typescript', function () {
    var proj = ts.createProject( './tsconfig.json', {
        typescript: require('typescript')
    } );

    return gulp
        .src( './src/**/*.ts' )
        .pipe( sourcemaps.init() )
        .pipe( proj() )
        .pipe( sourcemaps.write('.') )
        .pipe( gulp.dest('./dist') );
 } );


 gulp.task( 'debug-browserify', function () {
	return gulp
		.src('dist/js/index.js', {read: false}) // no need of reading file because browserify does.

		// transform file objects using gulp-tap plugin
		.pipe(tap(function (file) {

			log.info('bundling ' + file.path);

			// replace file contents with browserify's bundle stream
			file.contents = browserify(file.path, {debug: true}).bundle();

		}))

		// transform streaming contents into buffer contents (because gulp-sourcemaps does not support streaming contents)
		.pipe(buffer())

		// load and init sourcemaps
		.pipe(sourcemaps.init({loadMaps: true}))

		.pipe(uglify())

		// write sourcemaps
		.pipe(sourcemaps.write('./'))

		.pipe(gulp.dest('dist'));
} );


gulp.task('debug-css', function () {
    return gulp.src('./src/css/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./dist/css/maps'))
        .pipe(gulp.dest('./dist'));
} );

gulp.task( 'default', gulp.series(
	'debug-typescript',
	'debug-browserify',
	'debug-css'
) );
