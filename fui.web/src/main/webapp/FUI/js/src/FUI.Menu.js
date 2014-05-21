/*
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Menu.js
 * 作者：hanyin
 * 邮箱：hanyin@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FMenu组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 20130108 hanyin		给menuItem增加title属性
 */

/**
 * @name FMenu
 * @class 
 * 菜单，适用于菜单方式链接导航或右键菜单。
 */

/**@lends FMenu# */

(function($) {
	$.registerWidgetEvent("onShow,onHide");
	$.widget("FUI.FMenu", {
	    options : {
	    	/**
	    	 * 标识(仅标签使用)
	    	 * @name FMenu#<ins>id</ins>
	    	 * @type String
	    	 * @default null
	    	 * @example
	    	 * 无
	    	 */
	    	id : null,

	    	/**
	    	 * 要关联的组件的选择器，或者jquery对象
	    	 * @type Object 
	    	 * @name FMenu#<ins>attach</ins>
	    	 * @default null
	    	 * @example
	    	 * $("#menu_1").FMenu("show", {attach:$("#buttonId")}) 或者
	    	 * $("#menu_1").FMenu("show", {attach:"#buttonId"})
	    	 */
	    	attach : null,

	    	/**
	    	 * 静态数据，用于初始化Menu对象
	    	 * @type Array
	    	 * @name FMenu#staticData
	    	 * @default null
	    	 * @example
			 * var data1 = [{id:"item1", text:"Fruit", url:"www.baidu.com", children:[{id:"subItem1", text:"Apple"},{id:"subItem2", text:"Grape"}]},
			 * 	    {id:"item2", text:"Electrical Equipment", children:[{id:"subItem21", text:"T.V."},{id:"subItem22", text:"Air-conditioning"}]}];
	    	 * $("#menu_1").FMenu("show", {staticData: data1})
	    	 */
	    	staticData : null,

	    	/**
	    	 * 当点击选择menu的时候触发的事件，item包含当前menuItem的所有数据。类型为function或者function的名字（字符串）。
	    	 * @name FMenu#<ins>onClick</ins>
	    	 * @event
	    	 * @type Function
	         * @param item 点击菜单选项的信息信息 {id: "...", url: "..."}
	         * @param event 触发的原始的jquery事件对象
	    	 * @default 无
	    	 * @example
	    	 * $("#menu_1").FMenu("show", {
	    	 *         onClick:function(item, event){
	    	 *            location.href = item.url;
	    	 *         }
	    	 * });
	    	 */
	    	onClick : null,

	    	/** 
	    	 * 显示之前事件，类型为function或者function的名字（字符串）
	    	 * @event
	    	 * @name FMenu#<ins>beforeShow</ins>
	         * @param options 本次menu显示出来的初始化选项，用户可以读取或者修改选项的值
	    	 * @example
	    	 * var beforeShow = function(options) {
	    	 *     // TODO ... do something
	    	 * };
	    	 * $("#menu_1").FMenu("show", {
	    	 *         beforeShow : beforeShow 		// 或者beforeShow : "beforeShow"
	    	 * });
	    	 */
	    	beforeShow : null,

	    	/** 
	    	 * 显示之后事件，类型为function或者function的名字（字符串）
	    	 * @event
	    	 * @name FMenu#<ins>onShow</ins>
	         * @param options 本次menu显示出来的初始化选项，用户可以读取或者修改选项的值
	    	 * @example
	    	 * var onShow = function(options) {
	    	 *     // TODO ... do something
	    	 * };
	    	 * $("#menu_1").FMenu("show", {
	    	 *         onShow : onShow 			// 或者 onShow:"onShow"
	    	 * });
	    	 */
	    	onShow : null,

	    	/** 
	    	 * 隐藏之后事件，类型为function或者function的名字（字符串）
	    	 * @event
	    	 * @name FMenu#<ins>onHide</ins>
	         * @param options 本次menu显示出来的初始化选项，用户可以读取或者修改选项的值
	    	 * @example
	    	 * var onHide = function(options) {
	    	 *     // TODO ... do something
	    	 * };
	    	 * $("#menu_1").FMenu("show", {
	    	 *         onHide : onHide 			// 或者 onHide:"onHide"
	    	 * });
	    	 */
	    	onHide : null,

	    	/** 
	    	 * 隐藏之前事件，类型为function或者function的名字（字符串）
	    	 * @event
	    	 * @name FMenu#<ins>beforeHide</ins>
	         * @param options 本次menu显示出来的初始化选项，用户可以读取或者修改选项的值
	    	 * @example
	    	 * var beforeHide = function(options) {
	    	 *     // TODO ... do something
	    	 * };
	    	 * $("#menu_1").FMenu("show", {
	    	 *         beforeHide : beforeHide 			// 或者 beforeHide:"beforeHide"
	    	 * });
	    	 */
	    	beforeHide : null,

	    	// 父菜单Id，对于一级菜单此参数为null
	    	_parentMenuId : null,
	    	// 弹出框对象
	    	_popupBox : null,
	    	// 当前focus的选项
	    	_objFocusItem : null,
	    	// 当前展开的选项
	    	_objActiveItem : null,
	    	// 当前展开的子菜单
	    	_idActiveSubMenu : null,
	    	// 菜单是否处于显示的状态
	    	_isShow : false,
	    	// 设置新的静态数据
	    	_isNewStaticData : false,
	    	// 是否设置了静态数据，主要用于在设置新的数据时删除旧的dom结构
	    	_staticMenuIds : [],
	    	// 当前菜单被打开之后，初始化选项
	    	_curOptions : null
	    },
	    _create : function() {
		    // 初始化ID
		    var ID = this.element.attr("id");
		    this.options.id = ID;
		    var staticData = this.options.staticData;
		    if (staticData != null) {
		    	this.options._isNewStaticData = true;
		    }
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
	    },

	    /**
	     * 显示menu，menu不会自己显示，必须调用show方法才能显示
	     * @name FMenu#show
	     * @function
	     * @param options 类型为Object，非必须，menu的显示属性，可以是attach、position、offset、direction等，详细的参数介绍请见“功能描述”中有关“初始化属性”和“显示属性”中的内容。
	     * @example
	     * //通过点击button显示menu
	     *  $('#btn').click(function(){
	     *     $('#menu_simple').FMenu('show', {attach:"#attachbutton"});
	     *});
	     */
	    show : function(op) {
	    	if (this.options._isShow === true) {
	    		this.hide(); // 隐藏菜单之后会清空菜单的状态
	    	}
	    	var self = this;
	    	var selfEl = this.element;
	    	op = op || {};
	    	self.options._curOptions = op = self._processOptions(op);
	    	// 触发beforeShow事件
	    	self._tryExcuteFunc(self, op.beforeShow, [op]);
	    	
	    	// 解析静态数据
	    	if (self.options._isNewStaticData) {
	    		var idStack = [];
	    		var menuStack = [];
	    		var funcStack = [];
	    		var html = self._tryParseStaticData(self.options.id, op.staticData, idStack, menuStack, funcStack);
	    		if (html != null && html.length != 0) {
		    		// 删除动态生成的子菜单的DOM结构，避免DOM结构溢出
	    			self._destroySubMenus();
	    			// 保存当前动态生成的子菜单
	    			self.options._staticMenuIds = idStack;
	    			// 修改menu的内部元素
		    		selfEl.html(html);
		    		selfEl.data("init.FMenu.FUI", false); // 将menu置为未初始化的状态
		    		if (menuStack.length != 0) {
			    		// 插入菜单的DOM结构
			    		$("body").append(menuStack.join(""));
			    		// 执行初始化脚本
			    		for (var i=0; i<funcStack.length; i++) {
			    			funcStack[i]();
			    		}
		    		}
	    		}
	    		self.options._isNewStaticData = false;
	    	}

	    	// 将参数进行拷贝一份，避免污染
	    	// 如果组件还没有初始化，则尝试初始化
	    	var hasInit = selfEl.data("init.FMenu.FUI");
	    	if (hasInit !== true) {
	    		this._initMenu(op);
	    		selfEl.data("init.FMenu.FUI", true);
	    	}
	    	this.options._popupBox.FPopupBox("show", op);
	    	this.options._isShow = true;
	    	setTimeout(function() { // 将绑定事件放到浏览器的事件队列中，保证菜单关闭的事件可以正常被注册
	    		var eventType = "click.FMenu-" + self.options.id;
		    	$(document).one(eventType, function() {
		    		self.hide();
		    	});
	    	}, 0);
	    	// 触发onShow事件
	    	self._tryExcuteFunc(self, op.onShow, [op]);
	    },
	    // 尝试解析静态数据
	    // [{id:"item1", text:"水果", children:[{id:"subItem1", text:"苹果"},{id:"subItem2", text:"葡萄"}]},
	    //  {id:"item2", text:"电器", children:[{id:"subItem3", text:"电视"},{id:"subItem4", text:"空调"}]}]
	    _tryParseStaticData : function(menuId, staticData, idStack, menuStack, funcStack) {
	    	if (staticData != null) {
	    		idStack = idStack || [];
	    		menuStack = menuStack || [];
	    		funcStack = funcStack || [];
	    		var jsonObj = staticData;
		    	if ($Utils.isString(jsonObj)) {
		    		try {
		    			jsonObj = eval(jsonObj);
		    		} catch (e) {
		    			jsonObj = "";
					}
		    	}
		    	if (!$Utils.isArray(jsonObj)) { // 不是合法的menu的json格式
		    		return null;
		    	}
		    	var ID = menuId;
		    	var html = [];
		    	// begin 20121214 hanyin 给menu增加 icon与文本之间的分隔线
		    	html.push("<li id='" + ID+ "-icon-seperator' class='f-menu-icon-seperator'></li>");
		    	// end 20121214 hanyin 给menu增加 icon与文本之间的分隔线
		    	for (var i=0; i<jsonObj.length; i++) {
		    		var item = jsonObj[i];
		    		item.id = item.id || (ID + "-gen-item-" + i);
		    		var subMenuData = item.children || [];
		    		item.subMenuId = null;
		    		if ($Utils.isArray(subMenuData) && subMenuData.length > 0) {
		    			item.subMenuId = ID + "-gen-subMenu-" + i;
		    			idStack.push(item.subMenuId);
			    		this._registerSubMenu(item.subMenuId, subMenuData, menuStack, funcStack);
		    		}
		    		this._generateMenuItemHTML(item, html);
		    	}
		    	return html.join("");
	    	}
	    	return null;
	    },
	    _generateMenuItemHTML : function(item, html) {
	    	var id = item.id;
	    	var text = (item.text || " ").length==0?(" "):item.text;
	    	var iconCls = item.iconCls || "";
	    	var disable = ((item.disable||"false")=="true")?true:false;
	    	var onClick = item.onClick || "";
	    	var url = item.url || "";
	    	var title = item.title || ""; // 20130108 add hanyin 增加title属性
	    	var checked = item.checked;
	    	var checkedClass = "";
	    	if (checked != null) {
	    		checked = checked.toString();
	    		if (checked == "true") {
	    			checkedClass = "f-state-checked";
	    		} else if (checked == "false") {
	    			checkedClass = "f-state-unchecked";
	    		}
	    	}
	    	if (text == "-") {
	    		html.push("<li class='f-menu-item f-menu-item-seperator'>&nbsp;</li>");
	    	} else {
	    		html.push("<li class='f-menu-item'>");
	    		html.push("<a id='" +id+ "'");
	    		html.push(" href='#" + (item.subMenuId != null?item.subMenuId:"") + "'");
	    		html.push(" clickEvent='" + onClick + "'");
	    		html.push(" url='" + url + "'");
	    		// add 20130108 hanyin 给menuItem增加title属性
	    		if (title) {
		    		html.push(" title=\"" + title.replace("\"", "'") + "\"");
	    		}
	    		// end add 20130108 hanyin 给menuItem增加title属性
	    		html.push(" class='f-corner-all " + (disable?"f-state-disabled":"") + " " + checkedClass + "'>");
	    		if (iconCls.length != 0) {
	    			html.push("<span class='f-icon " +iconCls+ "'></span>");
	    		}
	    		if (item.subMenuId != null) {
	    			html.push("<span class='f-menu-icon f-icon f-icon-item-arrow'></span>");
	    		}
	    		html.push(text);
	    		html.push("</a></li>");
	    	}
	    },
	    _registerSubMenu : function(subMenuId, subMenuData, menuStack, funcStack) {
	    	// 生成menu的dom结构
	    	// begin 20121214 hanyin 删除menu外框的圆角
	    	var html = "<ul id='"+subMenuId+"' class='f-menu f-menu-icons f-widget'></ul>";
	    	// end 20121214 hanyin 删除menu外框的圆角
	    	menuStack.push(html);
	    	// 将menu的初始化方法入栈
	    	funcStack.push(function(){
	    		$I(subMenuId).FMenu({staticData:subMenuData});
	    	});
	    },
	    // 合并显示参数
	    _processOptions : function(op) {
	    	// 如果传入的有position字段，则认为此次不是依附，而是绝对定位
	    	if (typeof op.position == "object") {
	    		op.attach = "";
	    	}
	    	op = $.extend({}, this.options, op);
	    	var attach = op.attach;
	    	if (attach != null && $.trim(attach).length != 0) { // 依附模式的话就向下或者向上弹开
		    	op.direction = op.direction || ["down", "up"];
	    	}
	    	op.direction = op.direction || "all"; // 没有指定方向，则采用全方向展开
	    	if (op.direction == "all") {
	    		op.direction = ["right", "left", "upright", "upleft", "down", "up"];
	    	}
	    	return op;
	    },
	    _initMenu : function(op) {
	    	var self = this;
	    	var selfEl = self.element;
	    	// 初始化弹出类组件
	    	var popupBox = self._getPopupBox();
	    	// (TODO)调整菜单的大小
	    	// var menuSize = self._adjustMenuWidth(self.minWidth, self.maxWidth);
	    	// 遍历所有选项，绑定事件
	    	$("li.f-menu-item > a", selfEl).each(function() {
	    		self._bindItemEvent($(this), op);
	    	});
	    	// menu菜单绑定事件
	    	self._bindEvent();
	    },
	    _bindEvent : function() {
	    },

	    _adjustMenuWidth : function(minWidth, maxWidth) {
	    	var w = this.element.width();
	    	var resultW = w;
	    	var min = parseInt(minWidth);
	    	var max = parseInt(maxWidth);
	    	if (!isNaN(min)) {
	    		if (min < 50) {
	    			min = 50;
	    		}
	    		resultW = w<min?min:w;
	    	} else if (!isNaN(max) && w > max) {
	    		resultW = max;
	    	}
	    	if (resultW != w) {
	    		this.element.width(resultW);
	    	}
	    	return resultW;
	    },
	    
	    _bindItemEvent : function(el, op) {
	    	var aEl = el;
	    	var self = this;
	    	var liEl = aEl.parent();
	    	var selfOp = this.options;
	    	aEl.hover(function() {
	    		if (aEl.hasClass("f-state-disabled")) {
	    			return;
	    		}
	    		if (self.options._objActiveItem != null 
	    				&& self.options._objActiveItem.attr("id") == aEl.attr("id")) {
	    			return; // 避免重复打开
	    		}
	    		// 尝试关闭其他子菜单
	    		self._tryHideSubMenu();
	    		aEl.addClass("f-state-focus");
	    		selfOp._objFocusItem = aEl;
	    		// 尝试展开子菜单
	    		self._tryShowSubMenu(aEl, op);
	    	}, function() {
	    		if (aEl.hasClass("f-state-disabled")) {
	    			return;
	    		}
	    		aEl.removeClass("f-state-focus");
	    		selfOp._objFocusItem = null;
	    		// 尝试关闭子菜单
	    	});
	    	var ME = this; // 这里很奇怪，在aEL的click方法里面self是未定义的，所以需要使用一个新的ME变量
	    	aEl.click(function(e) {
	    		// 如果菜单项无效则直接返回
	    		if (aEl.hasClass("f-state-disabled")) {
	    			return false;
	    		}
	    		// 触发菜单点击事件
	    		var item = {
	    				id: aEl.attr("id"), 
	    				url: aEl.attr("url"), 
	    				menuId: ME.options.id, 
	    				parentMenuId: (ME.options._curOptions || {})["_parentMenuId"],
	    				text: aEl.text()
	    		};
	    		if (ME._triggerItemClick(aEl.attr("clickEvent"), item, e) !== false) {
	    	    	ME.triggerMenuClick(item, e);
	    		}
	    		// 触发document的点击事件，关闭菜单
	    		$(document).trigger("click.FMenu-" + ME.getRootMenuId());
	    		// e.stopPropagation(); // 使用这个会触发事件多次
	    		e.stopImmediatePropagation();
	    		return false; // 阻止<a>默认行为
	    	});
	    	$("> span.f-icon-item-arrow", aEl).hover(function() {
	    		if (aEl.hasClass("f-state-disabled")) {
	    			return;
	    		}
		    	self._tryShowSubMenu(aEl, op, true);
	    	});
	    },
	    
	    triggerMenuClick : function(item, event) {
	    	var self = this;
	    	var selfEl = self.element;
	    	var result = self._tryExcuteFunc(self, self.options._curOptions.onClick, [item,event]);

	    	if (result !== false) { // 如果返回值为false，则阻止将点击事件传递到父菜单
	    		var parentId = self.options._curOptions._parentMenuId;
	    		if (parentId != null) {
	    			$I(parentId).FMenu("triggerMenuClick", item, event);
	    		}
    		}
		},
		
		getParentMenuId : function() {
			return (this.options._curOptions._parentMenuId);
		},
		
		getRootMenuId : function() {
	    	var self = this;
			var parentId = self.getParentMenuId();
			if (parentId) {
				return $I(parentId).FMenu("getRootMenuId");
			} else {
				return self.options.id;
			}
		},
	    
	    _triggerItemClick : function(clickEvent, item, event) {
	    	var eventFunc = $.trim(clickEvent || "");
	    	if (eventFunc.length == 0) {
	    		return;
	    	}
    		var func = null; 
	    	try {
	    		func = eval(eventFunc);
	    	} catch (e) {
	    		// 不是合法的方法名
			}
	    	if ($.isFunction(func)) {
	    		return func.call(this, item, event);
	    	}
	    },
	    
	    _tryShowSubMenu : function(aEl, op, immediate) {
			var hrefStr = $.trim(aEl.attr("href") || "");
			if (hrefStr.length != 0) {
				//{ 20121105 hanyin 修复IE7下，href被自动加上"http://XXX:xxxx/..."的问题
				var subMenuId = hrefStr.lastIndexOf("#");
				if (subMenuId == -1 && subMenuI+1 >= hrefStr.length) {
					return;
				}
				subMenuId = hrefStr.substring(subMenuId+1);
				if (subMenuId.length == 0) {
					return false;
				}
				var subMenuEl = $I(subMenuId);
				if (subMenuEl.size() == 0) { // 没有对应的子菜单
					return false;
				}
				//} 20121105 hanyin
				// 延时加载下级菜单
				var self = this;
				var currentActiveId = aEl.attr("id") || "";
				var ops = op;
				
				 var showSubMenu = function() {
					 if (self.options._idActiveSubMenu) {
						 return; // 子菜单已经显示
					 }
					// 只有在等待500毫秒之后，焦点还在aEl上，才弹出菜单
					var currentFocusId = null;
					if (self.options._objFocusItem != null) {
						currentFocusId = self.options._objFocusItem.attr("id");
					}
					if (currentFocusId != currentActiveId) { // 如果焦点已经移开则不弹出
						return;
					}
					// 准备弹出子菜单保存状态
					self.options._objActiveItem = aEl;
					self.options._idActiveSubMenu = subMenuId;
					aEl.addClass("f-state-active").removeClass("f-state-focus");
					// 打开下级菜单
					var initOption = {};
					initOption._parentMenuId = self.options.id; // 传ID比传对象好，减少内存泄露的可能
					initOption.attach = aEl;
					initOption.direction = "all";
					// initOption.offset = ops.offset;
					initOption.container = ops.container;
					initOption.collision = ops.collision;
					subMenuEl.FMenu("show", initOption);
				}
				
				if (immediate === true) {
					showSubMenu.call(this);
				} else {
					setTimeout(showSubMenu, 300);
				}
			}
	    },
	    
	    _tryHideSubMenu : function() {
	    	var options = this.options;
	    	if (options._idActiveSubMenu != null) {
	    		$I(options._idActiveSubMenu).FMenu("hide");
	    		if (options._objActiveItem != null) {
	    			options._objActiveItem.removeClass("f-state-active");
	    		}
	    		options._idActiveSubMenu = null;
	    		options._objActiveItem = null;
	    	}
	    },
	    
	    _getPopupBox : function() {
	    	var op = this.options;
	    	// 如果组件还没有初始化，则尝试做初始化
	    	if (op._popupBox == null) {
	    		op._popupBox = this.element.FPopupBox({direction:"right,left"});
	    	}
	    	return op._popupBox;
	    },

	    /**
	     * 隐藏menu，隐藏之后会清空menu当前的状态，并且会关闭所有的子菜单。
	     * @name FMenu#hide
	     * @function
	     * @example
	     * //调用hide方法
	     *  $('#btn').click(function(){
	     *     $('#menuId').FMenu('hide');
	     *});
	     */
	    hide : function() {
	    	var hasInit = this.element.data("init.FMenu.FUI");
	    	if (hasInit === true && this.options._isShow === true) {
	    		var self = this;
		    	// 触发beforeHide事件
		    	self._tryExcuteFunc(self, self.options._curOptions.beforeHide, []);
		    	self.options._popupBox.FPopupBox("hide");
		    	self.options._isShow = false;
		    	self.options._parentMenuId = null;
			    $(document).unbind(".FMenu-" + self.options.id);
			    // 隐藏所有的子菜单
			    self._tryHideSubMenu();
		    	// 触发onHide事件
		    	self._tryExcuteFunc(self, self.options._curOptions.onHide, []);
	    	}
	    },

	    /**
	     * 将某个menuitem设置为disabled，设置之后menuitem将不会触发事件，如果有子菜单将不能打开子菜单，必须有menuItem。
	     * @name FMenu#disableItem
	     * @function
	     * @param itemId menuItem的ID
	     * @example
	     * //调用disableItem方法
	     *  $('#btn').click(function(){
	     *     $('#menu_simple').FMenu('disableItem','001');
	     * });
	     */
	    disableItem : function(itemId) {
	    	if ($Utils.isString(itemId)) {
	    		var itemEl = $I(itemId);
	    		if (itemEl.size() != null) {
	    			if (itemEl.hasClass("f-state-active")) { // 如果对应子菜单已经打开了，则先关闭子菜单
	    				this._tryHideSubMenu();
	    			}
	    			itemEl.addClass("f-state-disabled").removeClass("f-state-focus");
	    		}
	    	}
	    },

	    /**
	     * 设置Menu的静态数据内容，在下次显示的时候才用新的静态数据
	     * @name FMenu#setStaticData
	     * @function
	     * @param staticData 静态数据对象
	     * @example
	     * //调用disableItem方法
	     * var data1 = [...];
	     *  $('#btn').click(function(){
	     *     $('#menu_simple').FMenu('setStaticData',data1);
	     * });
	     */
	    setStaticData : function(staticData) {
	    	if (staticData != null) {
	    		this.options.staticData = staticData;
	    		this.options._isNewStaticData = true;
	    	}
	    },

	    /**
	     * 将某个menuitem设置为enable。
	     * @name FMenu#enableItem
	     * @function
	     * @param itemId menuItem的ID
	     * @example
	     * //调用enableItem方法
	     *  $('#btn').click(function(){
	     *     $('#menu_simple').FMenu('enableItem','001');
	     *});
	     */
	    enableItem : function(itemId) {
	    	$I(itemId).removeClass("f-state-disabled");
	    },
	    
	    _destroySubMenus : function() {
	    	var self = this;
	    	var op = this.options;
	    	var subIds = op._staticMenuIds;
	    	for (var i=0; i<subIds.length; i++) {
	    		$I(subIds[i]).remove();
	    	}
	    	op._staticMenuIds = [];
	    },
	    
	    /**
	     * 销毁组件
	     * @name FPanel#destroy
	     * @function
	     * @example
	     */
	    destroy : function() {
		    var op = this.options;
		    op._parentMenuId = null;
		    if (op._popupBox != null) {
		    	op._popupBox.FPopupBox("destroy");
		    	op._popupBox = null;
		    }
	    	op._isShow = false;
	    	op._objFocusItem = null;
	    	op._objActiveItem = null;
	    	op._idActiveSubMenu = null;
	    	op._isNewStaticData = false;
	    	op._curOptions = null;

    		// 删除动态生成的子菜单的DOM结构
		    this._destroySubMenus();
		    // 解除绑定事件
		    $(document).unbind(".FMenu-" + this.options.id);
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    }
	});
})(jQuery);

