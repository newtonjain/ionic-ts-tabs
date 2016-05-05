var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
    sass: ['./scss/**/*.scss'],
    tsc: ['./app/**/*.ts']
};

gulp.task('default', ['sass','tsc']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

// Run gulp watch in conjunction with Ionic serve to 
// reflect live changes to TypeScript files in app directory
gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.tsc, ['tsc']);
});

// Run gulp tsc to transpile your TypeScript files from
// app directory to www/js directory
gulp.task('tsc', function() {
  var ts = require('gulp-typescript');
  var tsProject = ts.createProject('tsconfig.json');
	var tsResult = tsProject.src('app')  
		.pipe(ts(tsProject));
	
	return tsResult.js.pipe(gulp.dest('www/js/'));
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});