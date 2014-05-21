/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Ajax.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FAjax组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员     修改说明
 * 2012-10-29   qudc        修复body区域有滚动条时，window遮罩遮不住滚动条的bug。解决方法，在遮罩的时候给body添加样式"f-mask-scroll-hide",移除遮罩的时候移除该样式。
 * 2012-10-29   qudc        close方法中添加_hideBodyMask方法调用，解决用户直接调用close方法，没办法去除遮罩。
 * 2012-11-29   qudc                  遮罩计算可见区域的时候，在非标准的盒子模型（怪异模式）下，添加document.body.clientWidth、document.body.clientHeight来计算可见区域的高宽
 * 2012-12-07   qudc        新增maximized属性，用于设置win组件打开时是否默认最大化。
 * 2012-12-07   qudc        新增_toRestoreIcon方法和 _toMaxIcon方法，将最大化，恢复原始大小时需要修改按钮样式的方法抽取出来。 替代 _bindEven方法中最大化 恢复按钮click事件调用的代码。
 * 2012-12-19   qudc        修复setHtml方法，将原先的延时设置html的功能去除。防止调用show方法以后，直接调用setPageUrl方法，会导致页面刷新。
 * 2013-01-09   qudc        修改setPageUrl方法的API描述。添加“注意，调用setPageUrl方法之前，需要先调用show方法。
 * 2013-01-10   qudc        修复bug：3837 修改setPageUrl方法里面对pageUrl的处理方式，改成使用transUrl方法对url进行判断处理，支持http和https
 * 2013-01-10   qudc        修复bug：3838  修改setSize方法API描述，添加注意事项。
 * 2013-01-11   qudc        新增onShow事件的API描述
 * 2013-01-11   qudc        修复bug:3870  添加对contentHtml的判断，如果该值为空，即没有空格也没有回车，那么不进行设置，且不触发onSetHtml属性。
 * 2013-01-23	hanyin		在win大小变化是触发onResize事件
 * 2013-02-01	hanyin		BUG #4631 Ie下，当win弹出时，背景body都会回到初始位置
 * 2013-03-04   qudc        完成需求4864，新增属性hasCloseBtn属性
 * 2013-03-19   qudc        修复需求：5183 新增方法_showAllSelectEl和_hideAllSelectEl，修复ie6下遮罩不会隐藏html原生select组件
 * 2013-03-19   qudc        修复需求：5189 ，解决win组件在其标签下面写包含原生textarea标签，由于textarea嵌套，导致页面解析不正常。现在修改成，如果要在fwin组件下面直接使用textarea标签，必须使用<textarea></_textarea> 替代
 *20130710      hanyin      修复需求STORY #6351 win如果设置为打开时即最大化，只会在第一次打开的时候计算位置，第二次不会
 */

/**
 * @name FWin
 * @class 
 * 弹出窗， 用于弹窗方式进行数据展示或交互。典型的如增加，修改，查看的页面。
 */

/**@lends FWin# */






/**
 * 窗体的标题。
 * @type String
 * @name FWin#title
 * @default ""
 */


/**
 * 通过setHtml方法设置html片段后触发该事件，或者设置pageUrl属性（isIframe属性为false）以ajax的方式成功加载html片段后触发该事件。注意事项：&lt;f:win&gt;A&lt;/f:win&gt; 或者&lt;@win &gt;Av/@win&gt;，其中A的值可以为空格，回车，具体页面内容，①当A是以上值时，调用组件的show方法触发onSetHtml事件。②当A没值时，且未设置pageUrl属性，那么调用组件的show方法时不触发onSetHtml事件。③当A没值时，设置pageUrl(isIframe属性为false)，请求成功后都会触发onSetHtml事件。
 * @event
 * @name FWin#onSetHtml
 * @type Function
 * @example
 */

/**
 * 调用show方法时，触发onShow事件。用户可以在该事件中对组件中的表单进行重新
 * @event
 * @name FWin#onShow
 * @type Function
 * @example
 */


;
(function($, undefined) {
    $.widget('FUI.FWin', {
        options :{
            /**
             * 窗体中的按钮。此配置项为JSON数组。每个JSON对象具有 <code>text</code> 属性(配置按钮文字)
             * 、 <code>click</code> 属性(配置按钮触发时的回调方法)、<code>iconCls</code>属性（配置按钮的样式图片）。其中iconCls的样式如下所示：
             * .iconCls {background: url("../dd/drop-yes.gif") no-repeat scroll left center transparent;}
             * @type Array
             * @name FWin#buttons
             * @default []
             *  @example
             *   $("#select").FWin({buttons : [{
             *      text : "确定",
             *      iconCls:"isOk",
             *      click : function () {...}
             *  }, {
             *      text : "取消",
             *      iconCls:"cancel",
             *      click : function () {...}
             *  }]);
             */
            buttons:[],
            /**
             * 是否模态窗口。默认值为true，即以模态的方式展现窗口。
             * @type Boolean
             * @name FWin#modal
             * @default true
             * @example
             *
             */
            modal:true,

            /**
             * 窗体中的按钮的对齐方式  center left right
             * @type String
             * @name FWin#buttonAlign
             * @default center
             *  @example
             */
            buttonAlign:'center',

            /**
             * 组件的宽度。
             * @type Number
             * @name FWin#width
             * @default 400
             * @example
             *   $("#select").FWin({width : 400});
             */
            width:400,
            /**
             * 组件的高度。
             * @type Number
             * @name FWin#height
             * @default 300
             * @example
             *   $("#select").FWin({height : 300});
             */
            height :300,
            /**
             * 设置组件是否可拖动。
             * @type Boolean
             * @name FWin#draggable
             * @default true
             * @example
             *
             */
            dragable :true ,
            /**
             * 是否可最大化。
             * @type Boolean
             * @name FWin#maxable
             * @default false
             * @example
             *
             */
            maxable : false ,
            /**
             * 是否以iframe的方式加载页面,如果该属性值为true，生成的iframe标签的id为“FWin组件的id-iframe”。
             * @type Boolean
             * @name FWin#isIframe
             * @default false
             * @example
             *
             */
            isIframe: false ,

            /**
             * 组件加载页面的地址,如果isIframe属性为true,那么请求的页面需要是标准的HTML页面，如果isIframe属性为false，那么请求的页面只能是HTML片段，不允许包含html、head、body这些html标签。
             * @type String
             * @name FWin#pageUrl
             * @default ""
             * @example
             *
             */
            pageUrl :'',
            /**
             * 设置win组件打开时是否最大化窗口。默认值为false。
             * @type Boolean
             * @name FWin#maximized
             * @default false
             * @example
             *
             */
            maximized : false,
            /**
             * 设置win组件右上角是否有关闭按钮，默认值为true，即有关闭按钮。
             * @type Boolean
             * @name FWin#hasCloseBtn
             * @default true
             * @example
             *
             */
            hasCloseBtn : true

        },
        _create : function() {
            this.firstShow = true;
        },
        _init:function() {

        },

        destroy:function() {
            var options = this.options;
            //解除事件绑定
            if (options.hasCloseBtn) {
                this.closeBtn.unbind();
            }
            this.maxBtn && this.maxBtn.unbind();
            var len = this.options.buttons.length;
            var id = this.element.attr('id');
            for (var i = 0; i < len; i++) {
                $("#" + id + '-btn-' + i).unbind();
            }
            this.dragable && this.dragable.destroy();

            this.maskEl = null;
            this.closeBtn = null;
            this.bodyContentEl = null;
            this.headerEl = null;
            this.titleEl = null;
            this.maxBtn = null;
            this.dragable = null;
            this.hiddenArrayList = null;
            $.Widget.prototype.destroy.call(this);
        },
        _prepareHtml : function() {
            if (this.firstShow) {
                var html = this._generateWinHtml();
                var element = this.element;
                element.append(html);
                this.zIndex = WinIndex.getInstance().getIndex();
                element.css('z-index', this.zIndex);
                this._initProperty();
                //绑定事件
                this._bindEvent();
                this.firstShow = false;
            }
        },

        /**
         * 打开window窗体。
         * @name FWin#show
         * @function
         * @example
         *  $("#select").FWin('show');
         *
         */
        show : function() {
            var options = this.options,element = this.element,id = element.attr('id'),
                    onShow = options.onShow,
                    onSetHtml = options.onSetHtml;

            if (!this.isShown) {
                this._prepareHtml();
            }
            this._showBodyMask();
            element.css('display', 'block');
            if (!this.isShown) {
                //start 2012-12-07 modify by qudc  新增maximized属性的功能实现，
                if (options.maximized) {
                    this._max();
                    this._toMaxIcon();
                } else {
                    this._resize();
                }
                //end 2012-12-07  modify by qudc
                if (!options.isIframe && !options.pageUrl) {
                    this.setHtml();
                } else {
                    this.setPageUrl(options.pageUrl);
                }
                this.isShown = true;
            } else {
            	// 20130710 modify by hanyin STORY #6351 win如果设置为打开时即最大化，只会在第一次打开的时候计算位置，第二次不会
                if (!this.isMax) {
                    this._rePosition();
                } else {
                		this._max();
                }
              // 20130710 modify by hanyin STORY #6351 win如果设置为打开时即最大化，只会在第一次打开的时候计算位置
                //onSetHtml && onSetHtml();
            }
            onShow && onShow();
        },
        //生成以iframe方式打开的html片段
        _getIframeHtml : function(pageUrl) {
            var htmlArr = [],element = this.element, id = element.attr('id') ,options = this.options;
            htmlArr.push('<iframe id="' + id + '-iframe" ');
            htmlArr.push('class="f-win-iframe"  frameborder="0"></iframe>');

            return htmlArr.join('');
        },

        /**
         * 设置FWin组件请求页面的路径，如果isIframe属性为true，则以iframe的方式加载页面。否则以ajax的方式获取内容html，然后添加到FWin组件中。注意，调用setPageUrl方法之前，需要先调用show方法。
         * @name FWin#setPageUrl
         * @param pageUrl 请求页面的路径
         * @function
         * @example
         *  $("#select").FWin('setPageUrl','contentPage.jsp');
         *
         */
        setPageUrl : function(pageUrl) {

            //add by qudc   2012-12-19  删除不必要的代码，如果没有pageUrl属性，则不发送请求获取页面。start
            if (!pageUrl) {
                return;
            }
            //add  by qudc  2012-12-19 end
            var options = this.options,UTILS = window['$Utils'];
            var contentHtml = '',bodyContentEl = this.bodyContentEl;
            var onSetHtml = options.onSetHtml;
            bodyContentEl.unbind();
            bodyContentEl.empty();

            pageUrl = pageUrl || options.pageUrl;
            options.pageUrl = pageUrl;
            /* 2013-01-10 bug 3837  start  delete by  qudc  删除原先url的处理方式，原因：原先的url处理不对http和https进行处理
             if (pageUrl.indexOf('/') !== 0) {
             pageUrl = UTILS.getContextPath() + '/' + pageUrl;
             } 2013-01-10  bug 3837  end  delete by  qudc
             */
            // 2013-01-10 bug 3837  start  add by  qudc  使用transUrl方法，可以支持对http和https请求的判断处理。
            pageUrl = UTILS.transUrl(pageUrl)
            // 2013-01-10 bug 3837  end  add by  qudc
            if (options.isIframe) {
                //以iframe的方式加载页面
                contentHtml = this._getIframeHtml(pageUrl);
                bodyContentEl.html(contentHtml);
                $("iframe:first", bodyContentEl).attr("src", pageUrl);
            } else {
                //ajax方法获取文件内容，回调
                $.ajax({
                    context:this,
                    dataType:"html",
                    url: pageUrl,
                    success: function(contentHtml) {
                        bodyContentEl.html(contentHtml);
                        //触发onSetHtml事件
                        onSetHtml && onSetHtml();
                    }
                });
            }
        },

        /**
         * 设置FWin组件内容区域的html片段。
         * @name FWin#setHtml
         * @function
         * @example
         *  $("#select").FWin('setHtml','&lt;div&gt;我是content内容&lt;/div&gt;');
         *
         */
        setHtml : function(html) {
            //delete by qudc 2102-12-19  删除异步设置html内容。start
            //setTimeout($.proxy(function() {
            var contentHtml = html,bodyContentEl = this.bodyContentEl;
            var element = this.element,id = element.attr('id'),options = this.options,onSetHtml = options.onSetHtml;

            bodyContentEl.unbind();
            bodyContentEl.empty();

            //组件内部自己调用
            if (!contentHtml) {
                //获取存放在页面中的内容
                var contentEl = $('#' + id + "-textarea");
                contentHtml = contentEl.val();
                // 2013-03-21 start add by qudc  修复需求：5189 ，解决win组件在其标签下面写包含原生textarea标签，由于textarea嵌套，导致页面解析不正常。现在修改成，如果要在fwin组件下面直接使用textarea标签，必须使用<textarea></_textarea> 替代
                contentHtml =  contentHtml.replace(/_textarea/g,'textarea');
                // 2013-03-21 end  add  by qudc
                //2013-1-11 start bug 3870   add by qudc  添加对contentHtml的判断，如果该值为空，即没有空格也没有回车，那么不进行设置，且不触发onSetHtml属性。
                if (contentHtml) {
                    bodyContentEl.html(contentHtml);
                    //触发onSetHtml事件
                    onSetHtml && onSetHtml();
                }
                //2013-1-11  end bug 3870  add by qudc
            } else {
                //组件外部通过方法调用
                //设置html内容
                bodyContentEl.html(contentHtml);
                //触发onSetHtml事件
                onSetHtml && onSetHtml();
            }
            //delete by qudc 2102-12-19  end
            // }, this), 300);
        },
        /**
         * 关闭窗体。
         * @name FWin#close
         * @function
         * @example
         * $("#select").FWin('close');
         *
         */
        close :function() {
            var options = this.options,onClose = options.onClose;
            this.element.css('display', 'none');
            this._hideBodyMask();
            /**
             * 窗体关闭时触发事件。
             * @event
             * @name FWin#onClose
             * @type Function
             * @example
             *
             */
            onClose && onClose();
        },
        /**
         * 重新计算window的位置，需要参数：组件的宽度，组件的高度。
         * @param w
         * @param h
         */
        _rePosition : function(w, h) {
            //计算win组件展现的位置
            var options = this.options;
            w = w || options.width,h = h || options.height;
            var windowEl = $(window),documentEl = $(document);
            var windowW = windowEl.width(),windowH = windowEl.height();
            var isBoxModel = jQuery.support.boxModel;
            var scrollLeft = isBoxModel && document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollTop = isBoxModel && document.documentElement.scrollTop || document.body.scrollTop;
            var left = (windowW - w) / 2 + scrollLeft;
            var top = (windowH - h) / 2 + scrollTop;
            top < 0 && (top = 0),left < 0 && (left = 0);
            this._showAt(left, top);
        },
        /**
         * 设置win组件展现的位置
         * @param left
         * @param top
         */
        _showAt : function(left, top) {
            var elStyle = this.element.get(0).style;
            elStyle.left = left + 'px';
            elStyle.top = top + 'px';
        },
        /**
         * 展现背景遮罩
         */
        _showBodyMask : function() {
            var options = this.options,element = this.element;
            var id = element.attr('id');

            if (options.modal) {
                //$('body').doMask('', {isWinMask :true});
                var UTILS = window['$Utils'];
                //UTILS.addClass($('body').get(0), 'f-mask-scroll-hide');
                if ($.browser.msie && $.browser.version == '6.0') {
                    this._hiddenAllSelectEl();
                }
                var maskId = id + '-mask';
                var maskEl = $('#' + maskId);
                if (maskEl.length == 0) {
                    var maskHtml = this._generateMaskHtml(maskId);
                    $('body').append(maskHtml);
                    this._adjustMask(maskId);
                    $("#" + maskId).show();
                } else {
                    this._adjustMask(maskId);
                    maskEl.show();
                }
            }
        },
        /**
         * 隐藏所有的原生select组件
         */
        _hiddenAllSelectEl :function () {
            if (this.hasHidden === true) {
                return;
            }
            var i = 0;
            var j = 0;
            var es;            //var es = vForm.elements;  //获取表单中所有的元素
            this.hiddenArrayList = this.hiddenArrayList || [];
            this.hasHidden = true;

            var winSelectEls =  $('body').children('.f-win').find('select');
            var selectEls = $('select').not(winSelectEls);

            var selectLen = selectEls.length;
            for (var i = 0; i < selectLen; i++) {
                var selectDom = selectEls.get(i);
                var selectStyle = selectDom.style;
                if (selectStyle.display == "none" || selectStyle.display == "block") {
                } else {
                    selectStyle.display = "none";
                    this.hiddenArrayList.push(selectDom); //直接将对象的引用保存到链表中
                }
            }
        },
        //回复隐藏的select框
        _showAllSelectEl :function () {
            if (this.hasHidden === false) {
                return;
            }

            this.hasHidden = false;
            var hiddenArrayList = this.hiddenArrayList;
            var length = $.isArray(hiddenArrayList) && hiddenArrayList.length || 0;
            //将隐藏链表中的元素恢复显示
            if (hiddenArrayList != null && hiddenArrayList != false && length > 0) {
                for (var i = 0; i < length; i++) {
                    hiddenArrayList[i].style.display = "";   //继续隐藏
                }
            }
            this.hiddenArrayList = hiddenArrayList = null;
        },
        /**
         * 隐藏背景遮罩
         */
        _hideBodyMask : function() {
            var options = this.options;
            if (options.modal) {
                if (this.maskEl && this.maskEl.length) {
                    var UTILS = window['$Utils'];
                    //UTILS.removeClass($('body').get(0), 'f-mask-scroll-hide');
                    if ($.browser.msie && $.browser.version == '6.0') {
                        this._showAllSelectEl();
                    }
                    this.maskEl.hide();
                }
            }
        },
        /**
         * 生成mask组件的dom结构
         */
        _generateMaskHtml : function(maskId) {
            var htmlArr = [];
            htmlArr.push('<div id="');
            htmlArr.push(maskId);
            htmlArr.push('" class="f-mask-bg" style ="position:absolute; z-index:');
            htmlArr.push(this.zIndex - 5);
            htmlArr.push(';display:none;"></div>');

            return  htmlArr.join('');
        },

        /**
         * 动态调整mask遮罩的位置
         */
        _adjustMask :function(maskId) {
            if (maskId === undefined) {
                return;
            }
            var maskEl = $('#' + maskId);
            if (maskEl.length) {
                this.maskEl = maskEl;
                /* 2013-02-01	hanyin		BUG #4631 Ie下，当win弹出时，背景body都会回到初始位置
                 var isBoxModel = jQuery.support.boxModel;
                 var documentElement = document.documentElement;

                 //可视区域的宽度
                 var w = isBoxModel && documentElement.clientWidth || document.body.clientWidth;
                 //可是区域的高度
                 var h = isBoxModel && documentElement.clientHeight || document.body.clientHeight;
                 //滚动条的水平偏移量
                 var scrollLeft = isBoxModel && documentElement.scrollLeft || document.body.scrollLeft;
                 //滚动条的垂直偏移量
                 var scrollTop = isBoxModel && documentElement.scrollTop || document.body.scrollTop;

                 //设置背景阴影的宽高
                 var bw = (w + scrollLeft) + 'px';
                 var bh = (h + scrollTop) + 'px';

                 maskEl.css('width', bw);
                 maskEl.css('height', bh);
                 */
                var bw = $(document).width();
                var bh = $(document).height();
                maskEl.width(bw);
                maskEl.height(bh);
            }
        },



        _resize : function() {
            var options = this.options;
            var w = options.width;
            var h = options.height;
            this.setSize(w, h);
            this.isMax = false;
        },

        /**
         * 通过传入的参数，设置组件的高宽并重新居中显示。注意事项：调用该方法之前，必须先调用组件的show方法展现组件。
         * @name FWin#setSize
         * @function
         * @param w 组件的宽度（number类型）
         * @param h 组件的高度(number类型)
         * @example
         * $("#select").FWin('setSize',w,h);
         *
         */
        setSize : function (w, h) {

            if (typeof w != 'number' || typeof h != 'number') {
                return;
            }
            var element = this.element,options = this.options;
            var onResize = options.onResize;
            var headerEl = element.find('.f-win-tl');
            var contentEl = element.find('.f-win-body');
            var footEl = element.find('.f-win-bl');


            //重新计算组件的位置
            this._rePosition(w, h);
            //设置组件的宽度
            element.width(w);
            //设置组件的高度
            element.height(h);
            var headerH = headerEl.outerHeight(true);
            var footH = footEl.outerHeight(true);
            var contentH = h - headerH - footH;
            //内容区域上下（1+1+1+1）px的border高度
            contentEl.height(contentH - 4);
            //内容区域左右（6+6）px的margin宽度 以及左右（1+1+1+1）px的border宽度
            contentEl.width(w - 16);

            /* 20130123 hanyin add 在win大小变化是触发onResize事件 */
            contentEl.triggerHandler("onResize");
            /* end 20130123 hanyin add 在win大小变化是触发onResize事件 */

            //触发onResize事件
            /**
             * 窗体大小被改变时。当用户调用setSize方法时，会触发该事件。
             * @event
             * @name FWin#onResize
             * @type Function
             * @example
             */
            onResize && onResize();

        },

        _initProperty : function() {
            var el = this.element;
            var options = this.options;
            if (options.hasCloseBtn) {
                this.closeBtn = el.find('.f-win-close');
            }
            this.bodyContentEl = el.find('.f-win-body');
            this.headerEl = el.find('.f-win-header');
            this.titleEl = el.find('.f-win-title');
            this.maxBtn = el.find('.f-win-max');
        },

        _toMaxIcon : function() {
            this.dragable && this.dragable.stop();
            this.maxBtn.removeClass('f-win-max');
            this.maxBtn.addClass('f-win-restore');
            this.headerEl.css('cursor', 'default');
            this.titleEl.css('cursor', 'default');
        },
        _toRestoreIcon : function() {
            this.dragable && this.dragable.start();
            this.maxBtn.removeClass('f-win-restore');
            this.maxBtn.addClass('f-win-max');
            this.headerEl.css('cursor', 'move');
            this.titleEl.css('cursor', 'move');
        } ,
        //窗口最大化
        _max : function() {
            var windowEl = $(window),documentEl = $(document);
            var windowW = windowEl.width(),windowH = windowEl.height();
            /* 注释 by qudc  2012-12-7  原因：showAt方法的功能已经放在setSize方法中的_reposition方法中实现。

             var isBoxModel = jQuery.support.boxModel;
             var scrollLeft = isBoxModel && document.documentElement.scrollLeft || document.body.scrollLeft;
             var scrollTop = isBoxModel && document.documentElement.scrollTop || document.body.scrollTop;

             (scrollLeft < 0) && (scrollLeft = 0);
             (scrollTop < 0) && (scrollTop = 0);

             this._showAt(scrollLeft, scrollTop);
             */
            this.setSize(windowW, windowH);
            this.isMax = true;
        },
        //绑定组件相关的事件
        _bindEvent : function() {
            var ME = this;
            var options = this.options;
            if (options.hasCloseBtn) {
                this.closeBtn.bind('click', function() {
                    ME.close();
                });
            }
            if (this.maxBtn && this.maxBtn.length) {
                this.maxBtn.bind('click', function(e) {
                    var target = e.target;
                    var className = target.className;

                    if (className.indexOf('f-win-restore') > -1) {
                        ME._resize();
                        //start 2012-12-07  modify qudc 将重复代码移到_toRestoreIcon方法中
                        ME._toRestoreIcon();
                        //end 2012-12-07  qudc
                    } else {
                        ME._max();
                        //start 2012-12-07   modify qudc  将重复代码移到_toMaxIcon方法中
                        ME._toMaxIcon();
                        //end 2012-12-07
                    }
                });
            }

            var options = this.options;
            var buttons = options.buttons;
            var len = buttons.length;
            var element = this.element;
            var id = element.attr('id');
            for (var i = 0; i < len; i++) {
                var clickFn = buttons[i].click || function() {
                };
                (function(clickFn) {
                    $("#" + id + '-btn-' + i).click(function(e) {
                        clickFn.call(ME);
                    });
                })(clickFn);
            }

            if (options.dragable) {
                this.dragable = new $.Dragable('f-win-title-' + id, id);
            } else {
                this.headerEl.css('cursor', 'default');
                this.titleEl.css('cursor', 'default');
            }
        },

        //将当前的window置到最前
        _front : function() {

        },


        /**
         *  生成win组件外框的html片段，不包含content内容
         */
        _generateWinHtml :function() {
            var htmlArr = [],options = this.options,element = this.element,id = element.attr('id');
            htmlArr.push('');
            htmlArr.push('<div class="f-win-tl" ');
            htmlArr.push('id="f-win-title-' + id);
            htmlArr.push('">');
            htmlArr.push('<div class="f-win-tr">');
            htmlArr.push('<div class="f-win-tc">');
            htmlArr.push('<div class="f-win-header">');
            if (options.hasCloseBtn) {
                htmlArr.push('<div class="f-win-tool f-win-close"></div>');
            }
            if (options.maxable) {
                htmlArr.push('<div class="f-win-tool f-win-max"></div>');
            }
            htmlArr.push('<span class="f-win-title ">');
            htmlArr.push(options.title);
            htmlArr.push('</span>');
            htmlArr.push('</div>');
            htmlArr.push('</div>');
            htmlArr.push('</div>');
            htmlArr.push('</div>');

            htmlArr.push('<div class="f-win-bwrap">');
            htmlArr.push('<div class="f-win-ml">');
            htmlArr.push('<div class="f-win-mr">');
            htmlArr.push('<div class="f-win-mc">');
            htmlArr.push('<div class="f-win-body" >');
            htmlArr.push('</div>');
            htmlArr.push('</div>');
            htmlArr.push('</div>');
            htmlArr.push('</div>');

            htmlArr.push('<div class="f-win-bl">');
            htmlArr.push('<div class="f-win-br">');
            htmlArr.push('<div class="f-win-bc">');

            var buttonsHtml = this._generateButtonHtml(options.buttons, options.buttonAlign);
            htmlArr.push(buttonsHtml);
            htmlArr.push('</div>');
            htmlArr.push('</div>');
            htmlArr.push('</div>');
            htmlArr.push('</div>');

            return htmlArr.join('');


        },
        //请求win组件的content内容
        _loadContent:function(url) {

        },

        /**
         * 根据buttons属性，生成对应的html片段，其中buttons必须为数组
         * @param buttons
         */
        _generateButtonHtml : function(buttons, buttonAlign) {
            var htmlArr = [];
            var len = buttons.length;
            if (len == 0) {
                htmlArr.push('<div style="height:8px;">');
                htmlArr.push('</div>');
            } else {
                htmlArr.push('<div style="height:40px;">');
                htmlArr.push('<div style="text-align:');
                htmlArr.push('' + buttonAlign);
                htmlArr.push(';padding:4px 3px 2px 3px;">');
                htmlArr.push('<div style=" display: inline-block;">');
                htmlArr.push('<table><tr>');
                var id = this.element.attr('id');
                for (var i = 0; i < len; i++) {
                    var buttonObj = buttons[i];
                    var text = buttonObj.text;
                    var iconCls = buttonObj.iconCls;
                    htmlArr.push('<td><div class="f-win-btn-l"><div class="f-win-btn-r"><div id="');
                    htmlArr.push(id);
                    htmlArr.push('-btn-' + i);
                    htmlArr.push('" class="f-win-btn-c">');
                    if (iconCls) {
                        htmlArr.push('<div class="f-win-btn-icon ');
                        htmlArr.push(iconCls);
                        htmlArr.push('" style="float:left;"></div>');
                        htmlArr.push('<div class="f-win-btn-icon-text">');
                    } else {
                        htmlArr.push('<div class="f-win-btn-noicon-text">');
                    }

                    htmlArr.push(text);
                    htmlArr.push('</div></td>');
                }
                htmlArr.push('</tr></table></div></div></div>');
            }
            return  htmlArr.join('');
        }
    });

})(jQuery);
      

