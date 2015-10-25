'use strict';
var distFolder = 'dist',
    appNameJs = 'minimum.js',
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    lintReporter = require('jshint-stylish'),
    notify = require('gulp-notify'),
    Server = require('karma').Server,
    uglyfly = require('gulp-uglyfly'),
    concat = require('gulp-concat-util'),
    sourceFiles = ['src/minimum.js','src/**/*.js'], //minimum always first
    testFiles = ['tests/**/*.js'];
    
gulp.task('lint', function() {
    var filesToLint = sourceFiles.concat(['gulpfile.js']);
    return gulp.src(filesToLint)
    		.pipe(jshint())
    		.pipe(jshint.reporter(lintReporter))
    		.pipe(jshint.reporter('fail')) //fails the stream when an error is found
    		.on('error', notify.onError(function (error) {
        		return { message: error.message,
        				 title: 'Minimum lint error'};
      		})); 
});

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
  new Server({
    configFile: __dirname + '/karma-tdd.conf.js'
  }, done).start();
});

gulp.task('concat:dist', function() {
  return gulp.src(sourceFiles)
    .pipe(concat(appNameJs, {process: function(src) { return (src.trim() + '\n').replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1'); }}))
    .pipe(concat.header('\'use strict\';\n'))
    .pipe(gulp.dest(distFolder));
});

gulp.task('uglyfly', ['concat:dist'], function(){
    return gulp.src(distFolder + '/' + appNameJs)
        .pipe(uglyfly())
        .pipe(rename({extname:'.min.js'}))
        .pipe(gulp.dest(distFolder));
});

//Main tasks
gulp.task('watch', function(){
	var listToWatch = sourceFiles;
	var watcher = gulp.watch(listToWatch, ['lint']);
	watcher.on('change', function(event) {
  		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});	
});

gulp.task('watchtdd', function(){
    var listToWatch = sourceFiles.concat(testFiles); 
    var watcher = gulp.watch(listToWatch, ['lint', 'tdd']);
    watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    }); 
});

gulp.task('default', ['lint', 'test']);
gulp.task('build:Debug', ['default']);
gulp.task('build:Release', ['default', 'uglyfly']);