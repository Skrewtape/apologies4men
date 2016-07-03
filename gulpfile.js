var browserSync = require('browser-sync').create()
var del = require('del')
var gulp = require('gulp')
var runSequence = require('run-sequence')
var sass = require('gulp-sass')
var uglify = require('gulp-uglify')
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
            devtool: 'source-map',
            module: {
                loaders: [{
                    loader: 'babel',
                    exclude: /node_modules/,
                    query: {
                        presets: ['es2015']
                    }
                }]
            }
        }))
        .pipe(gulp.dest('dist'))
})

gulp.task('build', ['html', 'sass', 'js'])

gulp.task('clean', function() {
    return del(['dist/**/*'])
})

gulp.task('clear-sourcemaps', function() {
    return del(['dist/index.js.map'])
})

gulp.task('build-ugly', ['build'], function() {
    return gulp
        .src('dist/index.js')
        .pipe(uglify({ mangle: { toplevel: true }}))
        .pipe(gulp.dest('dist'))
})

gulp.task('dist', function(callback) {
    runSequence(
        'clean',
        'build-ugly',
        'clear-sourcemaps',
        callback
    )
})

gulp.task('watch', ['browserSync', 'build'], function() {
    gulp.watch('style/*', ['sass'])
    gulp.watch('html/*', ['html'])
    gulp.watch('js/*', ['js'])
    gulp.watch('dist/**/*', browserSync.reload)
})
