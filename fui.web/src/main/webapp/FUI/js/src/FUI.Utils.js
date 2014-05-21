/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Utils.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：工具类函数。
 * 修改记录:
 * 修改日期        修改人员       修改说明
 * 20121016  hanyin    增加Map，模拟java中的map(随着内部元素的增加，所有方法的处理效率线性下降，所以请慎重使用)
 * 20121026  hanyin    增加FUI.Component工具类，不需要指定FUI组件名，直接调用组件方法
 * 20121122  hanyin    修改FUI.Component工具类，使其不再依赖于$.data中的ftype值，而是可以根据方法名自动找到匹配的组件
 * 20130110  qudc     修改transUrl方法中的正则表达式 urlRegex ，删除对ftp方式的匹配
 * 20130114  hanyin    修改getFType方法，加上isFunction()方法判断
 * 20130218  qudc      新增destroyIframe方法，用于处理ie下通过iframe方式加载页面导致的内存泄露问题。
 * 20130314  qudc      新增方法getViewportHeight、getViewportWidth
 * 20130314  qudc      新增方法getAlignXY，返回计算好的坐标，用于碰撞检测，返回格式为{top:100,left:200}
 */
;
(function($, undefined) {
    String.prototype.endWith = function(str) {
        if (str == null || str == "" || this.length == 0 || str.length > this.length) {
            return false;
        }
        return this.substring(this.length - str.length) == str;
    };
    String.prototype.startWith = function(str) {
        if (str == null || str == "" || this.length == 0 || str.length > this.length) {
            return false;
        }
        return this.substr(0, str.length) == str;
    };
    String.prototype.replaceAll = function(s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2);
    };
    $.fn.closeSelect = function() {
        if ($.browser.mozilla) {
            this.css('-moz-user-select', 'none');
        } else if ($.browser.webkit) {
            this.css('-webkit-user-select', 'none');
        } else {
            this.bind("selectstart.fuiSelect", function() {
                return false;
            });
        }
        return this;
    };
    $.fn.openSelect = function() {
        if ($.browser.mozilla) {
            this.css('-moz-user-select', 'auto');
        } else if ($.browser.webkit) {
            this.css('-webkit-user-select', 'auto');
        } else {
            this.unbind("selectstart.fuiSelect");
        }
        return this;
    };

	// 20121016 HYin 增加Map，模拟java中的map(随着内部元素的增加，所有方法的处理效率线性下降，所以请慎重使用)
	function IndexMap() {
		// data
		this.elements = new Array();

		//获取MAP元素个数
		this.size = function() {
			return this.elements.length;
		};

		//判断MAP是否为空
		this.isEmpty = function() {
			return (this.elements.length < 1);
		};

		//删除MAP所有元素
		this.clear = function() {
			this.elements = new Array();
		};

		// 销毁所有元素，此map实例将不可再被使用
		this.destroy = function() {
			this.elements = null;
		};

		//向MAP中增加元素（key, value) ，如果以前已经存在，则返回以前存在的值
		this.put = function(_key, _value) {
			var last = this.remove(_key); // 移除以前的
			this.elements.push({
			    key : _key,
			    value : _value
			});
			return last;
		};

		//向MAP中指定索引（从0开始）增加元素（key, value) ，请慎重使用，此方法不会检测key值重复
		this.insert = function(index, _key, _value) {
			this.elements.splice(index, 0, {
			    key : _key,
			    value : _value
			});
		};

		//删除指定KEY的元素，成功则返回以前的值，否则返回null
		this.remove = this.removeByKey = function(_key) {
			var value = null;
			var elements = this.elements;
			var length = this.elements.length;
			for (i = 0; i < length; i++) {
				if (elements[i].key == _key) {
					value = this.removeByIndex(i).value;
					break;
				}
			}
			return value;
		};

		// 删除指定索引的元素，如果成功则返回相应的键值对，否则返回null
		this.removeByIndex = function(_index) {
			if (_index < 0 || _index >= this.elements.length) {
				return null;
			}
			var result = this.elements[_index];
			this.elements.splice(_index, 1);
			return result;
		};

		//获取指定KEY的元素值VALUE，失败返回NULL
		this.get = this.getByKey = function(_key) {
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					return this.elements[i].value;
				}
			}
			return null;
		};

		//获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
		this.element = this.getByIndex = function(_index) {
			if (_index < 0 || _index >= this.elements.length) {
				return null;
			}
			return this.elements[_index];
		}

		//判断MAP中是否含有指定KEY的元素
		this.containsKey = function(_key) {
			var bln = false;
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].key == _key) {
					bln = true;
				}
			}
			return bln;
		}

		//判断MAP中是否含有指定VALUE的元素
		this.containsValue = function(_value) {
			var bln = false;
			for (i = 0; i < this.elements.length; i++) {
				if (this.elements[i].value == _value) {
					bln = true;
				}
			}
			return bln;
		}

		//获取MAP中所有VALUE的数组（ARRAY）
		this.values = function() {
			var arr = new Array();
			for (i = 0; i < this.elements.length; i++) {
				arr.push(this.elements[i].value);
			}
			return arr;
		};

		//获取MAP中所有KEY的数组（ARRAY）
		this.keys = function() {
			var arr = new Array();
			for (i = 0; i < this.elements.length; i++) {
				arr.push(this.elements[i].key);
			}
			return arr;
		};

		this.indexOf = function(_key) {
			var elements = this.elements;
			var length = this.elements.length;
			for (i = 0; i < length; i++) {
				if (this.elements[i].key == _key) {
					return i;
				}
			}
			return -1;
		}
	};

    var DOC = document;
    var isStrict = DOC.compatMode == "CSS1Compat";
    var FUI = {};
    FUI.Utils = {


        /**
         * 获取JRES服务返回值中数据列表,例如获取{dataSetResult：[data:[{"test1":1},{"test2":2}],returnCode:0,errorNo : "0",errorInfo : null ]}中的[{"test1":1},{"test2":2}]
         * @param result
         */
        getJRESList : function(result) {
            //如果传入的值为空，则返回null
            if (!result) {
                return null;
            }
            var data = result.data;
            if (!data) {
                return null;
            }
            return  data;
        },
        /**
         * 获取JRES服务返回值中数据对象，例如获取{dataSetResult：[data:[{"test1":1}],returnCode:0,errorNo : "0",errorInfo : null ]}中的{"test1":1}
         * @param result
         */
        getJRESObject : function(result) {
            //如果传入的值为空，则返回null
            if (!result) {
                return  null;
            }
            var data = result.data;
            if (!data) {
                return null;
            } else {
                if ($.isArray(data)) {
                    return data[0];
                } else {
                    return data;
                }
            }

        },
        $I : function(id) {
            return $("#" + id);
        },
        fetchNumber :function(s) {
            if (!s)  return s;
            var number = s.replace(/[^\d]/g, "");
            return number ? parseInt(number) : number;
        },
        //替换样式
        /**
         * 替换指定dom的样式
         * @param e  dom元素 或 dom的id
         * @param cls  css名称
         */
        replaceClass : function(e, cls) {
            this.getElement(e).className = cls;
        },
        /**
         * 给指定的dom添加样式
         * @param e   dom元素 或 dom的id
         * @param cls css名称
         */
        addClass:function(e, cls) {
            var o = this.getElement(e);
            if (!o) {
                return;
            }
            var cn = o.className;
            if (cn.indexOf(cls) !== -1)return;
            cn.length == 0 ? cn = cls : cn += (" " + cls);
            o.className = cn;
        },
        /**
         * 移除指定dom的样式
         * @param e   dom元素 或 dom的id
         * @param cls css名称
         */
        removeClass:function(e, cls) {
            var o = this.getElement(e);
            if (!o) {
                return;
            }
            var cn = o.className;
            if (cn.indexOf(cls) === -1)return;
            var cns = cn.split(" "),len = cns.length;
            for (var i = 0; i < len; i++) {
                if (cns[i] == cls) {
                    cns.splice(i, 1);
                    break;
                }
            }
            o.className = cns.join(" ");
        },
        getElement:function(e) {
            var o = undefined;
            switch (typeof e) {
                case "string" :o = document.getElementById(e);
                    break;
                default :o = e;
            }
            return o;
        },
        /**
         * 遮罩body
         * @param text  提示消息
         * @param options 例如{'text':'正在处理，请稍候！'}
         */
        doMask : function(text, options) {
            $('body').doMask(text, options);
        },
        /**
         * 取消body的遮罩
         */
        doUnMask : function() {
            $('body').doUnMask();
        },
        /**
         * json对象属性拷贝，将config对象所有的属性拷贝到obj对象中
         * @param obj
         * @param config
         * @param defaults
         */
        apply :function(obj, config, defaults) {
            if (defaults) {
                this.apply(obj, defaults);
            }
            if (obj && config && typeof config == 'object') {
                for (var p in config) {
                    obj[p] = config[p];
                }
            }
            return obj;

        },
        /**
         * json对象属性拷贝，config对象中的属性不会覆盖obj对象中的属性
         * @param obj
         * @param config
         */
        applyIf : function(obj, config) {
            if (obj && config && typeof config == 'object') {
                for (var p in config) {
                    if (obj[p] === null || obj[p] === undefined) {
                        obj[p] = config[p];
                    }
                }
            }
            return obj;
        },
        /**
         * 判断一下情况，valu值是否为null 、undefined、 数组是否为空、字符串是否为''
         * @param value
         */
        isEmpty : function(value) {
            return value === null || value === undefined
                    || ($.isArray(value) && value.length == 0)
                    || value === '';
        } ,
        stopPropagation:function(e) {
            if (e && e.stopPropagation) {
                //支持w3c的stopPropagation()方法
                e.stopPropagation();
            } else {
                //使用ie的方式取消冒泡
                window.event.cancelBubble = true;
            }
        },
        convert : function(value, type) {
            var result;
            if (this.isEmpty(type)) {
                return value;
            }
            type = type.toLowerCase();
            if (type == 'string') {
                return '' + value;
            } else if (type == 'number') {
                return parseInt(value, 10);

            } else if (type == 'boolean') {
                return !!type;
            } else if (type == 'float') {
                return parseFloat(value)
            } else {
                return value;
            }

        },
        getContextPath : function() {
            return window['FUIContextPath'];
        },

        _regExpPercentage : /^\d{1,3}(\.(\d)*)?%$/,
        // 判断一个字符串是否是百分数形式，比如"40%"、"32.5%"等则直接返回，否则返回null
        getPercentage : function(str) {
            var result = FUI.Utils._regExpPercentage.exec(str);
            if (result) {
                return result[0];
            } else {
                return null;
            }
        },
        _regExpPixelSize : /(^\d+(\.\d+)?)(px)?$/,
        getPixelSize : function(str) {
            var result = FUI.Utils._regExpPixelSize.exec(str);
            if (result) {
                return result[0];
            } else {
                return null;
            }
        },

        IndexMap : function() {
        	return new IndexMap();
        },

    	// 判断对象是否是数组
    	isArray : function(obj){
    		return (typeof obj=='object')&&obj.constructor==Array;
    	},

    	// 判断对象是否是字符串
    	isString : function(str){
    		return (typeof str=='string')&&str.constructor==String;
    	},

    	// 判断对象是否是数值
    	isNumber : function(obj) {
    		return (typeof obj=='number')&&obj.constructor==Number;
    	},

    	// 判断对象是否是日期对象
    	isDate : function(obj) {
    		return (typeof obj=='object')&&obj.constructor==Date;
    	},

    	// 判断传入对象是否是jquery对象
    	isJQueryObj : function(obj) {
    		return (typeof obj=='object')&&obj.constructor==jQuery;
    	},

        format : function(format){
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/\{(\d+)\}/g, function(m, i){
                return args[i];
            });
        },
        /** add by qudc  新增transUrl方法，用于转换url请求地址，根据url的格式自动加上文件上下文*/
        transUrl : function(url) {
            //正则判断是不是http开始。或www开始。
            var urlRegex = "^((https|http|ftp|rtsp|mms)?://)"
                    // 2013-01-10 start delete by qudc 删除ftp模式
                    //+ "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
                    // 2013-01-10 end delete by qudc
                    + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
                    + "|" // 允许IP和DOMAIN（域名）
                    + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
                    + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
                    + "[a-z]{2,6})" // first level domain- .com or .museum
                    + "(:[0-9]{1,4})?" // 端口- :80
                    + "((/?)|" // a slash isn't required if there is no file name
                    + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            var regex = new RegExp(urlRegex);
            if (regex.test(url)) {
                return url;
            } else if (url.indexOf("/") !== 0) {
                url = this.getContextPath() + "/" + url;
            }
            return url ;
        },
        /* end by qudc */

        // 生成唯一ID的基数
        UID : 0,
        genId : function(name) {
        	var ID = this.UID ++;
        	var suffix = "-webgen-" + ID;
        	if (name != null && name.length != 0) {
        		return (name + suffix);
        	} else {
        		return ("f-comp" + suffix);
        	}
        },
        // add by qudc 2013-02-18  新增iframe回收处理方法。
        destroyIframe : function(iframeId) {
            var ifm = document.getElementById(iframeId);
            if (ifm && ifm.contentWindow) {
            	try {
	                ifm.src = "about:blank";
	                ifm.contentWindow.document.write('');
	                ifm.contentWindow.close();
            	} catch (e) {
					// 如果出现错误，这里不处理
				}
                ifm.parentNode.removeChild(ifm);
                ifm = null;
            }
        },
        /**
         * 获取当前视窗的高度
         */
        getViewportHeight: function(){
	        return $.browser.msie ?
	        	   (isStrict ? DOC.documentElement.clientHeight : DOC.body.clientHeight) :
	        	   self.innerHeight;
        },
        /**
         * 获取当前视窗的宽度
         */
        getViewportWidth : function() {
            return !isStrict && !$.browser.opera ? DOC.body.clientWidth :
                    $.browser.msie ? DOC.documentElement.clientWidth : self.innerWidth;
        },
        /**
         * 返回计算好的坐标，用于碰撞检测，返回格式为{top:100,left:200}
         * @param targetEl
         * @param selfEl
         * @param listWidth
         * @param listHeight
         */
        getAlignXY : function(targetEl , selfEl,listWidth,listHeight){
            var UTILS =  window["$Utils"];
            var offset = targetEl.offset(),inputX = offset.left,inputY = offset.top,inputHeight = targetEl.outerHeight(),
                    lWidth = listWidth || selfEl.outerWidth(),
                    lHeight = listHeight || selfEl.outerHeight();

            var doc = document, docElement = doc.documentElement, docBody = doc.body;
            var scrollX = (docElement.scrollLeft || docBody.scrollLeft || 0) ,
                    scrollY = (docElement.scrollTop || docBody.scrollTop || 0);

            var viewHeight = UTILS.getViewportHeight() ;
            var viewWidth =  UTILS.getViewportWidth() ;
            var top = 0;
            var left = 0 ;

            // begin 20130424 hanyin 如果组件下方放置不下列表，则放到组件上方，如果上面也放不下，则还是放下面
            if (inputY + inputHeight + lHeight > viewHeight+scrollY) {
                top =  inputY - lHeight;
                if (top < 0) {
                	top = inputY +inputHeight;
                }
            } else {
                 top = inputY +inputHeight;
            }
            // end 20130424 hanyin

            if (inputX  + lWidth > viewWidth+scrollX) {
                left =   viewWidth+scrollX -lWidth;
            } else {
                 left = inputX ;
            }
            return {top:top,left:left};

        }
    };
    //{ 20121026 hanyin 增加FUI.Component工具类，不需要指定FUI组件名，直接调用组件方法
    FUI.Component = {
    	// 调用FUI组件的方法 call(jqueryObj, funcName [,arg1[,arg2[,arg3[...]]]])
    	// 如果jqueryObj为null或者不是FUI的组件，则调用此方法无效，如果funcName不是FUI组件方法，此方法也无效
    	call : function() {
    		if (arguments.length < 2) {
    			return;
    		}
    		var compEl = arguments[0];
    		var methodName = arguments[1];
    		var ftype = this.getFType(compEl, methodName);

    		var widget = compEl[ftype];
    		if ($.isFunction(widget)) {
    			return widget.apply(compEl, Array.prototype.slice.call(arguments, 1));
    		}
    	},

    	// 判断组件是否采用指定的ftype初始化过
    	hasFType : function(compEl, ftype) {
    		var cache = $.data(compEl.get(0)); // 从jquery的缓存中获取该对象绑定的对象缓存
    		if (cache && ftype && cache[ftype] ) {
    			return true;
    		} else {
    			return false;
    		}
    	},

    	// 从指定的jquery对象查找第一个拥有methodName的FUI对象的ftype，如果没有找到则返回空字符串""
    	getFType : function(compEl, methodName) {
    		if (!methodName || methodName.startWith("_")) {
    			return "";
    		}
    		var ftype = "";
    		var cache = $.data(compEl.get(0)); // 从jquery的缓存中获取该对象绑定的对象缓存
    		var lastFType = cache["ftype"];
    		if (cache && lastFType && $.isFunction((cache[lastFType] || {})[methodName])) {
    			return lastFType; // 最后一个就是满足要求的，就不要遍历了
    		}
    		if (cache) {
    			for (var typeName in cache) {
    				if ($.isFunction((cache[typeName] || {})[methodName])) {
    					ftype = typeName;
    					break; // 找到了含有指定方法的组件
    				}
    			}
    		}
    		return ftype;
    	},

    	// 根据jquery对象获取组件的名字，如果不是jquery对象或者没有FUI组件对象对应，都返回null
    	// !!!! 此方法被废弃，在有些情况下不能得到正确的name，请使用 getFType 替代
    	getName : function(compEl) {
    		if (FUI.Utils.isJQueryObj(compEl)) {
    			return (compEl.data("ftype") || null);
    		} else {
    			return null;
    		}
    	},

    	// 判断一个(jquery)对象是否是 FUI的组件对应的jquery对象
    	isFComponent : function(compEl) {
    		return (this.getName(compEl) != null);
    	},

    	// 判断一个(jquery)对象对应的FUI组件对象是否有指定的方法，如果存在并且方法名不以下划线"_"开头返回true，否则返回false
    	hasFunc : function(compEl, funcName) {
    		if (this.getFType(compEl, funcName)) {
    			return true;
    		}
    		return false;
    	},
    	// 尝试执行一次方法，集合其他的所有方法，避免由于多次getName造成性能问题；返回一个对象，具有下列属性：
    	// ① ftype: FUI组件的名字；
    	// ② hasFunc: FUI组件是否包含传入的函数名，
    	// ③ result: 如果方法可以被执行，则存储方法执行的结果。
    	tryCall : function(compEl, funcName) {
    		var result = {};
    		result.ftype = this.getFType(compEl, funcName);
    		result.hasFunc = false;
    		result.result = null;

    		if (result.ftype) {
				result.hasFunc = true;
    			result.result = compEl[result.ftype].apply(compEl, Array.prototype.slice.call(arguments, 1));
    		}
    		return result;
    	}
    };
    //} 20121026 hanyin

    window["$I"] = FUI.Utils.$I;
    window["$Utils"] = FUI.Utils;
    window["$Component"] = FUI.Component;

})(jQuery);
