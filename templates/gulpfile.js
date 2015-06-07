'use strict';

var gulp = require('gulp');
var gulpif = require('gulp-if');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var through = require('through2');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');

// --------------------
// JavaScript
// --------------------
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var ngHtml2Js = require("browserify-ng-htmlmin2js");
var eslint = require('gulp-eslint');

function browserifyTask(dest, prod) {
  var prod = prod || false;
  var bundledStream = through();

  bundledStream
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulpif(!prod, sourcemaps.init({loadMaps: true})))
      .pipe(gulpif(prod, uglify()))
      .on('error', gutil.log)
    .pipe(gulpif(!prod, sourcemaps.write('./')))
    .pipe(gulp.dest(dest));

  globby(['./client/**/*.js', './.tmp/**/*.tpl.html'], function(err, entries) {
    if (err) {
      bundledStream.emit('error', err);
      return;
    }

    var b = browserify({
      entries: entries,
      debug: true
    })
      .transform(ngHtml2Js({
        module: 'waisygh.templates',
        extension: 'tpl.html',
        baseDir: './.tmp'
      }))
    ;

    b.bundle().pipe(bundledStream);
  });

  return bundledStream;
}

gulp.task('browserify:dev', ['templates'], function() {
  return browserifyTask('dev')
});

gulp.task('browserify:prod', ['templates'], function() {
  return browserifyTask('public')
});

gulp.task('eslint', function() {
  return gulp.src(['client/**/*.js', 'server/**/*.js'])
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format())
  ;
})

// --------------------
// Jade/HTML
// --------------------
var jade = require('gulp-jade');
var htmlmin = require('gulp-htmlmin');

function templateTask(src, dest, prod) {
  var prod = prod || false;
  return gulp.src(src)
    .pipe(jade({
      pretty: prod
    }))
    .pipe(gulpif(prod, htmlmin()))
    .pipe(gulp.dest(dest))
  ;
}

gulp.task('templates', function() {
  return templateTask('client/**/*.tpl.jade', './.tmp/');
});

gulp.task('html:dev', function() {
  return templateTask('client/index.jade', 'dev')
});

gulp.task('html:prod', function() {
  return templateTask('client/index.jade', 'public', true);
});

// --------------------
// Styles
// --------------------
var stylus = require('gulp-stylus');

function stylusTask(dest, prod) {
  var prod = prod || false;
  return gulp.src('client/app/app.styl')
    .pipe(gulpif(!prod, sourcemaps.init({loadMaps: true})))
      .pipe(stylus())
    .pipe(gulpif(!prod, sourcemaps.write('./')))
    .pipe(gulp.dest(dest))
  ;
}

gulp.task('stylus:dev', function() {
  return stylusTask('dev');
});

gulp.task('stylus:prod', function() {
  return stylusTask('public', true);
});

// --------------------
// Server
// --------------------
var nodemon = require('gulp-nodemon');
var runSequence = require('run-sequence');

gulp.task('server', function() {
  nodemon({
    script: 'server/app.js',
    ext: 'jade js styl',
    tasks: ['eslint', 'html:dev', 'browserify:dev', 'stylus:dev']
  })
    .on('restart', function() {
      console.log('restarted!')
    })
  ;
});

gulp.task('serve', function() {
  runSequence(
    'eslint',
    'browserify:dev',
    'stylus:dev',
    'html:dev',
    'server'
  );
});
