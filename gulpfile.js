'use strict'

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');

gulp.task('sass', async function() {
    gulp.src('./css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', async function() {

    gulp.watch('./css/*.scss', gulp.parallel('sass'));
});

gulp.task('browser-sync', function() {
    var files = ['./*.html', './css/*.css', './images/*.{png, jpg, gif}', './js/*.js']
    browserSync.init(files, {
        server: {
            baseDir: './'
        }
    });
});

//Aqui se modifico.
gulp.task('default', gulp.parallel('browser-sync', 'sass:watch'));

gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('copyfonts', async function() {
    gulp.src('node_modules/open-iconic/font/fonts/*.{ttf,woff,eof,svg,eot,otf}*')
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('imagemin', function() {
    return gulp.src('./images/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('usemin', function() {
    return gulp.src('./*.html')
        .pipe(flatmap(function(stream, file) {
            return stream
                .pipe(usemin({
                    css: [rev()],
                    html: [function() { return htmlmin({ collapseWhitespace: true }) }],
                    js: [uglify(), rev()],
                    inlinejs: [uglify()],
                    inlinecss: [cleanCss(), 'concat']
                }));
        }))
        .pipe(gulp.dest('dist/'));
    //flat map allows us to process in paralel
});


//Aqui se modifico.
gulp.task('build', gulp.series('clean', gulp.parallel('copyfonts', 'imagemin', 'usemin')));