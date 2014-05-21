/*
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.NumberField
 * 作者：hanyin
 * 邮箱：hanyin@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：NumberField组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 20121231  hanyin		修复defaultValue属性说明，并增加reset方法
 * 20121231  hanyin		STORY #5636 [基金与机构理财事业部/白鑫][TS:201303290004][FUI] - 提供在numberField的值变化之后的回调方法
 * 20130415  hanyin		需求5736 ，增加方法getValue/setValue、setDisabled/isDisabled、setReadonly/isReadonly方法
 * 20130521  hanyin		需求5985，限定最大的有效位个数为15，如果超过则不允许输入
 */

/**
 * @name FNumberField
 * @class 
 * 数字输入框，用户需要一个只能输入数字（允许有小数点）的输入框组件。该组件禁止输入字符，且可以设置小数点的精度。
 */

/**@lends FNumberField# */

/**
 * 组件的唯一标识。
 * @name FNumberField#<ins>id</ins>
 * @type String
 * @default 随机生成
 * @example
 * 无
 */

(function($, undefined) {
	// focus事件时，将隐藏域的值拷贝到显示域中；blur事件，将显示域的值按照要求保存在隐藏域，显示域的内容为隐藏域格式化之后的值
	// 只能在输入框输入 数字，减号和点号"."，不允许输入字符等其他符号
    $.widget('FUI.FNumberField', {
        options: {
            /**
             * 设置小数点的最大位数。默认值为：2，即小数点最大位数是2。如果设置为0，则小数点也无法输入。
             * @name FNumberField#decimals
             * @type Number
             * @default 2
             * @example
             * 无
             */
            decimals : 2,
            /**
             * 是否以金额格式显示数字。默认值为：false，即不以金额形式显示数字，如果设置为true，则以金额格式显示数字，例如：1,111,111.00。
             * @name FNumberField#moneyFormat
             * @type Boolean
             * @default false
             * @example
             * 无
             */
            moneyFormat : false,
            /**
             * 设置组件的默认值
             * @name FNumberField#defaultValue
             * @type String/Number
             * @default ""
             * @example
             * 无
             */
            defaultValue : null,
            /**
             * 在输入值变化之后，焦点移开输入框，调用此方法
             * @name FNumberField#afterChange
             * @type String
             * @default null
             * @example
             * function afterChange(value, prevValue) {
             *     ("#console").append("[" + value + ":" + prevValue + "]<br>");
             * }
             * 
             * value：为当前的值；prevValue：为上次的值，如果上次为空，则为""。
             * 无
             */
            afterChange: null
        },
        
        MAX_LENGTH : 15,
        
        // 组件级别的创建，先关事件的绑定
        _create : function() {
        	var op = this.options;
        	op.id = this.element.attr("id");
            this._bindEvent();	// 绑定事件
        },
        
        _init : function() {
        	// 初始化处理
        	var op = this.options;
        	// 初始化参数
        	this.setDecimals(op.decimals);
        	var moneyFormat = op.moneyFormat;
        	if (moneyFormat == true || moneyFormat == "true") {
        		op.moneyFormat = true;
        	} else {
        		op.moneyFormat = false;
        	}
        	// 初始化默认值
        	if (op.defaultValue) {
        		this.reset();
        	}
        },
        
        // 获取显示域的el
        _getInputEl : function() {
        	var self = this;
        	var op = this.options;
        	if (!op._inputEl) {
        		op._inputEl = self.element.next();
        	}
        	return op._inputEl;
        },
        
        // 获取隐藏域的el
        _getHiddenEl : function() {
        	var self = this;
        	var op = this.options;
        	if (!op._hiddenEl) {
        		op._hiddenEl = self.element;
        	}
        	return op._hiddenEl;
        },
        
        // 对象销毁方法
        destroy : function() {
        	this.options._hiddenEl = null;
        	this.options._inputEl = null;
            $.Widget.prototype.destroy.call(this);
        },
        
        // 绑定事件
        _bindEvent : function() {
        	var self = this;
        	// 绑定显示域事件
            var inputEvent = self._getEvent('input');
            this._getInputEl().bind(inputEvent);
            
            // 绑定隐藏域事件
            var hiddenEl= self._getHiddenEl();
            hiddenEl.bind("onValueChanged", function(event, v) {
        		self._triggerValueChanged($(this).val());
            });
        },
        
        // 获取绑定的事件
        _getEvent : function(type) {
            var ME = this, options = ME.options, element = this.element;
            var self = this;
            var op = this.options;
            var inputEl = self._getInputEl();
            var hiddenEl = self._getHiddenEl();

        	var inputEvent = {
                keydown : function(e) {
                    var keyCode = e.keyCode;
                    // KeyCode (48~57)==(0~9) (96~105)==小键盘(0~9) (←↑→↓)=(37,38,39,40) (190,8)==(小数点,Backspace) 
                    if (48 <= keyCode && keyCode <= 57 // (0-9)
                    		|| 96 <= keyCode && keyCode <= 105 // 小键盘(0-9) 
                    		|| keyCode == 190 || keyCode == 110 // 小数点 .和小键盘小数点
                    		|| keyCode == 109 || keyCode == 189 // (减号和小键盘减号)
                    ) {
                    	if (keyCode == 190 || keyCode == 110) {
                    		if (op.decimals < 1) {// 如果允许输入的小数位为0，则不能输入小数点
                    			return false;
                    		} else {
                    			return true;
                    		}
                    	}
                    	var curValue = inputEl.val();
                    	var curLength = curValue.length + 1; // 当前值没有回显
                    	var maxLength = self.MAX_LENGTH;
                    	if (op.decimals >= 1) {
                        	if (curValue.lastIndexOf('.') >= 0) {
                        		curLength -= 1;
                        	} else {
                        		curLength += op.decimals; // 为输入的小数位数留余量
                        	}
                    	}
                    	if (curLength > maxLength) {
                    		return false;
                    	}
                    	return true;
                    } else if (keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40 // (←↑→↓)
                    		|| keyCode == 8 || keyCode == 46 // (Backspace, del)
                    		|| keyCode == 9 || keyCode == 13 || keyCode == 108 // (Tab, enter, 小键盘enter)
                   		) {
                    	return true;
                    }
                    return false;
                },
                focus : function(e) { // 将隐藏域的值拷贝到显示域中
                	self._getInputEl().val(self._getHiddenEl().val());
                },
                blur : function(e) { // 将显示域按照要求的格式拷贝到隐藏域，然后将显示域的值格式化
            			var prevValue = self._getHiddenEl().val();
                	self._getHiddenEl().val(self._getInputEl().val());
            			self._triggerValueChanged(prevValue);
                }
            };
            if (type == 'input') return inputEvent;
        },


        _num2num : function(s, n) { // 限定小数位数
        	n = n >= 0 && n <= 20 ? n : 2;
        	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n);
        	return s;
        },
        
        _num2money : function(s) {
        	s = (s + "").split(".");
        	var l = s[0].split("").reverse();
        	var r = s[1];
        	if (r) {
        		r = "."+r;
        	} else {
        		r= "";
        	}
        	var t = "";
        	for (var i = 0; i < l.length; i++) {
        		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length && l[(i + 1)] !="-" ? "," : "");
        	}
        	return t.split("").reverse().join("") + r;
        },
        
        _money2num : function(s) {
        	return parseFloat(s.replace(/[^\d\.-]/g, ""));
        },

        _triggerValueChanged : function(prevValue) { // 隐藏被修改，则更新显示域
        	var self = this;
        	var hiddenEl = self._getHiddenEl();
        	var inputEl = self._getInputEl();
        	var op = self.options;
        	var value = hiddenEl.val();
        	var realValue = self._num2num(value, op.decimals);
        	if (!isNaN(realValue)) {
        		if (realValue != value) { // 修正设置的值
        			hiddenEl.val(realValue);
        		}
        		if (true == op['moneyFormat']) {
            		var moneyValue = self._num2money(realValue);
            		inputEl.val(moneyValue);
        		} else {
        			inputEl.val(realValue);
        		}
        	} else { // 如果输入的不是合法的数字，则清空输入框
        		inputEl.val("");
        		hiddenEl.val("");
        	}
        	if ($.isFunction(op.afterChange)) {
        		var value = hiddenEl.val();
        		if (prevValue !== value) {
        			op.afterChange(value, prevValue);
        		}
        	}
        },

        /**
        * 设置表单的值
        * @function 
        * @name FNumberField#setValue
        * @example
        */
        setValue : function(v) {
        	var prevValue = this.element.val();
        	this.element.val(v);
        	this._triggerValueChanged(prevValue);
        	//this._getHiddenEl().FTextField("setValue", v);
        },

        /**
        * 获取表单的值
        * @function 
        * @name FNumberField#getValue
        * @example
        */
        getValue : function() {
        	return this._getHiddenEl().FTextField("getValue");
        },

        /**
        * 重置标签的值
        * @function 
        * @name FNumberField#reset
        * @example
        */
        reset : function() {
        	var v = this.options.defaultValue || "";
        	this.setValue(v);
        	//this._getHiddenEl().FTextField("setValue", v);
        },

	    /**
	     * 设置可用状态；表单处于不可用状态时，不可编辑，该表单域也不会参与表单的提交
	     * @name FNumberField#setDisabled
	     * @function
	     * @param state 如果传入true，则表示将组件置为不可用状态；如果传入false，则表示置为可用状态。
	     * @return 当前表单的可用状态，true表示表单不可用，false表示表单可用
	     * @example
	     */
	    setDisabled : function(state) {
	    	return this.element.FTextField("disabled", state);
	    },

	    /**
	     * 获取可用状态；表单处于不可用状态时，不可编辑，该表单域也不会参与表单的提交
	     * @name FNumberField#isDisabled
	     * @function
	     * @return 当前表单的可用状态，true表示表单不可用，false表示表单可用
	     * @example
	     */
	    isDisabled : function() {
	    	return this.element.FTextField("disabled");
	    },
	    
	    /**
	     * 设置可编辑状态；表单处于不可编辑状态时，输入框不可用，如果存在图标，图标可以点击。
	     * @name FNumberField#setReadonly
	     * @function
	     * @param state 如果传入true，则表示将组件置为不可编辑状态；如果传入false，则表示置为可编辑状态。
	     * @return 当前表单的可编辑状态，true表示表单输入框不可编辑，false表示表单可编辑。
	     * @example
	     */
	    setReadonly : function(state) {
            if(undefined === state){
                return false;
            }
            return this.element.FTextField("readonly", state);
	    },

	    /**
	     * 获取可编辑状态；表单处于不可编辑状态时，输入框不可用，如果存在图标，图标可以点击。
	     * @name FNumberField#isReadonly
	     * @function
	     * @return 当前表单的可编辑状态，true表示表单输入框不可编辑，false表示表单可编辑。
	     * @example
	     */
	    isReadonly : function() {
	    	return this.element.FTextField("readonly");
	    },
	    
         /**
         * 设置decimals属性的值，允许的小数位数。
         * @function 
         * @name FNumberField#setDecimals
         * @param number 类型："Number", 小数点的最大位数。
         * @example
         */
        setDecimals : function(decimals) {
        	var op = this.options;
        	op.decimals = decimals;
        	var decimals = parseInt(op.decimals);
        	if (isNaN(decimals) || decimals<0) {
        		decimals = 0;
        	}
        	op.decimals = decimals;
        }

    });
})(jQuery);
