// 实现这个项目的构建任务
const {src, dest, parallel, series, watch} = require('gulp')
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins();
// const sass = require('gulp-sass')
// const plugins.babel = require('gulp-babel')
// const plugins.swig = require('gulp-swig')
// const plugins.imagemin = require('gulp-imagemin')
const del = require('del')
const browserSync = require('browser-sync');
const bs = browserSync.create()

var opts = {
    defaults: { cache: false, locals: { site_name: "My Blog" } },
    data: {

        menus: [
            {
                name: 'Home',
                icon: 'aperture',
                link: 'index.html'
            },
            {
                name: 'Features',
                link: 'features.html'
            },
            {
                name: 'About',
                link: 'about.html'
            }
        ],
        pkg: require('./package.json'),
        date: new Date()
    }
  }
const style = () => {
    return src('src/assets/styles/*.scss', {base:'src'})
    .pipe(plugins.sass({outputStyle: 'expanded'}))
    .pipe(dest('dist'))
    .pipe(bs.reload({stream: true}))
}
const script = () => {
    return src('src/assets/scripts/*.js', {base: 'src'})
    .pipe(plugins.babel({presets: ['@babel/preset-env']}))
    .pipe(dest('dist'))
    .pipe(bs.reload({stream: true}))
}
const page = () => {
    return src('src/*.html', {base: 'src'})
    .pipe(plugins.swig(opts))
    .pipe(dest('dist'))
    .pipe(bs.reload({stream: true}))
}
const image = () => {
    return src('src/assets/images/**', {base: 'src'})
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}
const font = () => {
    return src('src/assets/fonts/**', {base: 'src'})
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}
const extra = () => {
    return src('public/**', {base: 'public'})
    .pipe(dest('dist'))
}
const clean = () => {
    return del(['dist'])
}
const serve = () =>{
    watch('src/assets/styles/*.scss', style)
    watch('src/assets/scripts/*.js', script)
    watch('src/*.html', page)
    // watch('src/assets/images/**', image)
    // watch('src/assets/fonts/**', font)
    // watch('public/**', extra)
    watch([
        'src/assets/images/**',
        'src/assets/fonts/**',
        'public/**'
    ], bs.reload)
    bs.init({
        notify: false,
        port: 2000,
        // files: 'dist/**',
        server: {
            baseDir: ['dist','src','public'],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    })
}
const useref = () => {
    return src('dist/*.html', {base: 'dist'})
    .pipe(plugins.useref({searchPath: ['dist', '.']}))
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
    })))
    .pipe(dest('dist'))
}
const compile = parallel(style, script, page)

const build = series(clean,parallel(series(compile, useref),image, font, extra))
const develop = series(clean,parallel(compile, serve))
module.exports = {
    compile,
    build,
    develop
}