"use strict";

var gulp         = require('gulp'), // ���������� Gulp
    autoprefixer = require("autoprefixer"),// ���������� ���������� ��� ��������������� ���������� ���������
    cache        = require('gulp-cache'), // ���������� ���������� �����������
    concat       = require('gulp-concat'), // ���������� gulp-concat (��� ������������ ������)
    connectPHP   = require('gulp-connect-php'),//for php-files 'watch' support
    del          = require('del'), // ���������� ���������� ��� �������� ������ � �����
    imagemin     = require('gulp-imagemin'), // ������ ��������
    minifycss    = require('gulp-csso'), // ���������� ����� ��� ����������� CSS
    mqpacker     = require('css-mqpacker'), // ������������ media-���������
    plumber      = require('gulp-plumber'), // �� ��������� �������� ������ gulp ��� ������
    postcss      = require("gulp-postcss"),// ����� ��� autoprefixer � mqpacker
    rename       = require('gulp-rename'), // ���������� ���������� ��� �������������� ������
    run          = require('run-sequence'), // ��� ������� ������� ���������� ������
    sass         = require('gulp-sass'), //���������� Sass �����,
    browserSync  = require('browser-sync'),//browser autorefresh
    svgstore     = require('gulp-svgstore'), // �������� svg �������
    svgmin       = require('gulp-svgmin'), // ����������� svg �������
    uncss        = require('gulp-uncss'), // �������� ��������������� CSS-����
    uglify       = require('gulp-uglifyjs'); // ���������� gulp-uglifyjs (��� ������ JS)

//Paths variables//////////////////////////////////////////////////////////////
var paths = {
    html: './app/*.html',
    php: './app/**/*.php',
    sass: 'app/sass/**/*.+(scss|sass)',
    sassDir: 'app/sass/',
    cssDir: 'app/css',
    sassStyle: 'app/sass/style.scss',
    cssStyle: 'app/css/style.min.css',
    js: 'app/js/*.js',
    jsScriptDir: 'app/js',
    jsScript: 'app/js/script.js',
    img: 'app/img/**/*.{png,jpg,gif}',
    imgDir: 'app/img',
    svg: 'app/img/icons/*.svg',
    build: 'build',
    buildCss: 'build/css',
    buildLibs: 'build/libs',
    buildFonts: 'build/fonts',
    buildImg: 'build/img',
    buildJs: 'build/js'
};

//browserSync options//////////////////////////////////////////////////////////
gulp.task('browserSync', function () {
  browserSync({
    proxy: 'test.devp//' //current site name(domain in OS, ex.)
  });
});

//browserSync options for php//////////////////////////////////////////////////
gulp.task('php-server', function () {
    connectPHP.server({
        base: './',
        keepalive: true,
        hostname: 'test.devp//', //current site name(domain in OS, ex.)
        open: false,
        notify: false,
        ui: false //turn off browserSync ui page
    });
});

//Php-files resfresh on change//////////////////////////////////////////////////
gulp.task('php-update', function() {
  return gulp.src(paths.php) // ����� ��������
    .pipe(browserSync.reload({stream: true}));
});

//Sass-files manipulations/////////////////////////////////////////////////////
gulp.task('sass', function() { // ������� ���� Sass
  return gulp.src(paths.sassStyle) // ����� ��������
    .pipe(plumber())
    .pipe(sass()) // ����������� Sass � CSS ����������� gulp-sass
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 versions"
      ]}),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(uncss({html: [paths.html]}))
    .pipe(minifycss()) // �������
    .pipe(rename({suffix: '.min'})) // ��������� ������� .min
    .pipe(gulp.dest(paths.cssDir)) // ��������� ��������� � ����� app/css
    .pipe(browserSync.reload({stream: true}));
});

//Html-files refresh on change/////////////////////////////////////////////////
gulp.task('html-update', function() {
  return gulp.src(paths.html) // ����� ��������
    .pipe(browserSync.reload({stream: true}));
});

//Script.js-file manipulation//////////////////////////////////////////////////
gulp.task('script-update', function() {
  return gulp.src(paths.jsScript) // ����� ��������
    .pipe(server.stream());
});

//Script.js minification///////////////////////////////////////////////////////
gulp.task('script-min', function() {
    return gulp.src(paths.jsScript) //script.js in app/js
        .pipe(rename({suffix: '.min'})) // ��������� ������� .min
        .pipe(uglify()) // ������� JS ����
        .pipe(gulp.dest(paths.jsScriptDir)); // ��������� � ����� app/js
});

//Images optimization//////////////////////////////////////////////////////////
gulp.task('images', function() {
  return gulp.src(paths.img)
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),//1-max.; 3-safe; 10-no compress.
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest(paths.imgDir));
});

//SVG optimization(sprite)/////////////////////////////////////////////////////
gulp.task('symbols', function() {
  return gulp.src(paths.svg)
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('symbols.svg'))
    .pipe(gulp.dest(paths.imgDir));
});

//Gulp watch for changes///////////////////////////////////////////////////////
gulp.task('watch', ['sass'], function() {
    gulp.watch(paths.sass, ['sass']); // ���������� �� sass �������
    gulp.watch(paths.html, ['html-update']);
    gulp.watch(paths.php, ['php-update']);
    gulp.watch(paths.jsScript, ['script-update']);
    // ���������� �� ������� ������ ������
});

//Clean 'build' dir before compilation/////////////////////////////////////////
gulp.task('clean', function() {
    return del.sync(paths.build); // ������� ����� ������ ������� build ����� ��������� �������
});

//Project compilation//////////////////////////////////////////////////////////
gulp.task('build', ['clean', 'sass', 'script-min', 'images', 'symbols'], function() {
    var buildCss = gulp.src(paths.cssStyle)
    .pipe(gulp.dest('build/css'))

    var buildCss = gulp.src('app/libs/*.css') //������� ������������ js ���������
    .pipe(gulp.dest(paths.buildLibs))

    var buildFonts = gulp.src('app/fonts/**/*.{woff,woff2}*') // ��������� ������ � ���������
    .pipe(gulp.dest(paths.buildFonts))

    var buildImg = gulp.src('app/img/**/*') // ��������� �������� � ���������
    .pipe(gulp.dest(paths.buildImg))

    var buildLibs = gulp.src('app/libs/*.js') // ��������� ���������� � ���������
    .pipe(gulp.dest(paths.buildLibs))

    var buildJs = gulp.src('app/js/script.min.js') // ��������� �������� ������ ������� � ���������
    .pipe(gulp.dest(paths.buildJs))

    var buildHtml = gulp.src('app/*.html') // ��������� HTML � ���������
    .pipe(gulp.dest(paths.build))

    var buildPhp = gulp.src('app/**/*.php') // ��������� PHP � ���������
    .pipe(gulp.dest(paths.build))
});

//Cache clean//////////////////////////////////////////////////////////////////
gulp.task('clear', function () {
    return cache.clearAll();
});

//Gulp defaul on 'gulp' command////////////////////////////////////////////////
gulp.task('default', ['watch', 'browserSync', 'php-server']);