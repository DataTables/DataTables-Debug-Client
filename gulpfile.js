var gulp = require('gulp');
var browserify = require('browserify');
var log = require('gulplog');
var tap = require('gulp-tap');
var buffer = require('gulp-buffer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ts = require('gulp-typescript');
var sass = require('gulp-sass')(require('node-sass'));
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var exec = require('child_process').exec;


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


 gulp.task( 'debug-browserify', function (cb) {
	 exec('./node_modules/.bin/browserify dist/js/index.js > dist/js/DT_Debug.js', function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	 });
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
