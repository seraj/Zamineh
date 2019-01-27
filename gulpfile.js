var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-ruby-sass');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var uglifyjs = require('gulp-uglifyjs');
var rename = require('gulp-rename');
var inject = require('gulp-inject');
var removeFiles = require('gulp-remove-files');

var CacheBuster = require('gulp-cachebust');
var cachebust = new CacheBuster();
var replace = require('gulp-replace');

gulp.task('sass', function () {


    gulp.src('static/css/main.min.*.css')
        .pipe(removeFiles());

    var target = gulp.src('src/index.html');

    var sources = sass('static/scss/*.scss')
        .on('error', sass.logError)

        //  .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('static/css/seperated'))
        .pipe(concat('main.min.css')).pipe(gulp.dest('static/css'))

        .pipe(cachebust.resources())

        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))

        .pipe(gulp.dest('static/css'));

    target.pipe(inject(sources))
        .pipe(replace('.css">', '.css">'))
        .pipe(gulp.dest('src/'))


    return
});



gulp.task('minify-css', function () {
    return gulp.src(['static/css/*.css', '!static/css/main.min.*.css'])
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('static//css'));
});






gulp.task('run', function () {
    gulp.watch('static/scss/*.scss', ['sass']);
    gulp.watch('static/css/*.css', ['minify-css']);


})

