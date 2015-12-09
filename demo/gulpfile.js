var gulp = require('gulp');
var del = require('del');
var colors = require('colors');
var rename = require('gulp-rename');
var imageOptim = require('gulp-imageoptim');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var svgmin = require('gulp-svgmin');
var svgSprite = require('gulp-svg-sprite');
var svg2png = require('gulp-svg2png');
var webp = require('gulp-webp');

var path = {
  src: 'source',
  sprite: 'sprite',
  dist: 'dist'
};



gulp.task('clean', function(callback) {
  return del([
    path.dist,
    path.sprite
    ], function(err, deletedFiles) {
    console.log('Files deleted:\n'.bold.green , deletedFiles.join(',\n '));
    callback();
  });
});

gulp.task('img-source', function() {
  return gulp.src( path.src + '/**/*.+(png|jpg|gif|svg)' )
    .pipe(rename({ suffix: "--src" }))
    .pipe(gulp.dest( path.dist ));
});

gulp.task('img-optim', ['img-source'], function() {
  gulp.src( path.src + '/**/*.+(png|jpg)' )
    .pipe(imageOptim.optimize({
      imageAlpha: false,
      quitAfter: false
    }))
    .pipe(rename({ suffix: "-imgo"}))
    .pipe(gulp.dest( path.dist ));
});

gulp.task('img-min', ['img-source'], function() {
  return gulp.src( path.src + '/**/*.+(png|jpg)' )
    .pipe(imagemin({
        progressive: true,
        use: [pngquant()]
    }))
    .pipe(rename({ suffix: "-imgmin"}))
    .pipe(gulp.dest( path.dist ));
});

gulp.task('svg-min', ['img-source'], function () {
  return gulp.src( path.src + '/**/*.svg' )
    .pipe(rename({ suffix: "-svgo"}))
    .pipe(svgmin({
      plugins: [
        {convertColors: false},
        {removeAttrs: {attrs: ['fill']}}
      ]
    }))
    .pipe(gulp.dest( path.dist ));
});

gulp.task('webp', ['img-source'], function () {
  return gulp.src( path.src + '/**/*.+(png|jpg|gif)' )
    .pipe(webp())
    .pipe(gulp.dest( path.dist ));
});

gulp.task('svg-sprite', function () {
  return gulp.src( path.src + '/svg/*.svg' )
    .pipe(svgSprite({
      dest: path.spriteDist,
      mode: {
        symbol: {
          dest: './',
          sprite: 'icons'
        }
      }
    }))
    .pipe(gulp.dest( path.sprite ));
});

gulp.task('svg-to-png', function () {
  return gulp.src( path.src + '/svg/*.svg' )
    .pipe(svg2png())
    .pipe(gulp.dest( path.sprite + '/png' ));
});
