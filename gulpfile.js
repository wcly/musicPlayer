const {
    task, //创建一个有名字的任务
    src, //文件输入
    dest, //文件输出
    series, //串行执行多个任务
    watch, //监听文件变化
} = require('gulp');
const htmlClean = require('gulp-htmlclean');
const imgMin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const cleanDebug = require('gulp-strip-debug');
const less = require('gulp-less');
const cleanCss = require('gulp-clean-css');
const postCss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const connect = require('gulp-connect');

// 文件夹目录
const folder = {
    src: 'src/',
    dist: 'dist/'
}

// 判断当前环境变量
const mode = process.env.NODE_ENV;
// 在命令行可以切换 window: set NODE_ENV=development ; mac,linux: export NODE_ENV=development 
console.log(mode);

/**
 * 处理html文件
 * @param {function} cb 回调函数
 */
function html(cb) {
    src(folder.src + "html/*")
        .pipe(connect.reload())
        .pipe(htmlClean()) //压缩html
        .pipe(dest(folder.dist + "html/"));
    cb();
}

/**
 * 处理js文件
 * @param {function} cb 回调函数
 */
function js(cb) {
    src(folder.src + "js/*")
        .pipe(connect.reload())
        // .pipe(cleanDebug()) //去掉js中的调试语句
        .pipe(uglify()) //压缩js
        .pipe(dest(folder.dist + "js/"));
    cb();
}

/**
 * 处理css文件
 * @param {function} cb 回调函数
 */
function css(cb) {
    src(folder.src + "css/*")
        .pipe(connect.reload())
        .pipe(less()) //编译less
        .pipe(postCss([autoprefixer()])) //自动加浏览器兼容前缀
        .pipe(cleanCss()) //压缩css
        .pipe(dest(folder.dist + "css/"));
    cb();
}

/**
 * 处理图片
 * @param {function} cb 回调函数
 */
function img(cb) {
    src(folder.src + "img/*")
        .pipe(imgMin()) //压缩图片
        .pipe(dest(folder.dist + 'img/'));
    cb();
}

/**
 * 开启服务器
 * @param {function} cb 回调函数 
 */
function server(cb) {
    connect.server({
        port: '8080',
        livereload: true, //自动刷新
    });
    cb();
}

/**
 * 监听文件变化
 * @param {function} cb 
 */
function watcher(cb) {
    watch(folder.src + "html/*", html);
    watch(folder.src + "css/*", css);
    watch(folder.src + "js/*", js);
    cb();
}

/**
 * 默认任务
 */
const defaultTask = task('default', series(html, js, css, img, server, watcher));

// 导出任务
exports.default = defaultTask;