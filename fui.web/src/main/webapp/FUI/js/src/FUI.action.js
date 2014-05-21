/**
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.action.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FAction组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员      修改说明
 * 2013-03-28    qudc         修改onMousemove方法，对top值进行判断。如果小于0，则重置成0，放置标题栏拖上去后拖不回来。
 */
//拖拽插件
$.Dragable = function(targetId, widgetId) {
    this.targetId = targetId;
    this.widgetId = widgetId;
    this._init();
    this._bindEvent();

}

$.Dragable.prototype = {

    destroy : function() {

    },

    _init : function() {
        this.targetEl = $('#' + this.targetId);
        this.widgetEl = $('#' + this.widgetId);
        this.mousePos = {};
    },

    _bindEvent : function() {
        this.targetEl.mousedown($.proxy(this.onMousedown, this));
    },

    onMousedown : function(e) {

        var target = e.target;
        var className = target.className;
        if (className.indexOf('f-win-close') == -1 && className.indexOf('f-win-max') == -1 && className.indexOf('f-win-restore') == -1) {
            var w = this.widgetEl.outerWidth(true);
            var h = this.widgetEl.outerHeight(true);
            var position = this.widgetEl.position();
            var documentEl = $(document);
            var bodyEl = $('body');
            bodyEl.closeSelect();
            //生成对应的虚框
            var htmlArr = [];
             htmlArr.push('<div id="dottedLine" class="f-dotted-line" style="');
            // begin 20121213 hanyin 增加zIndex的设置
            var zIndex = parseInt(this.widgetEl.css("zIndex"));
            if (!isNaN(zIndex)) {
            	htmlArr.push('z-index:' + (zIndex+1)+";");
            }
            // end 20121213 hanyin 增加zIndex的设置
            htmlArr.push('width:' + w + 'px;');
            htmlArr.push('height:' + h + 'px;');
            htmlArr.push('top:' + position.top + 'px;');
            htmlArr.push('left:' + position.left + 'px;');
            htmlArr.push('"></div>');
            bodyEl.append(htmlArr.join(''));

            this.dottedLineEl = $('#dottedLine');
            var pageX = e.pageX,pageY = e.pageY;
            this.mousePos = {pageX:pageX,pageY:pageY};
            documentEl.mousemove($.proxy(this.onMousemove, this));
            documentEl.one('mouseup', $.proxy(this.onMouseup, this));
        }
    },

    onMousemove : function(e) {
        var pageX = e.pageX ,pageY = e.pageY ,dottedLineEl = this.dottedLineEl,mousePos = this.mousePos;
        var ox = pageX - mousePos.pageX,oy = pageY - mousePos.pageY;

        var position = dottedLineEl.position();
        var top = position.top + oy ;
        var left =  position.left + ox ;
        if(top<=0){
            top = 0;
            //{ 20130409 hanyin 避免鼠标超出窗口的情况下报js错的问题
            $(document).unbind('mouseup');
            this.onMouseup();
            //} 20130409 hanyin
        }
        var topPx = top + "px",leftPx = left+ 'px';

        var dottedLineStyle = dottedLineEl.get(0).style;
        dottedLineStyle.top = topPx;
        dottedLineStyle.left = leftPx;

        this.mousePos = {pageX:pageX,pageY:pageY};
    },

    onMouseup : function() {
        var documentEl = $(document);
        var bodyEl = $('body');
        var position = this.dottedLineEl.position();
        var widgetStyle = this.widgetEl.get(0).style;

        widgetStyle.top = position.top + 'px';
        widgetStyle.left = position.left + 'px';

        this.dottedLineEl.remove();
        this.dottedLineEl = null;
        bodyEl.openSelect();
        documentEl.unbind('mousemove');
    },

    start: function() {
        this.targetEl.mousedown($.proxy(this.onMousedown, this));
    },

    stop : function() {
        this.targetEl.unbind('mousedown', $.proxy(this.onMousedown, this));
    }
}


