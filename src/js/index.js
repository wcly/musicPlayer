var root = window.player; // 获取操作方法
var dataList; // 音乐数据
var len; // 数据长度
var audio = root.audioManager; //音频控制器实例
var indexControl; //索引控制器实例
var timer; //旋转定时器

/**
 * 初始化函数
 */
function init() {
    getData('http://yapi.demo.qunar.com/mock/71675/music/data'); // 获取数据
    bindEvent(); //绑定事件
    bindTouch(); //绑定拖拽事件
}

/**
 * 获取音乐数据
 * @param {string} url 请求地址 
 */
function getData(url) {
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            dataList = data;
            len = dataList.length;
            indexControl = new root.indexControl(len);
            var i = indexControl.index;
            root.render(dataList[i]); // 初始化渲染数据
            audio.getAudio(dataList[i].audio);
            $('body').trigger('play:change', 0);

        },
        error: function () {
            console.log("error");
        }
    })
}

/**
 * 绑定事件
 */
function bindEvent() {
    //自定义播放状态改变事件
    $('body').on('play:change', function (e, index) {
        audio.getAudio(dataList[index].audio); //切换歌曲源
        root.render(dataList[index]); //重新渲染页面
        root.pro.renderAllTime(dataList[index].duration);
        // 保留播放状态
        if (audio.status == 'play') {
            rotated(0);
            audio.play();
            root.pro.start(0);
        }else{
            root.pro.stop(0);
        }
        // 重置旋转角度
        $('.img-box').attr('data-deg', 0);
        $('.img-box').css({
            'transform': 'rotateZ(0deg)',
            'transition': 'none'
        });
    });
    // 点击上一首图标
    $('.prev').on('click', function () {
        var i = indexControl.prev();
        $('body').trigger('play:change', i);
        if (audio.status == 'pause') {
            audio.pause();
            root.pro.stop();
        }
    });
    // 点击下一首图标
    $('.next').on('click', function () {
        var i = indexControl.next();
        $('body').trigger('play:change', i);
        if (audio.status == 'pause') {
            audio.pause();
            root.pro.stop();
        }
    });
    // 播放暂停
    $('.play').on('click', function () {
        if (audio.status == 'pause') {
            audio.play();
            root.pro.start();
            var deg = $('.img-box').attr('data-deg');
            rotated(deg); //接着上次的角度旋转
        } else {
            audio.pause();
            root.pro.stop();
            clearInterval(timer); // 停止旋转
        }
        $('.play').toggleClass('playing');
    });
}

/**
 * 图片旋转
 * @param {string} deg 旋转角度 
 */
function rotated(deg) {
    clearInterval(timer);
    deg = +deg;
    timer = setInterval(function () {
        deg += 2;
        $('.img-box').attr('data-deg', deg);
        $('.img-box').css({
            'transform': 'rotateZ(' + deg + 'deg)',
            'transition': 'all 200ms ease-out'
        });
    }, 200);
}

/**
 * 进度条拖拽时间
 */
function bindTouch(){
    var offset = $('.pro-wrap').offset();
    var left = offset.left;
    var width = offset.width;
    $('.spot').on('touchstart', function(){
        root.pro.stop();
    }).on('touchmove', function(e){
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if(per > 0 && per < 1){
            root.pro.update(per);
        }
    }).on('touchend', function(e){
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if(per > 0 && per < 1){
            var duration = dataList[indexControl.index].duration;
            var curTime = per * duration;
            $('.play').addClass('playing');
            audio.playTo(curTime);
            audio.play();
            audio.status = 'play';
            root.pro.start(per);
        }
    })
}

init(); // 初始化