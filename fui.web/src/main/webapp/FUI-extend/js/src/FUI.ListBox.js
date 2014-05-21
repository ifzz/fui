

/** @lends FListBox# */
(function($) {
	$.registerWidgetEvent("");
	$.widget("FUI.FListBox", {
	    options : {
	    	isMulti : false,
	    	_curOptions : null,
	    	_hasInit : false,
	    	_listItems : null,
	    	_isShow : false
	    },
	    
	    _create : function() {
	    	this.options.id = this.element.attr("id");
	    },
	    
	    _init : function() {
	    	var op = this.options;
	    },
	    
	    reset : function() {
	    	var op = this.options;
	    	if (op._isShow) {
		    	this.hide();
	    	}
	    	op._hasInit = false;
	    	op._listItems = [];
	    },

	    /**
	     * 销毁组件
	     * @name FListBox#destroy
	     * @function
	     * @example
	     */
	    destroy : function() {
		    var op = this.options;
		    op._curOptions = null;
		    op._listItems = null;
		    op._isShow = false;
		    op._hasInit = false;
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    },
	    
	    _getAllItems : function() {
	    	var self = this;
	    	var selfEl = this.element;
	    	var op = self.options;
	    	if (op._listItems == null) {
	    		op._listItems = $("li.f-listBox-item", selfEl).get();
	    	}
	    	return op._listItems;
	    },
	    
	    _getOption : function() {
	    	var op = this.options;
	    	if (!op._curOptions) {
	    		op._curOptions = {};
	    	}
	    	return op._curOptions;
	    },

	    isShow : function() {
	    	return this.options._isShow;
	    },
	    
	    show : function(op, filterItems, reverse, force) {
	    	var self = this;
	    	op = op || {};
	    	if (force === true) {
		    	op = $.extend({}, op);
	    	} else {
		    	op = $.extend({}, self.options, op);
	    	}
	    	self.options._curOptions = op;
	    	
	    	// 如果组件没有初始化，则尝试初始化
	    	if (!self.options._hasInit) {
	    		self._initListBox(op);
	    		self.options._hasInit = true;
	    	}
	    	// 过滤只显示指定的
	    	self._filterItems(filterItems, reverse);
	    	// 显示
	    	self._show(op);
	    	
	    	// 调整滚动条的位置
	    	var itemIndexes = self.options._curSelectedItems;
	    	if (itemIndexes.length > 0) {
		    	self._locate(itemIndexes[itemIndexes.length-1]);
	    	}
	    },
	    
	    // 如果reverse=true则只显示filterItems中的items，否则只隐藏filterItems中的items
	    _filterItems : function(filterItems, reverse) {
	    	var self = this;
	    	var selfEl = self.element;
	    	// 清除以前的过滤
	    	var items = self._getAllItems();
	    	var hiddenItems = self.options._curHiddenItems;
	    	for (var i=0; i<hiddenItems.length; i++) {
	    		$(items[hiddenItems[i]]).removeClass("f-listBox-item-hidden");;
	    	}
	    	if (!$.isArray(filterItems)) { // 如果传入的不是数组
	    		return;
	    	}
	    	self.options._curHiddenItems = [];
	    	hiddenItems = self.options._curHiddenItems;
	    	if (reverse === true) {
	    		for (var i=0; i<items.length; i++) {
	    			if ($.inArray(i, filterItems) == -1) {
		    			var item = items[i];
		    			$(item).addClass("f-listBox-item-hidden");
		    			hiddenItems.push(i);
	    			}
	    		}
	    	} else {
	    		for (var i=0; i<filterItems.length; i++) {
	    			var index = filterItems[i];
	    			var item = items[index];
	    			if (item) {
	    				$(item).addClass("f-listBox-item-hidden");
		    			hiddenItems.push(index);
	    			}
	    		}
	    	}
	    },
	    
	    _show : function(op) {
	    	var self = this;
	    	var selfEl = this.element;
	    	var showOpts = op.show = op.show || {};
	    	var hideOpts = op.hide = op.hide || {};
	    	var showCallback = op.show.callback;
	    	var hideCallback = op.hide.callback;
	    	op.show.callback = function(op) {
	    		var callback = showCallback;
	    		if ($.isFunction(callback)) {
	    			callback.call(this, op);
	    		}
	    		self._showCallback();
	    	};
	    	op.hide.callback = function(op) {
	    		var callback = hideCallback;
	    		if ($.isFunction(callback)) {
	    			callback.call(this, op);
	    		}
	    		self._hideCallback();
	    	};
	    	selfEl.FPopupBox("show", op);
	    },
	    
	    _showCallback : function() {
	    	this.options._isShow = true;
	    },
	    
	    _hideCallback : function() {
	    	this.options._isShow = false;
	    	this.focusItem(-1);
	    },
	    
	    // 调用此方法，需要确保index是有效的
	    _locate : function(index) {
	    	var self = this;
	    	var wrapperEl = $("#"+self.options.id+"-wrapper");
	    	var itemEl = $(this._getAllItems()[index]);
	    	if (itemEl.size() == 0) {
	    		return;
	    	}
	    	var wOffset = wrapperEl.offset(); // wrapper的偏移量
	    	var iOffset = itemEl.offset(); // item的偏移量
	    	
	    	if (wOffset.top > iOffset.top) {
	    		var gap = wOffset.top-iOffset.top;
	    		wrapperEl.scrollTop(wrapperEl.scrollTop() - gap);
	    	} else {
	    		var wHeight = wrapperEl.height();
	    		var iHeight = itemEl.outerHeight(true);
	    		var gap = (iOffset.top+iHeight) - (wOffset.top+wHeight);
	    		if (gap > 0) {
		    		wrapperEl.scrollTop(wrapperEl.scrollTop() + gap);
	    		}
	    	}
	    },
	    
	    _initListBox : function(op) {
	    	var self = this;
	    	var selfEl = this.element;
	    	// 绑定事件
	    	self._bindEvent(op);
	    	// 初始化参数
	    	self.options._curHoverItem = -1;
	    	self.options._curSelectedItems = [];
	    	self.options._curHiddenItems = [];
	    	// 如果组件没有初始化FPopupBox，则初始化FPopupBox组件
	    	if (!$Component.hasFType(selfEl, "FPopupBox")) {
	    		selfEl.FPopupBox({});
	    	}
	    },
	    
	    _bindEvent : function(op) {
	    	var self = this;
	    	var items = self._getAllItems();
	    	for (var i=0; i<items.length; i++) {
	    		var index = i;
	    		var el = $(items[index]);
	    		(function(el, index) { // 形成闭包，保护临时变量
			    	// 当鼠标悬浮在item上时，会有样式的变化
		    		el.hover(function() {
			    		self.focusItem(index);
		    		}, function() {
			    		self.focusItem(-1);
		    		});
		    		// 点击item时，状态变化
		    		el.click(function(e) {
		    			self.toggerItem(index);
		    		});
	    		})(el, index);
	    	}
	    	self.element.click(function(e) {
    			if (op.isMulti) {
	    			e.stopPropagation();
	    			return false;
    			}
	    	});
	    },
	    
	    // 获取被选中的items
	    getSelectedItems : function() {
	    	var selectedItems = this.options._curSelectedItems;
	    	if (selectedItems) {
	    		return selectedItems.slice(0)
	    	} else {
	    		return [];
	    	}
	    },
	    
	    getListLength : function() {
	    	return this._getAllItems().length;
	    },
	    
	    // 获取focus的item
	    getFocusItem : function() {
	    	return this.options._curHoverItem;
	    },
	    
	    // 如果是复选模式，则增加一个item，单选；则只选中这个item
	    toggerItem : function(index) {
	    	var self = this;
	    	var op = self._getOption();
	    	var selectedItems = self.options._curSelectedItems;
	    	var items = self._getAllItems();
	    	var size = items.length;
	    	if (index >= size) {
	    		return;
	    	}
	    	
	    	if (op.isMulti) { // 复选模式
		    	var ai = $.inArray(index, selectedItems);
		    	if (ai != -1) {
		    		$(items[index]).removeClass("f-listBox-item-selected");
		    		selectedItems.splice(ai, 1);
		    	} else {
		    		$(items[index]).addClass("f-listBox-item-selected");
		    		selectedItems.push(index);
		    	}
	    	} else { // 单选模式
	    		for (var i=0; i<selectedItems.length; i++) {
		    		$(items[selectedItems[i]]).removeClass("f-listBox-item-selected");
	    		}
	    		$(items[index]).addClass("f-listBox-item-selected");
	    		self.options._curSelectedItems = [index];
	    	}
	    },

    	// 清空选中状态
	    clearSelectedItems : function() {
	    	var self = this;
	    	var selectedItems = self.options._curSelectedItems;
	    	var items = self._getAllItems();
    		for (var i=0; i<selectedItems.length; i++) {
	    		$(items[selectedItems[i]]).removeClass("f-listBox-item-selected");
    		}
    		self.options._curSelectedItems = [];
	    },

	    // 首先清空所有已选的item，选中新的items
	    selectItems : function(items) {
	    	var self = this;
	    	self.clearSelectedItems();
	    	if ($.isArray(items)) {
	    		for (var i=0; i<items.length; i++) {
	    			if (!isNaN(items[i])) {
	    				self.toggerItem(items[i]);
	    			}
	    		}
	    	} else if (!isNaN(items)) {
    			self.toggerItem(items);
	    	}
	    },

	    // 标记一个指定的item
	    focusItem : function(index) {
	    	var op = this._getOption();
	    	var items = this._getAllItems();
	    	var size = items.length;
	    	if (size == 0) {
	    		return;
	    	}
	    	var self = this;
	    	// 将上一个hover状态复原
	    	var curHoverItem = self.options._curHoverItem;
	    	if (curHoverItem != -1 && curHoverItem < size) {
	    		var lastItemEl = $(items[curHoverItem]);
	    		lastItemEl.removeClass("f-listBox-item-over");
	    		self.options._curHoverItem = -1;
	    	}
	    	if (index >= size) {
	    		index = 0;
	    	}
	    	if (index >= 0) {
		    	var itemEl = $(items[index]);
	    		itemEl.addClass("f-listBox-item-over");
	    		self.options._curHoverItem = index;
	    		// 定位到当前元素
	    		self._locate(index);
	    	}
    		return index;
	    },
	    
	    focusNextItem : function() {
	    	var self = this;
	    	var op = self.options;
	    	var nextIndex = 0;
	    	if (op._curHoverItem == -1) { // 如果没有被hover的对象
		    	var selectedItems = self.options._curSelectedItems;
		    	if (selectedItems.length > 0) { // 尝试focus最后一个被select
		    		nextIndex = selectedItems[selectedItems.length-1];
		    	} else {
		    		return self.focusItem(0); // 尝试focus第0个
		    	}
	    	} else {
	    		nextIndex = op._curHoverItem;
	    	}
	    	var items = this._getAllItems();
	    	var length = items.length;
	    	for (var i=0; i<length; i++) {
	    		nextIndex = nextIndex +1;
	    		if (nextIndex >= length) {
	    			nextIndex = 0;
	    		}
	    		var itemEl = $(items[nextIndex]);
	    		if (!itemEl.hasClass("f-listBox-item-hidden")) {
	    			break;
	    		}
	    	}
	    	return self.focusItem(nextIndex);
	    },
	    
	    focusPrevItem : function() {
	    	var self = this;
	    	var op = self.options;
	    	var prevIndex = 0;
	    	if (op._curHoverItem == -1) { // 如果没有被hover的对象
		    	var selectedItems = self.options._curSelectedItems;
		    	if (selectedItems.length > 0) { // 尝试focus最后一个被select
		    		prevIndex = selectedItems[selectedItems.length-1];
		    	} else {
		    		return self.focusItem(0); // 尝试focus第0个
		    	}
	    	} else {
	    		prevIndex = op._curHoverItem;
	    	}
	    	var items = this._getAllItems();
	    	var length = items.length;
	    	for (var i=0; i<length; i++) {
	    		prevIndex = prevIndex -1;
	    		if (prevIndex < 0) {
	    			prevIndex = length -1;
	    		}
	    		var itemEl = $(items[prevIndex]);
	    		if (!itemEl.hasClass("f-listBox-item-hidden")) {
	    			break;
	    		}
	    	}
	    	return self.focusItem(prevIndex);
	    },
	    
	    hide : function() {
	    	var selfEl = this.element;
	    	selfEl.FPopupBox("hide", this._getOption());
	    }

	});
})(jQuery);
