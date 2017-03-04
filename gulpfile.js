'use strict';

var _ = require('underscore');
var fs = require('fs');
var glob = require('glob');
var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var clean = require('gulp-clean');
var print = require('gulp-print');
var image = require('gulp-image');

var SITE_OUTPUT_DIR = 'public/';

gulp.task('build', ['pug', 'sass', 'images', 'favicons', 'fonts']);

gulp.task('clean', function () {
  gulp.src('./public').pipe(clean({ force: true }));
});

gulp.task('pug', function () {
  return gulp.src(['./views/**/*.pug', '!./views/_*/**/*'])
    .pipe(print())
    .pipe(pug().on('error', function (e) {
      console.log(e.message);
    }))
    .pipe(gulp.dest('public'));
});

gulp.task('sass', function () {
  return gulp.src('./assets/css/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/assets/css'));
});

gulp.task('misc', function () {
  return gulp.src(['assets/misc/**/*'])
    .pipe(gulp.dest('public'));
});

gulp.task('fonts', function () {
  return gulp.src(['assets/fonts/**/*'])
    .pipe(gulp.dest('public/assets/fonts'));
});

gulp.task('images', function () {
  return gulp.src(['assets/images/**/*'])
    .pipe(gulp.dest('public/assets/images'));
});

gulp.task('min-images', function () {
  return gulp.src(['assets/images/**/*'])
    .pipe(image())
    .pipe(gulp.dest('assets/images'));
});

gulp.task('favicons', function () {
  return gulp.src(['assets/favicons/**/*'])
    // Favicons are supposed to be accessible from the root.
    .pipe(gulp.dest('public'));
});

gulp.task('watch', function () {
  gulp.watch(['./views/**/*', './assets/**/*'], ['build']);
});
