/**
 * @_name FPopupMessage
 * @_class <b>右下角弹出框组件</b><br/>
 * 在页面的右下角弹出消息，通知用户，并且不占用用户的工作空间，可定时关闭，可以手动关闭。
 */

/**@_lends FPopupMessage# */

(function($) {
	$.registerWidgetEvent("");
	$.widget("FUI.FPopupMessage", {
	    options : {
	        /**
	         * 弹出框显示的标题，如果不设置，或者设置为""，标题栏则会被隐藏
	         * @name FPopupMessage#title
	         * @type String
	         * @default ""
	         * @example
	         * 无
	         */
	    	title : "",
	        /**
	         * 弹出框自动关闭的超时时间，单位毫秒，如果没有设置此值，或者该值为0，则窗口不会自动关闭；默认不会自动关闭；如果设置的值小于1000，即1秒钟，则自动设置为1000。
	         * 如果在timeout时间内，鼠标移至弹出框上，则会中断计时，鼠标移出则重新计时。
	         * @name FPopupMessage#timeout
	         * @type String
	         * @default "0"
	         * @example
	         * 无
	         */
	    	timeout: null,
	        /**
	         * 弹出框可否被手动关闭，如果为true，则在窗口的右上角出现一个“关闭按钮”；否则，无法通过点击“关闭按钮”关闭窗口
	         * @name FPopupMessage#closable
	         * @type Boolean
	         * @default true
	         * @example
	         * 无
	         */
	    	closable: null,
	        /**
	         * 弹出框显示在窗口的右下角的位置，与右边框和下边框完全贴合，在某些场景下可以根据需要设置弹出框的偏移值： <br/>
	         * ① left 属性表示相对于原始位置左侧的偏移量，如果为正值，则向右偏移；负值则向左偏移；不设置或者设置为0，则水平位置不变；<br/>
	         * ② top 属性表示相对于原始位置上侧的偏移量，如果为正值，则向下偏移；负值则向上偏移；不设置或者设置为0，则垂直位置不变。 <br/>
	         * 不支持设置bottom、right属性。默认情况下，设置的偏移为 {left:-5, top:-5}，如果想取消偏移，请设置 {left:0, top:0}
	         * <br/>
	         * <span style="color:red">此属性不能通过标签来设置</span>
	         * @type Object
	         * @default {left:-5, top:-5}
	         * @example
	         * 无
	         */
	    	offset: null,
	        /**
	         * 指定要弹出组件的父容器，一般可以设置为document或者window对象（document和window都不能加引号）或者相应的jquery对象$(window)、$(document)；
	         * 如果设置为document或者$(document)，那么弹出框的位置会出现在页面的右下角，显示的位置随着滚动条而变化；如果设置为window或者$(window)，弹出框的位置会固定在
	         * 窗口的右下角，不会随着页面滚动条滚动<br/>
	         * <span style="color:red">暂不对外提供</span>
	         * @type Object/String
	         * @default window
	         * @example
	         * 无
	         */
	    	container : null,

	    	_popupMsgs: null
	    },
	    _create : function() {
	    	this.options.id = this.element.attr("id");
	    },
	    _init : function() {
	    },

		/**
		 * 显示弹出框
		 * @name FPopupMessage#show
		 * @function
		 * @param ops 
		 * <br/>
		 * @example
		 */
	    show : function(opts) {
	    	var self = this;
	    	var selfEl = this.element;
	    	
	    	if (self.options._popupMsgs == null) {
	    		self.options._popupMsgs = $Utils.IndexMap();
	    	}
	    	
	    	// 合并选项
	    	var op = self._processOptions(opts);
	    	// 如果不是一个弹出框组件，则需要重新构造DOM结构
	    	if (!selfEl.hasClass("f-popupMessage")) {
	    		op.id = (opts||{}).id;
	    		// 生成DOM结构，直接追加在当前对象的后部
	    		var html = self._genPopupMessageHTML(op);
	    		selfEl.append(html);
	    		// 将弹出框的Id保存
	    		self.options._popupMsgs.put(op.id, op.id);
	    	} else {
	    		op.id = selfEl.attr("id");
	    	}
	    	op._element = $I(op.id);
	    	if (op._element.size() == 0) {
	    		return;
	    	}
	    	var prevOp = op._element.data("_option");
	    	if (prevOp) {
	    		self._destroyPopup(prevOp.id, prevOp._element);
	    	}
	    	// 将配置项放到缓存中
	    	op._element.data("_option", op);
	    	// 初始化
	    	self._initPopup(op);
	    	// 绑定事件
	    	self._bindEvent(op);
	    	// 显示
	    	op._element.FPopupBox("show", op, function() {
		    	op._show = true;
	    	});
	    },
	    _initPopup : function(op) {
	    	var selfEl = op._element;
	    	selfEl.FPopupBox({}); // 尝试初始化PopupBox，如果已经初始化，则此方法无效
	    	op._show = false;
	    },
	    _bindEvent : function(op) {
	    	var id = op.id;
	    	var self = this;
	    	var selfEl = op._element;

	    	$I(id + "-icon").hover(function() {
	    		$(this).addClass("f-tool-closethick").removeClass("f-tool-close");
	    	}, function() {
    		  	$(this).removeClass("f-tool-closethick").addClass("f-tool-close");
    		}).click(function() {
    			if (op.closable) {
    				self.hide(op);
    			}
    		});

	    	var timeout = parseInt(op.timeout || "");
	    	if (!isNaN(timeout) && timeout > 0) {
		    	op._timeReset = 0;
	    		if (timeout < 1000) {
	    			timeout = 1000;
	    		}
	    		var timeReset = ++op._timeReset;
    			var funcProxy = $.proxy(self, "_tryTimeoutClose", timeReset, op);
	    		setTimeout(funcProxy, timeout);
		    	selfEl.hover(function() {
		    		op._timeReset++;
		    	}, function() {
		    		var timeReset = ++op._timeReset;
	    			var funcProxy = $.proxy(self, "_tryTimeoutClose", timeReset, op);
		    		setTimeout(funcProxy, timeout);
		    	});
	    	}
	    	
	    	op._changed = 0;
	    	$(window).bind("scroll.FPopupMessage-" + id, function() {
	    		if (!op._show) {
	    			return;
	    		}
	    		op._changed ++; // 在指定的时间内变化，延时显示窗口
    			var changeId = op._changed;
    			var scrollFuncProxy = $.proxy(self, "_scrollFunc", changeId, op);
    			setTimeout(scrollFuncProxy, 500);
	    	}).bind("resize.FPopupMessage-" + id, function() {
	    		if (!op._show) {
	    			return;
	    		}
	    		op._changed ++; // 在指定的时间内变化，延时显示窗口
    			var changeId = op._changed;
    			var scrollFuncProxy = $.proxy(self, "_scrollFunc", changeId, op);
    			setTimeout(scrollFuncProxy, 100);
	    	});
	    },

    	_tryTimeoutClose : function(timeReset, op) {
    		if (op._show && op._timeReset === timeReset) {
    			this.hide(op);
    		}
    	},

    	_scrollFunc : function(changeId, op) {
    		if (op._show && changeId == op._changed) {
    			op._element.FPopupBox("show", op);
    		}
    	},
	    
	    _processOptions : function(op) {
	    	var option = $.extend({}, this.options, (op || {}));
	    	option.position = option.position || {left:500000, top:500000};
	    	option.collision = "fit";
	    	option.container = option.container || window;
	    	option.offset = option.offset || {left:-5, top:-5};
	    	option.show = option.show || {
	    		effect : "fadeIn",
	    		duration : "fast"
	    	};
	    	option.hide = option.hide || {
	    		effect : "fadeOut",
	    		duration : "fast"
	    	};
	    	return option;
	    },
	    
	    // 生成弹出框的DOM结构
	    _genPopupMessageHTML : function(op) {
	    	var html = [];
	    	var id = op.id || $Utils.genId("f-popupMessage"); op.id = id;
	    	var title = (op.title || "").toString();
	    	var titleStyle = "";
	    	if (title.length == 0) {
	    		titleStyle = "style='display:none;'";
	    	}
	    	var closableStyle = "";
	    	if (op.closable == false || op.closable == "false") {
	    		closableStyle = "style='display:none;'";
	    		op.closable = false;
	    	} else {
	    		op.closable = true;
	    	}
	    	var content = op.content || "";
	    	
	    	var template ="\
	    	<div id='{0}' class='f-popupMessage f-widget f-corner-all'>\
	    	  <div id='{0}-header' {2} class='f-popupMessage-header'> \
	    	    {1} \
	    	    <span id='{0}-icon' {3} class='f-popupMessage-icon f-tool f-tool-close'>&nbsp;</span> \
	    	  </div> \
	    	  <div id='{0}-body' class='f-popupMessage-body'> \
	    	  	{4}\
	    	  </div> \
	    	</div>";
	    	return $Utils.format(template, id, title, titleStyle, closableStyle, content);
	    },

	    /**
	     * 设置显示区域的内容
	     * @name FPopupMessage#setContent
	     * @function
	     * @example
	     */
	    setContent : function(content) {
	    	if (this.element.hasClass("f-popupMessage")) {
	    		var id = this.options.id;
	    		$I(id + "-body").html(content);
	    	}
	    },

	    /**
	     * 隐藏弹出框
	     * @name FPopupMessage#hide
	     * @function
	     * @example
	     */
	    hide : function(op, opts) {
	    	if (this.element.hasClass("f-popupMessage")) {
	    		var option = this.element.data("_option");
	    		if (option && option._show) {
		    		this.element.FPopupBox("hide", op);
		    		this._destroyPopup(option.id, option._element);
		    		option._show = false;
	    		}
	    	} else {
	    		var size = 0;
	    		var ids = this.options._popupMsgs;
		    	if (this.options._popupMsgs) {
		    		size = ids.size();
		    	}
	    		if ($Utils.isString(op)) { // op=id，opts=hide的参数， 关闭此元素下指定id的弹出框
	    			if (size > 0 && ids.get(op) != null) {
	    				this._hideGenPopup(op, opts, ids);
	    			}
	    		} else if (typeof op == 'object' && op["_element"] != null) { // op为element原始的op，opts为hide的参数
	    			// 关闭指定的弹出框，主要内部使用
    				this._hideGenPopup(op.id, opts, ids);
	    		} else { // op 为hide的参数，opts无效：会关闭此元素下所有的弹出框
	    			if (size != 0) {
	    				for (var i=0; i<size; i++) {
	        				this._hideGenPopup(ids.element(ids.size()-1).key, op, ids);
	    				}
	    			}
	    		}
	    	}
	    },
	    
	    _hideGenPopup : function(id, option, ids) {
	    	var el = $I(id);
	    	var self = this;
	    	var data = el.data("_option");
	    	if (data) {
		    	el.FPopupBox("hide", option, function() {
		    		self._destroyPopup(id, el);
		    		data._show = false;
		    		el.remove(); // 移除DOM结构和事件，这里会调用PopupBox的destroy方法
		    	});
	    		ids.remove(id);
	    	}
	    },
	    
	    _destroyPopup : function(id, el) {
	    	if (!id || !el) {
	    		return;
	    	}
	    	// 移除配置项
	    	var data = el.data("_option");
	    	if (data) {
	    		data._show = false;
		    	el.removeData("_option");
		    	el.unbind();
	    	}
	    	// 解绑关闭按钮的事件
	    	$I(id + "-icon").unbind();
	    	// 解绑window上注册的所有事件
    		$(window).unbind(".FPopupMessage-" + id);
	    },
	    
	    /**
	     * 销毁组件
	     * @name FPopupMessage#destroy
	     * @function
	     * @example
	     */
	    destroy : function() {
		    var op = this.options;
		    if (this.element.hasClass("f-popupMessage")) {
	    		this._destroyPopup(op.id, this.element);
		    } else {
		    	// TODO 移除弹出的还没有被销毁的弹出框
		    	var leftMsgs = op._popupMsgs;
		    	if (leftMsgs) {
		    		var size = leftMsgs.size();
		    		for (var i=0; i<size; i++) {
		    			var id = leftMsgs.element(i).key;
		    			var el = $I(id);
		    			this._destroyPopup(id, el);
			    		// el.remove(); // 上层dom删除的时候，这里会调用PopupBox的destroy方法
		    		}
		    	}
		    }
		    op._popupMsgs.destroy();
		    op._popupMsgs = null;
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    }
	});
})(jQuery);
