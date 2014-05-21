/*
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.FTextField.js
 * 作者：hanyin
 * 邮箱：hanyin@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FTextField组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 20130116  hanyin		按照新的form表单标准：增加方法setDisable、isDisable、getValue、setValue等
 * 20130314  hanyin		删除input的事件绑定，取消focus的篮框效果
 */

/**
 * @name FTextField
 * @class 
 * 文本输入框，输入文字，与html原始的input[type=text]一致。
 */
	
/**@lends FTextField# */
/**
 * 标识(仅标签使用)
 * @name FTextField#<ins>id</ins>
 * @type String
 * @default 随机生成
 * @example
 * 无
 */

/**
 * 表单组件的名字，用于表单提交是文本表单域的名字(仅标签使用)
 * @name FTextField#<ins>name</ins>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 鼠标悬浮于输入框之上时，跟随鼠标弹出显示tip的文本(仅标签使用)
 * @name FTextField#<ins>title</ins>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 设置在使用Tab键切换表单时的顺序，同一个表单中，tabIndex的值越大，顺序越靠后；如果tabIndex相同，DOM结构位于后面的顺序越靠后(仅标签使用)
 * @name FTextField#<ins>tabIndex</ins>
 * @type String
 * @default 0
 * @example
 * 无
 */

/**
 * 设置图标的位置，支持的值包括"inner-left"、"inner-right"、"right"和"left"，默认为"right"，分别对应到
 * 图标显示在input的内部靠左、内部靠右、外部靠右和外部靠左，其中，前三种较为常用。(仅标签使用)
 * @name FTextField#<ins>iconPos</ins>
 * @type String
 * @default "right"
 * @example
 * 无
 */

/**
 * 设置图标的样式，如果没有设置此值，则不显示图标，设置的iconPos属性也将无效。FUI提供了一套默认的图标，支持的是"inner-left"和"inner-right"，图标的大小为16X16像素；
 * 对于iconPos为"left"、"right"的图标，height:22px，width:16px(仅标签使用)
 * @name FTextField#<ins>iconCls</ins>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 组件的整体宽度，包括图标，支持数字和数字类的字符串(仅标签使用)
 * @name FTextField#<ins>width</ins>
 * @type Integer
 * @default 150
 * @example
 * 无
 */

/**
 * 组件的整体高度，支持数字和数字类的字符串但是不建议用户设置此值，除非已经找到相应高度的图标了(仅标签使用)
 * @name FTextField#<ins>height</ins>
 * @type Integer
 * @default 22
 * @example
 * 无
 */

(function($) {
	$.registerWidgetEvent("onValueChanged");
	$.widget("FUI.FTextField", {
	    options : {
	    	/**
	    	 * 表单域的初始可用状态，如果为true则表示不可用，也不会参与表单提交；否则可以正常使用(仅标签使用)
	    	 * @name FTextField#<ins>disabled</ins>
	    	 * @type Boolean
	    	 * @default false
	    	 * @example
	    	 * 无
	    	 */
	    	disabled : null,
	    	/**
	    	 * 表单域的初始可编辑状态，如果为true则表示输入框不可用，如果存在图标，图标可以点击；否则可以正常使用(仅标签使用)
	    	 * @name FTextField#<ins>readonly</ins>
	    	 * @type Boolean
	    	 * @default false
	    	 * @example
	    	 * 无
	    	 */
	    	readonly : null,
	    	hasHiddenField : false,
	    	// 显示的input
	    	_objInput : null,
	    	// 隐藏的input
	    	_objHidden : null,
	    	// wrapper
	    	_objWrapper : null,
	    	_objBox : null
	    },

	    _create : function() {
	    	this.options.id = this.element.attr("id");;
	    },

	    _init : function() {
	    	var self = this;
	    },
	    
	    getBoxEl : function() {
	    	var op = this.options;
	    	op._objBox = op._objBox || this.getWrapperEl().parent();
	    	return op._objBox;
	    },
	    
	    getInputEl : function() {
	    	var op = this.options;
	    	if (op._objInput) {
	    		return op._objInput;
	    	} else {
	    		if (op.hasHiddenField) {
	    			op._objInput = this.element.next();
	    		} else {
	    			op._objInput = this.element;
	    		}
	    		return op._objInput;
	    	}
	    },
	    
	    getHiddenEl : function() {
	    	var op = this.options;
	    	if (op._objHidden) {
	    		return op._objHidden;
	    	} else {
	    		if (op.hasHiddenField) {
	    			op._objHidden = this.element;
	    		} else {
	    			op._objHidden = $I("___NOT_EXSITED___");
	    		}
	    		return op._objHidden;
	    	}
	    },
	    
	    getWrapperEl : function() {
	    	var op = this.options;
	    	op._objWrapper = op._objWrapper || this.element.parent();
	    	return op._objWrapper;
	    },
	    
	    hasHiddenField : function() {
	    	return (this.getHiddenEl().size() != 0);
	    },

	    /**
	     * 设置/获取显示域的值，如果传入了参数则表示设置；该方法会始终返回当前显示域的值。<br/>
	     * <span style="color:red">注意：</span>不建议绑定输入框的 change或者onChange事件，因为这些事件
	     * 在通过js修改输入框的value之后<b>不会触发</b>（很奇妙的是，在IE6/7/8上居然触发了），所以在这种情况下请绑定 onValueChanged事件。<br/>
	     * 另外在默认情况下，调用此方法对输入框赋值，会触发onValueChanged事件，可以通过传入force=true来关闭事件的触发。
	     * @name FTextField#displayValue
	     * @function
	     * @param v 要设置的显示域的值
	     * @param force 非必须，如果传入true则不会触发onValueChanged事件
	     * @return 当前显示域的值
	     * @example
	     */
	    displayValue : function(v, force) {
	    	var inputEl = this.getInputEl();
	    	if (v || v=="") {
	    		inputEl.val(v);
	    		if (force !== true) { // 只有在force为true的时候才不会触发事件
		    		inputEl.trigger("onValueChanged");
	    		}
	    	}
	    	return inputEl.val();
	    },

	    // 不建议使用，推荐使用setValue或者getValue
	    value : function(v, force) {
	    	var self = this;
	    	var op = this.options;
	    	if (self.hasHiddenField()) {
		    	var hiddenEl = this.getHiddenEl();
		    	if (v || v=="") {
		    		hiddenEl.val(v);
		    		if (force !== true) { // 只有在force为true的时候才不会触发事件
		    			hiddenEl.trigger("onValueChanged", v);
		    		}
		    	}
		    	return hiddenEl.val();
	    	} else {
	    		return self.displayValue(v);
	    	}
	    },

	    /**
	     * 设置表单输入框的值，如果传入了参数则表示设置；该方法会始终返回当前表单输入框的值；如果存在隐藏域则访问隐藏域，否则效果同方法displayValue(v)。<br/>
	     * <span style="color:red">注意：</span>不建议绑定输入框的 change或者onChange事件，因为这些事件
	     * 在通过js修改输入框的value之后<b>不会触发</b>（很奇妙的是，在IE6/7/8上居然触发了），所以在这种情况下请绑定 onValueChanged事件。<br/>
	     * 另外在默认情况下，调用此方法对输入框赋值，会触发onValueChanged事件，可以通过传入force=true来关闭事件的触发。
	     * @name FTextField#setValue
	     * @function
	     * @param v 要设置的表单输入框的值
	     * @param force 非必须，如果传入true则不会触发onValueChanged事件
	     * @return 当前表单输入框的值，如果进行了设置，那么返回设置之后表单输入框的值
	     * @example
	     */
	    setValue : function(v, force) {
	    	return this.value(v, force);
	    },

	    /**
	     * 获取表单域的值
	     * @name FTextField#getValue
	     * @function
	     * @return 当前表单域的值
	     * @example
	     */
	    getValue: function() {
	    	return this.value();
	    },

	    /**
	     * 获取/设置表单输入框的name属性，该属性对应到表单提交时，表单域的key值
	     * @name FTextField#name
	     * @function
	     * @param n 要设置的表单域的名字
	     * @return 当前表单域的name属性，如果进行了设置，则返回设置后的值。
	     * @example
	     */
	    name : function(n) {
	    	var self = this;
	    	if (self.hasHiddenField()) {
		    	var hiddenEl = self.getHiddenEl();
		    	if (n || n=="") {
		    		hiddenEl.attr("name", n);
		    	}
		    	return hiddenEl.attr("name");
	    	} else {
    			var inputEl = self.getInputEl();
	    		if (n || n=="") {
	    			inputEl.attr("name", n);
	    		}
	    		return inputEl.attr("name");
	    	}
	    },

	    /**
	     * 重置表单域的值为空，如果存在隐藏域，隐藏域也会被清空。但是不会去除表单域的校验信息，如果需要去除表单域的校验信息，请调用FForm的reset方法。
	     * @name FTextField#reset
	     * @function
	     * @return void
	     * @example
	     */
	    reset : function() {
	    	var self = this;
	    	if (self.hasHiddenField()) {
	    		self.displayValue("");
	    		self.value("");
	    	} else {
	    		self.displayValue("");
	    	}
	    },
	    
	    // 不推荐使用，推荐使用setDisabled或者isDisabled方法
	    disabled : function(state) {
	    	var op = this.options;
	    	if (op.disabled == null) {
	    		op.disabled = this.getBoxEl().hasClass("f-state-disabled");
	    	}

	    	var hasHiddenField = this.hasHiddenField();
	    	var hiddenEl = this.getHiddenEl();
	    	var inputEl = this.getInputEl();
	    	var boxEl = this.getBoxEl();
	    	if (arguments.length != 0) {
		    	if (state === true) {
		    		boxEl.removeClass("f-state-focus f-state-hover").addClass("f-state-disabled");
		    		inputEl.attr("disabled", true);
		    		if (hasHiddenField) {
		    			hiddenEl.attr("disabled", true);
		    		}
		    	} else {
		    		boxEl.removeClass("f-state-focus f-state-hover f-state-disabled");
		    		inputEl.attr("disabled", false);
		    		if (hasHiddenField) {
		    			hiddenEl.attr("disabled", true);
		    		}
		    	}
		    	op.disabled = (inputEl.attr("disabled") == "disabled");
	    	}
	    	return op.disabled;
	    },

	    /**
	     * 设置输入框的可用状态；表单处于不可用状态时，不可编辑，该表单域也不会参与表单的提交
	     * @name FTextField#setDisabled
	     * @function
	     * @param state 如果传入true，则表示将组件置为不可用状态；如果传入false，则表示置为可用状态。
	     * @return 当前表单的可用状态，true表示表单不可用，false表示表单可用
	     * @example
	     */
	    setDisabled : function(state) {
	    	return this.disabled(state);
	    },

	    /**
	     * 获取输入框的可用状态；表单处于不可用状态时，不可编辑，该表单域也不会参与表单的提交
	     * @name FTextField#isDisabled
	     * @function
	     * @return 当前表单的可用状态，true表示表单不可用，false表示表单可用
	     * @example
	     */
	    isDisabled : function() {
	    	return this.disabled();
	    },
	    
	    readonly : function(state) {
	    	var op = this.options;
	    	if (op.readonly == null) {
	    		op.readonly = this.getBoxEl().hasClass("f-state-readonly");
	    	}

	    	var hasHiddenField = this.hasHiddenField();
	    	var hiddenEl = this.getHiddenEl();
	    	var inputEl = this.getInputEl();
	    	var boxEl = this.getBoxEl();
	    	if (arguments.length != 0) {
		    	if (state === true) {
		    		boxEl.removeClass("f-state-focus f-state-hover").addClass("f-state-readonly");
		    		inputEl.attr("readonly", true);
		    		if (hasHiddenField) {
		    			hiddenEl.attr("readonly", true);
		    		}
		    	} else {
		    		boxEl.removeClass("f-state-focus f-state-hover f-state-readonly");
		    		inputEl.attr("readonly", false);
		    		if (hasHiddenField) {
		    			hiddenEl.attr("readonly", true);
		    		}
		    	}
		    	op.readonly = (inputEl.attr("readonly") == "readonly");
	    	}
	    	return op.readonly;
	    },

	    /**
	     * 设置输入框的可编辑状态；表单处于不可编辑状态时，输入框不可用，如果存在图标，图标可以点击。
	     * @name FTextField#setReadonly
	     * @function
	     * @param state 如果传入true，则表示将组件置为不可编辑状态；如果传入false，则表示置为可编辑状态。
	     * @return 当前表单的可编辑状态，true表示表单输入框不可编辑，false表示表单可编辑。
	     * @example
	     */
	    setReadonly : function(state) {
	    	return this.readonly(state);
	    },

	    /**
	     * 获取输入框的可编辑状态；表单处于不可编辑状态时，输入框不可用，如果存在图标，图标可以点击。
	     * @name FTextField#isReadonly
	     * @function
	     * @param state 如果传入true，则表示将组件置为不可编辑状态；如果传入false，则表示置为可编辑状态。
	     * @return 当前表单的可编辑状态，true表示表单输入框不可编辑，false表示表单可编辑。
	     * @example
	     */
	    isReadonly : function() {
	    	return this.readonly();
	    },

	    /**
	     * 销毁组件
	     * @name FPopupMessage#destroy
	     * @function
	     * @example
	     */
	    destroy : function() {
		    var op = this.options;
		    this.getInputEl().unbind();
		    this.getBoxEl().unbind();
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    }
	});
	
})(jQuery);
