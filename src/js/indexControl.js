//索引控制
(function ($, root) {
    /**
     * 构造函数
     */
    function Control(len) {
        this.index = 0;
        this.len = len;
    }

    Control.prototype = {
        /**
         * 后退
         */
        prev: function () {
            return this.getIndex(-1);
        },
        /**
         * 前进
         */
        next: function () {
            return this.getIndex(1);
        },
        /**
         * 计算改变后的索引
         */
        getIndex: function (val) {
            var index = this.index; //当前索引
            var len = this.len; //数据总长度
            var curIndex = (index + val + len) % len; //计算改变后的索引
            this.index = curIndex; //更新索引
            return curIndex; //返回改变后的索引
        }
    }

    root.indexControl = Control;
})(window.Zepto, window.player || (window.player = {}));