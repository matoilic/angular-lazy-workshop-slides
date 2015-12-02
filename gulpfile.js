const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const sync = require('gulp-sync')(gulp);
const connect = require('gulp-connect');
const plumber = require('gulp-plumber');
const fs = require('fs');
const path = require('path');
const compile = require('./lib/gulp-compiler');

const paths = {
    slides: 'src/slides/**/*.hbs',
    stylesheets: 'src/**/*.scss',
    examples: 'code/**/*',
    presentation: 'src/index.hbs'
};

gulp.task('compile-slides', function() {
    return gulp
        .src(paths.slides)
        .pipe(plumber())
        .pipe(compile())
        .pipe(gulp.dest('build/slides'));
});

gulp.task('compile-presentation', function() {
    return gulp
        .src(paths.presentation)
        .pipe(plumber())
        .pipe(compile())
        .pipe(gulp.dest('build'));
});

gulp.task('compile-stylesheets', function() {
    return gulp
        .src(paths.stylesheets)
        .pipe(plumber())
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
        .pipe(plumber())
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
