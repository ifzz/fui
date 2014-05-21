/**
 * @name FPanel
 * @class 
 * 面板容器，是一种面向用户界面构建应用程序最佳的单元块，一种特定功能和结构化组件。
 * 面板包含有底部和顶部的工具条，连同单独的头部、底部和body部分。它提供内建都得可展开和可闭合的行为，
 * 连同多个内建的可制定的行为的工具按钮。面板可简易地置入任意的容器或布局。
 */

/**@lends FPanel# */
/**
 * 标识(仅标签使用)
 * @name FPanel#<ins>id</ins>
 * @type String
 * @default 随机生成
 * @example
 * 无
 */

/**
 * 是否隐藏(仅标签使用)。该属性取消，可以通过设置panel的样式来达到相同的效果
 * @name FPanel#<ins><del>visible</del></ins>
 * @type boolean
 * @default 随机生成
 * @example
 * 无
 */

/**
 * 是否自动出现滚动条，当内容溢出时(仅标签使用)
 * @name FPanel#<ins>autoscroll</ins>
 * @type boolean
 * @default true
 * @example
 * 无
 */

/**
 * 标题设置(仅标签使用)
 * @name FPanel#<ins>title</ins>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 组件创建后是否处于收起状态，可调用expand()方法动态展开组件主体内容。(仅标签使用)
 * @name FPanel#<ins>collapsed</ins>
 * @type boolean
 * @default false
 * @example
 * 无
 */

/**
 * 组件创建时是否显示收起工具按钮(位于头部右边)。(仅标签使用)
 * @name FPanel#<ins>collapsible</ins>
 * @type boolean
 * @default true
 * @example
 * 无
 */
(function($) {
	$.registerWidgetEvent("onExpand,onCollapse");
	$.widget("FUI.FPanel", {
	    options : {
	        /**
	         * 此组件的整体宽度（包括border和padding，单位象素），默认为"auto"。<br/>
	         * 支持数字形式的字符串或者带px单位的数字字符串，比如"40"、"40px"，都表示40个像素，字符串如"px50"、"abcpx"等其他非法形式的字符串则被忽略；
	         * width也支持百分比，比如"10%"，则表示占用外层容器(div,td等)宽度的比率，此时请慎重设置左右margin、border和padding，否则会造成在不同浏览器下表现不一致不准确。<br/>
	         * @name FPanel#width
	         * @type String
	         * @default "auto"
	         * @example
	         * 无
	         */
	        width : "auto",
	        /**
	         * 此组件的整体高度（包括border和padding，单位像素），默认为auto。<br/>
	         * 仅支持数字形式的字符串或者带px单位的数字字符串，比如"40"、"40px"，都是表示40个像素；其他非法形式的字符串则被忽略。<br/>
	         * 请慎重设置组件的margin的top和bottom值，在不同浏览器下可能是不同的显示效果。
	         * height属性不支持百分比。
	         * @name FPanel#height
	         * @type String
	         * @default "auto"
	         * @example
	         * 无
	         */
	        height : "auto",
	        /**
	         * 异步加载内容的址
	         * @name FPanel#pageUrl
	         * @type String
	         * @default ""
	         * @example
	         * 无
	         */
	        pageUrl : null,
	        /**
	         * 是否采用iframe模式加载
	         * @name FPanel#isIframe
	         * @type boolean
	         * @default false
	         * @example
	         * 无
	         */
	        isIFrame : false,
	        /**
	         * panel的图标样式，位于头部左边的位置。(仅标签使用)
	         * @name FPanel#<ins>iconCls</ins>
	         * @type String
	         * @default ""
	         * @example
	         * 无
	         */
	        iconCls : null,
	        /**
	         * 收起panel组件后触发的函数
	         * @event
	         * @name FPanel#onCollapse
	         * @example
	         * onCollapse : function(){
	         *    //do something
	         * }
	         */
	        onCollapse : null,
	        /**
	         * 展开panel组件后触发的函数
	         * @event
	         * @name FPanel#onExpand
	         * @example
	         * onExpand : function(){
	         *    //do something
	         * }
	         */
	        onExpand : null,
	        /**
	         * 请求成功时触发
	         * @event
	         * @name FPanel#onLoadSuccess
	         * @param data  类型：Array[Object] 。请求返回的数据。
	         * @param textStatus   返回状态
	         * @param jqXHR   XMLHttpRequest对象
	         * @example
	         */
	        onLoadSuccess : null,
	        /**
	         * 请求超时时触发
	         * @event
	         * @name FPanel#onError
	         * @param jqXHR      XMLHttpRequest对象
	         * @param textStatus   返回状态
	         * @param  errorThrown  （可能）捕获的错误对象
	         * @example
	         */
	        onError : null,

	        // 保存面板的当前状态：面板是否收起来
	        _isCollapsed : false,
	        // 缓存jQuery对象：header
	        _objHeader : null,
	        // 缓存jQuery对象：toggle
	        _objHeaderToggle : null,
	        // 缓存jQuery对象： title
	        _objHeaderTitle : null,
	        // 缓存jQuery对象： icon
	        _objHeaderIcon : null,
	        // 缓存jQuery对象：wrapper
	        _objWrapper : null,
	        // 缓存jQuery对象：body
	        _objWrapperBody : null
	    },
	    _create : function() {
		    // 初始化ID
		    var ID = this.element.attr("id");
		    this.options.id = ID;
		    // 初始化header对象
		    this.options._objHeader = $I(ID + "-header");
		    this.options._objHeaderToggle = $I(ID + "-toggle");
		    this.options._objHeaderTitle = $I(ID + "-title");
		    this.options._objHeaderIcon = $I(ID + "-icon");
		    // 初始化wrapper对象
		    this.options._objWrapper = $I(ID + "-wrapper");
		    this.options._objWrapperBody = $I(ID + "-body");

		    // 是否折叠
		    this.options._isCollapsed = this.element.hasClass("f-collapsed");
		    // 绑定事件
		    this._bindEvent();
	    },
	    _init : function() {
		    // 如果是动态数据，并且开启自动加载，则加载数据
		    this.reload();
		    // 设置大小
		    this.setSize(this.options.width, this.options.height);
	    },
	    _bindEvent : function() {
		    var self = this;
		    var toggleEl = this.options._objHeaderToggle;

		    // toggle绑定hover事件
		    toggleEl.hover(function(event) {
			    toggleEl.addClass("f-tool-toggle-over");
		    }, function(event) {
			    toggleEl.removeClass("f-tool-toggle-over");
		    });

		    // 绑定点击事件
		    toggleEl.click(function() {
			    if (self.options._isCollapsed) {
				    self.expand();
			    } else {
				    self.collapse();
			    }
			    return false;
		    });
		    // 暂不支持
		    /*
		     * $(window).resize(function() { setTimeout(function() { self.resize(); }, 500); });
		     */
	    },
	    /**
	     * 销毁组件
	     * @name FPanel#destroy
	     * @function
	     * @example
	     */
	    destroy : function() {
		    var op = this.options;
		    // 取消绑定的事件
		    op._objHeaderToggle.unbind();
		    // 销毁jQuery对象
		    op._objHeader = null;
		    op._objHeaderToggle = null;
		    op._objHeaderTitle = null;
		    op._objHeaderIcon = null;
		    op._objWrapper = null;
		    op._objWrapperBody = null;
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    },
	    /**
	     * 重新加载指定的URL，如果传入的URL为空，则使用上一次使用的URL，如果没有配置URL，则直接返回，无任何效果
	     * @name FPanel#reload
	     * @function
	     * @param url 要加载的页面URL。在isFrame=true的情况下，url需要满足iframe的规范，在非iframe模式下，url不能跨域访问。
	     * @example
	     */
	    reload : function(url) {
		    var op = this.options;
		    var selfEl = this.element;
		    var bodyEl = op._objWrapperBody;

		    url = url || op.pageUrl;
		    if ($Utils.isEmpty(url)) {
			    // 不是动态数据加载
			    return;
		    }
		    op.pageUrl = url;

		    if (op.isIFrame) {
			    op._objWrapperBody.children("iframe").attr("src", url);
			    return;
		    }

		    if (selfEl.data("loading")) {
			    // 如果在加载过程中，则直接跳出
			    return;
		    } else {
			    selfEl.data("loading", true);
		    }
		    if (url.indexOf("/") !== 0) {
			    url = $Utils.getContextPath() + '/' + url;
		    }
		    // TODO 此入显示MASK
		    $.ajax({
		        cache : false,
		        type : "get",
		        url : url,
		        success : function(data, textStatus, jqXHR) {
			        bodyEl.html(data);
			        if ($.isFunction(op.onLoadSuccess)) {
				        op.onLoadSuccess(data, textStatus, jqXHR);
			        }
		        },
		        error : function(data, textStatus, jqXHR) {
			        if ($.isFunction(op.onError)) {
				        op.onError(data, textStatus, jqXHR);
			        }
		        },
		        complete : function() {
			        selfEl.data("loading", false);
			        // TODO 隐藏MASK
		        }
		    });
	    },
	    /**
	     * 打开面板。
	     * @name FPanel#expand
	     * @function
	     * @example
	     */
	    expand : function() {
		    var self = this;
		    var op = self.options;
		    if (op._isCollapsed) {
			    op._objWrapper.slideDown("fast", function() {
				    self.element.addClass("f-collapsible").removeClass("f-collapsed");
				    op._isCollapsed = false;
				    // 调用回调或者触发事件
				    var canGo = true;
				    if ($.isFunction(op.onExpand)) {
					    var result = op.onExpand.call(self); // 回调方法返回false，则阻止触发事件
					    canGo = (result === false) ? false : true;
				    }
				    if (canGo) {
					    self.element.triggerHandler('onExpand');
				    }
			    });
		    }
	    },
	    /**
	     * 折叠面板。
	     * @name FPanel#collapse
	     * @function
	     * @example
	     */
	    collapse : function() {
		    var self = this;
		    var op = self.options;
		    if (!op._isCollapsed) {
			    op._objWrapper.slideUp("fast", function() {
				    self.element.removeClass("f-collapsible").addClass("f-collapsed");
				    op._isCollapsed = true;
				    // 调用回调或者触发事件
				    var canGo = true;
				    if ($.isFunction(op.onCollapse)) {
					    var result = op.onCollapse.call(self);
					    canGo = (result === false) ? false : true;
				    }
				    if (canGo) {
					    self.element.triggerHandler('onCollapse');
				    }
			    });
		    }
	    },
	    /**
	     * 设置标题。
	     * @name FPanel#setTitle
	     * @function
	     * @param title 标题
	     * @example
	     */
	    setTitle : function(title) {
		    if (title) {
			    this.options.title = title;
			    this.options._objHeaderTitle.text(title);
		    }
	    },
	    /**
	     * 设置标题图标样式。
	     * @name FPanel#setIconCls
	     * @function
	     * @param iconCls 图标样式
	     * @example
	     */
	    setIconCls : function(iconCls) {
		    var op = this.options;
		    // 移除原有样式
		    if (op.iconCls && op.iconCls.length != 0) {
			    op._objHeaderIcon.removeClass(op.iconCls);
		    }
		    // 设置新样式
		    op._objHeaderIcon.addClass(iconCls);
		    op.iconCls = iconCls;
	    },
	    /**
	     * 设置组件的高宽，Panel组件会自动调整内部toolbar的大小和位置
	     * @name FPanel#setSize
	     * @function
	     * @param w 组件的宽度，必须是数字或者数字类的字符串，不支持百分比
	     * @param h 组件的高度，必须是数字或者数字类的字符串，不支持百分比
	     * @example
	     */
	    setSize : function(w, h) {
		    var UTILS = window["$Utils"];
		    var op = this.options;
		    var selfEl = this.element;
		    var bodyEl = op._objWrapperBody;
		    var bodyContent = bodyEl.children(".f-panel-body-content");
		    var contentSize = bodyContent.size();

		    if (w != null) {
			    // border、padding占用的大小
			    var percentage = UTILS.getPercentage(w);
			    if (percentage) {
				    selfEl.get(0).style.width = percentage;
				    bodyEl.get(0).style.width = "auto";
				    if (contentSize === 1) {
					    bodyContent.get(0).style.width = "auto";
				    }
			    } else {
				    // 对于'40'和'40px'等同样处理为40
				    var gaps = 2;
				    w = parseInt(w);
				    var realSize = w - gaps;
				    if (!isNaN(realSize)) {
					    if (realSize < 0) {
						    realSize = 0;
					    }
					    selfEl.get(0).style.width = w + "px";
					    if (contentSize === 1) {
						    bodyContent.get(0).style.width = realSize + "px";
					    } else {
						    bodyEl.get(0).style.width = realSize + "px";
					    }
				    }
			    }
		    }
		    if (h != null) {
			    // border、padding占用的大小
			    var percentage = UTILS.getPercentage(h);
			    if (percentage) {
				    selfEl.get(0).style.height = percentage;
				    bodyEl.get(0).style.height = "auto";
				    if (contentSize === 1) {
					    bodyContent.get(0).style.height = "auto";
				    }
			    } else {
				    // 对于'40'和'40px'等同样处理为40
				    var gaps = 27;
				    var realSize = parseInt(h) - gaps;
				    if (!isNaN(realSize)) {
					    if (realSize < 0) {
						    realSize = 0;
					    }
					    selfEl.get(0).style.height = "auto";
					    if (contentSize === 1) {
						    var otherHeight = 0;
						    bodyContent.siblings().not('script').each(function() {
							    // alert($(this).attr('id') + ":" + $(this).outerHeight(true));
							    otherHeight += $(this).outerHeight(true);
						    });
						    realSize = (realSize - otherHeight) < 0 ? 0 : (realSize - otherHeight);
						    bodyContent.get(0).style.height = realSize + "px";
					    } else {
						    bodyEl.get(0).style.height = realSize + "px";
					    }
				    }
			    }
		    }
	    }
	});
})(jQuery);
