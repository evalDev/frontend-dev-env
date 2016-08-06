'use strict';
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    server = require('browser-sync').create(),
    reload = server.reload,
    jasmine = require('gulp-jasmine'),
    coffeelint = require('gulp-coffeelint'),
    stylish = require('coffeelint-stylish'),
    coffee = require('gulp-coffee');

gulp.task('default', ['serve']);

gulp.task('serve', ['coffee2js', 'pug2html'], function(){
  server.init({
    server: {
      //baseDir: './builds/development'
      baseDir: './'
    }
  });
//html-pug 
  gulp.watch('src/html-pug/*.pug', ['pug2html']);
  gulp.watch('builds/development/*.html').on('change', reload);

//js-coffee 
  gulp.watch('src/js-coffee/*.coffee',['coffee2js']);
  gulp.watch('builds/development/js/*.js').on('change', reload);

//css-sass 
  gulp.watch('src/css-sass/*.sass', ['sass2css']);

  //specs-jasmine 
  gulp.watch('src/specs-jasmine/*Spec.coffee', ['run-specs']);
  gulp.watch('builds/development/js/*', ['run-specs']);
  gulp.watch('src/specs-jasmine/*.pug', ['create-specRunner']);
  gulp.watch('builds/development/specs/*').on('change', reload);
});


gulp.task('sass2css', function() {
    return gulp.src("src/css-sass/*.sass")
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest("builds/development/css"))
        .pipe(server.stream());
});

gulp.task('pug2html', function () {
  return gulp.src('src/html-pug/*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('builds/development/'));
});    
gulp.task('coffee2js', function () {
  return gulp.src('src/js-coffee/*.coffee')
    .pipe(plumber())
    .pipe(coffeelint())
    .pipe(coffeelint.reporter(stylish))
    .pipe(coffee())
    .pipe(gulp.dest('builds/development/js'));
});
gulp.task('build-specs', function () {
  return gulp.src('src/specs-jasmine/*.coffee')
    .pipe(plumber())
    .pipe(coffee())
    .pipe(gulp.dest('builds/development/specs'));
});
gulp.task('run-specs', ['build-specs'], function () {
  return gulp.src('builds/development/specs/*.js')
    .pipe(jasmine());
});
gulp.task('create-specRunner',['copy-jasmine-lib'], function () {
  return gulp.src('src/specs-jasmine/*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('builds/development/specs'));
});
gulp.task('copy-jasmine-lib', function () {
  return gulp.src(['node_modules/jasmine/node_modules/jasmine-core/lib/jasmine-core/jasmine*.*',
  'node_modules/jasmine/node_modules/jasmine-core/lib/jasmine-core/boot.js'])
    .pipe(gulp.dest('builds/development/specs/lib'));
});
