/*
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Accordion.js
 * 作者：hanyin
 * 邮箱：hanyin@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FAccordion组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 20121231  hanyin		创建
 * 20130110  hanyin		在大小变化是，设置content的宽度
 */

/**
 * @name FAccordion
 * @class 
 * 可折叠组件，也可被叫做手风琴组件或者抽屉组件，一次只能打开一个抽屉,通常用于主框架页面中的菜单展示。
 */

/**@lends FAccordion# */

(function($) {
	$.registerWidgetEvent("");
	$.widget("FUI.FAccordion", {
	    options : {
	    	/**
	    	 * 标识(仅标签使用)
	    	 * @name FAccordion#<ins>id</ins>
	    	 * @type String
	    	 * @default null
	    	 * @example 
	    	 * 无
	    	 */
	    	id : null,

	    	/**
	    	 * 抽屉布局首次展现时，默认展开的抽屉的索引，可以为整数,也可以为抽屉的id,获取当前处于激活状态的抽屉id可用getActivated()方法。</br>
	    	 * <ul>
	    	 * <li>如果抽屉个数为0，则active=-1，即不打开抽屉</li>
	    	 * <li>如果抽屉个数大于0，且active小于0(当为-1时并且collapsible!==false，则可以收起所有抽屉)，则active=0，</li>
	    	 * <li>如果抽屉个数大于0，且active大于抽屉的个数，则active=抽屉的个数-1</li>
	    	 * </ul>
	    	 * @name FAccordion#<ins>active</ins>
	    	 * @type String,Number
	    	 * @default 0
	    	 * @example
	    	 * 无 
	    	 */
	    	active : 0,

	    	/**
	    	 * 抽屉组件的高度，可取值为'auto'（每个抽屉的高度分别由抽屉的内容决定），这也是默认值；
	    	 * 可以取值为'fit'，表示适应父容器的大小，此时本组件必须是父容器的唯一儿子；也可以取值数字和数字类字符串，此时固定高度。
	    	 * @name FAccordion#<ins>height</ins>
	    	 * @type Number,String
	    	 * @default 'auto'
	    	 * @example
	    	 * 无 
	    	 */
	    	height : "auto",
	    	// 内容的高度
	    	_contentHeight : "auto",

	    	/**
	    	 * 抽屉布局的高度，可取值为'auto'或者"fit"，都表示自动适应父容器的宽度；可以取值数字和数字类字符串，固定宽度。
	    	 * @name FAccordion#<ins>width</ins>
	    	 * @type Number,String
	    	 * @default 'auto'
	    	 * @example 
	    	 */
	    	width : "auto",
	    	
	    	/**
	    	 * 激活一个抽屉时执行的方法
	    	 * @event
	    	 * @name FAccordion#onActive  
	    	 * @param index 被激活的抽屉的索引，从0开始计数。 
	    	 * @example
	    	 */
	    	onActive : null,

	    	/**
	    	 * 激活一个抽屉之前执行的方法。 如果返回布尔值false,那么对应抽屉将不会激活。
	    	 * @event
	    	 * @name FAccordion#onBeforeActive 
	    	 * @param index 被选择的抽屉的索引，从0开始计数。
	    	 * @example
	    	 */
	    	onBeforeActive : null,

	    	/**
	    	 * 收起一个抽屉前执行的方法。 如果返回布尔值false,那么对应抽屉将不会被收起。
	    	 * @event
	    	 * @name FAccordion#onBeforeCollapse  
	    	 * @param index 被收起的抽屉的索引，从0开始计数。 
	    	 * @example
	    	 */
	    	onBeforeCollapse : null,

	    	/**
	    	 * 收起一个抽屉时执行的方法
	    	 * @event
	    	 * @name FAccordion#onCollapse  
	    	 * @param index 被收起的抽屉的索引，从0开始计数。
	    	 * @example
	    	 */
	    	onCollapse : null,
	    	
	    	// 缓存所有headers的jquery对象
	    	_objHeaders : null,
	    	// 当前被激活的Id
	    	_curActiveId : null,
	    	
	    	_showProps : { 
		    	height: "show"
	    	},
	    	_hideProps : {
		    	height: "hide"
	    	}
	    },
	    
	    /**
	     * 销毁组件
	     * @name FAccordion#destroy
	     * @function
	     * @example
	     */
	    destroy : function() {
		    this._destroy();
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    },
	    
	    _destroy : function() {
		    op._objHeaders || op._objHeaders.destory();
		    op._objHeaders = null;
	    },
	    
	    _create : function() {
	    	var self = this;
	    	var op = self.options;
	    	op.id = this.element.attr("id");
	    	op._objHeaders = $Utils.IndexMap();
	    	self._initHeaders();
	    },
	    
	    _initHeaders : function() {
	    	var self = this;
	    	var op = self.options;
	    	var headerMappings = op._objHeaders;
	    	var headers = self.element.children(".f-accordion-header");;
	    	var size = headers.length;
	    	for (var i=0; i<size; i++) {
	    		var el = $(headers.get(i));
	    		if (i == size-1) {
	    			el.addClass("f-accordion-header-last-collapsed");
	    		}
	    		el.click(function() {
	    			self._toggleActivate(headerMappings.indexOf($(this).attr("id")));
	    		});
	    		headerMappings.put(el.attr("id"), el);
	    	}
	    },
	    
	    _init : function() {
	    	var self = this;
	    	var op = self.options;
	    	// 调整大小
	    	self.setSize(op.width, op.height);
	    	// 默认激活第一个
	    	self.activate(op.active);
	    },
	    // n只能是索引
	    _toggleActivate : function(n) {
	    	var self = this;
	    	var op = self.options;
	    	var headers = op._objHeaders;
	    	var size = headers.size();
	    	var id = headers.element(n).key;
	    	if (id == op._curActiveId){ // 已经被激活，则隐藏
	    		if (n >=0 && n < size-1) {
	    			n = n+1;
	    		} else if (n == size-1) { // 已经是最后一个则激活前一个
	    			n = n-1
	    		}
	    	}
	    	self.activate(n);
	    },

	    /**
	     * 激活指定的抽屉。index为整数或者抽屉的id。任何其它数据将会用parseInt及isNaN进行处理。 (注意，如果组件为禁用状态，执行此方法无任何效果)
	     * <ul>
	     * <li>如果抽屉个数为0，则不激活任何抽屉</li>
	     * <li>如果抽屉个数大于0，且index<0，则激活第一个抽屉(索引为0的那个抽屉)</li>
	     * <li>如果抽屉个数大于0，且index>=抽屉的个数，则激活最后一个抽屉</li>
	     * </ul>
	     * @name FAccordion#activate
	     * @function
	     * @param index 要激活的抽屉的索引(从0开始)或者抽屉的id
	     * @example
	     */
	    activate : function(n) {
	    	var self = this;
	    	var op = self.options;
	    	var headers = op._objHeaders;
	    	var size = headers.size();
	    	
	    	var el = self._parseToEl(n, headers);
	    	if (!el || el.length == 0) {
	    		return false;
	    	}
	    	
	    	var id = el.attr("id");
	    	var index = headers.indexOf(id);
	    	var curActiveId = op._curActiveId;
	    	if (id === curActiveId) { // 如果已经处于开启状态，则不重复展开
	    		return false;
	    	}
	    	
	    	// 调用hide回调，如果返回false，则阻止展开
	    	if (op._curActiveId && op.onBeforeCollapse) {
	    		var result = self._tryExcuteFunc(self, op.onBeforeCollapse, [headers.indexOf(op._curActiveId)]);
	    		if (result === false) {
	    			return false;
	    		}
	    	}
	    	
	    	// 调用show回调，如果返回false，则阻止激活
	    	if (op.onBeforeActive) {
	    		var result = self._tryExcuteFunc(self, op.onBeforeActive, [index]);
	    		if (result === false) {
	    			return false;
	    		}
	    	}
	    	
	    	// 隐藏当前被激活的页签
	    	var toHide = self._hideCurActive();
	    	// 显示此时被激活的页签
	    	var toShow = self._showActive(index, id, el);
	    	// 执行动画
//	    	if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
	    		!toHide || toHide.addClass("f-state-hide");
	    		toShow.removeClass("f-state-hide");
//	    	} else {
//		    	self._animate(toHide, toShow);
//	    	}
	    	var lasActiveId = op._curActiveId;
		    op._curActiveId = id;
	    	
	    	!op.onCollapse || self._tryExcuteFunc(self, op.onCollapse, [headers.indexOf(lasActiveId)]);
	    	!op.onActive || self._tryExcuteFunc(self, op.onActive, [index]);
	    },

    	// 之所以不直接使用slideUp和slideDown，是为了避免在动画过程中出现抖动的问题
	    _animate : function(toHide, toShow) {
	    	var op = this.options;
	    	var height = op._contentHeight;
			var adjust = 0;
	    	!toHide || toHide.stop(true,true).animate( op._hideProps, {
				duration: "fast",
				step : function( now, fx ) {
					fx.now = Math.round( now );
				}
			});
			toShow.stop(true,true).animate( op._showProps, {
				duration: "fast",
				step : function( now, fx ) {
					fx.now = Math.round( now );
					if (fx.prop !== "height") {
						adjust += fx.now;
					} else if (toHide && !isNaN(height)) {
						fx.now = Math.round( height - toHide.height() - adjust);
						adjust = 0;
					}
				}
			});
	    },
	    
	    _hideCurActive : function() {
	    	var self = this;
	    	var op = self.options;
	    	var headers = op._objHeaders;
	    	var id = op._curActiveId;
	    	if (!id) {
	    		return null;
	    	}
	    	var el = headers.get(id);
	    	var contentEl = el.next();
	    	if (!el || el.length==0 || !contentEl || contentEl.length==0) {
	    		return null;
	    	}
    		if (headers.indexOf(el.attr("id")) === headers.size()-1) {
    			el.addClass("f-accordion-header-last-collapsed");
    		}
    		el.children(".f-accordion-tool").addClass("f-tool-expand").removeClass("f-tool-collapse");
    		var nextHeader = contentEl.next();
    		nextHeader.removeClass("f-accordion-header-sibling-expanded");
//	    	contentEl.stop(true,true).slideUp("fast");
    		return contentEl;
	    },
	    
	    _showActive : function(n, id, el) {
	    	var self = this;
	    	var op = self.options;
	    	var headers = op._objHeaders;
	    	var contentEl = el.next();
    		if (n == headers.size()-1) {
    			el.removeClass("f-accordion-header-last-collapsed");
    		}
    		el.children(".f-accordion-tool").addClass("f-tool-collapse").removeClass("f-tool-expand");
    		var nextHeader = contentEl.next();
    		nextHeader.addClass("f-accordion-header-sibling-expanded");
//	    	contentEl.stop(true,true).hide().slideDown("fast");
	    	return contentEl;
	    },
	    
	    _parseToEl : function(n, headers) {
	    	if ($Utils.isJQueryObj(n)) { // jquery对象
	    		return n;
	    	}
	    	headers = headers || this.options._objHeaders;
	    	var size = headers.size();
	    	if (!isNaN(n)) { // 索引
	    		if (n < 0) {
	    			n = 0;
	    		} else if (n >= size) {
	    			n = size-1;
	    		}
	    		return headers.element(n).value;
	    	}
	    	if ($Utils.isString(n)) { // id
	    		return this.element.children("#"+n);
	    	}
	    	return null;
	    },
	    
	    /**
	     * 获取当前处于激活状态的抽屉的id,如果抽屉总数为0或者当前没有抽屉处于激活状态，那么返回null。
	     * <br/>可以通过返回的Id获取抽屉的header和content对象。
	     * @name FAccordion#getActivated
	     * @function
	     * @return 当前处于激活状态的抽屉的id
	     * @example
	     * var headerId= $("#accordion1").FAccordion("getActivated"); // 获取当前被激活的抽屉的ID
	     * var headerEl = $("#"+headerId); // 获取header对象
	     * var contentEl = headerEl.next(); // 获取content对象
	     */
	    getActivated : function() {
	    	return this.options._curActiveId;
	    },
	    
	    /**
	     * 获取指定索引抽屉的ID，如果不存在则返回null。<br/>可以通过返回的Id获取抽屉的header和content对象。
	     * @name FAccordion#getActivated
	     * @function
	     * @return 当前处于激活状态的抽屉的id
	     * @example
	     * var headerId= $("#accordion1").FAccordion("getByIndex", 1);
	     * var headerEl = $("#"+headerId); // 获取header对象
	     * var contentEl = headerEl.next(); // 获取content对象
	     */
	    getByIndex : function(n) {
	    	return this.options._objHeaders.element(n).key;
	    },

	    /**
	     * 获取抽屉的总数。
	     * @name FAccordion#getLength
	     * @function
	     * @return Number 抽屉的总数
	     * @example
	     */
	    getLength : function() {
	    	return this.options._objHeaders.size();
	    },

	    /**
	     * 设置指定抽屉的标题，标题内容可以为html文本
	     * @name FAccordion#setTitle
	     * @function
	     * @param index 要改变标题的抽屉的索引（从0开始计数）或者是抽屉的id
	     * @param title 新的标题，内容可以为html
	     * @return 0 Boolean
	     * @example
	     */
	    setTitle : function(n, title) {
	    	var self = this;
	    	var op = self.options;
	    	var el = self._parseToEl(n, op._objHeaders);
	    	if (!el || el.length == 0) {
	    		return false;
	    	}
	    	title = title || " ";
	    	el.children(".f-accordion-header-text").html(title);
	    },

	    /**
	     * 设置组件的大小
	     * @name FAccordion#setSize
	     * @function
	     * @param w 组件的宽度，支持Number/String，比如 500或者"500px"，不能传入其他的无效值
	     * @param h 组件的高度，支持Number/String，比如 500或者"500px"，不能传入其他的无效值
	     * @example
	     */
	    setSize : function(w, h) {
	    	var self = this;
	    	var op = self.options;
	    	var selfEl = this.element;
	    	
	    	if (w) { // 设置宽度
	    		w = parseInt(w);
	    		if (!isNaN(w)) {
	    			w = w-2;  // 边框2像素
	    			if (w < 0) {w=0;}
	    		} else {
	    			w = selfEl.parent().width() -2; // 自适应父亲的高度
	    			if (w < 0) {w=0;}
	    		}
	    		if (op.width !== w) {
	    			selfEl.width(w);
	    			self._adjustWidth(w);
	    		}
    			op.width = w;
	    	}
	    	if (h) { // 设置高度
	    		var rh = parseInt(h);
	    		if (!isNaN(rh)) {
	    			rh = rh-2; // 边框2像素
	    			if (rh < 0) {rh=0;}
	    		} else if (h === "fit") {
	    			rh = selfEl.parent().height() -2; // 自适应父亲的高度
	    			if (rh < 0) {rh=0;}
	    		} else {
	    			rh = "auto";
	    		}
	    		if (op.height !== rh) {
		    		selfEl.height(rh);
		    		// add 20130110 hanyin 在大小变化是，设置content的宽度
		    		self._adjustHeight(rh); // 调整内部content的高度
		    		// end add 20130110 hanyin 
	    		}
	    		op.height = h;
	    	}
	    },
	    
	    _adjustWidth : function(w) {
	    	var self = this;
	    	var op = self.options;
	    	var headers = op._objHeaders.elements;
	    	var size = headers.length;
	    	
	    	var contentWidth = "auto";
	    	if (!isNaN(w)) {
	    		contentWidth = w - 2; // 每个header的高度为28px
	    		if (contentWidth < 0) {contentHeight=0;}
	    	}
	    	for (var i=0; i<size; i++) {
	    		var el = headers[i].value;
	    		var contentEl = el.next();
	    		contentEl.width(contentWidth);
	    	}
	    	
	    	op._contentWidth = contentWidth;
	    },
	    
	    _adjustHeight : function(h) {
	    	var self = this;
	    	var op = self.options;
	    	var headers = op._objHeaders.elements;
	    	var size = headers.length;
	    	
	    	var contentHeight = "auto";
	    	if (!isNaN(h)) {
	    		contentHeight = h - size*28; // 每个header的高度为28px
	    		if (contentHeight < 0) {contentHeight=0;}
	    	}
	    	for (var i=0; i<size; i++) {
	    		var el = headers[i].value;
	    		var contentEl = el.next();
	    		contentEl.height(contentHeight);
	    	}
	    	
	    	op._contentHeight = contentHeight;
	    },
	    
	    // 如果传入的是function，则直接执行，否则认为传入的字符串是一个方法的名字，并执行这个方法
	    _tryExcuteFunc : function(obj, func, args) {
	    	var EMPTY_FUNC = function() {};
	    	var f = func || EMPTY_FUNC;
	    	if (!$.isFunction(func)) {
	    		try {
	    			f = eval(func);
	    			if (!$.isFunction(f)) {
	    				return;
	    			}
	    		} catch (e) {
	    			return;
				}
	    	}
	    	args = args || [];
	    	return f.apply(obj, args);
	    }
	});
})(jQuery);

