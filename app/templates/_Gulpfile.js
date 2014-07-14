"user strict";
var gulp    = require('gulp'),
    bower   = require('gulp-bower'),
    jshint  = require('gulp-jshint'),
    refresh = require('gulp-livereload'),
    notify  = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    client  = require('tiny-lr')(),
    nodemon = require('gulp-nodemon'),
    lr_port = 35728,
    <% if (cssPre !== 'none') {%><%= cssPre %>   = require('gulp-<%= cssPre %>');<% } %>


var paths = {
  scripts: ['!client/lib/**/*.js', 'client/**/*.js'],
  views: ['!client/lib/*.html', 'client/**/*.html', 'client/index.html'],
  styles: {
    css: ['!client/lib/**/*.css', 'client/styles/css/*.css', 'client/**/*.css'],
    <% if(cssPre === 'stylus') { %>stylus: ['client/styles/stylus/*.styl', 'client/**/*.styl'],<% } %><% if(cssPre === 'less') { %>less: ['client/styles/less/*.less', 'client/**/*.less'],<% } %><% if(cssPre === 'sass') { %>sass: ['client/styles/sass/*.scss', 'client/**/*.scss'],<% } %>
    dest: 'client/styles/css'
  }
};
var build = ['<% if (cssPre !== 'none') {%><%= cssPre %><% } %>', 'css', 'lint'];

<% if(cssPre === 'stylus')  { %>
var stylus = require('gulp-stylus');
gulp.task('stylus', function () {
  return gulp.src(paths.styles.stylus)
    .pipe(plumber())
    .pipe(stylus())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(refresh(client))
    .pipe(notify({message: 'Stylus done'}));
});
<% } %><% if(cssPre === 'less')  { %>
gulp.task('less', function () {
  return gulp.src(paths.styles.less)
    .pipe(plumber())
    .pipe(less({
      paths: [paths.styles.less]
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(refresh(client))
    .pipe(notify({message: 'Less done'}));
});
<% } %><% if(cssPre === 'sass')  { %>
gulp.task('sass', function () {
  return gulp.src(paths.styles.sass)
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(refresh(client))
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
    .pipe(refresh(client))
    .pipe(notify({message: 'Views refreshed'}));
});

gulp.task('css', function () {
  return gulp.src(paths.styles.css)
    .pipe(plumber())
    .pipe(refresh(client))
    .pipe(notify({message: 'CSS refreshed'}));
});

gulp.task('lint', function () {
  return gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(refresh(client))
    .pipe(notify({message: 'Lint done'}));
});

gulp.task('serve', function () {
  nodemon({script: 'server/server.js', ignore: ['node_modules/**/*.js']})
    .on('restart', function () {
      refresh(client);
    });
});

gulp.task('live', function () {
  client.listen(lr_port, function (err) {
    if (err) {
      return console.error(err);
    }
  });
});

gulp.task('watch', function () {
  <% if(cssPre === 'stylus') { %>gulp.watch(paths.styles.stylus, ['stylus']);<% } %><% if(cssPre === 'sass') { %>gulp.watch(paths.styles.sass, ['sass']);<% } %><% if(cssPre === 'less') { %>gulp.watch(paths.styles.less, ['less']);<% } %><% if(!cssPre) { %>gulp.watch(paths.styles.css, ['css']);<% } %>
  gulp.watch(paths.views, ['html']);
  gulp.watch(paths.scripts, ['lint']);
});

gulp.task('build', build);

gulp.task('default', ['build', 'live', 'serve', 'watch']);
