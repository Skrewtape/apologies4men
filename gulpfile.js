var babel = require('gulp-babel')
var browserSync = require('browser-sync').create()
var gulp = require('gulp')
var sass = require('gulp-sass')
var webpack = require('webpack-stream')

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
        .src('html/*.html')
        .pipe(gulp.dest('dist'))
})

gulp.task('js', function() {
    return gulp
        .src('js/index.js')
        .pipe(webpack({
            output: {
                library: 'Index',
                filename: 'index.js',
                libraryTarget: 'umd'
            },
            module: {
                loaders: [{
                    loader: 'babel-loader'
                }]
            }
        }))
        .pipe(gulp.dest('dist'))
})

gulp.task('build', ['html', 'sass', 'js'])

gulp.task('watch', ['browserSync', 'build'], function() {
    gulp.watch('style/*', ['sass'])
    gulp.watch('html/*', ['html'])
    gulp.watch('js/*', ['js'])
    gulp.watch('dist/**/*', browserSync.reload)
})
