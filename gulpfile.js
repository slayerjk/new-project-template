"use strict";

var gulp         = require('gulp'), // Подключаем Gulp
    autoprefixer = require("autoprefixer"),// Подключаем библиотеку для автоматического добавления префиксов
    cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
    concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    connectPHP   = require('gulp-connect-php'),//for php-files 'watch' support
    del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin     = require('gulp-imagemin'), // Сжатие картинок
    minifycss    = require('gulp-csso'), // Подключаем пакет для минификации CSS
    mqpacker     = require('css-mqpacker'), // Оптимизирует media-выражения
    plumber      = require('gulp-plumber'), // Не позволяет звершать работу gulp при ошибке
    postcss      = require("gulp-postcss"),// Нужен для autoprefixer и mqpacker
    rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    run          = require('run-sequence'), // Для задания очереди исполнения тасков
    sass         = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync  = require('browser-sync'),//browser autorefresh
    svgstore     = require('gulp-svgstore'), // Создание svg слайдов
    svgmin       = require('gulp-svgmin'), // Минификация svg слайдов
    uncss        = require('gulp-uncss'), // Удаление неиспользуемого CSS-кода
    uglify       = require('gulp-uglifyjs'); // Подключаем gulp-uglifyjs (для сжатия JS)

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
  return gulp.src(paths.php) // Берем источник
    .pipe(browserSync.reload({stream: true}));
});

//Sass-files manipulations/////////////////////////////////////////////////////
gulp.task('sass', function() { // Создаем таск Sass
  return gulp.src(paths.sassStyle) // Берем источник
    .pipe(plumber())
    .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 versions"
      ]}),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(uncss({html: [paths.html]}))
    .pipe(minifycss()) // Сжимаем
    .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
    .pipe(gulp.dest(paths.cssDir)) // Выгружаем результат в папку app/css
    .pipe(browserSync.reload({stream: true}));
});

//Html-files refresh on change/////////////////////////////////////////////////
gulp.task('html-update', function() {
  return gulp.src(paths.html) // Берем источник
    .pipe(browserSync.reload({stream: true}));
});

//Script.js-file manipulation//////////////////////////////////////////////////
gulp.task('script-update', function() {
  return gulp.src(paths.jsScript) // Берем источник
    .pipe(server.stream());
});

//Script.js minification///////////////////////////////////////////////////////
gulp.task('script-min', function() {
    return gulp.src(paths.jsScript) //script.js in app/js
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest(paths.jsScriptDir)); // Выгружаем в папку app/js
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
    gulp.watch(paths.sass, ['sass']); // Наблюдение за sass файлами
    gulp.watch(paths.html, ['html-update']);
    gulp.watch(paths.php, ['php-update']);
    gulp.watch(paths.jsScript, ['script-update']);
    // Наблюдение за другими типами файлов
});

//Clean 'build' dir before compilation/////////////////////////////////////////
gulp.task('clean', function() {
    return del.sync(paths.build); // Удаляем папку сборки проекта build перед следующей сборкой
});

//Project compilation//////////////////////////////////////////////////////////
gulp.task('build', ['clean', 'sass', 'script-min', 'images', 'symbols'], function() {
    var buildCss = gulp.src(paths.cssStyle)
    .pipe(gulp.dest('build/css'))

    var buildCss = gulp.src('app/libs/*.css') //Перенос подключаемых js библиотек
    .pipe(gulp.dest(paths.buildLibs))

    var buildFonts = gulp.src('app/fonts/**/*.{woff,woff2}*') // Переносим шрифты в продакшен
    .pipe(gulp.dest(paths.buildFonts))

    var buildImg = gulp.src('app/img/**/*') // Переносим картинки в продакшен
    .pipe(gulp.dest(paths.buildImg))

    var buildLibs = gulp.src('app/libs/*.js') // Переносим библиотеки в продакшен
    .pipe(gulp.dest(paths.buildLibs))

    var buildJs = gulp.src('app/js/script.min.js') // Переносим основной скрипт проекта в продакшен
    .pipe(gulp.dest(paths.buildJs))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest(paths.build))

    var buildPhp = gulp.src('app/**/*.php') // Переносим PHP в продакшен
    .pipe(gulp.dest(paths.build))
});

//Cache clean//////////////////////////////////////////////////////////////////
gulp.task('clear', function () {
    return cache.clearAll();
});

//Gulp defaul on 'gulp' command////////////////////////////////////////////////
gulp.task('default', ['watch', 'browserSync', 'php-server']);