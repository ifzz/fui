/*
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.FTargetSelect.js
 * 作者：hanyin
 * 邮箱：hanyin@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FTargetSelect组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 20130116  hanyin		按照新的form表单标准：增加方法setDisable、isDisable、getValue、setValue等
 */

/**
 * @name FTargetSelect
 * @class 
 * 回填输入框，不含有隐藏域的输入框，在默认情况下是只读的。此组件在FTextField组件的基础上绑定了按钮图标的点击事件。一般应用于点击按钮弹出一个FWin，
 * 然后将在FWin上操作的结果回填到输入框中。
 */

/**@lends FTargetSelect# */

/**
 * 标识(仅标签使用)
 * @name FTargetSelect#<ins>id</ins>
 * @type String
 * @default 随机生成
 * @example
 * 无
 */

/**
 * 表单组件的名字，用于表单提交是文本表单域的名字(仅标签使用)
 * @name FTargetSelect#<ins>name</ins>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 鼠标悬浮于输入框之上时，跟随鼠标弹出显示tip的文本(仅标签使用)
 * @name FTargetSelect#<ins>title</ins>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 设置在使用Tab键切换表单时的顺序，同一个表单中，tabIndex的值越大，顺序越靠后；如果tabIndex相同，DOM结构位于后面的顺序越靠后(仅标签使用)
 * @name FTargetSelect#<ins>tabIndex</ins>
 * @type String
 * @default 0
 * @example
 * 无
 */

/**
 * 表单域的初始可用状态，如果为true则表示不可用，也不会参与表单提交；否则可以正常使用(仅标签使用)
 * @name FTargetSelect#<ins>disabled</ins>
 * @type Boolean
 * @default false
 * @example
 * 无
 */

/**
 * 表单域的初始可编辑状态，如果为true则表示输入框不可用，如果存在图标，图标可以点击；否则可以正常使用(仅标签使用)
 * @name FTargetSelect#<ins>readonly</ins>
 * @type Boolean
 * @default false
 * @example
 * 无
 */

(function($) {
	$.registerWidgetEvent("onTriggerClick");
	$.widget("FUI.FTargetSelect", {
	    options : {
	    	/**
	    	 * 点击查询图标时触发。该事件在关联的公共窗体弹出之前触发，可用于输入框的校验，当该事件返回false或者不返回，则不执行公共窗体弹出。如果返回true，则弹出公共窗体。
	    	 * @event
	    	 * @name FTargetSelect#onTriggerClick
	    	 * @param id 本组件的ID
	    	 * @example
	    	 */
	    	onTriggerClick: null
	    },
	    _create : function() {
	    	this.options.id = this.element.attr("id");
	    },
	    _init : function() {
	    	this._bindEvent();
	    },
	    
	    _bindEvent : function() {
	    	var self = this;
	    	var id = self.options.id;
	    	var triggerEl = $("#"+id+"-trigger");
	    	triggerEl.click(function(e) {
	    		if ($I(id).FTextField("disabled") === true) {
	    			return;
	    		}
	    		//e.stopImmediatePropagation();
	    		var func = self._getTriggerFunc();
	    		if (func != null) {
	    			func.call(self, self.options.id);
	    		}
	    	});
	    },
	    
	    _getTriggerFunc : function() {
	    	var func = this.options.onTriggerClick;
	    	if ($Utils.isString(func)) {
	    		try {
	    			func = eval(func);
	    		} catch (e) {
	    			func = null;
				}
	    	}
    		if (!$.isFunction(func)){
    			func = null;
    		}
	    	return func;
	    },

	    /**
	     * 设置表单输入框的值，如果传入了参数则表示设置；该方法会始终返回当前表单输入框的值；如果存在隐藏域则访问隐藏域，否则效果同方法displayValue(v)。<br/>
	     * <span style="color:red">注意：</span>不建议绑定输入框的 change或者onChange事件，因为这些事件
	     * 在通过js修改输入框的value之后<b>不会触发</b>（很奇妙的是，在IE6/7/8上居然触发了），所以在这种情况下请绑定 onValueChanged事件。<br/>
	     * 另外在默认情况下，调用此方法对输入框赋值，会触发onValueChanged事件，可以通过传入force=true来关闭事件的触发。
	     * @name FTargetSelect#setValue
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
	     * @name FTargetSelect#getValue
	     * @function
	     * @return 当前表单域的值
	     * @example
	     */
	    getValue: function() {
	    	return this.element.FTextField("value");
	    },

	    /**
	     * 重置表单域的值为空，如果存在隐藏域，隐藏域也会被清空。但是不会去除表单域的校验信息，如果需要去除表单域的校验信息，请调用FForm的reset方法。
	     * @name FTargetSelect#reset
	     * @function
	     * @return void
	     * @example
	     */
	    reset : function() {
	    	return this.element.FTextField("reset");
	    },

	    /**
	     * 设置输入框的可用状态；表单处于不可用状态时，不可编辑，该表单域也不会参与表单的提交
	     * @name FTargetSelect#setDisabled
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
	     * @name FTargetSelect#isDisabled
	     * @function
	     * @return 当前表单的可用状态，true表示表单不可用，false表示表单可用
	     * @example
	     */
	    isDisabled : function() {
	    	return this.element.FTextField("disabled");
	    },
	    
	    /**
	     * 设置输入框的可编辑状态；表单处于不可编辑状态时，输入框不可用，如果存在图标，图标可以点击。
	     * @name FTargetSelect#setReadonly
	     * @function
	     * @param state 如果传入true，则表示将组件置为不可编辑状态；如果传入false，则表示置为可编辑状态。
	     * @return 当前表单的可编辑状态，true表示表单输入框不可编辑，false表示表单可编辑。
	     * @example
	     */
	    setReadonly : function(state) {
	    	return this.element.FTextField("readonly", state);
	    },

	    /**
	     * 获取输入框的可编辑状态；表单处于不可编辑状态时，输入框不可用，如果存在图标，图标可以点击。
	     * @name FTargetSelect#isReadonly
	     * @function
	     * @param state 如果传入true，则表示将组件置为不可编辑状态；如果传入false，则表示置为可编辑状态。
	     * @return 当前表单的可编辑状态，true表示表单输入框不可编辑，false表示表单可编辑。
	     * @example
	     */
	    isReadonly : function() {
	    	return this.element.FTextField("readonly");
	    },
	    
	    /**
	     * 设置鼠标点击trigger按钮是的处理方法
	     * @name FTargetSelect#setOnTriggerClick
	     * @function
	     * @example
	     */
	    setOnTriggerClick : function(func) {
	    	this.options.onTriggerClick = func;
	    },

	    /**
	     * 销毁组件
	     * @name FTargetSelect#destroy
	     * @function
	     * @example
	     */
	    destroy : function() {
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    }
	});
})(jQuery);

