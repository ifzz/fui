/*
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.FPopupBox.js
 * 作者：hanyin
 * 邮箱：hanyin@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FPopupBox组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 20130117 hanyin		z-index统一计算：WinIndex.getInstance().getIndex();
 */

(function($) {
	$.widget("FUI.FPopupBox", {
	    options : {
	        width: null,
	        height: null,
	        attach: null,
	        direction: "down,up",
	        offset: {top:0,left:0},
	        position: "absolute",
	        // 如果出现碰撞检测失败，"fit"则尝试自适应展开，"none"则强制采用第一个正确的方向展开
	        collision: "fit",
	        // 显示的动画选项，和jquery的animate函数的方法一致 {styles,speed,easing,callback}
	        // 也可以是jqueryui提供的通用方法比如"fadeOut"、“slideUp”等
	        show : null,
	        // 显示的动画选项，和jquery的animate函数的方法一致 {styles,speed,easing,callback}
	        // 也可以是jqueryui提供的通用方法比如"fadeIn"、“slideDown”等
	        hide : null,
	        
	        _objPopup : null,
	        _isValid : false,
	    	// 当前菜单被打开之后，初始化选项
	    	_curOptions : null
	    },
	    _create : function() {
		    // 初始化ID
		    var ID = this.element.attr("id");
		    var op = this.options;
		    op.id = ID;
		    op._objPopup = $I(ID);
		    if (op._objPopup.size() != 0) {
		    	op._isValid = true;
		    }
	    },
	    _init : function() {
	    },
	    destroy : function() {
	    	var op = this.options;
	    	this.options._curOptions = null;
//	    	var curOp = this.options._curOptions;
//	    	if (curOp) {
//	    		for (var name in curOp) {
//	    			curOp[name] = null;
//	    		}
//	    		curOp = null;
//	    	}
	    	for (var name in op) {
	    		op[name] = null;
	    	}
	    },
	    
	    show : function(op, callback, force) {
	    	if (!this.options._isValid) {
	    		return;
	    	}
	    	op = op || {};
	    	// force true表示忽略组件的默认值，否则会将传入的op与默认值合并
	    	var option = this._uniformOption(op, force);
	    	this.options._curOptions = option;
	    	//{ 20121129 hanyin 将回调放到showOpts中
	    	option.show = $.extend({}, (op.show || {}));
	    	option.show.callback = callback || (op.show || {}).callback;
	    	//} 

	    	var showMode = this._parseShowMode(option);
	    	var result = false;
	    	if (showMode === "ATTACH") {
	    		var attachEl = option.attach;
	    		if (!$Utils.isJQueryObj(option.attach)) { // 如果传入的不是jquery对象，则认为是选择器
		    		attachEl = $(option.attach);
	    		}
	    		if (attachEl.size() == 0) {
	    			return false;
	    		}
		    	// 依附组件相对于document的位置
		    	var attachOffset = attachEl.offset();
		    	// 依附组件的大小
		    	var attachSize = this._calAttachSize(attachEl);
		    	// 外框容器的大小，用于检测碰撞
		    	var containerBox = this._calContainerBox(option.container);
	    		var realOffset = this._calAttachMode(attachOffset, attachSize,
	    				option.size, option.direction, option.offset, containerBox, option.collision);
	    		result = this._showAbsolute(realOffset);
	    	} else if (showMode === "ABSOLUTE") {
		    	// 依附组件相对于document的位置
		    	var attachOffset = {left:option.position.left, top:option.position.top};
		    	// 依附组件的大小
		    	var attachSize = {height:0,width:0};
		    	// 外框容器的大小，用于检测碰撞
		    	var containerBox = this._calContainerBox(option.container);
		    	if (attachOffset.left == "center") {
		    		// x-min = max-(x+lenght) -> x=(max+min-lenght)/2
		    		attachOffset.left = (containerBox.minX + containerBox.maxX - option.size.width)/2;
		    	}
		    	if (attachOffset.top == "center") {
		    		// x-min = max-(x+lenght) -> x=(max+min-lenght)/2
		    		attachOffset.top = (containerBox.minY + containerBox.maxY - option.size.height)/2;
		    	}
	    		var realOffset = this._calAttachMode(attachOffset, attachSize, 
	    				option.size, option.direction, option.offset, containerBox, option.collision);
	    		result = this._showAbsolute(realOffset);
	    	} else if (showMode === "FIXED") {
	    		result = this._calFixedMode(option.size, option.offset);
	    	} else { // 显示在屏幕正中间
	    		result = this._calOtherMode(option);
	    	}
	    	return result;
	    },

	    // 依附于某一个组件
	    // attachOffset: 依附组件相对于document的偏移量
	    // attachSize: 依附组件的大小
	    // size: 弹出组件的大小
	    // direction: 弹出组件的弹出方向 left、right、up、down
	    // offset: 弹出组件相对于依附组件的偏移量
	    // containerSize: 外框容器的大小
	    _calAttachMode : function(attachOffset, attachSize, size, direction, offset, containerBox, collision) {
	    	offset = offset || {left:0,top:0};
	    	direction = direction || ['down', 'up'];
	    	if (direction.length == 0) {
	    		direction = ['down', 'up', "right", "upright", "left", "upleft"];
	    	}

	    	// 遍历所有的方向
	    	var resultDirection = null;
	    	var firstValidDirection = null
	    	var resultPos = null;
	    	for (var i=0; i<direction.length; i++) {
	    		var dir = direction[i].toLowerCase();
	    		var tryFunc = this["_try" + dir];
	    		if ($.isFunction(tryFunc)) {
	    			if (firstValidDirection == null) {
	    				firstValidDirection = dir;
	    			}
	    			var result = tryFunc.call(this, attachOffset, attachSize, size, containerBox);
	    			if (result === false) {
	    				continue;
	    			} else {
	    				resultDirection = dir;
	    				resultPos = result;
	    				break;
	    			}
	    		}
	    	}
	    	// 如果所有的方向都不能满足碰撞检测，则选取第一个有效的方向，如果没有合适的方向，则抛出异常
	    	if (resultDirection == null) {
	    		if (firstValidDirection != null) {
	    			resultDirection = firstValidDirection;
	    			resultPos = this["_cal" + firstValidDirection](attachOffset, attachSize, size, containerBox, collision);
	    	    	if (collision == "fit") {
	    	    		result = this._adjustPos(resultPos, size, containerBox);
	    	    	}
	    		} else {
	    			throw new Error("FPopupBox: no valid direction");
	    		}
	    	}
	    	var result = null;
	    	if (resultPos != null) {
			    var resultOffset = this._parseRealOffset(offset, resultDirection);
			    result = this._calRealOffset(resultPos, resultOffset);
	    	}
	    	return result;
	    },
	    
	    _adjustPos : function(pos, size, containerBox) {
	    	var minX = pos.left;
	    	var minY = pos.top;
	    	var maxX = minX + size.width;
	    	var maxY = minY + size.height;
	    	if (minX < containerBox.minX) {
	    		pos.left = containerBox.minX;
	    	} else if (maxX > containerBox.maxX) {
	    		pos.left = containerBox.maxX - size.width;
	    	}
	    	if (minY < containerBox.minY) {
	    		pos.top = containerBox.minY;
	    	} else if (maxY > containerBox.maxY) {
	    		pos.top = containerBox.maxY - size.height;
	    	}
	    	return pos;
	    },
	    
	    _calRealOffset : function(resultPosition, resultOffset) {
	    	var realOffset = {};
	    	realOffset.left = resultPosition.left + resultOffset.left;
	    	realOffset.top = resultPosition.top + resultOffset.top;
	    	return realOffset;
	    },
	    
	    // 计算容器的大小，返回size对象，包括属性 width和height
	    _calContainerSize : function(el) {
	    	var size = {};
	    	size.width = el.width();
	    	size.height = el.height();
	    	return size;
	    },
	    // 计算容器相对于document的最大最小位置
	    _calContainerBox : function(el) {
	    	var docEl = $(document);
	    	var winEl = $(window);
	    	if (el == null || !$Utils.isJQueryObj(el) || el.size() == 0) {
	    		el = docEl;
	    	}
	    	var box = {};
	    	if (el.get(0).window == window) {
		    	var scrollX = docEl.scrollLeft();
		    	var scrollY = docEl.scrollTop();
		    	box.minX = scrollX;
		    	box.minY = scrollY;
		    	box.maxX = scrollX + winEl.outerWidth();
		    	box.maxY = scrollY + winEl.outerHeight();
	    	} else if (el.get(0) == document) {
	    		var docWidth = docEl.width();
	    		var docHeight = docEl.height();
	    		var winWidth = winEl.width();
	    		var winHeight = winEl.height();
		    	box.minX = 0;
		    	box.minY = 0;
		    	// 适用于document比window小的情况，此时以window为准；出现滚动条则以document为准
		    	box.maxX = docWidth<winWidth?winWidth:docWidth;  
		    	box.maxY = docHeight<winHeight?winHeight:docHeight;
	    	} else {
		    	var elWidth = el.width();
		    	var elHeight = el.height();
		    	var offset = el.offset() || {left:0, top:0};
		    	box.minX = offset.left;
		    	box.minY = offset.top;
		    	box.maxX = offset.left + el.outerWidth();
		    	box.maxY = offset.top + el.outerHeight();
	    	}
	    	return box;
	    },
	    // 将向下的offset转换为相应方向的offset
	    _parseRealOffset : function(offset, direction) {
	    	var calFunc = this["_parseOffset" + direction];
	    	if ($.isFunction(calFunc)) {
	    		return calFunc.call(this, offset);
	    	}
	    	return offset;
	    },
	    
	    _parseOffsetdown : function(offset) {
	    	return offset;
	    },
	    
	    _parseOffsetup : function(offset) {
	    	var result = {};
	    	result.left = offset.left;
	    	result.top = 0-offset.top;
	    	return result;
	    },
	    
	    _parseOffsetright : function(offset) {
	    	return offset;
	    },
	    
	    _parseOffsetleft : function(offset) {
	    	var result = {};
	    	result.left = 0-offset.left;
	    	result.top = offset.top;
	    	return result;
	    },
	    
	    _trydown : function(attachOffset, attachSize, size, containerBox) {
	    	var maxY = attachOffset.top + attachSize.height + size.height;
	    	if (maxY > containerBox.maxY) {
	    		return false;
	    	}
	    	var maxX = attachOffset.left + size.width;
	    	if (maxX > containerBox.maxX) {
	    		return false;
	    	}
	    	return this._caldown(attachOffset, attachSize, size);
	    },
	    
	    _caldown : function(attachOffset, attachSize, size) {
	    	return {top:attachOffset.top+attachSize.height, left:attachOffset.left};
	    },
	    
	    _tryup : function(attachOffset, attachSize, size, containerBox) {
	    	var minY = attachOffset.top - size.height;
	    	if (minY < containerBox.minY) {
	    		return false;
	    	}
	    	var maxX = attachOffset.left + attachSize.width + size.width;
	    	if (maxX > containerBox.maxX) {
	    		return false;
	    	}
	    	return this._calup(attachOffset, attachSize, size);
	    },
	    
	    _calup : function(attachOffset, attachSize, size) {
	    	return {top:attachOffset.top-size.height, left:attachOffset.left};
	    },
	    
	    _tryright : function(attachOffset, attachSize, size, containerBox) {
	    	var maxY = attachOffset.top + size.height;
	    	if (maxY > containerBox.maxY) {
	    		return false;
	    	}
	    	var maxX = attachOffset.left + attachSize.width + size.width;
	    	if (maxX > containerBox.maxX) {
	    		return false;
	    	}
	    	return this._calright(attachOffset, attachSize, size);
	    },
	    
	    _calright : function(attachOffset, attachSize, size) {
	    	return {top:attachOffset.top, left:attachOffset.left+attachSize.width};
	    },
	    
	    _tryleft : function(attachOffset, attachSize, size, containerBox) {
	    	var maxY = attachOffset.top + size.height;
	    	if (maxY > containerBox.maxY) {
	    		return false;
	    	}
	    	var minX = attachOffset.left - size.width;
	    	if (minX < containerBox.minX) {
	    		return false;
	    	}
	    	return this._calleft(attachOffset, attachSize, size);
	    },
	    
	    _calleft : function(attachOffset, attachSize, size) {
	    	return {top:attachOffset.top, left:attachOffset.left-size.width};
	    },
	    
	    _tryupleft : function(attachOffset, attachSize, size, containerBox) {
	    	var minY = attachOffset.top - (size.height-attachSize.height);
	    	if (minY < containerBox.minY) {
	    		return false;
	    	}
	    	var minX = attachOffset.left - size.width;
	    	if (minX < containerBox.minX) {
	    		return false;
	    	}
	    	return this._callupleft(attachOffset, attachSize, size);
	    },
	    
	    _callupleft : function(attachOffset, attachSize, size) {
	    	return {top:(attachOffset.top - (size.height-attachSize.height)), left:attachOffset.left-size.width};
	    },
	    
	    _tryupright : function(attachOffset, attachSize, size, containerBox) {
	    	var minY = attachOffset.top - (size.height-attachSize.height);
	    	if (minY < containerBox.minY) {
	    		return false;
	    	}
	    	var maxX = attachOffset.left + attachSize.width + size.width;
	    	if (maxX > containerBox.maxX) {
	    		return false;
	    	}
	    	return this._callupright(attachOffset, attachSize, size);
	    },
	    
	    _callupright : function(attachOffset, attachSize, size) {
	    	return {top:(attachOffset.top - (size.height-attachSize.height)), left:attachOffset.left + attachSize.width};
	    },
	    
	    _calAttachSize : function(attachEl) {
	    	var size = {};
	    	size.width = attachEl.outerWidth(true);
	    	size.height = attachEl.outerHeight(true);
	    	return size;
	    },

	    _showAbsolute : function(offset) {
		    return this._showAt(offset, "absolute");
	    },
	    
	    // 相对于window的固定布局
	    _calFixedMode : function(size, offset) {
	    	return this._showAt(offset, "fixed");
	    },
	    
	    _showAt : function(offset, position) {
		    var op = this.options;
		    position = position || "absolute";
		    op._objPopup.css("position", position);
		    if (offset.left != null && !isNaN(offset.left)) {
			    op._objPopup.css("left", offset.left + "px");
		    } else {
			    op._objPopup.css("left", "");
		    }
		    if (offset.right != null && !isNaN(offset.right)) {
		    	op._objPopup.css("right", offset.right + "px");
		    } else {
		    	op._objPopup.css("right", "");
		    }
		    if (offset.top != null && !isNaN(offset.top)) {
		    	op._objPopup.css("top", offset.top + "px");
		    } else {
		    	op._objPopup.css("top", "");
		    }
		    if (offset.bottom != null && !isNaN(offset.bottom)) {
		    	op._objPopup.css("bottom", offset.bottom + "px");
		    } else {
		    	op._objPopup.css("bottom", "");
		    }
		    var zIndex = op.zIndex || this._getZIndex();
		    op._objPopup.css("z-index", zIndex);
		    // op._objPopup.show(); // jquery会把 ul等元素解释为inline
		    var showOp = this.options._curOptions.show;
		    var callback = null;
		    if (showOp != null && typeof showOp === 'object') {
		    	callback = showOp["callback"];
		    	var effect = showOp["effect"];
		    	var styles = showOp["styles"];
		    	if (effect != null) {
		    		if (this._doEffectAnimate(op._objPopup, effect, showOp) === true) {
		    			return true;
		    		}
		    	} else if (styles != null) {
		    		if (this._doStylesAnimate(op._objPopup, showOp) === true) {
		    			return true;
		    		}
		    	}
		    }
	    	op._objPopup.css("display", "block");
	    	if ($.isFunction(callback)) {
	    		try {
	    			callback.call(this, op);
	    		} catch (e) {
	    			// 忽略
	    			alert(e);
	    		}
	    	}
	    	return true;
	    },
	    
	    _doEffectAnimate : function(el, effect, op) {
	    	var func = el[effect];
	    	if (func != null) {
	    		el.stop(true); // 删除动画队列，避免误操作
		    	if (effect == "fadeTo") {
		    		el[effect](op.duration, op.opacity, op.callback);
		    	} else {
		    		el[effect](op.duration, op.callback);
		    	}
		    	return true;
	    	}
	    },
	    
	    _doStylesAnimate : function(el, op) {
    		el.stop(true); // 删除动画队列，避免误操作
	    	el.animate(op.styles, op.options);
	    	return true;
	    },
	    
	    // 20130117 hanyin z-index统一计算：WinIndex.getInstance().getIndex();
	    _getZIndex : function() {
//	    	var zIndex = $(document).data("f-z-index");
//	    	if (zIndex != null) {
//	    		zIndex += 1;
//	    	} else {
//	    		zIndex = 1000;
//	    	}
//	    	$(document).data("f-z-index", zIndex);
	    	return WinIndex.getInstance().getIndex();
	    },
	    
	    _calOtherMode : function(op) {
	    	var position = op.position;
	    	if (position === "center") {
		    	// 外框容器的大小，用于检测碰撞
		    	var containerSize = this._calContainerSize($(window));
		    	var popupSize = op.size;
		    	var offset = {};
		    	offset.left = (containerSize.width -popupSize.width)/2;
		    	if (offset.left < 0) {
		    		offset.left = 0;
		    	}
		    	offset.top = (containerSize.height -popupSize.height)/2;
		    	if (offset.top < 0) {
		    		offset.top = 0;
		    	}
		    	this._showAt(offset, "fixed");
	    	}
	    },
	    
	    _parseShowMode : function(option) {
	    	if (option.attach != null && $.trim(option.attach).length != 0) {
	    		return "ATTACH"; // 依附于某一个组件
	    	}
	    	if (option.position != null) {
	    		var position = option.position;
	    		if (typeof position=='object' && 
	    				(position.left != null || position.top != null 
	    						|| position.bottom != null || position.right != null)) {
	    			return "ABSOLUTE"; // 绝对布局
	    		}
	    	}
	    	if (option.position === "fixed") {
	    		return "FIXED"; // 固定布局
	    	}
	    	return option.position; //未定义处理方式
	    },

	    _uniformOption : function(op, force) {
	    	op = op || {};
	    	var option = null;
	    	if (force === true) {
	    		option = $.extend(false, {}, op); // 参数浅拷贝
	    	} else {
	    		option = $.extend(false, {}, op);
	    		option = $Utils.applyIf(option, this.options); // 合并默认值
	    	}

	    	option.direction = this._parseDirection(option.direction);
	    	option.offset = this._parseOffset(option.offset);
	    	option.position = this._parsePosition(option.position);
	    	option.size = this._calPopupBoxSize(option);
	    	option.container = this._calContainer(option);
	    	return option;
	    },
	    
	    _calContainer : function(option) {
	    	var container = option.container || $(window);
	    	if ($Utils.isString(container) || !$Utils.isJQueryObj(container)) {
	    		container = $(container);
	    	}
	    	return container;
	    },
	    
	    _calPopupBoxSize : function(option) {
	    	var popupBoxEl = this.options._objPopup;
	    	var size = {};
	    	var width = parseInt(option.width || "");
	    	var height = parseInt(option.height || "");
	    	if (!isNaN(width)) {
	    		size.width = width;
	    	} else {
	    		size.width = popupBoxEl.outerWidth(true);
	    	}
	    	if (!isNaN(height)) {
	    		size.height = height;
	    	} else {
	    		size.height = popupBoxEl.outerHeight(true);
	    	}
	    	return size;
	    },
	    
	    _parseDirection : function(direction) {
	    	if (direction != null) {
	    		if ($.isArray(direction)) { // 数组则直接返回
	    			return direction;
	    		} else { // 如果是字符串则进行逗号分隔
	    			return direction.split(",");
	    		}
	    	}
	    	return null;
	    },
	    
	    _parseOffset : function(offset) {
	    	var result = {left:offset.left,top:offset.top};
	    	if (offset != null) {
	    		if (offset.left != null) {
	    			result.left = parseInt(offset.left);
	    			if (isNaN(result.left)) {
	    				result.left = 0;
	    			}
	    		} else {
	    			result.left = 0;
	    		}
	    		if (offset.top != null && offset.top) {
	    			result.top = parseInt(offset.top);
	    			if (isNaN(result.top)) {
	    				result.top = 0;
	    			}
	    		} else {
	    			result.top = 0;
	    		}
	    		return result;
	    	}
	    	return null;
	    },
	    
	    _parsePosition : function(pos) {
	    	var result = {left:pos.left,top:pos.top};
	    	if (pos != null) {
	    		if (pos.left != null && pos.left != "center") {
	    			result.left = parseInt(pos.left);
	    			if (isNaN(result.left)) {
	    				result.left = 0;
	    			}
	    		}
	    		if (pos.top != null && pos.top != "center") {
	    			result.top = parseInt(pos.top);
	    			if (isNaN(result.top)) {
	    				result.top = 0;
	    			}
	    		}
	    		return result;
	    	}
	    	return null;
	    },
	    
	    hide : function(op, callback, force) {
	    	if (!this.options._isValid) {
	    		return;
	    	}
	    	var hasHide = false;
	    	var hideOp = null;
	    	op = op || {};
	    	if (force === true) {
	    		hideOp = $.extend(false, {}, op); // 参数浅拷贝
	    	} else {
	    		hideOp = $.extend(false, {}, op);
	    		hideOp = $Utils.applyIf(hideOp, this.options._curOptions);
	    	}
	    	hideOp = hideOp.hide || {};
	    	callback = hideOp.callback = callback || hideOp.callback;

		    if (hideOp != null && typeof hideOp === 'object') {
		    	var effect = hideOp["effect"];
		    	var styles = hideOp["styles"];
		    	if (effect != null) {
		    		if (this._doEffectAnimate(this.options._objPopup, effect, hideOp) === true) {
		    			hasHide = true;
		    		}
		    	} else if (styles != null) {
		    		if (this._doStylesAnimate(this.options._objPopup, hideOp) === true) {
		    			hasHide = true;
		    		}
		    	}
		    }
		    if (!hasHide) {
		    	this.options._objPopup.hide();
		    	if ($.isFunction(callback)) {
		    		callback.call(this, op);
		    	}
		    }
	    }
	});
})(jQuery);
