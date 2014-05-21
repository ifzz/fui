/*
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.FEnterSwitch.js
 * 作者：hanyin
 * 邮箱：hanyin@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FEnterSwitch组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 20130125  hanyin		修复enterSwitch组件无法切换的问题
 */

(function($) {
	$.registerWidgetEvent("");
	// 使回车键即tab键：保证容器内部的有效的input组件，在点击enter键时，按照tabIndex顺序切换到下一个，并保证在容器内部循环
	$.widget("FUI.FEnterSwitch", {
	    options : {
	    },
	    _create : function() {
	    	this.options.id = this.element.attr("id");
	    },
	    _init : function() {
	    	this._bindEvent();
	    },
	    
	    _bindEvent : function() {
	    	var self = this;
	    	self._getAllEls().keyup(function(e) {
	    		if (e.which == 13 || e.which == 108) { // 判断是否是回车键或者小键盘回车键
	    			// TODO 性能有待优化！
	    			// 实时获取所有可见有效的表单元素，允许用户在运行时将某些组件隐藏然后显示出来
	    			var MAX_GAP = 500;
	    			var els = self._getAllVisible().get();
	    			var curIndex = $.inArray(this, els);
	    			var mine = parseInt(this.tabIndex || 0) * MAX_GAP + curIndex;
	    	    	var minGap = 10000000; // 保存最小的差距，初始值很大
	    	    	var minGapIndex = -1; // 最小差距的元素索引，即下一个元素的索引
	    	    	var min = mine; // tabIndex最小的值
	    	    	var minIndex = curIndex; // 拥有tabIndex最小值 的元素的索引
	    	    	for (var i=0; i<els.length; i++) {
	    	    		var other = parseInt(els[i].tabIndex || 0) * MAX_GAP + i;
	    	    		if (other < min) {
	    	    			min = other;
	    	    			minIndex = i;
	    	    		}
	    	    		if (curIndex != i) {
	    	    			var curGap = other - mine;
	    	    			if (curGap == 1) {
	    	    				minGapIndex = i;
	    	    				break;
	    	    			}  else if (curGap > 0 && curGap < minGap) {
	    	    				minGap = curGap;
	    	    				minGapIndex = i;
	    	    			}
	    	    		}
	    	    	}
	    	    	var nextEl = null;
	    	    	if (minGapIndex != -1) { // 存在下一个元素
	    	    		nextEl = els[minGapIndex];
	    	    	} else { // 如果已经是最大的tabIndex，则自动切换到最小的tabIndex
	    	    		nextEl = els[minIndex];
	    	    	}
    				self._focusEl($(nextEl));
	    			return false; // 必须return false，否则会造成回车事件被传递给下一个组件比如textarea
	    		}
	    	});
	    },
	    
	    _focusEl : function(element) {
	    	var el = element;
	    	// 必须使用setTimeout(,0) 否则在使用某些情况下会造成浏览器假死（比如my97datepicker在focus是弹出的情况下）
	    	setTimeout(function() {  
	    		el.focus();
		    	if (el.is("input:text")) {
		    		el.select();
		    	}
	    	},0)
	    },
	    
	    _getAllEls : function() {
	    	// 容器下所有的<input> <select> <button>元素，保证textarea可以被切换到，但是不能通过回车切换到下一个
	    	return $(":input:not('textarea')", this.element);
	    },
	    
	    _getAllVisible : function() {
	    	// 所有可见的不是disabled的input、textarea、select的表单组件
	    	return $(":input:enabled:visible", this.element);
	    },
	    
	    /**
	     * 销毁组件
	     * @name FEnterSwitch#destroy
	     * @function
	     * @example
	     */
	    destroy : function() {
		    var op = this.options;
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    }
	});
})(jQuery);
