const {src, dest, series, watch} = require('gulp')
const sass = require('gulp-sass')
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sync = require('browser-sync').create()

function html() {
  return src('src/**/*.html')
    .pipe(include({
      prefix: '@@'
    }))
    /*.pipe(htmlmin({
      collapseWhitespace: true
    }))*/
    .pipe(dest('dist'))
}

function scss() {
  return src('src/scss/**/**/*.*')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(csso())
    .pipe(concat('index.css'))
    .pipe(dest('dist'))
}

function fonts() {
  return src('src/assets/fonts/*.*')
    .pipe(dest('dist/assets/fonts'));
}

function images() {
  return src('src/assets/images/*.*')
    .pipe(dest('dist/assets/images'));
}

function clear() {
  return del('dist')
}

function serve() {
  sync.init({
    server: './dist'
  })

  watch('src/**/*.html', series(html)).on('change', sync.reload)
  watch('src/scss/**/**/**/*.scss', series(scss)).on('change', sync.reload)
  watch('src/assets/images/*.*', series(images)).on('change', sync.reload)
}

exports.build = series(clear, scss, html, fonts, images)
exports.serve = series(clear, scss, html, fonts, images, serve)
exports.clear = clear