var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var sync = require('gulp-sync')(gulp);
var fs = require('fs');
var path = require('path');
var compile = require('./lib/gulp-compiler');

var paths = {
    docs: 'src/**/*.hbs',
    stylesheets: 'src/**/*.scss'
};

gulp.task('compile', function() {
    return gulp
        .src(paths.docs)
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
        .src(paths.docs)
        .pipe(notify('recompiled changed files'));
});

gulp.task('watch', function() {
    gulp.watch(paths.stylesheets, sync.sync(['compile-stylesheets', 'notify-recompiled']));
    gulp.watch(paths.docs, sync.sync(['compile', 'notify-recompiled']));
});

gulp.task('default', ['compile', 'compile-stylesheets', 'watch']);
