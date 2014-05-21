/*
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Button.js
 * 作者：hanyin
 * 邮箱：hanyin@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FButton组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 20121231  hanyin		修复在IE下，点击Button周边无法出发点击事件的问题
 * 20130121  hanyin		新增setVisible、setDisabled方法
 * 20130123  hanyin		修复在setIconCls传入""之后，再次传入有效cls无法显示图标的问题
 * 20130131  hanyin		button的jsdoc中的setDisabled方法名错误为setDisable
 */

/** 
 * @name FButton
 * @class 
 * 按钮组件，代替原始html中的button，提供了图标的功能并扩展了常用的api，通常用于事件和动作触发。
 */

/**@lends FButton# */

/**
 * 标识（在标签中使用）
 * @name FButton#<ins>id</ins>
 * @type String
 * @default
 * @example
 * 无
 */

/**
 * 按钮的文本(仅标签使用)
 * @name FButton#<ins>text</ins>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 按钮的类型（submit、reset等）(仅标签使用)，此属性需要与Form一起使用。
 * @name FButton#<ins>type</ins>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 渲染该组件为禁用状态的（默认为false）(仅标签使用)
 * @name FButton#<ins>disabled</ins>
 * @type boolean
 * @default false
 * @example
 * 无
 */
				 
(function($, undefined) {
	$.registerWidgetEvent("onClick");
	$.widget("FUI.FButton", {
	    options : {
	        /**
	         * 用来指定text前面的样式类，非必须
	         * @name FButton#iconCls
	         * @type String
	         * @default ""
	         * @example
	         * 无
	         */
	        iconCls : null,
	        /**
	         * 按钮的点击事件
	         * @event
	         * @name FButton#onClick
	         * @example
	         */
	        onClick : null,
	        _disabled: false
	    },
	    _create : function() {
		    // 初始化ID
		    var ID = this.element.attr("id");
		    this.options.id = ID;
		    
		    this.options._disabled = this.element.hasClass("f-state-disabled");

		    // 绑定事件
		    this._bindEvent();
	    },
	    _init : function() {
	    },
	    _bindEvent : function() {
	    	var self = this;
	    	self.element.click(function(e) {
	    		// e.stopPropagation();
	    		self.click();
	    		// return false;
	    	});
	    },
	    // 对象销毁方法
	    destroy : function() {
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    },

	    /**
	     * 触发点击事件"onClick"。
	     * @name FButton#click
	     * @function
	     * @example
	     * $('#btn').FButton('click');
	     */
	    click : function() {
		    var self = this;
		    var op = self.options;
		    if (!self.isDisabled()) {
			    if ($.isFunction(op.onClick)) {
				    op.onClick.call(self);
			    }
		    }
	    },
	    /**
	     * 改变按钮的text属性。
	     * @name FButton#setText
	     * @function
	     * @param text 按钮文本
	     * @example
	     * $('#btn').FButton('setText','按钮text');
	     */
	    setText : function(text) {
		    if (text) {
			    this.element.find(".f-new-btn-text").html(text);
		    }
	    },
	    /**
	     * 判断组件是否被禁用
	     * @name FButton#isDisabled
	     * @function
	     * @example
	     * var disabled = $('#btn').FButton('isDisabled');
	     */
	    isDisabled : function() {
		    return this.options._disabled;
	    },
	    /**
	     * 禁用/启用组件。
	     * @name FButton#setDisabled
	     * @function
	     * @param disabled 如果为false，则表示启用；否则则表示禁用
	     * @example
	     * $('#btn').FButton('setDisable', false);
	     */
	    setDisabled : function(disabled) {
		    var op = this.options;
		    var selfEl = op._objSelfEl;
		    if (disabled === false) {
			    op._disabled = false;
			    this.element.removeClass("f-state-disabled");
		    } else {
			    op._disabled = true;
			    this.element.addClass("f-state-disabled");
		    }
	    }
	});

	$.widget("FUI.FSimpleButton", {
	    options : {
	        /**
	         * 此组件的整体高度（包括margin，单位像素），默认为24。<br/>
	         * 仅支持数字形式的字符串或者带px单位的数字字符串，比如"40"、"40px"，都是表示40个像素；其他非法形式的字符串则被忽略。<br/>
	         * 请慎重设置组件的margin的top和bottom值，在不同浏览器下可能是不同的显示效果。请不要设置button的padding、border的样式，否则会造成宽度计算不准确
	         * height属性不支持百分比。
	         * @name FSimpleButton#height
	         * @type String
	         * @default "24"
	         * @example
	         * 无
	         */
	        height : 24,
	        /**
	         * 此组件的整体宽度（包括margin，单位象素），默认为75。<br/>
	         * 支持数字形式的字符串或者带px单位的数字字符串，比如"40"、"40px"，都表示40个像素，字符串如"px50"、"abcpx"等其他非法形式的字符串则被忽略；
	         * width也支持百分比，比如"10%"，则表示占用外层容器(div,td等)宽度的比率，此时请慎重button设置左右margin、border和padding，否则会造成在不同浏览器下表现不一致不准确。<br/>
	         * 请不要设置button的padding、border的样式，否则会造成宽度计算不准确
	         * @name FSimpleButton#width
	         * @type String
	         * @default "75"
	         * @example
	         * 无
	         */
	        width : 75,
	        /**
	         * 按钮的点击事件
	         * @event
	         * @name FSimpleButton#onClick
	         * @example
	         */
	        onClick : null,

	        // 是否是禁用状态
	        _disabled : false
	    },
	    
	    _create : function() {
		    // 初始化ID
		    this.options.id = this.element.attr("id");
		    this.options._disabled = this._getBoxEl().hasClass("f-state-disabled");

		    // 绑定事件
		    this._bindEvent();
	    },
	    
	    _init : function() {
	    },
	    
	    _getBoxEl : function() {
	    	var op = this.options;
	    	var boxEl = op._objBoxEl;
	    	if (!boxEl) {
	    		boxEl = op._objBoxEl = this._getButtonEl().parent().parent();
	    	}
	    	return boxEl;
	    },
	    
	    _getButtonEl : function() {
	    	return this.element;
	    },

	    _bindEvent : function() {
		    var self = this;
		    var op = self.options;
		    var boxEl = self._getBoxEl();
		    var bntEl = self._getButtonEl();

		    boxEl.hover(function() {
		    	if (self.disabled()) {
		    		return;
		    	}
		    	boxEl.addClass("f-state-hover");
			}, function() {
		    	if (self.disabled()) {
		    		return;
		    	}
				boxEl.removeClass("f-state-hover f-state-active");
			}).mousedown(function() {
		    	if (self.disabled()) {
		    		return;
		    	}
				boxEl.addClass("f-state-active");
			}).mouseup(function() {
		    	if (self.disabled()) {
		    		return;
		    	}
				boxEl.removeClass("f-state-active");
			}).click(function() {
				self.click();
			});
			
		    bntEl.focus(function() {
		    	if (self.disabled()) {
		    		return;
		    	}
		    	boxEl.addClass("f-state-focus");
			}).blur(function() {
		    	if (self.disabled()) {
		    		return;
		    	}
				boxEl.removeClass("f-state-focus");
			});
	    },
	    
	    // 对象销毁方法
	    destroy : function() {
		    // 取消绑定的事件
	    	this._getBoxEl().unbind();
	    	this._getButtonEl().unbind();
	    	this.options._objBoxEl = null;
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    },

	    /**
	     * 触发点击事件"onClick"。
	     * @name FSimpleButton#click
	     * @function
	     * @example
	     * $('#btn').FButton('click');
	     */
	    click : function() {
		    var self = this;
		    var op = self.options;
		    if (!self.disabled()) {
			    // 如果有注册的点击事件，则先调用注册的点击事件
			    var canGo = true;
			    if ($.isFunction(op.onClick)) {
				    // setTimeout(function() {
				    var result = op.onClick.call(self);
				    canGo = (result === false) ? false : true;
				    // }, 0);
			    }
			    // 触发其他注册方式的点击事件
			    if (canGo) {
				    this.element.triggerHandler("onClick");
			    }
		    }
	    },
	    
	    /**
	     * 禁用/启用组件。
	     * @name FSimpleButton#disabled
	     * @function
	     * @param disabled 如果为false，则表示启用；否则则表示禁用
	     * @example
	     * $('#btn').FSimpleButton('disabled');
	     */
	    disabled : function(disabled) {
		    var op = this.options;
		    if (arguments.length === 0) {
		    	return op._disabled;
		    }
		    var boxEl = this._getBoxEl();
		    var bntEl = this._getButtonEl();
		    if (disabled === false) {
			    op._disabled = false;
			    boxEl.removeClass("f-state-hover f-state-active f-state-focus f-state-disabled");
			    bntEl.attr("disabled", false);
		    } else {
			    op._disabled = true;
			    boxEl.removeClass("f-state-hover f-state-active");
			    boxEl.addClass("f-state-disabled");
			    bntEl.attr("disabled", true);
		    }
	    },
	    
	    /**
	     * 改变按钮的text属性。
	     * @name FButton#setText
	     * @function
	     * @param text 按钮文本
	     * @example
	     * $('#btn').FButton('setText','按钮text');
	     */
	    setText : function(text) {
		    if (text) {
			    this._getButtonEl().html(text);
		    } else {
			    this._getButtonEl().html("&nbsp;");
		    }
	    }
	});

	$.FUI.FSimpleButton = $.FUI.FSimpleButton || {};
	$.FUI.FSimpleButton.generateHtml = function(op) {
		var id = op.id || $Utils.genId("f-button"); // 0
		var text = op.text || ("Button" + $Utils.UID); // 1
		var width = op.width || "75px"; // 2
		var height = op.height || "22px"; // 3
		var leftIconCls = op.leftIconCls; //4
		var rightIconCls = op.rightIconCls; // 5
		var onClick = op.onClick || ""; // 6
		var tabIndex = op.tabIndex || 0; // 7
		var disabled = op.disabled || false; // 8
		
		var iWidth = parseInt(width); // 9
		var iHeight = parseInt(height); // 10
		var iLineHeight = iHeight/2 -1; // 11
		
		var bntStyle = "width:"+iWidth+"px;"; // 12
		bntStyle += "height:"+iHeight+"px;";
		bntStyle += "line-height:"+iHeight+"px;";
		bntStyle += "margin-top:-"+(iLineHeight+2)+"px;";
		
		var boxStyle = op.style || ""; // 13
		
		var template = "\
			<div id='{0}-wrapper' style='{13}' class='f-button f-widget f-form-unselectable' onselectstart='return false;'> \
			<div class='f-button-box'  style='width:{9}px;height:{10}px'> \
			   <div class='f-button-t' style='line-height:{iLineHeight}px'>&nbsp;</div> \
			   <button id='{0}' hidefocus='true' class='f-button-text' style='text-align:center;{12}' \
			   	tabIndex={7}'> \
			   	{1} \
			   </button> \
			</div></div>";
    	return $Utils.format(template, id, text, width, height, leftIconCls, rightIconCls, onClick,
    			tabIndex, disabled, iWidth, iHeight, iLineHeight, bntStyle, boxStyle);
	};
})(jQuery);
