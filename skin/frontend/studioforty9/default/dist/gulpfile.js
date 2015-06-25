// Load plugins
var
    gulp            = require('gulp'),
    compass         = require('gulp-compass'),
    autoprefixer    = require('gulp-autoprefixer'),
    bless           = require('gulp-bless'),
    minifycss       = require('gulp-minify-css'),
    uglify          = require('gulp-uglify'),
    concat          = require('gulp-concat'),
    notify          = require('gulp-notify'),
    cache           = require('gulp-cache'),
    livereload      = require('gulp-livereload');

var config = {
    minifyCss: true,
    uglifyJS: true,
    compileIE9: true
}

// CSS
gulp.task('css', function() {

    var stream = gulp
        .src('scss/styles.scss')
        .pipe(compass({
            css: '../css',
            sass: './scss'
        }).on('error', notify.onError(function (error) {
            cssCompiling = false;
            return 'Error compiling SASS: ' + error.message;
        })))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))

    if (config.minifyCss === true) {
        stream.pipe(minifycss());
    }

    stream.pipe(gulp.dest('../css'))
        .pipe(livereload())
        .pipe(notify({ message: 'Successfully compiled SASS' }));

    if (config.compileIE9 === true) {
        gulp.start('ie9');
    }

});

// IE9 CSS
gulp.task('ie9', function() {
    var stream = gulp
        .src('scss/ie9.scss')
        .pipe(compass({
            css: '../css',
            sass: './scss'
        }).on('error', notify.onError(function (error) {
            return 'Error compiling SASS: ' + error.message;
        })))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(bless())
        stream.pipe(gulp.dest('../css'));
});

// Alias for convenience
gulp.task('sass', function() {
    gulp.start('css');
});

// JS
gulp.task('js', function() {

    var scripts = [
        'js/site.js'
    ];

    var stream = gulp
        .src(scripts)
        .pipe(concat('site.js'));

    if (config.uglifyJS === true) {
        stream.pipe(uglify());
    }

    return stream
        .pipe(gulp.dest('../js'))
        .pipe(livereload())
        .pipe(notify({ message: 'Successfully compiled JavaScript' }));
});

// Default task
gulp.task('default', ['watch']);

// Watch
gulp.task('watch', function() {

    // Watch .sass files
    gulp.watch('scss/**/*.scss', ['sass']);
    gulp.watch('js/*.js', ['js']);

    // Watch any files in , reload on change
    livereload.listen();
    gulp.watch(['../css/styles.css', '../js/site.js']).on('change', livereload.changed);
});