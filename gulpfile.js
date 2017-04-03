var gulp = require('gulp'), // ���������� Gulp
    sass = require('gulp-sass'); // ���������� Sass �����

gulp.task('sass', function() { // ������� ���� "sass"
  return gulp.src(['sass/**/*.sass', 'sass/**/*.scss']) // ����� ��������
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) // ����������� Sass � CSS ����������� gulp-sass
    .pipe(gulp.dest('css')) // ��������� ���������� � ����� css
  });

gulp.task('watch', function() {
  gulp.watch(['sass/**/*.sass', 'sass/**/*.scss'], ['sass']); // ���������� �� sass ������� � ����� sass
});

gulp.task('default', ['watch']);