/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Mask.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FMask组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员                     修改说明
 * 2012-10-17   qudc                  在doMask时调用hideAllSelect方法，隐藏select组件。在doUnMask的时候调用showAllSelect方法，显示select组件。解决ie6下，div遮罩层不能遮住html原生的select组件的bug。
 * 2012-11-29   qudc                  遮罩计算可见区域的时候，在非标准的盒子模型（怪异模式）下，添加document.body.clientWidth、document.body.clientHeight来计算可见区域的高宽
 * 2012-12-13	hanyin		增加选项 showImg，如果为false则不显示中心图片，否则显示
 */

(function($, undefined) {


    var UTILS = window['$Utils'];

    /**
     *  生成遮罩的html机构
     * @param text
     * @param options
     */
    function generateMaskHtml(text, options) {
        var id = options && options.id || 'fui' ;
        var maskBGId = id + '-mask-bg';
        var maskImgId = id + '-mask-img';
        var maskMsgId = id + '-mask-msg';
        var maskArr = [];
        //遮罩背景层
        maskArr.push('<div id="' + maskBGId + '"' + ' class="f-mask-bg"></div>');
        //遮罩层的提示图片以及提示信息
        maskArr.push('<div id="' + maskImgId + '" class="f-mask-img" style="display:none;"><div id="' + maskMsgId + '" class="">');
        maskArr.push(text || window["$i18n"].mask.defaultMsg);
        maskArr.push('</div></div>');
        return maskArr.join('');
    }


    /**
     * 隐藏所有的原生select组件
     */
    function hiddenAllSelectEl() {
        if (window["hasHidden"] === true) {
            return;
        }
        var i = 0;
        var j = 0;
        var es;            //var es = vForm.elements;  //获取表单中所有的元素
        var hiddenArrayList = window['hiddenArrayList'] || [];
        window['hiddenArrayList'] = hiddenArrayList;
        window["hasHidden"] = true;
        var selectEls = $('select');
        var selectLen = selectEls.length;
        for (var i = 0; i < selectLen; i++) {
            var selectDom =selectEls.get(i);
            var selectStyle = selectDom.style ;
            if (selectStyle.display == "none" || selectStyle.display == "block") {
            } else {
                selectStyle.display = "none";
                hiddenArrayList.push(selectDom); //直接将对象的引用保存到链表中
            }
        }
    }

    //回复隐藏的select框
    function showAllSelectEl() {
        if (window["hasHidden"] === false) {
            return;
        }
        //todo 是否真的要隐藏select ，如果有多个遮罩层 处理需要谨慎
        var mask = $("#win-mask-overlay,#dialog-mask-overlay");
        if (mask.length > 0) {
            return;
        }
        window["hasHidden"] = false;
        var hiddenArrayList = window['hiddenArrayList'];

        var length = $.isArray(hiddenArrayList) && hiddenArrayList.length || 0;
        //将隐藏链表中的元素恢复显示
        if (hiddenArrayList != null && hiddenArrayList != false && length > 0) {
            for (var i = 0; i < length; i++) {
                hiddenArrayList[i].style.display = "";   //继续隐藏
            }
        }
        hiddenArrayList = null;
        window['hiddenArrayList'] = null;
    }

    /**
     * ie6下调用 hiddenAllSelectEl方法，隐藏所有原生的select组件
     */
    function hideAllSelect() {
        if ($.browser.msie && ($.browser.version == "6.0")) {
            hiddenAllSelectEl();
        }
    }

    /**
     * ie6下调用 showAllSelectEl方法，隐藏所有原生的select组件
     */
    function showAllSelect() {
        if ($.browser.msie && ($.browser.version == "6.0")) {
            showAllSelectEl();
        }
    }

    //展现body区域的遮罩
    function _showBodyMask(text, maskId, options) {
        var maskBG = $('#' + maskId + '-mask-bg');
        if (maskBG.length == 0) {
            //生成对应的dommask的dom结构。
            // begin 20121213 hanyin 
            // var options = {id :maskId};
        	options = options || {};
        	options.id = maskId;
            // end 20121213 hanyin 
            var maskHtml = generateMaskHtml(text, options);
            $('body').append(maskHtml);
        }
        _resizeBodyMask(text, maskId, options);
    }

    //展现div区域的遮罩
    function _showDivMask(text, maskId, options) {
        var maskBGId = maskId + '-mask-bg';

        var maskBG = $('#' + maskBGId);
        if (maskBG.length == 0) {
            //生成对应的dommask的dom结构。
            var options = {id :maskId};
            var maskHtml = generateMaskHtml(text, options);
            $('body').append(maskHtml);
        }
        _resizeDivMask(text, maskId, options);
    }

    //调整body区域的遮罩
    // 20121213 hanyin 增加options参数传入
    function _resizeBodyMask(text, maskId, options) {
        //查找遮罩相关的元素
        var maskBG = $('#' + maskId + '-mask-bg');
        var maskImg = $('#' + maskId + '-mask-img');
        var maskMsg = $('#' + maskId + '-mask-msg');

        var isBoxModel = jQuery.support.boxModel;
        var documentElement = document.documentElement;

        //可视区域的宽度
        var w = isBoxModel && documentElement.clientWidth ||document.body.clientWidth;
        //可是区域的高度
        var h = isBoxModel && documentElement.clientHeight ||document.body.clientHeight;
        //滚动条的水平偏移量
        var scrollLeft = isBoxModel && documentElement.scrollLeft || document.body.scrollLeft;
        //滚动条的垂直偏移量
        var scrollTop = isBoxModel && documentElement.scrollTop || document.body.scrollTop;


        //设置背景阴影的宽高
        var bw = (w + scrollLeft) + 'px';
        var bh = (h + scrollTop) + 'px';
        maskBG.css('width', bw);
        maskBG.css('height', bh);


        //设置消息提示信息内容
        maskMsg.html(text);

        //遮罩图片的宽度
        var imgW = maskImg.outerWidth(true);
        //遮罩图片的高度
        var imgH = maskImg.outerHeight(true);

        //设置遮罩图片的相对位置
        var px = ((w - imgW) / 2 + scrollLeft) + 'px';
        var py = ((h - imgH) / 2 + scrollTop) + 'px';
        maskImg.css('left', px);
        maskImg.css('top', py);

        maskBG.css('display', '');
        //设置背景阴影和遮罩图片显现
        // begin 20121213 hanyin 增加showImg 选项，如果为false，则不显示图片
        if ((options || {})["showImg"] === false) {
        	return;
        }
        // end 20121213 hanyin 增加showImg 选项，如果为false，则不显示图片
        maskImg.css('display', '');
    }

    //调整div区域的遮罩
    // 20121213 hanyin 增加options参数传入
    function _resizeDivMask(text, maskId, options) {

        var element = $('#' + maskId);
        //查找遮罩相关的元素
        var maskBG = $('#' + maskId + '-mask-bg');
        var maskImg = $('#' + maskId + '-mask-img');
        var maskMsg = $('#' + maskId + '-mask-msg');

        //计算所需遮罩的宽度
        var w = element.outerWidth(true);
        //计算所需遮罩的高度
        var h = element.outerHeight(true);
        //滚动条的水平偏移量
        var scrollLeft = element.scrollLeft();
        //滚动条的垂直偏移量
        var scrollTop = element.scrollTop();


        //计算遮罩阴影的宽高
        var bw = w + 'px';
        var bh = h + 'px';
        maskBG.css('width', bw);
        maskBG.css('height', bh);

        //计算并设置遮罩阴影的相对偏移量。
        var offset = element.offset();
        var left = offset.left;
        var top = offset.top;
        maskBG.css('left', left);
        maskBG.css('top', top);

        maskMsg.html(text);

        //计算遮罩图片的宽度
        var imgW = maskImg.outerWidth(true);
        //计算遮罩图片的高度
        var imgH = maskImg.outerHeight(true);

        //计算并设置遮罩图片的偏移量
        var px = (left + (w - imgW) / 2 ) + 'px';
        var py = (top + (h - imgH) / 2 ) + 'px';
        maskImg.css('left', px);
        maskImg.css('top', py);

        maskBG.css('display', '');
        // begin 20121213 hanyin 增加showImg 选项，如果为false，则不显示图片
        if ((options || {})["showImg"] === false) {
        	return;
        }
        // end 20121213 hanyin 增加showImg 选项，如果为false，则不显示图片
        maskImg.css('display', '');
    }

    /**
     * 遮罩某个指定的div
     * @name FMask#doMask
     * @param  text  遮罩提示信息（类型：String）
     * @function
     * @return void
     * @example
     */
    // 20121213 hanyin _showBodyMask和_showDivMask方法的输入参数增加 options传入
    $.fn.doMask = function(text, options) {
        var element = $(this);
        UTILS.addClass(element.get(0), 'f-mask-scroll-hide');
        hideAllSelect();
        //遮罩整个页面
        if (element.is('body')) {
            _showBodyMask(text, 'fui', options);
        } else {
            var id = element.attr('id');
            _showDivMask(text, id, options);

        }
    };

    /**
     * 去除某个指定div的遮罩
     * @name FMask#doUnMask
     * @function
     * @return void
     * @exampl
     */
    $.fn.doUnMask = function() {
        var element = $(this);
        showAllSelect();
        //取消整个body区域的遮罩
        if (element.is('body')) {
            var maskBG = element.find('>#fui-mask-bg');
            if (maskBG.length > 0) {
                var maskImg = element.find('>#fui-mask-img');
                maskImg.css('display', 'none');
                maskBG.css('display', 'none');
            }
            showAllSelect();
        } else {
            //取消制定div区域的遮罩
            var id = element.attr('id');
            var maskBGId = id + '-mask-bg';
            var maskImgId = id + '-mask-img';
            var maskBG = $('#' + maskBGId);
            if (maskBG.length > 0) {
                var maskImg = $('#' + maskImgId);
                maskImg.css('display', 'none');
                maskBG.css('display', 'none');
            }
            showAllSelect();
        }
        UTILS.removeClass(element.get(0), 'f-mask-scroll-hide');
    };
})(jQuery);

	