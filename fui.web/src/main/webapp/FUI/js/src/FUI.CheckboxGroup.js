/*
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.FCheckboxGroup.js
 * 作者：hanyin
 * 邮箱：hanyin@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FCheckboxGroup组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 20130116  hanyin		按照新的form表单标准：增加方法setDisable、isDisable、getValue、setValue等
 * 20130123  hanyin		增加初始状态disabled、readonly
 */

/**
 * @name FCheckboxGroup
 * @class 
 * 复选框组容器，管理多个CheckBox组件，批量赋值和状态管理等功能。
 */

/**@lends FCheckboxGroup# */

/**
 * 标识(仅标签使用)
 * @name FCheckboxGroup#<ins>id</ins>
 * @type String
 * @default 随机生成
 * @example
 * 无
 */

/**
 * 表单组件的名字，用于表单提交是文本表单域的名字(仅标签使用)
 * @name FCheckboxGroup#<ins>name</ins>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 表单域的初始可用状态，如果为true则表示不可用，也不会参与表单提交；否则可以正常使用(仅标签使用)
 * @name FCheckboxGroup#<ins>disabled</ins>
 * @type Boolean
 * @default false
 * @example
 * 无
 */

/**
 * 表单域的初始可编辑状态，如果为true则表示输入框不可用，如果存在图标，图标可以点击；否则可以正常使用(仅标签使用)
 * @name FCheckboxGroup#<ins>readonly</ins>
 * @type Boolean
 * @default false
 * @example
 * 无
 */


(function($) {
	// FCheckboxGroup对应的DOM必须是一个Checkbox的容器
	// 有且仅有一个隐藏input具有name属性，其他的checkbox都必须有value属性，如果没有则会被忽略
	$.widget("FUI.FCheckboxGroup", {
	    options : {
            /**
             * seperator用来分隔被选中的checkbox的value值，作为表单提交的值。
             * @name FCheckboxGroup#<ins>seperator</ins>
             * @type String
             * @default ","
             * @example
             * <pre>
             * $("#checkboxGroup1").FCheckboxGroup({seperator:":"});
             * 此时，如果value为"0"、"1"、"3"的checkbox被选中，那么该组件的进行表单提交的值为 "0:1:3"
             * </pre>
             */
	    	seperator: ",",
            /**
             * 组件的默认值，在组件初始化或者调用reset的时候，会采用此默认值初始化checkbox的选中状态，
             * 比如defaultValue="0,1,3"，那么value为0,1,3的checkbox会被选中。注意：defaultValue的值分隔串必须与seperator属性一致。
             * @name FCheckboxGroup#<ins>defaultValue</ins>
             * @type String
             * @default ""
             * @example
             */
	    	defaultValue: "",

	    	_objBox : null
	    },

	    _create : function() {
		    // 初始化ID
		    this.options.id = this.element.attr("id");
		    this.options._objBox = null;
	    },

	    _init : function() {
		    this.options._objBox = null;
		    // 获取所有的checkbox组件绑定click事件
	    	this._bindEvent();
	    	// 如果设置了默认值，则使用默认值初始化
	    	if (this.options.defaultValue) {
	    		this.reset(); // 使用defaultValue初始化组件
	    	}
	    	// add 20130123 hanyin 增加初始状态
	    	if (this.options.readonly === true) {
	    		this.readonly(true);
	    	}
	    	if (this.options.disabled === true) {
	    		this.disabled(true);
	    	}
	    	// end add 20130123 hanyin 增加初始状态
	    },
	    
	    _bindEvent : function() {
	    	var self = this;
	    	$(":checkbox[value]", this._getBoxEl()).click(function() {
	    		if (self.readonly() || self.disabled()) { // 避免在readonly状态下，checkbox依然可选
		    		return false;
	    		}
    			self._triggerValueChange();
	    	});
	    },
	    
	    _getBoxEl : function() {
	    	var selfEl = this.element;
	    	var op = this.options;
	    	if (op._objBox == null) {
	    		if (selfEl.is("input")) {
	    			op._objBox = selfEl.parent();
	    		} else { // div等容器
	    			op._objBox = selfEl;
	    		}
	    	}
	    	return op._objBox;
	    },
	    
	    _triggerValueChange : function() {
	    	var values = [];
	    	$(":checkbox[value]:checked", this._getBoxEl()).each(function() {
	    		var itemEl = $(this);
	    		if (!itemEl.attr("disabled")) { // 只有可用状态的才能被求值
	    			values.push($(this).val());
	    		}
	    	});
	    	var sep = this.options.seperator || ",";
	    	$("input[name]", this._getBoxEl()).val(values.join(sep));
	    },

	    value : function(v, force) {
	    	if (v || v=="") {
		    	var sep = this.options.seperator || ",";
	    		var array = v;
	    		if ($Utils.isString(v)) {
	    			array = v.split(sep);
	    		}
	    		if ($Utils.isArray(array)) {
	    			this._setValueByArray(array);
	    			if (force !== true) {
	    				this.element.trigger("onValueChanged");
	    			}
	    		}
	    	}
	    	return $("input[name]", this._getBoxEl()).val();
	    },

	    /**
	     * 批量设置内部checkbox的值
	     * @name FCheckboxGroup#setValue
	     * @function
	     * @param v 使用seperator分隔的字符串
	     * @return String
	     * @example
	     * 无
	     */
	    setValue : function(v, force) {
	    	return this.value(v, force);
	    },

	    /**
	     * 获取表单域的值，搜集checkbox的value值，并使用seperator属性的值分隔。
	     * @name FCheckboxGroup#getValue
	     * @function
	     * @return 当前表单域的值
	     * @example
	     */
	    getValue: function() {
	    	return this.value(v);
	    },

	    disabled : function(state) {
	    	var boxEl = this._getBoxEl();
	    	if (arguments.length != 0) {
	    		state = (state===true);
	    		if (state) {
	    			boxEl.addClass("f-state-disabled");
	    		} else {
	    			boxEl.removeClass("f-state-disabled");
	    		}
	    		$(":checkbox[value],input[name]", boxEl).attr("disabled", state);
	    	}
	    	return boxEl.hasClass("f-state-disabled");
	    },

	    /**
	     * 设置本组件的禁用状态，true表示禁用不能参与表单提交
	     * @name FCheckboxGroup#setDisabled
	     * @function
	     * @param state 传入true表示修改组件为禁用状态；传入false则恢复组件的状态；不传则不会修改状态
	     * @return Boolean
	     * @example
	     * 无
	     */
	    setDisabled : function(state) {
	    	return this.disabled(state);
	    },

	    /**
	     * 获取本组件的禁用状态，true表示禁用不能参与表单提交
	     * @name FCheckboxGroup#isDisabled
	     * @function
	     * @param state 传入true表示修改组件为禁用状态；传入false则恢复组件的状态；不传则不会修改状态
	     * @return Boolean
	     * @example
	     * 无
	     */
	    isDisabled : function() {
	    	return this.disabled();
	    },

	    readonly : function(state) {
	    	var boxEl = this._getBoxEl();
	    	if (arguments.length != 0) {
	    		state = (state===true);
	    		if (state) {
	    			boxEl.addClass("f-state-readonly");
	    		} else {
	    			boxEl.removeClass("f-state-readonly");
	    		}
	    		$(":checkbox[value],input[name]", this.boxEl).attr("readonly", state);
	    	}
	    	return boxEl.hasClass("f-state-readonly");
	    },

	    /**
	     * 设置本组件的只读状态，true表示组件不可通过鼠标点击来修改checkbox的选中状态
	     * @name FCheckboxGroup#readonly
	     * @function
	     * @param state 传入true表示修改组件为只读状态；传入false则恢复组件的状态；不传则不修改组件状态
	     * @return Boolean
	     * @example
	     * 无
	     */
	    setReadonly : function(state) {
	    	return this.readonly(state);
	    },

	    /**
	     * 获取本组件的只读状态，true表示组件不可通过鼠标点击来修改checkbox的选中状态
	     * @name FCheckboxGroup#readonly
	     * @function
	     * @param state 传入true表示修改组件为只读状态；传入false则恢复组件的状态；不传则不修改组件状态
	     * @return Boolean
	     * @example
	     * 无
	     */
	    isReadonly : function() {
	    	return this.readonly();
	    },
	    
	    /**
	     * 使用defaultValue来重置组件，如果没有设置defaultValue属性，则将所有的checkbox都置为非选中状态
	     * @name FCheckboxGroup#reset
	     * @function
	     * @example
	     * 无
	     */
	    reset : function() {
	    	var defaultValue = this.options.defaultValue || "";
	    	this.value(defaultValue);
	    },

	    /**
	     * 获取本表单的名字，对应表单域的key值
	     * @name FCheckboxGroup#name
	     * @function
	     * @return String
	     * @example
	     * 无
	     */
	    name : function(n) {
	    	var hidden = $("input[name]", this._getBoxEl());
	    	if (n || n=="") {
	    		hidden.attr("name", n);
	    	}
	    	return hidden.attr("name");
	    },
	    
	    _setValueByArray : function(array) {
	    	$(":checkbox[value]", this._getBoxEl()).each(function() {
	    		var self = $(this);
	    		var value = self.val();
	    		if ($.inArray(self.val(), array) >= 0) {
	    			self.attr("checked", true);
	    		} else {
	    			self.attr("checked", false);
	    		}
	    	});
			this._triggerValueChange();
	    },

	    /**
	     * 销毁组件
	     * @name FCheckboxGroup#destroy
	     * @function
	     * @return Object
	     * @example
	     * 无
	     */
	    destroy : function() {
	    	$(":checkbox[value]", this._getBoxEl()).unbind();
	    	this.options._objBox = null;
	    }
	});
})(jQuery);
