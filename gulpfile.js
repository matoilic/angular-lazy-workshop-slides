var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var sync = require('gulp-sync')(gulp);
var connect = require('gulp-connect');
var cached = require('gulp-cached');
var fs = require('fs');
var path = require('path');
var compile = require('./lib/gulp-compiler');

var paths = {
    slides: 'src/slides/**/*.hbs',
    stylesheets: 'src/**/*.scss',
    examples: 'code/**/*',
    presentation: 'src/index.hbs'
};

gulp.task('compile-slides', function() {
    return gulp
        .src(paths.slides)
        //.pipe(cached('docs'))
        .pipe(compile())
        .pipe(gulp.dest('build/slides'));
});

gulp.task('compile-presentation', function() {
    return gulp
        .src(paths.presentation)
        .pipe(compile())
        .pipe(gulp.dest('build'));
});

gulp.task('compile-stylesheets', function() {
    return gulp
        .src(paths.stylesheets)
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded',
            includePaths: [
                path.resolve('node_modules')
            ]
        }))
        .pipe(sourcemaps.write('.', {
            sourceRoot: '/source'
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('notify-recompiled', function() {
    return gulp
        .src(paths.presentation)
        .pipe(connect.reload())
        .pipe(notify('recompiled changed files'));
});

gulp.task('watch', function() {
    gulp.watch(paths.stylesheets, sync.sync(['compile-stylesheets', 'notify-recompiled']));
    gulp.watch(paths.slides, sync.sync(['compile', 'notify-recompiled']));
    gulp.watch(paths.examples, sync.sync(['compile', 'notify-recompiled']));
    gulp.watch(paths.presentation, sync.sync(['compile-presentation', 'notify-recompiled']));
});

gulp.task('connect', function() {
    connect.server({
        root: '.',
        livereload: true,
        port: 8088
    });
});

gulp.task('compile', sync.sync(['compile-slides', 'compile-presentation']));

gulp.task('default', ['compile', 'compile-stylesheets', 'connect', 'watch']);
