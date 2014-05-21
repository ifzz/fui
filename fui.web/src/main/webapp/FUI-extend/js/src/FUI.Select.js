

/** @lends FSelect# */
(function($) {
	$.registerWidgetEvent("");
	$.widget("FUI.FSelect", {
	    options : {
	    	isMulti : false,
	    	width : null,
	    	height : null,
	    	data : [],
	    	displayField : "text",
	    	valueField : "value",
	    	displayFormat : null,
	    	seperator: ",",
	    	_listBoxId : null,
	    	_isDataChanged : true,
	    	_lastFilterStr : "",
	    	_hasInitInput : false
	    },
	    
	    _create : function() {
	    	this.options.id = this.element.attr("id");
	    },
	    
	    _init : function() {
	    	var op = this.options;
	    	op._hasInitInput = false;
	    	this._bindEvent();
	    },

	    /**
	     * 销毁组件
	     * @name FSelect#destroy
	     * @function
	     * @example
	     */
	    destroy : function() {
		    var op = this.options;
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    },
	    
	    _bindEvent : function() {
	    	var self = this;
	    	var selfEl = this.element;
	    	var op = self.options;
	    	var inputEl = selfEl.FTextField("getInputEl");

	    	var selfTrigger = $I(op.id + "-trigger");
	    	// 绑定按钮点击事件
	    	selfTrigger.click(function(e) {
	    		e.stopPropagation();
	    		self._showListBox();
	    		inputEl.focus();
	    		return false;
	    	});
	    	
	    	// 绑定当value被修改后，更新显示域和list
	    	selfEl.bind("onValueChanged", function(e, v) {
	    		selfEl.FTextField("displayValue", v, true);
	    	});
	    },
	    
	    _doFilter : function() {
	    	var self = this;
	    	var selfEl = this.element;
	    	var op = this.options;
	    	var filterStr = selfEl.FTextField("displayValue");
	    	if (filterStr == "" || filterStr == op._lastFilterStr) {
	    		return ; // 不需要重复过滤
	    	}
	    	op._lastFilterStr = filterStr;
	    	var needShow = [];
	    	var data = op.data || [];
	    	for (var i=0; i<data.length; i++) {
	    		var obj = data[i];
	    		var value = obj[op.valueField] || "";
	    		if (value && value.startWith(filterStr)) {
	    			needShow.push(i);
	    		}
	    	}
	    	var listboxEl = self._getListBoxEl();
			self._showListBox(needShow, true, false);
	    },
	    
	    _showListBox : function(filterItems, reverse, update) {
	    	var self = this;
	    	var op = this.options;
	    	var listboxEl = this._getListBoxEl();
	    	listboxEl.FListBox("show", null, filterItems, reverse);
    		$(document).one("click.FListBox" + op._listBoxId, function() {
    			self._hideListBox();
    		});
    		if (update !== false) {
        		self._updateValue();
    		}
	    },
	    
	    _hideListBox : function() {
	    	var op = this.options;
	    	var self = this;
	    	var listboxEl = self._getListBoxEl();
	    	listboxEl.FListBox("hide");
	    	// 解绑document上的事件
	    	$(document).unbind("click.FListBox" + op._listBoxId);
    		self._updateValue();
	    },
	    
	    _getListBoxEl : function() {
	    	var self = this;
	    	var op = this.options;
	    	var selfEl = self.element;
	    	var id = op._listBoxId;
	    	if (op._isDataChanged) {
	    		if (id != null) {
	    			$I(id).remove(); // 删除DOM结构
	    			$(document).unbind("click.FListBox" + id);
	    		}
	    		id = self._generateListBox();
		    	op._listBoxId = id;
	    	} else {
	    		if (id == null) {
	    			id = self._generateListBox();
	    	    	op._listBoxId = id;
	    		}
	    	}
	    	op._isDataChanged = false;
	    	var el = $("#" + id);
	    	return el;
	    },
	    
	    _generateListBox : function() {
	    	var self = this;
	    	var op = this.options;
	    	var id = $Utils.genId("f-select-listbox");
	    	var data = this.options.data || [];
	    	var width = parseInt(op.width || 150) -2;
	    	var height = "auto";
	    	if (data.length >= 8) {
	    		height = parseInt(op.height || 160) + "px";
	    	}
	    	var html = [];
	    	html.push("<div id='"+id+"' class='f-listBox f-popupbox f-widget' style='width: "+width+"px;'>");
	    	html.push("<div id='"+id+"-wrapper' class='f-listBox-wrapper' style='overflow:auto;height:"+height+";'>");
	    	html.push("<ul>");
	    	for (var i=0; i<data.length; i++) {
	    		var obj = data[i];
	    		var item = {text:obj[op.displayField], value:obj[op.valueField]};
	    		var result = self._callDisplayFormat(i, item);
	    		html.push("<li class='f-listBox-item'>"+result+"</li>");
	    	}
	    	html.push("</ul></div></div>");
	    	$("body").append(html.join(""));
	    	// 初始化FListBox
	    	var el = $("#" + id);
	    	el.FListBox({attach: "#"+op.id+"-box", offset:{top:-1}, 
	    		show: {callback : function() {
	    	    	$("#"+self.options.id+"-box").addClass("f-state-active");
	    		}},
	    		hide : {callback : function() {
	    	    	$("#"+self.options.id+"-box").removeClass("f-state-active");
	    		}},
	    		isMulti : op.isMulti
	    	});
	    	el.click(function() { // 第一次初始化的时候绑定
	    		$("#" + op.id + "-input").focus();
	    		self._updateValue();
	    	});
	    	if (!op._hasInitInput) {
	    		op._hasInitInput = true;
		    	var selfEl = this.element;
		    	var inputEl = selfEl.FTextField("getInputEl");
		    	
		    	inputEl.keydown(function(e) {
			    	var listboxEl = self._getListBoxEl();
			    	var isShow = listboxEl.FListBox("isShow");
		    		if (e.which == 13) { // 回车
		    			if (isShow) {
		    	    		e.stopImmediatePropagation(); // 防止所有其他的回车事件被触发，比如enterSwitch组件
		    				var focusItem = listboxEl.FListBox("getFocusItem");
		    				if (focusItem != -1) {
		    					listboxEl.FListBox("toggerItem", focusItem);
		    				}
		    				if (!op.isMulti) {
		    					self._hideListBox();
		    				}
		    	    		self._updateValue();
		    				return false;
		    			}
		    		} else if (e.which == 40) { // up
		    			if (!isShow) {
		    				self._showListBox();
		    			}
		    			listboxEl.FListBox("focusNextItem");
		    			return false;
		    		} else if (e.which == 38) { // down
		    			if (!isShow) {
		    				self._showListBox();
		    			}
		    			listboxEl.FListBox("focusPrevItem");
		    			return false;
		    		} else if (e.which == 33) { // pageUp
		    			listboxEl.FListBox("focusItem", 0);
		    			return false;
		    		} else if (e.which == 34) { // pagedown
		    			listboxEl.FListBox("focusItem", 0);
		    			listboxEl.FListBox("focusPrevItem");
		    			return false;
		    		} else if (e.which == 27) { // ESC
		    			if (isShow) {
			    			self._hideListBox();
			    			return false;
		    			}
		    		} else {
	    				if (!op.isMulti && e.which != 9) {// 只有单选可以执行过滤，并且按下的不是tab
			    			var ME = self;
			    			var filterProxy = $.proxy(self._doFilter, self);
			    			setTimeout(filterProxy, 100);
	    				}
		    		}
		    	}).click(function(e) {
		    		e.stopPropagation();
		    		return false;
		    	});
	    	}
	    	return id;
	    },
	    
	    _callDisplayFormat : function(i, item) {
	    	var displayFormat = this.options.displayFormat;
	    	if (!$.isFunction(displayFormat)) {
	    		displayFormat = function(i, item) {
	    			return item.value+":"+item.text;
	    		};
	    	}
	    	var self = this;
	    	return displayFormat.call(self, i, item);
	    },
	    
	    _updateValue : function() {
	    	var self = this;
	    	var selfEl = this.element;
	    	var op = this.options;
	    	var data = op.data || [];
	    	var listboxEl = this._getListBoxEl();
	    	var selected = listboxEl.FListBox("getSelectedItems");
	    	var result = [];
	    	for (var i=0; i<selected.length; i++) {
	    		var obj = data[selected[i]];
	    		if (obj) {
	    			result.push(obj[op.valueField]);
	    		}
	    	}
	    	var seperator = op.seperator || ",";
	    	result = result.join(seperator);
	    	selfEl.FTextField("value", result);
//	    	selfEl.FTextField("displayValue", result);
	    },
	    
	    setData : function(data) {
	    	this.options.data = data;
	    	this.options._isDataChanged = true;
	    }
	    
	});
})(jQuery);
