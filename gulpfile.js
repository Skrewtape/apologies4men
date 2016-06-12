var browserSync = require('browser-sync').create();
var gulp = require('gulp')
var sass = require('gulp-sass')

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
})

gulp.task('sass', function() {
    return gulp
        .src('style/*.scss')
        .pipe(sass({
            'includePaths': [
                './node_modules/bootstrap-sass/assets/stylesheets',
            ]
        }))
        .pipe(gulp.dest('dist/css'))
})

gulp.task('html', function() {
    return gulp
        .src('html/*')
        .pipe(gulp.dest('dist'))
})

gulp.task('build', ['html', 'sass'])

gulp.task('watch', ['browserSync', 'build'], function() {
    gulp.watch('style/*', ['sass'])
    gulp.watch('html/*', ['html'])
    gulp.watch('dist/**/*', browserSync.reload)
})
