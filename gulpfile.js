const {
    src,
    dest,
    parallel,
    series,
    watch
} = require("gulp");
const path = require('path');
const fs = require('fs');
const gulpConnect = require('gulp-connect');
const gulpHtmlmin = require('gulp-htmlmin');
const gulpClean = require('gulp-clean');
var gulpSass = require('gulp-sass');
gulpSass.compiler = require('node-sass');
const gulpBabel = require('gulp-babel');
const gulpImagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const { appEntryPath, appOutputPath } = require('./config');

// task
async function clean() {
    fs.exists(appOutputPath, async (exists) => {
        if (exists) {
            src(path.resolve(appOutputPath, '*'), {
                read: false
            })
                .pipe(gulpClean({ force: true }));
            // console.log('清理文件完成');
            await Promise.resolve();
        } else {
            await Promise.resolve();
        }

    });
}

function webserver(cb) {
    gulpConnect.server({
        root: appOutputPath,
        livereload: true
    });
}

function html(cb) {
    return src(path.resolve(appEntryPath, '*.html'))
        .pipe(gulpHtmlmin({
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true
        }))
        .pipe(dest(
            appOutputPath
        ))
        .pipe(gulpConnect.reload());
}

function sass() {
    return src(path.resolve(appEntryPath, '*.scss'))
        .pipe(gulpSass({ outputStyle: "compressed" }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'], // 主流浏览器的最新两个版本
            cascade: false // 是否美化属性值
        }))
        .pipe(dest(appOutputPath))
        .pipe(gulpConnect.reload());
}

function babel() {
    return src(path.resolve(appEntryPath, '*.js'))
        .pipe(gulpBabel({
            presets: ['@babel/preset-env']
        }))
        .pipe(dest(appOutputPath))
        .pipe(gulpConnect.reload());
}

function imagemin() { // gulpImagemin
    return src(path.resolve(appEntryPath, 'images/*.*'))
        .pipe(gulpImagemin({
            optimizationLevel: 5, //类型：Number 默认：5 取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(dest(path.resolve(appOutputPath, 'images')))
        .pipe(gulpConnect.reload());
}

function watchFile(cb) {
    watch(path.resolve(appEntryPath, '*.html'), parallel(html));
    watch(path.resolve(appEntryPath, '*.scss'), parallel(sass));
    watch(path.resolve(appEntryPath, '*.js'), parallel(babel));
    watch(path.resolve(appEntryPath, 'images/*.*'), parallel(imagemin));
}

exports.default = series(
    clean,
    series(sass, babel, imagemin, html),
    parallel(webserver, watchFile)
);
