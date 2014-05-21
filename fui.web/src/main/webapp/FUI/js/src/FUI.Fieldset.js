/**
 * @name FFieldset
 * @class 
 * 字段集容器，和HTML的&lt;fieldset&gt;标签的功能类似；在一个form中，对组件进行分组和管理，浏览器会以特殊方式来显示它们，它们可能有特殊的边界，或者甚至可创建一个子表单来处理这些元素；可以折叠和展开。
 */

/**@lends FFieldset# */

/**
 * 标识(仅标签使用)
 * @name FFieldset#<ins>id</ins>
 * @type String
 * @default 随机生成
 * @example
 * 无
 */

/**
 * 是否隐藏(仅标签使用)
 * @name FFieldset#<ins>visible</ins>
 * @type boolean
 * @default true
 * @example
 * 无
 */

/**
 * 头部显示的标题文字。(仅标签使用)
 * @name FFieldset#<ins>title</ins>
 * @type String 
 * @default ""
 * @example
 * 无 
 */

/**
 * 如果为true，FFieldset是可收缩的，并且有一个收起/展开按钮自动被渲染到它的头部工具区域，否则没有按钮(默认值为false)。(仅标签使用)
 * @name FFieldset#<ins>collapsible</ins>
 * @type Boolean
 * @default true
 * @example
 * 无 
 */

/**
 * 如果为true，将FFieldset渲染成收缩的，否则渲染成展开的(默认值为false)。(仅标签使用)<br/>
 * 如果设置了此值为true，并且同时设置了collapsible为false，那么此值设置无效，<br/>
 * 请慎重设置此值：如果在组件初始化设置了此值为true，那么在Fieldset第一次展开的时候在部分浏览器下会造成组件的宽（高）度有调整，但是之后将会表现正常。
 * @name FFieldset#<ins>collapsed</ins>
 * @type Boolean
 * @default false 
 * @example
 * 无 
 */

(function($) {
	$.registerWidgetEvent("onExpand,onCollapse");
	$.widget("FUI.FFieldset", {
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
	         * 如果设置为true，表示控件在必要时自动显示横向或纵向滚动条。默认值为true。  (仅标签使用)
	         * @name FFieldset#<ins>autoScroll</ins>
	         * @type Boolean
	         * @default true 
	         * @example
	         * 无 
	         */
	        autoscroll : true,
	        /**
	         * 收起组件后触发的函数
	         * @event
	         * @name FFieldset#onCollapse
	         * @example
	         * onCollapse : function(){
	         *    //do something
	         * }
	         */
	        onCollapse : null,
	        /**
	         * 展开组件后触发的函数
	         * @event
	         * @name FFieldset#onExpand
	         * @example
	         * onExpand : function(){
	         *    //do something
	         * }
	         */
	        onExpand : null,

	        // 是否收起来
	        _isCollapsed : false,
	        // 是否需要在展开的时候重新计算高宽
	        _isNeedResize : false,
	        // 缓存jQuery对象：头部对象
	        _objHeader : null,
	        // 缓存jQuery对象：展开、收缩按钮
	        _objHeaderToggle : null,
	        // 缓存jquery对象：header
	        _objHeaderText : null,
	        // 缓存jQuery对象：bodyWrapper
	        _objBodyWrapper : null,
	        // 缓存body与外框相差的垂直像素个数
	        _bodyWrapperHGaps : 38,
	        // 缓存body与外框相差的水平像素个数
	        _bodyWrapperWGaps : 28
	    },
	    _create : function() {
		    // 初始化ID
		    var ID = this.element.attr("id");
		    var selfEl = this.element;
		    var op = this.options;

		    op.id = ID;
		    // 初始化缓存对象
		    op._objHeader = $I(ID + "-legend");
		    op._objHeaderToggle = $I(ID + "-toggle");
		    op._objHeaderToggle.css("float", "left");
		    op._objHeaderToggle.css("margin", "2px");
		    op._objHeaderText = $I(ID + "-title");
		    op._objBodyWrapper = $I(ID + "-bwrap");
		    // 是否折叠
		    op._isCollapsed = this.element.hasClass("f-collapsed");
		    op._isNeedResize = op._isCollapsed;
		    if (!op._isNeedResize) {
			    op._bodyWrapperHGaps = selfEl.outerHeight(false) - op._objBodyWrapper.height();
			    op._bodyWrapperWGaps = selfEl.outerWidth(false) - op._objBodyWrapper.width();
		    }
		    // 绑定事件
		    this._bindEvent();
	    },
	    _init : function() {
		    // 初始化
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
	    },
	    /**
	     * 销毁对象
	     * @name FFieldset#destroy
	     * @function
	     * @example
	     */
	    destroy : function() {
		    // 取消绑定的事件
		    this.options._objHeaderToggle.unbind();
		    // 销毁jQuery对象
		    this.options._objHeader = null;
		    this.options._objHeaderToggle = null;
		    this.options._objHeaderText = null;
		    this.options._objBodyWrapper = null;
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    },
	    /**
	     * 展开组件
	     * @name FFieldset#expand
	     * @function
	     * @example
	     */
	    expand : function() {
		    var self = this;
		    var selfEl = this.element;
		    var op = self.options;
		    if (op._isCollapsed) {
			    op._objBodyWrapper.slideDown("fast", function() {
				    self.element.addClass("f-collapsible").removeClass("f-collapsed");
				    op._isCollapsed = false;
				    if (op._isNeedResize) {
					    op._bodyWrapperHGaps = selfEl.outerHeight(false)
					            - op._objBodyWrapper.height();
					    op._bodyWrapperWGaps = selfEl.outerWidth(false)
					            - op._objBodyWrapper.width();
					    self.setSize(op.width, op.height);
					    op._isNeedResize = false;
				    }
				    if (op.autoscroll) {
					    op._objBodyWrapper.css("overflow", "auto");
				    }
				    // 调用回调或者触发事件
				    var canGo = true;
				    if ($.isFunction(op.onExpand)) {
					    var result = op.onExpand.call(self); // 回调方法返回false，则阻止触发事件
					    canGo = (result === false) ? false : true;
				    }
				    if (canGo) {
					    self.element.triggerHandler('onExpand');
				    }
				    $(this).css({
				    	zoom : 1
				    });
			    });
		    }
	    },
	    /**
	     * 收起组件
	     * @name FFieldset#collapse
	     * @function
	     * @example
	     */
	    collapse : function() {
		    var self = this;
		    var op = self.options;
		    if (!op._isCollapsed) {
			    op._objBodyWrapper.slideUp("fast", function() {
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
	     * 设置标题。 参数: title : String 被设置的title文本 返回值: void
	     * @name FFieldset#setTitle
	     * @function
	     * @param title String
	     * @return void
	     * @example
	     */
	    setTitle : function(title) {
		    if (title) {
			    this.options.title = title;
			    this.options._objHeaderText.text(title);
		    }
	    },
	    /**
	     * 设置组件的高宽，组件会自动调整内部toolbar的大小和位置
	     * @name FPanel#setSize
	     * @function
	     * @param w 组件的宽度，必须是数字或者数字类的字符串，或者百分比
	     * @param h 组件的高度，必须是数字或者数字类的字符串
	     * @example
	     */
	    setSize : function(w, h) {
		    var UTILS = window["$Utils"];
		    var op = this.options;
		    var selfEl = this.element;
		    var bodyEl = op._objBodyWrapper;
		    var bodyContent = bodyEl.children(".f-panel-body-content");
		    var contentSize = bodyContent.size();

		    if (w) {
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
				    var gaps = op._bodyWrapperWGaps;
				    // var gaps = 0;
				    w = parseInt(w);
				    var realSize = w - gaps;
				    if (!isNaN(realSize)) {
					    if (realSize < 0) {
						    realSize = 0;
					    }
					    selfEl.get(0).style.width = realSize + "px";
					    if (contentSize === 1) {
						    bodyContent.get(0).style.width = realSize + "px";
					    } else {
						    bodyEl.get(0).style.width = realSize + "px";
					    }
				    }
			    }
		    }
		    if (h) {
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
				    var gaps = op._bodyWrapperHGaps;
				    var realSize = parseInt(h) - gaps;
				    if (!isNaN(realSize)) {
					    if (realSize < 0) {
						    realSize = 0;
					    }
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
					    selfEl.get(0).style.height = "auto";
				    }
			    }
		    }
	    }
	});
})(jQuery);
