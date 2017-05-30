var gulp        = require('gulp'), // Подключаем Gulp
    sass        = require('gulp-sass'), //Подключаем Sass пакет,
    concat      = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    plumber     = require("gulp-plumber"),
    uglify      = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano     = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename      = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del         = require('del'), // Подключаем библиотеку для удаления файлов и папок
    cache       = require('gulp-cache'), // Подключаем библиотеку кеширования
    autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов

gulp.task('sass', function(){ // Создаем таск Sass
    return gulp.src('app/sass/style.scss') // Берем источник
        .pipe(plumber())
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
});

gulp.task('script-min', function() {
    return gulp.src('app/js/script.js') //script.js in app/js
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('css-build', function() {
    return gulp.src('app/css/*.css') //All *.css in app/css
        .pipe(concat('main.css')) // Собираем их в кучу в новом файле main.css
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('watch', ['sass'], function() {
    gulp.watch('app/sass/**/*.+(scss|sass)', ['sass']); // Наблюдение за sass файлами
    // Наблюдение за другими типами файлов
});

gulp.task('clean', function() {
    return del.sync('prod'); // Удаляем папку dist перед сборкой
});

gulp.task('build', ['clean', 'sass', 'script-min', 'css-build'], function() {
    var buildCss = gulp.src('app/css/main.min.css')
    .pipe(gulp.dest('prod/css'))

    var buildCss = gulp.src('app/libs/*.css')
    .pipe(gulp.dest('prod/libs'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('prod/fonts'))

    var buildImg = gulp.src('app/img/**/*') // Переносим картинки в продакшен
    .pipe(gulp.dest('prod/img'))

    var buildJs = gulp.src('app/libs/*.js') // Переносим скрипты в продакшен
    .pipe(gulp.dest('prod/libs'))

    var buildJs = gulp.src('app/js/script.min.js') // Переносим основной скрипт проекта в продакшен
    .pipe(gulp.dest('prod/js'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('prod'));
});

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch']);