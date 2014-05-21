/*
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Tabs.js
 * 作者：hanyin
 * 邮箱：hanyin@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FTabs组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 20121231  hanyin		修复Tabs组件嵌套造成内层tabs组件无法正常显示的问题
 * 20130125  hanyin		新增绑定页签双击事件和页签栏右键事件
 * 20130129  hanyin		页签上鼠标点击事件不返回false，避免右键事件被拦截
 * 20130129  hanyin		doLayout中size计算增加对iframe的支持
 * 20130207  hanyin		修改onTabbarRClick事件的注释使其更加合理
 * 20130207  hanyin		BUG #4666 以Iframe的方式打开tab页，内存泄露
 * 20130314  hanyin		修复tabs由于内容过多切换的性能问题，另外，增加fit属性
 * 20130325  hanyin		解决tabs组件iframe方式打开页面的时候，页面打不开的问题
 * 20130415  hanyin		修复需求5580
*/

/**
 * @name FTabs
 * @class 
 * 选项卡，导航式容器，以切换的方式在多个页面间切换浏览。通过简单的配置展示多页签信息，同时组件提供丰富的事件支持，比如选中页签，关闭页签，添加页签等等。<br/>
 * 支持各个页签以ajax方式加载内容；支持懒加载；支持页签滚动。
 */

/**@lends FTabs# */

/** 
 * 页签头部的位置，可为top、left、bottom，<span style="color:red;">暂不支持，目前只支持在顶部</span>
 * @name FTabs#position
 * @default 'top'
 * @type String
 * @example
 * $('#make-tab').FTabs({position : 'left'});//页签头部在组件的左边
 */

(function($) {
	$.registerWidgetEvent("");
	$.widget("FUI.FTabs", {
	    options : {
	    	/**
	    	 * 标识(仅标签使用)
	    	 * @name FTabs#<ins>id</ins>
	    	 * @type String
	    	 * @default 随机生成
	    	 * @example
	    	 * 无
	    	 */
	    	id : null,
	    	/**
	    	 * 页签头部的宽度，单位像素，只允许为数值或者数值类的字符串。默认为"auto"，即根据内容自适应宽度，内容越多越宽。
	    	 * <br/>此设置为页签头部的全局设置，当然也可以单独设置每个页签的宽度；但是需要特别注意的是
	    	 * <span style="color:red;">如果全局设置页签宽度为"auto"，那么请不要单独设置页签的宽度，否则会造成页签标题显示异常；
	    	 * 同样的，如果全局设置了页签宽度为有效的数值，不如"80px"，那么不要单独设置页签的宽度为"auto"</span>。
	    	 * @name FTabs#<ins>tabWidth</ins>
	    	 * @default "auto"
	    	 * @type Number,String
	    	 * @example
	    	 */
	    	tabWidth : "auto",
	    	/**
	    	 * 页签标题的样式类，主要用于规定页签的高度，目前提供了四种大小："f-tabs-small-tab"、"f-tabs-normal-tab"、"f-tabs-big-tab"和"f-tabs-large-tab"，
	    	 * 分别对应小、中、较大、大；除此之外，用户可以根据自己的要求定制。
	    	 * @name FTabs#<ins>tabsHeaderCls</ins>
	    	 * @default "f-tabs-normal-tab"
	    	 * @type String
	    	 * @example
	    	 */
	    	tabsHeaderCls : "f-tabs-normal-tab",
	    	tabHeight : 25,
	    	/**
	    	 * 初始化时被激活页签的索引（从0开始计数）或者tabId。
	    	 * @default 0
	    	 * @name FTabs#<ins>active</ins>
	    	 * @type Number,String
	    	 * @example
	    	 * $('#make-tab').FTabs({active : 1});//初始化时激活第二个页签
	    	 * $('#make-tab').FTabs({active : 'tab-1'});//初始化时激活Id为'tab-1'的页签
	    	 */
	    	active : 0,
	        /**
	         * 此组件的整体宽度（包括border和padding，单位象素）。<br/>
	         * 支持数字形式的字符串，比如"40" 表示40个像素，字符串如"px50"、"abcpx"等其他非法形式的字符串则被忽略；
	         * width不支持百分比；请不要设置组件的padding、margin、border等值，否则会造成布局不准确的问题。
	         * @name FTabs#width
	         * @type String
	         * @default "auto"
	         * @example
	         * 无
	         */
	        width : "",
	        /**
	         * 此组件的整体高度（包括border和padding，单位像素），默认为auto。<br/>
	         * 仅支持数字形式的字符串，比如"40" 表示40个像素；其他非法形式的字符串则被忽略。<br/>
	         * 请不要设置组件的padding、margin、border等值，否则会造成布局不准确的问题。
	         * height属性不支持百分比。
	         * @name FTabs#height
	         * @type String
	         * @default "auto"
	         * @example
	         * 无
	         */
	        height : "auto",

	    	/**
	    	 * 当页签被选中之前执行的方法，方法实现在返回false的情况下，会阻止标签页切换。
	    	 * @event
	    	 * @name FTabs#onBeforeActive
	    	 * @param index 选中页签的索引，从0开始计数。
	    	 * @param tabId 选中标签的id
	    	 * @default null
	    	 * @example
	    	 *  $('#make-tab').FTabs({
	    	 *      onBeforeActive : function(n) {
	    	 *          alert('tab ' + n + ' will be activated!');
	    	 *      }
	    	 *  });
	    	 */
	        onBeforeActive : null,

	    	/**
	    	 * 当页签被选中后执行的方法。
	    	 * @event
	    	 * @name FTabs#onActive
	    	 * @param index 选中页签的索引，从0开始计数。
	    	 * @param tabId 选中标签的id
	    	 * @default null
	    	 * @example
	    	 *  $('#make-tab').FTabs({
	    	 *      onActive : function(n) {
	    	 *          alert('tab ' + n + ' has been activated!');
	    	 *      }
	    	 *  });
	    	 */
	        onActive : null,

	    	/**
	    	 * 当页签被双击时触发
	    	 * @event
	    	 * @name FTabs#onTabDblClick
	    	 * @param index 选中页签的索引，从0开始计数。
	    	 * @param tabId 选中标签的id
	    	 * @default null
	    	 * @example
	    	 *  $('#make-tab').FTabs({
	    	 *      onTabDblClick : function(n) {
	    	 *          alert('tab ' + n + ' double-clicked!');
	    	 *      }
	    	 *  });
	    	 */
	        onTabDblClick : null,

	    	/**
	    	 * 页签栏右键事件
	    	 * @event
	    	 * @name FTabs#onTabbarRClick
	    	 * @param e jquery事件对象
	    	 * @default null
	    	 * @example
	    	 *  $('#make-tab').FTabs({
	    	 *      onTabbarRClick : function(e) {
	    	 *          alert('tabbar right-clicked!');
	    	 *      }
	    	 *  });
	    	 */
	        onTabbarRClick : null,
	        
	        // 点击滚动按钮，滚动的宽度
	        scrollGap : 25,

	    	/**
	    	 * 当页签被关闭之前执行的方法，回调返回false，会阻止页签被关闭。
	    	 * @event
	    	 * @name FTabs#onBeforeClose
	    	 * @param n 被关闭页签的索引，从0开始计数
	    	 * @param tabId 页签的id
	    	 * @default null 
	    	 * @example
	    	 *  $('#make-tab').FTabs({
	    	 *      onBeforeClose : function(n, tabId) {
	    	 *          alert('tab ' + n + ' will be closed!');
	    	 *      }
	    	 *  });
	    	 */
	        onBeforeClose : null,

	    	/**
	    	 * 当页签被关闭之后执行的方法。
	    	 * @event
	    	 * @name FTabs#onClose
	    	 * @param n 被关闭页签的索引，从0开始计数
	    	 * @param tabId 页签的id；需要注意的是，此时tabId对应的DOM节点已经被删除了
	    	 * @default null 
	    	 * @example
	    	 *  $('#make-tab').FTabs({
	    	 *      onClose : function(n, tabId) {
	    	 *          alert('tab ' + n + ' has been closed!');
	    	 *      }
	    	 *  });
	    	 */
	        onClose : null,

	    	/**
	    	 * 当关闭除指定页签外的所有页签前触发
	    	 * @event
	    	 * @name FTabs#onBeforeCloseAllOthers
	    	 * @param n 被保留的页面索引
	    	 * @param tabId 被保留的页签id
	    	 * @default null 
	    	 * @example
	    	 *  $('#make-tab').FTabs({
	    	 *      onBeforeCloseAllOthers : function() {
	    	 *          alert('all other tabs will be closed !');
	    	 *      }
	    	 *  });
	    	 */
	        onBeforeCloseAllOthers : null,

	    	/**
	    	 * 当关闭除指定页签外的所有页签后触发
	    	 * @event
	    	 * @name FTabs#onCloseAllOthers
	    	 * @default null
	    	 * @example
	    	 *  $('#make-tab').FTabs({
	    	 *      onCloseAllOthers : function() {
	    	 *          alert('other tabs are were closed !');
	    	 *      }
	    	 *  });
	    	 */
	        onCloseAllOthers : null,

	    	/**
	    	 * 当新页签被添加之前执行的方法。
	    	 * @event
	    	 * @name FTabs#onBeforeAdd
	    	 * @default null
	    	 * @param op add方法输入参数：添加页签的配置项
	    	 * @param pos add方法输入参数：页签添加的位置，可以通过op.pos修改
	    	 * @param active add方法输入参数：页签是否激活，可以通过op.active修改
	    	 * @return 如果返回false，则阻止页签的添加
	    	 * @example
	    	 *  $('#make-tab').FTabs({
	    	 *      onBeforeAdd : function(config) {
	    	 *          alert('you will add a tab at position:' + config.index );
	    	 *      }
	    	 *  });
	    	 */
	        onBeforeAdd : null,

	    	/**
	    	 * 当新页签被添加之后执行的方法。
	    	 * @event
	    	 * @name FTabs#onAdd
	    	 * @default null
	    	 * @param index 页签的真是位置，从0开始
	    	 * @param tabId 页签的Id
	    	 * @example
	    	 *  $('#make-tab').FTabs({
	    	 *      onAdd : function(index, tabId) {
	    	 *          alert('you have added a tab at position:' + index );
	    	 *      }
	    	 *  });
	    	 */
	        onAdd : null,

	    	/**
	    	 * 当页签使用ajax方式加载内容，加载完成后执行的方法。<span style="color:red;">目前不支持iframe模式下</span>
	    	 * @event
	    	 * @name FTabs#onLoadComplete
	    	 * @default null
	    	 * @param index 加载完成的页签索引
	    	 * @param tabId 刚加载完成的页签的tabId
	    	 * @example
	    	 *  $('#make-tab').FTabs({
	    	 *      onLoadComplete : function(index, tabId) {
	    	 *          alert(tabId + 'has just been loaded!' );
	    	 *      }
	    	 *  });
	    	 */
	        onLoadComplete : null,

	    	/**
	    	 * 自适应开关，true表示在第一次展现的时候，自动根据父亲计算自己的大小，false不做计算，默认为false
	    	 * @name FTabs#<ins>fit</ins>
	    	 * @default "false"
	    	 * @type Boolean,String
	    	 * @example
	    	 */
	        fit : false,

	        // 只要设置一次组件的大小，则此值+1，此值会存储在每个标签页的data域内，用于在大小改变之后延时重新计算所有的标签页；
	        // 在打开标签页时，首先判断是否与此相等，如果相等则不重新计算布局，否则重新计算布局，并将data域中的值修改为与_changeHash相等，从而保证在大小改变之后，页面所有的额标签页只在第一次展现时才重新计算布局
	    	_changeHash : 1,
	    	// 当前标签页的jquery对象
	    	_objCurrentTabEl : null,
	    	// 当前标签页的Id
	    	_currentTabId : null,
	    	// 保存第一次出现scroll按钮的状态变量
	    	_ScrollfirstTimeShow : true
	    },
	    
	    _create : function() {
	    	var op = this.options;
	    	// 标签页Id与相应jquery对象的对照关系
	    	op._tabsHeadMapping = $Utils.IndexMap();
	    	op._tabsBodyMapping = $Utils.IndexMap();
	    	op._tabsBodyStatusMapping = $Utils.IndexMap();

	    	var selfEl = this.element;
	    	var ID = selfEl.attr("id");
	    	op.id = ID;
	    	// 将常用的对象按照相对位置预先计算出来，提升加载速度
	    	op["_objheaderEl"] = selfEl.children(".f-tabs-header:first");
	    	op["_objbody-wrapperEl"] = selfEl.children(".f-tabs-body-wrapper:first");
	    	op["_objbodyEl"] = selfEl.children(".f-tabs-body-wrapper .f-tabs-body:first");
	    	op["_objscroll-leftEl"] = op["_objheaderEl"].children(".f-tabs-scroller-left-wrapper:first").children(".f-tabs-scroll-left");
	    	op["_objheader-ctlEl"] = op["_objheaderEl"].children(".f-tabs-header-ctl:first");
	    	op["_objtabmenu-rightEl"] = op["_objheaderEl"].children(".f-tabs-scroller-right-wrapper:first").children(".f-tabs-tabmenu-right");
	    	op["_objscroll-rightEl"] = op["_objheaderEl"].children(".f-tabs-scroller-right-wrapper").children(".f-tabs-scroll-right");
	    	// 绑定事件
	    	this._bindEvent();
	    },
	    
	    _init : function() {
	    	var self = this;
	    	var op = self.options;
	    	// 计算所有标签页的索引、id与jquery对象对照关系
	    	self._calculateIndex();
	    	
	    	
	    	// 对内部元素的大小进行调整，使其能够正常显示
	    	// begin 20130117 hanyin 修改计算tabHeight的方式
	    		//op.tabHeight = self._getElement("header").height() +2; // padding:1px+border:1px
	    	op.tabHeight = self._getElement("header").outerHeight(true);
	    	// end 20130117 hanyin
	    	
	    	if (op.fit == "true" || op.fit === true) {
	    		var parentEl = self.element.parent();
	    		self.setSize(parentEl.innerWidth(), parentEl.innerHeight());
	    	} else {
	    		self.setSize(op.width, op.height);
	    	}
	    	
	    	// 激活指定的标签页，如果激活失败，则默认激活第0个标签页
	    	if (!self.activate(op.active, true)) {
	    		self.activate(0, true);
	    	}
	    },
	    
	    _bindEvent : function() {
	    	var op = this.options;
	    	var self = this;
	    	self._getHeaderItemsEl().each(function(index, element) {
	    		self._bindTabHeadEvent($(element));
	    	});
	    	
	    	// 绑定标签页的左右滚动事件
	    	self._getElement("scroll-left", self._getElement("header")).mousedown(function() {
	    		var el = $(this);
	    		if (op._isScrollShow && !el.hasClass("f-tabs-scroll-disabled")) {
	    			self._tryScrollLeft();
	    		}
	    	});
	    	self._getElement("scroll-right", self._getElement("header")).mousedown(function() {
	    		var el = $(this);
	    		if (op._isScrollShow && !el.hasClass("f-tabs-scroll-disabled")) {
	    			self._tryScrollRight();
	    		}
	    	});
	    	self._getElement("tabmenu-right", self._getElement("header"))
//	    	.hover(function() {
//	    		$(this).addClass("f-tabs-tabmenu-right-hover");
//	    	}, function() {
//	    		$(this).removeClass("f-tabs-tabmenu-right-hover");
//	    	})
	    	.click(function() {
	    		self._tryShowItemsMenu();
	    	});
	    	
	    	// add 20130125 hanyin 绑定右键点击事件
	    	if (op.onTabbarRClick) {
		    	self._getElement("header").mousedown(function(e) {
		    		 if (3 == e.which){
		    			 self._tryExcuteFunc(self, op.onTabbarRClick, [e]);
		    			 return false;
		    		 }
		    	});
	    	}
	    	// end 20130125 hanyin 绑定右键点击事件
	    },
	    
	    _bindTabHeadEvent : function(el) {
	    	var self = this;
	    	var op = self.options;
    		el
	    	/* 为了快，不绑定动画效果
	    	.hover(function(){
	    		if (!$(this).hasClass("f-tabs-active")) {
	    			$(this).addClass("f-tabs-over");
	    		}
	    	}, function() {
	    		$(this).removeClass("f-tabs-over");
	    	})*/
	    	.mousedown(function() {
	    		var href = $(this).children("a").attr("href");
	    		var tabId = href.substring(href.lastIndexOf("#")+1);
	    		if (op._currentTabId == tabId) { // 如果 已经打开，则不重复打开，因此也不会触发事件
	    			//  20130129 修改 hanyin 页签上鼠标点击事件不返回false，避免右键事件被拦截
//	    			return false;
	    			return;
	    		}
	    		self.activate(tabId);
    			//  20130129 修改 hanyin 页签上鼠标点击事件不返回false，避免右键事件被拦截
//    			return false;
    			return;
	    	});
    		
    		// add 20130125 hanyin 绑定页签双击事件
    		if (op.onTabDblClick) {
    			el.dblclick(function() {
    				var hid = $(this).attr("id");
    				var index = op._tabsHeadMapping.indexOf(hid);
    				var id = op._tabsBodyMapping.get(index);
        			self._tryExcuteFunc(self, op.onTabDblClick, [index, id]);
    			});
    		}
    		// end add 20130125 hanyin 绑定页签双击事件
    		
    		if (el.hasClass("f-tab-closable")) {
    			var closeBnt = el.children().children(".f-tab-close-bnt:first");
    			closeBnt.click(function(e) {
    				e.stopPropagation(); // 防止对应的标签被激活
    				self._closeTabByEl($(this).parent().parent());
    				return false;
    			});
    		}
	    },
	    
	    _tryScrollLeft : function() {
	    	var op = this.options;
	    	var self = this;
	    	var ctlBox = self._calElementBox("header-ctl"); // 外框窗口
	    	var innerBox = self._calHeaderItemsBox(); // 内框滚动盒子
	    	var realScrollGap = 0;
	    	if (innerBox.left+op.scrollGap > ctlBox.left) {
	    		realScrollGap = ctlBox.left - innerBox.left;
	    	} else {
	    		realScrollGap = op.scrollGap;
	    	}
	    	var ulEl = self._getElement("header-ctl", self._getElement("header")).children();
    		ulEl.css("margin-left", (parseInt(ulEl.css("margin-left")) + realScrollGap)+"px");
    		// 重新调整按钮的状态
    		self._adjustTabScroller();
	    },
	    
	    _tryScrollRight : function() {
	    	var op = this.options;
	    	var self = this;
	    	var ctlBox = self._calElementBox("header-ctl"); // 外框窗口
	    	var innerBox = self._calHeaderItemsBox(); // 内框滚动盒子
	    	var realScrollGap = 0;
	    	if (innerBox.right-op.scrollGap < ctlBox.right) {
	    		realScrollGap = innerBox.right - ctlBox.right;
	    	} else {
	    		realScrollGap = op.scrollGap;
	    	}
	    	var ulEl = self._getElement("header-ctl", self._getElement("header")).children();
    		ulEl.css("margin-left", (parseInt(ulEl.css("margin-left")) - realScrollGap)+"px");
    		// 重新调整按钮的状态
    		self._adjustTabScroller();
	    },
	    
	    _tryShowItemsMenu : function() {
	    	var self = this;
	    	var op = this.options;
	    	var tabsMenuEl = self._getGlobalElement("scroll-menuEl");
	    	if (tabsMenuEl.length == 0) {
	    		// 创建menu对应的div
	    		var menuId = op.id + "-scroll-menuEl";
	    		var html = "\
	    			<ul id='"+ menuId +"' style='display:none;' class='f-menu f-menu-icons f-widget'></ul>";
	    		$("body").append(html);
	    		tabsMenuEl = $("#" + menuId).FMenu({
	    			attach: self._getElement("tabmenu-right"),
	    			offset: {top: 4},
	    			onClick: function(item) {
	    				var tabId = item.url;
	    				if (tabId) { // 如果url有效，则表示是tabId
	    					self.activate(tabId);
	    				}
	    			}
	    		});
	    	}
	    	
	    	if (!op._itemsMenuData) {
	    		// 重新计算menu
	    		tabsMenuEl.FMenu("setStaticData", self._genItemsMenuData());
	    		op._itemsMenuData = [{data:""}]; // 有数据了
	    	}
	    	tabsMenuEl.FMenu("show");
	    },
	    
	    _genItemsMenuData : function() {
	    	var self = this;
	    	var op = this.options;
	    	var mapping = op._tabsHeadMapping;
	    	var bodyMapping = op._tabsBodyMapping;
	    	var items = mapping.elements;
	    	var bodyItems = bodyMapping.elements;
	    	var size = items.length;
	    	
	    	var GAP = 10;
	    	var groups = [];
	    	for (var i=0; i<size;) {
	    		var data = [];
	    		for (var j=0; (j<GAP)&&(i<size); j++,i++) {
	    			var text =  $(".f-tabs-strip-text:first", items[i].value).html();
	    			data.push({
	    				text : text, // 对应tab的文本
	    				url : bodyItems[i].key, // 对应body的id
	    				title : text // 20130108 add hanyin 增加title属性
	    			});
	    		}
	    		groups.push(data);
	    	}
	    	if (groups.length == 1) { // 少于Gap个，则不需要分组
	    		return groups[0];
	    	}
	    	
	    	var data = [];
	    	size = groups.length;
	    	for (var i=0; i<size;i++) {
	    		var subGroup = groups[i];
	    		var text = "items <span style='color:blue;'>" + 
	    				(GAP*i+1) + " - " + (GAP*i+subGroup.length) + "</span>";
	    		data.push({
	    			text: text,
	    			children: subGroup,
	    			url: subGroup[0].url
	    		});
	    	}
	    	return data;
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
		 * 在index处增加一个tab页签，参数为json格式的配置项。
		 * 配置项参数：
		 * <ol>
		 * <li>op：添加的标签的相关参数：
		 * <pre>
		 * ① closable - 标签是否可以通过点击close按钮关闭标签页，默认为true；
		 * ② title - 标签页的title，如果没有设置，则以标签的ID作为title值
		 * ③ width - 标签页的宽度，默认为"75px"
		 * ④ content - 标签页的静态内容，支持HTML片段
		 * ⑤ url - 指定一个url，在标签被激活的时候加载url的内容，此时忽略"content"属性，
		 * 如果是有"/"或者协议头 "//:"的则直接加载，否则会自动增加当前工程名前缀。
		 * ⑥ iframe - 是否采用iframe加载url，true表示采用iframe模式，否则加载内容作为html片段；
		 * 如果设置了url，默认采用iframe方式加载内容；
		 * ⑦ iframeName - iframe的名字，只有在iframe=true的情况下有效。  
		 * </pre></li>
		 * <li>pos： 标签页添加的位置，取值范围为[0, size-1]，size为标签页的个数，低于0取0，大于size-1取size-1，
		 * 如果传入的不是有效的数字(字串)，则默认添加在标签页的最后面</li>
		 * <li>active：是否激活新增的标签页，false表示不激活，默认为true</li>
		 * </ol>
		 * @name FTabs#add
		 * @return 如果返回false，则表示没有添加成功
		 * @function
		 * @param Object {closable,title,width,content,url,iframe,iframeName}
		 * @example
		 *
		 * $("#tabs").FTabs("add", { // 在标签栏的末尾添加一个以iframe方式加载的tab页
		 *   title: "New Tab",
		 *   url: "http://www.hundsun.com",
		 *   width: 120
		 * }, "last", false);
		 */
	    add : function(op, pos, active) {
	    	if (!op) {
	    		return;
	    	}
	    	
	    	var self = this;
	    	var opts = self.options;
	    	
	    	if (opts.onBeforeAdd) {
		    	if (self._tryExcuteFunc(self, opts.onBeforeAdd, [op, pos, active]) === false) {
		    		return false;
		    	}
	    	}
	    	pos = op.pos || pos;
	    	active = op.active || active;
	    	
	    	var id = $Utils.genId("f-tabs-item"); // 0
	    	var bodyId = op.id || $Utils.genId("f-tabs-body-item"); // 6
	    	var closable = (op.closable === true); // 1
	    	var title = op.title || id; // 2
	    	var width = parseInt(op.width || opts.tabWidth); // 4
	    	if (!isNaN(width)) {
	    		width = width + "px";
	    	} else {
	    		width = "auto";
	    	}
	    	var aStyle = ""; // 8
	    	if (width == "auto") {
	    		aStyle = 'f-tabs-right-ie6';
	    	}
	    	// var height = parseInt(op.height || opts.tabHeight || "20px") -8; //5
	    	var tabHeightCls = op.tabsHeaderCls || opts.tabsHeaderCls || "f-tabs-normal-tab"; // 7
	    	var iconCls = op.iconCls;
	    	
	    	var closeIconHtml = ""; // 3
	    	if (closable) {
	    		closeIconHtml = "<span class='f-tab-close-bnt'>&nbsp;</span>";
	    	}
	    	
	    	var genTabHeadHtml = function() {
	    		var template = "\
			    	<div class='f-tabs-head-item{1}' id='{0}'>\
						<a class='f-tabs-right {8}' href='#{6}' onclick='return false;' title='{2}'>\
							{3}\
							<em class='f-tabs-left'>\
								<span class='f-tabs-strip-inner {7}'>\
									<span class='f-tabs-strip-text' style='width:{4};line-height:normal'>{2}</span>\
								</span>\
							</em>\
						</a>\
					</div>";
			
	    		var html = $Utils.format(template, id, closable?" f-tab-closable":"", title, closeIconHtml,
					width, 0, bodyId, tabHeightCls, aStyle);
	    		return html;
	    	};

	    	var url = op.url;
	    	var iframe = (op.iframe==="false")?false:true;
	    	var iframeName = op.iframeName || $Utils.genId("tabs-iframe-name");
	    	var content = url?"":op.content; // 如果有配置url，则忽略content的内容

	    	var genTabBodyHtml = function() {
	    		var template = "\
			    	<div id='{0}' class='f-panel'>\
						<div class='f-panel-wrapper'>\
							<div id='{0}-panel-body' class='f-panel-body'>\
							{1}\
							</div>\
						</div>\
					</div>";
		    	var html = $Utils.format(template, bodyId, content);
			    return html;
	    	};
	    	
	    	var itemsMapping = opts._tabsHeadMapping;
	    	var bodyItemsMapping = opts._tabsBodyMapping;
	    	var bodyItemsStateMapping = opts._tabsBodyStatusMapping;

	    	var headerBoxEl = self._getElement("header-ctl").children();
	    	var bodyBoxEl = self._getElement("body");
	    	
	    	// 根据位置插入，默认为添加到末尾
	    	var pos = parseInt(pos);
	    	if (!isNaN(pos)) {
	    		var size = itemsMapping.size();
	    		pos = (pos<size&&pos>=0)?pos:(size-1);
	    		var curHeaderEl = itemsMapping.element(pos).value;
	    		var curBodyEl = bodyItemsMapping.element(pos).value;
	    		curHeaderEl.before(genTabHeadHtml()); // 插入DOM结构
	    		curBodyEl.before(genTabBodyHtml());
	    		itemsMapping.insert(pos, id, $("#" + id)); // 生成tab头的缓存
	    		bodyItemsMapping.insert(pos, bodyId, $("#" + bodyId)); // 生成tab体的缓存
	    		bodyItemsStateMapping.insert(pos, {url:url, iframe:iframe, iframeName:iframeName});
	    	} else { // 将标签页加到末尾
	    		var edgeEl = self._getElement("items-edge");
	    		edgeEl.before(genTabHeadHtml());
	    		bodyBoxEl.append(genTabBodyHtml());
	    		itemsMapping.put(id, $("#" + id)); // 生成tab头的缓存
	    		bodyItemsMapping.put(bodyId, $("#" + bodyId)); // 生成tab体的缓存
	    		bodyItemsStateMapping.put(bodyId, {url:url, iframe:iframe, iframeName:iframeName});
	    		pos = itemsMapping.size() -1;
	    	}
	    	
	    	// 设置body的大小
	    	$("#"+bodyId+"-panel-body").css({
	    		width : self._getElement("body-wrapper").width() -2,
	    		height : self._getElement("body-wrapper").height() -1
	    	});
	    	
	    	// 绑定tab头的事件
	    	self._bindTabHeadEvent($("#" + id));
	    	
	    	// 是否激活当前添加的标签，默认不添加
	    	if (active === true) {
	    		self.activate(pos);
	    		if (!opts._isScrollShow) {
	    			self._adjustTabScroller(); // 强制刷新tab表头
	    		}
	    	} else {
	    		self._adjustTabScroller();
	    	}
	    	
	    	!opts.onAdd || self._tryExcuteFunc(self, opts.onAdd, [pos, bodyId]);

	    	// 需要重新计算menu的值，这里打一个标记
	    	opts._itemsMenuData = null;
	    },

		/**
		 * 关闭特定的页签，如果n指向当前页签，则会选中下一页签；如果当前页签是最末尾的页签，则会选中第一个页签。可以看到每关闭一个页签就会触发一次close事件。<br/>
		 * <span style="color: red;">注意：如果只有一个页签了，则不允许被关闭，就算有关闭按钮也不行！</span>
		 * @name FTabs#Closetab
		 * @function
		 * @param n 要关闭的页签的位置（从0开始计数）。 如果未指定该参数，则默认关闭当前页签。
		 * @example
		 * //关闭第一个页签
		 * $('#make-tab').FTabs('closeTab', 0);
		 */
	    closeTab : function(index) {
	    	var op = this.options;
	    	if (isNaN(index)) {
	    		index = op._tabsBodyMapping.indexOf(op._currentTabId);
	    	}
	    	var el = op._tabsHeadMapping.element(index).value;
	    	return this._closeTabByEl(el);
	    },
	    
	    _closeTabByEl : function(itemEl) {
	    	var op = this.options;
	    	var self = this;
	    	var id = itemEl.attr("id");
	    	var itemsMapping = op._tabsHeadMapping;
	    	var bodyItemsMapping = op._tabsBodyMapping;
	    	var bodyItemsStatuesMapping = op._tabsBodyStatusMapping;
	    	var size = itemsMapping.size();
	    	if (size <= 1) { // 如果已经是最后一个了，则不允许关闭
	    		return;
	    	}
	    	var index = itemsMapping.indexOf(id); // 这个值肯定是有效的！
	    	var bodyItemEl = bodyItemsMapping.element(index).value;
	    	var bodyId = bodyItemsMapping.element(index).key
	    	
	    	if (op.onBeforeClose) {
	    		if (self._tryExcuteFunc(self, op.onBeforeClose, [index, bodyId]) === false) {
	    			return false;
	    		}
	    	}
	    	
	    	// 删除当前tab和缓存
	    	itemsMapping.removeByIndex(index);
	    	bodyItemsMapping.removeByIndex(index);
	    	bodyItemsStatuesMapping.removeByIndex(index);
	    	itemEl.remove();
	    	//{ add 20130207 hanyin 如果tab采用iframe打开则清空iframe，避免内存泄漏
	    	self._clearTabBody(bodyItemEl);
	    	//} end add
	    	bodyItemEl.remove();
	    	
	    	// 尝试打开紧跟着个那个tab，如果不存在，则打开最后一个tab
	    	var activeIndex = index;
	    	// begin 20130415 hanyin 修复需求5580，在关闭最后一个tab的时候，自动激活倒数第二个，而不是第一个
	    	if (activeIndex >= size-1) {
	    		// begin 20130415 hanyin 修复需求5580，在关闭最后一个tab的时候，自动激活倒数第二个，而不是第一个
	    			// activeIndex = 0;
	    		activeIndex = size-2;
	    		// end 20130415 hanyin
	    	}
	    	self.activate(activeIndex);
	    	
	    	!op.onClose || self._tryExcuteFunc(self, op.onClose, [index, bodyId]);
	    	
	    	// 需要重新计算menu的值，这里打一个标记
	    	op._itemsMenuData = null;
	    },

		/**
		 * 关闭除特定的页签外的所有页签，所有被关闭页签的close事件都会被触发 <br/>
		 * <span style="color: red;">注意：如果只有一个页签了，则不允许被关闭，就算有关闭按钮也不行！</span>
		 * @name FTabs#closeOthers
		 * @function
		 * @param n 要保留页签的索引，从0开始计数，如果为指定该参数，则保留当前被选中的页签。
		 * @example
		 * // 保留第一个标签
		 * $('#make-tab').FTabs('closeOtherTabs', 0);
		 */
	    closeOthers : function(index) {
	    	var self = this;
	    	var op = self.options;

	    	var itemsMapping = op._tabsHeadMapping;
	    	var size = itemsMapping.size();
	    	if (size <= 1) { // 如果已经是最后一个了，则不允许关闭
	    		return;
	    	}
	    	var bodyItemsMapping = op._tabsBodyMapping;
	    	var bodyItemsStatuesMapping = op._tabsBodyStatusMapping;
	    	
	    	var cacheScrollShow = op._isScrollShow;
	    	op._isScrollShow = false;
	    	// 激活指定的标签页，防止更新scroll的状态
	    	self.activate(index);
	    	// 恢复scroll状态
	    	op._isScrollShow = cacheScrollShow;
	    	
	    	// 页签切换之后的状态保存
	    	var bodyId = op._currentTabId;
	    	index = bodyItemsMapping.indexOf(bodyId);
	    	var headerElement = itemsMapping.element(index);
	    	var bodyElement = bodyItemsMapping.element(index);
	    	var bodyStatusElement = bodyItemsStatuesMapping.element(index);
	    	
	    	if (op.onBeforeCloseAllOthers) {
	    		if (self._tryExcuteFunc(self, op.onBeforeCloseAllOthers, [index, bodyId]) === false) {
	    			return false;
	    		}
	    	}

	    	// 删除 DOM 结构
	    	for (var i=0; i<size; i++) {
	    		if (i == index) {
	    			continue;
	    		}
	    		var bodyElement = bodyItemsMapping.element(i);
	    		var bodyId = bodyElement.key;
	    		var bodyEl = bodyElement.value;
	    		if (op.onBeforeClose) { // 尝试关闭单个页签，如果返回false，则放弃关闭此标签
	    			if (self._tryExcuteFunc(self, op.onBeforeClose, [i, bodyId]) === false) {
	    				continue;
	    			}
	    		}
	    		itemsMapping.element(i).value.remove();
	    		bodyEl.remove();
	    		!op.onClose || self._tryExcuteFunc(self, op.onClose, [i, bodyId]);
	    	}
	    	
	    	// 更新滚动条状态
	    	if (op._isScrollShow) {
	    		self._adjustTabScroller();
	    	}
	    	
	    	// 恢复页签状态
	    	itemsMapping.clear();
	    	itemsMapping.elements.push(headerElement);
	    	bodyItemsMapping.clear();
	    	bodyItemsMapping.elements.push(bodyElement);
	    	bodyItemsStatuesMapping.clear();
	    	bodyItemsStatuesMapping.elements.push(bodyStatusElement);
	    	
	    	!op.onCloseAllOthers || self._tryExcuteFunc(self, op.onCloseAllOthers, [0, bodyId]);
	    	
	    	// 需要重新计算menu的值，这里打一个标记
	    	op._itemsMenuData = null;
	    },
	    
	    // 计算所有标签页的索引，用于后续的操作
	    _calculateIndex : function() {
	    	var op = this.options;
	    	var self = this;
	    	// 重置缓存
	    	op._tabsHeadMapping.clear();
	    	op._tabsBodyMapping.clear();
	    	op._tabsBodyStatusMapping.clear();
	    	// 遍历计算
	    	self._getBodyItemsEl().each(function(index,element){
	    		var curEl = $(element);
	    		var id = curEl.attr("id");
	    		var url = curEl.attr("url");
	    		var iframe = (curEl.attr("iframe")==="false")?false:true;
	    		var name = curEl.attr("iframeName") || $Utils.genId("tabs-iframe-name");
	    		op._tabsBodyMapping.put(id, curEl);
	    		op._tabsBodyStatusMapping.put(id, {url: url, iframe: iframe, iframeName: name});
	    		curEl.removeAttr("iframe").removeAttr("url").removeAttr("iframeName");
	    	});
	    	self._getHeaderItemsEl().each(function(index, element) {
	    		var curEl = $(element);
	    		op._tabsHeadMapping.put(curEl.attr("id"), curEl);
	    	});
	    },
	    
	    /**
	     * 销毁组件
	     * @name FPanel#destroy
	     * @function
	     * @example
	     */
	    destroy : function() {
	        var op = this.options;
	        
	        //{ add 20130207 hanyin BUG #4666 以Iframe的方式打开tab页，内存泄露
	        // 清除没有被销毁的iframe
	        this._clearAllBody();
	        //} end add
	        // 显示销毁对象引用
	        op._tabsHeadMapping.destroy();
	        op._tabsHeadMapping = null;
	        op._tabsBodyMapping.destroy();
	        op._tabsBodyMapping = null;
	        op._tabsBodyStatusMapping.destroy();
	        op._tabsBodyStatusMapping = null;
	        for (var n in op) {
	        	op[n] = undefined;
	        }
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    },
	    
	    _clearAllBody : function() {
	    	var bodyMapping = op._tabsBodyMapping;
	    	var size = bodyMapping.size();
	    	for (var i=0; i<size; i++) {
	    		this._clearTabBody(bodyMapping.element(i).value);
	    	}
	    },
	    
	    _clearTabBody : function(el) {
	    	el.find("iframe").each(function() {
	    		var id = $(this).attr("id");
	    		$Utils.destroyIframe(id);
	    	});
	    },

		/**
		 * 选中特定的页签，触发activate事件。
		 * @name FTabs#activate
		 * @function
		 * @param tab 如果传入的参数是数字，则表示激活页签的索引（从0开始计数），比如0，则表示激活第0个标签页；
		 * 如果传入的是字符串，并且首字符是数字字符，那么截取开头的所有数字字符作为标签页索引（从0开始计数），比如"1tab"、"1"、"1Ta3"，都表示激活第1个标签页；
		 * 否则，传入的字符串作为标签页的ID，比如"tab-1"，则表示激活ID为"tab-1"的标签页；如果传入的是null，如果指定的标签页不存在，则不会有任何效果
		 * @example
		 * //激活第一个页签
		 * $('#make-tab').FTabs('activate', 0);
		 */
	    activate : function(tab, init) {
	    	if (tab === null) {
	    		return false;
	    	}
	    	var self = this;
	    	var op = this.options;
	    	var headerEl = self._getElement("header");
	    	var bodyEl = self._getElement("body");

	    	var tabId = null;
	    	var tabIndex = parseInt(tab);
	    	var headerTabEl = null;
	    	if (!isNaN(tabIndex)) {
    			// 根据索引计算出id
    			tabId = self.getAlter(tabIndex);
    			if (tabId == null) { // 没有对应索引的标签
    				return false;
    			}
	    	} else {
	    		tabId = tab;
	    		// 根据id计算出索引
	    		tabIndex = self.getAlter("" + tabId);
	    		if (tabIndex == -1) { // 没有对应id的标签页
	    			return false;
	    		}
	    	}
	    	// 不允许标签重复激活
	    	if (op._currentTabId == tabId) {
	    		return false;
	    	}

	    	// 触发onBeforeActivate事件
		    if (op.onBeforeActive) {
		    	var result = self._tryExcuteFunc(self, op.onBeforeActive, [tabIndex, tabId]);
			    if (result === false) { // 如果返回false，则阻止标签页的切换
			    	return false;
			    }
		    }
		    
		    var resetPrevTab = function() {
		    	var preTabId = op._currentTabId;
		    	var prevTabIndex = self.getAlter("" + preTabId);
		    	if (!preTabId || (!prevTabIndex && prevTabIndex!==0) || prevTabIndex < 0) {
		    		return;
		    	}
		    	var preTabHeaderEl = op._tabsHeadMapping.element(prevTabIndex).value;
		    	var preTabBodyEl = op._tabsBodyMapping.element(prevTabIndex).value;
		    	preTabHeaderEl.removeClass("f-tabs-active");
		    }
		    resetPrevTab();
		    
	    	var tabEl = op._tabsBodyMapping.element(tabIndex).value;
	    	// 修改标签header的样式
		    // var headerTabEl = $("ul li:eq("+tabIndex+")", headerEl);
	    	var headerTabEl = op._tabsHeadMapping.element(tabIndex).value;
			headerTabEl.removeClass("f-tabs-over").addClass("f-tabs-active");
	    	// 计算好布局之后，调整header上的tab，是当前被激活的tab可见
			self._adjustTabInSight(headerTabEl, tabIndex);
			
			// 修改标签的样式
		  var poffset = self._getElement("body-wrapper").offset();
			var coffset = tabEl.offset();
			self._getElement("body").stop().animate({
				marginTop : "-="+(coffset.top - poffset.top)
			}, 0);
			
	    	// 保存当前标签页
	    	op._objCurrentTabEl = tabEl;
	    	op._currentTabId = tabId;
		    // 重新计算布局
	    	if (init !== true) {
		    	// 计算当前显示标签的布局
		    	//this.setSize(op.width, op.height);
	    	//} else {
	    		//this._doLayout();
		    	// 如果已经出现了滚动条，则要及时更新滚动条的状态调整tabbar的滚动条的状态
	    		if (op._isScrollShow) {
	    			self._adjustTabScroller();
	    		}
	    	}
	    	
	    	// 如果是异步加载模式(iframe方式和非iframe方式)
	    	var tabStatus = op._tabsBodyStatusMapping.element(tabIndex).value || {};
	    	if (tabStatus.url && tabStatus.loaded !== true) {
	    		self.reload(tabIndex);
	    	}

	    	// 触发onActivate事件
	    	!op.onActive || self._tryExcuteFunc(self, op.onActive, [tabIndex, tabId]);

	    	return true;
	    },


		/**
		 * 根据第n个页签当前的数据源，重新加载该页签。<br/>
		 * <span style="color:red;">对于iframe模式的页签调用reload，目前支持的还不完善，请慎用。</span>
		 * @name FTabs#reload
		 * @function
		 * @param index 页签的索引
		 * @param url 要重新加载的页面url，如果不传入，则采用原先的配置
		 * @param iframe 是否采用iframe模式加载，如果不传入，则采用原先的配置
		 * @example
		 * //重新加载第一个页签的内容
		 * $('#make-tab').FTabs('reload', 0);
		 */
	    // 强制刷新页面
	    reload : function(index, url, iframe) {
	    	var op = this.options;
	    	var self = this;
	    	var tabStatus = op._tabsBodyStatusMapping.element(index).value || {};
	    	if (url) {
	    		tabStatus.url = url;
	    	}
	    	if (!tabStatus.url) {
	    		return false;
	    	}
	    	if (iframe === "false" || iframe === false) {
	    		tabStatus.iframe = false;
	    	} else if (iframe == "true" || iframe === true) {
	    		tabStatus.iframe = true;
	    	}
	    	tabStatus.loaded = false;
	    	
	    	var pageUrl = tabStatus.url;
            if (pageUrl.indexOf('://') === 0 && pageUrl.indexOf("/") !== 0) {
                pageUrl = $Utils.getContextPath() + '/' + pageUrl;
            }
	    	
	    	var element = op._tabsBodyMapping.element(index);
	    	var bodyEl = element.value.children(":first").children(".f-panel-body");
	        if (tabStatus.iframe) {
				// 20130325 hanyin 解决tabs组件iframe方式打开页面的时候，页面打不开的问题
				if (bodyEl.children("iframe").length != 0) {
					bodyEl.children("iframe").attr("src", pageUrl);
				} else {
					self._clearTabBody(element.value);
				    //以iframe的方式加载页面
				    var html = self._getIframeHtml(element.key, tabStatus.iframeName, pageUrl);
				    bodyEl.html(html);
				    bodyEl.children("iframe").css({
				    	height : bodyEl.height(),
				    	width : bodyEl.width()
				    });
		        	// 规避很奇怪的同样大小iframe和其之间出现滚动条的问题
		        	bodyEl.css({
		        		overflow : "hidden"
		        	});
				}
	            tabStatus.loaded = true;
            } else {
                //ajax方法获取文件内容，回调
                $.ajax({
                    context: self,
                    dataType: "html",
                    url: pageUrl,
                    success: function(contentHtml) {
                    	bodyEl.html(contentHtml);
                        tabStatus.loaded = true;
                        !op.onLoadComplete || self._tryExcuteFunc(self, op.onLoadComplete, [index, element.key]);
                    }
                });
            }
            // begin add 20130130 hanyin 重新载入页面时重新计算布局 
            //element.value.data("changedHash", -1); // 改变hash，触发改变
            //self._doLayout();
            // end add 20130130
            return true;
	    },

		/**
		 * 设置页签的title
		 * @name FTabs#setTitle
		 * @function
		 * @param n 可以是Number类型的索引，也可以是String类型的id
		 * @example
		 */
	    setTitle : function(n, text) {
	    	if (n === null) {
	    		return;
	    	}
	    	var self = this;
	    	var index;
	    	if (!isNaN(n)) {
	    		index = n;
	    	} else {
	    		index = self.getAlter(n);
	    	}
	    	var op = self.options;
	    	var headerEl = op._tabsHeadMapping.element(index).value;
	    	if (headerEl) {
	    		$(".f-tabs-strip-text", headerEl).html(text || " ");
	    	}
	    },

        //生成以iframe方式打开的html片段
        _getIframeHtml : function(id, name, pageUrl) {
        		var style = "style=";
        		if (this.options.fit === "true" || this.options.fit === true) {
        			style += "'overflow:hidden;'";
        		} else {
        			style += "'overflow:auto;'";
        		}
            var htmlArr = [];
            htmlArr.push('<iframe id="' + id + '-iframe" name="' + name + '" ' + style);
            htmlArr.push(' class="f-win-iframe f-panel-body-content"  frameborder="0" src="');
            htmlArr.push(pageUrl);
            htmlArr.push('"></iframe>');
            return htmlArr.join('');
        },
	    
	    // 将选中的tab的header调整到合适的位置
	    _adjustTabInSight : function(el, index) {
	    	var offset = 0;
	    	var self = this;
	    	var ulEl = self._getElement("header-ctl", self._getElement("header")).children();
	    	if (index != 0) {
	    		var offset = self._calTabOffset(el);
	    		ulEl.css("margin-left", (parseInt(ulEl.css("margin-left")) + offset)+"px");
	    	} else {
	    		ulEl.css("margin-left", "0px");
	    	}
	    },
	    
	    // 如果标签栏容不下，则尝试出现滚动按钮
	    _adjustTabScroller : function() {
	    	var op = this.options;
	    	var self = this;
	    	var isScrollShow = op._isScrollShow;

	    	// 左边的滚动按钮
	    	var leftScrollEl = self._getElement("scroll-left", self._getElement("header"));
	    	// 右边按钮
	    	var rightScrollEl = self._getElement("scroll-right", self._getElement("header"));
	    	// 下拉菜单
	    	var menuScrollEl = self._getElement("tabmenu-right", self._getElement("header"));
	    	// 内框标签
	    	var headerCtlEl = self._getElement("header-ctl", self._getElement("header"));

	    	var headerBox = self._calHeaderBox();
	    	var innerBox = self._calHeaderItemsBox();
	    	
	    	var headerWidth = headerBox.right - headerBox.left;
	    	var innerBoxWidth = innerBox.right - innerBox.left;
	    	if (headerWidth > innerBoxWidth) { // 如果外框大于内框，则不出现滚动按钮
	    		if (isScrollShow === true) {
		    		leftScrollEl.parent().css("display", "none");
		    		rightScrollEl.parent().css("display", "none");
		    		menuScrollEl.parent().css("display", "none");
		    		headerCtlEl.css("width", "100%");
		    		// 此时将滚动恢复到原始状态，消除以前的滚动状态
			    	self._adjustTabInSight(null, 0);
			    	op._isScrollShow = false;
	    		}
	    	} else {
	    		// 第一次出现scroll按钮时，调整按钮的大小
		    	if (op._ScrollfirstTimeShow === true) {
		    		var scrollBntHeight = self._getElement("header-ctl").height() -4;
		    		self._getElement("scroll-left").height(scrollBntHeight);
		    		self._getElement("tabmenu-right").height(scrollBntHeight);
		    		self._getElement("scroll-right").height(scrollBntHeight);
		    		op._ScrollfirstTimeShow = false;
		    	}
	    		if (isScrollShow === true) {
	    			var realWidth = self.element.width() -2;
	    			// 为了防止tabs的大小变化，所以需要重新计算header-ctl的宽度
		    		headerCtlEl.css("width", (realWidth-18*3)+"px"); 
	    		} else {
		    		headerCtlEl.css("width", (self._getElement("header").width()-18*3)+"px");
		    		leftScrollEl.parent().css("display", "block");
		    		rightScrollEl.parent().css("display", "block");
		    		menuScrollEl.parent().css("display", "block");
	    			op._isScrollShow = true;
	    			// 重新调整innerBox的位置
	    			innerBox.left = innerBox.left + 18;
	    			innerBox.right = innerBox.right + 18;
	    		}
	    		var ctlBox = self._calElementBox("header-ctl");
	    		if (ctlBox.left > innerBox.left) {
	    			leftScrollEl.removeClass("f-tabs-scroll-disabled");
	    		} else {
	    			leftScrollEl.addClass("f-tabs-scroll-disabled");
	    		}
	    		if (ctlBox.right < innerBox.right) {
	    			rightScrollEl.removeClass("f-tabs-scroll-disabled");
	    		} else {
	    			rightScrollEl.addClass("f-tabs-scroll-disabled");
	    		}
	    	}
	    },
	    
	    // 重新计算标签页内部的大小和布局
	    _doLayout : function() {
	    	var op = this.options;
	    	var tabEl = op._objCurrentTabEl;
	    	if (tabEl != null && tabEl.size() > 0) {
	    		var changedHash = tabEl.data("changedHash");
	    		if (changedHash != null) {
	    			if (parseInt(changedHash) == op._changeHash) {
	    				// 已经进行过布局计算，直接退出
	    				return;
	    			}
	    		}

	    		var childEl = null;
	    		var id = tabEl.attr("id");
	    		// 标签页Panel的body对象
	    		var panelBodyEl = $I(id + "-panel-body");
	    		// 是否存在toolbar等
			    var bodyContentEl = panelBodyEl.children(".f-panel-body-content");
			    var bodyContentCount = bodyContentEl.size();

		    	var width = parseInt(op.width);
		    	// 计算宽度
		    	if (!isNaN(width)) {
			    	panelBodyEl.width(width-2);
				    if (bodyContentCount === 1) {
				    	bodyContentEl.width(width-2);
				    }
		    	}
		    	// 计算高度
		    	var height = parseInt(op.height);
		    	if (!isNaN(height)) {
		    		var gaps = parseFloat(op.tabHeight) + 1; // 6个像素的header边距和1个像素的body边框
		    		var realSize = height - gaps;
			    	panelBodyEl.height(realSize);
				    if (bodyContentCount === 1) {
					    var otherHeight = 0;
					    bodyContentEl.siblings(":visible").each(function() {
						    otherHeight += $(this).outerHeight(true);
					    });
					    realSize = (realSize - otherHeight) < 0 ? 0 : (realSize - otherHeight);
					    bodyContentEl.height(realSize);
				    }
		    	}
		    	// 触发布局变化事件
		    	if (bodyContentCount == 1) {
			    	bodyContentEl.triggerHandler('onResize');
		    	} else {
		    		panelBodyEl.triggerHandler('onResize');
		    	}
		    	// 保存当前修改的hash
		    	tabEl.data("changedHash", op._changeHash);
	    	}
	    },
	    /**
	     * 设置组件的高宽，组件会自动调整标签页内部toolbar的位置
	     * @name FTabs#setSize
	     * @function
	     * @param w 组件的宽度，必须是数字或者数字类的字符串，不允许是百分比
	     * @param h 组件的高度，必须是数字或者数字类的字符串
	     * @example
	     */
	    setSize : function(w, h) {
		   var op = this.options;
		   var self = this;

		   var sizeChanged = false;
		   if (w != null) {
			   op.width = w;
			   sizeChanged = true;
			   var width = parseInt(w);
			   if (!isNaN(width)) {
				   //* begin 20121218 hanyin 设置整体的宽度，使header和body自适应
				   self.element.width(width);
				   // 减去左右边框各1px
				   //op._objHeader.width(width-2);
				   //op._objBody.width(width);
				   //* end 20121218 hanyin 设置整体的宽度，使header和body自适应
			   }
		   }
		   if (h != null && !isNaN(parseFloat(h))) {
			   op.height = parseFloat(h);
			   sizeChanged = true;
			   // 设置body-wrapper的高度，然后依次设置已经打开tab的body的高度和宽度
			   self._getElement("body-wrapper").css({
			   	height : op.height - (op.tabHeight)
			   });
			   var wrapperWidth = self._getElement("body-wrapper").width();
			   self._getElement("body").children(".f-panel").each(function() {
			   	var el = $(this);
			   	var id = el.attr("id");
			   	$("#"+id+"-panel-body,#"+id+"-iframe", el).each(function(){
			   		$(this).css({
			   			width: wrapperWidth -2, // 边框2px
			   			height : op.height - op.tabHeight - 1 // 边框1px
			   		});
			   	});
			   });
		   }
		   if (sizeChanged) {
			   op._changeHash ++;
		   }
		   //self._doLayout();

		   // 如果大小调整后，标签页被遮蔽，则出现左右滚动按钮
		   self._adjustTabScroller();
	    },

		/**
		 * 返回当前选中的页签的tabId。
		 * @name FTabs#getActivated
		 * @function
		 * @returns 当前选中页签的tabId
		 * @example
		 * //获取当前选中页签的tabId
		 * var activatedTabId = $('#make-tab').FTabs('getActivated');
		 */
	    getActivated : function() {
	    	var op = this.options;
	    	var currentEl = op._objCurrentTabEl;
	    	if (currentEl != null) {
	    		return currentEl.attr("id");
	    	}
	    	return null;
	    },

		/**
		 * 获得所有页签的数目。
		 * @name FTabs#getTabsCount
		 * @function
		 * @returns 页签的数目
		 * @example
		 * //获取页签的总数
		 * var total = $('#make-tab').FTabs('getTabCount');
		 */
	    getTabsCount : function() {
	    	return (this.options._tabsBodyMapping.size());
	    },

		/**
		 * 页签索引和tabId的转换器。传入其中的一个值，获取另一个值。
		 * @name FTabs#getAlter
		 * @function
		 * @param id 标识符
		 * @returns 如果id为数字，则表示页签的索引，函数返回页签的tabId，如果没有找到则返回null；如果id为字符串，则表示该页签的tabId，函数返回页签的索引，如果没有匹配的元素则返回-1。
		 * @example
		 * //获取第一个页签的tabId
		 * var tabId = $('#make-tab').FTabs('getAlter', 0);
		 */
	    getAlter : function(id) {
	    	var result = null;
	    	var op = this.options;
	    	if (id != null) {
	    		if ($Utils.isNumber(id)) {
	    			var element = op._tabsBodyMapping.element(id);
	    			if (element != null) {
	    				result = element.key;
	    			}
	    		} else {
	    			result = op._tabsBodyMapping.indexOf(id);
	    		}
	    	}
	    	return result;
	    },
	    
	    _getHeaderItemsEl : function() {
	    	return this._getElement("header-ctl").children().children(".f-tabs-head-item");
	    },
	    
	    _getBodyItemsEl : function() {
	    	return this._getElement("body").children("div.f-panel");
	    },
	    
	    _calHeaderBox : function() {
    		return this._calElementBox("header");
	    },
	    
	    _calElementBox : function(name) {
	    	var el = this._getElement(name);
    		var width = el.width();
    		var offset = el.offset();
    		return {
    				left : offset.left, 
    				right : offset.left + width
    		};
	    },
	    
	    _calHeaderItemsBox : function () {
	    	var op = this.options;
	    	var mapping = op._tabsHeadMapping;
	    	if (mapping.size() == 0) {
	    		return ;
	    	}
	    	var firstOffset = op._tabsHeadMapping.element(0).value.offset();
	    	var lastOffset = this._getElement("items-edge", this._getElement("header")).offset();
	    	return {
	    		left : firstOffset.left -2, /* 2个像素为margin-left */
	    		right : lastOffset.left +2
	    	};
	    },
	    
	    // 计算指定的tab的le是否是在header的范围内，如果是则返回true，否则返回
	    _calTabOffset : function(el) {
	    	
	    	function calElBox(el) {
	    		var width = el.outerWidth(true);
	    		var offset = el.offset();
	    		return {
	    				left : offset.left -2, /* 2个像素的margin-left */
	    				right : offset.left + width
	    		};
	    	}
	    	
	    	var self = this;
	    	var op = self.options;
	    	var ctlBox = self._calElementBox("header-ctl");
	    	var elBox = calElBox(el);

	    	var offset = 0;
	    	var ulEl = self._getElement("header-ctl").children();
	    	if (ctlBox.left > elBox.left) {
	    		offset = ctlBox.left-elBox.left;
	    	} else if (ctlBox.right < elBox.right) {
	    		offset = ctlBox.right-elBox.right;
	    	}
	    	return offset;
	    },
	    
	    _getElement : function(name, parent) {
	    	var op = this.options;
	    	var el = op["_obj" + name + "El"];
	    	if (el && el.length > 0) {
	    		return el;
	    	} else {
	    		el = op["_obj" + name + "El"] = $("#" + op.id + "-" + name + ":first", (parent ||this.element));
	    	}
	    	return el;
	    },
	    // 获取处于body指定的的儿子
	    _getGlobalElement : function(name) {
	    	var op = this.options;
	    	var el = op["_gobj" + name + "El"];
	    	if (el && el.length > 0) {
	    		return el;
	    	} else {
	    		el = op["_gobj" + name + "El"] = $("body").children("#" + op.id + "-" + name + ":first");
	    	}
	    	return el;
	    }
	});
})(jQuery);


