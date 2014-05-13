"user strict";
var gulp    = require('gulp'),
    bower   = require('gulp-bower'),
    jshint  = require('gulp-jshint'),
    concat  = require('gulp-concat'),
    refresh = require('gulp-livereload'),
    notify  = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    server  = require('tiny-lr')(),
    list    = require('gulp-task-listing'),
    nodemon = require('gulp-nodemon'),
    lr_port = 35729;

var paths = {
  scripts: ['!client/lib/**/*.js', 'client/**/*.js'],
  views: ['!client/lib/*.html', 'client/**/*.html', 'client/index.html'],
  styles: {
    css: ['!client/lib/**/*.css', 'client/styles/css/*.css', 'client/**/*.css'],
    dest: 'client/styles/css'
  }
};

var build = ['css', 'lint'];
<% if(cssPre === 'stylus')  { %>
build.shift();
build.push('stylus');
var stylus = require('gulp-stylus');
paths.styles.stylus = ['client/styles/stylus/*.styl', 'client/**/*.styl']
gulp.task('stylus', function () {
  return gulp.src(paths.styles.stylus)
    .pipe(plumber())
    .pipe(stylus())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(refresh(server))
    .pipe(notify({message: 'Stylus done'}));
});
<% } %>
<% if(cssPre === 'less')  { %>
var less = require('gulp-less');
build.shift();
build.push('less');
paths.styles.less = ['client/styles/less/*.less', 'client/**/*.less']
gulp.task('less', function () {
  return gulp.src(paths.styles.less)
    .pipe(plumber())
    .pipe(less({
      paths: [paths.styles.less]
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(refresh(server))
    .pipe(notify({message: 'Less done'}));
});
<% } %>
<% if(cssPre === 'sass')  { %>
var sass = require('gulp-sass');
build.shift();
build.push('sass');
paths.styles.sass = ['client/styles/sass/*.scss', 'client/**/*.styl']
gulp.task('sass', function () {
  return gulp.src(paths.styles.sass)
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(refresh(server))
    .pipe(notify({message: 'Sass done'}));
});
<% } %>

gulp.task('bowerInstall', function  () {
  bower()
  .pipe();
});

gulp.task('html', function () {
  return gulp.src(paths.views)
    .pipe(plumber())
    .pipe(refresh(server))
    .pipe(notify({message: 'Views refreshed'}));
});

gulp.task('css', function () {
  return gulp.src(paths.styles.css)
    .pipe(plumber())
    .pipe(refresh(server))
    .pipe(notify({message: 'CSS refreshed'}));
});

gulp.task('lint', function () {
  return gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(refresh(server))
    .pipe(notify({message: 'Lint done'}));
});

gulp.task('serve', function () {
  nodemon({script: 'server/server.js'})
    .on('restart', function () {
      refresh(server);
    });
});

gulp.task('live', function () {
  server.listen(lr_port, function (err) {
    if (err) {
      return console.error(err);
    }
  });
});


gulp.task('watch', function () {
  <% if(cssPre === 'stylus') { %>
  gulp.watch(paths.styles.stylus, ['stylus']);
  <% } %>
  <% if(cssPre === 'sass') { %>
  gulp.watch(paths.styles.sass, ['sass']);
  <% } %><% if(cssPre === 'less') { %>
  gulp.watch(paths.styles.less, ['less']);
  <% } %>
  gulp.watch(paths.views, ['html']);
  <% if(!cssPre) { %>
  gulp.watch(paths.styles.css, ['css']);
  <% } %>
  gulp.watch(paths.scripts, ['lint']);
})

gulp.task('build', build);

gulp.task('default', ['build', 'live', 'serve', 'watch']);