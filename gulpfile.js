var gulp      = require('gulp'), // ���������� Gulp
    sass        = require('gulp-sass'), //���������� Sass �����,
    concat      = require('gulp-concat'), // ���������� gulp-concat (��� ������������ ������)
    uglify      = require('gulp-uglifyjs'), // ���������� gulp-uglifyjs (��� ������ JS)
    cssnano     = require('gulp-cssnano'), // ���������� ����� ��� ����������� CSS
    rename      = require('gulp-rename'), // ���������� ���������� ��� �������������� ������
    del         = require('del'), // ���������� ���������� ��� �������� ������ � �����
    cache       = require('gulp-cache'), // ���������� ���������� �����������
    autoprefixer = require('gulp-autoprefixer');// ���������� ���������� ��� ��������������� ���������� ���������

gulp.task('sass', function(){ // ������� ���� Sass
    return gulp.src('app/sass/**/*.+(scss|sass)') // ����� ��������
        .pipe(sass()) // ����������� Sass � CSS ����������� gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // ������� ��������
        .pipe(gulp.dest('app/css')) // ��������� ���������� � ����� app/css
});


gulp.task('script-min', function() {
    return gulp.src('app/js/script.js') //script.js in app/js
        .pipe(rename({suffix: '.min'})) // ��������� ������� .min
        .pipe(uglify()) // ������� JS ����
        .pipe(gulp.dest('app/js')); // ��������� � ����� app/js
});


gulp.task('css-build', function() {
    return gulp.src('app/css/*.css') //All *.css in app/css
        .pipe(concat('main.css')) // �������� �� � ���� � ����� ����� main.css
        .pipe(cssnano()) // �������
        .pipe(rename({suffix: '.min'})) // ��������� ������� .min
        .pipe(gulp.dest('app/css')); // ��������� � ����� app/css
});

  gulp.task('watch', ['sass'], function() {
    gulp.watch('app/sass/**/*.+(scss|sass)', ['sass']); // ���������� �� sass �������
    // ���������� �� ������� ������ ������
});

gulp.task('clean', function() {
    return del.sync('prod'); // ������� ����� dist ����� �������
});

gulp.task('build', ['clean', 'sass', 'script-min', 'css-build'], function() {
    var buildCss = gulp.src('app/css/main.min.css')
    .pipe(gulp.dest('prod/css'))

    var buildCss = gulp.src('app/libs/*.css')
    .pipe(gulp.dest('prod/libs'))

    var buildFonts = gulp.src('app/fonts/**/*') // ��������� ������ � ���������
    .pipe(gulp.dest('prod/fonts'))

    var buildImg = gulp.src('app/img/**/*') // ��������� �������� � ���������
    .pipe(gulp.dest('prod/img'))

    var buildJs = gulp.src('app/libs/*.js') // ��������� ������� � ���������
    .pipe(gulp.dest('prod/libs'))

    var buildJs = gulp.src('app/js/script.min.js') // ��������� ������� � ���������
    .pipe(gulp.dest('prod/js'))

    var buildHtml = gulp.src('app/*.html') // ��������� HTML � ���������
    .pipe(gulp.dest('prod'));
});

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch']);
