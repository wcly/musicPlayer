// 实现页面渲染
(function ($, root) {
    /**
     * 渲染背景图片
     * @param {string} src 图片地址 
     */
    function renderBgImg(src) {
        var img = new Image();
        img.src = src;
        img.onload = function () {
            $('.img-box img').attr('src', src);
            root.blurImg(img, $('body'));
        }
    }

    /**
     * 渲染音乐信息
     * @param {object} info 音乐数据
     */
    function renderSongInfo(info) {
        var str = '<div class="song-name">' + info.song + '</div>\
        <div class="singer-name">' + info.singer + '</div>\
        <div class="album-name">' + info.album + '</div>';

        $('.song-info').html(str);
    }

    /**
     * 渲染收藏按钮
     * @param {boolean} isLike 是否收藏
     */
    function renderIsLike(isLike) {
        if(isLike){
            $('.like').addClass('liking');
        }else{
            $('.like').removeClass('liking');
        }
    }

    /**
     * 暴露渲染方法
     * @param {objec} data 音乐数据
     */
    root.render = function (data) {
        renderBgImg(data.image);
        renderSongInfo(data);
        renderIsLike(data.isLike);
    }
})(window.Zepto, window.player || (window.player = {}));