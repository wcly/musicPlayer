//音频控制
(function ($, root) {
    /**
     * 音频管理构造函数
     */
    function AudioManager() {
        this.audio = new Audio(); //创建音频对象
        this.src = null;
        this.status = 'pause'; //音频默认状态
    }

    AudioManager.prototype = {
        /**
         * 播放
         */
        play: function () {
            this.audio.play();
            this.status = 'play';
        },
        /**
         * 暂停
         */
        pause: function () {
            this.audio.pause();
            this.status = 'pause';
        },
        /**
         * 获取音频资源
         */
        getAudio: function (src) {
            this.audio.src = src;
            this.audio.load();
        },
        /**
         * 跳转到指定时间
         * @param {number} time 秒 
         */
        playTo: function(time){
            this.audio.currentTime = time;
        }
    }

    root.audioManager = new AudioManager(); //暴露音乐播放器实例
})(window.Zepto, window.player || (window.player = {}))