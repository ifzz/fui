/*
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.FCalendar.js
 * 作者：hanyin
 * 邮箱：hanyin@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FCalendar组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 20130116  hanyin		按照新的form表单标准：增加方法setDisable、isDisable、getValue、setValue等
 * 2013-03-18   qudc    修复需求5490，修复设置readonly属性为true，输入框仍然可以通过按数字键修改日期的问题。
 * 20130416  hanyin		需求5756 ，解决在通过api设值之后，手动清空Calendar的值会造成隐藏域清不掉的问题
 * 20130528	hanyin		需求STORY #6054，增加setSelectable等方法，设置为false的时候，不可以通过点击按钮下来日历
 */

/**
 * @name FCalendar
 * @class 
 * 日历组件，供用户选择日期和时间的输入以及格式化。
 */

/** @lends FCalendar# */

/**
 * 标识(仅标签使用)
 * @name FCalendar#<ins>id</ins>
 * @type String
 * @default 随机生成
 * @example
 * 无
 */

/**
 * 表单组件的名字，用于表单提交是文本表单域的名字(仅标签使用)
 * @name FCalendar#<ins>name</ins>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 鼠标悬浮于输入框之上时，跟随鼠标弹出显示tip的文本(仅标签使用)
 * @name FCalendar#<ins>title</ins>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 设置在使用Tab键切换表单时的顺序，同一个表单中，tabIndex的值越大，顺序越靠后；如果tabIndex相同，DOM结构位于后面的顺序越靠后(仅标签使用)
 * @name FCalendar#<ins>tabIndex</ins>
 * @type String
 * @default 0
 * @example
 * 无
 */

/**
 * 表单域的初始可用状态，如果为true则表示不可用，也不会参与表单提交；否则可以正常使用(仅标签使用)
 * @name FCalendar#<ins>disabled</ins>
 * @type Boolean
 * @default false
 * @example
 * 无
 */

/**
 * 表单域的初始可编辑状态，如果为true则表示输入框不可用，如果存在图标，图标可以点击；否则可以正常使用(仅标签使用)
 * @name FCalendar#<ins>readonly</ins>
 * @type Boolean
 * @default false
 * @example
 * 无
 */

(function($) {
	
	$.FUI.FDate = function (){
		// 年 月 日 时 分 秒
		this.y=0, this.M=0,this.d=0,this.H= 0,this.m = 0,this.s = 0;
		this.lastFmt = "";
		this.lastDateStr = "";
		
		this._reset = function() {
			this.y = this.M = this.d = this.H = this.m = this.s = 0;
		};
		
		// 将传入的字符串按照fmt格式转换
		this.parseStr =function(str, fmt) {
			var self = this;
			var year, month, day, hour, minite, second;
			fmt = fmt || "yyyy-MM-dd";

			self.lastFmt = fmt;
			self.lastDateStr = str;
			
			for (var i=0; i<fmt.length;) {
				var literal = self._parseLiteral(fmt, i);
				if (literal.literal == null) {
					break;
				}
				var index = literal.startIndex;
				var count = literal.count;
				// 不能用parseInt，他无法正确转换 "09"、"01"等0开头的字符串
				self[literal.literal] = Number(str.substr(index, count), 10);
				i = index + count;
			}
		};
		
		this._parseLiteral= function(fmt, start) {
			var literal = null;
			var count = 0;
			var startIndex = -1;
			var value = "";
			for (var i=start; i<fmt.length; i++) {
				var ch = fmt.charAt(i);
				if (literal != null) {
					if (literal == ch) {
						count ++;
						value = value + ch;
					} else {
						break;
					}
				} else {
					if (ch=="y" || ch=="M" || ch=="d" || ch=="H" || ch=="m" || ch=="s") {
						literal = ch;
						count++;
						value = value + ch;
						startIndex = i;
					}
				}
			}
			return {literal:literal, count:count, startIndex: startIndex, value: value};
		};

		// 将日期组件按照指定的格式转换为字符串
		this.toString = function(fmt) {
			var self = this;
			fmt = fmt || "yyyy-MM-dd";
			if (self.lastFmt == fmt) {
				return self.lastDateStr;
			}
			var result = fmt;
			for (var i=0; i<fmt.length;) {
				var lit = self._parseLiteral(fmt, i);
				if (lit.literal == null) {
					break;
				}
				var literal = lit.literal;
				var count = lit.count;
				var fmtValue = lit.value;
				var value = self._getLiteralValue(literal, count);
				result = result.replace(fmtValue, value);

				i = lit.startIndex + count;
			}
			return result;
		};

		this._getLiteralValue = function(literal, length) {
			var self = this;
			var value = "" + self[literal];
			var gap = length - value.length;
			if (gap > 0) {
				for (var i=0; i<gap; i++) {
					value = "0" + value;
				}
			}
			return value;
		};
	};
	
	$.widget("FUI.FCalendar", {
	    options : {
	    	id : null,
	    	/**
	    	 * 显示的选项
	    	 * @name FCalendar#showOpts
	    	 * @type Object
	    	 * @default ""
	    	 * @example
	    	 * 无
	    	 */
	    	showOpts : null,
	    	// 是否可以通过点击图片下拉日历
	    	selectable : true
	    },
	    
	    _create : function() {
            var UTILS = window['$Utils'],options = this.options,el = this.element;
	    	options.id = el.attr("id");
	    	// 20130507 end add by hanyin 修复BUG #4993，日历控件如果没有传入showOpts造成后续使用报错的问题
	    	options.showOpts = options.showOpts || {};
	    	// 20130507 end add by hanyin
            var readonly = el.next().attr("readonly");
            if(readonly){
                this.options.showOpts = UTILS.apply(this.options.showOpts||{},{'readOnly':true});
            }
	    },

	    _init : function() {
	    	this._bindEvent();
	    },
	    
	    _bindEvent : function() {
	    	var self = this;
	    	var displayEl = self.element.FTextField("getInputEl");
	    	if (!displayEl.is("input")) { // 如果不是输入框则不绑定默认事件
	    		return;
	    	}
	    	var op = this.options;
	    	var triggerEl = $I(op.id + "-trigger");
	    	if (triggerEl.size() != 0) {
	    		triggerEl.click(function() {
	    			// 20130528 hanyin 需求STORY #6054，当设定为selecable=false，不可通过按钮下拉日历
	    			if ($I(op.id).FTextField("disabled") === true || !self.isSelectable()) {
	    				return;
	    			}
	    			// 防止先点击按钮造成输入框二次展现
	    			displayEl.unbind("focus.FCalendar");
	    			self.show();
	    		});
	    	}
	    	// begin 20130416 hanyin 需求5756 ，解决在通过api设值之后，手动清空Calendar的值会造成隐藏域清不掉的问题
    		displayEl.bind("focus.FCalendar", function() {
    			if ($I(op.id).FTextField("disabled") === true || self.isReadonly()) {
    				return;
    			}
    			// 防止先点击按钮造成输入框二次展现
    			displayEl.unbind("focus.FCalendar");
    			self.show();
    		});
	    	// begin 20130416 hanyin
	    	
	    	self.element.bind("onValueChanged", function(e, v) {
	    		var fmt = "";
	    		var op = self.options;
	    		if (!v) { // 如果传入的日期为""
		    		$I(op.id + "-input").val("");
	    		} else {
		    		var date = new $.FUI.FDate();
		    		var realDateFmt = op.realDateFmt || (op.showOpts||{}).realDateFmt;
		    		var realTimeFmt = op.realTimeFmt || (op.showOpts||{}).realTimeFmt;
		    		var realFullFmt = op.realFullFmt || (op.showOpts||{}).realFullFmt;
		    		var dateFmt = op.dateFmt || (op.showOpts||{}).dateFmt;
		    		if (realDateFmt) {
		    			fmt = realDateFmt;
		    		} else if (realTimeFmt) {
		    			fmt = realTimeFmt;
		    		} else {
		    			fmt = realFullFmt;
		    		}
		    		date.parseStr(v, fmt);
		    		$I(op.id + "-input").val(date.toString(dateFmt));
	    		}
	    	});
	    },

	    /**
	     * 设置表单输入框的值，如果传入了参数则表示设置；该方法会始终返回当前表单输入框的值；如果存在隐藏域则访问隐藏域，否则效果同方法displayValue(v)。<br/>
	     * <span style="color:red">注意：</span>不建议绑定输入框的 change或者onChange事件，因为这些事件
	     * 在通过js修改输入框的value之后<b>不会触发</b>（很奇妙的是，在IE6/7/8上居然触发了），所以在这种情况下请绑定 onValueChanged事件。<br/>
	     * 另外在默认情况下，调用此方法对输入框赋值，会触发onValueChanged事件，可以通过传入force=true来关闭事件的触发。
	     * @name FCalendar#setValue
	     * @function
	     * @param v 要设置的表单输入框的值
	     * @param force 非必须，如果传入true则不会触发onValueChanged事件
	     * @return 当前表单输入框的值，如果进行了设置，那么返回设置之后表单输入框的值
	     * @example
	     */
	    setValue : function(v, force) {
	    	return this.element.FTextField("value", v, force);
	    },

	    /**
	     * 获取表单域的值
	     * @name FCalendar#getValue
	     * @function
	     * @return 当前表单域的值
	     * @example
	     */
	    getValue: function() {
	    	return this.element.FTextField("value");
	    },

	    /**
	     * 重置表单域的值为空，如果存在隐藏域，隐藏域也会被清空。但是不会去除表单域的校验信息，如果需要去除表单域的校验信息，请调用FForm的reset方法。
	     * @name FCalendar#reset
	     * @function
	     * @return void
	     * @example
	     */
	    reset : function() {
	    	return this.element.FTextField("reset");
	    },

	    /**
	     * 设置输入框的可用状态；表单处于不可用状态时，不可编辑，该表单域也不会参与表单的提交
	     * @name FCalendar#setDisabled
	     * @function
	     * @param state 如果传入true，则表示将组件置为不可用状态；如果传入false，则表示置为可用状态。
	     * @return 当前表单的可用状态，true表示表单不可用，false表示表单可用
	     * @example
	     */
	    setDisabled : function(state) {
	    	return this.element.FTextField("disabled", state);
	    },

	    /**
	     * 获取输入框的可用状态；表单处于不可用状态时，不可编辑，该表单域也不会参与表单的提交
	     * @name FCalendar#isDisabled
	     * @function
	     * @return 当前表单的可用状态，true表示表单不可用，false表示表单可用
	     * @example
	     */
	    isDisabled : function() {
	    	return this.element.FTextField("disabled");
	    },
        /**
         * 设置输入框是否可编辑，下拉图片是否可点击。selectable默认为true。setSelectable为false时，输入框不可编辑且下拉图片不可点击。参数： selectable : Boolean 返回值： void
         * @name FCalendar#setSelectable
         * @function
         * @param selectable  类型:"Boolean"。
         * @example
         */
        setSelectable : function(selectable) {
        	if (selectable === true || selectable === false) {
        		this.options.selectable = selectable;
        	}
        },
        /**
         * 判断组件下拉图片是否可点击 参数： 无 返回值： Boolean
         * @name FCalendar#isSelectable
         * @function
         * @return Boolean
         * @example
         */
        isSelectable : function() {
            return this.options.selectable;
        },
	    
	    /**
	     * 设置输入框的可编辑状态；表单处于不可编辑状态时，输入框不可用，如果存在图标，图标可以点击。
	     * @name FCalendar#setReadonly
	     * @function
	     * @param state 如果传入true，则表示将组件置为不可编辑状态；如果传入false，则表示置为可编辑状态。
	     * @return 当前表单的可编辑状态，true表示表单输入框不可编辑，false表示表单可编辑。
	     * @example
	     */
	    setReadonly : function(state) {
            if(undefined === state){
                return false;
            }
            if(true === state || "true" == state){
                this.options.showOpts.readOnly = true ;
            } else {
                this.options.showOpts.readOnly = false ;
            }
            return this.element.FTextField("readonly", state);
	    },

	    /**
	     * 获取输入框的可编辑状态；表单处于不可编辑状态时，输入框不可用，如果存在图标，图标可以点击。
	     * @name FCalendar#isReadonly
	     * @function
	     * @return 当前表单的可编辑状态，true表示表单输入框不可编辑，false表示表单可编辑。
	     * @example
	     */
	    isReadonly : function() {
	    	return this.element.FTextField("readonly");
	    },
	    
	    /**
	     * 显示日历组件
	     * @name FCalendar#show
	     * @function
	     * @param op 显示选项对象，如果无效，则采用showOpts属性的值；否则属性showOpts将被忽略。
	     * @return void
	     * @example
	     */
	    show : function(op) {
	    	var self = this;
	    	var opts = this.options;
	    	op = op || opts.showOpts || {};
	    	op = $.extend({}, op, {
	    		el : opts.id+"-input",
	    		vel : opts.id,
	    		position: self._calPosition()
	    	});

	    	opts.dateFmt = op.dateFmt;
	    	opts.realDateFmt = op.realDateFmt;
	    	opts.realTimeFmt = op.realTimeFmt;
	    	opts.realFullFmt = op.realFullFmt;

	    	WdatePicker(op); // 调用My97的API，显示日历控件
	    },

	    /**
	     * 隐藏组件
	     * @name FCalendar#hide
	     * @function
	     * @return void
	     * @example
	     * $("#form1").FForm("hide");
	     */
	    hide : function(){
	    	$dp.hide();
	    },

	    /**
	     * 设置组件的显示属性，下次显示时生效
	     * @name FCalendar#setShowOpts
	     * @function
	     * @opts Object
	     * @return void
	     * @example
	     * $("#form1").FForm("setShowOpts", {realDateFmt : "yyyyMMdd"});
	     */
	    setShowOpts : function(opts) {
	    	this.options.showOpts = opts;
	    },
	    
	    _calPosition : function() {
	    	var selfEl = this.element;
	    	var boxEl = selfEl.FTextField("getBoxEl");
	    	// 修复由于图标造成的input位置偏移的问题
	    	if (boxEl.hasClass("f-textField-icon-right") 
	    			|| boxEl.hasClass("f-textField-icon-left")
	    			|| boxEl.hasClass("f-textField-icon-inner-right")) {
	    		return {left:-4, top:1};
	    	} else if (boxEl.hasClass("f-textField-icon-inner-left")) {
	    		return {left:-19, top:1};
	    	}
	    },

	    /**
	     * 销毁组件
	     * @name FCalendar#destroy
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

 