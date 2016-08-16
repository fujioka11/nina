/***************************************************************************
* DEPENDENCIES
***************************************************************************/

var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    plumber      = require('gulp-plumber'),
    reload       = browserSync.reload,
    rename       = require('gulp-rename'),
    rubySass     = require('gulp-ruby-sass'),
    sprite       = require('gulp.spritesmith'),
    uglify       = require('gulp-uglify'),
    sketch      = require("gulp-sketch"),
    imagemin    = require('gulp-imagemin'),
    filelog     = require('gulp-filelog'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    pleeease = require('gulp-pleeease')
;
var $ = require('gulp-load-plugins')();

/***************************************************************************
* FILE DESTINATIONS
***************************************************************************/

var paths = {
  'dest'      : './',
  'vhost'     : 'localhost',
  'port'      : 3000,
// html
  'htmlDest'  : 'htdocs',
  'htmlFiles' : '*.html',
// images
  'imgDest'   : 'img',
  'imgDir'    : 'src/img',

// scss
  'scssDest'  : 'src/scss',
  'scssFiles' : 'src/scss/**/*.scss',
// css
  'cssDest'   : 'htdocs/css',
  //sp
  'cssDest_sp'   : 'htdocs/sp/css',

// sketch
  srcDir  : './src/sketch',
  dstDir : './htdocs/img/thumnail',

}


// Static server
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: paths.dest
    },
    startPath: paths.htmlDest
  });
});

// Reload all browsers
gulp.task('bs-reload', function() {
  browserSync.reload()
});


gulp.task( 'sketchExport:slices', function(){
  var srcGlob    = paths.srcDir + '/thumnail.sketch';
  var dstGlob    = paths.dstDir;

  var sketchOptions = {
    export     : 'slices'
  };

  var imageminOptions = {
    optimizationLevel: 7
  };

  return gulp.src( srcGlob )
    .pipe(sketch( sketchOptions ))
    .pipe(imagemin( imageminOptions ))
    .pipe(gulp.dest( dstGlob ))
    .pipe(filelog());
});



/***************************************************************************
* Sass tasks
***************************************************************************/

gulp.task('rubySass', function () {
    gulp.src(paths.scssFiles)
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
        .pipe(plumber())
        .pipe(rubySass({
          r: 'sass-globbing',
          'sourcemap=none': true
        }))
        .pipe(pleeease({ // 追記
          autoprefixer: {
            browsers: ["last 2 versions", "ie >= 9", "Android >= 4","ios_saf >= 8"],
            cascade: false
          },
          minifier: false // minify無効
        }))
        .pipe(gulp.dest(paths.cssDest))
        .pipe(gulp.dest(paths.cssDest_sp))
        .pipe(browserSync.reload({stream: true}));

});

//svg管理
gulp.task('svg', function () {
  gulp.src('htdocs/svg/icons/*.svg')
    .pipe($.svgmin())
    .pipe($.svgstore({ inlineSvg: true }))
    .pipe($.cheerio({
      run: function ($, file) {
          $('svg').addClass('hide');
          $('[fill]').removeAttr('fill');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(gulp.dest('htdocs/svg'));
});

gulp.task('svg2png', function () {
  gulp.src('htdocs/svg/icons/*.svg')
    .pipe($.svg2png(3))
    .pipe($.rename({ prefix: "icons.svg." }))
    .pipe($.imagemin())
    .pipe(gulp.dest('htdocs/svg'));
});


/***************************************************************************
* gulp tasks
***************************************************************************/

gulp.task('watch', function() {
  //gulp.watch([paths.imgDest + '/sprite/*.png'], ['sprite']);
  gulp.watch([paths.htmlFiles], ['bs-reload']);
  /*gulp.watch([paths.jsDest], ['jsLib']);*/
  gulp.watch([paths.scssFiles], ['rubySass']);
});

gulp.task('default', [
    'browser-sync',
    'bs-reload',
    'rubySass',
    'svg',
    'svg2png',
    'watch'
]);


gulp.task( 'sketch', ['sketchExport:slices'] );
