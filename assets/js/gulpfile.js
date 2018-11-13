'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
gulp.task('workflow', function () {
 gulp.src('./src/sass/**/*.scss')
 .pipe(sourcemaps.init())
 .pipe(sass().on('error', sass.logError))
 .pipe(autoprefixer({
 browsers: ['last 2 versions'],
 cascade: false
 }))
 .pipe(cssnano())
 .pipe(sourcemaps.write('./'))
 .pipe(gulp.dest('./dist/css/'))
});
gulp.task('default', function () {
 gulp.watch('./src/sass/**/*.scss', ['workflow']);
});

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
gulp.task('lint', function() {
 return gulp.src('src/js/*.js')
 .pipe(jshint())
 .pipe(jshint.reporter('default'));
});
// Concatenate & Minify JS
gulp.task('scripts', function() {
 return gulp.src('./src/js/*.js')
 .pipe(concat('scripts.js'))
 .pipe(gulp.dest('./dist/js'))
 .pipe(rename('scripts.min.js'))
 .pipe(uglify())
 .pipe(gulp.dest('./dist/js'));
});
gulp.task('default', function() {
 gulp.watch('./src/js/*.js', ['lint', 'scripts']);
 gulp.watch('./src/sass/**/*.scss',
['sassworkflow']);
})

var browserSync = require('browser-sync').create();
gulp.task('browserSync', function() {
 browserSync.init({
 server: {
 baseDir: './',
 index: "index.html"
 },
 })
})
gulp.task('sassworkflow', function () {
 gulp.src('./src/sass/**/*.scss')
 // tasks go here
 .pipe(sourcemaps.init())
 .pipe(sass().on('error', sass.logError))
 .pipe(autoprefixer({
 browsers: ['last 2 versions'],
 cascade: false
 }))
 .pipe(cssnano())
 .pipe(sourcemaps.write('./'))
 .pipe(gulp.dest('./dist/css/'))
 .pipe(browserSync.reload({
 stream: true
 }));
});
