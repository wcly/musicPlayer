// 渲染总时间
// 进度条运动，时间改变
// 拖拽进度条，进度条位置、时间更新，跳到当前歌曲的位置
(function ($, root) {
    var frameId; //定时器id
    var dur; //总时间
    var startTime; //开始时间
    var lastPer = 0; //上次暂停的百分比

    /**
     * 渲染总时间
     * @param {number} time 秒
     */
    function renderAllTime(time) {
        dur = time;
        time = formatTime(time);
        $(".all-time").html(time);
    }

    /**
     * 格式化时间
     * @param {number} t 秒
     */
    function formatTime(t) {
        t = Math.round(t);
        var m = Math.floor(t / 60);
        var s = t - m * 60;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        return m + ':' + s;
    }

    /**
     * 开始播放
     * @param {number} p 进度条百分比
     */
    function start(p) {
        lastPer = p == undefined ? lastPer : p;
        cancelAnimationFrame(frameId);
        startTime = new Date().getTime();
        function frame() {
            var nowTime = new Date().getTime();
            var per = lastPer + (nowTime - startTime) / (dur * 1000);
            if (per <= 1) {
                update(per);
            } else {
                cancelAnimationFrame(frameId);
            }
            frameId = requestAnimationFrame(frame);
        }
        frame();
    }

    /**
     * 更新进度条和时间
     * @param {number} p 进度条百分比 
     */
    function update(p) {
        var time = formatTime(p * dur);
        $('.cur-time').html(time);
        var perX = (p - 1) * 100 + '%';
        $('.pro-top').css({
            'transform': 'translateX(' + perX + ')'
        })
    }

    /**
     * 停止播放
     */
    function stop() {
        cancelAnimationFrame(frameId);
        var stopTime = new Date().getTime();
        lastPer = lastPer + (stopTime - startTime) / (dur * 1000);
    }

    root.pro = {
        renderAllTime: renderAllTime,
        start: start,
        stop: stop,
        update: update
    }
}(window.Zepto, window.player || (window.player = {})));