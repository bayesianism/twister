var gulp = require('gulp');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var sass = require('gulp-sass');
var mocha = require('gulp-mocha');
var karma = require('karma').server;
var jshint = require('gulp-jshint');
var minifyHTML = require('gulp-minify-html');


// minify html
gulp.task('minify-html', function() {
  gulp.src('./assets/views/*.html')
  .pipe(minifyHTML({empty:true}))
  .pipe(gulp.dest('./static/html'));
});

// compile sass
gulp.task('sass', function() {
  gulp.src('./assets/styles/*.scss')
  .pipe(sass())
  .pipe(gulp.dest('./static/css'));
});

// bundle up client scripts with dependencies
gulp.task('browserify', function() {
    bundler();
});

gulp.task('browserify-uglify', function() { bundler(true); });

// check javascript style
gulp.task('lint', function() {
  gulp.src(['./assets/scripts/*.js', './lib/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// test client scripts
gulp.task('karma', function(done) {
  karma.start({
    configFile: __dirname+'/test/client/karma.conf.js',
    singleRun: true
  }, done);
});

// test server scripts
gulp.task('mocha', function() {
  gulp.src('./test/server/*.js', {read: false})
  .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('build', ['minify-html', 'sass', 'browserify']);

gulp.task('test', ['karma', 'mocha']);

gulp.task('watch', ['minify-html', 'sass', 'browserify',
                    'lint'], function() {
  gulp.watch(['./assets/scripts/*.js'], ['lint', 'browserify']);
  gulp.watch(['./assets/styles/*.scss'], ['sass']);
  gulp.watch(['./assets/views/*.html'], ['minify-html']);
  gulp.watch(['./lib/*.js'], ['lint']);
});


// helpers

var bundler = function(uglify) {
  var bundle = browserify({
    entries: ['./assets/scripts/app.js'],
    debug: true
  }).bundle().pipe(source('twister.js'))

  if(uglify) bundle = bundle.pipe(buffer()).pipe(uglify());

  bundle.pipe(gulp.dest('static/js'));
}
