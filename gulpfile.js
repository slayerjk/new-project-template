"use strict";

var gulp         = require('gulp'), // Подключаем Gulp
    autoprefixer = require('gulp-autoprefixer'),// Подключаем библиотеку для автоматического добавления префиксов
    cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
    concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin     = require('gulp-imagemin'), // Сжатие картинок
    minifycss    = require('gulp-csso'), // Подключаем пакет для минификации CSS
    mqpacker     = require('css-mqpacker'), // Оптимизирует media-выражения
    plumber      = require('gulp-plumber'), // Не позволяет звершать работу gulp при ошибке
    rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    run          = require('run-sequence'), // Для задания очереди исполнения тасков
    sass         = require('gulp-sass'), //Подключаем Sass пакет,
    server       = require('browser-sync').create(),//browser autorefresh
    svgstore     = require('gulp-svgstore'), // Создание svg слайдов
    svgmin       = require('gulp-svgmin'), // Минификация svg слайдов
    uglify       = require('gulp-uglifyjs'); // Подключаем gulp-uglifyjs (для сжатия JS)

gulp.task('sass', function() { // Создаем таск Sass
    return gulp.src('app/sass/style.scss') // Берем источник
        .pipe(plumber())
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(server.stream());
});

gulp.task('html-update', function() {
  return gulp.src('app/*.html') // Берем источник
    .pipe(server.stream());
});

gulp.task('script-update', function() {
  return gulp.src('app/js/script.js') // Берем источник
    .pipe(server.stream());
});

gulp.task('server', ['sass'], function() {
  server.init({
    server: '.',
    notify: false,
    open: true,
    cors: true,
    ui: false
  })
});

gulp.task('script-min', function() {
    return gulp.src('app/js/script.js') //script.js in app/js
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('css-min', function() {
    return gulp.src('app/css/style.css') //style.css in app/css
        .pipe(mqpacker({sort: true})) //Оптимизация(сортировка) медиа-выражений
        .pipe(minifycss()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('symbols', function() {
  return gulp.src('app/img/icons/*.svg')
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('symbols.svg'))
    .pipe(gulp.dest('build/img'));
});

gulp.task('watch', ['sass'], function() {
    gulp.watch('app/sass/**/*.+(scss|sass)', ['sass']); // Наблюдение за sass файлами
    gulp.watch('app/*.html', ['html-update']);
    gulp.watch('app/js/script.js', ['script-update']);
    // Наблюдение за другими типами файлов
    server.init({
      server: "app/"
    });
});

gulp.task('clean', function() {
    return del.sync('build'); // Удаляем папку сборки проекта build перед следующей сборкой
});

gulp.task('build', ['clean', 'sass', 'script-min', 'css-min', 'symbols'], function() {
    var buildCss = gulp.src('app/css/style.min.css')
    .pipe(gulp.dest('build/css'))

    var buildCss = gulp.src('app/libs/*.css')
    .pipe(gulp.dest('build/libs'))

    var buildFonts = gulp.src('app/fonts/**/*.{woff,woff2}*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('build/fonts'))

    var buildImg = gulp.src("app/img/**/*.{png,jpg,gif}") // Переносим картинки в продакшен
    .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),//1-max.; 3-safe; 10-no compress.
    //imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest("build/img"));

    var buildLibs = gulp.src('app/libs/*.js') // Переносим скрипты в продакшен
    .pipe(gulp.dest('build/libs'))

    var buildJs = gulp.src('app/js/script.min.js') // Переносим основной скрипт проекта в продакшен
    .pipe(gulp.dest('build/js'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('build'));
});

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch']);