'use strict';

var _ = require('underscore');
var fs = require('fs');
var glob = require('glob');
var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('pug');

var SITE_OUTPUT_DIR = '_site/';

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

gulp.task('pug', function (done) {
  deleteFolderRecursive(SITE_OUTPUT_DIR);
  fs.mkdirSync(SITE_OUTPUT_DIR);

  glob('**/*.pug', { ignore: ['node_modules/**/*', '_*/**/*'] }, function (err, matches) {
    if (err) return done();

    for (var i in matches) {
      var pugFilename = matches[i];
      var htmlFilename = SITE_OUTPUT_DIR + pugFilename.replace(/\.pug$/, '.html');
      var htmlDirectory = htmlFilename.replace(/[^/]+\.html/, '');
      var html = pug.renderFile(pugFilename);

      makeDirectory(htmlDirectory);
      fs.writeFileSync(htmlFilename, html, { flag: 'w' });
    }
  })
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
  gulp.watch('./**/*', ['build']);
});
