﻿/*
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Form.js
 * 作者：hanyin
 * 邮箱：hanyin@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FForm组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 20121231  hanyin		增加jsdoc说明，Form表单支持的表单组件的范围
 */

/**
 * @name FForm
 * @class 
 * 表单，业务数据表单输入时，作为容器，为其中的表单控件提供统一的数据提交、绑定、验证等操作。更重要的<br/>
 * 一点是把可以把普通的form转成支持AJAX提交。本组件监听表单的submit事件，<br/>
 * 覆盖传统的submit事件监听器，而使用ajax方式来处理submit事件。在表单提交之前，本组件会收集<br/>
 * 所有的表单字段，并将之序列化后附加在ajax请求的数据域(data)中。支持所有标准的html可提交的<br/>
 * 表单元素。
 */

/**@lends FForm# */





(function($) {
	$.registerWidgetEvent("onShow,onHide");
	$.widget("FUI.FForm", {
	    options : {
	    	/**
	    	 * 标识(仅标签使用)
	    	 * @name FForm#<ins>id</ins>
	    	 * @type String
	    	 * @default 随机生成
	    	 * @example
	    	 * 无
	    	 */
	    	id : null,

	    	/**
	    	 * 设置控件是否使用回车键来切换输入类子控件的焦点。如果该属性为true，那么按回车时焦点会根据控件的tabIndex属性值从小到大进行依次切换。<br/>
	    	 * 开启此功能对性能会有影响：一方面由于表单元素增加造成要绑定的事件增加，造成组件初始化的时间线性增加；
	    	 * 另一方面随着表单个数的增加，按照tabIndex实时建立的列表长度性能直线增加；经过测试，在低配的机器IE6下，表单元素超过100个的时候会出现顿卡的情况。<br/>
	    	 * 大表单不建议开启此功能。
	    	 * @name FForm#<ins>enterSwitch</ins>
	    	 * @type Boolean
	    	 * @default false
	    	 * @example
	    	 * 无
	    	 */
	    	enterSwitch : true,

	        /**
	         * ajax提交中的附加数据，以JSON的形式组成(key/value) <br/>
	         * @type JSON
	         * @name FForm#params
	         * @default {}
	         * @example
	         * params: { key1: 'value1', key2: 'value2' }
	         */
	    	params : {},

	    	/**
	         * 表单提交的url。
	         * @name FForm#<ins>action</ins>
	         * @type String
	         * @default ""
	         * @example
	         */
	    	action: "",

	    	/**
	         * 在表单提交前被调用，该函数提供了一个时机来执行预提交的逻辑，或者可以用来进行校验表单元素，带事件返回false，会中止表单提交。
	         * @name FForm#beforeSubmit
	         * @param data 此次ajax请求的参数
	         * @param jqXHR jquery的XMLHttpRequest对象
	         * @param settings ajax请求的配置
	         * @event
	         * @return 返回false，会中止表单的提交
	         * @default 无
	         * @example
	         */
	    	beforeSubmit : undefined,

	        /**
	         * 当表单提交成功并取到响应时，并获得正确数据时（returnCode为0），执行的回调函数。
	         * @name FForm#onSuccess
	         * @param data 响应的数据
	         * @param textStatus HTTP的状态
	         * @param jqXHR jquery的XMLHttpRequest对象
	         * @event
	         * @default 无
	         * @example
	         * //定义一个函数
	         * function showResponse(data, textStatus, jqXHR) {
	         *  alert('submit success!');
	         * }
	         * //提交成功取到响应时的回调函数
	         * $('#formId').FForm({onSuccess: showResponse});
	         */
	    	onSuccess : undefined,

	        /**
	         * 服务端返回错误应答包的情况下会触发此事件，即返回的returnCode!=0的情况。
	         * 但是此时Ajax请求是正常的，错误出现在中间件或者业务逻辑上的错误，常见于业务错误，或者cep的超时异常等。
	         * @name FForm#onFailure
	         * @param data 响应的数据
	         * @param textStatus HTTP的状态
	         * @param jqXHR jquery的XMLHttpRequest对象
	         * @event
	         * @default 无
	         * @example
	         * //定义一个函数
	         * function showResponse(data, textStatus, jqXHR) {
	         *  alert('submit failure!');
	         * }
	         * //提交成功取到响应时的回调函数
	         * $('#formId').FForm({onFailure: showResponse});
	         */
	    	onFailure : undefined,

	    	/**
	         * 表单提交失败，常见于ajax请求超时（不是服务端业务超时）、请求的url无效、服务器已经停止等。
	         * @name FForm#onError
	         * @param jqXHR jquery的XMLHttpRequest对象
	         * @param textStatus HTTP状态码，比如404,500等
	         * @param errorThrown 如果底层抛出了异常
	         * @event
	         * @default 无
	         * @example
	         * //定义一个函数
	         * function showResponse(jqXHR, textStatus, errorThrown) {
	         *  alert('submit error!');
	         * }
	         * //提交成功取到响应时的回调函数
	         * $('#formId').FForm({onError: showResponse});
	         */
	    	onError : undefined ,
            /**
             * 上传文件的类型，默认值为 memory ， 将文件上传至内存。 如果该值为tempFile，则上传到指定的路径。
             * @name FForm#uploadType
             * @type String
             * @default memory
             * @example
             * 无
             */
            uploadType:'memory',
            /**
             * 是否包含文件上传组件
             * @name FForm#isUpload
             * @type Boolean
             * @default false
             * @example
             * 无
             */
            isUpload :false,
            /**
	         * 当文件上传组件提交后执行的回调函数。用户根据返回值中的returnCode的值来处理相应的业务逻辑。
	         * @name FForm#onFileUploadEvent
	         * @param result 响应的数据 ，包括 returnCode，errorNo，errorInfo
	         * @event
	         * @default 无
	         * @example
	         * //定义一个函数
	         * function fileUploadEvent(result) {
             *  if(result.returnCode == 0){
             *      alert('upload success!');
             *  }
	         *
	         * }
	         * //上传回调函数
	         * $('#formId').FForm({"onFileUploadEvent": fileUploadEvent});
	         */
            onFileUploadEvent:null
	    },

	    _create : function() {
	    	this.options.id = this.element.attr("id");
	    },

	    _init : function() {
	    	var self = this;
	    	var selfEl = self.element;
	    	var op = this.options;
	    	if (op.enterSwitch === "true" || op.enterSwitch === true) {
	    		// 如果组件上还没有绑定过 FEnterSwitch组件，则绑定FEnterSwitch组件
	    		if (!$Component.hasFType(this.element, "FEnterSwitch")) {
	    			self.element.FEnterSwitch({});
	    		}
	    	}
	    	selfEl.submit(function(e) {
	    		e.preventDefault();
	    		// self.submit();
	    		return false;
	    	});
            if(op.isUpload){
                selfEl.attr('method','post');
                selfEl.attr('enctype','multipart/form-data')
            }
	    	/*
	    	$(":reset", selfEl).click(function(e) {
	    		e.preventDefault();
	    		self.reset();
	    		return false;
	    	});
	    	*/
	    },

	    /**
	     * ajax请求的附加参数
	     * @name FForm#setParams
	     * @function
	     * @param params 附加的请求参数 对象
	     * @example
	     * $I('form').FForm("setParams", {userId:"0102334"});
	     */
	    setParams : function(params) {
	    	this.options.params = params || {};
	    },

	    /**
	     * ajax请求的附加参数
	     * @name FForm#getParams
	     * @function
	     * @return 附加的请求参数，如果不存在则返回一个空对象
	     * @example
	     * $I('form').FForm("getParams");
	     */
	    getParams : function() {
	    	return (this.options.params || {});
	    },

	    /**
	     * 设置ajax请求配置项。在一般情况下不需要设置此值，除非默认的选项已经不能满足要求。ajax请求配置项请将FAjax组件。
	     * @name FForm#setSubmitOpts
	     * @function
	     * @param opts 请求配置项，详细选项请见
	     * @example
	     * $I('form').FForm("setSubmitOpts", {type:"post"});
	     */
	    setSubmitOpts : function(opts) {
	    	this.options.submitOpts = opts;
	    },

	    /**
	     * 获取当前表单ajax请求配置项
	     * @name FForm#getSubmitOpts
	     * @function
	     * @return 请求配置项
	     * @example
	     * $I('form').FForm("getSubmitOpts");
	     */
	    getSubmitOpts : function() {
	    	return (this.options.submitOpts || {});
	    },

	    /**
	     * 设置请求的url
	     * @name FForm#setAction
	     * @function
	     * @exampled
	     * $I('form').FForm("setAction", "com.hundsun.jres.manage.service");
	     */
	    setAction : function(action) {
	    	this.options.action = action;
	    	this.element.attr("action", action);
	    },

	    getValue : function(name) {
	    	var el = $("[name='" + name +"']:input", this.element);
    		if (el.attr("disabled")) { // NO! [name]:enabled
    			return "";
    		}
	    	return this._getValue(el);
	    },

	    setValue : function(name, value) {
	    	var el = $("[name='" + name +"']:input", this.element);
    		if (el.attr("disabled")) { // NO! [name]:enabled
    			return "";
    		}
	    	return this._setValue(el, value);
	    },

	    /**
	     * 获取Form内有name属性且非disabled状态表单域，以对象的形式返回。 <br/>
	     * 对同名域的处理：
	     * <pre>
	     * ① 如果是radio的话，则在同名表单域中选取被选中的radio对应的value，比如
	     * &lt;input type="radio" name="sex" value="1"&gt;
	     * &lt;input type="radio" name="sex" value="2"&gt;
	     * &lt;input type="radio" name="sex" value="3"&gt;
	     * 如果value=2的radio被选中，那么最后生成的表单域为 sex:"2"，其他几个radio会被忽略
	     *
	     * ② 非radio表单域，两个及两个以上的同名表单组装为数组，比如
	     * &lt;input type="text" name="favor" value="2"&gt;
	     * &lt;input type="text" name="favor" value="3"&gt;
	     * &lt;input type="checkbox" name="favor" value="4"&gt;
	     * 如上所示，最后生成的表单域为 favor:["2", "3", "4"]，被表示为数组。
	     *
	     * 需要特别说明的是：原生的checkbox，如果没有被勾选，则也不会参与表单提交，
	     * 比如三个原生的checkbox，name分别为name1,name2,name2，值分别为1,2,3：
	     * a. 第一个被勾选，那么getValues返回{name1:"1"}
	     * b. 第一个第二个被勾选，返回 {name1:"1",name2:"2"}
	     * c. 都被勾选，那么返回 {name1:"1", name2:["2","3"]}
	     * d. 都不勾选，那么返回 {}，即都不参与表单提交。
	     * </pre>
	     * @name FForm#getValues
	     * @function
	     * @example
	     * $I('form').FForm("getValues");
	     */
	    getValues : function() {
	    	var self = this;
	    	var values = {};
	    	$("[name]:input", this.element).each(function() {
	    		var el = $(this);
	    		if (el.attr("disabled")) { // NO! [name]:enabled
	    			return;
	    		}
	    		var name = el.attr("name");
	    		var value = self._getValue(el);
	    		if (name && (value || value=="")) {
		    		// 处理单选框
		    		if (el.is(":radio,:checkbox")) {
		    			if (!el.is(":checked")) {
		    				return; // 没有被选中则忽略，浏览器会保证同名的radio只会有一个被选中
		    			}
		    		}
	    			var preValue = values[name];
	    			if (preValue || preValue =="") { // 如果传入的值非空
	    				if ($.isArray(preValue)) { // 如果已经是数组了则直接在后面追加
	    					preValue.push(value);
	    				} else { // 否则构造一个新的数组
	    					var array = [preValue, value];
	    					values[name] = array;
	    				}
	    			} else {
	    				values[name] = value;
	    			}
	    		}
	    	});
	    	return values;
	    },

	    /**
	     * 设置Form内有name属性且非disabled状态表单域，
	     * 假设传入的对象为 {key1:"value1", key2:"value2"}，那么此操作会设置name为key1和key2的表单域分别为value1和value2，
	     * 其他的表单域不会被修改。如果需要清空所有的表单域，请先调用 reset 方法来重置所有的表单域。
	     * <b>对同名域的处理</b>：
	     * <pre>
	     * ① 如果是radio的话，则在同名表单域中选取被选中的radio对应的value，比如
	     * &lt;input type="radio" name="sex" value="1"&gt;
	     * &lt;input type="radio" name="sex" value="2"&gt;
	     * &lt;input type="radio" name="sex" value="3"&gt;
	     * 如果value=2的radio被选中，那么最后生成的表单域为 sex:"2"，其他几个radio会被忽略
	     *
	     * ② 非radio表单域，两个及两个以上的同名表单组装为数组，比如
	     * &lt;input type="text" name="favor" value="2"&gt;
	     * &lt;input type="text" name="favor" value="3"&gt;
	     * &lt;input type="checkbox" name="favor" value="4"&gt;
	     * 如上所示，最后生成的表单域为 favor:["2", "3", "4"]，被表示为数组。
	     * </pre>
	     * @name FForm#setValues
	     * @param values 表单域值对象
	     * @function
	     * @example
	     * $I('form').FForm("setValues", {key:"value1", key2:"value2"});
	     */
	    setValues : function(values) {
	    	var self = this;
	    	$("[name]:input", this.element).each(function() {
	    		var el = $(this);
	    		if (el.attr("disabled")) { // NO! [name]:enabled
	    			return;
	    		}
	    		var name = el.attr("name");
	    		var value = values[name];
	    		if ($.isArray(value)) {
	    			if (value.length > 0) {
	    				value = value.shift();
	    			} else {
	    				values[name] = undefined;
	    				value = "";
	    			}
	    		}
	    		if (value || value=="") {
	    			if (el.is(":radio,:checkbox")) {
	    	    		var myValue = self._getValue(el);
	    	    		if (myValue == value) {
	    	    			el.attr("checked", true);
	    	    		} else {
	    	    			el.attr("checked", false);
	    	    		}
	    	    		return;
	    			}
	    			self._setValue(el, value);
	    		}
	    	});
	    },

	    _isFFormItem : function(el) {
	    	// 如果有value或者getValue/setValue方法则认为是满足FUI表单要求的组件
	    	if ($Component.getFType(el, "value")
	    			|| ($Component.getFType(el, "getValue") && $Component.getFType(el, "setValue"))) {
	    		return true;
	    	}
	    	return false;
	    },

	    /**
	     * 尝试调用所有表单域的reset方法，如果没有相应的方法，则只是简单的将表单域置为""
	     * @name FForm#reset
	     * @function
	     * @example
	     * $I('form').FForm("reset");
	     */
	    reset : function() {
	    	var self = this;
	    	$("[name]:input", this.element).each(function() {
	    		var el = $(this);
	    		if (el.attr("disabled")) { // NO! [name]:enabled
	    			return;
	    		}
	    		self._resetValue(el);
	    	});
	    },

	    _resetValue : function(el) {
	    	// 如果是FUI的表单组件，则尝试调用它的reset方法，有些组件会设置组件默认值
	    	var result = $Component.tryCall(el, "reset");
	    	if (result.hasFunc) {
	    		return result.result;
	    	}
	    	// 不是FUI的组件，则识别出 input、textarea和select标签
	    	// input：直接输入输入框的内容
	    	// textarea：直接获取标签体内容，忽略value属性
	    	// select：如果选中的选项有value属性则为value属性的值，否则为相应option的标签体内容
	    	return el.val("");
	    },

	    _getValue : function(el) {
	    	// 如果是FUI的表单组件，则尝试调用它的value方法
	    	var result = $Component.tryCall(el, "value");
	    	if (result.hasFunc) {
	    		return result.result;
	    	}
	    	// 如果是FUI的表单组件，则尝试调用它的getValue方法
	    	result = $Component.tryCall(el, "getValue");
	    	if (result.hasFunc) {
	    		return result.result;
	    	}
	    	// 不是FUI的组件，则识别出 input、textarea和select标签分别获取value值
	    	// input：直接输入输入框的内容
	    	// textarea：直接获取标签体内容，忽略value属性
	    	// select：如果选中的选项有value属性则为value属性的值，否则为相应option的标签体内容
	    	return el.val();
	    },

	    _setValue : function(el, value) {
	    	// 如果是FUI的表单组件，则尝试调用它的value方法
	    	var result = $Component.tryCall(el, "value", value);
	    	if (result.hasFunc) {
	    		return result.result;
	    	}
	    	// 如果是FUI的表单组件，则尝试调用它的getValue方法
	    	result = $Component.tryCall(el, "setValue", value);
	    	if (result.hasFunc) {
	    		return result.result;
	    	}
	    	// 不是FUI的组件，则识别出 input、textarea和select标签分别获取value值
	    	// input：直接设置输入框的内容
	    	// textarea：直接设置标签体内容，忽略value属性
	    	// select：如果选中的选项有value属性则为value属性的值，否则为相应option的标签体内容
	    	return el.val(value);
	    },

	    /**
	     * form提交
	     * @name FForm#submit
	     * @param params 附加的数据，以json对象表示
	     * @param options ajax请求的选项，除了success、error、beforeSend等属性外，都延用了FUI的FAjax组件，更详细的内容请见
	     * <a href='./FAjax.html' target='_blank'>FAjax组件</a>
	     * @function
	     * @example
	     * $F('form').FForm("submit");
	     */
	    submit : function(params, options) {
	    	var self = this;
	    	var op = this.options;
	    	var iAsyn = true;
	    	var specialParams = params || op.params;
	    	var data = op.params || {};
	    	data = $.extend({}, self.getValues(), (specialParams || {}));
	    	var action = op.action || self.element.attr("action");
	    	var ajaxOpts = $.extend({},
    			{
    	            url : action,	// 要访问的url
    	            data : data,		// 请求参数
    				success : function(data, textStatus, jqXHR) {
    					var func = op.onSuccess;
    					if (func && !$.isFunction(func)) {
    						func = self._parseFunc(func);
    						if (func) {
        						op.onSuccess = func;
    						}
    					}
    					if (func) {
    						return func.call(self, data, textStatus, jqXHR);
    					}
    				},
    				failure : function(data, textStatus, jqXHR) {
    					var func = op.onFailure;
    					if (!$.isFunction(func)) {
    						func = self._parseFunc(func);
    						if (func) {
        						op.onFailure = func;
    						}
    					}
    					if (func) {
    						return func.call(self, data, textStatus, jqXHR);
    					}
    				},
    				error : function(jqXHR, textStatus, errorThrown) {
    					var func = op.onError;
    					if (!$.isFunction(func)) {
    						func = self._parseFunc(func);
    						if (func) {
        						op.onError = func;
    						}
    					}
    					if (func) {
    						return func.call(self, jqXHR, textStatus, errorThrown);
    					}
    				},
    				beforeSend : function(jqXHR, settings) {
    					var func = op.beforeSubmit;
    					if (!$.isFunction(func)) {
    						func = self._parseFunc(func);
    						if (func) {
        						op.beforeSubmit = func;
    						}
    					}
    					if (func) {
    						return func.call(self, data, jqXHR, settings);
    					}
    				}
    	    	},
    	    	(op.submitOpts || options || {})
	    	);
	    	$.FUI.FAjax.remote(ajaxOpts);
	    },

	    _parseFunc : function(func) {
	    	var f = null;
	    	if ($Utils.isString(func)) {
	    		try {
	    			f = eval(func);
	    		} catch (e) {
	    			f = null;
				}
	    	}
	    	if ($.isFunction(f)) {
	    		return f;
	    	} else {
	    		return null;
	    	}
	    },

	    /**
	     * 销毁组件
	     * @name FForm#destroy
	     * @function
	     * @example
	     */
	    destroy : function() {
		    var op = this.options;
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    },

        //
        /**
	     * 上传文件提交
	     * @name FForm#doFileUpload
	     * @param params 附加的数据，以json对象表示
	     * @function
	     * @example
	     * $F('form').FForm("doFileUpload",{"key":"value"});
	     */
        doFileUpload : function(params){
            var options = this.options ,UTILS = window['$Utils'];
            //准备参数，文件上次类型：memory 或者 tempFile
            var p  = $.extend({},params);
            p.uploadType =options.uploadType ;
            p.isFileUpload = true ;
            var action =  options.action ;
            if(action.indexOf("/") !== 0){
                options.action = UTILS.getContextPath() + "/" + action;
                this.element.attr('action',options.action);
            }
            //将请求参数转换成对应的隐藏域输入框
            this._appendDomParams(p);
            //提交
            this.element.get(0).submit();

        },
        _appendDomParams : function(params){
            var html = [],options=this.options;
            var iframeHtml = [];
            var id =this.options.id
            var iframeId = id +'-iframe';
            var pId =  id +'-params';

            //修改组件的target
            this.element.attr('target',iframeId);


            var  result = {};
            var onSuccess = options.onSuccess;
            var onFailure = options.onFailure ;
            var onFileUploadEvent = options.onFileUploadEvent;
            iframeHtml.push('<iframe id="'+iframeId+'" name="'+iframeId+'" style="display:none;" src="javascript:false" ></iframe>')
            $('body').append(iframeHtml.join(''));


            var iframeOnload =  function(){
                //解除iframe组件的事件绑定
                var iframe =  document.getElementById(iframeId);
                var iframeEl =  $(iframe);

                try{
                    doc = iframe.contentWindow.document || iframe.contentDocument || WINDOW.frames[id].document;
                    if(doc){
                        if(doc.body){
                            if(/textarea/i.test((firstChild = doc.body.firstChild || {}).tagName)){ // json response wrapped in textarea
                                result = firstChild.value;
                            } else {
                                result = doc.body.innerHTML;
                            }
                        }
                    }
                }catch(e) {}
                result =  eval("(" + result + ")");
                //触发form的上传事件
                onFileUploadEvent && onFileUploadEvent(result);

                //移除iframe组件
                iframeEl.unbind();
                setTimeout(function(){
                    iframeEl.remove();
                }, 100);
                //移除添加的隐藏参数
                $I(pId).remove();
            };
            var iframe =  document.getElementById(iframeId);
            if (iframe.attachEvent){
                //ie下添加事件
                iframe.attachEvent("onload", function(){
                    iframeOnload();
                });
            } else {
                iframe.onload = function(){
                    iframeOnload();
                };
            }

            html.push('<div id="'+pId+'" style="display:none">');
            for(var p in params ){
                html.push('<input type="hidden" name="'+p+'" value="'+params[p]+'">');
            }
            html.push('</div>');
            this.element.append(html.join(''));
        }

	});
})(jQuery);
