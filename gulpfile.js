'use strict';

var _ = require('underscore');
var fs = require('fs');
var glob = require('glob');
var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var clean = require('gulp-clean');

var SITE_OUTPUT_DIR = 'public/';

var deleteFolderRecursive = function (path) {
  if(fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file,index){
      var curPath = path + "/" + file;

      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

var makeDirectory = function (path) {
  var directories = path.split('/');
  for (var i in directories) {
    var directory = directories[i];
    if (!directory) continue;
    var p = directories.slice(0, i + 1);

    try {
      fs.mkdirSync(p.join('/'));
    } catch (e) {
      if (e.code !== 'EEXIST') console.log(e);
    }
  }
}

gulp.task('build', ['pug', 'sass', 'images', 'favicons', 'fonts']);

gulp.task('clean', function () {
  gulp.src('./public').pipe(clean({ force: true }));
});

gulp.task('pug', function () {
  gulp.src(['./views/**/*', '!./views/_*/**/*'])
    .pipe(pug())
    .pipe(gulp.dest('public'));
});

gulp.task('sass', function () {
  gulp.src('./assets/css/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/assets/css'));
});

gulp.task('misc', function () {
  gulp.src(['assets/misc/**/*'])
    .pipe(gulp.dest('public'));
});

gulp.task('fonts', function () {
  gulp.src(['assets/fonts/**/*'])
    .pipe(gulp.dest('public/assets/fonts'));
});

gulp.task('images', function () {
  gulp.src(['assets/images/**/*'])
    .pipe(gulp.dest('public/assets/images'));
});

gulp.task('favicons', function () {
  gulp.src(['assets/favicons/**/*'])
    // Favicons are supposed to be accessible from the root.
    .pipe(gulp.dest('public'));
});

gulp.task('watch', function () {
  gulp.watch(['./views/**/*', './assets/**/*'], ['build']);
});
