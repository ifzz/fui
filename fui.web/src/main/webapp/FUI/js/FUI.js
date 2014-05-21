(function($, undefined) {

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
    $.FUI = $.FUI || {};
    if ($.FUI.version) {
        return;
    }
    $.extend($.FUI, {
        version: "FVersion@1.0.9-SNAPSHOT",

        keyCode: {
            ALT: 18,
            BACKSPACE: 8,
            CAPS_LOCK: 20,
            COMMA: 188,
            COMMAND: 91,
            COMMAND_LEFT: 91, // COMMAND
            COMMAND_RIGHT: 93,
            CONTROL: 17,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            INSERT: 45,
            LEFT: 37,
            MENU: 93, // COMMAND_RIGHT
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SHIFT: 16,
            SPACE: 32,
            TAB: 9,
            UP: 38,
            WINDOWS: 91 // COMMAND
        }
    });

// plugins
    $.fn.extend({
        propAttr: $.fn.prop || $.fn.attr,

        _focus: $.fn.focus,
        focus: function(delay, fn) {
            return typeof delay === "number" ?
                    this.each(function() {
                        var elem = this;
                        setTimeout(function() {
                            $(elem).focus();
                            if (fn) {
                                fn.call(elem);
                            }
                        }, delay);
                    }) :
                    this._focus.apply(this, arguments);
        },

        scrollParent: function() {
            var scrollParent;
            if (($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
                scrollParent = this.parents().filter(
                        function() {
                            return (/(relative|absolute|fixed)/).test($.curCSS(this, 'position', 1)) && (/(auto|scroll)/).test($.curCSS(this, 'overflow', 1) + $.curCSS(this, 'overflow-y', 1) + $.curCSS(this, 'overflow-x', 1));
                        }).eq(0);
            } else {
                scrollParent = this.parents().filter(
                        function() {
                            return (/(auto|scroll)/).test($.curCSS(this, 'overflow', 1) + $.curCSS(this, 'overflow-y', 1) + $.curCSS(this, 'overflow-x', 1));
                        }).eq(0);
            }

            return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
        },

        zIndex: function(zIndex) {
            if (zIndex !== undefined) {
                return this.css("zIndex", zIndex);
            }

            if (this.length) {
                var elem = $(this[ 0 ]), position, value;
                while (elem.length && elem[ 0 ] !== document) {
                    // Ignore z-index if position is set to a value where z-index is ignored by the browser
                    // This makes behavior of this function consistent across browsers
                    // WebKit always returns auto if the element is positioned
                    position = elem.css("position");
                    if (position === "absolute" || position === "relative" || position === "fixed") {
                        // IE returns 0 when zIndex is not specified
                        // other browsers return a string
                        // we ignore the case of nested elements with an explicit value of 0
                        // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
                        value = parseInt(elem.css("zIndex"), 10);
                        if (!isNaN(value) && value !== 0) {
                            return value;
                        }
                    }
                    elem = elem.parent();
                }
            }

            return 0;
        },

        disableSelection: function() {
            return this.bind(( $.support.selectstart ? "selectstart" : "mousedown" ) +
                    ".ui-disableSelection", function(event) {
                event.preventDefault();
            });
        },

        enableSelection: function() {
            return this.unbind(".ui-disableSelection");
        }
    });

    $.each([ "Width", "Height" ], function(i, name) {
        var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
                type = name.toLowerCase(),
                orig = {
                    innerWidth: $.fn.innerWidth,
                    innerHeight: $.fn.innerHeight,
                    outerWidth: $.fn.outerWidth,
                    outerHeight: $.fn.outerHeight
                };

        function reduce(elem, size, border, margin) {
            $.each(side, function() {
                size -= parseFloat($.curCSS(elem, "padding" + this, true)) || 0;
                if (border) {
                    size -= parseFloat($.curCSS(elem, "border" + this + "Width", true)) || 0;
                }
                if (margin) {
                    size -= parseFloat($.curCSS(elem, "margin" + this, true)) || 0;
                }
            });
            return size;
        }

        $.fn[ "inner" + name ] = function(size) {
            if (size === undefined) {
                return orig[ "inner" + name ].call(this);
            }

            return this.each(function() {
                $(this).css(type, reduce(this, size) + "px");
            });
        };

        $.fn[ "outer" + name] = function(size, margin) {
            if (typeof size !== "number") {
                return orig[ "outer" + name ].call(this, size);
            }

            return this.each(function() {
                $(this).css(type, reduce(this, size, true, margin) + "px");
            });
        };
    });
            $.registerWidgetEvent = function(type, special) {
                var types = type.split(",");
                if (types) {
                    for (var i = 0; i < types.length; i++) {
                        if (!$.event.special[type]) {
                            if (!special) {
                                $.event.special[types[i]] = {
                                    setup:function() {
                                        return true;
                                    }
                                };
                            } else {
                                $.event.special[types[i]] = special;
                            }
                        }
                        ;
                    }
                }
            };

// selectors
    function focusable(element, isTabIndexNotNaN) {
        var nodeName = element.nodeName.toLowerCase();
        if ("area" === nodeName) {
            var map = element.parentNode,
                    mapName = map.name,
                    img;
            if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
                return false;
            }
            img = $("img[usemap=#" + mapName + "]")[0];
            return !!img && visible(img);
        }
        return ( /input|select|textarea|button|object/.test(nodeName)
                ? !element.disabled
                : "a" == nodeName
                ? element.href || isTabIndexNotNaN
                : isTabIndexNotNaN)
            // the element and all of its ancestors must be visible
                && visible(element);
    }

    function visible(element) {
        return !$(element).parents().andSelf().filter(
                function() {
                    return $.curCSS(this, "visibility") === "hidden" ||
                            $.expr.filters.hidden(this);
                }).length;
    }

    $.extend($.expr[ ":" ], {
        data: function(elem, i, match) {
            return !!$.data(elem, match[ 3 ]);
        },

        focusable: function(element) {
            return focusable(element, !isNaN($.attr(element, "tabindex")));
        },

        tabbable: function(element) {
            var tabIndex = $.attr(element, "tabindex"),
                    isTabIndexNaN = isNaN(tabIndex);
            return ( isTabIndexNaN || tabIndex >= 0 ) && focusable(element, !isTabIndexNaN);
        }
    });

// support
    $(function() {
        var body = document.body,
                div = body.appendChild(div = document.createElement("div"));

        // access offsetHeight before setting the style to prevent a layout bug
        // in IE 9 which causes the elemnt to continue to take up space even
        // after it is removed from the DOM (#8026)
        div.offsetHeight;

        $.extend(div.style, {
            minHeight: "100px",
            height: "auto",
            padding: 0,
            borderWidth: 0
        });

        $.support.minHeight = div.offsetHeight === 100;
        $.support.selectstart = "onselectstart" in div;

        // set display to none to avoid a layout bug in IE
        // http://dev.jquery.com/ticket/4014
        body.removeChild(div).style.display = "none";
    });


// deprecated
    $.extend($.FUI, {
        // $.FUI.plugin is deprecated.  Use the proxy pattern instead.
        plugin: {
            add: function(module, option, set) {
                var proto = $.FUI[ module ].prototype;
                for (var i in set) {
                    proto.plugins[ i ] = proto.plugins[ i ] || [];
                    proto.plugins[ i ].push([ option, set[ i ] ]);
                }
            },
            call: function(instance, name, args) {
                var set = instance.plugins[ name ];
                if (!set || !instance.element[ 0 ].parentNode) {
                    return;
                }

                for (var i = 0; i < set.length; i++) {
                    if (instance.options[ set[ i ][ 0 ] ]) {
                        set[ i ][ 1 ].apply(instance.element, args);
                    }
                }
            }
        },

        // will be deprecated when we switch to jQuery 1.4 - use jQuery.contains()
        contains: function(a, b) {
            return document.compareDocumentPosition ?
                    a.compareDocumentPosition(b) & 16 :
                    a !== b && a.contains(b);
        },

        // only used by resizable
        hasScroll: function(el, a) {

            //If overflow is hidden, the element might have extra content, but the user wants to hide it
            if ($(el).css("overflow") === "hidden") {
                return false;
            }

            var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
                    has = false;

            if (el[ scroll ] > 0) {
                return true;
            }

            // TODO: determine which cases actually cause this to happen
            // if the element doesn't have the scroll set, see if it's possible to
            // set the scroll
            el[ scroll ] = 1;
            has = ( el[ scroll ] > 0 );
            el[ scroll ] = 0;
            return has;
        },

        // these are odd functions, fix the API or move into individual plugins
        isOverAxis: function(x, reference, size) {
            //Determines when x coordinate is over "b" element axis
            return ( x > reference ) && ( x < ( reference + size ) );
        },
        isOver: function(y, x, top, left, height, width) {
            //Determines when x, y coordinates is over "b" element
            return $.FUI.isOverAxis(y, top, height) && $.FUI.isOverAxis(x, left, width);
        }
    });
    //保存浏览器信息
    var FUI_B = {};
    $(function() {
        var browser = $.browser;
        if (browser.msie) {
            FUI_B["isIE"] = true;
            var version = browser.version;
            if (version.contains("6")) {
                FUI_B["isIE6"] = true;
                FUI_B["isIE7"] = false;
                FUI_B["isIE8"] = false;
            }
            if (version.contains("7")) {
                FUI_B["isIE7"] = true;
                FUI_B["isIE6"] = false;
                FUI_B["isIE8"] = false;
            }
            if (version.contains("8")) {
                FUI_B["isIE8"] = true;
                FUI_B["isIE6"] = false;
                FUI_B["isIE7"] = false;
            }
        } else {
            FUI_B["isIE"] = false;
            FUI_B["isIE6"] = false;
            FUI_B["isIE7"] = false;
            FUI_B["isIE8"] = false;
        }
        if (browser.webkit) {
            FUI_B["isChrome"] = true;
        } else {
            FUI_B["isChrome"] = false;
        }
        if (browser.mozilla) {
            FUI_B["isMozilla"] = true;
        } else {
            FUI_B["isMozilla"] = false;
        }
    });
    //FUI的公共方法
    $.extend($.FUI, {
        fetchNumber :function(s) {
            if (!s)  return s;
            var number = s.replace(/[^\d]/g, "");
            return number ? parseInt(number) : number;
        },
        //浏览器判断
        ENV : {
            get:function(t) {
                return FUI_B[t];
            }
        },
        //替换样式
        replaceClass : function(el, cls) {
           this.getElement(el).className = cls;
        },
        addClass:function(e, cls) {
	        var o = this.getElement(e);
	        var cn = o.className;
	        if (cn.indexOf(cls) !== -1)return;
	        cn.length == 0 ? cn = cls : cn += (" " + cls);
	        o.className = cn;
	    },
	    removeClass:function(e, cls) {
	        var o = this.getElement(e);
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
        isArray : function(v){
           return  Object.prototype.toString.apply(v) == "[object Array]" ;
        }
    });

//封装jQuery对象的公共方法
//元素不可选
    var R = function() {
        return false;
    };

//元素可选
    String.prototype.contains = function(s) {
        return this.indexOf(s) !== -1;
    };
})(jQuery);
/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.widget.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：组件核心
 * 修改记录:
 * 修改日期      修改人员                     修改说明
 * 2012-10-25  qudc         jquery对象新增ftype属性，对应的值为组件名称
 */
/*!
 * jQuery UI Widget @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function( $, undefined ) {
    //ADD 20120814 START BY QUDC  ie6下强制缓存background背景图片
    if($.browser.msie && $.browser.version == '6.0'){
        document.execCommand("BackgroundImageCache", false, true);
    }
    //ADD 20120814 END BY QUDC
// jQuery 1.4+
if ( $.cleanData ) {
	var _cleanData = $.cleanData;
	$.cleanData = function( elems ) {
		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			try {
				$( elem ).triggerHandler( "remove" );
			// http://bugs.jquery.com/ticket/8235
			} catch( e ) {}
		}
		_cleanData( elems );
	};
} else {
	var _remove = $.fn.remove;
	$.fn.remove = function( selector, keepData ) {
		return this.each(function() {
			if ( !keepData ) {
				if ( !selector || $.filter( selector, [ this ] ).length ) {
					$( "*", this ).add( [ this ] ).each(function() {
						try {
							$(this).triggerHandler("remove");
						// http://bugs.jquery.com/ticket/8235
						} catch( e ) {}
					});
				}
			}
			return _remove.call( $(this), selector, keepData );
		});
	};
}

$.widget = function( name, base, prototype ) {
	var namespace = name.split( "." )[ 0 ],
		fullName;
	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName ] = function( elem ) {
		return !!$.data( elem, name );
	};

	$[ namespace ] = $[ namespace ] || {};
	$[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without initializing for simple inheritance
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};

	var basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
//	$.each( basePrototype, function( key, val ) {
//		if ( $.isPlainObject(val) ) {
//			basePrototype[ key ] = $.extend( {}, val );
//		}
//	});
	basePrototype.options = $.extend( true, {}, basePrototype.options );
	$[ namespace ][ name ].prototype = $.extend( true, basePrototype, {
		namespace: namespace,
		widgetName: name,
		widgetEventPrefix: $[ namespace ][ name ].prototype.widgetEventPrefix || name,
		widgetBaseClass: fullName
	}, prototype );

	$.widget.bridge( name, $[ namespace ][ name ] );
};

$.widget.bridge = function( name, object ) {
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = Array.prototype.slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.extend.apply( null, [ true, options ].concat(args) ) :
			options;

		// prevent calls to internal methods
		if ( isMethodCall && options.charAt( 0 ) === "_" ) {
			return returnValue;
		}

		if ( isMethodCall ) {
			this.each(function() {
				var instance = $.data( this, name ),
					methodValue = instance && $.isFunction( instance[options] ) ?
						instance[ options ].apply( instance, args ) :
						instance;
				// TODO: add this back in 1.9 and use $.error() (see #5972)
//				if ( !instance ) {
//					throw "cannot call methods on " + name + " prior to initialization; " +
//						"attempted to call method '" + options + "'";
//				}
//				if ( !$.isFunction( instance[options] ) ) {
//					throw "no such method '" + options + "' for " + name + " widget instance";
//				}
//				var methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
                var instance = $.data( this, name );
                if ( instance ) {
                    instance.option( options || {} )._init();
                } else {
                    $.data( this, name, new object( options, this ) );
                }
            });
		}

		return returnValue;
	};
};

$.Widget = function( options, element ) {
	// allow instantiation without initializing for simple inheritance
	if ( arguments.length ) {
		this._createWidget( options, element );
	}
};

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	options: {
		disabled: false
	},
	_createWidget: function( options, element ) {
		// $.widget.bridge stores the plugin instance, but we do it anyway
		// so that it's stored even before the _create function runs
		$.data( element, this.widgetName, this );
		this.element = $( element );
        //2012-10-25 add qudc jquery对象新增ftype属性，对应的值为组件名称
		// 20121130 del hanyin 
        	//this.element.data('ftype',this.widgetName);
        // 20121130 end hanyin 
        //2012-10-25 end qudc
		this.options = $.extend( true, {},
			this.options,
			this._getCreateOptions()
            );
        $.extend(this.options,options);

		var self = this;
		this.element.bind( "remove." + this.widgetName, function() {
			self.destroy();
		});

		this._create();
		//this._trigger( "create" );
		this._init();
	},
	_getCreateOptions: function() {
		return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
	},
	_create: function() {},
	_init: function() {},

	destroy: function() {
		this.element
			.unbind( "." + this.widgetName )
			.removeData( this.widgetName );
		this.widget()
			.unbind( "." + this.widgetName )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetBaseClass + "-disabled " +
				"ui-state-disabled" );
	},

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.extend( {}, this.options );
		}

		if  (typeof key === "string" ) {
			if ( value === undefined ) {
				return this.options[ key ];
			}
			options = {};
			options[ key ] = value;
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var self = this;
		$.each( options, function( key, value ) {
			self._setOption( key, value );
		});

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				[ value ? "addClass" : "removeClass"](
					this.widgetBaseClass + "-disabled" + " " +
					"ui-state-disabled" )
				.attr( "aria-disabled", value );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];
		
		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );

		return !( $.isFunction(callback) &&
			callback.call( this.element[0], event, data ) === false ||
			event.isDefaultPrevented() );
	},
	
	setSize : function(w, h) {
		// no effect in default, sub widget can override this function for specific purpose
	}
};
$.registerWidgetEvent("remove");

})( jQuery );
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
/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Validate.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FComboGrid组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 2013-03-15   qudc                修改options.showErrors 函数，实现errorModel模式为qtip时，第二次提示错误信息报js错误的问题。
 * 2013-03-15   qudc                修改options.showErrors 函数，实现errorModel模式为qtip时，第一次校验失败（例如必输项没有输入内容），校验成功以后，鼠标移上去，原先错误信息仍然会显示。现在心中valid属相标志，获取组件校验是否成功，如果成功，则不做提示。
 */
/**
 * @name FValidate
 * @class 
 * 输入验证，可以方便地对表单进行校验.指导用户输入的准确性，当用户输入不符合业务规则时给予提示，并影响表单的提交。此组件在jquery.validate的基础上
 * 做了必要扩展：支持含有隐藏域的FUI的表单组件校验；支持类似ext的qtip的功能等。
 */

/**@lends FValidate# */







/**
 * 指定校验成功没有任何错误后加到元素的class名称<br/>
 * @name FValidate#validClass
 * @type String
 * @default 'valid'
 * @example
 * $(".selector").FValidate({
 *      validClass: "success"
 *   })
 */

/**
 * 指定校验成功没有任何错误后加到提示元素上面的样式名称<br/>
 * 和validClass的区别是它只加在提示元素上面，而不对校验的对象做任何变动。
 * @name FValidate#success
 * @type String
 * @default 无
 * @example
 * $(".selector").FValidate({
 *      success: "valid"
 *   })
 */





/**
 * 获得焦点的时候是否清除错误提示，这种清除是针对所有元素的，<br/>
 * 如果设置为true，则必须将focusInvalid设置为false，否则将没有校验效果。
 * @name FValidate#focusCleanup
 * @type Boolean
 * @default false
 * @example
 * $(".selector").FValidate({
 *      focusInvalid: false, //必须设置
 *      focusCleanup: true
 *   })
 */


/**
 * 在blur事件发生时是否进行校验，如果没有输入任何值，则将忽略校验。
 * @name FValidate#onfocusout
 * @type Boolean
 * @default true
 * @example
 * $(".selector").FValidate({
 *      onfocusout: false
 *   })
 */

/**
 * 在keyup事件发生时是否进行校验。
 * @name FValidate#onkeyup
 * @type Boolean
 * @default true
 * @example
 * $(".selector").FValidate({
 *      onkeyup: false
 *   })
 */




/**
 * 定制错误信息显示的回调方法，用于自定义错误提示格式。该方法有两个参数，第一个参数是错误信息的元素，第二个是触发校验错误的源元素。FCombo组件和FNumberField组件第二个参数为隐藏域元素。
 * @name FValidate#errorPlacement
 * @type Function
 * @default 无
 * @example
 * $("#myform").FValidate({
 *     errorPlacement: function(error, element) {
 *        // 用户自定义操作
 *        error.appendTo( element.parent("td").next("td") );
 *      }
 *    })
 */


/**
 * 定制校验通过后表单提交前的回调方法，用来替换默认提交，一般是Ajax提交方式需要使用到。
 * @type Function
 * @name FValidate#submitHandler
 * @param form 当前表单对象
 * @example
 * $(".selector").FValidate({
 *      submitHandler: function(form) {
 *       $(form).ajaxSubmit(); //校验通过之后调用ajaxSubmit提交表单
 *      }
 *   })
 */




/**
 * 检查表单是否通过校验
 * @name FValidate#valid
 * @function
 * @returns Boolean
 * @example
 *   $("#myform").FValidate();
 *   $("a.check").click(function() {
 *     alert("Valid: " + $("#myform").valid());
 *     return false;
 *   });
 */



/**
 * 触发表单校验
 * @name FValidate#form
 * @function
 * @returns Boolean
 * @example
 *  $("#myform").FValidate().form()
 */

/**
 * 校验选中的element
 * @name FValidate#element
 * @param element
 * @function
 * @returns Boolean
 * @example
 *  $("#myform").FValidate().element( "#myselect" );
 */

/**
 * 重置表单，调用此方法将去掉所有提示信息
 * @name FValidate#resetForm
 * @function
 * @returns 无
 * @example
 *  var validator = $("#myform").FValidate();
 *  validator.resetForm();
 */

/**
 *  添加并显示提示信息,其中示例中的firstname和firstname1为form表单下面的一个表单组件的name属性值。
 * @name FValidate#showErrors
 * @function
 * @param Object
 * @returns 无
 * @example
 * var validator = $("#myform").FValidate();
 * validator.showErrors({"firstname": "请重新选择！",'firstname1':'该字段输入信息有错误！'});
 */

/**
 *  统计没有通过校验的元素个数
 * @name FValidate#numberOfInvalids
 * @function
 * @returns Integer
 * @example
 * var validator = $("#myform").FValidate();
 * return validator.numberOfInvalids();
 */

/**
 * 针对选中的元素，动态添加删除校验规则的方法，有rules( "add", rules ) 和rules( "remove", [rules] )两种
 * @name FValidate#rules
 * @function
 * @returns rules Object{Options}
 * @example
 *  $('#username').rules('add',{
 *       minlength:5,
 *       messages: {
 *           minlength: jQuery.format("Please, at least {0} characters are necessary")
 *       }
 *   });
 *
 * $("#myinput").rules("remove", "min max"); //remove可以配置多个rule，空格隔开
 */

;
(function($) {
    $.extend($.fn, {
        /**
         * 创建表单的校验对象
         * @name FValidate#FValidate
         * @function
         * @returns 当前form的校验对象
         * @example
         *   $("#myform").FValidate({
         *      //options
         *   });
         */

        FValidate : function(options) {

            // if nothing is selected, return nothing; can't chain anyway
            if (!this.length) {
                options && options.debug && window.console && console.warn("nothing selected, can't validate, returning nothing");

                return;
            }

            // check if a validator for this form was already created
            var validator = $.data(this[0], 'validator');
            if (validator) {
                return validator;
            }

            // Add novalidate tag if HTML5.
            this.attr('novalidate', 'novalidate');
            //特殊处理onkeyup属性,如果用户设置true，则使用默认的onkeyup函数。即只接收false属性。
            if (options.onkeyup) {
                delete options.onkeyup;
            }
            //特殊处理onclick属性，如果用户设置true，则使用默认的onclick函数。即只接收false属性。
            if (options.onclick) {
                delete options.onclick;
            }
            //特殊处理onfocusout属性，如果用户设置true，则使用默认的onfocusout函数。即只接收false属性。
            if (options.onfocusout) {
                delete options.onfocusout;
            }
            //特殊处理onsubmit属性，如果用户设置true，则使用默认的onsubmit函数。即只接收false属性。
            if (options.onsubmit) {
                delete options.onsubmit;
            }
            /**
             * 如果用户设置了errorModel，且值为qtip或者under，则执行系统默认制定的方式。
             * 否则，如果用户自己制定显示方式，设置errorPlacement属性，则按照用户自己设置的方式进行。
             */
            if (!options.errorPlacement) {
                if ("qtip" === options.errorModel) {
                    options.errorMsgClass = "f-validate-errorMsg";
                    options.errorElement = "label";
                    options.errorPlacement = function(error, element) {
                        if (error.html()) {
                            var el = $(element);
                            //var error = error.wrap("<span id='fui-validate-qtip-msg' class='f-validate-errorMsg' style='display:none;' />").parent();

                            var qtipMsgEl = $('#fui-validate-qtip-msg');
                            if (!qtipMsgEl.length) {
                                $('body').append("<span id='fui-validate-qtip-msg' class='f-validate-errorMsg' style='display:none;' />");
                            }


                            var errorMsgTarget = el.attr("errorMsgTarget");
                            //例如combo number 组件有两个input
                            if (errorMsgTarget) {
                                if ("parent" == errorMsgTarget) {
                                    //制定节点查找其兄弟节点
                                    var parent = el.parent();
                                    parent.attr('f-validate-qtip-msg', error.html());
                                } else {
                                    //通过id来查找
                                    errorMsgTarget = $.trim(errorMsgTarget);
                                    if (errorMsgTarget.indexOf("#") !== 0) {
                                        errorMsgTarget = "#" + errorMsgTarget;
                                    }
                                    var parent = $(errorMsgTarget);
                                    parent.attr('f-validate-qtip-msg', error.html());
                                }
                            } else {
                                el.attr('f-validate-qtip-msg', error.html());
                            }
                        }
                    };
                    options.showErrors = function(errorMap, errorList) {
                        if (errorList && errorList.length > 0) {
                            $.each(errorList, function(index, obj) {
                                var msg = this.message;
                                var el = $(obj.element);
                                var errorMsgTarget = el.attr("errorMsgTarget");
                                //绑定一个次事件
                                if (el.attr("hasbindmouseevent") !== "true") {
                                    if (errorMsgTarget) {
                                        var parentEl = null;
                                        if ("parent" == errorMsgTarget) {
                                            //指定父节点查找其兄弟节点
                                            parentEl = el.parent();
                                        } else {
                                            //通过id来查找
                                            errorMsgTarget = $.trim(errorMsgTarget);
                                            if (errorMsgTarget.indexOf("#") !== 0) {
                                                errorMsgTarget = "#" + errorMsgTarget;
                                            }
                                            parentEl = $(errorMsgTarget);
                                        }
                                        //判断是否有错误提示消息
                                        //if (msgEl.html().length > 0 && msgEl.attr("class").length > 0 && msgEl.find("label").html().length > 0) {
                                        parentEl.bind('mouseover',
                                                function(e) {
                                                    var qtipMsgEl = $('#fui-validate-qtip-msg');
                                                    var el = $(this);
                                                    var msg = el.attr('f-validate-qtip-msg');
                                                    var valid =  el.attr('valid');
                                                    if (valid !== 'true' &&qtipMsgEl.length) {
                                                        qtipMsgEl.html(msg);
                                                        qtipMsgEl.css('display', 'inline').css({'top':e.pageY + 10 , 'left':e.pageX + 5});
                                                    }
                                                }).bind('mouseout',
                                                function() {
                                                    var qtipMsgEl = $('#fui-validate-qtip-msg');
                                                    if (qtipMsgEl.length) {
                                                        qtipMsgEl.css('display', 'none');
                                                    }
                                                });

                                    } else {
                                        //直接綁定
                                        el.bind('mouseover',
                                                function(e) {
                                                    var qtipMsgEl = $('#fui-validate-qtip-msg');
                                                    var el = $(this);
                                                    var msg = el.attr('f-validate-qtip-msg');
                                                    var valid =  el.attr('valid');
                                                     if (valid !== 'true' &&qtipMsgEl.length) {
                                                        qtipMsgEl.html(msg);
                                                        qtipMsgEl.css('display', 'inline').css({'top':e.pageY + 10 , 'left':e.pageX + 5});
                                                    }
                                                }).bind('mouseout',
                                                function() {
                                                    var qtipMsgEl = $('#fui-validate-qtip-msg');
                                                    if (qtipMsgEl.length) {
                                                        qtipMsgEl.css('display', 'none');
                                                    }
                                                });
                                    }
                                    el.attr("hasbindmouseevent", true);
                                }
                            });
                        } else {
                            $(this.currentElements).parents().map(function() {
                                if (this.tagName.toLowerCase() == 'td') {
                                    //$(this).children().eq(1).hide();
                                    $(this).children().eq(0).removeClass("error-border");
                                } else {
                                    $(this).removeClass("error-border");
                                }
                                $(this).children().eq(0).removeClass("x-form-invalid");
                            });
                        }
                        this.defaultShowErrors();
                    }
                } else {
                    //用户没有设置errorPlacement，errorModel使用默认值：under
                    options.errorPlacement = function(error, element) {
                        if (error.html()) {
                            var el = $(element);
                            var errorMsgTarget = el.attr("errorMsgTarget");
                            //例如combo number 组件有两个input
                            if (errorMsgTarget) {
                                if ("parent" == errorMsgTarget) {
                                    //制定节点查找其兄弟节点
                                    var parent = el.parent();
                                    error.insertAfter(parent);
                                    error.css('display', 'none');

                                } else {
                                    //通过id来查找
                                    errorMsgTarget = $.trim(errorMsgTarget);
                                    if (errorMsgTarget.indexOf("#") !== 0) {
                                        errorMsgTarget = "#" + errorMsgTarget;
                                    }
                                    var parent = $(errorMsgTarget);
                                    error.insertAfter(parent);
                                    error.css('display', 'none');
                                }
                            } else {
                                //纯的html元素，例如input
                                error.insertAfter(el);
                                error.css('display', 'none');
                            }
                        }
                    };
                }

            }


            validator = new $.fvalidator(options, this[0]);
            $.data(this[0], 'validator', validator);

            if (validator.settings.onsubmit) {

                //var inputsAndButtons = this.find("input, button");
                var inputs = this.find('input');
                var buttons = this.find('button');

                var inputsAndButtons = inputs.add(buttons);

                // allow suppresing validation by adding a cancel class to the submit button
                inputsAndButtons.filter(".cancel").click(function () {
                    validator.cancelSubmit = true;
                });

                // when a submitHandler is used, capture the submitting button
                if (validator.settings.submitHandler) {
                    inputsAndButtons.filter(":submit").click(function () {
                        validator.submitButton = this;
                    });
                }

                // validate the form on submit
                this.submit(function(event) {
                    if (validator.settings.debug)
                    // prevent form submit to be able to see console output
                        event.preventDefault();

                    function handle() {
                        if (validator.settings.submitHandler) {
                            if (validator.submitButton) {
                                // insert a hidden input as a replacement for the missing submit button
                                var hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
                            }
                            validator.settings.submitHandler.call(validator, validator.currentForm);
                            if (validator.submitButton) {
                                // and clean up afterwards; thanks to no-block-scope, hidden can be referenced
                                hidden.remove();
                            }
                            return false;
                        }
                        return true;
                    }

                    // prevent submit for invalid forms or custom submit handlers
                    if (validator.cancelSubmit) {
                        validator.cancelSubmit = false;
                        return handle();
                    }
                    if (validator.form()) {
                        if (validator.pendingRequest) {
                            validator.formSubmitted = true;
                            return false;
                        }
                        return handle();
                    } else {
                        validator.focusInvalid();
                        return false;
                    }
                });
            }
            //validator.checkForm();
            return validator;
        }

        //校验单个控件
        ,isValidate : function(formId) {
            if (formId) {
                var form = $I(formId);
                if (form.length > 0) {
                    var valid = false;
                    var validator = form.validate();
                    valid = validator.element(this);
                    return valid;
                } else {
                    return true;
                }
            } else {
                var valid = false;
                var element = this[0];
                if (element.form) {
                    var validator = $.data(element.form, 'validator');
                    if (validator) {
                        valid = validator.element(this);
                        return valid;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }

    });

    $.fvalidator = function(options, form) {
        this.settings = $.extend(true, {}, $.fvalidator.defaults, options);
        this.currentForm = form;
        this.init();
    }


    $.extend($.fvalidator, {
        prototype:$.validator.prototype,
        defaults: {
            /**
             * 键值对的校验错误信息.键是元素的name属性，值是错误信息的组合对象。<br/>
             * @name FValidate#messages
             * @type JSON
             * @default {}
             * @example
             * $("#formId").FValidate({
             *  rules: {
             *    name: {
             *      required: true,
             *      minlength: 2
             *    }
             *  },
             *  messages: {
             *    name: {
             *      required: "We need your email address to contact you",
             *      minlength: jQuery.format("At least {0} characters required!")
             *      //这里的{0}就是minlength定义的2
             *    }
             *  }
             *})
             */
            messages: {},
            /**
             * 错误消息分组,如果没有设置errorPlacement，则分组内的元素出现错误时只在第一个元素后面显示错误消息，
             * 如果设置了errorPlacement，则可以在errorPlacement回调中定义显示位置 <br/>
             * @name FValidate#groups
             * @type JSON
             * @default {}
             * @example
             * $("#myform").FValidate({
             *     groups: {
             *       username: "fname lname"
             *     },
             *     errorPlacement: function(error, element) {
             *        if (element.attr("name") == "fname"
             *                    || element.attr("name") == "lname" ){
             *          error.insertAfter("#lastname");
             *        }else{
             *          error.insertAfter(element);
             *        }
             *      },
             *    }) //将fname和lname的错误信息统一显示在lastname元素后面
             */
            groups: {},
            /**
             * 键值对的校验规则.键是元素的name属性，值是校验规则的组合对象，每一个规则都可以绑定一个依赖对象，<br/>
             * 通过depends设定，只有依赖对象成立才会执行验证<br/>
             * $(".selector").FValidate({
             *  rules: {
             *    contact: { //其中 contact为组件的name属性值
             *      required: true,
             *      maxlength:10
             *    }
             *  }
             *})
             */
            rules: {},
            /**
             * 指定错误提示标签的class名称，此class也将添加在校验的元素上面。<br/>
             * 说明：错误提示的样式包括输入框的样式以及提示信息的样式。该属性一般情况下不需要设置，使用默认值即可。除非用户自定义错误提示的样式。该样式具体制定详见demo。
             * @name FValidate#errorClass
             * @type String
             * @default 'error'
             * @example
             * $(".selector").FValidate({
             *      errorClass: "invalid"
             *   })
             */
            errorClass: "f-validate-error",
            validClass: "valid",
            /**
             * 指定错误信息的html标签名称<br/>
             * 说明：该属性只有当用户设置errorPlacement属性时才起作用。
             * @name FValidate#errorElement
             * @type String
             * @default 'div'
             * @example
             * $(".selector").FValidate({
             *      errorElement: "em"
             *   })
             */
            errorElement: "div",
            /**
             * 错误信息提示的模式。默认模式为“under”。有两种模式，“under”模式为：错误信息显示在输入框的下方。“qtip”模式为：错误信息悬浮显示。
             * @name  FValidate#errorModel
             * @type String
             * @default 'under'
             * @example
             * $(".selector").FValidate({
             *      errorModel: "qtip"
             *   })
             */
            errorModel : "under",
            /**
             * 校验错误的时候是否将聚焦元素。该属性如果为true，校验出错时会将光标聚焦到错误处。<br/>
             * 说明:使用该属性时，提交按钮类型必须是"submit"类型。
             * @name FValidate#focusInvalid
             * @type Boolean
             * @default true
             * @example
             * $(".selector").FValidate({
             *      focusInvalid: false
             *   })
             */
            focusInvalid: true,
            /**
             * 包含错误提示信息的容器，根据校验结果隐藏或者显示错误容器。其中该错误提示信息是由用户在页面设计的时候填写的内容。<br />
             * 与 errorLabelContainer 属性的区别是这个属性提示的错误信息是静态的，即为用户在页面设计时填写的内容。
             * @name FValidate#errorContainer
             * @type Selector
             * @default $( [] )
             * @example
             * $("#myform").FValidate({
             *      errorContainer: "#messageBox1, #messageBox2"
             *      //可以配置多个容器，这里的messageBox2元素没有被包装处理，只是错误发生的时候显示和隐藏此元素。
             *   })
             */
            errorContainer: $([]),
            /**
             * 设置统一存放错误信息的容器，根据校验结果隐藏或者显示错误容器。校验框架会将所有的错误提示信息存放到该容器下。
             * @name FValidate#errorLabelContainer
             * @type Selector
             * @default $( [] )
             * @example
             * $("#myform").FValidate({
             *      errorLabelContainer: "#messageBox1 ul"
             *      //messageBox为容器的id
             *   })
             *
             */
            errorLabelContainer: $([]),
            /**
             * 是否在提交时校验表单，如果设置为false，则提交的时候不校验表单，<br/>
             * 但是其它keyup、onblur等事件校验不受影响.
             * @name FValidate#onsubmit
             * @type Boolean
             * @default true
             * @example
             * $(".selector").FValidate({
             *      onsubmit: false
             *   })
             */
            onsubmit: true,
            //修改： ignore: ":hidden",
            /**
             * 校验时忽略指定的元素，可以配置需要校验的元素id和样式名称等jquery识别的选择器。<br/>
             * 说明：该属性值不能为 “：hidden”，否则会导致FCombo、FNumberField组件的校验无效。建议为复杂的选中器，用过不匹配个别标签。
             * @name FValidate#ignore
             * @type String
             * @default null
             * @example
             * $("#myform").FValidate({
             *      ignore: ".ignore"
             *      //此处还可以配置input[type='password']、#id等jquery的选择器
             *   })
             */
            ignore: [],
            ignoreTitle: false,
            onfocusin: function(element, event) {
                var elementEl = $(element);
                var hasprevioussbling = elementEl.attr("hasprevioussbling");
                var hasChecked = elementEl.attr('hasChecked');
                if (!hasChecked) {
                    if (hasprevioussbling == "true") {
                        var prevElement = elementEl.prev()[0];
                        this.check(prevElement);
                    } else {
                        this.check(element);
                    }
                    //this.element(element);
                    elementEl.attr('hasChecked', 'true');
                }
                this.lastActive = element;

                // hide error label and remove error class on focus if enabled
                if (this.settings.focusCleanup && !this.blockFocusCleanup) {
                    this.settings.unhighlight && this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);


                    //如果该输入框为FCombo和FNumberField组件的一部分，那么需要查找其前一节点并根据该节点隐藏错误信息。
                    if (hasprevioussbling === "true") {
                        var prevElement = elementEl.prev()[0];
                        this.addWrapper(this.errorsFor(prevElement)).hide();
                    } else {
                        this.addWrapper(this.errorsFor(element)).hide();
                    }
                }
            },

            onfocusout: function(element, event) {
                var elementEl = $(element);
                if (elementEl.attr("hasprevioussbling") === "true") {
                    // element.previousSibling
                    var prevElement = elementEl.prev()[0];
                    if (!this.checkable(prevElement) && (prevElement.name in this.submitted || !this.optional(prevElement))) {
                        this.element(prevElement);
                    }
                } else if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element))) {
                    this.element(element);
                }
            },

            onkeyup: function(element, event) {
                if (this.keyUpTimeout) {
                    clearTimeout(this.keyUpTimeout);
                }
                _this = this;
                this.keyUpTimeout = setTimeout(function() {
                    var elementEl = $(element);
                    if (elementEl.attr("hasprevioussbling") === "true") {
                        var prevElement = $(element).prev()[0];
                        if (prevElement.name in _this.submitted || prevElement == _this.lastElement) {
                            _this.element(prevElement);
                        }
                    } else {
                        if (element.name in _this.submitted || element == _this.lastElement) {
                            _this.element(element);
                        }
                    }
                }, 300);
            },
            /**
             * 在checkbox和radio的click事件发生后是否进行校验。
             * onclick
             *  Boolean
             *  true
             * $(".selector").FValidate({
             *      onclick: false
             *   })
             */
            onclick: function(element, event) {
                // click on selects, radiobuttons and checkboxes
                if (element.name in this.submitted)
                    this.element(element);
                // or option elements, check parent select in that case
                else if (element.parentNode.name in this.submitted)
                    this.element(element.parentNode);
            },
            highlight: function(element, errorClass, validClass) {
                if (element.type === 'radio') {
                    this.findByName(element.name).addClass(errorClass).removeClass(validClass);
                } else {
                    var el = $(element);
                    var errorValidateTarget = el.attr("errorValidateTarget");
                    var errorMsgTarget = el.attr("errorMsgTarget");
                    if (!errorValidateTarget) {
                        el.addClass(errorClass).removeClass(validClass);
                    } else {
                        if ('next' === errorValidateTarget) {
                            var validateEl = el.next();
                            validateEl.addClass(errorClass).removeClass(validClass);
                        } else {
                            $(errorValidateTarget).addClass(errorClass).removeClass(validClass);
                        }
                    }
                    if('parent' == errorMsgTarget){
                        var parentEl = el.parent();
                        parentEl.attr('valid','false');
                    } else {
                        el.attr('valid','false');
                    }
                }
            },
            unhighlight: function(element, errorClass, validClass) {
                if (element.type === 'radio') {
                    this.findByName(element.name).removeClass(errorClass);
                } else {
                    var el = $(element);
                    var errorValidateTarget = el.attr("errorValidateTarget");
                    var errorMsgTarget = el.attr("errorMsgTarget");
                    if (!errorValidateTarget) {
                        el.removeClass(errorClass).addClass(validClass);
                    } else {
                        if ('next' === errorValidateTarget) {
                            var validateEl = el.next();
                            validateEl.removeClass(errorClass).addClass(validClass);
                        } else {
                            $(errorValidateTarget).removeClass(errorClass).addClass(validClass);
                        }
                    }
                    if('parent' == errorMsgTarget){
                        var parentEl = el.parent();
                        parentEl.attr('valid','true');
                    } else {
                        el.attr('valid','true');
                    }

                }
            }
        }
    });

})(jQuery);
/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Ajax.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FAjax组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员                     修改说明
 * 2012-11-15   qudc     修改ajax的默认发生模式，默认为”post“方法发送请求。
 * 20130219    hanyin    增加数据模型“jres”和ajax数据模型的完整描述说明
 */

/**
 * @name FAjax
 * @class 
 * 异步交互，提供简化的与后台交互的方法。并为其它组件提供远程交互能力。
 */

/**@lends FAjax# */
(function($, undefined) {

    $.FUI.FAjax = {
        _errorHandlerMap:{},
        _defaultErrorHandler:{},


        /**
         * 统一的AJAX操作接口,如果FAjax设置了_errorHandlerMap或者_defaultErrorHandler，failure回调函数的返回值不為true，则不执行默认的错误处理函数，认为用户自行处理错误处理。<br/>
         * 用户请求不同的数据类型时，需要在data参数中传递_respType参数，_respType参数需要指定需要的数据类型。类型有：list，page等。
         * 另外，还支持的参数有：
         * <ol>
         * <li>_respType : 应答的数据模型，支持list、listsimple、pojo、page、tree和jres，其中数据模型“jres”支持多数据集IDataset；</li>
         * <li>_respMapping : 应答结果字段的映射关系，比如返回的结果集有字段“userId”和“upperId”，但是需要的是“id”和“pid”，
         * 那么可以设置此值为"id=userId,pid=upperId"，每个字段使用英文逗号","分隔，FUI的Servlet会自动做字段转换。</li>
         * </ol>
         * @name FAjax#remote
         * @function
         * @param options FAjax的配置参数，结构是{url:服务,data:{请求参数},success:function(data，textStatus, jqXHR){//returnCode==0的情况},failure:function(data,textStatus, jqXHR){//returnCode为 1或者 -1的情况 },error:function(jqXHR, textStatus, errorThrown){//请求错误时，例如请求超时}}
         * @example
         * $.FAjax.remote({
         *             url:"com.hundsun.user.add",
         *             data:$('#formId').getValues(),
         *          success:function(data,textStatus, jqXHR){
         *              //请求正常，returnCode ==0 时触发
         *           },
         *          failure:function(data,textStatus, jqXHR){
         *               //请求正常，returnCode !=0时触发
         *          },
         *          error : function(jqXHR, textStatus, errorThrown){
         *              //请求失败时错发，例如请求超时。
         *          }
         *          //其他一些参数。
         *          );
         */
        remote:function(options) {
            var UTILS = window['$Utils'];
            var url = options.url;
            var success = options.success;
            var failure = options.failure;
            var ME = this;
            options.success = function(data, textStatus, jqXHR) {
                //ajax执行成功的前提下，如果有returnCode,则说明是JRES服务，那么按照retrunCode是不是为1来执行成功还是会掉函数。
                if (data.returnCode === 1 || data.returnCode === -1) {
                    if (failure) {
                        //判断用户是否退出指定错误号的处理
                        if (true !== failure(data, textStatus, jqXHR)) {
                            return;
                        }
                    }
                    var errorNo = data.errorNo;
                    var errorHandler = ME._errorHandlerMap[data.errorNo];
                    //如果用户有制定对应错误号的处理函数，则调用对应的处理函数
                    if ($.isFunction(errorHandler)) {
                        errorHandler(data, textStatus, jqXHR);
                    } else if ("string" == $.type(errorHandler)) {
                        // 按照默认的方式提示信息
                        data.errorInfo = errorHandler
                        ME._defaultErrorHandler(data);
                    } else {
                        ME._defaultErrorHandler(data);
                    }
                } else {
                    /**
                     * 这里有两种情况：
                     * 1、一种情况是返回值中returnCode为0，表示jres的业务执行成功。
                     * 2、一种情况是返回值中returnCode为undefined，表示非jres的服务
                     */
                    if (success) {
                        success(data, textStatus, jqXHR);
                    }
                }
            };
            if (!options.error) {
                options.error = function(jqXHR, textStatus, errorThrown) {
                    //todo 说明是真正的ajax超时，提示默认的超时信息。
                    alert("ajax超时：" + textStatus);
                }
            }
            //判断是否需要加上上下文路径，规则是，以“/”开头不加，否则加
            if (url.indexOf("/") !== 0) {
                options.url = UTILS.getContextPath() + "/" + url;
            }
            if (!options.dataType) {
                options.dataType = 'json';
            }
            //默认以post的方式发送请求。
            if (!options.type) {
               options.type = 'post';
            }
            $.ajax(options);
        },
        /**
         * 获取应答中的对象，FAjax请求的数据类型需要为pojo和page，在success回调中的data参数为object类型。<br/>
         * 用户请求不同的数据类型时，需要在data参数中传递_respType参数，_respType参数需要指定需要的数据类型。类型有：pojo，page。
         * @name FAjax#getObject
         * @function
         * @param options FAjax的配置参数，结构是{url:服务,data:{请求参数},success:function(data，textStatus, jqXHR){//returnCode==0的情况},failure:function(data,textStatus, jqXHR){//returnCode为 1或者 -1的情况 },error:function(jqXHR, textStatus, errorThrown){//请求错误时，例如请求超时}}
         * @example
         * $.FAjax.getObject({
         *              url:'com.hundusn.user.object.fservice',
         *              data:params,
         *              success:function(data,textStatus, jqXHR){
         *                  //请求正常，returnCode ==0 时触发
         *              },
         *              failure:function(data,textStatus, jqXHR){
         *                  //请求正常，returnCode !=0时触发
         *              },
         *              error : function(jqXHR, textStatus, errorThrown){
         *                  //请求失败时错发，例如请求超时。
         *              });
         */
        getObject:function(options) {
            var UTILS = window['$Utils'];
            if (!options) {
                //todo debug 模式下，提示错误信息。
                return;
            }
            var success = options.success;

            options.success = function(result) {
                if (success) {
                    var object = UTILS.getJRESObject(result);
                    success(object);
                }
            }
            this.remote(options);
        },

        /**
         * 获取应答中的列表对象，FAjax请求的数据类型需要为list、listsimple、tree，在success回调中的data参数为Array类型。<br/>
         * 用户请求不同的数据类型时，需要在data参数中传递_respType参数，_respType参数需要指定需要的数据类型。类型有：list，listsimple，tree。
         * @name FAjax#getList
         * @function
         * @param options FAjax的配置参数，结构是{url:服务,data:{请求参数},success:function(data，textStatus, jqXHR){//returnCode==0的情况},failure:function(data,textStatus, jqXHR){//returnCode为 1或者 -1的情况 },error:function(jqXHR, textStatus, errorThrown){//请求错误时，例如请求超时}}
         * @example
         * $.FAjax.getList({
         *              url:'com.hundusn.user.list.fservice',
         *              data:params,
         *              success:function(data,textStatus, jqXHR){
         *                  //请求正常，returnCode ==0 时触发
         *              },
         *              failure:function(data,textStatus, jqXHR){
         *                  //请求正常，returnCode !=0时触发
         *              },
         *              error : function(jqXHR, textStatus, errorThrown){
         *                  //请求失败时错发，例如请求超时。
         *              }
         *              );
         */
        getList:function(options) {
            var UTILS = window['$Utils'];
            if (!options) {
                //todo debug 模式下，提示错误信息。
                return;
            }
            var success = options.success;

            options.success = function(result) {
                if (success) {
                    var list = UTILS.getJRESList(result);
                    success(list);
                }
            }
            this.remote(options);
        }
    }

})(jQuery);

	/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Grid.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FGrid组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 2012-11-7    qudc               根据pagingbarId属性对_respType属性值进行重设，如果不分页，该值为“list”，如果分页，该值为“page”.
 * 2012-11-7    qudc               _respType属性改成“page”,即不分页情况下返回的totalCount值为-1.
 * 2012-11-7    qudc               修改_transferData方法，统一读取listData的数据。
 * 2012-11-15   qudc               修改onLoadfailure onLoadsuccess  事件的注释参数。参数名XMLHTTPReques改成jqXHR，与ajax的回调参数保存一致。
 * 2012-12-07   qudc               修改resetDataCache方法，添加this.bodyEl.html('') 来清空缓存的数据。
 * 2012-12-14   qudc               修改resetDataCache方法。新增第二个参数 isRefresh 。当用户点击刷新按钮时，该参数值才为true，用于将当前页选中的记录从crossPageDataCache中删除。
 * 2012-12-14   qudc               修改_bindEvent方法，新增this.headEl.bind方法，绑定click事件。实现全选功能，以及列头排序功能。
 * 2012-12-14   qudc               新增私有方法_selectAll 和私有方法_unSelectAll。
 * 2012-12-17   qudc               由于FUI.Utils.js中$Component的call方法无效，用tryCall方法替换。
 * 2013-01-08   qudc               配置有sortable属性的列，添加样式f-grid-cell-sortable,鼠标以上去出现手型
 * 2013-01-08   qudc               修复bug：当某一列（A）配置了sortable和defaultSortDir,用户点击其他可排序列后，列A的排序图标不会清空的问题。解决： 新增defaultSortColumnId属性，用于保存默认排序列的ID，方便_renderHead方法中查找默认排序列对象sortEl。
 * 2013-01-09   qudc               修复bug：3966 将onRowDbClick事件的事件名描述有原来的onRowDbclick修改成onRowDbClick。
 * 2013-01-09   qudc               修复bug：3966 新增onBeforesend事件的api描述
 * 2013-01-09   qudc               修改bug：3965  修改_getCellHtml方法,将代码：var cellData = data[dataIndex]||"";修改成var cellData = data[dataIndex]; 原来代码：var cellData = data[dataIndex]||""; 存在当grid列的数据为0时会自动转成""的问题，导致数字0不能显示 。
 * 2013-01-14   qudc               修改setSize方法，对设置进来的高、宽自动减去2，原因：grid组件的外框border占1px。
 * 2013-01-14   qudc               修复bug：4635  修复如果页面中有两个grid组件，生成的列id会重名，导致第一次排序列点击，不能清空默认排序列图标的问题。
 * 2013-02-18   qudc               修复需求:5008 解决当前页展现的数据少于10条时，数字列变得很窄的问题。原因：由于td的宽度由其下面具体的宽度来决定，所以将数字列的宽度放在td下面div标签进行设置。
 * 2013-02-18   qudc               修改需求5018，新增拖动列功能。修改属性cellMoveWidth，值由10修改成6，数据单元格新增biz_index属性，headEl绑定事件mousedown 。新增方法_moveColumnLine、_resetColumn、 _adjustHead、 _adjustColumnWidth。
 * 2013-02-23   qudc               修复bug：4704  解决列拖动时，进行翻页，内容列宽部分宽度没有自适应拖动后列头的宽度。
 * 2013-02-23   qudc               修复bug：4702  修改方法_moveColumnLine，设置列可拖拉的最小宽度为30px.放置快速拖动导致列很小。
 * 2013-02-28   qudc               修改需求：5174 ，新增方法getContextMenuData和事件onContextMenu。
 * 2013-03-13   qudc               新增方法selectRowsBydata 和 selectRowsByIndex ,供combogrid组件使用,暂未开放
 * 2013-10-09   hanyin             新增方法sortBy 和 sortDir 方法 ,获取当前排序的列字段名和排序是升序还是降序
 */

/**
 * @name FGrid
 * @class 
 * 数据表格，以表格的形式统一展现后台数据，支持单选、复选、分页、自定义列渲染和行样式设置。
 */

/**@lends FGrid# */


/**
 * 组件的唯一标识。
 * @name FGrid#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 设置在multiSelect和singleSelect模式下，点击行文本区，是否选中前面的复选框（单选框）。默认值为false。即点击行文本区时，不选中前面的复选框（单选框）
 * @name clickAndSelect
 * @type Boolean
 * @default false
 * @example
 * 无
 */

/**
 * ajax请求获取数据的请求地址。
 * @name FGrid#dataUrl
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 设置是否支持跨页选择。注意：只有在selectModel属性值为“multiSelect”时，该属性才有效。并且需要设置uniqueKey属性，用于生成区别行数据的唯一索引。
 * @name FGrid#crossPageSelect
 * @type Boolean
 * @default false
 * @example
 * 无
 */

/**
 * 用于生成区别行数据的唯一索引。注意：该属性只有在selectModel属性值为“multiSelect”，crossPageSelect属性为“true”时有效。
 * @name FGrid#uniqueKey
 * @type String
 * @default ""
 * @example
 *  <f:grid selectModel="multiSelect" crossPageSelect="true" uniqueKey="uniqueKey" ></f:grid>
 * function uniqueKey (itemData){
 *    return itemData['dataIndex1']+itemData['dataIndex2']+itemData['dataIndex2'];
 * }
 */

/**
 * grid组件没有数据时显示的内容。在fui_lang_zh_CN.js中，设置了该属性的默认值为“没有数据”。
 * @name FGrid#emptyMsg
 * @type String
 * @default "没有数据"
 * @example
 * 无
 */


/**
 * 设置列宽是否按照百分比显示。默认值为：false，即按照具体的列宽显示。
 * @name columnFit（todo）
 * @type Boolean
 * @default false
 * @example
 * 无
 */




/**
 * 设置Grid组件的行样式。默认显示斑马纹（奇偶行背景不一样）。该属性的使用方式有两种，如下所示：<br/>
 * <ol>
 *         <li>Array：<br/>
 *             例如：['class1','class2']<br/>
 *             表示第1/3/5/7/9...行背景样式使用样式'class1'.<br/>
 *             表示第2/4/6/8/10...行背景样式使用样式'class2'.<br/>
 *         </li>
 *         <li>Function：<br/>
 *             function(rowIndex,rowData){//rowIndex 行号， rowData 该行的数据 <br/>
 *                 var age = rowData.age;<br/>
 *                 if(age !==0 && !age)return ;<br/>
 *                 if(age < 18){<br/>
 *                     return 'class1';<br/>
 *                 } else if(18 <= age < 40) {<br/>
 *                     return 'class2';<br/>
 *                 } else {<br/>
 *
 *                 }<br/>
 *             }
 *         </li>
 * </ol>
 * @name rowClasses（todo）
 * @type Array[String]/Function
 * @default []
 * @example
 * 无
 */




/**
 * 选中某行数据。
 * @function
 * @name selectRows （todo）
 * @param indexes 类型：Array，行索引列表，如果Gird为单选，那么只有数组中第一个值有效。
 * @example
 */
/**
 * 取消某行数据。
 * @function
 * @name unSelectRows （todo）
 * @param indexes 类型：Array，行索引列表，如果Gird为单选，那么只有数组中第一个值有效。
 * @example
 */

/**
 * 选中当前页的所有行。只有当selectModel属性值为“multiSelect”时，该方法才有效。
 * @function
 * @name selectAll（todo）
 * @example
 */
/**
 * 清空所选中的行。
 * @function
 * @name unSelectAll （todo）
 * @example
 */




/**
 * 单击一行记录后触发。
 * @event
 * @name FGrid#onRowClick
 * @param rowData  类型：Object 当前行的数据。
 * @param rowIndex  类型：Number， 当前行数据的索引，从0开始。
 * @example
 *
 */

/**
 * 双击一行记录后触发
 * @event
 * @name FGrid#onRowDbClick
 * @param rowData  类型：Object 当前行的数据。
 * @param rowIndex  类型：Number， 当前行数据的索引，从0开始。
 * @example
 *
 */


/**
 * 选中一行记录后触发。
 * @event
 * @name FGrid#onRowSelect
 * @param rowData  类型：Object 当前行的数据。
 * @param rowIndex  类型：Number， 当前行数据的索引，从0开始。
 * @example
 *
 */

/**
 * 取消选中一行记录后触发。
 * @event
 * @name FGrid#onRowDeselect
 * @param rowData  类型：Object 当前行的数据。
 * @param rowIndex  类型：Number， 当前行数据的索引，从0开始。
 * @example
 *
 */


/**
 * 当点击鼠标右键的时候触发。
 * @event
 * @name onRightClick（todo）
 * @param thisCmp  类型：FUI.FGrid，当前组件的对象。
 * @param node  类型：Object 。当前节点的数据。
 * @param event 类型：Event 。HTML Event对象
 * @example
 *
 */

;
(function($) {
    $.widget("FUI.FGrid", {
        options : {
            /**
             * 组件的宽度
             * @name FGrid#width
             * @type Number
             * @default 600
             * @example
             * 无
             */
            width:600,
            /**
             * 组件的高度
             * @name FGrid#height
             * @type Number
             * @default 350
             * @example
             * 无
             */
            height:350,
            /**
             * 设置组件的初始化参数，默认为{}。
             * @name FGrid#baseParams
             * @type Object
             * @default    {}
             * @example
             * 无
             */
            baseParams :{},
            /**
             * 组件是否有数字列。默认值为：true，即有数字列。
             * @name FGrid#hasRowNumber
             * @type Boolean
             * @default true
             * @example
             * 无
             */
            hasRowNumber:true,
            /**
             * 设置组件行选择模式。默认值为：“normal”，即没有单选框和复选框模式。该属性还有其他两值可选:multiSelect（复选模式，有复选列） 和 singleSelect（单选模式，有单选列）。
             * @name FGrid#selectModel
             * @type String
             * @default "normal"
             * @example
             * 无
             */
            selectModel :"normal",

            /**
             * 列数据模型,该属性类型为Array.数组中的json对象保存各列的属性。这些属性如下：<br/>
             * <ol>
             *         <li>title：列标题。类型：String</li>
             *         <li>headerAlign：设置列标题居左、居中、居右显示。类型：String，可选值为："left"，"center"，"right"。默认值为"left"</li>
             *         <li>textAlign：设置单元格内容居左、居中、居右显示。类型：String，可选值为："left"，"center"，"right"。默认值为"left"</li>
             *         <li>width：列宽度。类型：Number</li>
             *         <li>dataIndex：对应后台服务返回数据中的字段。类型：String</li>
             *         <li>wordWrap：设置列内容是否自动换行，false表示当列内容超过列宽后不换行， true表示当列内容超过列宽的时候自动换行（英文字符串或者数字当做一个单词来处理，如果超过边界不会换行显示）。类型：Boolean,默认值为false。注意：使用该属(属性值为true）同时，又使用renderer函数，则需要在renderer函数中嵌套table（样式为“f-grid-cell-wrap”）来实现超出部分换行显示的功能。</li>
             *        <li>sortable：是否可排序。类型：Boolean,默认值为：false。请求中会添加两个参数：sortBy和sortDir。其中sortBy的值为需要排序的列的dataIndex属性值，sortDir的值为asc（升序）或者desc（降序）。</li>
             *        <li>defaultSortDir：设置默认排序是升序还是降序。类型：String,默认值为：null。该属性只有在sortable属性为true时才有效且只能配置一次，如果多列配置了该属性，首次配置的有效。</li>
             *        <li>renderer：自定义列渲染函数。类型：Function,默认值为：null。该函数会传递以下数据：(cellData , rowData, index)。其中：cellData为单元格的值，rowData为当前行的数据，index为当前行的索引号（从0开始）</li>
             * </ol> <br/>
             * <b ><span style="color:red;">注意事项：</span></b><br/>
             * 当使用jsp或者freemarker标签写页面的时候，grid组件<b>不需要配置属性</b>，用户只需要在grid标签内部嵌套column标签，并在column标签上配置相应的属性即可。column标签有一下属性：title、headAlign、textAlign、width、dataIndex、wordWrap、sortable,、defaultSortDir、renderer<br/>
             * 如果用户单独使用FUI的js库，则需要按照上面的格式配置完整的colModel属性。
             * @name FGrid#colModel
             * @type Array[JSON]
             * @default []
             * @example
             * 无
             */
            colModel:[],
            /**
             * 鼠标移到单元格上时，是否提示单元格内容。默认值为false，即不提示单元格内容。
             * @name FGrid#hasTips
             * @type Boolean
             * @default false
             * @example
             * 无
             */
            hasTips : false,
            columnFit : false,
            /**
             * 组件初始化时是否加载数据。默认是为:false,即默认不加载数据。
             * @name FGrid#autoload
             * @type Boolean
             * @default false
             * @example
             * 无
             */
            autoload :  false ,
            /**
             * 设置数字列的宽度。
             * @name FGrid#rowNumberWidth
             * @type Number
             * @default 24
             * @example
             *
             */
            rowNumberWidth :24
        },
        //创建方法,准备组件的变量。
        _create :function() {
            var element = this.element;
            var options = this.options;
            //单元格右边框
            this.cellBorderRightWidth = 1;
            //单元格左边距
            this.cellPaddingLeft = 6;
            //单元格右边距
            this.cellPaddingRight = 6;
            this.widthOffset = this.cellPaddingLeft + this.cellPaddingRight + this.cellBorderRightWidth;
            //modify by  qudc 2013-02-19  同步样式修改，将拖动列的宽度由原来10px修改成6px
            this.cellMoveWidth = 6;

            this.scrollOffset = 19;

            this.minColumnWidth = 30;

            //用于保存数据 ，默认值为空
            this.items = [];
            var UTILS = $Utils;


            //组件的宽度
            this.width = options.width || element.parent().innerWidth();
            //组件的高度
            this.height = options.height || element.parent().innerHeight();

            //保存列宽总和
            this.columnsWidth = 0;

            //当前页索引
            this.curPage = 1;
            this.start = 1;
            //保存当前页数据的存储对象
            this.dataCache = {};
            //保存当前页选中数据的存储对象
            this.selectCache = {};
            //保存当前页跨页选择数据的换成对象
            this.crossPageDataCache = {};

            this.id = element.attr('id');
            //标题区域
            this.headEl = $('#' + this.id + '-grid-head');
            //内容区域
            this.bodyEl = $('#' + this.id + '-grid-body');
            //分页栏区域
            var pagingbarId = options.pagingbarId;
            if (pagingbarId) {
                this.pageEl = $('#' + pagingbarId);
            } else {
                this.pageEl = this.element.children('.f-grid-page');
            }

            var toolbarId = options.toolbarId;
            //toolbar区域
            if (toolbarId) {
                this.toolbarEl = $('#' + toolbarId);
            } else {
                this.toolbarEl = this.element.children('.f-toolGroup');
            }


            //设置标题头和分页区域 不可选择
            this.headEl.closeSelect();
            this._bindEvent();
        },
        //初始化方法
        _init :  function() {
            this._renderHead();
            this.setSize(this.width, this.height);
            this._renderBody();
        },
        //对象销毁方法
        destroy : function() {
            this.headEl.unbind();
            this.bodyEl.unbind();
            //this.pageEl.unbind();
            this.headEl = null;
            this.bodyEl = null;
            this.pageEl = null;
            this.toolbarEl = null;
            this.dataCache = null;
            this.crossPageDataCache = null;
        },
        /**
         * 请求数据。 如果url不传，则请求url使用组件默认的dataUrl属性值。如果两个参数都不传，等同于重新请求当前页的数据。
         * @function
         * @name FGrid#load
         * @param params 可选 请求数据的参数
         * @param url 可选  请求数据的url地址
         * @example
         */
        load : function(params, url) {
            params = params || {};
            //如果分页
            var pagingbarId = this.options.pagingbarId;
            if (pagingbarId) {
                var $C = window['$Component'],UTILS = window['$Utils'];
                var pagingbarEl = $I(pagingbarId);
                var p = $C.tryCall(pagingbarEl, 'getDefaultParams').result;
                params = UTILS.applyIf(params, p);
            }
            this.resetDataCache(true, false);
            this._query(params, url);
        },

        loadForPagingbar : function(params) {
            this._query(params);
        },
        _renderHead : function() {
            var html = [],options = this.options;
            var remainWidth = this.width;
            var cellMoveWidth = this.cellMoveWidth;
            //每个单元格右边框
            var cellBorderRightWidth = this.cellBorderRightWidth;

            //读取用户配置信息
            var rowNumberWidth = options.rowNumberWidth;
            var hasRowNumber = options.hasRowNumber;
            var selectModel = options.selectModel;
            var colModel = options.colModel;
            var hasTips = options.hasTips;
            var columnFit = options.columnFit;

            var length = colModel.length;
            var totalColWidth;


            //每个单元格中的边框和边距的长度
            var widthOffset = this.widthOffset;
            html.push('<table id="' + this.id + "-head-table");
            html.push('" cellpadding="0" cellspacing="0" ><thead><tr>');
            if (hasRowNumber === true) {
                //数字列的dom结构
                var rowNumberHtml = this._getRowNumberHtml(rowNumberWidth);
                html.push(rowNumberHtml);
                remainWidth -= rowNumberWidth;
                this.columnsWidth += rowNumberWidth;
            }
            //复选
            if (selectModel === "multiSelect") {
                html.push('<th><div class="f-grid-checkbox-wrap">');
                html.push('<button class="f-grid-checkbox"  buz_type="all" buz_status="unchecked">');
                html.push('</button></div></th>');
                remainWidth -= 21;
                this.columnsWidth += 21;
            } else if (selectModel === "singleSelect") {
                //单选
                html.push('<th><div class="f-grid-radio-wrap"></div></th>');
                remainWidth -= 21;
                this.columnsWidth += 21;
            }

            if (columnFit) {
                for (var i = 0; i < length; i++) {
                    var cModel = colModel[i];
                    totalColWidth += cModel.width;
                }
            }
            for (var i = 0; i < length; i++) {
                var cModel = colModel[i],cWidth = cModel.width;
                var title = cModel.title,headerAlign = cModel.headerAlign;
                var sortable = cModel.sortable,
                        defaultSortDir = cModel.defaultSortDir,
                        dataIndex = cModel.dataIndex;
                this.columnsWidth += cWidth;
                //2013-02-01 修复bug：4635  modify  by qudc  修复如果页面中有两个grid组件，生成的列id会重名，导致第一次排序列点击，不能清空默认排序列图标的问题。
                var columnId = this.id + "-columnId" + i;
                //2013-02-01 修复bug：4635  modify  by  qudc

                if (columnFit) {
                    cWidth = cModel.widthPx = Math.floor((cWidth % totalColWidth) * remainWidth);
                }

                var headerBodyWidth = cWidth - widthOffset;
                html.push('<th>');
                var titleCls = "f-grid-title-inner";
                if (sortable) {
                    titleCls += " f-grid-cell-sortable"
                    if (defaultSortDir) {
                        if (!this.sortDir) {
                            this.sortDir = (defaultSortDir == 'asc') ? 'asc' : 'desc';
                            titleCls += " f-grid-cell-span-" + this.sortDir;
                        }
                        if (!this.sortBy) {
                            this.sortBy = dataIndex;
                        }
                        //start add qudc 2013-01-08
                        if (!this.defaultSortColumnId) {
                            this.defaultSortColumnId = columnId;
                        }
                        //end add qudc 2013-01-08
                    }
                }
                //外div
                //start modify qudc 2013-01-08   列头添加id属性
                html.push('<div id="' + columnId + '"  class="');
                //end modify  qudc  2013-01-08
                html.push(titleCls);
                html.push('" biz_index="' + i + '"');
                if (sortable) {
                    html.push(' sortable="true" ');
                    html.push(' sortBy="' + dataIndex + '" ');
                }
                html.push(' style="width:' + (cWidth - cellBorderRightWidth) + 'px;position:relative;">');
                //内部header的div
                html.push('<div class="f-grid-cell" style="position:relative;width:' + (headerBodyWidth - cellMoveWidth) + 'px;');
                if (headerAlign) {
                    html.push(' text-align :' + headerAlign + ';')
                }
                html.push('"');
                if (title && hasTips === true) {
                    html.push(' title="' + title + '"');
                }
                html.push('>');
                //是否有默认值排序 sortable defaultSortDir 将第一个defaultSortDir属性保存到组件属性中，并保存其所对应的列的dataIndex。
                html.push('<span class="f-grid-cell-span-text" >');
                html.push(title || '');
                html.push('</span>');
                html.push('</div>');

                //设置拖拽div的位置
                html.push("<div class='f-grid-cell-move-right'></div>");
                html.push("</div>");
                html.push("</th>");
            }

            html.push('<td ><div style="width:' + this.scrollOffset + 'px;" ></div></td>')

            html.push("</tr></thead></table>");
            this.headEl.html(html.join(""));
            //start add qudc 2013-01-08
            if (this.defaultSortColumnId) {
                this.sortEl = $I(this.defaultSortColumnId);
            }
            //end add qudc 2013-01-08
        },

        _getRowNumberHtml : function(width) {
            var html = [];
            html.push('<th><div class="f-grid-row-number" style="width:');
            html.push(width);
            html.push('px;"></div></th>');

            return html.join('');
        },
        _renderBody : function() {
            var options = this.options;
            //发送请求并获取数据 ，根据数据生成HTML
            if (options.autoload) {
                this.load();
            } else {
                this._clearBody();
            }
        },

        //发送请求获取数据
        //var json = {
        //  data:{tocalCount:100,listData:[{name:"xx",age:"12"},{name:"yy",age:"12"},{name:"zz",age:"15"}]},
        //  data:[{name:"xx",age:"12"},{name:"yy",age:"12"},{name:"zz",age:"15"}]
        //  returnCode : 0,
        //  errorInfo :'asdasd',
        //  errorNo :null
        //}
        _query : function(p, url) {
            var options = this.options,UTILS = window['$Utils'],ME = this;
            //如果复选，则重置下head头部的复选框
            if ("multiSelect" == options.selectModel) {
                var headCheckBoxEl = this.headEl.find('button.f-grid-checkbox');
                headCheckBoxEl.removeClass('f-grid-checkbox-checked');
            }
            var baseParams = options.baseParams;
            var params = {};
            if (p && typeof(p) === 'object') {
                params = $.extend({}, baseParams, p);
            } else {
                params = baseParams;
            }

            if (this.sortBy && this.sortDir) {
                params = $.extend(params, {"sortBy":this.sortBy,"sortDir":this.sortDir});
            }

            url && (  this.options.dataUrl = url );
            var dataUrl = this.options.dataUrl;
            if (!dataUrl) {
                return;
            }
            //判断是否需要加上上下文路径，规则是，以“/”开头不加，否则加
            if (dataUrl.indexOf("/") !== 0) {
                dataUrl = UTILS.getContextPath() + "/" + dataUrl;
            }

            /**
             * 请求发送前触发，可用于添加遮罩组件。
             * @event
             * @name FGrid#onBeforesend
             * @param jqXHR  XMLHTTPReques对象。
             * @example
             *
             */
            var beforeSendFn = function(XMLHttpRequest) {
                if ($.isFunction(options.onBeforesend)) {
                    options.onBeforesend(XMLHttpRequest);
                }
            };
            var pagingbarId = options.pagingbarId;
            //请求数据成功
            var successFn = function(data, textStatus, XMLHTTPReques) {
                var items = data.data;
                //生成表格元素
                ME._generateBody(items);
                // 重置列头信息
                ME._reposHeader();
                if (pagingbarId) {
                    var $C = window['$Component'];
                    var totalCount = ME.totalCount;
                    var listCount = ME.listData.length;
                    $C.tryCall($I(pagingbarId), 'resetPagebar', listCount, totalCount)
                }
                /**
                 * 请求成功时触发
                 * @event
                 * @name FGrid#onLoadsuccess
                 * @param data  请求返回的数据。类型为“page”。
                 * @param textStatus  请求状态。
                 * @param jqXHR  XMLHTTPReques对象。
                 * @example
                 *
                 */
                if ($.isFunction(options.onLoadsuccess)) {
                    options.onLoadsuccess(data, textStatus, XMLHTTPReques);
                }
            };
            /**
             * 请求成功但returnCode为1或者-1时触发。
             * @event
             * @name FGrid#onLoadfailure
             *  @param data  请求返回的数据。
             * @param textStatus  请求状态。
             * @param jqXHR  XMLHTTPReques对象。
             * @example
             *
             */
            var failureFn = function(data, textStatus, XMLHTTPReques) {
                if ($.isFunction(options.onLoadfailure)) {
                    options.onLoadfailure(data, textStatus, XMLHTTPReques);
                }
            };

            /**
             * 请求失败时触发。例如：ajax超时，网络中断。
             * @event
             * @name FGrid#onLoadError
             * @param XMLHTTPReques  XMLHTTPReques对象。
             * @param textStatus  请求状态，通常 textStatus 和 errorThrown 之中。
             * @param errorThrown  错误信息，通常 textStatus 和 errorThrown 之中。
             * @example
             *
             */
            //请求数据失败
            var errorFn = function(XMLHTTPReques, textStatus, errorThrown) {
                if ($.isFunction(options.onLoadError)) {
                    options.onLoadError(XMLHTTPReques, textStatus, errorThrown);
                }
            }
            params["_respType"] = "page";
//            $.ajax({
//                url: dataUrl,
//                dataType: "json",
//                data: params,
//                context :this,
//                success: success ,
//                error:error ,
//                type:"POST"
//            });

            $.FUI.FAjax.remote({
                type:"POST",
                url:  dataUrl,
                dataType: "json",
                data: params,
                context :this,
                beforeSend  :beforeSendFn,
                success: successFn ,
                failure:failureFn ,
                error : errorFn
            });

        },
        
        /**
         * 返回当前排序的列字段名
         * @function
         * @return String对象 字段名
         * @example
         */
        getSortBy : function() {
        	return this.sortBy;
        },
        
        /**
         * 返回当前排序是升序（"asc"）还是降序（"desc"）
         * @function
         * @return String对象 "asc"表示升序，"desc"表示降序
         * @example
         */
        getSortDir : function() {
        	return this.sortDir;
        },
        
        // 重置列头信息
        _reposHeader : function() {
        	this.headEl.scrollLeft(this.bodyEl.scrollLeft());
        },
        //根据数据生成对应的HTML
        _generateBody : function(data) {
            //获取分页条数
            this._transferData(data);

            var itemLen = this.listData.length;
            var count = 0;
            var html = [];
            var hasRowNumber = this.options.hasRowNumber;
            var selectModel = this.options.selectModel;
            var rowClasses = this.options.rowClasses;
            var hasRowClsArr = $.isArray(rowClasses);
            var rowLoop = hasRowClsArr ? rowClasses.length : 2;

            html.push("<table id='" + this.id + "-body-table'");
            html.push(" cellpadding='0' cellspacing='0' ><tbody>");
            for (var i = 0; i < itemLen; i++) {

                count = (i) % rowLoop;
                var itemData = this.listData[i];
                this.dataCache["" + i] = itemData;
                //跨页选择
                var isContained = this._isContained(itemData);
                html.push("<tr");
                //如果有自定义的行样式
                if (hasRowClsArr) {
                    html.push(" class='f-grid-row " + rowClasses[count]);
                } else {
                    html.push(count < 1 ? " class='f-grid-row f-grid-tr-odd" : " class='f-grid-row f-grid-tr-even");
                }
                //只有在复选模式，且开启跨页选择功能时，isContained才有可能返回true。如果返回值为true，则说明支持跨页选择，并且该条数据原先被选中过。
                if (isContained) {
                    html.push(" f-grid-tr-checked'");
                } else {
                    html.push("'");
                }

                html.push(" dIndex='" + i + "'");
                html.push(" f-grid-row='true' >");
                if (hasRowNumber) {
                    var rowHeaderHtml = this._getRowHeadHtml(i + 1);
                    html.push(rowHeaderHtml);
                }
                if (selectModel === "multiSelect") {
                    var checkboxHtml = this._getCheckboxHtml(isContained);
                    html.push(checkboxHtml);
                }
                if ("singleSelect" === selectModel) {
                    var radioHtml = this._getRadioHtml();
                    html.push(radioHtml);
                }
                var cellHtml = this._getCellHtml(itemData, i);

                html.push(cellHtml);
                html.push("</tr>");
            }
            html.push("</tbody></table>");

            //拿到分页条数 和 当前页数据。
            this.bodyEl.html(html.join(""));
            //保存data数据
            this.items = data;
        },
        //生成复选框 单选框 数字列 的html
        _getRowHeadHtml : function(index) {
            var html = [];
            var rowNumberWidth = this.options.rowNumberWidth;
            //start 2013-02-18 modify by  qudc 修复需求:5008 解决当前页展现的数据少于10条时，数字列变得很窄的问题。原因：由于td的宽度由其下面具体的宽度来决定，所以将数字列的宽度放在td下面div标签进行设置
            html.push("<td class= 'f-grid-body-td f-grid-row-numberbg' >");
            if (index !== undefined) {
                html.push("<div");
                if (rowNumberWidth) {
                    html.push(" style='width:" + (rowNumberWidth) + "px;'");
                }
                html.push(">");
                html.push("<div class='f-grid-row-numbertext'>");
                html.push(index);
                html.push("</div>");
                html.push("</div>");
            }
            //end 2013-02-18 modify by qudc
            html.push("</td>");
            return html.join("");
        },
        _getCheckboxHtml : function(isContained) {
            var html = [],options = this.options;

            html.push("<td class='f-grid-checkbox-td'><div class='f-grid-checkbox-wrap'>");
            if (options.crossPageSelect && options.uniqueKey) {
                //  跨页选中
                //判断当前页的数据是否在选中的缓存数据中保存，如果是，则选中复选框 。
                if (isContained) {
                    html.push("<button class='f-grid-checkbox f-grid-checkbox-checked' buz_type='single'  buz_status='checked' >");
                } else {
                    html.push("<button class='f-grid-checkbox' buz_type='single'  buz_status='unchecked' >");
                }
            } else {
                html.push("<button class='f-grid-checkbox' buz_type='single'  buz_status='unchecked' >");
            }
            html.push("</button></div></td>");
            return html.join("");
        },
        _isContained: function(itemData) {
            var options = this.options;
            var uniqueKeyFn = options.uniqueKey;
            var uniqueKey = "";
            if (uniqueKeyFn) {
                uniqueKey = uniqueKeyFn(itemData);
            }
            var data = this.crossPageDataCache;
            if (uniqueKey) {
                if (data[uniqueKey]) {
                    return true
                }
            }
            return false;
        },
        _getRadioHtml :function() {
            var html = [];
            html.push("<td class='f-grid-radio-td'><div class='f-grid-radio-wrap'>");
            html.push("<button class='f-grid-radio' buz_type='single'  buz_status='unchecked' >");
            html.push("</button></div></td>");
            return html.join("");
        },
        //生成单元格的html
        _getCellHtml : function(data, index) {
            var html = [],options = this.options;
            var colModel = options.colModel;
            var hasTips = options.hasTips;
            var colLen = colModel.length;
            var widthOffset = this.cellPaddingLeft + this.cellPaddingRight + this.cellBorderRightWidth;
            for (var j = 0; j < colLen; j++) {
                var cModel = colModel[j],cWidth = cModel.width;
                var textAlign = cModel.textAlign;
                var renderer = cModel.renderer;
                var wordWrap = cModel.wordWrap;
                if (this.percent === true) {
                    cWidth = cModel.widthPx;
                }
                var dataIndex = cModel.dataIndex;
                var tdWidth = 0;
                //2013-01-09 bug：3965   start by qudc  原来代码：var cellData = data[dataIndex]||""; 存在当grid列的数据为0时会自动转成""的问题，导致数字0不能显示 。
                var cellData = data[dataIndex];
                //2013-01-09  bug：3965  end  by qudc

                html.push("<td>");
                html.push("<div class='f-grid-cell' ");
                //start add by  qudc 2013-02-19 表格内容新增biz_index属性，用于拖动列时查找单元格元素并改变单元格宽度
                html.push(" biz_index='" + j + "'");
                //end add  by qudc  2013-02-19
                html.push(" style='width:" + (cWidth - widthOffset) + "px;");
                if (textAlign) {
                    html.push(" text-align:" + textAlign);
                }

                html.push("'");
                if (hasTips) {
                    html.push(" title='");
                    html.push(cellData);
                    html.push("'")
                }
                html.push(">");

                if (wordWrap === true) {
                    cellData = "<table cellpadding='0' cellspacing='0' class='f-grid-cell-wrap' biz_index='" + j + "' style='width:" + (cWidth - widthOffset) + "px;'><tr><td style='border-width:0px;'>" + cellData + "</td></tr></table>";
                }
                if (renderer) {
                    var cellData = data[dataIndex];
                    cellData = renderer(cellData, data, index);
                }
                html.push(cellData);
                html.push("</div>");
                html.push("</td>");
            }
            return html.join("");
        },
        _transferData :function(data) {
            if (!(data instanceof Object)) {
                this.listData = [];
                return;
            }
            this.totalCount = data.totalCount;
            this.listData = data.listData || [];
        },

        //清空body区域的内容
        _clearBody : function() {
            var hw = this.headEl.children("table").outerWidth(true);
            var bodyHtml = [];
            bodyHtml.push("<div class='f-empty-div' style='width:" + hw + "px;'>");
            var I18NMsg = $.FUI.lang && $.FUI.lang.grid.emptyMsg;
            var emptyMsg = this.options.emptyMsg;
            if (emptyMsg) {
                bodyHtml.push(emptyMsg);
            } else if (I18NMsg) {
                bodyHtml.push(I18NMsg);
            }
            bodyHtml.push("</div>");
            this.bodyEl.html(bodyHtml.join(""));
        },
        _bindEvent : function() {
            var ME = this;
            var bodyEl = this.bodyEl;
            var headEl = this.headEl;
            var UTILS = $Utils;
            var selectModel = this.options.selectModel;
            bodyEl.scroll(function(e) {
                ME._reposHeader();
            });
            bodyEl.bind({
                //点击选择一行
                click : function(e) {
                    var tar = e.target;
                    var tarEl = $(tar);
                    var rowEls = tarEl.parents("tr[f-grid-row='true']");
                    if (rowEls.length > 0) {

                        var options = ME.options;

                        var onRowClick = options.onRowClick;
                        var onRowDeselect = options.onRowDeselect;
                        var onRowSelect = options.onRowSelect;

                        var rowDom = rowEls.get(0);
                        var rowEl = $(rowDom);
                        var index = rowEl.attr("dIndex");
                        if ("multiSelect" == selectModel) {
                            var checkboxEl = rowEl.find("button.f-grid-checkbox");
                            var status = checkboxEl.attr("buz_status");
                            if ("unchecked" == status) {
                                checkboxEl.attr("buz_status", "checked");
                                UTILS.addClass(checkboxEl.get(0), "f-grid-checkbox-checked");
                                UTILS.addClass(rowDom, "f-grid-tr-checked");
                                var dataCache = ME.dataCache[index];
                                ME.selectCache[index] = dataCache;
                                // 触发 onRowSelect事件， 传递的参数：选中的行数据，选中的行号.
                                onRowSelect && onRowSelect(dataCache, index);
                                // 放入crossPageDataCache缓存对象中的数据
                                if (options.crossPageSelect && options.uniqueKey) {
                                    var key = options.uniqueKey(dataCache);
                                    ME.crossPageDataCache[key] = dataCache;
                                }
                            } else {
                                checkboxEl.attr("buz_status", "unchecked");
                                UTILS.removeClass(checkboxEl.get(0), "f-grid-checkbox-checked");
                                UTILS.removeClass(rowDom, "f-grid-tr-checked");
                                var dataCache = ME.dataCache[index];
                                delete ME.selectCache[index];
                                // 触发 onRowSelect事件， 传递的参数：取消选中的行数据，取消选中行的索引编号.
                                onRowDeselect && onRowDeselect(dataCache, index);
                                // 移除crossPageDataCache缓存对象中的数据
                                if (options.crossPageSelect && options.uniqueKey) {
                                    var key = options.uniqueKey(dataCache);
                                    delete ME.crossPageDataCache[key];
                                }
                            }
                            checkboxEl = null;

                        } else {
                            //查找选中的节点
                            var clsName = rowDom.className;
                            if (clsName.contains("f-grid-tr-checked")) {
                                //do nothing
                            } else {
                                var selectedRow = bodyEl.find("tr.f-grid-tr-checked");
                                if (selectedRow.length) {
                                    var selectedDom = selectedRow.get(0);
                                    UTILS.removeClass(selectedDom, "f-grid-tr-checked");
                                    var dIndex = $(selectedDom).attr("dIndex");
                                    //触发onRowDeselect事件， 传递的参数：取消选中的行数据，取消选中行的索引编号.
                                    onRowDeselect && onRowDeselect(ME.dataCache[dIndex], dIndex);
                                }
                                UTILS.addClass(rowDom, "f-grid-tr-checked");
                                //触发onRowSelect事件， 传递的参数：取消选中的行数据，取消选中行的索引编号.
                                onRowSelect && onRowSelect(ME.dataCache[index], index);
                            }

                            if ("singleSelect" == selectModel) {
                                var radioEl = rowEl.find("button.f-grid-radio");
                                var rowClsName = radioEl.get(0).className;
                                if (rowClsName.contains("f-grid-radio-checked")) {
                                    //已选中 ，不做任何处理。
                                } else {
                                    var selectRadioEl = bodyEl.find("button.f-grid-radio-checked");
                                    //移除其他行选中的记录
                                    if (selectRadioEl.length > 0) {
                                        UTILS.removeClass(selectRadioEl.get(0), "f-grid-radio-checked");
                                    }
                                    //选中当前radion
                                    radioEl.attr("buz_status", "checked");
                                    UTILS.addClass(radioEl.get(0), "f-grid-radio-checked");
                                }
                            }
                            ME.selectCache = {};
                            ME.selectCache[index] = ME.dataCache[index];
                        }

                        // 触发单选事件 onRowClick 传递的参数：选中的行数据，选中的行号.
                        onRowClick && onRowClick(ME.dataCache[index], index);
                    }
                },
                //有双击事件才添加，触发双击事件 以及行选中
                dblclick : function(e) {
                    var tar = e.target;
                    var tarEl = $(tar);
                    var rowEls = tarEl.parents("tr[f-grid-row='true']");
                    if (rowEls.length > 0) {
                        var rowDom = rowEls.get(0);
                        var rowEl = $(rowDom);
                        var index = rowEl.attr("dIndex");
                        // 触发单选事件 onRowClick 传递的参数：选中的行数据，选中的行号，
                        var onRowDbClick = ME.options.onRowDbClick;
                        onRowDbClick && onRowDbClick(ME.dataCache[index], index);
                    }
                },
                contextmenu: function(e) {
                    var onContextMenuFn = ME.options.onContextMenu;
                    var target = e.target,el = $(target);
                    var rowEl = el.parents('tr[f-grid-row="true"]');
                    var rowIndex = rowEl.attr('dindex');
                    ME.contextMenuData = {rowIndex:rowIndex,rowData:ME.dataCache[rowIndex]};
                    /**
                     * 表格内容区域右键菜单触发的事件。
                     * @event
                     * @name FGrid#onContextMenu
                     * @param e  鼠标事件
                     * @example
                     *
                     */
                    onContextMenuFn && onContextMenuFn(e);
                    //阻止事件默认行为
                    if (e.preventDefault) {
                        e.preventDefault();
                    } else {
                        window.event.returnValue = false;
                    }
                    //阻止事件冒泡
                    UTILS.stopPropagation(e);
                    return false;
                }
            });

            headEl.bind({
                click: function(e) {
                    var target = e.target,
                            targetEl = $(target),
                            nodeName = target.nodeName.toLowerCase();
                    className = target.className,
                            buz_type = targetEl.attr('buz_type'),
                            buz_status = targetEl.attr('buz_status');
                    //全选功能的代码实现
                    if (className.indexOf("f-grid-checkbox") != -1 && "all" == buz_type) {
                        //如果是复选框，则进行全选或者全不选。
                        if ("unchecked" == buz_status) {
                            //原先未选中，则选中当前页全部数据。
                            ME._selectAll();
                            //改变按钮的样式
                            targetEl.addClass("f-grid-checkbox-checked");
                            targetEl.attr('buz_status', 'checked');
                        } else if ("checked" == buz_status) {
                            //原先已选中，则取消选中当前页的全部数据
                            ME._unSelectAll();
                            //改变按钮的样式
                            targetEl.removeClass("f-grid-checkbox-checked");
                            targetEl.attr('buz_status', 'unchecked');
                        }
                    }

                    //列头排序功能代码
                    var sortEl;
                    if ('span' == nodeName) {
                        //判断下组件的样式
                        if (className == "f-grid-cell-span-text") {
                            sortEl = $(target).parent().parent();
                        }
                    } else if ('div' == nodeName) {
                        if (className == "f-grid-cell" || className == "f-grid-cell-move-right") {
                            sortEl = $(target).parent();
                        } else if (className.indexOf("f-grid-title-inner") != -1) {
                            sortEl = $(target);
                        }
                    }
                    if (sortEl && sortEl.length && sortEl.attr('sortable') == "true") {
                        var sortClasName = sortEl.attr('class');
                        //移除之前的最近点击列的样式 。
                        if (ME.sortEl) {
                            ME.sortEl.get(0).className = "f-grid-title-inner f-grid-cell-sortable";
                        }
                        //修改图标的样式
                        if (sortClasName.indexOf('-desc') !== -1) {
                            sortEl.get(0).className = "f-grid-title-inner f-grid-cell-sortable f-grid-cell-span-asc";
                            ME.sortDir = "asc";
                        } else if (sortClasName.indexOf('-asc') !== -1) {
                            sortEl.get(0).className = "f-grid-title-inner f-grid-cell-sortable f-grid-cell-span-desc";
                            ME.sortDir = "desc";
                        } else {
                            sortEl.get(0).className = "f-grid-title-inner f-grid-cell-sortable f-grid-cell-span-desc";
                            ME.sortDir = "desc";
                        }
                        //保存具体的参数
                        ME.sortBy = sortEl.attr('sortBy');

                        //重新加载数据
                        var $C = window['$Component'],UTILS = window['$Utils'];
                        var pagingbarId = ME.options.pagingbarId;
                        var pagingbarEl = $I(pagingbarId);
                        var params = $C.tryCall(pagingbarEl, 'getParams').result;
                        //清空数据
                        ME.resetDataCache(false, false);
                        ME._query(params);
                        ME.sortEl = sortEl;
                        sortEl = null;
                    }
                },
                // add by  qudc 2013-02-19  新增绑定mousedown事件
                mousedown:$.proxy(function(e) {
                    var target = e.target,cls = target.className;
                    var documentEl = $(document),bodyEl = $('body'),el = $(target);
                    //如果选中的是列头右边可拖拉部分的内容
                    if (cls === 'f-grid-cell-move-right') {
                        var index = el.parent().attr('biz_index');
                        var offset = el.offset()
                        var height = this.headEl.outerHeight() + this.bodyEl.outerHeight();
                        //生成实线
                        var lineHtml = [];
                        lineHtml.push("<div id='grid-move-line' style='");
                        lineHtml.push("height:" + height + "px;");
                        lineHtml.push("left:" + e.pageX + "px;");
                        lineHtml.push("top:" + offset.top + "px;");
                        lineHtml.push("' biz_index='" + index + "'");

                        lineHtml.push("></div>");
                        bodyEl.append(lineHtml.join(""));
                        //关闭文档可编辑
                        this.element.closeSelect();

                        this.gridMoveLineEl = $('#grid-move-line');
                        this.gridMousePos = {pageX:e.pageX};
                        this.gridMousePosInit = {pageX:e.pageX};
                        this.activeHeadEl = this.headEl.find('div[biz_index="' + index + '"]');
                        this.activeHeadWidth = this.activeHeadEl.width();
                        //添加mousemove事件
                        documentEl.mousemove($.proxy(this._moveColumnLine, this));

                        //添加mouseup事件
                        documentEl.one('mouseup', $.proxy(this._resetColumn, this));


                    }
                }, this)
            });
        },
        /**
         * 获取右键菜单选中行的数据。该方法只有绑定右键菜单时才会用到。例如：绑定右键菜单，弹出FMenu，点击FMenu子列表，获取右键选中行的数据。
         * @function
         * @name FGrid#getContextMenuData
         * @return object对象  例如：{"rowIndex":"3","rowData":{"name":"张三","age":"24"}}
         * @example
         */
        getContextMenuData : function() {
            return this.contextMenuData;
        },
        // add by  qudc 2013-02-19  组件新增列拖动功能
        // 当鼠标移动的时候，移动提示线
        _moveColumnLine : function(e) {
            var moveLineEl = this.gridMoveLineEl;
            var mousePos = this.gridMousePos;
            var mousePosInit = this.gridMousePosInit;
            if (!moveLineEl || !mousePos) {
                return;
            }

            var pageX = e.pageX;
            var x = pageX - mousePos.pageX;
            var headWidth = this.activeHeadWidth + (pageX - mousePosInit.pageX);

            var headLineLeft = this.activeHeadEl.offset().left;
            var moveLineLeft = moveLineEl.offset().left;
            if (headWidth >= this.minColumnWidth) {
                var posX = moveLineLeft + x;
                moveLineEl.get(0).style.left = posX + 'px';
                mousePos.pageX = pageX;
            } else {
                var posX = headLineLeft + this.minColumnWidth;
                moveLineEl.get(0).style.left = posX + 'px';
                mousePos.pageX = posX;
            }
            e.stopPropagation();
        },
        // add by  qudc 2013-02-19  组件新增列拖动功能
        // 当鼠标放开时，重新计算列的宽度
        _resetColumn : function(e) {
            var target = e.target ,el = $(target);
            var index = this.gridMoveLineEl.attr('biz_index');
            var left = this.gridMoveLineEl.offset().left;
            var offset = left - this.gridMousePosInit.pageX;
            var columnWidth = this.activeHeadEl.width() + offset;
            this.options.colModel[index].width = columnWidth + this.cellBorderRightWidth;
            //计算列头宽度
            this._adjustHead(index, columnWidth);
            //计算列单元格宽度
            this._adjustColumnWidth(index, columnWidth);
            //移除移动列
            this.gridMoveLineEl.remove();
            //开放文本区域可编辑
            this.element.openSelect();

            //解除mousemove事件的绑定
            $(document).unbind('mousemove', this._moveColumnLine);
            //重置缓存变量
            this.gridMoveLineEl = null;
            this.gridMousePos = null;
            this.gridMousePosInit = null;
            this.activeHeadEl = null;
        },
        // add by  qudc 2013-02-19  组件新增列拖动功能
        // 当鼠标放开时，重新计算列头的宽度
        _adjustHead : function(index, columnWidth) {
            if (index < 0) {
                return;
            }
            var headInnerEl = this.activeHeadEl;
            var cellMoveWidth = this.cellMoveWidth;
            var cellPaddingLeft = this.cellPaddingLeft;
            var cellPaddingRight = this.cellPaddingRight;
            var headCellEl = this.activeHeadEl.children('div:first');
            headInnerEl.width(columnWidth);
            headCellEl.width(columnWidth - cellPaddingLeft - cellPaddingRight - cellMoveWidth);

        },
        // add by  qudc 2013-02-19  组件新增列拖动功能
        // 当鼠标放开时，重新计算列头的宽度
        _adjustColumnWidth :function(index, columnWidth) {
            if (index < 0) {
                return;
            }
            //调整列内容的宽度
            var cellPaddingLeft = this.cellPaddingLeft;
            var cellPaddingRight = this.cellPaddingRight;
            var cellBorderRightWidth = this.cellBorderRightWidth;
            var isWordWrap = this.options.colModel[index].wordWrap;
            var columnCellEl;
            // start modify by  qudc  2013-02-23  修复bug：4704  解决列拖动时，进行翻页，内容列宽部分宽度没有自适应拖动后列头的宽度。
            if (true === isWordWrap) {
                columnCellEl = this.bodyEl.children('table').find("div[biz_index='" + index + "']");
                var columnCellInnerEl = this.bodyEl.children('table').find("table[biz_index='" + index + "']");
                var width = columnWidth - cellPaddingLeft - cellPaddingRight;
                columnCellInnerEl.width(width);
                columnCellEl.width(width);
            } else {
                columnCellEl = this.bodyEl.children('table').find("div[biz_index='" + index + "']");
                var width = columnWidth - cellPaddingLeft - cellPaddingRight;
                columnCellEl.width(width);
            }
            //end modify by qudc 2013-02-23

        },

        /**
         * 获取当前页的所有数据,返回的数据类型是Array 。
         * @function
         * @name FGrid#getAllData
         * @return Array[object]对象
         * @example
         */
        getAllData :function() {
            return this.listData || [];
        },
        /**
         * 获取选中行的数据,返回的数据类型是Array 。
         * @function
         * @name FGrid#getSelectedDatas
         * @return Array[object]对象
         * @example
         */
        getSelectedDatas : function() {
            var options = this.options;
            var selectData = this.selectCache;
            if (("multiSelect" == options.selectModel) && options.crossPageSelect && options.uniqueKey) {
                selectData = this.crossPageDataCache;
            }
            var dataArr = [];
            for (var o in selectData) {
                var data = selectData[o];
                if (data) {
                    dataArr.push(data);
                }
            }
            return dataArr;
        },
        _getColumnsWidth : function() {
            return this.columnsWidth;
        },

        /**
         * 设置组件的高宽。
         * @function
         * @name FGrid#setSize
         * @param width  类型：Number 组件的宽度
         * @param height  类型：Number 组件的高度
         * @return
         * @example
         *
         */
        setSize : function(w, h) {


            if (w && typeof(w) === "number" && w > 0) {
                //border的宽度
                w = w - 2;
                var innerWidth = w;
                this.element.get(0).style.width = innerWidth + "px";
                this.headEl.get(0).style.width = innerWidth + "px";
                this.bodyEl.get(0).style.width = innerWidth + "px";

                //this.toolbarEl.length && (this.toolbarEl.get(0).style.width = innerWidth + "px");
            }
            if (h && typeof(h) === "number" && h > 0) {
                //border的宽度
                h = h - 2;
                var hh = this.headEl.outerHeight();
                var ph = 0,th = 0;
                this.pageEl.length && (ph = this.pageEl.outerHeight());
                this.toolbarEl.length && (th = this.toolbarEl.outerHeight());
                var bodyH = h - hh - ph - th;
                if (bodyH > 0) {
                    this.bodyEl.get(0).style.height = bodyH + "px";
                }
            }
        },

        /**
         * 重新设置当前组件的参数。
         * @function
         * @name FGrid#setBaseParams
         * @param params  类型：Object。
         * @return void
         * @example
         *
         */
        setBaseParams :function(params) {
            if (typeof params == 'object') {
                this.options.baseParams = params;
            }
        },
        //重新设置数据缓存对象
        resetDataCache:function(isReload, isRefresh) {
            var options = this.options;
            //如果支持跨页复选，从crossPageDataCache属性中移除当前页选中的数据
            if (isRefresh && "multiSelect" == options.selectModel && options.crossPageSelect && options.uniqueKey) {
                var selectCache = this.selectCache;
                for (var p in selectCache) {
                    var data = selectCache[p];
                    var key = options.uniqueKey(data);
                    delete this.crossPageDataCache[key];
                }
            }
            //清空dom节点
            this.bodyEl.html('');
            //清空当前页缓存数据。
            this.dataCache = {};
            //清空选中的数据。
            this.selectCache = {};
            //清空跨页数据缓存对象。
            if (isReload) {
                this.crossPageDataCache = {};
            }
        },
        //选中当前页的所有数据
        _selectAll : function() {
            var options = this.options;
            var checkBoxEls = this.bodyEl.find("button.f-grid-checkbox");
            var trEls = this.bodyEl.find('tr.f-grid-row');
            //改变复选框的样式，全部为选中状态。
            //var len = checkBoxEls.size();
            checkBoxEls.addClass("f-grid-checkbox-checked");
            checkBoxEls.attr("buz_status", "checked");

            trEls.addClass("f-grid-tr-checked");
            if (("multiSelect" == options.selectModel) && options.crossPageSelect && options.uniqueKey) {
                //跨页选择模式，将当前页的数据保存到 crossPageDataCache中。
                var dataCache = this.dataCache;
                for (var p in dataCache) {
                    var data = dataCache[p];
                    var key = options.uniqueKey(data);
                    this.crossPageDataCache[key] = data;
                }
            } else {
                //普通模式，将当前页数据保存到 selectCache中。
                var dataCache = this.dataCache;
                this.selectCache = null;
                this.selectCache = {};
                for (var p in dataCache) {
                    this.selectCache[p] = dataCache[p];
                }
            }
        } ,
        //取消选中当前页
        _unSelectAll : function() {
            var options = this.options;
            var checkBoxEls = this.bodyEl.find("button.f-grid-checkbox");
            var trEls = this.bodyEl.find('tr.f-grid-row');
            //改变复选框的样式，全部为选中状态。
            checkBoxEls.removeClass("f-grid-checkbox-checked");
            checkBoxEls.attr("buz_status", "unchecked");

            trEls.removeClass("f-grid-tr-checked");
            if (("multiSelect" == options.selectModel) && options.crossPageSelect && options.uniqueKey) {
                //跨页选择模式，将当前页的数据保存到 crossPageDataCache中。
                var dataCache = this.dataCache;
                for (var p in dataCache) {
                    var data = dataCache[p];
                    var key = options.uniqueKey(data);
                    delete this.crossPageDataCache[key];
                }
            } else {
                //普通模式，将当前页数据保存到 selectCache中。
                this.selectCache = null;
                this.selectCache = {};
            }
        },
        /**
         * 根据具体数据，选择
         * @param data 类型：Array 需要选择的数据
         * @param dataIndex   具体列的索引
         */
        selectRowsBydata : function(data, dataIndex) {
            if (!$.isArray(data)) {
                return;
            }
            var length = data.length;
            var listData = this.listData;
            var listLen = listData.length;

            for (var i = 0; i < length; i++) {
                for (var j = 0; j < listLen; j++) {
                    if ("" + listData[j][dataIndex] == data[i]) {
                        this.selectRowsByIndex(j);
                    }
                }
            }
        },
        /**
         * 根据索引行号选中指定行
         * @param index
         */
        selectRowsByIndex : function(index) {
            var options = this.options;
            var listData = this.listData;
            var data = listData[index];

            //将该行数据保存到选中行数据中
            if ("multiSelect" == options.selectModel) {
                if (options.crossPageSelect && options.uniqueKey) {
                    //跨页选择模式，将当前页的数据保存到 crossPageDataCache中。
                    var key = options.uniqueKey(data);
                    this.crossPageDataCache[key] = data;
                }
                //将当前行数据放置到选中数据中
                this.selectCache[index] = data;
            } else {
                this.selectCache = null ;
                this.selectCache = {};
                this.selectCache[index] = data;
            }
            var trEl = this.bodyEl.find('tr[dindex='+index+']');
            trEl.addClass('f-grid-tr-checked');
            trEl.attr('f-grid-row','true');
            var buttonEl = trEl.find('button');
            buttonEl.addClass('f-grid-checkbox-checked');
            buttonEl.attr('buz_status','checked');
        }
    });
})(jQuery);/**
 * @name FPanel
 * @class 
 * 面板容器，是一种面向用户界面构建应用程序最佳的单元块，一种特定功能和结构化组件。
 * 面板包含有底部和顶部的工具条，连同单独的头部、底部和body部分。它提供内建都得可展开和可闭合的行为，
 * 连同多个内建的可制定的行为的工具按钮。面板可简易地置入任意的容器或布局。
 */

/**@lends FPanel# */
/**
 * 标识(仅标签使用)
 * @name FPanel#<ins>id</ins>
 * @type String
 * @default 随机生成
 * @example
 * 无
 */

/**
 * 是否隐藏(仅标签使用)。该属性取消，可以通过设置panel的样式来达到相同的效果
 * @name FPanel#<ins><del>visible</del></ins>
 * @type boolean
 * @default 随机生成
 * @example
 * 无
 */

/**
 * 是否自动出现滚动条，当内容溢出时(仅标签使用)
 * @name FPanel#<ins>autoscroll</ins>
 * @type boolean
 * @default true
 * @example
 * 无
 */

/**
 * 标题设置(仅标签使用)
 * @name FPanel#<ins>title</ins>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 组件创建后是否处于收起状态，可调用expand()方法动态展开组件主体内容。(仅标签使用)
 * @name FPanel#<ins>collapsed</ins>
 * @type boolean
 * @default false
 * @example
 * 无
 */

/**
 * 组件创建时是否显示收起工具按钮(位于头部右边)。(仅标签使用)
 * @name FPanel#<ins>collapsible</ins>
 * @type boolean
 * @default true
 * @example
 * 无
 */
(function($) {
	$.registerWidgetEvent("onExpand,onCollapse");
	$.widget("FUI.FPanel", {
	    options : {
	        /**
	         * 此组件的整体宽度（包括border和padding，单位象素），默认为"auto"。<br/>
	         * 支持数字形式的字符串或者带px单位的数字字符串，比如"40"、"40px"，都表示40个像素，字符串如"px50"、"abcpx"等其他非法形式的字符串则被忽略；
	         * width也支持百分比，比如"10%"，则表示占用外层容器(div,td等)宽度的比率，此时请慎重设置左右margin、border和padding，否则会造成在不同浏览器下表现不一致不准确。<br/>
	         * @name FPanel#width
	         * @type String
	         * @default "auto"
	         * @example
	         * 无
	         */
	        width : "auto",
	        /**
	         * 此组件的整体高度（包括border和padding，单位像素），默认为auto。<br/>
	         * 仅支持数字形式的字符串或者带px单位的数字字符串，比如"40"、"40px"，都是表示40个像素；其他非法形式的字符串则被忽略。<br/>
	         * 请慎重设置组件的margin的top和bottom值，在不同浏览器下可能是不同的显示效果。
	         * height属性不支持百分比。
	         * @name FPanel#height
	         * @type String
	         * @default "auto"
	         * @example
	         * 无
	         */
	        height : "auto",
	        /**
	         * 异步加载内容的址
	         * @name FPanel#pageUrl
	         * @type String
	         * @default ""
	         * @example
	         * 无
	         */
	        pageUrl : null,
	        /**
	         * 是否采用iframe模式加载
	         * @name FPanel#isIframe
	         * @type boolean
	         * @default false
	         * @example
	         * 无
	         */
	        isIFrame : false,
	        /**
	         * panel的图标样式，位于头部左边的位置。(仅标签使用)
	         * @name FPanel#<ins>iconCls</ins>
	         * @type String
	         * @default ""
	         * @example
	         * 无
	         */
	        iconCls : null,
	        /**
	         * 收起panel组件后触发的函数
	         * @event
	         * @name FPanel#onCollapse
	         * @example
	         * onCollapse : function(){
	         *    //do something
	         * }
	         */
	        onCollapse : null,
	        /**
	         * 展开panel组件后触发的函数
	         * @event
	         * @name FPanel#onExpand
	         * @example
	         * onExpand : function(){
	         *    //do something
	         * }
	         */
	        onExpand : null,
	        /**
	         * 请求成功时触发
	         * @event
	         * @name FPanel#onLoadSuccess
	         * @param data  类型：Array[Object] 。请求返回的数据。
	         * @param textStatus   返回状态
	         * @param jqXHR   XMLHttpRequest对象
	         * @example
	         */
	        onLoadSuccess : null,
	        /**
	         * 请求超时时触发
	         * @event
	         * @name FPanel#onError
	         * @param jqXHR      XMLHttpRequest对象
	         * @param textStatus   返回状态
	         * @param  errorThrown  （可能）捕获的错误对象
	         * @example
	         */
	        onError : null,

	        // 保存面板的当前状态：面板是否收起来
	        _isCollapsed : false,
	        // 缓存jQuery对象：header
	        _objHeader : null,
	        // 缓存jQuery对象：toggle
	        _objHeaderToggle : null,
	        // 缓存jQuery对象： title
	        _objHeaderTitle : null,
	        // 缓存jQuery对象： icon
	        _objHeaderIcon : null,
	        // 缓存jQuery对象：wrapper
	        _objWrapper : null,
	        // 缓存jQuery对象：body
	        _objWrapperBody : null
	    },
	    _create : function() {
		    // 初始化ID
		    var ID = this.element.attr("id");
		    this.options.id = ID;
		    // 初始化header对象
		    this.options._objHeader = $I(ID + "-header");
		    this.options._objHeaderToggle = $I(ID + "-toggle");
		    this.options._objHeaderTitle = $I(ID + "-title");
		    this.options._objHeaderIcon = $I(ID + "-icon");
		    // 初始化wrapper对象
		    this.options._objWrapper = $I(ID + "-wrapper");
		    this.options._objWrapperBody = $I(ID + "-body");

		    // 是否折叠
		    this.options._isCollapsed = this.element.hasClass("f-collapsed");
		    // 绑定事件
		    this._bindEvent();
	    },
	    _init : function() {
		    // 如果是动态数据，并且开启自动加载，则加载数据
		    this.reload();
		    // 设置大小
		    this.setSize(this.options.width, this.options.height);
	    },
	    _bindEvent : function() {
		    var self = this;
		    var toggleEl = this.options._objHeaderToggle;

		    // toggle绑定hover事件
		    toggleEl.hover(function(event) {
			    toggleEl.addClass("f-tool-toggle-over");
		    }, function(event) {
			    toggleEl.removeClass("f-tool-toggle-over");
		    });

		    // 绑定点击事件
		    toggleEl.click(function() {
			    if (self.options._isCollapsed) {
				    self.expand();
			    } else {
				    self.collapse();
			    }
			    return false;
		    });
		    // 暂不支持
		    /*
		     * $(window).resize(function() { setTimeout(function() { self.resize(); }, 500); });
		     */
	    },
	    /**
	     * 销毁组件
	     * @name FPanel#destroy
	     * @function
	     * @example
	     */
	    destroy : function() {
		    var op = this.options;
		    // 取消绑定的事件
		    op._objHeaderToggle.unbind();
		    // 销毁jQuery对象
		    op._objHeader = null;
		    op._objHeaderToggle = null;
		    op._objHeaderTitle = null;
		    op._objHeaderIcon = null;
		    op._objWrapper = null;
		    op._objWrapperBody = null;
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    },
	    /**
	     * 重新加载指定的URL，如果传入的URL为空，则使用上一次使用的URL，如果没有配置URL，则直接返回，无任何效果
	     * @name FPanel#reload
	     * @function
	     * @param url 要加载的页面URL。在isFrame=true的情况下，url需要满足iframe的规范，在非iframe模式下，url不能跨域访问。
	     * @example
	     */
	    reload : function(url) {
		    var op = this.options;
		    var selfEl = this.element;
		    var bodyEl = op._objWrapperBody;

		    url = url || op.pageUrl;
		    if ($Utils.isEmpty(url)) {
			    // 不是动态数据加载
			    return;
		    }
		    op.pageUrl = url;

		    if (op.isIFrame) {
			    op._objWrapperBody.children("iframe").attr("src", url);
			    return;
		    }

		    if (selfEl.data("loading")) {
			    // 如果在加载过程中，则直接跳出
			    return;
		    } else {
			    selfEl.data("loading", true);
		    }
		    if (url.indexOf("/") !== 0) {
			    url = $Utils.getContextPath() + '/' + url;
		    }
		    // TODO 此入显示MASK
		    $.ajax({
		        cache : false,
		        type : "get",
		        url : url,
		        success : function(data, textStatus, jqXHR) {
			        bodyEl.html(data);
			        if ($.isFunction(op.onLoadSuccess)) {
				        op.onLoadSuccess(data, textStatus, jqXHR);
			        }
		        },
		        error : function(data, textStatus, jqXHR) {
			        if ($.isFunction(op.onError)) {
				        op.onError(data, textStatus, jqXHR);
			        }
		        },
		        complete : function() {
			        selfEl.data("loading", false);
			        // TODO 隐藏MASK
		        }
		    });
	    },
	    /**
	     * 打开面板。
	     * @name FPanel#expand
	     * @function
	     * @example
	     */
	    expand : function() {
		    var self = this;
		    var op = self.options;
		    if (op._isCollapsed) {
			    op._objWrapper.slideDown("fast", function() {
				    self.element.addClass("f-collapsible").removeClass("f-collapsed");
				    op._isCollapsed = false;
				    // 调用回调或者触发事件
				    var canGo = true;
				    if ($.isFunction(op.onExpand)) {
					    var result = op.onExpand.call(self); // 回调方法返回false，则阻止触发事件
					    canGo = (result === false) ? false : true;
				    }
				    if (canGo) {
					    self.element.triggerHandler('onExpand');
				    }
			    });
		    }
	    },
	    /**
	     * 折叠面板。
	     * @name FPanel#collapse
	     * @function
	     * @example
	     */
	    collapse : function() {
		    var self = this;
		    var op = self.options;
		    if (!op._isCollapsed) {
			    op._objWrapper.slideUp("fast", function() {
				    self.element.removeClass("f-collapsible").addClass("f-collapsed");
				    op._isCollapsed = true;
				    // 调用回调或者触发事件
				    var canGo = true;
				    if ($.isFunction(op.onCollapse)) {
					    var result = op.onCollapse.call(self);
					    canGo = (result === false) ? false : true;
				    }
				    if (canGo) {
					    self.element.triggerHandler('onCollapse');
				    }
			    });
		    }
	    },
	    /**
	     * 设置标题。
	     * @name FPanel#setTitle
	     * @function
	     * @param title 标题
	     * @example
	     */
	    setTitle : function(title) {
		    if (title) {
			    this.options.title = title;
			    this.options._objHeaderTitle.text(title);
		    }
	    },
	    /**
	     * 设置标题图标样式。
	     * @name FPanel#setIconCls
	     * @function
	     * @param iconCls 图标样式
	     * @example
	     */
	    setIconCls : function(iconCls) {
		    var op = this.options;
		    // 移除原有样式
		    if (op.iconCls && op.iconCls.length != 0) {
			    op._objHeaderIcon.removeClass(op.iconCls);
		    }
		    // 设置新样式
		    op._objHeaderIcon.addClass(iconCls);
		    op.iconCls = iconCls;
	    },
	    /**
	     * 设置组件的高宽，Panel组件会自动调整内部toolbar的大小和位置
	     * @name FPanel#setSize
	     * @function
	     * @param w 组件的宽度，必须是数字或者数字类的字符串，不支持百分比
	     * @param h 组件的高度，必须是数字或者数字类的字符串，不支持百分比
	     * @example
	     */
	    setSize : function(w, h) {
		    var UTILS = window["$Utils"];
		    var op = this.options;
		    var selfEl = this.element;
		    var bodyEl = op._objWrapperBody;
		    var bodyContent = bodyEl.children(".f-panel-body-content");
		    var contentSize = bodyContent.size();

		    if (w != null) {
			    // border、padding占用的大小
			    var percentage = UTILS.getPercentage(w);
			    if (percentage) {
				    selfEl.get(0).style.width = percentage;
				    bodyEl.get(0).style.width = "auto";
				    if (contentSize === 1) {
					    bodyContent.get(0).style.width = "auto";
				    }
			    } else {
				    // 对于'40'和'40px'等同样处理为40
				    var gaps = 2;
				    w = parseInt(w);
				    var realSize = w - gaps;
				    if (!isNaN(realSize)) {
					    if (realSize < 0) {
						    realSize = 0;
					    }
					    selfEl.get(0).style.width = w + "px";
					    if (contentSize === 1) {
						    bodyContent.get(0).style.width = realSize + "px";
					    } else {
						    bodyEl.get(0).style.width = realSize + "px";
					    }
				    }
			    }
		    }
		    if (h != null) {
			    // border、padding占用的大小
			    var percentage = UTILS.getPercentage(h);
			    if (percentage) {
				    selfEl.get(0).style.height = percentage;
				    bodyEl.get(0).style.height = "auto";
				    if (contentSize === 1) {
					    bodyContent.get(0).style.height = "auto";
				    }
			    } else {
				    // 对于'40'和'40px'等同样处理为40
				    var gaps = 27;
				    var realSize = parseInt(h) - gaps;
				    if (!isNaN(realSize)) {
					    if (realSize < 0) {
						    realSize = 0;
					    }
					    selfEl.get(0).style.height = "auto";
					    if (contentSize === 1) {
						    var otherHeight = 0;
						    bodyContent.siblings().not('script').each(function() {
							    // alert($(this).attr('id') + ":" + $(this).outerHeight(true));
							    otherHeight += $(this).outerHeight(true);
						    });
						    realSize = (realSize - otherHeight) < 0 ? 0 : (realSize - otherHeight);
						    bodyContent.get(0).style.height = realSize + "px";
					    } else {
						    bodyEl.get(0).style.height = realSize + "px";
					    }
				    }
			    }
		    }
	    }
	});
})(jQuery);
/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Mask.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FMask组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员                     修改说明
 * 2012-10-17   qudc                  在doMask时调用hideAllSelect方法，隐藏select组件。在doUnMask的时候调用showAllSelect方法，显示select组件。解决ie6下，div遮罩层不能遮住html原生的select组件的bug。
 * 2012-11-29   qudc                  遮罩计算可见区域的时候，在非标准的盒子模型（怪异模式）下，添加document.body.clientWidth、document.body.clientHeight来计算可见区域的高宽
 * 2012-12-13	hanyin		增加选项 showImg，如果为false则不显示中心图片，否则显示
 */

(function($, undefined) {


    var UTILS = window['$Utils'];

    /**
     *  生成遮罩的html机构
     * @param text
     * @param options
     */
    function generateMaskHtml(text, options) {
        var id = options && options.id || 'fui' ;
        var maskBGId = id + '-mask-bg';
        var maskImgId = id + '-mask-img';
        var maskMsgId = id + '-mask-msg';
        var maskArr = [];
        //遮罩背景层
        maskArr.push('<div id="' + maskBGId + '"' + ' class="f-mask-bg"></div>');
        //遮罩层的提示图片以及提示信息
        maskArr.push('<div id="' + maskImgId + '" class="f-mask-img" style="display:none;"><div id="' + maskMsgId + '" class="">');
        maskArr.push(text || window["$i18n"].mask.defaultMsg);
        maskArr.push('</div></div>');
        return maskArr.join('');
    }


    /**
     * 隐藏所有的原生select组件
     */
    function hiddenAllSelectEl() {
        if (window["hasHidden"] === true) {
            return;
        }
        var i = 0;
        var j = 0;
        var es;            //var es = vForm.elements;  //获取表单中所有的元素
        var hiddenArrayList = window['hiddenArrayList'] || [];
        window['hiddenArrayList'] = hiddenArrayList;
        window["hasHidden"] = true;
        var selectEls = $('select');
        var selectLen = selectEls.length;
        for (var i = 0; i < selectLen; i++) {
            var selectDom =selectEls.get(i);
            var selectStyle = selectDom.style ;
            if (selectStyle.display == "none" || selectStyle.display == "block") {
            } else {
                selectStyle.display = "none";
                hiddenArrayList.push(selectDom); //直接将对象的引用保存到链表中
            }
        }
    }

    //回复隐藏的select框
    function showAllSelectEl() {
        if (window["hasHidden"] === false) {
            return;
        }
        //todo 是否真的要隐藏select ，如果有多个遮罩层 处理需要谨慎
        var mask = $("#win-mask-overlay,#dialog-mask-overlay");
        if (mask.length > 0) {
            return;
        }
        window["hasHidden"] = false;
        var hiddenArrayList = window['hiddenArrayList'];

        var length = $.isArray(hiddenArrayList) && hiddenArrayList.length || 0;
        //将隐藏链表中的元素恢复显示
        if (hiddenArrayList != null && hiddenArrayList != false && length > 0) {
            for (var i = 0; i < length; i++) {
                hiddenArrayList[i].style.display = "";   //继续隐藏
            }
        }
        hiddenArrayList = null;
        window['hiddenArrayList'] = null;
    }

    /**
     * ie6下调用 hiddenAllSelectEl方法，隐藏所有原生的select组件
     */
    function hideAllSelect() {
        if ($.browser.msie && ($.browser.version == "6.0")) {
            hiddenAllSelectEl();
        }
    }

    /**
     * ie6下调用 showAllSelectEl方法，隐藏所有原生的select组件
     */
    function showAllSelect() {
        if ($.browser.msie && ($.browser.version == "6.0")) {
            showAllSelectEl();
        }
    }

    //展现body区域的遮罩
    function _showBodyMask(text, maskId, options) {
        var maskBG = $('#' + maskId + '-mask-bg');
        if (maskBG.length == 0) {
            //生成对应的dommask的dom结构。
            // begin 20121213 hanyin 
            // var options = {id :maskId};
        	options = options || {};
        	options.id = maskId;
            // end 20121213 hanyin 
            var maskHtml = generateMaskHtml(text, options);
            $('body').append(maskHtml);
        }
        _resizeBodyMask(text, maskId, options);
    }

    //展现div区域的遮罩
    function _showDivMask(text, maskId, options) {
        var maskBGId = maskId + '-mask-bg';

        var maskBG = $('#' + maskBGId);
        if (maskBG.length == 0) {
            //生成对应的dommask的dom结构。
            var options = {id :maskId};
            var maskHtml = generateMaskHtml(text, options);
            $('body').append(maskHtml);
        }
        _resizeDivMask(text, maskId, options);
    }

    //调整body区域的遮罩
    // 20121213 hanyin 增加options参数传入
    function _resizeBodyMask(text, maskId, options) {
        //查找遮罩相关的元素
        var maskBG = $('#' + maskId + '-mask-bg');
        var maskImg = $('#' + maskId + '-mask-img');
        var maskMsg = $('#' + maskId + '-mask-msg');

        var isBoxModel = jQuery.support.boxModel;
        var documentElement = document.documentElement;

        //可视区域的宽度
        var w = isBoxModel && documentElement.clientWidth ||document.body.clientWidth;
        //可是区域的高度
        var h = isBoxModel && documentElement.clientHeight ||document.body.clientHeight;
        //滚动条的水平偏移量
        var scrollLeft = isBoxModel && documentElement.scrollLeft || document.body.scrollLeft;
        //滚动条的垂直偏移量
        var scrollTop = isBoxModel && documentElement.scrollTop || document.body.scrollTop;


        //设置背景阴影的宽高
        var bw = (w + scrollLeft) + 'px';
        var bh = (h + scrollTop) + 'px';
        maskBG.css('width', bw);
        maskBG.css('height', bh);


        //设置消息提示信息内容
        maskMsg.html(text);

        //遮罩图片的宽度
        var imgW = maskImg.outerWidth(true);
        //遮罩图片的高度
        var imgH = maskImg.outerHeight(true);

        //设置遮罩图片的相对位置
        var px = ((w - imgW) / 2 + scrollLeft) + 'px';
        var py = ((h - imgH) / 2 + scrollTop) + 'px';
        maskImg.css('left', px);
        maskImg.css('top', py);

        maskBG.css('display', '');
        //设置背景阴影和遮罩图片显现
        // begin 20121213 hanyin 增加showImg 选项，如果为false，则不显示图片
        if ((options || {})["showImg"] === false) {
        	return;
        }
        // end 20121213 hanyin 增加showImg 选项，如果为false，则不显示图片
        maskImg.css('display', '');
    }

    //调整div区域的遮罩
    // 20121213 hanyin 增加options参数传入
    function _resizeDivMask(text, maskId, options) {

        var element = $('#' + maskId);
        //查找遮罩相关的元素
        var maskBG = $('#' + maskId + '-mask-bg');
        var maskImg = $('#' + maskId + '-mask-img');
        var maskMsg = $('#' + maskId + '-mask-msg');

        //计算所需遮罩的宽度
        var w = element.outerWidth(true);
        //计算所需遮罩的高度
        var h = element.outerHeight(true);
        //滚动条的水平偏移量
        var scrollLeft = element.scrollLeft();
        //滚动条的垂直偏移量
        var scrollTop = element.scrollTop();


        //计算遮罩阴影的宽高
        var bw = w + 'px';
        var bh = h + 'px';
        maskBG.css('width', bw);
        maskBG.css('height', bh);

        //计算并设置遮罩阴影的相对偏移量。
        var offset = element.offset();
        var left = offset.left;
        var top = offset.top;
        maskBG.css('left', left);
        maskBG.css('top', top);

        maskMsg.html(text);

        //计算遮罩图片的宽度
        var imgW = maskImg.outerWidth(true);
        //计算遮罩图片的高度
        var imgH = maskImg.outerHeight(true);

        //计算并设置遮罩图片的偏移量
        var px = (left + (w - imgW) / 2 ) + 'px';
        var py = (top + (h - imgH) / 2 ) + 'px';
        maskImg.css('left', px);
        maskImg.css('top', py);

        maskBG.css('display', '');
        // begin 20121213 hanyin 增加showImg 选项，如果为false，则不显示图片
        if ((options || {})["showImg"] === false) {
        	return;
        }
        // end 20121213 hanyin 增加showImg 选项，如果为false，则不显示图片
        maskImg.css('display', '');
    }

    /**
     * 遮罩某个指定的div
     * @name FMask#doMask
     * @param  text  遮罩提示信息（类型：String）
     * @function
     * @return void
     * @example
     */
    // 20121213 hanyin _showBodyMask和_showDivMask方法的输入参数增加 options传入
    $.fn.doMask = function(text, options) {
        var element = $(this);
        UTILS.addClass(element.get(0), 'f-mask-scroll-hide');
        hideAllSelect();
        //遮罩整个页面
        if (element.is('body')) {
            _showBodyMask(text, 'fui', options);
        } else {
            var id = element.attr('id');
            _showDivMask(text, id, options);

        }
    };

    /**
     * 去除某个指定div的遮罩
     * @name FMask#doUnMask
     * @function
     * @return void
     * @exampl
     */
    $.fn.doUnMask = function() {
        var element = $(this);
        showAllSelect();
        //取消整个body区域的遮罩
        if (element.is('body')) {
            var maskBG = element.find('>#fui-mask-bg');
            if (maskBG.length > 0) {
                var maskImg = element.find('>#fui-mask-img');
                maskImg.css('display', 'none');
                maskBG.css('display', 'none');
            }
            showAllSelect();
        } else {
            //取消制定div区域的遮罩
            var id = element.attr('id');
            var maskBGId = id + '-mask-bg';
            var maskImgId = id + '-mask-img';
            var maskBG = $('#' + maskBGId);
            if (maskBG.length > 0) {
                var maskImg = $('#' + maskImgId);
                maskImg.css('display', 'none');
                maskBG.css('display', 'none');
            }
            showAllSelect();
        }
        UTILS.removeClass(element.get(0), 'f-mask-scroll-hide');
    };
})(jQuery);

	﻿/**
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Combo.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FCombo组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 2012-10-23    qudc               修改 _unbindEvent方法中对listDiv的解绑，this.listDiv.unbind();修改成：this.listDiv && this.listDiv.unbind();
 * 2012-11-9     qudc               修改_adjustScroll方法的参数,_adjustScroll(overEl,parentEl, position)，目的可以让switchfield组件使用。
 * 2012-12-17    qudc               使用组件的隐藏域进行初始化组件。将组件的this.hiddenEl修改成this.element ,将this.element修改成this.inputEl。
 * 2012-12-12    qudc               修改_resetValueOnBlur方法，添加部分代码，解决bug：当组件已经选择一条记录时，无法清空输入框以及隐藏域的值。
 * 2013-01-06    qudc               新增reset方法
 * 2013-01-08    qudc               修改forceSelection属性的API描述。添加默认值描述。
 * 2013-01-17    qudc               修改forceSelection属性的默认值，默认值由原先的false改成true。防止用户手动输入提交非法数据。
 * 2013-01-17    qudc               修复bug：3615 input新增blur事件，辅助实现forceSelection功能
 * 2013-01-17    qudc               修复bug：3615 删除mousedown事件
 * 2013-01-23    qudc               readOnly属性修改成readonly属性
 * 2013-01-23    qudc               setEnabled 方法修改成 setDisabled方法
 * 2013-01-23    qudc               isEnabled 方法改成isDisabled方法
 * 2013-01-23    qudc               isReadOnly 方法 改成isReadonly
 * 2013-01-23    qudc               setReadonly方法 改成setReadonly
 * 2013-01-23    qudc               新增reset方法的jsdoc描述
 * 2013-01-23    qudc               修改setValue方法，修复组件在异步加载模式下，调用setValue方法可能不能设值的问题，原因：设值时组件的数据还未加载。
 * 2013-01-28    qudc               修改_prepareAjaxLoad方法中的onsuccess事件获取defaultValue方式，将获取defaultValue属性放到success事件中获取，避免实现保存的属性值为旧的defaultValue属性。
 * 2013-01-29    qudc               修改setValue方法，新增第二个参数fireSelectEvent，用于强制触发select事件。将原先第二个参数unValidate修改成第三个参数。
 * 2013-01-31    qudc               新增setStaticData方法，用于动态设置组件的静态数据。
 * 2013-01-31    qudc               修改forceSelection属性的描述
 * 2013-02-06    qudc               修复bug：4659  在success和failur回调函数中优先设置hasLoaded和isLoading属性
 * 2013-03-15    qudc               keydown事件中，新增对keyCode==9（即tab键）的处理，当用户按tab键以后，隐藏下拉列表。
 * 2013-03-18    qudc               修复需求：5488 新增onBeforesend事件，
 * 20130328      hanyin             过滤的筛选字段可以根据属性filterTarget来指定，需求：5530
 * 20130328      hanyin             combo支持碰撞检测，需求：5531
 * 20130425      hanyin				需求5814 ，新增getSelectedDatas方法，获取被选中数据的所有信息
 * 20130426      hanyin				需求5824 ，combo组件依次调用setValue、setStaticData，显示正确的情况下，如果调用reset方法，会造成combo组件无法清空的问题
 * 20130630      hanyin				STORY #6177 [基材估值/张清生][TS:201306190006][FUI] onblur事件在下拉框展开的时候无法触发
 * 20130805			 hanyin				STORY #6485 [第三产品事业部/张华君][TS:201308010003][FUI] FCombo组件filterTarget属性支持模糊查询
 */

/**
 * @name FCombo
 * @class 
 * 选择下拉菜单组件，代替HTML中的select标签，并能够加载远程数据内容，支持下拉框内容复选和输入检索过滤等功能。
 */

/**@lends FCombo# */

/**
 * 组件的唯一标识。
 * @name FCombo#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 对应html中的表单元素的name属性。默认值为：""。
 * @name FCombo#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */


/**
 * 按钮的DOM焦点序号即tab键时候得到焦点的序号
 * @name FCombo#<b>tabIndex</b>
 * @type String
 * @default null
 * @example
 * 无
 */


/**
 * 请求成功时触发
 * @event
 * @name FCombo#onLoadsuccess
 * @param data  类型：Array[Object] 。请求返回的数据。
 * @param textStatus   返回状态
 * @param jqXHR   XMLHttpRequest对象
 * @example
 *
 */
/**
 * returnCode为1或者-1的时候时触发，
 * @event
 * @name FCombo#onLoadfailure
 * @param data  类型：Array[Object] 。请求返回的数据。
 * @param textStatus   返回状态
 * @param jqXHR   XMLHttpRequest对象
 * @example
 *
 */

/**
 * 请求超时时触发
 * @event
 * @name FCombo#onError
 * @param jqXHR      XMLHttpRequest对象
 * @param textStatus   返回状态
 * @param  errorThrown  （可能）捕获的错误对象
 * @example
 *
 */


;
(function($, undefined) {
    $.widget('FUI.FCombo', {
        options:{
            fieldLabel : null ,
            /**
             * 设置组件的输入框是否可编辑，默认为true。即输入框不可编辑。该属性不能和selectable属性共用.
             * @name FCombo#<b>readonly</b>
             * @type Boolean
             * @default false
             * @example
             * 无
             */
            readonly :false,

            enabled:true ,
            /**
             * 表示组件是否可用 ,false表示组件可用，true表示组件不可用(即在form表单中不能做submit提交)。默认值为false。
             * @name FCombo#<b>disabled</b>
             * @type Boolean
             * @default false
             * @example
             * 无
             */
            disabled :false ,
            //22为列表的高度，2为上下1像素，5为默认展现5条数据。
            listHeight : 22 * 6 + 2 ,
            //上下选中列表的延时 100毫秒
            upDownDelay : 100,
            //单选模式下，检索的时间，300毫秒
            filterDelay : 300,
            //列表的高度 单位px
            itemHeight : 22,
            /**
             * 设置组件是否多选。默认值为false，即组件为单选。
             * @name FCombo#multiSelect
             * @type Boolean
             * @default false
             * @example
             * 无
             */
            multiSelect : false,//设置是否多选，默认为单选
            /**
             * 支持多选时的多个选项之间的分隔符，默认为 ','.
             * @name FCombo#multiSeparator
             * @type String
             * @default ","
             * @example
             * 无
             */
            multiSeparator : ',',
            /**
             * 展现列表的格式设置，用于设置下拉框显示list的格式。该属性可以为字符串，也可以为一个函数。默认为字符串格式，例如：“{valueField}：{displayField}”，函数格式如下：function(item){ return item.valueField +":"+item.displayField} ;
             * @name FCombo#displayFormat
             * @type String
             * @default ""
             * @example
             * 无
             */
            displayFormat :"{valueField}:{displayField}",

            /**
             * 显示值中valueField字段值和displayField字段值的分隔符,默认值为":"。注意：1、该属性只有在multiSelect属性为false的情况下才有效。2、如果displayFormat采用字符串形式来设值，那么该分割符号必须与displayFormat属性值中的分割符一致。
             * 3、如果displayFormat采用函数方式来设值，那么需要通过该属性告知组件使用的分隔符。
             * @name FCombo#displaySeparate
             * @type String
             * @default ""
             * @example
             * 无
             */
            displaySeparate : ":",

            /**
             * true表示输入框中的值必须是下拉列表中的值，false表示允许用户输入不在下拉列表中的值。
             * @name FCombo#forceSelection
             * @type Boolean
             * @default true
             * @example
             * 无
             */
            forceSelection:true ,
            /**
             * 设置组件是否只读。false表示输入框不可编辑，下拉图片不可点击 。默认值为“true”.该属性不能和readOnly属性共用.
             * @name FCombo#selectable
             * @type Boolean
             * @default true
             * @example
             * 无
             */
            selectable : true,
            /**
             * 下拉框中的内容可以使用本地静态数据源,如果设置了dataSource属性，则该属性无效。
             * @name FCombo#staticData
             * @type Array
             * @default
             * @example
             * 无
             */
            staticData :[],
            /**
             * 输入栏的初始值,即value值。如果该组件有emptyText属性，则不允许与emptyText属性的值一样，否则该属性值无效。 该值在数据加载之后生效。
             * @name FCombo#defaultValue
             * @type String
             * @default ""
             * @example
             * 无
             */
            defaultValue :null ,
            /**
             * ajax异步模式加载数据时，设置组件是否初始化加载数据。默认值为false，即初始化组件时不加载数据。
             * @name FCombo#autoload
             * @type Boolean
             * @default    false
             * @example
             * 无
             */
            autoload : false ,

            /**
             * 对应后台服务返回值中的某个字段，该字段对应的值将作为提交值。
             * @name FCombo#valueField
             * @type String
             * @default "value"
             * @example
             * 无
             */
            valueField :'value',
            /**
             * 对应后台服务返回值中的某个字段，该字段对应的值将作为显示值。
             * @name FCombo#displayField
             * @type String
             * @default "text"
             * @example
             * 无
             */
            displayField : 'text',

            /**
             * 组件的宽度
             * @name FCombo#width
             * @type Number
             * @default "150"
             * @example
             * 无
             */
            width:150,
            /**
             * 用于设置下拉框是否默认选中第一条数据
             * @name FCombo#selectFirst
             * @type Boolean
             * @default false
             * @example
             * 无
             */
            selectFirst :false,
            /**
             * 指定要进行筛选的字段名，默认与valueField指定的字段相同
             * @name FCombo#filterTarget
             * @type String
             * @default 无
             * @example
             * 无
             */
            /**
             * 过滤回调方法
             * @name FCombo#filterCallback
             * @type String
             * @default 无
             * @example 
             * <pre>
             * // value为字段的真实值，inputValue为当前输入框的值
             * filterCallback : function(value, inputValue) {
             * 	return value.startWith(inputValue);
             * }
             * </pre>
             */
             filterCallback : function(value, inputValue) {
             	return value.startWith(inputValue);
             }
        },
        //组件级别的创建，先关事件的绑定
        _create :function() {
            var options = this.options,onFilter = options.onFilter,UTILS = window['$Utils'];
            this.displayItems = [];
            var items = options.staticData;
            this.isStaticLoad = false;
            this.isFirstShow = true;
            options.enabled = !options.disabled;
            if (!UTILS.isEmpty(items)) {
                /**
                 * 在加载完数据时触发该事件，用户可以在该事件中进行数据过滤。参数items为下拉列表的数据，用户可以对items进行遍历筛选。
                 * @event
                 * @name FCombo#onFilter
                 * @param item 类型：Object  下拉列表中的单条数据
                 * @example
                 *  var onFilterFn =  function(items){
                 *      var result = [];
                 *      var itemLen = items.length;
                 *      for(var i =0 ; i&lt;itemLen ; i++){
                 *          if(items[i]['value'] !== '1'){
                 *            result.push(items[i]);
                 *          }
                 *      }
                 *      return  result ;
                 *  }
                 *
                 */
                if ($.isFunction(onFilter)) {
                    //对静态数据进行过滤
                    this.displayItems = this.options.staticData = onFilter.call(this, items);
                } else {
                    this.displayItems = items;
                }
                if (this.displayItems && this.displayItems.length > 0) {
                    this.isStaticLoad = true;
                }
            }
            //获取组件隐藏域的对象
            var element = this.element;
            //获取显示输入框的对象
            this.inputEl = element.next();
            //获取组件按钮的对象
            this.imgEl = this.inputEl.next();

            this.isShow = false;
            this.value = '';
            this.isMatchValue = false;
            //如果enabled为true而且可以进行下拉选择，那么绑定输入框，下拉图片的相关事件
            if (options.enabled && options.selectable) {
                //绑定事件
                this._bindEvent();
            }
        },
        //默认值的处理，例如 disabled readOnly等属性的 autoload
        _init : function() {
            var options = this.options;
            var UTILS = window['$Utils'];
            var defaultValue = options.defaultValue;

            var selectFirst = options.selectFirst;
            var items = this.displayItems || [];
            //加载静态数据（数据字典或者是用户自定义数据），
            // 如果没有defaultValue属性，则等到点击下拉图片的时候进行渲染，
            //如果有这两个值的，则在此处进行渲染下拉列表的数据，并设置默认值。
            if (!UTILS.isEmpty(items)) {
                //设置展示域和隐藏域的值
                //如果defaultValue有值
                if (!UTILS.isEmpty(defaultValue)) {
                    this.setValue(defaultValue, false, true);
                } else if (selectFirst) {
                    //选中第一条数据
                    var item = items[0];
                    var value = item[options.valueField];
                    this.setValue(value, false, true);
                }
            }
            if (this.isStaticLoad == false) {
                //加载
                /**
                 * 设置组件的url，用于AJAX加载数据。
                 * @name FCombo#dataUrl
                 * @type String
                 * @default
                 * @example
                 * 无
                 */
                if (!UTILS.isEmpty(options.dataUrl) && options.autoload) {
                    this._prepareAjaxLoad();
                }
            }
        },
        //发送ajax请求请求数据，在autoload为true或者点击图片的时异步加载。
        /**
         *
         *  isShowList  在autoload为false，点击下拉按钮通过ajax请求数据时，用于回调_show方法来展现数据。
         *  baseParams  //doLoad方法中用户传递的参数
         *  dataUrl    //doLoad方法中用户传递的url
         */
        _prepareAjaxLoad : function(isShowList, baseParams, dataUrl) {
            var ME = this ,options = ME.options, onFilter = options.onFilter,UTILS = window['$Utils'];



            var successFn = function(data, textStatus, jqXHR) {
                ME.hasLoaded = true;
                ME.isLoading = false;
                var items = data['data'];
                //设置默认值
                if ($.isFunction(onFilter)) {
                    ME.displayItems = ME.options.staticData = onFilter.call(ME, items);
                } else {
                    ME.displayItems = ME.options.staticData = items;
                }
                var defaultValue = options._valueCache || options.defaultValue;
                if (!UTILS.isEmpty(defaultValue)) {
                    ME.setValue(defaultValue, false, true);
                    // 在setValue之后，第一次成功加载数据之后，清楚值缓存
                    if (options._valueCache) {
                    	options._valueCache = undefined;
                    }
                } else if (options.selectFirst) {
                    //选中第一条数据
                    var staticData = ME.options.staticData;
                    var item = staticData[0];
                    var value = item[options.valueField];
                    ME.setValue(value, false, true);
                }
                if (isShowList) {
                    ME._show();
                }
                if ($.isFunction(options.onLoadsuccess)) {
                    options.onLoadsuccess(data, textStatus, jqXHR);
                }

            };
            var failureFn = function(data, textStatus, jqXHR) {
                ME.hasLoaded = true;
                ME.isLoading = false;
                ME.displayItems = ME.options.staticData = [];
                if ($.isFunction(options.onLoadfailure)) {
                    options.onLoadfailure(data, textStatus, jqXHR);
                }
            };
            var errorFn = options.onError;

            /**
                 * 请求发送之前触发。用户可以在该事件中设置请求参数。如果该事件返回false，则不发送ajax请求。
                 * @event
                 * @name FCombo#onBeforesend
                 * @example
                 */
            var onBeforesend = options.onBeforesend;
            if (onBeforesend && false === onBeforesend()) {
                return ;
            }
            /**
             * 设置组件的初始化参数，默认为{}。
             * @name FCombo#baseParams
             * @type Object
             * @default   {}
             * @example
             *
             */
            var params = baseParams || options.baseParams || {};
            var url = dataUrl || options.dataUrl;
            ME._load(params, url, successFn, failureFn, errorFn);
        },
        //绑定事件
        _bindEvent : function() {
            var imgEvent = this._getEvent('img');
            this.imgEl.bind(imgEvent);
            var inputEvent = this._getEvent('input');
            this.inputEl.bind(inputEvent);
            if (!this.isFirstShow) {
                var listDivEvent = this._getEvent('listDiv');
                this.listDiv.bind(listDivEvent);
            }
        },
        //解除绑定的事件
        _unbindEvent : function() {
            this.imgEl.unbind();
            this.inputEl.unbind();
            this.listDiv && this.listDiv.unbind();
            $(document).unbind('click.FCombo');
        },

        //获取绑定的事件
        _getEvent :function(type) {
            var ME = this,options = ME.options,element = this.element,inputEl = this.inputEl,UTILS = window["$Utils"],multiSeparator = options.multiSeparator;
            var showList = function() {
                if (ME.isShow) {
                    ME._hideList();
                } else {
                    //如果没有生成下拉列表则先生成下拉列，然后展现下拉列表
                    ME.inputEl.focus();
                    //重置数据
                    ME._resetItems();
                    ME._show(true);
                    ME.inputEl.get(0).select();
                }
            };
            var imgEvent = {
                click : function(e) {
                    showList();
                    UTILS.stopPropagation(e);
                }
            }
            if (type == 'img') return imgEvent;

            var down = function() {
                //往下选中
                var nextEl = this._selectNext();
                this._adjustScroll(nextEl, this.listEl, 'bottom');
            };
            var up = function() {
                //往上选中
                var prevEl = this._selectPrev();
                this._adjustScroll(prevEl, this.listEl, 'top');
            };
            var filter = function() {
                var newValue = this.inputEl.val();
                var lastValue = this.lastValue;
                if (newValue != lastValue) {
                    this._filterValue(newValue);
                    if (!this.isShow) {
                        this._show();
                    } else {
                        //生成列表
                        if (!this._prevShowList()) {
                            this._hideList();
                            return false;
                        }
                        //调整滚动条，默认选中
                        this._afterShowList(true);
                    }
                    this.lastValue = newValue;
                }
            };
            var inputEvent = {
                //bug：3615 2013-01-17 start  add by qudc  input新增blur事件，实现forceSelection属性的功能，
                blur :  function(e) {
			            	// 20130328 start add by hanyin 在blur时清空筛选的状态
			            	options._startFilter = undefined;
			            	// 20130328 end add by hanyin
										// 20130620 hanyin begin modify 单选模式下可以出发onblur事件
                    if (ME.isShow && options.multiSelect) {
                        return;
                    }
                    // 20130620 hanyin end modify 单选模式下可以出发onblur事件
                    var value = ME.inputEl.val();
                    var element = ME.element;
                    if (false == options.forceSelection) {
                        //允许用户保存输入值（forceSelection属性为false）。 焦点丢失时，将输入框的值放到隐藏域中
                        var valueArr = value.split(options.displaySeparate);
                        var v = valueArr[0];
                        element.val(v);
                        ME.value = v;
                        element.isValidate && element.isValidate();
                    } else {//不允许用户随意输入值
                        //输入框的值为空
                        if (!value) {
                            element.val('');
                            ME.value = '';
                            element.isValidate && element.isValidate();
                        } else {//输入框的值不为空，则回退到最近一次选中的值
                            var displayValue = ME.displayValue;
                            ME.inputEl.val(displayValue);
                        }
                    }

                    /**
                     * 在输入框失去焦点的时候触发
                     * @event
                     * @name FCombo#onBlur
                     * @example
                     *
                     */
                    // begin 20130424 hanyin 需求5806 ，新增onBlur事件
                    if ($.isFunction(options.onBlur)) {
                    	options.onBlur.call(ME);
                    }
                    // end 20130424
                },
                //bug：3615 2013-01-17 end add by qudc
                /* 2013-01-17 start add by qudc   注释掉mousedown事件
                 mousedown : function(e) {
                 if (options.forceSelection) {
                 showList();
                 }
                 },
                 //2013-01-17 end add by qudc
                 */
                keydown:function(e) {
                    var keyCode = e.keyCode;
                    if (keyCode === 38) {
                        //↑
                        //如果列表以及展现，则往上滚
                        var upProxy = $.proxy(up, ME);
                        setTimeout(upProxy, options.upDownDealy);
                    } else if (keyCode === 40) {
                        //↓
                        if (ME.isShow) {
                            //如果列表以及展现，则往下滚
                            var downProxy = $.proxy(down, ME);
                            setTimeout(downProxy, options.upDownDealy);
                        } else {
                            //展现下拉列表
                            ME._resetItems();
                            ME._show();
                        }
                    } else if (keyCode === 13) {
                        //enter 回车
                        if (ME.isShow) {
                            var selectEl = ME._getSelectEl();
                            if (selectEl.length > 0) {
                                if (options.multiSelect) {
                                    var value = selectEl.attr("f_value");
                                    var lastValue = ME.value;
                                    var newValue = '';
                                    var isSelected = selectEl.hasClass('f-combo-list-div-multi-selected');
                                    if (isSelected) {
                                        //原先选中，现在修改成不选中
                                        UTILS.removeClass(selectEl.get(0), 'f-combo-list-div-multi-selected');
                                        var index = lastValue.indexOf(value);
                                        if (index > 0) {
                                            //todo 数据格式 在多选模式下需要区分吗？
                                            newValue = lastValue.replace(new RegExp(multiSeparator + value, "gm"), "");
                                        } else if (value == lastValue) {
                                            newValue = '';
                                        } else {
                                            newValue = lastValue.replace(new RegExp(value + multiSeparator, "gm"), "");
                                        }
                                    } else {
                                        //原先未选中，现在修改成选中
                                        UTILS.addClass(selectEl.get(0), 'f-combo-list-div-multi-selected');
                                        if (UTILS.isEmpty(lastValue)) {
                                            newValue = value;
                                        } else {
                                            newValue = lastValue + multiSeparator + value;
                                        }
                                    }
                                    ME.setValue(newValue, true);
                                } else { //单选模式
                                    var v = "";
                                    var value = selectEl.attr("f_value");
                                    var type = selectEl.attr("f_value_type");
                                    v = UTILS.convert(value, type);
                                    ME.setValue(v, true);
                                    ME._hideList();
                                }
                            }
                        } else {
                            if (false == options.forceSelection) {
                                var value = ME.inputEl.val();
                                var valueArr = value.split(options.displaySeparate);
                                var v = valueArr[0];
                                var element = ME.element;
                                element.val(v);
                                element.isValidate && element.isValidate();
                            }
                        }
                    } else if (keyCode == 9) {
                        $(document).trigger('click.FCombo');
                    } else {
                        //其他key值，用于筛选
                        if (!options.multiSelect) {
                            var filterProxy = $.proxy(filter, ME);
                            setTimeout(filterProxy, options.filterDelay);
                        }
                    }
                    UTILS.stopPropagation(e);
                }
            };
            if (type == 'input') return inputEvent;

            var listEvent = {
                mouseover: function(e) {
                    var tar = e.target,nodeName = tar.nodeName,cls = tar.className;
                    if (options.multiSelect) {
                        var selectEl = $(tar);
                        if (nodeName && nodeName.toLowerCase() == 'div' && cls.indexOf('f-combo-list-div') !== -1) {
                            UTILS.removeClass(ME.overId, 'f-combo-list-div-mouseover');
                            UTILS.addClass(tar, 'f-combo-list-div-mouseover');
                            ME.overId = tar.id;
                        } else {
                            var listDivEl = selectEl.parent();
                            UTILS.removeClass(ME.overId, 'f-combo-list-div-mouseover');
                            UTILS.addClass(listDivEl.get(0), 'f-combo-list-div-mouseover');
                            ME.overId = listDivEl.attr("id");
                        }
                    } else {
                        if (nodeName && nodeName.toLowerCase() == 'div' && cls.indexOf('f-combo-list-div') !== -1) {
                            UTILS.removeClass(ME.overId, 'f-combo-list-div-mouseover');
                            UTILS.addClass(tar, 'f-combo-list-div-mouseover');
                            ME.overId = tar.id;
                        }
                    }
                    UTILS.stopPropagation(e);
                },
                click:function(e) {
                    var tar = e.target,nodeName = tar.nodeName,cls = tar.className;
                    if (options.multiSelect) {
                        var selectEl = $(tar);
                        if (nodeName && nodeName.toLowerCase() == 'div' && cls.indexOf('f-combo-list-div') !== -1) {
                            var isSelected = selectEl.hasClass('f-combo-list-div-multi-selected');
                            if (isSelected) {
                                UTILS.removeClass(selectEl.get(0), 'f-combo-list-div-multi-selected');
                            } else {
                                UTILS.addClass(selectEl.get(0), 'f-combo-list-div-multi-selected');
                            }
                        } else {
                            //如果点在图片区域或者文本区域，则进行复选判断
                            if (selectEl.length > 0) {
                                var parentEl = selectEl.parent();
                                var isSelected = parentEl.hasClass('f-combo-list-div-multi-selected');
                                if (isSelected) {
                                    UTILS.removeClass(parentEl.get(0), 'f-combo-list-div-multi-selected');
                                } else {
                                    UTILS.addClass(parentEl.get(0), 'f-combo-list-div-multi-selected');
                                }
                            }
                        }
                        // 设置具体的值
                        var v = '';
                        var selectEls = ME.listDiv.children('.f-combo-list-div-multi-selected');
                        var selectLen = selectEls.length;
                        for (var i = 0; i < selectLen; i++) {
                            var selectEl = $(selectEls.get(i));
                            var value = selectEl.attr("f_value");
                            if (i > 0) {
                                v += multiSeparator;
                            }

                            v += value;
                        }
                        ME.setValue(v, true);
                        ME.inputEl.focus();
                        UTILS.stopPropagation(e);
                    } else {
                        if (nodeName && nodeName.toLowerCase() == 'div' && cls.indexOf('f-combo-list-div') !== -1) {
                            //选中鼠标点击的列
                            var v = "";
                            var selectEl = $(tar);
                            if (selectEl.length > 0) {
                                var value = selectEl.attr("f_value");
                                var type = selectEl.attr("f_value_type");
                                v = UTILS.convert(value, type);
                            }
                            //处理选中样式 ,传入选中的id
                            ME.setValue(v, true);
                            ME._hideList();
                        }
                        UTILS.stopPropagation(e);
                    }
                    // begin 20130424 hanyin 在通过点选选择之后将焦点放在输入框上
                    ME.inputEl.focus();
                    // end 20130424
                }
            };
            if (type == 'listDiv') return listEvent;

        },
        //重新数据，恢复到默认状态
        _resetItems :function() {
            var options = this.options ,items = options.staticData,len = items.length;
            this.displayItems = [];
            var result = [];
            for (var i = 0; i < len; i++) {
                result.push(items[i]);
            }
            this.displayItems = result;
        },
        //过滤数据
        _filterValue : function(value) {
            var options = this.options ,valueField = options.valueField ,displayField = options.displayField;
            var items = options.staticData ,itemLen = items.length;
            var displayItems = [];
            if (value === '') {
                for (var i = 0; i < itemLen; i++) {
                    displayItems.push(items[i]);
                }
            } else {
            		// mod begin 20130328 hanyin
            		var filterTarget = options.filterTarget;
            		if (!filterTarget) {
            			filterTarget = valueField;
            		}
            		// 20130805 begin hanyin STORY #6485 [第三产品事业部/张华君][TS:201308010003][FUI] FCombo组件filterTarget属性支持模糊查询
            		var filterCallback = options.filterCallback;
            		if ($.isFunction(filterCallback)) {
	                for (var i = 0; i < itemLen; i++) {
	                    var item = items[i];
	                    if (filterCallback('' + item[filterTarget], '' + value)) {
	                        displayItems.push(item);
	                    }
	                }
            		}
            		// 20130805 end hanyin STORY #6485 [第三产品事业部/张华君][TS:201308010003][FUI] FCombo组件filterTarget属性支持模糊查询
                // mod end 20130328 hanyin
            }
            this.displayItems = displayItems;
        },
        //对上一个列表进行样式选中
        _selectPrev : function() {
            var UTILS = window['$Utils'];
            var selectEl = this._getSelectEl();
            var prevEl = selectEl.prev();
            if (prevEl.length > 0) {
                UTILS.removeClass(selectEl.get(0), 'f-combo-list-div-mouseover');
                UTILS.addClass(prevEl.get(0), 'f-combo-list-div-mouseover');
                this.overId = prevEl.attr('id');
            }
            this.inputEl.focus();
            return prevEl;
        },
        //对下一个列表进行样式选中
        _selectNext : function() {
            var UTILS = window['$Utils'],options = this.options;
            var selectEl = this._getSelectEl();
            var nextEl = selectEl.next();
            if (nextEl.length > 0) {
                UTILS.removeClass(selectEl.get(0), 'f-combo-list-div-mouseover');
                UTILS.addClass(nextEl.get(0), 'f-combo-list-div-mouseover');
                this.overId = nextEl.attr('id');
            }
            this.inputEl.focus();
            return nextEl;
        },
        //按up down键的时候调整滚动条的位置
        _adjustScroll : function(overEl, parentEl, position) {
            if (overEl.length < 1) {
                return;
            }
            var options = this.options , listEl = parentEl , listElTop = listEl.offset().top;
            var itemHeight = options.itemHeight;
            var overElTop = overEl.offset().top;
            var offset = overElTop - listElTop - 1;
            if (position === "top") {
                if (offset < 0) {
                    listEl.get(0).scrollTop -= itemHeight;
                }
            } else if (position === "bottom") {
                var innerHeight = listEl.get(0).clientHeight;
                if (offset > (innerHeight - itemHeight)) {
                    listEl.get(0).scrollTop += itemHeight;
                }
            } else if (position === "center") {
                var innerHeight = listEl.get(0).clientHeight;
                var positionTop = parseInt((innerHeight - itemHeight) / 2 + listElTop);
                var offsetTop = overElTop - positionTop;
                listEl.get(0).scrollTop += offsetTop;
            }
        },
        //根据数据生成列表,items必须为数组
        _renderListItem : function(items) {
            var element = this.element;
            var options = this.options;
            var UTILS = window['$Utils'];
            var valueField = options.valueField;
            var displayField = options.displayField;
            var id = element.attr('id');
            var listDiv = this.listDiv;
            var html = [],len = items.length;

            var multiSelect = options.multiSelect;
            this.isMatchValue = false;
            if (!multiSelect) {
                for (var i = 0; i < len; i++) {
                    var item = items[i],display = item[displayField],value = item[valueField];
                    var formatStr = this._getFormatStr(item);
                    html.push('<div class="f-combo-list-div ');
                    if (this._matchValue(value)) {
                        html.push(' f-combo-list-div-mouseover');
                        this.isMatchValue = true;
                    }
                    html.push('"');
                    html.push(' id="f-combo-' + (id + '-list-' + i) + '"');
                    html.push(' f_value="' + value + '"');
                    html.push(' f_value_type="' + typeof(value) + '"');
                    html.push(' title="');
                    html.push(formatStr);
                    html.push('">');
                    html.push(formatStr);
                    html.push('</div>');
                }
            } else {
                //多选模式
                for (var i = 0; i < len; i++) {
                    var item = items[i],display = item[displayField],value = item[valueField];
                    html.push('<div class="f-combo-list-div');
                    if (i == 0) {
                        html.push(' f-combo-list-div-mouseover');
                    }
                    if (this._matchValue(value)) {
                        html.push(' f-combo-list-div-multi-selected');
                        this.isMatchValue = true;
                    }
                    html.push('"');
                    html.push(' id="f-combo-' + (id + '-list-' + i) + '"');
                    html.push(' f_value="' + value + '"');
                    html.push(' f_value_type="' + typeof(value) + '"');
                    html.push('>');
                    html.push('<div class="f-combo-list-multi-img"></div>');
                    var formatStr = this._getFormatStr(item);
                    html.push('<div class="f-combo-list-multi-text"');
                    html.push(' title="');
                    html.push(formatStr);
                    html.push('">');
                    html.push(formatStr);
                    html.push('</div>');
                    html.push('</div>');
                }
                this.overId = 'f-combo-' + id + '-list-0';
            }
            listDiv.html(html.join(""));
        },
        //匹配参数是否在this.value中
        _matchValue : function(value) {
            var UTILS = window['$Utils'],options = this.options,multiSelect = options.multiSelect,multiSeparator = options.multiSeparator;
            if (UTILS.isEmpty(value)) {
                return false;
            }
            if (UTILS.isEmpty(this.value)) {
                return false;
            }
            if (multiSelect) {
                var values = this.value.split(multiSeparator);
                var valuesLen = values.length;
                for (var i = 0; i < valuesLen; i++) {
                    if (value == values[i]) {
                        return true;
                    }
                }
                return false;
            } else {
                if (value == this.value) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        //获取列表格式化后的值
        _getFormatStr : function(item) {
            var ME = this,options = ME.options,UTILS = window['$Utils'];
            var valueField = options.valueField;
            var displayField = options.displayField;
            var displayFormat = options.displayFormat;
            var value = item[valueField];
            var displayValue = item[displayField];
            var displayStr = displayValue;
            if (!UTILS.isEmpty(displayFormat)) {
                if (typeof displayFormat === 'string') {
                    //数据格式如下：  {value}:{text} 或者
                    displayStr = displayFormat.replace(/\{valueField\}/gm, value);
                    displayStr = displayStr.replace(/\{displayField\}/gm, displayValue);
                } else if ($.isFunction(displayFormat)) {
                    //format的格式： function(item){ return item.value +":"+item.text} ;
                    displayStr = displayFormat.call(ME, item);
                }
            }
            return  displayStr;
        },
        //下拉列表展现之前，生成列表
        _prevShowList :function() {
            if (this.isFirstShow) {
                //插入节点
                var listHtml = [];
                var id = this.element.attr('id');
                listHtml.push('<div id="');
                listHtml.push(id);
                listHtml.push('-combolist" class="f-combo-list-container" style="display:none">');
                listHtml.push('<div id="');
                listHtml.push(id);
                listHtml.push('-combo-inner" class="f-combo-list-inner" ></div></div>');
                $('body').append(listHtml.join(''));
                //存放列表外框容器对象，控制列表的高度，滚动条在该对象中出现
                this.listEl = $I(id + '-combolist');
                // 存放列表的div，冒泡的方式绑定click事件。
                this.listDiv = $I(id + '-combo-inner');
                //给列表绑定事件。
                var listDivEvent = this._getEvent('listDiv');
                this.listDiv.bind(listDivEvent);
                this.isFirstShow = false;
            }
            var items = this.displayItems;
            if (items.length == 0) {
                return false;
            } else {
                this._renderListItem(items);
                return true;
            }
        },
        //private 获取下拉列表的宽度
        _getListWidth : function() {
            var inputEl = this.inputEl;
            var imgEl = this.imgEl;
            var options = this.options;
            var listWidth = options.listWidth;
            var inputWidth = inputEl.outerWidth() + imgEl.outerWidth();
            var liWidth = listWidth ? listWidth : inputWidth;

            return liWidth;
        },
        //展现下拉列表
        _show : function(isImgClick) {
            var options = this.options;
            if (isImgClick) {
                $(document).trigger('click.FCombo');
            }
            //如果下拉列表已经展现，则不展现
            if (this.isShow !== true) {
                if (this.isLoading) {
                    return;
                }
                if (this.isStaticLoad === true || this.hasLoaded) {
                    //生成列表
                    if (!this._prevShowList()) {
                        return false;
                    }
                    if (!options._startFilter) {
					            // 调整滚动条
					            this._adjustHeight();
	                    this._showList();
					            options._startFilter = true;
                    } else {
	                    //展现列表
	                    this._showList(false);
                  	}
                    //调整滚动条，默认选中
                    this._afterShowList();
                    this.isShow = true;
                } else {
                    //发送ajax请求
                    if (options.dataUrl && (options.autoload == false) && !this.hasLoaded) {
                        this._prepareAjaxLoad(true);
                    }
                }
            }
        },
        //设置list的位置以及展现list列表
        _showList : function(isFirst) {
        	// begin mod 20130328 hanyin
          /*  var inputEl = this.inputEl;
            var listEl = this.listEl;
            var offset = inputEl.offset(),listOuterHeight = inputEl.outerHeight();
            var listStyle = listEl.get(0).style;
            listStyle.left = (offset.left) + 'px';
            listStyle.top = (offset.top + listOuterHeight) + 'px';
            listStyle.width = (this._getListWidth() - 2) + 'px';
            listStyle.display = 'block';
           */
	            var UTILS = window['$Utils'];
	            var listEl = this.listEl;
	            var inputEl =  this.inputEl;
	            var listStyle = listEl.get(0).style;
           if (isFirst === false) {
	            listStyle.display = 'block';
           } else {
	            listStyle.width = (this._getListWidth() - 2) + 'px';

	            var pos =  UTILS.getAlignXY(inputEl,listEl);
	            var top = pos.top ;
	            var left = pos.left;
	            listStyle.left = left + 'px';
	            listStyle.top = top + 'px';

	            listStyle.display = 'block';
					}            
            // end mod 20130328 hanyin
        },
        //列表展现以后，做滚动条调整。
        _afterShowList : function(isFilter) {
            var UTILS = window['$Utils'];
            if (isFilter) {
                this._setSelectEl();
            } else {
                if (false === this.isMatchValue) {
                    if (!this.options.multiSelect) {
                        var firstDiv = this.listDiv.children(':first');
                        if (firstDiv.length) {
                            UTILS.addClass(firstDiv.get(0), 'f-combo-list-div-mouseover');
                        }
                    }
                }
            }
            this._appendEvent();
        },
        // 隐藏下拉列表时，清楚输入框中有不合法的内容
        _resetValueOnBlur  : function() {
            //2012-12-21  add by qudc  新增下面语句，解决原先bug：不能清空输入框以及隐藏域中的值。start
            var value = this.inputEl.val();
            if (!value) {
                this.element.val('');
                this.value = '';
                this.inputEl.val('');
            } else {
                //2012-12-21  add  by qudc  end
                if (this.options.forceSelection) {
                    var displayValue = this.displayValue;
                    this.inputEl.val(displayValue);
                } else {
                    //修复bug：3615  2013-01-17  add by qudc
                    var valueArr = value.split(this.options.displaySeparate);
                    var v = valueArr[0];
                    var element = this.element;
                    element.val(v);
                    this.value = v;
                    element.isValidate && element.isValidate();
                }
                //修复bug：3615
            }
        },
        //document添加click事件，用于隐藏下拉列表
        _appendEvent : function() {
            var ME = this,UTILS = window['$Utils'];
            var stop = function(e) {
                UTILS.stopPropagation(e);
            }
            var click = function() {
                ME._hideList();
                ME._resetValueOnBlur();
                ME.inputEl.unbind('click.FCombo', stop);
                $(document).unbind('click.FCombo');
            }
            $(document).one('click.FCombo', click);
            ME.inputEl.bind('click.FCombo', stop);
        } ,
        //调整下拉列表的高度
        _adjustHeight : function() {
            var options = this.options ,listHeight = options.listHeight,listEl = this.listEl;
            var items = this.displayItems;
            var listStyle = listEl.get(0).style;
            /*
            if (listHeight) {
                var itemLen = items.length;
                var totalHeight = itemLen * options.itemHeight;
                listHeight = listHeight - 2;
                if (listHeight < totalHeight) {
                    listStyle.height = listHeight + 'px';
                } else {
                    listStyle.height = (totalHeight+2) + 'px';
                }
            } else {
                listStyle.height = 'auto';
            }
            */
            listStyle.height = listHeight + 'px';
        },
        //选中列表样式
        _setSelectEl : function() {
            var UTILS = window['$Utils'];
            var value = this.value;
            var listEl = this.listEl;

            if (UTILS.isEmpty(value)) {
                this._selectFirstListEl();

                listEl.get(0).scrollTop = 0;
            } else {
                var listDiv = this.listDiv;
                var selectEl = listDiv.children('div[f_value="' + value + '"]');
                if (selectEl.length > 0) {
                    UTILS.removeClass(this.overId, 'f-combo-list-div-mouseover');
                    UTILS.addClass(selectEl.get(0), 'f-combo-list-div-mouseover');
                    this.overId = selectEl.attr('id');
                    this.selectId = selectEl.attr('id');
                } else {
                    this._selectFirstListEl();
                    listEl.get(0).scrollTop = 0;
                }
            }
        },
        //选择第一条记录
        _selectFirstListEl : function() {
            var UTILS = window['$Utils'];
            var listDiv = this.listDiv;
            var firstEl = listDiv.children(':first');
            UTILS.removeClass(this.overId, 'f-combo-list-div-mouseover');
            UTILS.addClass(firstEl.get(0), 'f-combo-list-div-mouseover');
            this.overId = firstEl.attr('id');
        },
        //隐藏下拉列表
        _hideList : function() {
            if (this.isShow === true) {
                this.listEl.hide();
                this.isShow = false;
            }
        } ,
        //ajax请求数据的方法，同于下拉框级联
        /**
         * 刷新下拉列表中的数据,重置状态 参数： 无 返回值： void
         * @name FCombo#doLoad
         * @param  params  参数（类型：Object）
         * @param  dataUrl 请求路径（类型：String）
         * @function
         * @return void
         * @example
         */
        doLoad : function(params, dataUrl) {
            this._clear();
            this._prepareAjaxLoad(false, params, dataUrl);
        },
        //ajax请求方法，可以传递参数，请求路径，成功回调函数，失败回调函数
        _load : function(params, dataUrl, loadSuccess, loadFailure, onErrorFn) {
            var options = this.options , UTILS = window['$Utils'];
            params = params || {};




            dataUrl = dataUrl || options.dataUrl;
            if (options.baseParams) {
                params = UTILS.apply(options.baseParams, params);
            }
            params._respType = 'list';

            var successFn, failureFn;
            if ($.isFunction(loadSuccess)) {
                successFn = loadSuccess;
            }
            if ($.isFunction(loadFailure)) {
                failureFn = loadFailure;
            }
            this.isLoading = true;
            if (dataUrl.indexOf("/") !== 0) {
                dataUrl = UTILS.getContextPath() + "/" + dataUrl;
            }
            $.FUI.FAjax.remote({
                type:"POST",
                url:  dataUrl,
                dataType: "json",
                data: params,
                context :this,
                success: successFn ,
                failure:failureFn ,
                error : onErrorFn
            });
        },
        //根据关键值来获取其所在的数据对象以及索引
        _getItemByValue : function(value) {
            var options = this.options;
            var items = this.displayItems || [];
            var UTILS = window['$Utils'];
            var result = null;
            if (UTILS.isEmpty(items)) {
                return  result;
            }
            var itemsLen = items.length;
            var valueField = options.valueField;
            var itemIndex = null;
            //查找对应的数据
            for (var i = 0; i < itemsLen; i++) {
                var item = items[i];
                var v = item[valueField];
                if (value === v) {
                    result = item;
                    break;
                }
            }
            return result;
        },
        //获取选中列表的对象（值）
        _getSelectEl : function() {
            var listDiv = this.listDiv,options = this.options;
            var selectEl;
            selectEl = listDiv.children(".f-combo-list-div-mouseover");
            return selectEl;
        },
        //对象销毁方法
        destroy : function() {
            this.imgEl.unbind();
            this.inputEl.unbind();
            this.listDiv && this.listDiv.unbind();
            $(document).unbind('click.FCombo');
            this.inputEl = null;
            this.imgEl = null;
            this.listEl = null;
            this.listDiv = null;
            $.Widget.prototype.destroy.call(this);
        },
        /**
         * 获取输入框的值。 参数： 无 返回值: String
         * @name FCombo#getValue
         * @function
         * @return String
         * @example
         */
        getValue :function() {
            return this.value || "";
        },
        /**
         * 获取被选中值相关的记录数据。 参数： 无 返回值: Object[]
         * @name FCombo#getSelectedDatas
         * @function
         * @return Object[]
         * @example
         */
        getSelectedDatas :function() {
            var ME = this, options = this.options, multiSelect = options.multiSelect,multiSeparator = options.multiSeparator;
            var items = options.staticData ,len = items.length;
            var valueField = options.valueField,displayField = options.displayField;

            var selectedData = [];
            if (multiSelect) {
                //多选模式下
                var values = ME.getValue().split(multiSeparator);
                var vLen = values.length;
                for (var i=0; i<vLen; i++) {
                	var v = values[i];
                	for (var j=0; j<len; j++) {
                		if (v == items[j][valueField]) {
                			selectedData.push(items[j]);
	                    	break;
	                    }
                	}
                }
            } else {
                for (var i = 0; i < len; i++) {
                	var v = ME.getValue();
                    var item = items[i];
                    if (v == item[valueField]) {
                    	selectedData.push(item);
                    }
                }
            }
            return selectedData;
        },
        /**
         * 重置表单域的值为空，如果存在隐藏域，隐藏域也会被清空。但是不会去除表单域的校验信息，如果需要去除表单域的校验信息，请调用FForm的reset方法。
         * @name FCombo#reset
         * @function
         * @return void
         * @example
         */
        reset : function() {
            var defaultValue = this.options.defaultValue;
            if (defaultValue) {
                this.setValue(defaultValue, false);
            } else {
                this.setValue('', false);
            }

        },
        /**
         * 设置组件的值。 返回值: void
         * @name FCombo#setValue
         * @function
         * @param value 需要设置的值。 类型:"String/Boolean/Number/Float"。
         * @param fireSelectEvent 设值时是否触发select事件。值为true，设值时会触发onSelect事件。 类型:"Boolean"。
         * @example
         */
        setValue :function(v, fireSelectEvent, unValidate) {
            if (v === undefined || v === null) {
                return;
            }
            var ME = this ,options = this.options,element = this.element,inputEl = this.inputEl,multiSelect = options.multiSelect,multiSeparator = options.multiSeparator;
            var items = options.staticData ,len = items.length;
            var UTILS = window['$Utils'];
            var valueField = options.valueField,displayField = options.displayField;

            //2013-01-23 start  add by qudc  解决问题：当前组件采用dataUrl来异步加载数据，在组件的数据没有加载完时调用组件的setValue方法，不能设值的问题。

            //20130426 start mod by hanyin 修改此处设置defaultValue与reset的defaultValue冲突的问题
            if (!this.isStaticLoad && !this.hasLoaded && v) {
                options._valueCache = v;
            }//20130426 end mod by hanyin
            
            //2013-01-23 end add by qudc

            var record = {};
            if (v === '') {
                //清空处理
                this._clear();
                if (!unValidate) {
                    element.isValidate && element.isValidate();
                }
            } else {
                if (multiSelect) {
                    //多选模式下
                    this.lastRecord = this.lastRecord || [];
                    record = [];
                    var values = v.split(multiSeparator);
                    var vLen = values.length;
                    var result = '';
                    var isMatch = false;
                    for (var i = 0; i < len; i++) {
                        var item = items[i];
                        for (var j = 0; j < vLen; j++) {
                            var v = values[j];
                            if (v == item[valueField]) {
                                isMatch = true;
                                record.push(item);
                                result += multiSeparator + v;
                            }
                        }
                    }
                    if (isMatch) {
                        var r = result.slice(1);
                        element.val(r);
                        inputEl.val(r);
                        this.value = r;
                        this.displayValue = r;
                        if (!unValidate) {
                            element.isValidate && element.isValidate();
                        }
                    } else {
                        //设置的值没有匹配成功
                        element.val('');
                        inputEl.val('');
                        this.value = '';
                        this.displayValue = '';
                        if (!unValidate) {
                            element.isValidate && element.isValidate();
                        }
                    }
                } else {
                    this.lastRecord = this.lastRecord || {};
                    for (var i = 0; i < len; i++) {
                        var item = items[i];
                        if (v == item[valueField]) {
                            record = item;
                            var displayStr = this._getFormatStr(item);
                            element.val(v);
                            this.value = v;
                            inputEl.val(displayStr);
                            this.displayValue = displayStr;
                            if (!unValidate) {
                                element.isValidate && element.isValidate();
                            }
                            break;
                        }
                    }
                }
            }
            var lastRecord = this.lastRecord;
            this.lastRecord = null;
            this.lastRecord = record;
            /**
             * 在选中一条记录时触发 事件参数: record : object,array 将要被选中的记录(multiSelect为true时，为array类型) ， lastRecord：object 上次选择的数据对象(multiSelect为true时，为array类型)  ，data：object 下拉框的数据对象
             * @event
             * @name FCombo#onSelect
             * @param record 类型："object,array"
             * @param lastRecord 类型："object,array"
             * @param data 类型："object"
             * @example
             *
             */
            if (fireSelectEvent) {
                options.onSelect && options.onSelect.call(ME, record, lastRecord, options.staticData);
            }
        },
        /**
         * 判断传入的值是否在下拉中有对应，如果没有则返回false，否则返回true；如果是多选模式，只有在所有的值都匹配的时候才返回true，否则返回false。
         * @name FCombo#isMatch
         * @param  v  参数（类型：Object）
         * @function
         * @return boolean
         * @example
         */
        isMatch : function(v) {
            if (!v) {
                return false;
            }
            var ME = this, options = this.options, multiSelect = options.multiSelect,multiSeparator = options.multiSeparator;
            var items = options.staticData ,len = items.length;
            var valueField = options.valueField,displayField = options.displayField;

            if (multiSelect) {
                //多选模式下
                var values = v.split(multiSeparator);
                var vLen = values.length;
                for (var i=0; i<vLen; i++) {
                	var v = values[i];
                	var _match = false;
                	for (var j=0; j<len; j++) {
                		if (v == items[j][valueField]) {
	                    	_match = true;
	                       	break;
	                    }
                	}
                    if (!_match) { // 有一个不匹配则全不匹配
                    	return false;
                    }
                }
                return true;
            } else {
                for (var i = 0; i < len; i++) {
                    var item = items[i];
                    if (v == item[valueField]) {
                    	return true;
                    }
                }
                return false;
            }
        },
        /**
         * 返回组件是否无效。返回值为false，表示该组件有效。若返回值为true，表示该组件无效。 参数： 无 返回值: Boolean 组件是否无效
         * @name FCombo#isDisabled
         * @function
         * @return Boolean
         * @example
         */
        isDisabled : function() {
            return !this.options.enabled;
        },
        /**
         * 使用布尔值设置组件有效或无效。 参数： disabled ：Boolean false表示设置组件有效。true表示设置组件无效。 返回值: void
         * @name FCombo#setDisabled
         * @function
         * @param disabled  类型:"Boolean"。
         * @example
         */
        setDisabled : function(disabled) {
            var UTILS = window['$Utils'],ME = this;
            if (ME.options.enabled === !disabled) {
                return;
            }
            if (false === disabled) {
                var parent = this.element.parent();
                if (parent.length > 0) {
                    UTILS.removeClass(parent.get(0), 'f-combo-disable');
                    ME.element.removeAttr('disabled');
                    ME.inputEl.removeAttr('disabled');
                    ME.options.enabled = true;
                    ME._bindEvent();
                }
            } else if (true === disabled) {
                var parent = this.element.parent();
                if (parent.length > 0) {
                    UTILS.addClass(parent.get(0), 'f-combo-disable');
                    ME.element.attr('disabled', '');
                    ME.inputEl.attr('disabled', '');
                    ME.options.enabled = false;
                    ME._unbindEvent();
                }
            }
        },
        /**
         * 判断组件是否可编辑 参数： 无 返回值： Boolean
         * @name FCombo#isReadonly
         * @function
         * @return Boolean
         * @example
         */
        isReadonly : function() {
            return this.options.readonly;
        },
        /**
         * 设置组件是否可编辑 参数： readonly 。 返回值： void
         * @name FCombo#setReadonly
         * @function
         * @param readonly  类型:"Boolean"。
         * @example
         */
        setReadonly : function(readonly) {
            var ME = this , options = ME.options,UTILS = window['$Utils'];
            if (options.readonly === readonly) {
                return;
            }
            if (true == readonly) {

                var parentEl = ME.inputEl.parent();
                if (parentEl.length > 0) {
                    options.readonly = readonly;
                    ME.inputEl.attr('readonly', 'readonly');
                    UTILS.addClass(parentEl.get(0), 'f-combo-readonly');

                }
            } else if (false == readonly) {
                var parentEl = ME.inputEl.parent();
                if (parentEl.length > 0) {
                    options.readonly = readonly;
                    ME.inputEl.removeAttr('readonly');
                    UTILS.removeClass(parentEl.get(0), 'f-combo-readonly');

                }

            }
        },
        /**
         * 判断组件下拉图片是否可点击 参数： 无 返回值： Boolean
         * @name FCombo#isSelectable
         * @function
         * @return Boolean
         * @example
         */
        isSelectable : function() {
            return this.options.selectable;
        },
        /**
         * 设置输入框是否可编辑，下拉图片是否可点击。selectable默认为true。setSelectable为false时，输入框不可编辑且下拉图片不可点击。参数： selectable : Boolean 返回值： void
         * @name FCombo#setSelectable
         * @function
         * @param selectable  类型:"Boolean"。
         * @example
         */
        setSelectable : function(selectable) {
            var ME = this,UTILS = window['$Utils'];
            if (ME.options.selectable === selectable) {
                return;
            }
            if (true === selectable) {
                var parentEl = ME.inputEl.parent();
                if (parentEl.length > 0) {
                    ME.inputEl.removeAttr('readonly');
                    ME.options.selectable = selectable;
                    UTILS.removeClass(parentEl.get(0), 'f-combo-selectable');
                    ME._bindEvent();
                }
            } else if (false === selectable) {
                var parentEl = ME.inputEl.parent();
                if (parentEl.length > 0) {
                    ME.inputEl.attr('readonly', 'readonly');
                    ME.options.selectable = selectable;
                    UTILS.addClass(parentEl.get(0), 'f-combo-selectable');

                    ME._unbindEvent();

                }
            }
        },
        /**
         * 获取下拉框中所有下拉内容 参数： 无 返回值： Array
         * @name FCombo#getData
         * @function
         * @return Array
         * @example
         */
        getData : function() {
            return this.options.staticData;
        },
        _clear : function() {
            this.inputEl.val('');
            this.element.val('');
            this.value = '';
            this.displayValue = '';
        },
        /**
         * 用于动态设置组件的静态数据, 返回值： void
         * @name FCombo#setStaticData
         * @function
         * @param staticData  类型： array 组件的静态数据。格式例如：[{'text':'恒生电子','value':'600570'}]
         * @return void
         * @example
         */
        setStaticData : function(staticData) {
            var options = this.options,UTILS = window['$Utils'],onFilter = options.onFilter;
            if (!staticData) {
                return;
            }
            if (staticData.length > 0) {
                this.isStaticLoad = true;
            }
            this._clear();
            if ($.isFunction(onFilter)) {
                this.displayItems = this.options.staticData = onFilter.call(this, staticData);
            } else {
                this.displayItems = this.options.staticData = staticData;
            }
            var defaultValue = options._valueCache || options.defaultValue;
            if (!UTILS.isEmpty(defaultValue)) {
                this.setValue(defaultValue, false, true);
                if (options._valueCache) {
                	options._valueCache = undefined;
                }
            } else if (options.selectFirst) {
                //选中第一条数据
                var staticData = this.options.staticData;
                var item = staticData[0];
                var value = item[options.valueField];
                this.setValue(value, false, true);
            }

        },
        /**
         * 重新设置组件的基本参数。返回值： void
         * @name FCombo#setBaseParams
         * @function
         * @param params  类型:"object"。
         * @example
         */
        setBaseParams :function(params) {
            if (typeof params == 'object') {
                this.options.baseParams = params;
            }
        }
    });
})(jQuery);



/*
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Accordion.js
 * 作者：hanyin
 * 邮箱：hanyin@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FAccordion组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 20121231  hanyin		创建
 * 20130110  hanyin		在大小变化是，设置content的宽度
 */

/**
 * @name FAccordion
 * @class 
 * 可折叠组件，也可被叫做手风琴组件或者抽屉组件，一次只能打开一个抽屉,通常用于主框架页面中的菜单展示。
 */

/**@lends FAccordion# */

(function($) {
	$.registerWidgetEvent("");
	$.widget("FUI.FAccordion", {
	    options : {
	    	/**
	    	 * 标识(仅标签使用)
	    	 * @name FAccordion#<ins>id</ins>
	    	 * @type String
	    	 * @default null
	    	 * @example 
	    	 * 无
	    	 */
	    	id : null,

	    	/**
	    	 * 抽屉布局首次展现时，默认展开的抽屉的索引，可以为整数,也可以为抽屉的id,获取当前处于激活状态的抽屉id可用getActivated()方法。</br>
	    	 * <ul>
	    	 * <li>如果抽屉个数为0，则active=-1，即不打开抽屉</li>
	    	 * <li>如果抽屉个数大于0，且active小于0(当为-1时并且collapsible!==false，则可以收起所有抽屉)，则active=0，</li>
	    	 * <li>如果抽屉个数大于0，且active大于抽屉的个数，则active=抽屉的个数-1</li>
	    	 * </ul>
	    	 * @name FAccordion#<ins>active</ins>
	    	 * @type String,Number
	    	 * @default 0
	    	 * @example
	    	 * 无 
	    	 */
	    	active : 0,

	    	/**
	    	 * 抽屉组件的高度，可取值为'auto'（每个抽屉的高度分别由抽屉的内容决定），这也是默认值；
	    	 * 可以取值为'fit'，表示适应父容器的大小，此时本组件必须是父容器的唯一儿子；也可以取值数字和数字类字符串，此时固定高度。
	    	 * @name FAccordion#<ins>height</ins>
	    	 * @type Number,String
	    	 * @default 'auto'
	    	 * @example
	    	 * 无 
	    	 */
	    	height : "auto",
	    	// 内容的高度
	    	_contentHeight : "auto",

	    	/**
	    	 * 抽屉布局的高度，可取值为'auto'或者"fit"，都表示自动适应父容器的宽度；可以取值数字和数字类字符串，固定宽度。
	    	 * @name FAccordion#<ins>width</ins>
	    	 * @type Number,String
	    	 * @default 'auto'
	    	 * @example 
	    	 */
	    	width : "auto",
	    	
	    	/**
	    	 * 激活一个抽屉时执行的方法
	    	 * @event
	    	 * @name FAccordion#onActive  
	    	 * @param index 被激活的抽屉的索引，从0开始计数。 
	    	 * @example
	    	 */
	    	onActive : null,

	    	/**
	    	 * 激活一个抽屉之前执行的方法。 如果返回布尔值false,那么对应抽屉将不会激活。
	    	 * @event
	    	 * @name FAccordion#onBeforeActive 
	    	 * @param index 被选择的抽屉的索引，从0开始计数。
	    	 * @example
	    	 */
	    	onBeforeActive : null,

	    	/**
	    	 * 收起一个抽屉前执行的方法。 如果返回布尔值false,那么对应抽屉将不会被收起。
	    	 * @event
	    	 * @name FAccordion#onBeforeCollapse  
	    	 * @param index 被收起的抽屉的索引，从0开始计数。 
	    	 * @example
	    	 */
	    	onBeforeCollapse : null,

	    	/**
	    	 * 收起一个抽屉时执行的方法
	    	 * @event
	    	 * @name FAccordion#onCollapse  
	    	 * @param index 被收起的抽屉的索引，从0开始计数。
	    	 * @example
	    	 */
	    	onCollapse : null,
	    	
	    	// 缓存所有headers的jquery对象
	    	_objHeaders : null,
	    	// 当前被激活的Id
	    	_curActiveId : null,
	    	
	    	_showProps : { 
		    	height: "show"
	    	},
	    	_hideProps : {
		    	height: "hide"
	    	}
	    },
	    
	    /**
	     * 销毁组件
	     * @name FAccordion#destroy
	     * @function
	     * @example
	     */
	    destroy : function() {
		    this._destroy();
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    },
	    
	    _destroy : function() {
		    op._objHeaders || op._objHeaders.destory();
		    op._objHeaders = null;
	    },
	    
	    _create : function() {
	    	var self = this;
	    	var op = self.options;
	    	op.id = this.element.attr("id");
	    	op._objHeaders = $Utils.IndexMap();
	    	self._initHeaders();
	    },
	    
	    _initHeaders : function() {
	    	var self = this;
	    	var op = self.options;
	    	var headerMappings = op._objHeaders;
	    	var headers = self.element.children(".f-accordion-header");;
	    	var size = headers.length;
	    	for (var i=0; i<size; i++) {
	    		var el = $(headers.get(i));
	    		if (i == size-1) {
	    			el.addClass("f-accordion-header-last-collapsed");
	    		}
	    		el.click(function() {
	    			self._toggleActivate(headerMappings.indexOf($(this).attr("id")));
	    		});
	    		headerMappings.put(el.attr("id"), el);
	    	}
	    },
	    
	    _init : function() {
	    	var self = this;
	    	var op = self.options;
	    	// 调整大小
	    	self.setSize(op.width, op.height);
	    	// 默认激活第一个
	    	self.activate(op.active);
	    },
	    // n只能是索引
	    _toggleActivate : function(n) {
	    	var self = this;
	    	var op = self.options;
	    	var headers = op._objHeaders;
	    	var size = headers.size();
	    	var id = headers.element(n).key;
	    	if (id == op._curActiveId){ // 已经被激活，则隐藏
	    		if (n >=0 && n < size-1) {
	    			n = n+1;
	    		} else if (n == size-1) { // 已经是最后一个则激活前一个
	    			n = n-1
	    		}
	    	}
	    	self.activate(n);
	    },

	    /**
	     * 激活指定的抽屉。index为整数或者抽屉的id。任何其它数据将会用parseInt及isNaN进行处理。 (注意，如果组件为禁用状态，执行此方法无任何效果)
	     * <ul>
	     * <li>如果抽屉个数为0，则不激活任何抽屉</li>
	     * <li>如果抽屉个数大于0，且index<0，则激活第一个抽屉(索引为0的那个抽屉)</li>
	     * <li>如果抽屉个数大于0，且index>=抽屉的个数，则激活最后一个抽屉</li>
	     * </ul>
	     * @name FAccordion#activate
	     * @function
	     * @param index 要激活的抽屉的索引(从0开始)或者抽屉的id
	     * @example
	     */
	    activate : function(n) {
	    	var self = this;
	    	var op = self.options;
	    	var headers = op._objHeaders;
	    	var size = headers.size();
	    	
	    	var el = self._parseToEl(n, headers);
	    	if (!el || el.length == 0) {
	    		return false;
	    	}
	    	
	    	var id = el.attr("id");
	    	var index = headers.indexOf(id);
	    	var curActiveId = op._curActiveId;
	    	if (id === curActiveId) { // 如果已经处于开启状态，则不重复展开
	    		return false;
	    	}
	    	
	    	// 调用hide回调，如果返回false，则阻止展开
	    	if (op._curActiveId && op.onBeforeCollapse) {
	    		var result = self._tryExcuteFunc(self, op.onBeforeCollapse, [headers.indexOf(op._curActiveId)]);
	    		if (result === false) {
	    			return false;
	    		}
	    	}
	    	
	    	// 调用show回调，如果返回false，则阻止激活
	    	if (op.onBeforeActive) {
	    		var result = self._tryExcuteFunc(self, op.onBeforeActive, [index]);
	    		if (result === false) {
	    			return false;
	    		}
	    	}
	    	
	    	// 隐藏当前被激活的页签
	    	var toHide = self._hideCurActive();
	    	// 显示此时被激活的页签
	    	var toShow = self._showActive(index, id, el);
	    	// 执行动画
//	    	if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
	    		!toHide || toHide.addClass("f-state-hide");
	    		toShow.removeClass("f-state-hide");
//	    	} else {
//		    	self._animate(toHide, toShow);
//	    	}
	    	var lasActiveId = op._curActiveId;
		    op._curActiveId = id;
	    	
	    	!op.onCollapse || self._tryExcuteFunc(self, op.onCollapse, [headers.indexOf(lasActiveId)]);
	    	!op.onActive || self._tryExcuteFunc(self, op.onActive, [index]);
	    },

    	// 之所以不直接使用slideUp和slideDown，是为了避免在动画过程中出现抖动的问题
	    _animate : function(toHide, toShow) {
	    	var op = this.options;
	    	var height = op._contentHeight;
			var adjust = 0;
	    	!toHide || toHide.stop(true,true).animate( op._hideProps, {
				duration: "fast",
				step : function( now, fx ) {
					fx.now = Math.round( now );
				}
			});
			toShow.stop(true,true).animate( op._showProps, {
				duration: "fast",
				step : function( now, fx ) {
					fx.now = Math.round( now );
					if (fx.prop !== "height") {
						adjust += fx.now;
					} else if (toHide && !isNaN(height)) {
						fx.now = Math.round( height - toHide.height() - adjust);
						adjust = 0;
					}
				}
			});
	    },
	    
	    _hideCurActive : function() {
	    	var self = this;
	    	var op = self.options;
	    	var headers = op._objHeaders;
	    	var id = op._curActiveId;
	    	if (!id) {
	    		return null;
	    	}
	    	var el = headers.get(id);
	    	var contentEl = el.next();
	    	if (!el || el.length==0 || !contentEl || contentEl.length==0) {
	    		return null;
	    	}
    		if (headers.indexOf(el.attr("id")) === headers.size()-1) {
    			el.addClass("f-accordion-header-last-collapsed");
    		}
    		el.children(".f-accordion-tool").addClass("f-tool-expand").removeClass("f-tool-collapse");
    		var nextHeader = contentEl.next();
    		nextHeader.removeClass("f-accordion-header-sibling-expanded");
//	    	contentEl.stop(true,true).slideUp("fast");
    		return contentEl;
	    },
	    
	    _showActive : function(n, id, el) {
	    	var self = this;
	    	var op = self.options;
	    	var headers = op._objHeaders;
	    	var contentEl = el.next();
    		if (n == headers.size()-1) {
    			el.removeClass("f-accordion-header-last-collapsed");
    		}
    		el.children(".f-accordion-tool").addClass("f-tool-collapse").removeClass("f-tool-expand");
    		var nextHeader = contentEl.next();
    		nextHeader.addClass("f-accordion-header-sibling-expanded");
//	    	contentEl.stop(true,true).hide().slideDown("fast");
	    	return contentEl;
	    },
	    
	    _parseToEl : function(n, headers) {
	    	if ($Utils.isJQueryObj(n)) { // jquery对象
	    		return n;
	    	}
	    	headers = headers || this.options._objHeaders;
	    	var size = headers.size();
	    	if (!isNaN(n)) { // 索引
	    		if (n < 0) {
	    			n = 0;
	    		} else if (n >= size) {
	    			n = size-1;
	    		}
	    		return headers.element(n).value;
	    	}
	    	if ($Utils.isString(n)) { // id
	    		return this.element.children("#"+n);
	    	}
	    	return null;
	    },
	    
	    /**
	     * 获取当前处于激活状态的抽屉的id,如果抽屉总数为0或者当前没有抽屉处于激活状态，那么返回null。
	     * <br/>可以通过返回的Id获取抽屉的header和content对象。
	     * @name FAccordion#getActivated
	     * @function
	     * @return 当前处于激活状态的抽屉的id
	     * @example
	     * var headerId= $("#accordion1").FAccordion("getActivated"); // 获取当前被激活的抽屉的ID
	     * var headerEl = $("#"+headerId); // 获取header对象
	     * var contentEl = headerEl.next(); // 获取content对象
	     */
	    getActivated : function() {
	    	return this.options._curActiveId;
	    },
	    
	    /**
	     * 获取指定索引抽屉的ID，如果不存在则返回null。<br/>可以通过返回的Id获取抽屉的header和content对象。
	     * @name FAccordion#getActivated
	     * @function
	     * @return 当前处于激活状态的抽屉的id
	     * @example
	     * var headerId= $("#accordion1").FAccordion("getByIndex", 1);
	     * var headerEl = $("#"+headerId); // 获取header对象
	     * var contentEl = headerEl.next(); // 获取content对象
	     */
	    getByIndex : function(n) {
	    	return this.options._objHeaders.element(n).key;
	    },

	    /**
	     * 获取抽屉的总数。
	     * @name FAccordion#getLength
	     * @function
	     * @return Number 抽屉的总数
	     * @example
	     */
	    getLength : function() {
	    	return this.options._objHeaders.size();
	    },

	    /**
	     * 设置指定抽屉的标题，标题内容可以为html文本
	     * @name FAccordion#setTitle
	     * @function
	     * @param index 要改变标题的抽屉的索引（从0开始计数）或者是抽屉的id
	     * @param title 新的标题，内容可以为html
	     * @return 0 Boolean
	     * @example
	     */
	    setTitle : function(n, title) {
	    	var self = this;
	    	var op = self.options;
	    	var el = self._parseToEl(n, op._objHeaders);
	    	if (!el || el.length == 0) {
	    		return false;
	    	}
	    	title = title || " ";
	    	el.children(".f-accordion-header-text").html(title);
	    },

	    /**
	     * 设置组件的大小
	     * @name FAccordion#setSize
	     * @function
	     * @param w 组件的宽度，支持Number/String，比如 500或者"500px"，不能传入其他的无效值
	     * @param h 组件的高度，支持Number/String，比如 500或者"500px"，不能传入其他的无效值
	     * @example
	     */
	    setSize : function(w, h) {
	    	var self = this;
	    	var op = self.options;
	    	var selfEl = this.element;
	    	
	    	if (w) { // 设置宽度
	    		w = parseInt(w);
	    		if (!isNaN(w)) {
	    			w = w-2;  // 边框2像素
	    			if (w < 0) {w=0;}
	    		} else {
	    			w = selfEl.parent().width() -2; // 自适应父亲的高度
	    			if (w < 0) {w=0;}
	    		}
	    		if (op.width !== w) {
	    			selfEl.width(w);
	    			self._adjustWidth(w);
	    		}
    			op.width = w;
	    	}
	    	if (h) { // 设置高度
	    		var rh = parseInt(h);
	    		if (!isNaN(rh)) {
	    			rh = rh-2; // 边框2像素
	    			if (rh < 0) {rh=0;}
	    		} else if (h === "fit") {
	    			rh = selfEl.parent().height() -2; // 自适应父亲的高度
	    			if (rh < 0) {rh=0;}
	    		} else {
	    			rh = "auto";
	    		}
	    		if (op.height !== rh) {
		    		selfEl.height(rh);
		    		// add 20130110 hanyin 在大小变化是，设置content的宽度
		    		self._adjustHeight(rh); // 调整内部content的高度
		    		// end add 20130110 hanyin 
	    		}
	    		op.height = h;
	    	}
	    },
	    
	    _adjustWidth : function(w) {
	    	var self = this;
	    	var op = self.options;
	    	var headers = op._objHeaders.elements;
	    	var size = headers.length;
	    	
	    	var contentWidth = "auto";
	    	if (!isNaN(w)) {
	    		contentWidth = w - 2; // 每个header的高度为28px
	    		if (contentWidth < 0) {contentHeight=0;}
	    	}
	    	for (var i=0; i<size; i++) {
	    		var el = headers[i].value;
	    		var contentEl = el.next();
	    		contentEl.width(contentWidth);
	    	}
	    	
	    	op._contentWidth = contentWidth;
	    },
	    
	    _adjustHeight : function(h) {
	    	var self = this;
	    	var op = self.options;
	    	var headers = op._objHeaders.elements;
	    	var size = headers.length;
	    	
	    	var contentHeight = "auto";
	    	if (!isNaN(h)) {
	    		contentHeight = h - size*28; // 每个header的高度为28px
	    		if (contentHeight < 0) {contentHeight=0;}
	    	}
	    	for (var i=0; i<size; i++) {
	    		var el = headers[i].value;
	    		var contentEl = el.next();
	    		contentEl.height(contentHeight);
	    	}
	    	
	    	op._contentHeight = contentHeight;
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
	    }
	});
})(jQuery);

/*
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Button.js
 * 作者：hanyin
 * 邮箱：hanyin@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FButton组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 20121231  hanyin		修复在IE下，点击Button周边无法出发点击事件的问题
 * 20130121  hanyin		新增setVisible、setDisabled方法
 * 20130123  hanyin		修复在setIconCls传入""之后，再次传入有效cls无法显示图标的问题
 * 20130131  hanyin		button的jsdoc中的setDisabled方法名错误为setDisable
 */

/** 
 * @name FButton
 * @class 
 * 按钮组件，代替原始html中的button，提供了图标的功能并扩展了常用的api，通常用于事件和动作触发。
 */

/**@lends FButton# */

/**
 * 标识（在标签中使用）
 * @name FButton#<ins>id</ins>
 * @type String
 * @default
 * @example
 * 无
 */

/**
 * 按钮的文本(仅标签使用)
 * @name FButton#<ins>text</ins>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 按钮的类型（submit、reset等）(仅标签使用)，此属性需要与Form一起使用。
 * @name FButton#<ins>type</ins>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 渲染该组件为禁用状态的（默认为false）(仅标签使用)
 * @name FButton#<ins>disabled</ins>
 * @type boolean
 * @default false
 * @example
 * 无
 */
				 
(function($, undefined) {
	$.registerWidgetEvent("onClick");
	$.widget("FUI.FButton", {
	    options : {
	        /**
	         * 用来指定text前面的样式类，非必须
	         * @name FButton#iconCls
	         * @type String
	         * @default ""
	         * @example
	         * 无
	         */
	        iconCls : null,
	        /**
	         * 按钮的点击事件
	         * @event
	         * @name FButton#onClick
	         * @example
	         */
	        onClick : null,
	        _disabled: false
	    },
	    _create : function() {
		    // 初始化ID
		    var ID = this.element.attr("id");
		    this.options.id = ID;
		    
		    this.options._disabled = this.element.hasClass("f-state-disabled");

		    // 绑定事件
		    this._bindEvent();
	    },
	    _init : function() {
	    },
	    _bindEvent : function() {
	    	var self = this;
	    	self.element.click(function(e) {
	    		// e.stopPropagation();
	    		self.click();
	    		// return false;
	    	});
	    },
	    // 对象销毁方法
	    destroy : function() {
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    },

	    /**
	     * 触发点击事件"onClick"。
	     * @name FButton#click
	     * @function
	     * @example
	     * $('#btn').FButton('click');
	     */
	    click : function() {
		    var self = this;
		    var op = self.options;
		    if (!self.isDisabled()) {
			    if ($.isFunction(op.onClick)) {
				    op.onClick.call(self);
			    }
		    }
	    },
	    /**
	     * 改变按钮的text属性。
	     * @name FButton#setText
	     * @function
	     * @param text 按钮文本
	     * @example
	     * $('#btn').FButton('setText','按钮text');
	     */
	    setText : function(text) {
		    if (text) {
			    this.element.find(".f-new-btn-text").html(text);
		    }
	    },
	    /**
	     * 判断组件是否被禁用
	     * @name FButton#isDisabled
	     * @function
	     * @example
	     * var disabled = $('#btn').FButton('isDisabled');
	     */
	    isDisabled : function() {
		    return this.options._disabled;
	    },
	    /**
	     * 禁用/启用组件。
	     * @name FButton#setDisabled
	     * @function
	     * @param disabled 如果为false，则表示启用；否则则表示禁用
	     * @example
	     * $('#btn').FButton('setDisable', false);
	     */
	    setDisabled : function(disabled) {
		    var op = this.options;
		    var selfEl = op._objSelfEl;
		    if (disabled === false) {
			    op._disabled = false;
			    this.element.removeClass("f-state-disabled");
		    } else {
			    op._disabled = true;
			    this.element.addClass("f-state-disabled");
		    }
	    }
	});

	$.widget("FUI.FSimpleButton", {
	    options : {
	        /**
	         * 此组件的整体高度（包括margin，单位像素），默认为24。<br/>
	         * 仅支持数字形式的字符串或者带px单位的数字字符串，比如"40"、"40px"，都是表示40个像素；其他非法形式的字符串则被忽略。<br/>
	         * 请慎重设置组件的margin的top和bottom值，在不同浏览器下可能是不同的显示效果。请不要设置button的padding、border的样式，否则会造成宽度计算不准确
	         * height属性不支持百分比。
	         * @name FSimpleButton#height
	         * @type String
	         * @default "24"
	         * @example
	         * 无
	         */
	        height : 24,
	        /**
	         * 此组件的整体宽度（包括margin，单位象素），默认为75。<br/>
	         * 支持数字形式的字符串或者带px单位的数字字符串，比如"40"、"40px"，都表示40个像素，字符串如"px50"、"abcpx"等其他非法形式的字符串则被忽略；
	         * width也支持百分比，比如"10%"，则表示占用外层容器(div,td等)宽度的比率，此时请慎重button设置左右margin、border和padding，否则会造成在不同浏览器下表现不一致不准确。<br/>
	         * 请不要设置button的padding、border的样式，否则会造成宽度计算不准确
	         * @name FSimpleButton#width
	         * @type String
	         * @default "75"
	         * @example
	         * 无
	         */
	        width : 75,
	        /**
	         * 按钮的点击事件
	         * @event
	         * @name FSimpleButton#onClick
	         * @example
	         */
	        onClick : null,

	        // 是否是禁用状态
	        _disabled : false
	    },
	    
	    _create : function() {
		    // 初始化ID
		    this.options.id = this.element.attr("id");
		    this.options._disabled = this._getBoxEl().hasClass("f-state-disabled");

		    // 绑定事件
		    this._bindEvent();
	    },
	    
	    _init : function() {
	    },
	    
	    _getBoxEl : function() {
	    	var op = this.options;
	    	var boxEl = op._objBoxEl;
	    	if (!boxEl) {
	    		boxEl = op._objBoxEl = this._getButtonEl().parent().parent();
	    	}
	    	return boxEl;
	    },
	    
	    _getButtonEl : function() {
	    	return this.element;
	    },

	    _bindEvent : function() {
		    var self = this;
		    var op = self.options;
		    var boxEl = self._getBoxEl();
		    var bntEl = self._getButtonEl();

		    boxEl.hover(function() {
		    	if (self.disabled()) {
		    		return;
		    	}
		    	boxEl.addClass("f-state-hover");
			}, function() {
		    	if (self.disabled()) {
		    		return;
		    	}
				boxEl.removeClass("f-state-hover f-state-active");
			}).mousedown(function() {
		    	if (self.disabled()) {
		    		return;
		    	}
				boxEl.addClass("f-state-active");
			}).mouseup(function() {
		    	if (self.disabled()) {
		    		return;
		    	}
				boxEl.removeClass("f-state-active");
			}).click(function() {
				self.click();
			});
			
		    bntEl.focus(function() {
		    	if (self.disabled()) {
		    		return;
		    	}
		    	boxEl.addClass("f-state-focus");
			}).blur(function() {
		    	if (self.disabled()) {
		    		return;
		    	}
				boxEl.removeClass("f-state-focus");
			});
	    },
	    
	    // 对象销毁方法
	    destroy : function() {
		    // 取消绑定的事件
	    	this._getBoxEl().unbind();
	    	this._getButtonEl().unbind();
	    	this.options._objBoxEl = null;
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    },

	    /**
	     * 触发点击事件"onClick"。
	     * @name FSimpleButton#click
	     * @function
	     * @example
	     * $('#btn').FButton('click');
	     */
	    click : function() {
		    var self = this;
		    var op = self.options;
		    if (!self.disabled()) {
			    // 如果有注册的点击事件，则先调用注册的点击事件
			    var canGo = true;
			    if ($.isFunction(op.onClick)) {
				    // setTimeout(function() {
				    var result = op.onClick.call(self);
				    canGo = (result === false) ? false : true;
				    // }, 0);
			    }
			    // 触发其他注册方式的点击事件
			    if (canGo) {
				    this.element.triggerHandler("onClick");
			    }
		    }
	    },
	    
	    /**
	     * 禁用/启用组件。
	     * @name FSimpleButton#disabled
	     * @function
	     * @param disabled 如果为false，则表示启用；否则则表示禁用
	     * @example
	     * $('#btn').FSimpleButton('disabled');
	     */
	    disabled : function(disabled) {
		    var op = this.options;
		    if (arguments.length === 0) {
		    	return op._disabled;
		    }
		    var boxEl = this._getBoxEl();
		    var bntEl = this._getButtonEl();
		    if (disabled === false) {
			    op._disabled = false;
			    boxEl.removeClass("f-state-hover f-state-active f-state-focus f-state-disabled");
			    bntEl.attr("disabled", false);
		    } else {
			    op._disabled = true;
			    boxEl.removeClass("f-state-hover f-state-active");
			    boxEl.addClass("f-state-disabled");
			    bntEl.attr("disabled", true);
		    }
	    },
	    
	    /**
	     * 改变按钮的text属性。
	     * @name FButton#setText
	     * @function
	     * @param text 按钮文本
	     * @example
	     * $('#btn').FButton('setText','按钮text');
	     */
	    setText : function(text) {
		    if (text) {
			    this._getButtonEl().html(text);
		    } else {
			    this._getButtonEl().html("&nbsp;");
		    }
	    }
	});

	$.FUI.FSimpleButton = $.FUI.FSimpleButton || {};
	$.FUI.FSimpleButton.generateHtml = function(op) {
		var id = op.id || $Utils.genId("f-button"); // 0
		var text = op.text || ("Button" + $Utils.UID); // 1
		var width = op.width || "75px"; // 2
		var height = op.height || "22px"; // 3
		var leftIconCls = op.leftIconCls; //4
		var rightIconCls = op.rightIconCls; // 5
		var onClick = op.onClick || ""; // 6
		var tabIndex = op.tabIndex || 0; // 7
		var disabled = op.disabled || false; // 8
		
		var iWidth = parseInt(width); // 9
		var iHeight = parseInt(height); // 10
		var iLineHeight = iHeight/2 -1; // 11
		
		var bntStyle = "width:"+iWidth+"px;"; // 12
		bntStyle += "height:"+iHeight+"px;";
		bntStyle += "line-height:"+iHeight+"px;";
		bntStyle += "margin-top:-"+(iLineHeight+2)+"px;";
		
		var boxStyle = op.style || ""; // 13
		
		var template = "\
			<div id='{0}-wrapper' style='{13}' class='f-button f-widget f-form-unselectable' onselectstart='return false;'> \
			<div class='f-button-box'  style='width:{9}px;height:{10}px'> \
			   <div class='f-button-t' style='line-height:{iLineHeight}px'>&nbsp;</div> \
			   <button id='{0}' hidefocus='true' class='f-button-text' style='text-align:center;{12}' \
			   	tabIndex={7}'> \
			   	{1} \
			   </button> \
			</div></div>";
    	return $Utils.format(template, id, text, width, height, leftIconCls, rightIconCls, onClick,
    			tabIndex, disabled, iWidth, iHeight, iLineHeight, bntStyle, boxStyle);
	};
})(jQuery);
/**
 * @name FButtonGroup
 * @class 
 * 按钮组， 管理多个Button组件，管理button的排布位置等
 */

/**@lends FButtonGroup# */

/**
 * 所有的button的排布：'center':表示居中，'left':居左，'right':居右。
 * @name FButtonGroup#<ins>buttonAlign</ins>
 * @type String
 * @default 'center'
 * @example
 * 无
 */

(function($) {
	$.FUI.FToolGroup = $.FUI.FToolGroup || {};
	$.FUI.FToolGroup.generateHtml = function(op) {
		var id = op.id || $Utils.genId("f-toolGroup"); // 0
		var style = op.style || ""; // 1
		var classes = op.classes || ""; // 2
		var width = op.width || "auto"; // 3
		var height = op.height || "auto"; // 4
		var toolAlign = op.toolAlign || "center"; //5
		var toolspacing = op.toolspacing || "2"; // 6
		var toolpadding = op.toolpadding || "0"; // 7
		var nested = ""; // 8
		
		function genItemHtml(item) {
			var html = "<td class='f-tool-cell'>" + item + "</td>"; 
			return html;
		}
		
		var items = op.items;
		for (var i=0; i<items.length; i++) {
			nested += genItemHtml(items[i]);
		}
		
		var template = "\
			<div id='{0}' class='f-toolGroup f-tools-{5} {2}' style='{1}'> \
				<table cellspacing='{6}' cellpadding='{7}' \
						style='height:{4};width:{3};' class='f-toolGroup-ct'> \
					<tbody><tr>{8}</tr> \
					</tbody> \
				</table> \
			</div>\
		";
		return $Utils.format(template, id, style, classes, width, height, 
				toolAlign, toolspacing, toolpadding, nested);
	};

	$.FUI.FButtonGroup = $.FUI.FButtonGroup || {};
	$.FUI.FButtonGroup.generateHtml = function(op) {
		op.id = op.id || $Utils.genId("f-buttonGroup");
		op.classes = (op.classes || "") + " f-buttonGroup ";
		op.toolAlign = op.buttonAlign;
		return $.FUI.FToolGroup.generateHtml(op);
	};
	
})(jQuery);
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
/**
 * @name FFieldset
 * @class 
 * 字段集容器，和HTML的&lt;fieldset&gt;标签的功能类似；在一个form中，对组件进行分组和管理，浏览器会以特殊方式来显示它们，它们可能有特殊的边界，或者甚至可创建一个子表单来处理这些元素；可以折叠和展开。
 */

/**@lends FFieldset# */

/**
 * 标识(仅标签使用)
 * @name FFieldset#<ins>id</ins>
 * @type String
 * @default 随机生成
 * @example
 * 无
 */

/**
 * 是否隐藏(仅标签使用)
 * @name FFieldset#<ins>visible</ins>
 * @type boolean
 * @default true
 * @example
 * 无
 */

/**
 * 头部显示的标题文字。(仅标签使用)
 * @name FFieldset#<ins>title</ins>
 * @type String 
 * @default ""
 * @example
 * 无 
 */

/**
 * 如果为true，FFieldset是可收缩的，并且有一个收起/展开按钮自动被渲染到它的头部工具区域，否则没有按钮(默认值为false)。(仅标签使用)
 * @name FFieldset#<ins>collapsible</ins>
 * @type Boolean
 * @default true
 * @example
 * 无 
 */

/**
 * 如果为true，将FFieldset渲染成收缩的，否则渲染成展开的(默认值为false)。(仅标签使用)<br/>
 * 如果设置了此值为true，并且同时设置了collapsible为false，那么此值设置无效，<br/>
 * 请慎重设置此值：如果在组件初始化设置了此值为true，那么在Fieldset第一次展开的时候在部分浏览器下会造成组件的宽（高）度有调整，但是之后将会表现正常。
 * @name FFieldset#<ins>collapsed</ins>
 * @type Boolean
 * @default false 
 * @example
 * 无 
 */

(function($) {
	$.registerWidgetEvent("onExpand,onCollapse");
	$.widget("FUI.FFieldset", {
	    options : {
	        /**
	         * 此组件的整体宽度（包括border和padding，单位象素），默认为"auto"。<br/>
	         * 支持数字形式的字符串或者带px单位的数字字符串，比如"40"、"40px"，都表示40个像素，字符串如"px50"、"abcpx"等其他非法形式的字符串则被忽略；
	         * width也支持百分比，比如"10%"，则表示占用外层容器(div,td等)宽度的比率，此时请慎重设置左右margin、border和padding，否则会造成在不同浏览器下表现不一致不准确。<br/>
	         * @name FPanel#width
	         * @type String
	         * @default "auto"
	         * @example
	         * 无
	         */
	        width : "auto",
	        /**
	         * 此组件的整体高度（包括border和padding，单位像素），默认为auto。<br/>
	         * 仅支持数字形式的字符串或者带px单位的数字字符串，比如"40"、"40px"，都是表示40个像素；其他非法形式的字符串则被忽略。<br/>
	         * 请慎重设置组件的margin的top和bottom值，在不同浏览器下可能是不同的显示效果。
	         * height属性不支持百分比。
	         * @name FPanel#height
	         * @type String
	         * @default "auto"
	         * @example
	         * 无
	         */
	        height : "auto",
	        /**
	         * 如果设置为true，表示控件在必要时自动显示横向或纵向滚动条。默认值为true。  (仅标签使用)
	         * @name FFieldset#<ins>autoScroll</ins>
	         * @type Boolean
	         * @default true 
	         * @example
	         * 无 
	         */
	        autoscroll : true,
	        /**
	         * 收起组件后触发的函数
	         * @event
	         * @name FFieldset#onCollapse
	         * @example
	         * onCollapse : function(){
	         *    //do something
	         * }
	         */
	        onCollapse : null,
	        /**
	         * 展开组件后触发的函数
	         * @event
	         * @name FFieldset#onExpand
	         * @example
	         * onExpand : function(){
	         *    //do something
	         * }
	         */
	        onExpand : null,

	        // 是否收起来
	        _isCollapsed : false,
	        // 是否需要在展开的时候重新计算高宽
	        _isNeedResize : false,
	        // 缓存jQuery对象：头部对象
	        _objHeader : null,
	        // 缓存jQuery对象：展开、收缩按钮
	        _objHeaderToggle : null,
	        // 缓存jquery对象：header
	        _objHeaderText : null,
	        // 缓存jQuery对象：bodyWrapper
	        _objBodyWrapper : null,
	        // 缓存body与外框相差的垂直像素个数
	        _bodyWrapperHGaps : 38,
	        // 缓存body与外框相差的水平像素个数
	        _bodyWrapperWGaps : 28
	    },
	    _create : function() {
		    // 初始化ID
		    var ID = this.element.attr("id");
		    var selfEl = this.element;
		    var op = this.options;

		    op.id = ID;
		    // 初始化缓存对象
		    op._objHeader = $I(ID + "-legend");
		    op._objHeaderToggle = $I(ID + "-toggle");
		    op._objHeaderToggle.css("float", "left");
		    op._objHeaderToggle.css("margin", "2px");
		    op._objHeaderText = $I(ID + "-title");
		    op._objBodyWrapper = $I(ID + "-bwrap");
		    // 是否折叠
		    op._isCollapsed = this.element.hasClass("f-collapsed");
		    op._isNeedResize = op._isCollapsed;
		    if (!op._isNeedResize) {
			    op._bodyWrapperHGaps = selfEl.outerHeight(false) - op._objBodyWrapper.height();
			    op._bodyWrapperWGaps = selfEl.outerWidth(false) - op._objBodyWrapper.width();
		    }
		    // 绑定事件
		    this._bindEvent();
	    },
	    _init : function() {
		    // 初始化
		    this.setSize(this.options.width, this.options.height);
	    },
	    _bindEvent : function() {
		    var self = this;
		    var toggleEl = this.options._objHeaderToggle;

		    // toggle绑定hover事件
		    toggleEl.hover(function(event) {
			    toggleEl.addClass("f-tool-toggle-over");
		    }, function(event) {
			    toggleEl.removeClass("f-tool-toggle-over");
		    });

		    // 绑定点击事件
		    toggleEl.click(function() {
			    if (self.options._isCollapsed) {
				    self.expand();
			    } else {
				    self.collapse();
			    }
			    return false;
		    });
	    },
	    /**
	     * 销毁对象
	     * @name FFieldset#destroy
	     * @function
	     * @example
	     */
	    destroy : function() {
		    // 取消绑定的事件
		    this.options._objHeaderToggle.unbind();
		    // 销毁jQuery对象
		    this.options._objHeader = null;
		    this.options._objHeaderToggle = null;
		    this.options._objHeaderText = null;
		    this.options._objBodyWrapper = null;
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    },
	    /**
	     * 展开组件
	     * @name FFieldset#expand
	     * @function
	     * @example
	     */
	    expand : function() {
		    var self = this;
		    var selfEl = this.element;
		    var op = self.options;
		    if (op._isCollapsed) {
			    op._objBodyWrapper.slideDown("fast", function() {
				    self.element.addClass("f-collapsible").removeClass("f-collapsed");
				    op._isCollapsed = false;
				    if (op._isNeedResize) {
					    op._bodyWrapperHGaps = selfEl.outerHeight(false)
					            - op._objBodyWrapper.height();
					    op._bodyWrapperWGaps = selfEl.outerWidth(false)
					            - op._objBodyWrapper.width();
					    self.setSize(op.width, op.height);
					    op._isNeedResize = false;
				    }
				    if (op.autoscroll) {
					    op._objBodyWrapper.css("overflow", "auto");
				    }
				    // 调用回调或者触发事件
				    var canGo = true;
				    if ($.isFunction(op.onExpand)) {
					    var result = op.onExpand.call(self); // 回调方法返回false，则阻止触发事件
					    canGo = (result === false) ? false : true;
				    }
				    if (canGo) {
					    self.element.triggerHandler('onExpand');
				    }
				    $(this).css({
				    	zoom : 1
				    });
			    });
		    }
	    },
	    /**
	     * 收起组件
	     * @name FFieldset#collapse
	     * @function
	     * @example
	     */
	    collapse : function() {
		    var self = this;
		    var op = self.options;
		    if (!op._isCollapsed) {
			    op._objBodyWrapper.slideUp("fast", function() {
				    self.element.removeClass("f-collapsible").addClass("f-collapsed");
				    op._isCollapsed = true;
				    // 调用回调或者触发事件
				    var canGo = true;
				    if ($.isFunction(op.onCollapse)) {
					    var result = op.onCollapse.call(self);
					    canGo = (result === false) ? false : true;
				    }
				    if (canGo) {
					    self.element.triggerHandler('onCollapse');
				    }
			    });
		    }
	    },
	    /**
	     * 设置标题。 参数: title : String 被设置的title文本 返回值: void
	     * @name FFieldset#setTitle
	     * @function
	     * @param title String
	     * @return void
	     * @example
	     */
	    setTitle : function(title) {
		    if (title) {
			    this.options.title = title;
			    this.options._objHeaderText.text(title);
		    }
	    },
	    /**
	     * 设置组件的高宽，组件会自动调整内部toolbar的大小和位置
	     * @name FPanel#setSize
	     * @function
	     * @param w 组件的宽度，必须是数字或者数字类的字符串，或者百分比
	     * @param h 组件的高度，必须是数字或者数字类的字符串
	     * @example
	     */
	    setSize : function(w, h) {
		    var UTILS = window["$Utils"];
		    var op = this.options;
		    var selfEl = this.element;
		    var bodyEl = op._objBodyWrapper;
		    var bodyContent = bodyEl.children(".f-panel-body-content");
		    var contentSize = bodyContent.size();

		    if (w) {
			    // border、padding占用的大小
			    var percentage = UTILS.getPercentage(w);
			    if (percentage) {
				    selfEl.get(0).style.width = percentage;
				    bodyEl.get(0).style.width = "auto";
				    if (contentSize === 1) {
					    bodyContent.get(0).style.width = "auto";
				    }
			    } else {
				    // 对于'40'和'40px'等同样处理为40
				    var gaps = op._bodyWrapperWGaps;
				    // var gaps = 0;
				    w = parseInt(w);
				    var realSize = w - gaps;
				    if (!isNaN(realSize)) {
					    if (realSize < 0) {
						    realSize = 0;
					    }
					    selfEl.get(0).style.width = realSize + "px";
					    if (contentSize === 1) {
						    bodyContent.get(0).style.width = realSize + "px";
					    } else {
						    bodyEl.get(0).style.width = realSize + "px";
					    }
				    }
			    }
		    }
		    if (h) {
			    // border、padding占用的大小
			    var percentage = UTILS.getPercentage(h);
			    if (percentage) {
				    selfEl.get(0).style.height = percentage;
				    bodyEl.get(0).style.height = "auto";
				    if (contentSize === 1) {
					    bodyContent.get(0).style.height = "auto";
				    }
			    } else {
				    // 对于'40'和'40px'等同样处理为40
				    var gaps = op._bodyWrapperHGaps;
				    var realSize = parseInt(h) - gaps;
				    if (!isNaN(realSize)) {
					    if (realSize < 0) {
						    realSize = 0;
					    }
					    if (contentSize === 1) {
						    var otherHeight = 0;
						    bodyContent.siblings().not('script').each(function() {
							    // alert($(this).attr('id') + ":" + $(this).outerHeight(true));
							    otherHeight += $(this).outerHeight(true);
						    });
						    realSize = (realSize - otherHeight) < 0 ? 0 : (realSize - otherHeight);
						    bodyContent.get(0).style.height = realSize + "px";
					    } else {
						    bodyEl.get(0).style.height = realSize + "px";
					    }
					    selfEl.get(0).style.height = "auto";
				    }
			    }
		    }
	    }
	});
})(jQuery);
﻿/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Upload.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FComboGrid组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 2013-01-14   qudc                修复bug：4519  修改width属性和size属性的jsdoc描述，说明其使用范围 。
 */
/**
 * @_name FUpload
 * @_class <b>单文件上传组件</b><br/>
 * 提供上传组件的样式，并和后台对接。
 */
	
  	/**@_lends FUpload# */

/**
 * 标识(仅标签使用)
 * @name FUpload#<b>id</b>
 * @type String
 * @default null
 * @example
 * 无
 */

/**
 * 在IE,chrome浏览器下，通过该属性设置组件的宽度，单位"px"。
 * @name FUpload#<b>width</b>
 * @type String
 * @default null
 * @example
 * 无
 */

/**
 * 对应html中的表单元素的name属性。默认值为：""。
 * @name FUpload#<b>name</b>
 * @type String
 * @default null
 * @example
 * 无
 */
/**
 * DOM焦点序号即tab键时候得到焦点的序号
 * @name FUpload#<b>tabIndex</b>
 * @type String
 * @default null
 * @example
 * 无
 */

/**
 * 组件的css样式设置
 * @name FUpload#<b>classes</b>
 * @type String
 * @default null
 * @example
 * 无
 */

/**
 * 在FireFox浏览器下通过设置size属性来设置组件的宽度。
 * @name FUpload#<b>size</b>
 * @type String
 * @default 20
 * @example
 * 无
 */





﻿﻿/*
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
/*
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.FEnterSwitch.js
 * 作者：hanyin
 * 邮箱：hanyin@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FEnterSwitch组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 20130125  hanyin		修复enterSwitch组件无法切换的问题
 */

(function($) {
	$.registerWidgetEvent("");
	// 使回车键即tab键：保证容器内部的有效的input组件，在点击enter键时，按照tabIndex顺序切换到下一个，并保证在容器内部循环
	$.widget("FUI.FEnterSwitch", {
	    options : {
	    },
	    _create : function() {
	    	this.options.id = this.element.attr("id");
	    },
	    _init : function() {
	    	this._bindEvent();
	    },
	    
	    _bindEvent : function() {
	    	var self = this;
	    	self._getAllEls().keyup(function(e) {
	    		if (e.which == 13 || e.which == 108) { // 判断是否是回车键或者小键盘回车键
	    			// TODO 性能有待优化！
	    			// 实时获取所有可见有效的表单元素，允许用户在运行时将某些组件隐藏然后显示出来
	    			var MAX_GAP = 500;
	    			var els = self._getAllVisible().get();
	    			var curIndex = $.inArray(this, els);
	    			var mine = parseInt(this.tabIndex || 0) * MAX_GAP + curIndex;
	    	    	var minGap = 10000000; // 保存最小的差距，初始值很大
	    	    	var minGapIndex = -1; // 最小差距的元素索引，即下一个元素的索引
	    	    	var min = mine; // tabIndex最小的值
	    	    	var minIndex = curIndex; // 拥有tabIndex最小值 的元素的索引
	    	    	for (var i=0; i<els.length; i++) {
	    	    		var other = parseInt(els[i].tabIndex || 0) * MAX_GAP + i;
	    	    		if (other < min) {
	    	    			min = other;
	    	    			minIndex = i;
	    	    		}
	    	    		if (curIndex != i) {
	    	    			var curGap = other - mine;
	    	    			if (curGap == 1) {
	    	    				minGapIndex = i;
	    	    				break;
	    	    			}  else if (curGap > 0 && curGap < minGap) {
	    	    				minGap = curGap;
	    	    				minGapIndex = i;
	    	    			}
	    	    		}
	    	    	}
	    	    	var nextEl = null;
	    	    	if (minGapIndex != -1) { // 存在下一个元素
	    	    		nextEl = els[minGapIndex];
	    	    	} else { // 如果已经是最大的tabIndex，则自动切换到最小的tabIndex
	    	    		nextEl = els[minIndex];
	    	    	}
    				self._focusEl($(nextEl));
	    			return false; // 必须return false，否则会造成回车事件被传递给下一个组件比如textarea
	    		}
	    	});
	    },
	    
	    _focusEl : function(element) {
	    	var el = element;
	    	// 必须使用setTimeout(,0) 否则在使用某些情况下会造成浏览器假死（比如my97datepicker在focus是弹出的情况下）
	    	setTimeout(function() {  
	    		el.focus();
		    	if (el.is("input:text")) {
		    		el.select();
		    	}
	    	},0)
	    },
	    
	    _getAllEls : function() {
	    	// 容器下所有的<input> <select> <button>元素，保证textarea可以被切换到，但是不能通过回车切换到下一个
	    	return $(":input:not('textarea')", this.element);
	    },
	    
	    _getAllVisible : function() {
	    	// 所有可见的不是disabled的input、textarea、select的表单组件
	    	return $(":input:enabled:visible", this.element);
	    },
	    
	    /**
	     * 销毁组件
	     * @name FEnterSwitch#destroy
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
/**
 * @_name FPopupMessage
 * @_class <b>右下角弹出框组件</b><br/>
 * 在页面的右下角弹出消息，通知用户，并且不占用用户的工作空间，可定时关闭，可以手动关闭。
 */

/**@_lends FPopupMessage# */

(function($) {
	$.registerWidgetEvent("");
	$.widget("FUI.FPopupMessage", {
	    options : {
	        /**
	         * 弹出框显示的标题，如果不设置，或者设置为""，标题栏则会被隐藏
	         * @name FPopupMessage#title
	         * @type String
	         * @default ""
	         * @example
	         * 无
	         */
	    	title : "",
	        /**
	         * 弹出框自动关闭的超时时间，单位毫秒，如果没有设置此值，或者该值为0，则窗口不会自动关闭；默认不会自动关闭；如果设置的值小于1000，即1秒钟，则自动设置为1000。
	         * 如果在timeout时间内，鼠标移至弹出框上，则会中断计时，鼠标移出则重新计时。
	         * @name FPopupMessage#timeout
	         * @type String
	         * @default "0"
	         * @example
	         * 无
	         */
	    	timeout: null,
	        /**
	         * 弹出框可否被手动关闭，如果为true，则在窗口的右上角出现一个“关闭按钮”；否则，无法通过点击“关闭按钮”关闭窗口
	         * @name FPopupMessage#closable
	         * @type Boolean
	         * @default true
	         * @example
	         * 无
	         */
	    	closable: null,
	        /**
	         * 弹出框显示在窗口的右下角的位置，与右边框和下边框完全贴合，在某些场景下可以根据需要设置弹出框的偏移值： <br/>
	         * ① left 属性表示相对于原始位置左侧的偏移量，如果为正值，则向右偏移；负值则向左偏移；不设置或者设置为0，则水平位置不变；<br/>
	         * ② top 属性表示相对于原始位置上侧的偏移量，如果为正值，则向下偏移；负值则向上偏移；不设置或者设置为0，则垂直位置不变。 <br/>
	         * 不支持设置bottom、right属性。默认情况下，设置的偏移为 {left:-5, top:-5}，如果想取消偏移，请设置 {left:0, top:0}
	         * <br/>
	         * <span style="color:red">此属性不能通过标签来设置</span>
	         * @type Object
	         * @default {left:-5, top:-5}
	         * @example
	         * 无
	         */
	    	offset: null,
	        /**
	         * 指定要弹出组件的父容器，一般可以设置为document或者window对象（document和window都不能加引号）或者相应的jquery对象$(window)、$(document)；
	         * 如果设置为document或者$(document)，那么弹出框的位置会出现在页面的右下角，显示的位置随着滚动条而变化；如果设置为window或者$(window)，弹出框的位置会固定在
	         * 窗口的右下角，不会随着页面滚动条滚动<br/>
	         * <span style="color:red">暂不对外提供</span>
	         * @type Object/String
	         * @default window
	         * @example
	         * 无
	         */
	    	container : null,

	    	_popupMsgs: null
	    },
	    _create : function() {
	    	this.options.id = this.element.attr("id");
	    },
	    _init : function() {
	    },

		/**
		 * 显示弹出框
		 * @name FPopupMessage#show
		 * @function
		 * @param ops 
		 * <br/>
		 * @example
		 */
	    show : function(opts) {
	    	var self = this;
	    	var selfEl = this.element;
	    	
	    	if (self.options._popupMsgs == null) {
	    		self.options._popupMsgs = $Utils.IndexMap();
	    	}
	    	
	    	// 合并选项
	    	var op = self._processOptions(opts);
	    	// 如果不是一个弹出框组件，则需要重新构造DOM结构
	    	if (!selfEl.hasClass("f-popupMessage")) {
	    		op.id = (opts||{}).id;
	    		// 生成DOM结构，直接追加在当前对象的后部
	    		var html = self._genPopupMessageHTML(op);
	    		selfEl.append(html);
	    		// 将弹出框的Id保存
	    		self.options._popupMsgs.put(op.id, op.id);
	    	} else {
	    		op.id = selfEl.attr("id");
	    	}
	    	op._element = $I(op.id);
	    	if (op._element.size() == 0) {
	    		return;
	    	}
	    	var prevOp = op._element.data("_option");
	    	if (prevOp) {
	    		self._destroyPopup(prevOp.id, prevOp._element);
	    	}
	    	// 将配置项放到缓存中
	    	op._element.data("_option", op);
	    	// 初始化
	    	self._initPopup(op);
	    	// 绑定事件
	    	self._bindEvent(op);
	    	// 显示
	    	op._element.FPopupBox("show", op, function() {
		    	op._show = true;
	    	});
	    },
	    _initPopup : function(op) {
	    	var selfEl = op._element;
	    	selfEl.FPopupBox({}); // 尝试初始化PopupBox，如果已经初始化，则此方法无效
	    	op._show = false;
	    },
	    _bindEvent : function(op) {
	    	var id = op.id;
	    	var self = this;
	    	var selfEl = op._element;

	    	$I(id + "-icon").hover(function() {
	    		$(this).addClass("f-tool-closethick").removeClass("f-tool-close");
	    	}, function() {
    		  	$(this).removeClass("f-tool-closethick").addClass("f-tool-close");
    		}).click(function() {
    			if (op.closable) {
    				self.hide(op);
    			}
    		});

	    	var timeout = parseInt(op.timeout || "");
	    	if (!isNaN(timeout) && timeout > 0) {
		    	op._timeReset = 0;
	    		if (timeout < 1000) {
	    			timeout = 1000;
	    		}
	    		var timeReset = ++op._timeReset;
    			var funcProxy = $.proxy(self, "_tryTimeoutClose", timeReset, op);
	    		setTimeout(funcProxy, timeout);
		    	selfEl.hover(function() {
		    		op._timeReset++;
		    	}, function() {
		    		var timeReset = ++op._timeReset;
	    			var funcProxy = $.proxy(self, "_tryTimeoutClose", timeReset, op);
		    		setTimeout(funcProxy, timeout);
		    	});
	    	}
	    	
	    	op._changed = 0;
	    	$(window).bind("scroll.FPopupMessage-" + id, function() {
	    		if (!op._show) {
	    			return;
	    		}
	    		op._changed ++; // 在指定的时间内变化，延时显示窗口
    			var changeId = op._changed;
    			var scrollFuncProxy = $.proxy(self, "_scrollFunc", changeId, op);
    			setTimeout(scrollFuncProxy, 500);
	    	}).bind("resize.FPopupMessage-" + id, function() {
	    		if (!op._show) {
	    			return;
	    		}
	    		op._changed ++; // 在指定的时间内变化，延时显示窗口
    			var changeId = op._changed;
    			var scrollFuncProxy = $.proxy(self, "_scrollFunc", changeId, op);
    			setTimeout(scrollFuncProxy, 100);
	    	});
	    },

    	_tryTimeoutClose : function(timeReset, op) {
    		if (op._show && op._timeReset === timeReset) {
    			this.hide(op);
    		}
    	},

    	_scrollFunc : function(changeId, op) {
    		if (op._show && changeId == op._changed) {
    			op._element.FPopupBox("show", op);
    		}
    	},
	    
	    _processOptions : function(op) {
	    	var option = $.extend({}, this.options, (op || {}));
	    	option.position = option.position || {left:500000, top:500000};
	    	option.collision = "fit";
	    	option.container = option.container || window;
	    	option.offset = option.offset || {left:-5, top:-5};
	    	option.show = option.show || {
	    		effect : "fadeIn",
	    		duration : "fast"
	    	};
	    	option.hide = option.hide || {
	    		effect : "fadeOut",
	    		duration : "fast"
	    	};
	    	return option;
	    },
	    
	    // 生成弹出框的DOM结构
	    _genPopupMessageHTML : function(op) {
	    	var html = [];
	    	var id = op.id || $Utils.genId("f-popupMessage"); op.id = id;
	    	var title = (op.title || "").toString();
	    	var titleStyle = "";
	    	if (title.length == 0) {
	    		titleStyle = "style='display:none;'";
	    	}
	    	var closableStyle = "";
	    	if (op.closable == false || op.closable == "false") {
	    		closableStyle = "style='display:none;'";
	    		op.closable = false;
	    	} else {
	    		op.closable = true;
	    	}
	    	var content = op.content || "";
	    	
	    	var template ="\
	    	<div id='{0}' class='f-popupMessage f-widget f-corner-all'>\
	    	  <div id='{0}-header' {2} class='f-popupMessage-header'> \
	    	    {1} \
	    	    <span id='{0}-icon' {3} class='f-popupMessage-icon f-tool f-tool-close'>&nbsp;</span> \
	    	  </div> \
	    	  <div id='{0}-body' class='f-popupMessage-body'> \
	    	  	{4}\
	    	  </div> \
	    	</div>";
	    	return $Utils.format(template, id, title, titleStyle, closableStyle, content);
	    },

	    /**
	     * 设置显示区域的内容
	     * @name FPopupMessage#setContent
	     * @function
	     * @example
	     */
	    setContent : function(content) {
	    	if (this.element.hasClass("f-popupMessage")) {
	    		var id = this.options.id;
	    		$I(id + "-body").html(content);
	    	}
	    },

	    /**
	     * 隐藏弹出框
	     * @name FPopupMessage#hide
	     * @function
	     * @example
	     */
	    hide : function(op, opts) {
	    	if (this.element.hasClass("f-popupMessage")) {
	    		var option = this.element.data("_option");
	    		if (option && option._show) {
		    		this.element.FPopupBox("hide", op);
		    		this._destroyPopup(option.id, option._element);
		    		option._show = false;
	    		}
	    	} else {
	    		var size = 0;
	    		var ids = this.options._popupMsgs;
		    	if (this.options._popupMsgs) {
		    		size = ids.size();
		    	}
	    		if ($Utils.isString(op)) { // op=id，opts=hide的参数， 关闭此元素下指定id的弹出框
	    			if (size > 0 && ids.get(op) != null) {
	    				this._hideGenPopup(op, opts, ids);
	    			}
	    		} else if (typeof op == 'object' && op["_element"] != null) { // op为element原始的op，opts为hide的参数
	    			// 关闭指定的弹出框，主要内部使用
    				this._hideGenPopup(op.id, opts, ids);
	    		} else { // op 为hide的参数，opts无效：会关闭此元素下所有的弹出框
	    			if (size != 0) {
	    				for (var i=0; i<size; i++) {
	        				this._hideGenPopup(ids.element(ids.size()-1).key, op, ids);
	    				}
	    			}
	    		}
	    	}
	    },
	    
	    _hideGenPopup : function(id, option, ids) {
	    	var el = $I(id);
	    	var self = this;
	    	var data = el.data("_option");
	    	if (data) {
		    	el.FPopupBox("hide", option, function() {
		    		self._destroyPopup(id, el);
		    		data._show = false;
		    		el.remove(); // 移除DOM结构和事件，这里会调用PopupBox的destroy方法
		    	});
	    		ids.remove(id);
	    	}
	    },
	    
	    _destroyPopup : function(id, el) {
	    	if (!id || !el) {
	    		return;
	    	}
	    	// 移除配置项
	    	var data = el.data("_option");
	    	if (data) {
	    		data._show = false;
		    	el.removeData("_option");
		    	el.unbind();
	    	}
	    	// 解绑关闭按钮的事件
	    	$I(id + "-icon").unbind();
	    	// 解绑window上注册的所有事件
    		$(window).unbind(".FPopupMessage-" + id);
	    },
	    
	    /**
	     * 销毁组件
	     * @name FPopupMessage#destroy
	     * @function
	     * @example
	     */
	    destroy : function() {
		    var op = this.options;
		    if (this.element.hasClass("f-popupMessage")) {
	    		this._destroyPopup(op.id, this.element);
		    } else {
		    	// TODO 移除弹出的还没有被销毁的弹出框
		    	var leftMsgs = op._popupMsgs;
		    	if (leftMsgs) {
		    		var size = leftMsgs.size();
		    		for (var i=0; i<size; i++) {
		    			var id = leftMsgs.element(i).key;
		    			var el = $I(id);
		    			this._destroyPopup(id, el);
			    		// el.remove(); // 上层dom删除的时候，这里会调用PopupBox的destroy方法
		    		}
		    	}
		    }
		    op._popupMsgs.destroy();
		    op._popupMsgs = null;
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    }
	});
})(jQuery);
/*
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Message.js
 * 作者：hanyin
 * 邮箱：hanyin@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FMessage组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 20121231  hanyin		修复Message组件在Ie7下，先打开confirm，再打开alert，会出现图标遮蔽的问题
 */

/**
 * @name FMessage
 * @class 
 * 消息提示，用于提供提示信息的弹出窗口，类似于JavaScript中使用alert()、confirm()、prompt()函数时出现的那种提示信息的弹出窗口。
 */
	
  	/**@lends FMessage# */

(function($) {

	$.registerWidgetEvent("");

	// 绑定jquery对象的fui对象，用于事件绑定和逻辑处理
	$.widget("FUI.FMessage", {
	    options : {
	    	onBntClick : null,
	    	onCloseClick : null
	    },
	    
	    _create : function() {
	    	this.options.id = this.element.attr("id");
	    },
	    
	    _init : function() {
	    	var self = this;
	    	var selfEl = this.element;
	    	if (!$Component.hasFType(selfEl, "FPopupBox")) {
	    		// 如果还没有初始化popuoBox
	    		selfEl.FPopupBox({position:{left:"center", top:"center"}, zIndex:20001});
	    	}
	    	// 绑定事件
	    	self._bindEvent();
	    },
	    
	    destroy : function() {
		    var op = this.options;
		    if (op._dragable) {
		    	op._dragable.stop();
		    	op._dragable.destroy();
			    op._dragable = null;
		    }
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    },
	    
	    _bindEvent : function() {
	    	var op = this.options;
	    	var self = this;
	    	var selfEl = this.element;
	    	// 绑定按钮的事件
	    	self._bindBntsEvent();
	    	// 绑定右上角的关闭按钮事件
	    	self._bindCloseBntEvent();
	    	// 绑定标题事件，移动
	    	self._bindHeaderEvent();
	    },
	    
	    _bindBntsEvent : function() {
	    	var self = this;
	    	var bnts = [self._getOkEl(), self._getYesEl(), self._getNoEl(), self._getCancelEl()];
	    	var bntStrs = ["ok", "yes", "no", "cancel"];
	    	for (var i=0; i<bnts.length; i++) {
	    		var bntStr = bntStrs[i];
	    		var func = $.proxy(self.options, "onBntClick", bntStr);
	    		bnts[i].FSimpleButton({
	    			onClick : func
	    		});
	    	}
	    },
	    
	    _bindCloseBntEvent : function() {
	    	var self = this;
	    	var el = self._getCloseIconEl();
	    	el.hover(function() {
	    		$(this).addClass("f-tool-closethick").removeClass("f-tool-close");
	    	}, function() {
    		  	$(this).removeClass("f-tool-closethick").addClass("f-tool-close");
    		}).mousedown(function(e) {
    			e.stopPropagation(); // 防止因为点击按钮出现 窗口移动的虚框
    		}).click(function() {
    			self.options.onCloseClick();
    		});
	    },
	    
	    _bindHeaderEvent : function() {
	    	var self = this;
	    	var op = this.options;
	    	var selfEl = this.element;
	    	var headerEl = self._getHeaderEl();
	    	op._dragable = new $.Dragable(op.id+"-header", op.id);
	    },
	    
	    _getHeaderEl : function() {
	    	var op = this.options;
	    	var el = op._headerEl;
	    	if (!el) {
		    	var selfEl = this.element;
	    		op._headerEl = el = $I(op.id + "-header");
	    	}
	    	return el;
	    },
	    
	    _getCloseIconEl : function() {
	    	var op = this.options;
	    	var el = op._closeEl;
	    	if (!el) {
	    		op._closeEl = el = $I(op.id + "-closeIcon");
	    	}
	    	return el;
	    },
	    
	    _getOkEl : function() {
	    	var op = this.options;
	    	var el = op._okBntEl;
	    	if (!el) {
	    		el = op._okBntEl = $I(op.id + "-okBnt");
	    	}
	    	return el;
	    },
	    
	    _getCancelEl : function() {
	    	var op = this.options;
	    	var el = op._cancelBntEl;
	    	if (!el) {
	    		el = op._cancelBntEl = $I(op.id + "-cancelBnt");
	    	}
	    	return el;
	    },
	    
	    _getYesEl : function() {
	    	var op = this.options;
	    	var el = op._yesBntEl;
	    	if (!el) {
	    		el = op._yesBntEl = $I(op.id + "-yesBnt");
	    	}
	    	return el;
	    },
	    
	    _getNoEl : function() {
	    	var op = this.options;
	    	var el = op._noBntEl;
	    	if (!el) {
	    		el = op._noBntEl = $I(op.id + "-noBnt");
	    	}
	    	return el;
	    },
	    
	    show : function(op) {
	    	this.element.FPopupBox("show", op);
	    },
	    
	    hide : function(op) {
	    	this.element.FPopupBox("hide", op);
	    }
	});

	$.FMessage =  {
		_status : {
			// 窗口打开的类型: alert(ok), confirm(yes no), prompt(ok cancel),
			// mutilinePrompt(ok cancel), YNC(yes no cancel)
			type : "",
			choise : "",
			text : "" // 如果是prompt或者mutiLinePrompt则返回其中的文本内容
		},
		
		// 如果在没有关闭msg的情况下，再次弹出msg，则将msg的环境缓存，再本次msg关闭之后再弹出
		_cmdQueue : [],
		_isShow : false,
		
		_options : {
		},

		// 按钮标示
		OK :			0x0001,
		OKCANCEL :		0x1001,
		YES :			0x0010,
		NO : 			0x0100,
		YESNO :			0x0110,
		CANCEL :		0x1000,
		YESNOCANCEL:	0x1110,
		
		// 图标标示
		INFO : "f-message-icon-info",
		QUESTION : "f-message-icon-question",
		WARNING : "f-message-icon-warning",
		ERROR : "f-message-icon-error",

	    /**
	     * alert消息框
	     * @name FMessage#alert
	     * @function
	     * @param title 消息的标题
	     * @param msg 消息的内容
	     * @param callback 消息关闭的时候的回调方法
	     * @example
	     * <pre>
	     * $.FMessage.alert("Attention", "Everything is ok!");
	     * </pre>
	     */
		alert : function(title, msg, callback) {
			var self = this;
			self.show({
				title : title,
				msg : msg,
				callback : callback,
				buttons : self.OK,
				width : "250px"
			});
		},

	    /**
	     * confirm消息框
	     * @name FMessage#confirm
	     * @function
	     * @param title 消息的标题
	     * @param msg 消息的内容
	     * @param callback 消息关闭的时候的回调方法
	     * @example
	     * function showResult(btn) {
	     *   alert('You clicked the "' + btn +'" button');
	     * };
	     * $.FMessage.confirm('Confirm', 'Are you sure you want to do that?', showResult);
	     */
		confirm : function(title, msg, callback) {
			var self = this;
			self.show({
				title : title,
				msg : msg,
				callback : callback,
				buttons : self.YESNO,
				icon : self.QUESTION,
				width : "280px"
			});
		},

	    /**
	     * 带一个输入框的消息框
	     * @name FMessage#prompt
	     * @function
	     * @param title 消息的标题
	     * @param msg 消息的内容
	     * @param callback 消息关闭的时候的回调方法
	     * @example
	     * function showResultText(btn, text){
	     *   alert('You clicked the "' + btn +'" button and entered the text "' + text + '"');
	     * };
	     * $.FMessage.prompt('Confirm', 'Are you sure you want to do that?', showResultText);
	     */
		prompt : function(title, msg, callback) {
			var self = this;
			self.show({
				title : title,
				msg : msg,
				callback : callback,
				buttons : self.OKCANCEL,
				prompt : true,
				width : "250px"
			});
		},

		/*
		mutiLinePrompt : function(title, msg, callback) {
			
		},
		*/

	    /**
	     * 弹出指定参数的消息框
	     * @name FMessage#show
	     * @function
	     * @param op 消息框的弹出选项，可以有下列属性：
	     * <ol>
	     * <li><b>title:</b> 消息框标题；</li>
	     * <li><b>msg:</b> 消息的内容，对于prompt，就是输入框的提示信息；</li>
	     * <li><b>callback:</b> 输入框在关闭的时候出发的回调方法，非必须；</li>
	     * <li><b>width:</b> 输入框的宽度，默认情况下自动设置合适的宽度，也可以通过设置此属性修改；</li>
	     * <li><b>icon:</b> msg前的图标，目前只支持 $.FMessage.INFO、$.FMessage.QUESTION、
	     * $.FMessage.ERROR、$.FMessage.WARNING；如果没有设置此属性，则不显示图标；</li>
	     * <li><b>prompt:</b> boolean类型，true则表示显示一个带输入框的消息框，此时icon属性无效；</li>
	     * <li><b>buttons:</b> Message显示的按钮
	     * <pre>
	     * $.FMessage.OK 只显示一个"OK"按钮
	     * $.FMessage.OKCANCEL 显示一个"OK"按钮，一个"Cancel"按钮
	     * $.FMessage.YES 只显示一个"Yes"按钮
	     * $.FMessage.NO 只显示一个"No"按钮
	     * $.FMessage.YESNO 只显示一个"Yes"按钮，一个"No"按钮
	     * $.FMessage.CANCEL 只显示一个"Cancel"按钮
	     * $.FMessage.YESNOCANCEL 显示"Yes"、"No"、"Cancel"按钮
	     * 
	     * 这些按钮可以自由组合，比如 $.FMessage.OK|$.FMessage.CANCEL 效果与 $.FMessage.OKCANCEL一致
	     * </pre>
	     * </li>
	     * <li><b>buttonTexts:</b> 配置按钮对应文字
	     * <pre>
	     *  $.FMessage.show({
	     *    title: 'Icon Support',
	     *    msg: 'Here is a message with an icon!',
	     *    buttons:  $.FMessage.OK | $.FMessage.YESNOCANCEL,
	     *    icon: $.FMessage.QUESTION,
	     *    buttonTexts : {
	     *      yes : "I say yes!",
	     *      no : "No more...",
	     *      cancel : "Bye."
	     *    }
	     *  });
	     * </pre>
	     * </li>
	     *  <li><b>closeIcon</b> 是否显示右上角的关闭按钮，false则不显示按钮，默认显示</li>
	     * </ol>
	     * @example
	     */
		show : function(op) {
			var self = this;
			var msgEl = self._getMessageEl(); // 必须在前面调用
			
			if (self._isShow) {
				self._cmdQueue.push(op);
				return;
			}
			self._isShow = true;
			
			// 修改标题
			var title = op.title || "&nbsp;";
			self._getElement("title").html(title);
			// 重置按钮
			var bntCount = self._resetButtons(op.buttons, op.buttonTexts);
			
			// 调整message的大小
			var width = "345px";
			if (op.width) {
				width = op.width;
			} else {
				if (bntCount == 1) {
					width = "250px";
				} else if (bntCount == 2) {
					width = "280px";
				} else if (bntCount >= 3) {
					width = "345px";
				}
			}
			msgEl.width(width);
			
			// 重置body内容
			self._resetBody(op, width);
			
			// 是否有右上角的关闭按钮
			var iconEl = self._getElement("closeIcon");
			if (op.closeIcon === false) {
				iconEl.css("display", "none");
			} else {
				iconEl.css("display", "block");
			}
			
			// 显示message
			self._showMask();
			msgEl.FMessage("show", {
				show : {
					callback : function() {
						$(document).bind("keydown.FMessage", function(e) {
							if (e.which == 27) {
								self._bntClick("cancel");
							}
						});
					}
				},
				hide : {
					callback : function() {
						self._hideMask();
						$(document).unbind("keydown.FMessage");
						self._status.text = self._getElement("promptInput").val();
						if ($.isFunction(op.callback)) {
							op.callback(self._status.choise, self._status.text);
						}
						self._isShow = false;
						self._processQueue(); // 处理在弹出框过程中弹出来的框
					}
				}
			});
		},
		
		_processQueue : function() {
			var self = this;
			var queue = self._cmdQueue;
			if (queue.length == 0) {
				return;
			}
			self.show(queue.shift());
		},
		
		_showMask : function() {
			$("body").doMask("please choose!", {showImg:false});
		},
		
		_hideMask : function() {
			$("body").doUnMask();
		},
		
		hide : function() {
			var self = this;
			var msgEl = self._getMessageEl(); // 必须在前面调用
			msgEl.FMessage("hide");
		},
		
		_resetBody : function(op, width) {
			width = parseInt(width);
			var self = this;
			var tipIcon = op.icon;
			var msg = op.msg || "&nbsp;";
			var contentEl = self._getElement("content");
			var iconContentEl = self._getElement("iconContent");
			var promptEl = self._getElement("prompt");
			if (op.prompt == true) {
				contentEl.css("display", "none");
				promptEl.css("display", "block");
				iconContentEl.css("display", "none");
				self._getElement("promptMsg").html(msg);
				self._getElement("promptInput").val("");
			} else if (tipIcon) { // 有icon的内容
				var icons = [self.INFO, self.QUESTION, self.WARNING, self.ERROR];
				contentEl.css("display", "none");
				promptEl.css("display", "none");
				iconContentEl.css("display", "block");
				// 设置图标
				var iconEl = self._getElement("tipIcon");
				iconEl.removeClass(icons.join(" "));
				iconEl.addClass(tipIcon);
				// 设置内容
				var content = self._getElement("tipContent");
				// add 20121227 hanyin 修复icon无法隐藏的问题：将table布局改为float
				if (!isNaN(width)) {
					content.width(width-20-50);
				}
				// end add 
				content.html(msg);
			} else {
				contentEl.css("display", "block");
				promptEl.css("display", "none");
				iconContentEl.css("display", "none");
				self._getElement("content").html(msg);
			}
		},
		
		_resetButtons : function(buttons, buttonTexts) {
			var self = this;
			buttons = buttons || 0;
			if (buttons == 0) {
				var el = self._getElement("buttonGroup");
				el.css("display", "none");
				return 0;
			} else {
				buttonTexts = buttonTexts || {};
				self._getElement("buttonGroup").css("display", "block");
				var iconCount = 0;
				$.each(["ok", "yes", "no", "cancel"], function(i, name) {
					var el = self._getElement(name+"Bnt-wrapper");
					if (buttons & self[name.toUpperCase()]) {
						if (buttonTexts[name]) {
							self._getElement(name+"Bnt").text(buttonTexts[name]);
						}
						el.parent().show();
						iconCount ++ ;
					} else {
						el.parent().hide();
					}
				});
				return iconCount;
			}
		},
	    
	    _getElement : function(name) {
	    	var op = this._options;
	    	var el = op["_obj" + name + "El"];
	    	if (el) {
	    		return el;
	    	} else {
	    		el = op["_obj" + name + "El"] = $I(op.id + "-" + name);
	    	}
	    	return el;
	    },

		_bntClick : function(choice) {
			var self = this;
			self._status.choise = choice;
			self.hide();
		},
		
		_getMessageEl : function() {
			var self = this;
			var op = self._options;
			if (op.id) {
				return $I(op.id);
			} else {
				var id = $Utils.genId("f-message");
				var html = self._generateHtml({
					id : id,
					title : ("FMessage" + $Utils.UID)
				});
				$("body").append(html);
				$I(id).FMessage({
			    	onBntClick : function(choise) {
			    		self._bntClick(choise);
			    	},
			    	onCloseClick : function() {
			    		self._bntClick("cancel");
			    	}
				});
				op.id = id;
			}
			return $("#"+id);
		},
		
		_generateHtml : function(op) {
			var self = this;
			var id = op.id || $Utils.genId("f-message"); // 0
			var width = op.width || "350px"; // 1
			var title = op.title || "&nbsp;"; // 2
			var bodyContent = self._genContentHtml(id); // 3
			var buttonGroup = self._genButtonGroup(id); // 4
			
			var template = "\
			<div id='{0}' class='f-message f-popupMessage f-widget f-corner-all' style='width:{1};'> \
			  <div id='{0}-header' class='f-popupMessage-header f-form-unselectable f-message-header' onselectstart='return false;'> \
			  	<span id='{0}-title'>{2}</span> \
			    <span id='{0}-closeIcon' class='f-popupMessage-icon f-tool f-tool-close'>&nbsp;</span> \
			  </div> \
			  <div id='{0}-body' class='f-popupMessage-body'>{3}</div> \
			  {4} \
			</div>";
			return $Utils.format(template, id, width, title, bodyContent, buttonGroup);
		},
		
		_genContentHtml : function(id) {
			var template = "";
			// 生成alert的内容div
			template += " \
				<div id='{0}-content' style='margin-bottom:5px;'>&nbsp;</div> \
			";
			// 生成含有图标内容的div
			template += "\
				<div id='{0}-iconContent'>\
					<div id='{0}-tipIcon' style='width:50px;height:35px;float:left;' class='f-message-icon-question'>&nbsp;</div>\
					<div id='{0}-tipContent' style='float:left'>&nbsp;</div>\
					<div class='f-form-clear'></div>\
				</div>";
			// 生成输入框
			template += " \
				<div id='{0}-prompt'> \
					<div id='{0}-promptMsg' style='margin-bottom:3px;'>&nbsp;</div> \
					<input type='text' class='f-textInput f-textField' id='{0}-promptInput' style='margin-bottom:5px;'> \
				</div>";
			
			// 生成prompt内容的div
			// 生成mutiPrompt内容的div
			return $Utils.format(template, id);
		},
		
		_genButtonGroup : function(id) {
			var self = this;
			return  $.FUI.FButtonGroup.generateHtml({
		    	id : id+"-buttonGroup",
				toolspacing : "2",
				style : "margin-top: 5px;",
				items : [
				    $.FUI.FSimpleButton.generateHtml({
				    	text : "OK",
				    	id : id+"-okBnt",
				    	height : "22px",
				    	style : "margin: 0px 3px"
				    }),
				    $.FUI.FSimpleButton.generateHtml({
				    	text : "Yes",
					    id : id+"-yesBnt",
				    	height : "22px",
				    	style : "margin: 0px 3px"
				    }),
				    $.FUI.FSimpleButton.generateHtml({
				    	text : "No",
					    id : id+"-noBnt",
				    	height : "22px",
				    	style : "margin: 0px 3px"
				    }),
				    $.FUI.FSimpleButton.generateHtml({
				    	text : "Cancel",
					    id : id+"-cancelBnt",
				    	height : "22px",
				    	style : "margin: 0px 3px"
				    })
				 ]
			});
		}
	};
})(jQuery);
/*
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Accordion.js
 * 作者：hanyin
 * 邮箱：hanyin@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FAccordion组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 20121231  hanyin		创建
 * 20130110  hanyin		在大小变化是，设置content的宽度
 */

/**
 * @name FAccordion
 * @class 
 * 可折叠组件，也可被叫做手风琴组件或者抽屉组件，一次只能打开一个抽屉,通常用于主框架页面中的菜单展示。
 */

/**@lends FAccordion# */

(function($) {
	$.registerWidgetEvent("");
	$.widget("FUI.FAccordion", {
	    options : {
	    	/**
	    	 * 标识(仅标签使用)
	    	 * @name FAccordion#<ins>id</ins>
	    	 * @type String
	    	 * @default null
	    	 * @example 
	    	 * 无
	    	 */
	    	id : null,

	    	/**
	    	 * 抽屉布局首次展现时，默认展开的抽屉的索引，可以为整数,也可以为抽屉的id,获取当前处于激活状态的抽屉id可用getActivated()方法。</br>
	    	 * <ul>
	    	 * <li>如果抽屉个数为0，则active=-1，即不打开抽屉</li>
	    	 * <li>如果抽屉个数大于0，且active小于0(当为-1时并且collapsible!==false，则可以收起所有抽屉)，则active=0，</li>
	    	 * <li>如果抽屉个数大于0，且active大于抽屉的个数，则active=抽屉的个数-1</li>
	    	 * </ul>
	    	 * @name FAccordion#<ins>active</ins>
	    	 * @type String,Number
	    	 * @default 0
	    	 * @example
	    	 * 无 
	    	 */
	    	active : 0,

	    	/**
	    	 * 抽屉组件的高度，可取值为'auto'（每个抽屉的高度分别由抽屉的内容决定），这也是默认值；
	    	 * 可以取值为'fit'，表示适应父容器的大小，此时本组件必须是父容器的唯一儿子；也可以取值数字和数字类字符串，此时固定高度。
	    	 * @name FAccordion#<ins>height</ins>
	    	 * @type Number,String
	    	 * @default 'auto'
	    	 * @example
	    	 * 无 
	    	 */
	    	height : "auto",
	    	// 内容的高度
	    	_contentHeight : "auto",

	    	/**
	    	 * 抽屉布局的高度，可取值为'auto'或者"fit"，都表示自动适应父容器的宽度；可以取值数字和数字类字符串，固定宽度。
	    	 * @name FAccordion#<ins>width</ins>
	    	 * @type Number,String
	    	 * @default 'auto'
	    	 * @example 
	    	 */
	    	width : "auto",
	    	
	    	/**
	    	 * 激活一个抽屉时执行的方法
	    	 * @event
	    	 * @name FAccordion#onActive  
	    	 * @param index 被激活的抽屉的索引，从0开始计数。 
	    	 * @example
	    	 */
	    	onActive : null,

	    	/**
	    	 * 激活一个抽屉之前执行的方法。 如果返回布尔值false,那么对应抽屉将不会激活。
	    	 * @event
	    	 * @name FAccordion#onBeforeActive 
	    	 * @param index 被选择的抽屉的索引，从0开始计数。
	    	 * @example
	    	 */
	    	onBeforeActive : null,

	    	/**
	    	 * 收起一个抽屉前执行的方法。 如果返回布尔值false,那么对应抽屉将不会被收起。
	    	 * @event
	    	 * @name FAccordion#onBeforeCollapse  
	    	 * @param index 被收起的抽屉的索引，从0开始计数。 
	    	 * @example
	    	 */
	    	onBeforeCollapse : null,

	    	/**
	    	 * 收起一个抽屉时执行的方法
	    	 * @event
	    	 * @name FAccordion#onCollapse  
	    	 * @param index 被收起的抽屉的索引，从0开始计数。
	    	 * @example
	    	 */
	    	onCollapse : null,
	    	
	    	// 缓存所有headers的jquery对象
	    	_objHeaders : null,
	    	// 当前被激活的Id
	    	_curActiveId : null,
	    	
	    	_showProps : { 
		    	height: "show"
	    	},
	    	_hideProps : {
		    	height: "hide"
	    	}
	    },
	    
	    /**
	     * 销毁组件
	     * @name FAccordion#destroy
	     * @function
	     * @example
	     */
	    destroy : function() {
		    this._destroy();
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    },
	    
	    _destroy : function() {
		    op._objHeaders || op._objHeaders.destory();
		    op._objHeaders = null;
	    },
	    
	    _create : function() {
	    	var self = this;
	    	var op = self.options;
	    	op.id = this.element.attr("id");
	    	op._objHeaders = $Utils.IndexMap();
	    	self._initHeaders();
	    },
	    
	    _initHeaders : function() {
	    	var self = this;
	    	var op = self.options;
	    	var headerMappings = op._objHeaders;
	    	var headers = self.element.children(".f-accordion-header");;
	    	var size = headers.length;
	    	for (var i=0; i<size; i++) {
	    		var el = $(headers.get(i));
	    		if (i == size-1) {
	    			el.addClass("f-accordion-header-last-collapsed");
	    		}
	    		el.click(function() {
	    			self._toggleActivate(headerMappings.indexOf($(this).attr("id")));
	    		});
	    		headerMappings.put(el.attr("id"), el);
	    	}
	    },
	    
	    _init : function() {
	    	var self = this;
	    	var op = self.options;
	    	// 调整大小
	    	self.setSize(op.width, op.height);
	    	// 默认激活第一个
	    	self.activate(op.active);
	    },
	    // n只能是索引
	    _toggleActivate : function(n) {
	    	var self = this;
	    	var op = self.options;
	    	var headers = op._objHeaders;
	    	var size = headers.size();
	    	var id = headers.element(n).key;
	    	if (id == op._curActiveId){ // 已经被激活，则隐藏
	    		if (n >=0 && n < size-1) {
	    			n = n+1;
	    		} else if (n == size-1) { // 已经是最后一个则激活前一个
	    			n = n-1
	    		}
	    	}
	    	self.activate(n);
	    },

	    /**
	     * 激活指定的抽屉。index为整数或者抽屉的id。任何其它数据将会用parseInt及isNaN进行处理。 (注意，如果组件为禁用状态，执行此方法无任何效果)
	     * <ul>
	     * <li>如果抽屉个数为0，则不激活任何抽屉</li>
	     * <li>如果抽屉个数大于0，且index<0，则激活第一个抽屉(索引为0的那个抽屉)</li>
	     * <li>如果抽屉个数大于0，且index>=抽屉的个数，则激活最后一个抽屉</li>
	     * </ul>
	     * @name FAccordion#activate
	     * @function
	     * @param index 要激活的抽屉的索引(从0开始)或者抽屉的id
	     * @example
	     */
	    activate : function(n) {
	    	var self = this;
	    	var op = self.options;
	    	var headers = op._objHeaders;
	    	var size = headers.size();
	    	
	    	var el = self._parseToEl(n, headers);
	    	if (!el || el.length == 0) {
	    		return false;
	    	}
	    	
	    	var id = el.attr("id");
	    	var index = headers.indexOf(id);
	    	var curActiveId = op._curActiveId;
	    	if (id === curActiveId) { // 如果已经处于开启状态，则不重复展开
	    		return false;
	    	}
	    	
	    	// 调用hide回调，如果返回false，则阻止展开
	    	if (op._curActiveId && op.onBeforeCollapse) {
	    		var result = self._tryExcuteFunc(self, op.onBeforeCollapse, [headers.indexOf(op._curActiveId)]);
	    		if (result === false) {
	    			return false;
	    		}
	    	}
	    	
	    	// 调用show回调，如果返回false，则阻止激活
	    	if (op.onBeforeActive) {
	    		var result = self._tryExcuteFunc(self, op.onBeforeActive, [index]);
	    		if (result === false) {
	    			return false;
	    		}
	    	}
	    	
	    	// 隐藏当前被激活的页签
	    	var toHide = self._hideCurActive();
	    	// 显示此时被激活的页签
	    	var toShow = self._showActive(index, id, el);
	    	// 执行动画
//	    	if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
	    		!toHide || toHide.addClass("f-state-hide");
	    		toShow.removeClass("f-state-hide");
//	    	} else {
//		    	self._animate(toHide, toShow);
//	    	}
	    	var lasActiveId = op._curActiveId;
		    op._curActiveId = id;
	    	
	    	!op.onCollapse || self._tryExcuteFunc(self, op.onCollapse, [headers.indexOf(lasActiveId)]);
	    	!op.onActive || self._tryExcuteFunc(self, op.onActive, [index]);
	    },

    	// 之所以不直接使用slideUp和slideDown，是为了避免在动画过程中出现抖动的问题
	    _animate : function(toHide, toShow) {
	    	var op = this.options;
	    	var height = op._contentHeight;
			var adjust = 0;
	    	!toHide || toHide.stop(true,true).animate( op._hideProps, {
				duration: "fast",
				step : function( now, fx ) {
					fx.now = Math.round( now );
				}
			});
			toShow.stop(true,true).animate( op._showProps, {
				duration: "fast",
				step : function( now, fx ) {
					fx.now = Math.round( now );
					if (fx.prop !== "height") {
						adjust += fx.now;
					} else if (toHide && !isNaN(height)) {
						fx.now = Math.round( height - toHide.height() - adjust);
						adjust = 0;
					}
				}
			});
	    },
	    
	    _hideCurActive : function() {
	    	var self = this;
	    	var op = self.options;
	    	var headers = op._objHeaders;
	    	var id = op._curActiveId;
	    	if (!id) {
	    		return null;
	    	}
	    	var el = headers.get(id);
	    	var contentEl = el.next();
	    	if (!el || el.length==0 || !contentEl || contentEl.length==0) {
	    		return null;
	    	}
    		if (headers.indexOf(el.attr("id")) === headers.size()-1) {
    			el.addClass("f-accordion-header-last-collapsed");
    		}
    		el.children(".f-accordion-tool").addClass("f-tool-expand").removeClass("f-tool-collapse");
    		var nextHeader = contentEl.next();
    		nextHeader.removeClass("f-accordion-header-sibling-expanded");
//	    	contentEl.stop(true,true).slideUp("fast");
    		return contentEl;
	    },
	    
	    _showActive : function(n, id, el) {
	    	var self = this;
	    	var op = self.options;
	    	var headers = op._objHeaders;
	    	var contentEl = el.next();
    		if (n == headers.size()-1) {
    			el.removeClass("f-accordion-header-last-collapsed");
    		}
    		el.children(".f-accordion-tool").addClass("f-tool-collapse").removeClass("f-tool-expand");
    		var nextHeader = contentEl.next();
    		nextHeader.addClass("f-accordion-header-sibling-expanded");
//	    	contentEl.stop(true,true).hide().slideDown("fast");
	    	return contentEl;
	    },
	    
	    _parseToEl : function(n, headers) {
	    	if ($Utils.isJQueryObj(n)) { // jquery对象
	    		return n;
	    	}
	    	headers = headers || this.options._objHeaders;
	    	var size = headers.size();
	    	if (!isNaN(n)) { // 索引
	    		if (n < 0) {
	    			n = 0;
	    		} else if (n >= size) {
	    			n = size-1;
	    		}
	    		return headers.element(n).value;
	    	}
	    	if ($Utils.isString(n)) { // id
	    		return this.element.children("#"+n);
	    	}
	    	return null;
	    },
	    
	    /**
	     * 获取当前处于激活状态的抽屉的id,如果抽屉总数为0或者当前没有抽屉处于激活状态，那么返回null。
	     * <br/>可以通过返回的Id获取抽屉的header和content对象。
	     * @name FAccordion#getActivated
	     * @function
	     * @return 当前处于激活状态的抽屉的id
	     * @example
	     * var headerId= $("#accordion1").FAccordion("getActivated"); // 获取当前被激活的抽屉的ID
	     * var headerEl = $("#"+headerId); // 获取header对象
	     * var contentEl = headerEl.next(); // 获取content对象
	     */
	    getActivated : function() {
	    	return this.options._curActiveId;
	    },
	    
	    /**
	     * 获取指定索引抽屉的ID，如果不存在则返回null。<br/>可以通过返回的Id获取抽屉的header和content对象。
	     * @name FAccordion#getActivated
	     * @function
	     * @return 当前处于激活状态的抽屉的id
	     * @example
	     * var headerId= $("#accordion1").FAccordion("getByIndex", 1);
	     * var headerEl = $("#"+headerId); // 获取header对象
	     * var contentEl = headerEl.next(); // 获取content对象
	     */
	    getByIndex : function(n) {
	    	return this.options._objHeaders.element(n).key;
	    },

	    /**
	     * 获取抽屉的总数。
	     * @name FAccordion#getLength
	     * @function
	     * @return Number 抽屉的总数
	     * @example
	     */
	    getLength : function() {
	    	return this.options._objHeaders.size();
	    },

	    /**
	     * 设置指定抽屉的标题，标题内容可以为html文本
	     * @name FAccordion#setTitle
	     * @function
	     * @param index 要改变标题的抽屉的索引（从0开始计数）或者是抽屉的id
	     * @param title 新的标题，内容可以为html
	     * @return 0 Boolean
	     * @example
	     */
	    setTitle : function(n, title) {
	    	var self = this;
	    	var op = self.options;
	    	var el = self._parseToEl(n, op._objHeaders);
	    	if (!el || el.length == 0) {
	    		return false;
	    	}
	    	title = title || " ";
	    	el.children(".f-accordion-header-text").html(title);
	    },

	    /**
	     * 设置组件的大小
	     * @name FAccordion#setSize
	     * @function
	     * @param w 组件的宽度，支持Number/String，比如 500或者"500px"，不能传入其他的无效值
	     * @param h 组件的高度，支持Number/String，比如 500或者"500px"，不能传入其他的无效值
	     * @example
	     */
	    setSize : function(w, h) {
	    	var self = this;
	    	var op = self.options;
	    	var selfEl = this.element;
	    	
	    	if (w) { // 设置宽度
	    		w = parseInt(w);
	    		if (!isNaN(w)) {
	    			w = w-2;  // 边框2像素
	    			if (w < 0) {w=0;}
	    		} else {
	    			w = selfEl.parent().width() -2; // 自适应父亲的高度
	    			if (w < 0) {w=0;}
	    		}
	    		if (op.width !== w) {
	    			selfEl.width(w);
	    			self._adjustWidth(w);
	    		}
    			op.width = w;
	    	}
	    	if (h) { // 设置高度
	    		var rh = parseInt(h);
	    		if (!isNaN(rh)) {
	    			rh = rh-2; // 边框2像素
	    			if (rh < 0) {rh=0;}
	    		} else if (h === "fit") {
	    			rh = selfEl.parent().height() -2; // 自适应父亲的高度
	    			if (rh < 0) {rh=0;}
	    		} else {
	    			rh = "auto";
	    		}
	    		if (op.height !== rh) {
		    		selfEl.height(rh);
		    		// add 20130110 hanyin 在大小变化是，设置content的宽度
		    		self._adjustHeight(rh); // 调整内部content的高度
		    		// end add 20130110 hanyin 
	    		}
	    		op.height = h;
	    	}
	    },
	    
	    _adjustWidth : function(w) {
	    	var self = this;
	    	var op = self.options;
	    	var headers = op._objHeaders.elements;
	    	var size = headers.length;
	    	
	    	var contentWidth = "auto";
	    	if (!isNaN(w)) {
	    		contentWidth = w - 2; // 每个header的高度为28px
	    		if (contentWidth < 0) {contentHeight=0;}
	    	}
	    	for (var i=0; i<size; i++) {
	    		var el = headers[i].value;
	    		var contentEl = el.next();
	    		contentEl.width(contentWidth);
	    	}
	    	
	    	op._contentWidth = contentWidth;
	    },
	    
	    _adjustHeight : function(h) {
	    	var self = this;
	    	var op = self.options;
	    	var headers = op._objHeaders.elements;
	    	var size = headers.length;
	    	
	    	var contentHeight = "auto";
	    	if (!isNaN(h)) {
	    		contentHeight = h - size*28; // 每个header的高度为28px
	    		if (contentHeight < 0) {contentHeight=0;}
	    	}
	    	for (var i=0; i<size; i++) {
	    		var el = headers[i].value;
	    		var contentEl = el.next();
	    		contentEl.height(contentHeight);
	    	}
	    	
	    	op._contentHeight = contentHeight;
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
	    }
	});
})(jQuery);

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

/**
 * @name FToolbar
 * @class <b>小工具布局容器</b><br/>
 * 工具栏组件，一般作为菜单、按钮、LabelField等组件的容器，只能位于Panel或者FormPanel等容器内组件中。
 */

/**@lends FToolbar# */
/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Tree.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FTree组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 2013-01-08    qudc      修改baseParams属性的API描述，便于用户使用
 * 2013-01-08    qudc      修改rootNode属性，在该属性中新增一个expanded属性，用于设置根节点是否自动展现第一层树节点。
 * 2013-01-17    qudc      当rootVisible为false时，需要将rootNode中的id放到参数中。解决当rootVisible属性为false的时候，发送的请求中不传递参数_rootId。
 * 2013-01-18    qudc      修改setSize方法，如果参数为auto 则不计算高宽。
 * 2013-01-30    qudc      修复bug4570 ，新增tree的节点支持leaf为0,1，原先只支持“true”true“false”false
 * 20130415      hanyin    需求5579 ，在点击文本的时候也展开节点
 */

/**
 * @name FTree
 * @class 
 * 树组件，以树形结构展现数据，树节点可以自定义设置图标，且能够获取选中节点的数据，支持多选。
 *
 */

/**@lends FTree# */


/**
 * 组件的唯一标识。
 * @name FTree#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 组件的唯一标识。
 * @name FTree#<b>title</b>
 * @type String
 * @default ""
 * @example
 * 无
 */


;
var FTree = {
    index:0,
    idGenerate : function() {
        return 'node' + (FTree.index++);
    }
};
(function($, undefined) {
    $.widget('FUI.FTree', {
        options:{
            /**
             * 获取节点数据的请求地址。默认值为：""。
             * @name FTree#dataUrl
             * @type String
             * @default ""
             * @example
             * 无
             */
            dataUrl :"",
            /**
             * 设置组件的选择模式，默认值为：“normal”，即默认选择模式。可以设置其它值，例如：“selectParent”、"selectChildren"。"selectParent"模式表示选择某个节点，会将其父节点选中。"selectChildren"模式表示选择某个节点，会将其已经渲染好的子节点选中。
             * @name FTree#selectModel
             * @type String
             * @default "normal"
             * @example
             * 无
             */
            selectModel :"normal",
            /**
             * 设置根节点是否可见。默认值为true，根节点可见。
             * @name FTree#rootVisible
             * @type Boolean
             * @default true
             * @example
             * 无
             */
            rootVisible:true,
            /**
             * 当rootVisible属性为true时，需要一个虚拟根节点。例如：{'id':'r','text':'根节点',expanded:true,'iconCls':'iconCls'}。说明：expanded属性用于设置根节点是否自动展开第一层树节点。
             * @name FTree#rootNode
             * @type Object
             * @default
             * @example
             * 无
             */
            rootNode:null,

            /**
             * 设置组件的初始化参数，默认为{}。用户可以通过如下方式设置组件初始化参数值：{'code'：'600570','key':'hs'} ,如果使用JSP/freemarker标签，并在标签中直接写入具体的值，那么参数中必须使用单引号。
             * @name FTree#baseParams
             * @type Object
             * @default   {}
             * @example
             * &lt;f:grid baseParams="{'code'：'600570','key':'hs'}"&gt;&lt;/f:grid&gt; <br/>
             * 或者<br/>
             * var bs =  {'code'：'600570','key':'hs'};
             * &lt;f:grid baseParams="bs"&gt;&lt;/f:grid&gt;
             *
             */
            baseParams :{} ,
            /**
             * 是否一次性加载树节点数据，默认值为“false”，即每次只请求子节点数据。
             * @name FTree#syncLoad
             * @type Boolean
             * @default false
             * @example
             * 无
             */
            syncLoad : false,
            /**
             * 组件的宽度 ,当组件的宽度需要自适应父容器时，可以设置成auto。
             * @name FTree#<b>width</b>
             * @type String
             * @default "250"
             * @example
             * 无
             */
            width:250,
            /**
             * 组件的高度，可以设置成具体的数值或者auto，如果设置成auto，那么具体高度由组件的内容来决定。
             * @name FTree#<b>height</b>
             * @type String
             * @default "350"
             * @example
             * 无
             */
            height:350

        },

        _create : function() {
            //保存组件的body区域的jQuery对象
            this.id = this.element.attr('id');
            this.headEl = $I(this.id + '-head');
            this.bodyEl = $I(this.id + '-body');
            this.bodyEl.closeSelect();

            //保存当前树中，渲染的所有节点的数据对象，key值为节点的随机唯一id。
            this.dataStore = [];
            this.selectedNodes = [];

            this.nodeSelectedCls = "f-tree-button f-tree-checkmark f-tree-checkbox-selected";
            this.nodeUnSelectedCls = "f-tree-button f-tree-checkmark f-tree-checkbox-unselected";
            this.nodeSelectedPartCls = "f-tree-button f-tree-checkmark f-tree-checkbox-selected-part";
            this.nodeUnSelectedPartCls = "f-tree-button f-tree-checkmark f-tree-checkbox-unselected-part";

            this.nodeElbowFlatTopCls = "f-tree-button f-tree-elbow f-tree-elbow-flat-top";
            this.nodeElbowFlatMiddleCls = "f-tree-button f-tree-elbow f-tree-elbow-flat-middle";
            this.nodeElbowFlatBottomCls = "f-tree-button f-tree-elbow f-tree-elbow-flat-bottom";

            this.nodeElbowPlusTopCloseCls = "f-tree-button f-tree-elbow f-tree-elbow-plus-top-close";
            this.nodeElbowPlusMiddleCloseCls = "f-tree-button f-tree-elbow f-tree-elbow-plus-middle-close";
            this.nodeElbowPlusBottomCloseCls = "f-tree-button f-tree-elbow f-tree-elbow-plus-bottom-close"


            //重新计算组件的高宽
            var options = this.options;
            var width = options.width;
            var height = options.height;
            this.setSize(width, height);
            this._bindEvent();
        },
        //
        _init: function() {
            //渲染节点
            this._initRenderNode();
        },
        /**
         * 设置树的静态数据
         * @function
         * @name FTree#setStaticData
         * @param data  类型：Object[] 树形数据的静态数据
         * @return
         * @example
         *
         */
        setStaticData : function(data) {
            //保存当前树中，渲染的所有节点的数据对象，key值为节点的随机唯一id。
            this.dataStore = [];
            this.selectedNodes = [];
            
            this.options.staticData = data;
            //渲染节点
            this._initRenderNode();
        },
        //渲染树节点
        _initRenderNode : function() {
            var options = this.options;
            //展现根节点
            if (options.rootVisible) {
                this._renderVirtualRoot();
            } else {
                this._renderFirstLevelNode();
            }
        },
        //对象销毁功能
        destroy:function() {
            this.headEl = null;
            this.titleEl = null;
            this.dataStore = null;
            this.selectedNodes = null;
            this.bodyEl.unbind();
            this.bodyEl.html('');
            this.bodyEl = null;
            $.Widget.prototype.destroy.call(this);
        },
        _bindEvent:function() {
            //绑定组件body区域的点击事件，鼠标click点击事件。
            var ME = this,UTILS = window['$Utils'];
            this.bodyEl.bind({
                'dblclick':function(e) {
                    var target = e.target;
                    var nodeName = target.nodeName.toLowerCase();
                    var cls = target.className;
                    //如果双击的地方是文件夹，或者是文本区域，则触发双击事件。
                    if ('span' == nodeName && (cls.indexOf('f-tree-folder') !== -1 || cls.indexOf('node-text') !== -1) || 'a' == nodeName) {
                        var liEl = $(target).parents("li");
                        var nodeId = liEl.attr('f_value');
                        var nodeType = liEl.attr('f_value_type');
                        if (nodeId) {
                            nodeId = ('number' == nodeType ) ? parseInt(nodeId) : nodeId;
                        }
                        var nodeData = ME._getNodeDataByDom(target);
                        var onNodeDblClick = ME.options['onNodeDblClick'];
                        /**
                         * 树节点被双击时触发
                         * @event
                         * @name FTree#onNodeDblClick
                         * @param nodeData  类型：Object 。双击的树节点对应的树节点对象。
                         * @example
                         *
                         */
                        onNodeDblClick && onNodeDblClick(nodeData);
                    }
                },
                'click': function(e) {
                    var target = e.target;
                    var nodeName = target.nodeName.toLowerCase(),cls = target.className;
                    var onNodeClick = ME.options['onNodeClick'];
                    if (cls.indexOf('f-tree-elbow-plus') !== -1) {
                    	ME._nodeClickHandler(target);
                    } else if (cls.indexOf('f-tree-checkmark') !== -1) {
                        var nodeData = ME._getNodeDataByDom(target);
                        //树节点前方复选按钮，单击选中或者取消选中，触发选择事件
                        var checked = nodeData.checked;
                        if (checked) {
                            //已经选中，取消节点选中并设置树节点选中状态。
                            ME._unSelectNode(nodeData);
                        } else {
                            //未选中，选中树节点并设置树节点数据的状态
                            ME._selectNode(nodeData);
                        }
                    } else if (cls.indexOf('f-tree-folder') !== -1 || cls.indexOf('node-text') !== -1 || 'a' == nodeName) {
                    	// begin 20130415 hanyin 需求5579 ，在点击文本的时候也展开节点
                    	ME._nodeClickHandler(target);
                    	// end 20130415 hanyin 需求5579
                      //树节点的文件夹按钮或树节点的文本区域被点击时，选中文本区域并触发点击事件
                      var nodeData = ME._getNodeDataByDom(target);
                      var aId = nodeData.aId;
                      ME._saveSelectedNodes(nodeData);
                      ME._selectText(aId, nodeData);
                    }
                }
            });
        },
        
        _nodeClickHandler : function(target) {
            var ME = this,UTILS = window['$Utils'];
            //树节点前方的收缩折叠按钮，单击展开或者收缩树节点，触发加载数据
            var nodeData = ME._getNodeDataByDom(target);
            if (nodeData.leaf == true || nodeData.leaf == "true") {
            	return;
            }
            var liEl = $(target).parents("li");
            var nodeStatus = liEl.attr('f_status');
            var ulId = nodeData.ulId;
            if (ulId) {
                //已经生成子节点了
                if ('close' == nodeStatus) {
                    //展开树节点
                    ME._expandNode(nodeData);

                } else if ('open' == nodeStatus) {
                    //隐藏树节点
                    ME._collapseNode(nodeData);
                }
            } else {
                if (ME.options.syncLoad) {
                    //同步加载
                    if (ME.hasLoaded) {
                        var children = nodeData.children;
                        if (children && children.length) {
                            //存在子节点
                            ME._changeIcons(nodeData, '-close', '-open');
                            ME._renderNode(nodeData, children);
                        } else {
                            //不存在子节点
                            //改变节点
                            ME._clearPlusIcons(nodeData);
                        }
                    } else {
                        //首次加载数据
                        ME._loadNode(nodeData);
                    }
                } else {
                    //异步加载
                    ME._loadNode(nodeData);
                }
            }
        },
        
        _selectText : function(aId, nodeData) {
            var options = this.options;
            var onNodeClick = options.onNodeClick;
            this._changeTextCls(aId);
            //触发节点click事件
            /**
             * 树节点的text区域被点击的时候触发
             * @event
             * @name FTree#onNodeClick
             * @param nodeData  类型：Object 。单击的树节点数据对象，该事件在单击树节点文本区域或者树节点图标区域时触发。
             * @example
             *
             */
            onNodeClick && onNodeClick(nodeData);
        },
        _saveSelectedNodes : function(nodeData) {
            var options = this.options;
            if ('normal' == options.selectModel) {
                this.selectedNodes = null;
                this.selectedNodes = {};
                this.selectedNodes[nodeData.id] = nodeData;
            }
        },
        //复选模式下，选中节点，触发select事件
        _selectNode: function(nodeData) {
            var options = this.options;
            var onNodeSelect = options.onNodeSelect;
            var checkboxId = nodeData.checkboxId;
            if (!checkboxId) {
                return;
            }
            nodeData.checked = true;

            this.selectedNodes[nodeData.id] = nodeData;
            var UTILS = window['$Utils'];
            var checkboxEl = $I(checkboxId);
            var checkboxDom = checkboxEl.get(0);
            //改变样式
            checkboxDom.className = this.nodeSelectedCls;

            /**
             * 树节点选中时触发，在selectChildren模式和selectParent模式下有效。
             * @event
             * @name FTree#onNodeSelect
             * @param nodeData  类型：Object 。选中的当前节点的节点数据对象。
             * @example
             *
             */
            onNodeSelect && onNodeSelect(nodeData);
            // 根据selectModel属性值，重新调整父子节点的选中关系
            this._adjustNodeSelectStatus(nodeData);
        },
        //复选模式下，取消选中节点，触发unselect事件
        _unSelectNode : function(nodeData) {
            var options = this.options;
            var onNodeUnSelect = options.onNodeUnSelect;
            var checkboxId = nodeData.checkboxId;
            if (!checkboxId) {
                return;
            }
            nodeData.checked = false;
            delete  this.selectedNodes[nodeData.id];
            var UTILS = window['$Utils'];
            var checkboxEl = $I(checkboxId);
            var checkboxDom = checkboxEl.get(0);
            //改变样式
            checkboxDom.className = this.nodeUnSelectedCls;
            /**
             * 树节点取消选中时触发，在selectChildren模式和selectParent模式下有效。
             * @event
             * @name FTree#onNodeUnSelect
             * @param nodeData  类型：Object 。所取消选中的树节点的数据对象。
             * @example
             */
            onNodeUnSelect && onNodeUnSelect(nodeData);
            // 根据selectModel属性值，重新调整父子节点的选中关系
            this._adjustNodeSelectStatus(nodeData);
        },
        // 用户点击树节点的时候,根据当前节点选中状态以及selectModel模式调整父子节点的选中状态
        _adjustNodeSelectStatus: function(nodeData) {
            // 修改父节点的样式。
            this._adjustParentNode(nodeData);
            // 选中其下的所有自己节点。
            this._adjustChildrenNode(nodeData);
        },

        _adjustParentNode : function(nodeData) {
            var selectModel = this.options.selectModel;
            //根据nodeData中的pid，查找该节点的父节点对象。
            var pid = nodeData.pid;
            if (pid) {
                var parentNode = this.dataStore[pid];
                if (!parentNode) {
                    return;
                }
                var checkboxId = parentNode.checkboxId;
                var checkboxEl = $I(checkboxId);
                var checkboxDom = checkboxEl.get(0);
                //如果父节点选中，则需要判断父节点的子节点是否全部选中
                if ('selectChildren' == selectModel) {
                    var children = parentNode.children;
                    if (!children || !$.isArray(children)) {
                        return;
                    }
                    var length = children.length;
                    var isAllChecked = true;
                    var isAllNoChecked = true;
                    for (var i = 0; i < length; i++) {
                        var node = children[i];
                        if (!node.checked) {
                            isAllChecked = false;
                        } else {
                            isAllNoChecked = false;
                        }
                    }
                    if (parentNode.checked) {
                        if (isAllChecked) {
                            // 改变样式 ,正常选中图标
                            checkboxDom.className = this.nodeSelectedCls;
                        } else {
                            checkboxDom.className = this.nodeSelectedPartCls;
                        }
                    } else {
                        if (isAllNoChecked) {
                            checkboxDom.className = this.nodeUnSelectedCls;
                        } else {
                            checkboxDom.className = this.nodeUnSelectedPartCls;
                        }
                    }
                } else if ('selectParent' == selectModel) {
                    var pChildren = parentNode.children;
                    var length = pChildren.length;
                    var isAllChecked = true;
                    var isAllNoChecked = true;
                    for (var i = 0; i < length; i++) {
                        var node = pChildren[i];
                        if (!node.checked) {
                            isAllChecked = false;
                        } else {
                            isAllNoChecked = false;
                        }
                    }
                    if (nodeData.checked) {
                        //判断parentNode的子节点是否全部选中。如果相邻子节点全部选中，则全部选中。如果不是全部选中，则半选中。
                        if (isAllChecked) {
                            parentNode.checked = true;
                            checkboxDom.className = this.nodeSelectedCls;
                        } else {
                            parentNode.checked = true;
                            checkboxDom.className = this.nodeSelectedPartCls;
                        }
                        this.selectedNodes[parentNode.id] = parentNode;
                    } else {
                        //判断parentNode的子节点是否有选中的，如果有选中，则半选中，否则，不选中。
                        if (isAllNoChecked) {
                            parentNode.checked = false;
                            delete this.selectedNodes[parentNode.id];
                            checkboxDom.className = this.nodeUnSelectedCls;
                        } else {
                            parentNode.checked = true;
                            this.selectedNodes[parentNode.id] = parentNode;
                            checkboxDom.className = this.nodeSelectedPartCls;
                        }
                    }
                }
                parentNode.pid && this._adjustParentNode(parentNode);
            }
        },

        _adjustChildrenNode: function(nodeData) {
            //根据nodeData中的children属性保存的叶子节点。
            var children = nodeData.children;
            if (!children || !$.isArray(children)) {
                return;
            }
            var selectModel = this.options.selectModel;
            if ('selectChildren' == selectModel) {
                //选中其下所有子节点
                var length = children.length;
                for (var i = 0; i < length; i++) {
                    var node = children[i];
                    var checkboxId = node.checkboxId;
                    if (checkboxId) {
                        var checkboxEl = $I(checkboxId);
                        var checkboxDom = checkboxEl.get(0);
                        if (nodeData.checked) {
                            node.checked = true;
                            this.selectedNodes[node.id] = node;
                            checkboxDom.className = this.nodeSelectedCls;
                        } else {
                            node.checked = false;
                            delete this.selectedNodes[node.id];
                            checkboxDom.className = this.nodeUnSelectedCls;
                        }
                        node.children && this._adjustChildrenNode(node);
                    }
                }
            }
        },

        //改变文本的背景样式
        _changeTextCls : function(aId) {
            var UTILS = window['$Utils'];
            if (!aId) {
                return;
            }
            if (this.selectedNodeId) {
                var selectedADom = $I(this.selectedNodeId).get(0);
                UTILS.removeClass(selectedADom, 'selected-node');
            }
            this.selectedNodeId = aId;
            var aEl = $I(aId);
            var aDom = aEl.get(0);
            UTILS.addClass(aDom, 'selected-node');
        },
        _expandNode : function(parentNode) {
            var liId = parentNode.liId;
            var ulId = parentNode.ulId;
            var leaf = parentNode.leaf;

            if (!ulId || leaf === "true" || leaf === true || leaf === 1) {
                return;
            }
            var liEl = $I(liId);
            var ulEl = $I(ulId);
            liEl.attr('f_status', 'open');
            if (ulEl.length) {
                this._changeIcons(parentNode, '-close', '-open');
                var ulDom = ulEl.get(0);
                ulDom.style.display = 'block';
            }
            //触发展开事件
            var onExpandNode = this.options.onExpandNode;
            onExpandNode && onExpandNode(parentNode);
        },
        _collapseNode : function(parentNode) {
            var liId = parentNode.liId;
            var ulId = parentNode.ulId;
            var leaf = parentNode.leaf;
            if (!ulId || leaf === "true" || leaf === true || leaf === 1) {
                return;
            }
            var liEl = $I(liId);
            var ulEl = $I(ulId);
            liEl.attr('f_status', 'close');
            if (ulEl.length) {
                this._changeIcons(parentNode, '-open', '-close');
                var ulDom = ulEl.get(0);
                ulDom.style.display = 'none';
            }
            // 触发折叠事件
            var onClappseNode = this.options.onClappseNode;
            onClappseNode && onClappseNode(parentNode);
        },
    /**
     * 展开所有树节点 expandAll
     */
//        expandAll : function() {
//            var store = this.dataStore;
//            for (var p in store) {
//                var nodeData = store[p];
//                if (nodeData.level === 1) {
//                    //同步请求的方式，全部展开树节点
//                    this.expandNode(nodeData);
//                    var children = nodeData.children;
//                    if (children && children.length) {
//                        var len = children.length;
//                        for (var i = 0; i < len; i++) {
//                            var child = children[i];
//                            this.expandNode(child);
//                        }
//                    }
//                }
//            }
//        },
        /**
         * 展开指定树节点
         * @function
         * @name FTree#expandNode
         * @param nodeData 类型：节点数据对象
         * @example
         *
         */
        expandNode : function(nodeData) {
            //如果是叶子节点，则不执行。
            if (!nodeData || nodeData.leaf === "true" || nodeData.leaf === true || nodeData.leaf === 1) {
                return;
            }
            var ulId = nodeData.ulId;
            if (ulId) {
                //如果有ulId，则该树节点的子节点已经展开过 ,直接调用_expandNode方法展开树节点。
                this._expandNode(nodeData);
            } else {
                //如果没有ulId，则说明该节点没有渲染过，或者没有子节点。所以通过判断其前面的plus图标，如果是“+”那么模拟鼠标点击的事件，进行渲染树节点。
                var elbowId = nodeData.elbowId;
                var elbowEl = $I(elbowId);
                var elbowDom = elbowEl.get(0);
                var cls = elbowDom.className;
                if (cls.indexOf("-plus-middle-close") !== -1 || cls.indexOf("-plus-top-close") !== -1 || cls.indexOf("-plus-bottom-close") !== -1 || cls.indexOf("-plus-root-close") !== -1) {
                    //前面的折叠图标为“+”，则模拟鼠标点击事件，展开树节点。
                    if (this.options.syncLoad) {
                        //同步加载
                        if (this.hasLoaded) {
                            var children = nodeData.children;
                            if (children && children.length) {
                                //存在子节点
                                this._changeIcons(nodeData, '-close', '-open');
                                this._renderNode(nodeData, children);
                            } else {
                                //不存在子节点
                                //改变节点
                                this._clearPlusIcons(nodeData);
                            }
                        } else {
                            //加载数据
                            this._loadNode(nodeData);
                        }
                    } else {
                        //异步加载
                        this._loadNode(nodeData);
                    }
                }
            }

        },
        /**
         * 收缩指定树节点
         * @function
         * @name FTree#collapseNode
         * @param nodeData 类型：节点数据对象
         * @example
         *
         */
        collapseNode : function(nodeData) {
            //调用_collapseNode方法，进行节点收缩
            this._collapseNode(nodeData);
        },
        /**
         * 判断树节点是否展开
         * @function
         * @name FTree#isExpanded
         * @param nodeData 类型：节点数据对象
         * @example
         *
         */
        isExpanded : function(nodeData) {
            var elbowId = nodeData.elbowId;
            var elbowEl = $I(elbowId);
            var elbowDom = elbowEl.get(0);
            var cls = elbowDom.className;
            if (cls.indexOf("-plus-middle-close") !== -1 || cls.indexOf("-plus-top-close") !== -1 || cls.indexOf("-plus-bottom-close") !== -1 || cls.indexOf("-plus-root-close") !== -1) {
                //满足条件的为折叠状态的节点，返回false；
                return false;
            }
            return true;
        },
        /**
         * 根据树节点的id查找树节点对象
         * @function
         * @name FTree#getNodeDataById
         * @param id 类型：'String' 树节点id
         * @return Object node节点的数据对象
         * @example
         *
         */
        getNodeDataById : function(nodeId) {
            return this.dataStore[nodeId] || null;
        },
        //从dom对象中获取节点对象的数据。
        _getNodeDataByDom : function(target) {
            if (!target) {
                return;
            }
            var liEl = $(target).parents("li");
            var nodeId = liEl.attr("f_value");
            var type = liEl.attr("f_value_type");
            if (nodeId && type) {
                nodeId = (type === "number") ? parseInt(nodeId) : nodeId;
            }
            return this.dataStore[nodeId] || null;
        },
        //刷新某节点

        /**
         * 重新加载节点或者是整棵树，请求的url和参数不变。
         * @function
         * @name FTree#loadNode
         * @param nodeData  类型：Object 树节点对象，如果属性rootVisible值为false，可以通过不传递nodeData参数来刷新整棵树。
         * @param params  类型：Object 额外的请求参数
         * @example
         *
         */
        loadNode : function(nodeData, params) {
            if (nodeData) {
                var ulId = nodeData.ulId;
                if (ulId) {
                    //已经渲染过子节点，先清空其dom结构，然后再发送请求加载树节点。
                    var ulEl = $I(ulId);
                    ulEl.remove();
                }
                //重置保存的数据，例如dataStore ，selectedNodes 。
                var children = nodeData.children;
                if (children) {
                    var length = children.length;
                    for (var i = 0; i < length; i++) {
                        var id = children[i].id;
                        delete this.dataStore[id];
                        delete this.selectedNodes[id];
                    }
                }
            } else {
                this.bodyEl.html('');
            }
            this._loadNode(nodeData, params);
        },
        //加载数据节点
        _loadNode : function(parentNode, parameters) {
            //需要传递的参数： _rootId  。对于动态的参数，用户可以在onBeforeLoad事件中添加。
            //Ajax 请求数据 ，回调函数中生成对应的树节点。
            if (this.isLoading) {
                return;
            }
            this.isLoading = true;
            var options = this.options,UTILS = window['$Utils'],ME = this;
            //var onBeforeLoad = options.onBeforeLoad;
            var onLoadsuccess = options.onLoadsuccess;
            var onLoadfailure = options.onLoadfailure;
            var onLoadError = options.onLoadError;
            //用户的处理函数，可以设置baseParams属性
            //onBeforeLoad && onBeforeLoad(parentNode);

            var params = $.extend({}, options.baseParams||{}, parameters||{});
            if (parentNode) {
                params['_rootId'] = parentNode.id;
            } else {
                //2013-1-17  start  add by  qudc  当rootVisible为false时，需要将rootNode中的id放到参数中。
                options.rootNode && (params['_rootId'] = options.rootNode.id);
                //2013-1-17  end  add by  qudc
            }
            // params = UTILS.apply(params, options.baseParams);
            params['_respType'] = 'tree';

            //已经准备好参数，
            $.FUI.FAjax.getList({
                url:UTILS.transUrl(options.dataUrl),
                data:params,
                cache:false,
                success:function(data, textStatus, jqXHR) {
                    //请求正常，returnCode ==0 时触发
                    if (data.length) {
                        ME._changeIcons(parentNode, '-close', '-open');
                        ME._renderNode(parentNode, data);
                    } else {
                        //如果没有数据，即该节点下没有子节点，则修改前缀的图标。
                        ME._clearPlusIcons(parentNode);
                    }
                    /**
                     * 请求成功时触发
                     * @event
                     * @name FTree#onLoadsuccess
                     * @param data  请求返回的数据。类型为“tree”。
                     * @param textStatus  请求状态。
                     * @param jqXHR  XMLHTTPReques对象。
                     * @example
                     *
                     */
                    onLoadsuccess && onLoadsuccess(data, textStatus, jqXHR);

                    ME.isLoading = false;
                    if (options.syncLoad) {
                        ME.hasLoaded = true;
                    }
                },
                failure:function(data, textStatus, jqXHR) {
                    //请求正常，returnCode !=0时触发

                    /**
                     * 请求成功但returnCode为1或者-1时触发。
                     * @event
                     * @name FTree#onLoadfailure
                     * @param data  请求返回的数据,类型为“tree”。
                     * @param textStatus  请求状态。
                     * @param jqXHR  XMLHTTPReques对象。
                     * @example
                     */
                    onLoadfailure && onLoadfailure(data, textStatus, jqXHR);
                    ME.isLoading = false;

                },
                error : function(XMLHttpRequest, textStatus, errorThrown) {
                    /**
                     * 请求失败时触发。例如：ajax超时，网络中断。
                     * @event
                     * @name FTree#onLoadError
                     * @param XMLHTTPReques  XMLHTTPReques对象。
                     * @param textStatus  请求状态，通常 textStatus 和 errorThrown 之中。
                     * @param errorThrown  错误信息，通常 textStatus 和 errorThrown 之中。
                     * @example
                     *
                     */
                    onLoadError && onLoadError(XMLHttpRequest, textStatus, errorThrown);
                    ME.isLoading = false;
                }
            });
        },


        load:function(params, url) {
            //如果展现根节点，那么不重新发送请求，用户可以重新设置根节点的idtext属性。

            //如果不展现根节点，那么直接发送请求，获取对应的数据，并渲染每个节点。

        },
        //渲染父节点下的子节点。
        _renderNode :function(parentNode, childrenNodes) {
            //如果childrenNodes为空，或者内容为空（即length为0）
            if (!childrenNodes || childrenNodes.length == 0) {
                return;
            }
            var length = childrenNodes.length,
                    options = this.options ,
                    selectModel = options.selectModel,
                    html = [],
                    idGenerate = FTree.idGenerate,
                    isFirstLevel = false;
            if (parentNode) {
                parentNode.children = childrenNodes;

                parentNode.ulId = idGenerate();
                if (parentNode.isLast === true) {
                    html.push('<ul id="' + parentNode.ulId + '">');
                } else {
                    html.push('<ul id="' + parentNode.ulId + '" class="line">');
                }
            } else {
                isFirstLevel = true;
                html.push('<ul style="padding-left:0px;">');
            }

            for (var i = 0; i < length; i++) {
                var childrenNode = childrenNodes[i];
                var leaf = false;
                if (childrenNode.leaf === true || childrenNode.leaf === "true" || childrenNode.leaf === 1 ) {
                    leaf = true;
                }
                childrenNode.liId = idGenerate();
                childrenNode.elbowId = idGenerate();
                childrenNode.aId = idGenerate();
                childrenNode.iconId = idGenerate();
                if (childrenNode.iconCls) {
                    childrenNode.iconCls = "f-tree-button f-tree-folder " + childrenNode.iconCls;
                } else {
                    if (leaf) {
                        childrenNode.iconCls = "f-tree-button f-tree-folder f-tree-leaf";
                    } else {
                        childrenNode.iconCls = "f-tree-button f-tree-folder f-tree-folder-close";
                    }
                }
                var liId = childrenNode.liId;
                var isFirst = false;
                var isLast = false;

                if (i === 0) {
                    isFirst = true;
                }
                if (i === length - 1) {
                    isLast = true;
                }
                childrenNode.isFirst = isFirst;
                childrenNode.isLast = isLast;
                var elbowCls = '';
                if (isLast) {
                    if (leaf) {
                        elbowCls = this.nodeElbowFlatBottomCls;
                    } else {
                        elbowCls = this.nodeElbowPlusBottomCloseCls;
                    }
                } else {
                    if (leaf) {
                        elbowCls = this.nodeElbowFlatMiddleCls;
                    } else {
                        elbowCls = this.nodeElbowPlusMiddleCloseCls;
                    }
                }
                //第一层数据节点特殊处理
                if (isFirstLevel) {
                    childrenNode.level = 1;
                    if (isFirst) {
                    	// begin 20130415 hanyin 需求5577 ，如果树节点下只有一个节点，这个节点前的虚线改为FlatBottom
                    	if (length > 1) {
                        if (leaf) {
                            elbowCls = this.nodeElbowFlatTopCls;
                        } else {
                            elbowCls = this.nodeElbowPlusTopCloseCls;
                        }
                      } else {
		                    if (leaf) {
		                        elbowCls = this.nodeElbowFlatBottomCls;
		                    } else {
		                        elbowCls = this.nodeElbowPlusBottomCloseCls;
		                    }
                      }
                      // end 20130415 hanyin 需求5577 ，如果树节点下只有一个节点，这个节点前的虚线改为FlatBottom
                    }
                }

                var checkboxCls = "";
                var isChecked = childrenNode.checked;
                if (isChecked == 'true' || isChecked == true) {
                    checkboxCls = this.nodeSelectedCls;
                    if (selectModel === "selectChildren" || selectModel === "selectParent") {
                        this.selectedNodes[childrenNode.id] = childrenNode;
                    }
                } else {
                    checkboxCls = this.nodeUnSelectedCls;
                }
                /*
                 html.push('<li id="' + childrenNode.liId + '" f_value="' + childrenNode.id + '" f_value_type="' + typeof(childrenNode.id) + '" f_status="close">');
                 html.push('<span id="' + childrenNode.elbowId + '"  class="' + elbowCls + '"></span>');
                 */
                html.push('<li id="');
                html.push(childrenNode.liId);
                html.push('" f_value="');
                html.push(childrenNode.id);
                html.push('" f_value_type="');
                html.push(typeof(childrenNode.id));
                html.push('" f_status="close">');
                html.push('<span id="');
                html.push(childrenNode.elbowId);
                html.push('"  class="');
                html.push(elbowCls);
                html.push('"></span>');


                if (selectModel === "selectChildren" || selectModel === "selectParent") {
                    childrenNode.checkboxId = idGenerate();
                    /*html.push('<span  id="' + childrenNode.checkboxId + '"  class="' + checkboxCls + '" ></span>');
                     */
                    html.push('<span  id="');
                    html.push(childrenNode.checkboxId);
                    html.push('"  class="');
                    html.push(checkboxCls);
                    html.push('" ></span>');

                }
                /*
                 html.push('<a id="' + childrenNode.aId + '"><span  id="' + childrenNode.iconId + '"  class="' + childrenNode.iconCls + '"></span>');
                 html.push('<span class="node-text" title="' + childrenNode.text + '">' + childrenNode.text + '</span></a></li>');
                 */
                html.push('<a id="');
                html.push(childrenNode.aId);
                html.push('"><span  id="');
                html.push(childrenNode.iconId);
                html.push('"  class="');
                html.push(childrenNode.iconCls);
                html.push('"></span>');
                html.push('<span class="node-text" title="');
                html.push(childrenNode.text);
                html.push('">');
                html.push(childrenNode.text);
                html.push('</span></a></li>');

                //保存节点数据

                this.dataStore[childrenNode.id] = childrenNode;
            }
            html.push('</ul>');
            if (parentNode) {
                //查找父节点
                var liEl = $I(parentNode.liId);
                liEl.attr('f_status', 'open');
                var htmlStr = html.join('');
                liEl.append(htmlStr);
                html = null;
                liEl = null;
            } else {
                //document.getElementById('memoryArea').innerHTML = html.join('');
                var htmlStr = html.join("");
                this.bodyEl.html(htmlStr);
                html = null;
                htmlStr = null;
            }
        },
        _clearPlusIcons : function(nodeData) {
            if (!nodeData) {
                return;
            }
            var elbowId = nodeData.elbowId;
            var elbowEl = $I(elbowId);
            var elbowDom = elbowEl.get(0);
            var elbowCls = elbowDom.className;
            var newElbowCls = '';
            if (elbowCls.indexOf('-middle-') !== -1) {
                elbowEl.get(0).className = this.nodeElbowFlatMiddleCls;
            } else if (elbowCls.indexOf('-bottom-') !== -1) {
                elbowEl.get(0).className = this.nodeElbowFlatBottomCls;
            } else if (elbowCls.indexOf('-top-') !== -1) {
                elbowEl.get(0).className = this.nodeElbowFlatTopCls;
            }
            // begin 20130418 hanyin 修复缺陷4930 ，当某个树中只有一个叶子菜单时，点击叶子菜单会往前跳
            // elbowEl.get(0).className = newElbowCls;
            // end 20130418 hanyin
        },

        _changeIcons : function(nodeData, source, target) {
            if (!nodeData) {
                return;
            }
            var elbowId = nodeData.elbowId;
            var iconId = nodeData.iconId;
            var elbowEl = $I(elbowId);
            var elbowDom = elbowEl.get(0);
            var iconEl = $I(iconId);
            var iconDom = iconEl.get(0);
            //改变展开折叠图标
            if (elbowDom) {
                var elbowCls = elbowDom.className;
                elbowDom.className = elbowCls.replaceAll(source, target);
            }
            //使用默认的文档图片
            if (iconDom) {
                var iconCls = iconDom.className;
                if (iconCls.indexOf('f-tree-folder-close') !== -1 || iconCls.indexOf('f-tree-folder-open') !== -1) {
                    iconDom.className = iconCls.replaceAll(source, target);
                }
            }
        },
        _renderVirtualRoot : function() {
            var options = this.options;
            var rootNode = options.rootNode;
            var rootId = rootNode.id;
            var rootText = rootNode.text;
            var expanded = rootNode.expanded;
            var idGenerate = FTree.idGenerate;
            var liId = idGenerate();
            var root = {
                _rootId:rootId,
                id:rootId,
                text:rootText,
                level:1,
                expanded:expanded,
                isSingle:true,
                liId: liId,
                elbowId :idGenerate(),
                iconId: idGenerate(),
                aId: idGenerate(),
                iconCls:rootNode.iconCls ? "f-tree-button f-tree-folder " + rootNode.iconCls : "f-tree-button f-tree-folder f-tree-folder-close",
                isFirst :true,
                isLast : true
            };

            if (options.staticData) {
                options.syncLoad = true;
                this.hasLoaded = true;
                //如果有根节点，且使用静态数据，需要修改静态数据第一层节点的pid为rootNode的id
                if (options.rootVisible) {
                    var staticData = options.staticData;
                    var length = staticData.length;
                    for (var i = 0; i < length; i++) {
                        staticData[i].pid = rootId;
                    }
                }

                /**
                 * 静态数据源。默认值为：null。
                 * @name FTree#staticData
                 * @type Array[Object]
                 * @default null
                 * @example
                 * 数据结构如下：
                 *        [{
                 *               "id":"node1",
                 *               "text": "节点1",
                 *              "children":[{
                 *                   "id"："node2",
                 *                   "text": "节点2"
                 *               }, {
                 *                   "id":"node3",
                 *                   "text": "节点3"
                 *               }]
                 *           }];
                 *
                 */
                root.children = options.staticData;

            }
            //生成根节点的dom结构
            var html = [];
            var elbowCls = 'f-tree-button f-tree-elbow f-tree-elbow-plus-root-close';

            html.push('<ul  style="padding-left:0px;">');
            html.push('<li id="' + root.liId + '" f_value="' + root.id + '" f_value_type="' + typeof(root.id) + '" f_status="close">');
            html.push('<span id="' + root.elbowId + '"  class="' + elbowCls + '"></span>');
            if (options.selectModel === "selectChildren" || options.selectModel === "selectParent") {
                root.checkboxId = idGenerate();
                html.push('<span id="' + root.checkboxId + '"  class="' + this.nodeUnSelectedCls + '" ></span>');
            }
            html.push('<a id="' + root.aId + '"><span  id="' + root.iconId + '"  class="' + root.iconCls + '"></span>');
            html.push('<span class="node-text" title="' + root.text + '">' + root.text + '</span></a></li>');
            html.push('</ul>');
            //保存根节点数据到 dataStore中。
            this.dataStore[root.id] = root;
            //添加到根节点存放的dom对象中
            this.bodyEl.append(html.join(''));
            if (root.expanded) {
                this.expandNode(root);
            }
        },
        _renderFirstLevelNode: function() {
            var options = this.options;
            var staticData = options.staticData;
            if (staticData) {
                //如果有静态数据，则根据数据进行渲染树节点。
                options.syncLoad = true;
                this.hasLoaded = true;
                this._renderNode(null, staticData);
            } else {
                //如果没有静态数据，则发送ajax请求获取数据。
                this._loadNode();
            }

        },
        /**
         * 设置组件的高宽。
         * @function
         * @name FTree#setSize
         * @param width  类型：Number 组件的宽度
         * @param height  类型：Number 组件的高度
         * @return
         * @example
         *
         */
        setSize: function(width, height) {
            var options = this.options;
            if (width) {
                var isString = 'string' == typeof(width);
                if (isString && width == 'auto') {
                    //如果是auto 则什么都不做
                } else {
                    if (isString) {
                        width = parseInt(width);
                    }
                    this.element.width(width);
                    this.bodyEl.width(width - 2);
                }
            }
            if (height) {
                var isString = 'string' == typeof(height);
                if (isString && height == 'auto') {
                    //如果是auto 则什么都不做
                } else {
                    if ('string' == typeof(height)) {
                        height = parseInt(height);
                    }
                    var headH = 0;
                    if (this.headEl.length) {
                        headH = this.headEl.outerHeight(false);
                    }
                    this.bodyEl.height(height - headH - 2);
                }

            }
        },
        setTitle : function(title) {
            if (!title) {
                return;
            }
            if (!this.titleEl) {
                this.titleEl = $I(this.id + '-title');
            }
            this.titleEl.length && this.titleEl.text(title);
        },
        /**
         * 获取选中节点的数据对象。
         * @function
         * @name FTree#getSelectedNodes
         * @return Array[node]
         * @example
         *
         */
        getSelectedNodes: function() {
            var nodes = [];
            var selectedNodes = this.selectedNodes;
            for (var p in selectedNodes) {
                nodes.push(selectedNodes[p]);
            }
            return nodes;
        }
    });
})(jQuery);
/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Ajax.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FAjax组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员     修改说明
 * 2012-10-29   qudc        修复body区域有滚动条时，window遮罩遮不住滚动条的bug。解决方法，在遮罩的时候给body添加样式"f-mask-scroll-hide",移除遮罩的时候移除该样式。
 * 2012-10-29   qudc        close方法中添加_hideBodyMask方法调用，解决用户直接调用close方法，没办法去除遮罩。
 * 2012-11-29   qudc                  遮罩计算可见区域的时候，在非标准的盒子模型（怪异模式）下，添加document.body.clientWidth、document.body.clientHeight来计算可见区域的高宽
 * 2012-12-07   qudc        新增maximized属性，用于设置win组件打开时是否默认最大化。
 * 2012-12-07   qudc        新增_toRestoreIcon方法和 _toMaxIcon方法，将最大化，恢复原始大小时需要修改按钮样式的方法抽取出来。 替代 _bindEven方法中最大化 恢复按钮click事件调用的代码。
 * 2012-12-19   qudc        修复setHtml方法，将原先的延时设置html的功能去除。防止调用show方法以后，直接调用setPageUrl方法，会导致页面刷新。
 * 2013-01-09   qudc        修改setPageUrl方法的API描述。添加“注意，调用setPageUrl方法之前，需要先调用show方法。
 * 2013-01-10   qudc        修复bug：3837 修改setPageUrl方法里面对pageUrl的处理方式，改成使用transUrl方法对url进行判断处理，支持http和https
 * 2013-01-10   qudc        修复bug：3838  修改setSize方法API描述，添加注意事项。
 * 2013-01-11   qudc        新增onShow事件的API描述
 * 2013-01-11   qudc        修复bug:3870  添加对contentHtml的判断，如果该值为空，即没有空格也没有回车，那么不进行设置，且不触发onSetHtml属性。
 * 2013-01-23	hanyin		在win大小变化是触发onResize事件
 * 2013-02-01	hanyin		BUG #4631 Ie下，当win弹出时，背景body都会回到初始位置
 * 2013-03-04   qudc        完成需求4864，新增属性hasCloseBtn属性
 * 2013-03-19   qudc        修复需求：5183 新增方法_showAllSelectEl和_hideAllSelectEl，修复ie6下遮罩不会隐藏html原生select组件
 * 2013-03-19   qudc        修复需求：5189 ，解决win组件在其标签下面写包含原生textarea标签，由于textarea嵌套，导致页面解析不正常。现在修改成，如果要在fwin组件下面直接使用textarea标签，必须使用<textarea></_textarea> 替代
 *20130710      hanyin      修复需求STORY #6351 win如果设置为打开时即最大化，只会在第一次打开的时候计算位置，第二次不会
 */

/**
 * @name FWin
 * @class 
 * 弹出窗， 用于弹窗方式进行数据展示或交互。典型的如增加，修改，查看的页面。
 */

/**@lends FWin# */






/**
 * 窗体的标题。
 * @type String
 * @name FWin#title
 * @default ""
 */


/**
 * 通过setHtml方法设置html片段后触发该事件，或者设置pageUrl属性（isIframe属性为false）以ajax的方式成功加载html片段后触发该事件。注意事项：&lt;f:win&gt;A&lt;/f:win&gt; 或者&lt;@win &gt;Av/@win&gt;，其中A的值可以为空格，回车，具体页面内容，①当A是以上值时，调用组件的show方法触发onSetHtml事件。②当A没值时，且未设置pageUrl属性，那么调用组件的show方法时不触发onSetHtml事件。③当A没值时，设置pageUrl(isIframe属性为false)，请求成功后都会触发onSetHtml事件。
 * @event
 * @name FWin#onSetHtml
 * @type Function
 * @example
 */

/**
 * 调用show方法时，触发onShow事件。用户可以在该事件中对组件中的表单进行重新
 * @event
 * @name FWin#onShow
 * @type Function
 * @example
 */


;
(function($, undefined) {
    $.widget('FUI.FWin', {
        options :{
            /**
             * 窗体中的按钮。此配置项为JSON数组。每个JSON对象具有 <code>text</code> 属性(配置按钮文字)
             * 、 <code>click</code> 属性(配置按钮触发时的回调方法)、<code>iconCls</code>属性（配置按钮的样式图片）。其中iconCls的样式如下所示：
             * .iconCls {background: url("../dd/drop-yes.gif") no-repeat scroll left center transparent;}
             * @type Array
             * @name FWin#buttons
             * @default []
             *  @example
             *   $("#select").FWin({buttons : [{
             *      text : "确定",
             *      iconCls:"isOk",
             *      click : function () {...}
             *  }, {
             *      text : "取消",
             *      iconCls:"cancel",
             *      click : function () {...}
             *  }]);
             */
            buttons:[],
            /**
             * 是否模态窗口。默认值为true，即以模态的方式展现窗口。
             * @type Boolean
             * @name FWin#modal
             * @default true
             * @example
             *
             */
            modal:true,

            /**
             * 窗体中的按钮的对齐方式  center left right
             * @type String
             * @name FWin#buttonAlign
             * @default center
             *  @example
             */
            buttonAlign:'center',

            /**
             * 组件的宽度。
             * @type Number
             * @name FWin#width
             * @default 400
             * @example
             *   $("#select").FWin({width : 400});
             */
            width:400,
            /**
             * 组件的高度。
             * @type Number
             * @name FWin#height
             * @default 300
             * @example
             *   $("#select").FWin({height : 300});
             */
            height :300,
            /**
             * 设置组件是否可拖动。
             * @type Boolean
             * @name FWin#draggable
             * @default true
             * @example
             *
             */
            dragable :true ,
            /**
             * 是否可最大化。
             * @type Boolean
             * @name FWin#maxable
             * @default false
             * @example
             *
             */
            maxable : false ,
            /**
             * 是否以iframe的方式加载页面,如果该属性值为true，生成的iframe标签的id为“FWin组件的id-iframe”。
             * @type Boolean
             * @name FWin#isIframe
             * @default false
             * @example
             *
             */
            isIframe: false ,

            /**
             * 组件加载页面的地址,如果isIframe属性为true,那么请求的页面需要是标准的HTML页面，如果isIframe属性为false，那么请求的页面只能是HTML片段，不允许包含html、head、body这些html标签。
             * @type String
             * @name FWin#pageUrl
             * @default ""
             * @example
             *
             */
            pageUrl :'',
            /**
             * 设置win组件打开时是否最大化窗口。默认值为false。
             * @type Boolean
             * @name FWin#maximized
             * @default false
             * @example
             *
             */
            maximized : false,
            /**
             * 设置win组件右上角是否有关闭按钮，默认值为true，即有关闭按钮。
             * @type Boolean
             * @name FWin#hasCloseBtn
             * @default true
             * @example
             *
             */
            hasCloseBtn : true

        },
        _create : function() {
            this.firstShow = true;
        },
        _init:function() {

        },

        destroy:function() {
            var options = this.options;
            //解除事件绑定
            if (options.hasCloseBtn) {
                this.closeBtn.unbind();
            }
            this.maxBtn && this.maxBtn.unbind();
            var len = this.options.buttons.length;
            var id = this.element.attr('id');
            for (var i = 0; i < len; i++) {
                $("#" + id + '-btn-' + i).unbind();
            }
            this.dragable && this.dragable.destroy();

            this.maskEl = null;
            this.closeBtn = null;
            this.bodyContentEl = null;
            this.headerEl = null;
            this.titleEl = null;
            this.maxBtn = null;
            this.dragable = null;
            this.hiddenArrayList = null;
            $.Widget.prototype.destroy.call(this);
        },
        _prepareHtml : function() {
            if (this.firstShow) {
                var html = this._generateWinHtml();
                var element = this.element;
                element.append(html);
                this.zIndex = WinIndex.getInstance().getIndex();
                element.css('z-index', this.zIndex);
                this._initProperty();
                //绑定事件
                this._bindEvent();
                this.firstShow = false;
            }
        },

        /**
         * 打开window窗体。
         * @name FWin#show
         * @function
         * @example
         *  $("#select").FWin('show');
         *
         */
        show : function() {
            var options = this.options,element = this.element,id = element.attr('id'),
                    onShow = options.onShow,
                    onSetHtml = options.onSetHtml;

            if (!this.isShown) {
                this._prepareHtml();
            }
            this._showBodyMask();
            element.css('display', 'block');
            if (!this.isShown) {
                //start 2012-12-07 modify by qudc  新增maximized属性的功能实现，
                if (options.maximized) {
                    this._max();
                    this._toMaxIcon();
                } else {
                    this._resize();
                }
                //end 2012-12-07  modify by qudc
                if (!options.isIframe && !options.pageUrl) {
                    this.setHtml();
                } else {
                    this.setPageUrl(options.pageUrl);
                }
                this.isShown = true;
            } else {
            	// 20130710 modify by hanyin STORY #6351 win如果设置为打开时即最大化，只会在第一次打开的时候计算位置，第二次不会
                if (!this.isMax) {
                    this._rePosition();
                } else {
                		this._max();
                }
              // 20130710 modify by hanyin STORY #6351 win如果设置为打开时即最大化，只会在第一次打开的时候计算位置
                //onSetHtml && onSetHtml();
            }
            onShow && onShow();
        },
        //生成以iframe方式打开的html片段
        _getIframeHtml : function(pageUrl) {
            var htmlArr = [],element = this.element, id = element.attr('id') ,options = this.options;
            htmlArr.push('<iframe id="' + id + '-iframe" ');
            htmlArr.push('class="f-win-iframe"  frameborder="0"></iframe>');

            return htmlArr.join('');
        },

        /**
         * 设置FWin组件请求页面的路径，如果isIframe属性为true，则以iframe的方式加载页面。否则以ajax的方式获取内容html，然后添加到FWin组件中。注意，调用setPageUrl方法之前，需要先调用show方法。
         * @name FWin#setPageUrl
         * @param pageUrl 请求页面的路径
         * @function
         * @example
         *  $("#select").FWin('setPageUrl','contentPage.jsp');
         *
         */
        setPageUrl : function(pageUrl) {

            //add by qudc   2012-12-19  删除不必要的代码，如果没有pageUrl属性，则不发送请求获取页面。start
            if (!pageUrl) {
                return;
            }
            //add  by qudc  2012-12-19 end
            var options = this.options,UTILS = window['$Utils'];
            var contentHtml = '',bodyContentEl = this.bodyContentEl;
            var onSetHtml = options.onSetHtml;
            bodyContentEl.unbind();
            bodyContentEl.empty();

            pageUrl = pageUrl || options.pageUrl;
            options.pageUrl = pageUrl;
            /* 2013-01-10 bug 3837  start  delete by  qudc  删除原先url的处理方式，原因：原先的url处理不对http和https进行处理
             if (pageUrl.indexOf('/') !== 0) {
             pageUrl = UTILS.getContextPath() + '/' + pageUrl;
             } 2013-01-10  bug 3837  end  delete by  qudc
             */
            // 2013-01-10 bug 3837  start  add by  qudc  使用transUrl方法，可以支持对http和https请求的判断处理。
            pageUrl = UTILS.transUrl(pageUrl)
            // 2013-01-10 bug 3837  end  add by  qudc
            if (options.isIframe) {
                //以iframe的方式加载页面
                contentHtml = this._getIframeHtml(pageUrl);
                bodyContentEl.html(contentHtml);
                $("iframe:first", bodyContentEl).attr("src", pageUrl);
            } else {
                //ajax方法获取文件内容，回调
                $.ajax({
                    context:this,
                    dataType:"html",
                    url: pageUrl,
                    success: function(contentHtml) {
                        bodyContentEl.html(contentHtml);
                        //触发onSetHtml事件
                        onSetHtml && onSetHtml();
                    }
                });
            }
        },

        /**
         * 设置FWin组件内容区域的html片段。
         * @name FWin#setHtml
         * @function
         * @example
         *  $("#select").FWin('setHtml','&lt;div&gt;我是content内容&lt;/div&gt;');
         *
         */
        setHtml : function(html) {
            //delete by qudc 2102-12-19  删除异步设置html内容。start
            //setTimeout($.proxy(function() {
            var contentHtml = html,bodyContentEl = this.bodyContentEl;
            var element = this.element,id = element.attr('id'),options = this.options,onSetHtml = options.onSetHtml;

            bodyContentEl.unbind();
            bodyContentEl.empty();

            //组件内部自己调用
            if (!contentHtml) {
                //获取存放在页面中的内容
                var contentEl = $('#' + id + "-textarea");
                contentHtml = contentEl.val();
                // 2013-03-21 start add by qudc  修复需求：5189 ，解决win组件在其标签下面写包含原生textarea标签，由于textarea嵌套，导致页面解析不正常。现在修改成，如果要在fwin组件下面直接使用textarea标签，必须使用<textarea></_textarea> 替代
                contentHtml =  contentHtml.replace(/_textarea/g,'textarea');
                // 2013-03-21 end  add  by qudc
                //2013-1-11 start bug 3870   add by qudc  添加对contentHtml的判断，如果该值为空，即没有空格也没有回车，那么不进行设置，且不触发onSetHtml属性。
                if (contentHtml) {
                    bodyContentEl.html(contentHtml);
                    //触发onSetHtml事件
                    onSetHtml && onSetHtml();
                }
                //2013-1-11  end bug 3870  add by qudc
            } else {
                //组件外部通过方法调用
                //设置html内容
                bodyContentEl.html(contentHtml);
                //触发onSetHtml事件
                onSetHtml && onSetHtml();
            }
            //delete by qudc 2102-12-19  end
            // }, this), 300);
        },
        /**
         * 关闭窗体。
         * @name FWin#close
         * @function
         * @example
         * $("#select").FWin('close');
         *
         */
        close :function() {
            var options = this.options,onClose = options.onClose;
            this.element.css('display', 'none');
            this._hideBodyMask();
            /**
             * 窗体关闭时触发事件。
             * @event
             * @name FWin#onClose
             * @type Function
             * @example
             *
             */
            onClose && onClose();
        },
        /**
         * 重新计算window的位置，需要参数：组件的宽度，组件的高度。
         * @param w
         * @param h
         */
        _rePosition : function(w, h) {
            //计算win组件展现的位置
            var options = this.options;
            w = w || options.width,h = h || options.height;
            var windowEl = $(window),documentEl = $(document);
            var windowW = windowEl.width(),windowH = windowEl.height();
            var isBoxModel = jQuery.support.boxModel;
            var scrollLeft = isBoxModel && document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollTop = isBoxModel && document.documentElement.scrollTop || document.body.scrollTop;
            var left = (windowW - w) / 2 + scrollLeft;
            var top = (windowH - h) / 2 + scrollTop;
            top < 0 && (top = 0),left < 0 && (left = 0);
            this._showAt(left, top);
        },
        /**
         * 设置win组件展现的位置
         * @param left
         * @param top
         */
        _showAt : function(left, top) {
            var elStyle = this.element.get(0).style;
            elStyle.left = left + 'px';
            elStyle.top = top + 'px';
        },
        /**
         * 展现背景遮罩
         */
        _showBodyMask : function() {
            var options = this.options,element = this.element;
            var id = element.attr('id');

            if (options.modal) {
                //$('body').doMask('', {isWinMask :true});
                var UTILS = window['$Utils'];
                //UTILS.addClass($('body').get(0), 'f-mask-scroll-hide');
                if ($.browser.msie && $.browser.version == '6.0') {
                    this._hiddenAllSelectEl();
                }
                var maskId = id + '-mask';
                var maskEl = $('#' + maskId);
                if (maskEl.length == 0) {
                    var maskHtml = this._generateMaskHtml(maskId);
                    $('body').append(maskHtml);
                    this._adjustMask(maskId);
                    $("#" + maskId).show();
                } else {
                    this._adjustMask(maskId);
                    maskEl.show();
                }
            }
        },
        /**
         * 隐藏所有的原生select组件
         */
        _hiddenAllSelectEl :function () {
            if (this.hasHidden === true) {
                return;
            }
            var i = 0;
            var j = 0;
            var es;            //var es = vForm.elements;  //获取表单中所有的元素
            this.hiddenArrayList = this.hiddenArrayList || [];
            this.hasHidden = true;

            var winSelectEls =  $('body').children('.f-win').find('select');
            var selectEls = $('select').not(winSelectEls);

            var selectLen = selectEls.length;
            for (var i = 0; i < selectLen; i++) {
                var selectDom = selectEls.get(i);
                var selectStyle = selectDom.style;
                if (selectStyle.display == "none" || selectStyle.display == "block") {
                } else {
                    selectStyle.display = "none";
                    this.hiddenArrayList.push(selectDom); //直接将对象的引用保存到链表中
                }
            }
        },
        //回复隐藏的select框
        _showAllSelectEl :function () {
            if (this.hasHidden === false) {
                return;
            }

            this.hasHidden = false;
            var hiddenArrayList = this.hiddenArrayList;
            var length = $.isArray(hiddenArrayList) && hiddenArrayList.length || 0;
            //将隐藏链表中的元素恢复显示
            if (hiddenArrayList != null && hiddenArrayList != false && length > 0) {
                for (var i = 0; i < length; i++) {
                    hiddenArrayList[i].style.display = "";   //继续隐藏
                }
            }
            this.hiddenArrayList = hiddenArrayList = null;
        },
        /**
         * 隐藏背景遮罩
         */
        _hideBodyMask : function() {
            var options = this.options;
            if (options.modal) {
                if (this.maskEl && this.maskEl.length) {
                    var UTILS = window['$Utils'];
                    //UTILS.removeClass($('body').get(0), 'f-mask-scroll-hide');
                    if ($.browser.msie && $.browser.version == '6.0') {
                        this._showAllSelectEl();
                    }
                    this.maskEl.hide();
                }
            }
        },
        /**
         * 生成mask组件的dom结构
         */
        _generateMaskHtml : function(maskId) {
            var htmlArr = [];
            htmlArr.push('<div id="');
            htmlArr.push(maskId);
            htmlArr.push('" class="f-mask-bg" style ="position:absolute; z-index:');
            htmlArr.push(this.zIndex - 5);
            htmlArr.push(';display:none;"></div>');

            return  htmlArr.join('');
        },

        /**
         * 动态调整mask遮罩的位置
         */
        _adjustMask :function(maskId) {
            if (maskId === undefined) {
                return;
            }
            var maskEl = $('#' + maskId);
            if (maskEl.length) {
                this.maskEl = maskEl;
                /* 2013-02-01	hanyin		BUG #4631 Ie下，当win弹出时，背景body都会回到初始位置
                 var isBoxModel = jQuery.support.boxModel;
                 var documentElement = document.documentElement;

                 //可视区域的宽度
                 var w = isBoxModel && documentElement.clientWidth || document.body.clientWidth;
                 //可是区域的高度
                 var h = isBoxModel && documentElement.clientHeight || document.body.clientHeight;
                 //滚动条的水平偏移量
                 var scrollLeft = isBoxModel && documentElement.scrollLeft || document.body.scrollLeft;
                 //滚动条的垂直偏移量
                 var scrollTop = isBoxModel && documentElement.scrollTop || document.body.scrollTop;

                 //设置背景阴影的宽高
                 var bw = (w + scrollLeft) + 'px';
                 var bh = (h + scrollTop) + 'px';

                 maskEl.css('width', bw);
                 maskEl.css('height', bh);
                 */
                var bw = $(document).width();
                var bh = $(document).height();
                maskEl.width(bw);
                maskEl.height(bh);
            }
        },



        _resize : function() {
            var options = this.options;
            var w = options.width;
            var h = options.height;
            this.setSize(w, h);
            this.isMax = false;
        },

        /**
         * 通过传入的参数，设置组件的高宽并重新居中显示。注意事项：调用该方法之前，必须先调用组件的show方法展现组件。
         * @name FWin#setSize
         * @function
         * @param w 组件的宽度（number类型）
         * @param h 组件的高度(number类型)
         * @example
         * $("#select").FWin('setSize',w,h);
         *
         */
        setSize : function (w, h) {

            if (typeof w != 'number' || typeof h != 'number') {
                return;
            }
            var element = this.element,options = this.options;
            var onResize = options.onResize;
            var headerEl = element.find('.f-win-tl');
            var contentEl = element.find('.f-win-body');
            var footEl = element.find('.f-win-bl');


            //重新计算组件的位置
            this._rePosition(w, h);
            //设置组件的宽度
            element.width(w);
            //设置组件的高度
            element.height(h);
            var headerH = headerEl.outerHeight(true);
            var footH = footEl.outerHeight(true);
            var contentH = h - headerH - footH;
            //内容区域上下（1+1+1+1）px的border高度
            contentEl.height(contentH - 4);
            //内容区域左右（6+6）px的margin宽度 以及左右（1+1+1+1）px的border宽度
            contentEl.width(w - 16);

            /* 20130123 hanyin add 在win大小变化是触发onResize事件 */
            contentEl.triggerHandler("onResize");
            /* end 20130123 hanyin add 在win大小变化是触发onResize事件 */

            //触发onResize事件
            /**
             * 窗体大小被改变时。当用户调用setSize方法时，会触发该事件。
             * @event
             * @name FWin#onResize
             * @type Function
             * @example
             */
            onResize && onResize();

        },

        _initProperty : function() {
            var el = this.element;
            var options = this.options;
            if (options.hasCloseBtn) {
                this.closeBtn = el.find('.f-win-close');
            }
            this.bodyContentEl = el.find('.f-win-body');
            this.headerEl = el.find('.f-win-header');
            this.titleEl = el.find('.f-win-title');
            this.maxBtn = el.find('.f-win-max');
        },

        _toMaxIcon : function() {
            this.dragable && this.dragable.stop();
            this.maxBtn.removeClass('f-win-max');
            this.maxBtn.addClass('f-win-restore');
            this.headerEl.css('cursor', 'default');
            this.titleEl.css('cursor', 'default');
        },
        _toRestoreIcon : function() {
            this.dragable && this.dragable.start();
            this.maxBtn.removeClass('f-win-restore');
            this.maxBtn.addClass('f-win-max');
            this.headerEl.css('cursor', 'move');
            this.titleEl.css('cursor', 'move');
        } ,
        //窗口最大化
        _max : function() {
            var windowEl = $(window),documentEl = $(document);
            var windowW = windowEl.width(),windowH = windowEl.height();
            /* 注释 by qudc  2012-12-7  原因：showAt方法的功能已经放在setSize方法中的_reposition方法中实现。

             var isBoxModel = jQuery.support.boxModel;
             var scrollLeft = isBoxModel && document.documentElement.scrollLeft || document.body.scrollLeft;
             var scrollTop = isBoxModel && document.documentElement.scrollTop || document.body.scrollTop;

             (scrollLeft < 0) && (scrollLeft = 0);
             (scrollTop < 0) && (scrollTop = 0);

             this._showAt(scrollLeft, scrollTop);
             */
            this.setSize(windowW, windowH);
            this.isMax = true;
        },
        //绑定组件相关的事件
        _bindEvent : function() {
            var ME = this;
            var options = this.options;
            if (options.hasCloseBtn) {
                this.closeBtn.bind('click', function() {
                    ME.close();
                });
            }
            if (this.maxBtn && this.maxBtn.length) {
                this.maxBtn.bind('click', function(e) {
                    var target = e.target;
                    var className = target.className;

                    if (className.indexOf('f-win-restore') > -1) {
                        ME._resize();
                        //start 2012-12-07  modify qudc 将重复代码移到_toRestoreIcon方法中
                        ME._toRestoreIcon();
                        //end 2012-12-07  qudc
                    } else {
                        ME._max();
                        //start 2012-12-07   modify qudc  将重复代码移到_toMaxIcon方法中
                        ME._toMaxIcon();
                        //end 2012-12-07
                    }
                });
            }

            var options = this.options;
            var buttons = options.buttons;
            var len = buttons.length;
            var element = this.element;
            var id = element.attr('id');
            for (var i = 0; i < len; i++) {
                var clickFn = buttons[i].click || function() {
                };
                (function(clickFn) {
                    $("#" + id + '-btn-' + i).click(function(e) {
                        clickFn.call(ME);
                    });
                })(clickFn);
            }

            if (options.dragable) {
                this.dragable = new $.Dragable('f-win-title-' + id, id);
            } else {
                this.headerEl.css('cursor', 'default');
                this.titleEl.css('cursor', 'default');
            }
        },

        //将当前的window置到最前
        _front : function() {

        },


        /**
         *  生成win组件外框的html片段，不包含content内容
         */
        _generateWinHtml :function() {
            var htmlArr = [],options = this.options,element = this.element,id = element.attr('id');
            htmlArr.push('');
            htmlArr.push('<div class="f-win-tl" ');
            htmlArr.push('id="f-win-title-' + id);
            htmlArr.push('">');
            htmlArr.push('<div class="f-win-tr">');
            htmlArr.push('<div class="f-win-tc">');
            htmlArr.push('<div class="f-win-header">');
            if (options.hasCloseBtn) {
                htmlArr.push('<div class="f-win-tool f-win-close"></div>');
            }
            if (options.maxable) {
                htmlArr.push('<div class="f-win-tool f-win-max"></div>');
            }
            htmlArr.push('<span class="f-win-title ">');
            htmlArr.push(options.title);
            htmlArr.push('</span>');
            htmlArr.push('</div>');
            htmlArr.push('</div>');
            htmlArr.push('</div>');
            htmlArr.push('</div>');

            htmlArr.push('<div class="f-win-bwrap">');
            htmlArr.push('<div class="f-win-ml">');
            htmlArr.push('<div class="f-win-mr">');
            htmlArr.push('<div class="f-win-mc">');
            htmlArr.push('<div class="f-win-body" >');
            htmlArr.push('</div>');
            htmlArr.push('</div>');
            htmlArr.push('</div>');
            htmlArr.push('</div>');

            htmlArr.push('<div class="f-win-bl">');
            htmlArr.push('<div class="f-win-br">');
            htmlArr.push('<div class="f-win-bc">');

            var buttonsHtml = this._generateButtonHtml(options.buttons, options.buttonAlign);
            htmlArr.push(buttonsHtml);
            htmlArr.push('</div>');
            htmlArr.push('</div>');
            htmlArr.push('</div>');
            htmlArr.push('</div>');

            return htmlArr.join('');


        },
        //请求win组件的content内容
        _loadContent:function(url) {

        },

        /**
         * 根据buttons属性，生成对应的html片段，其中buttons必须为数组
         * @param buttons
         */
        _generateButtonHtml : function(buttons, buttonAlign) {
            var htmlArr = [];
            var len = buttons.length;
            if (len == 0) {
                htmlArr.push('<div style="height:8px;">');
                htmlArr.push('</div>');
            } else {
                htmlArr.push('<div style="height:40px;">');
                htmlArr.push('<div style="text-align:');
                htmlArr.push('' + buttonAlign);
                htmlArr.push(';padding:4px 3px 2px 3px;">');
                htmlArr.push('<div style=" display: inline-block;">');
                htmlArr.push('<table><tr>');
                var id = this.element.attr('id');
                for (var i = 0; i < len; i++) {
                    var buttonObj = buttons[i];
                    var text = buttonObj.text;
                    var iconCls = buttonObj.iconCls;
                    htmlArr.push('<td><div class="f-win-btn-l"><div class="f-win-btn-r"><div id="');
                    htmlArr.push(id);
                    htmlArr.push('-btn-' + i);
                    htmlArr.push('" class="f-win-btn-c">');
                    if (iconCls) {
                        htmlArr.push('<div class="f-win-btn-icon ');
                        htmlArr.push(iconCls);
                        htmlArr.push('" style="float:left;"></div>');
                        htmlArr.push('<div class="f-win-btn-icon-text">');
                    } else {
                        htmlArr.push('<div class="f-win-btn-noicon-text">');
                    }

                    htmlArr.push(text);
                    htmlArr.push('</div></td>');
                }
                htmlArr.push('</tr></table></div></div></div>');
            }
            return  htmlArr.join('');
        }
    });

})(jQuery);
      

/**
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.action.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FAction组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员      修改说明
 * 2013-03-28    qudc         修改onMousemove方法，对top值进行判断。如果小于0，则重置成0，放置标题栏拖上去后拖不回来。
 */
//拖拽插件
$.Dragable = function(targetId, widgetId) {
    this.targetId = targetId;
    this.widgetId = widgetId;
    this._init();
    this._bindEvent();

}

$.Dragable.prototype = {

    destroy : function() {

    },

    _init : function() {
        this.targetEl = $('#' + this.targetId);
        this.widgetEl = $('#' + this.widgetId);
        this.mousePos = {};
    },

    _bindEvent : function() {
        this.targetEl.mousedown($.proxy(this.onMousedown, this));
    },

    onMousedown : function(e) {

        var target = e.target;
        var className = target.className;
        if (className.indexOf('f-win-close') == -1 && className.indexOf('f-win-max') == -1 && className.indexOf('f-win-restore') == -1) {
            var w = this.widgetEl.outerWidth(true);
            var h = this.widgetEl.outerHeight(true);
            var position = this.widgetEl.position();
            var documentEl = $(document);
            var bodyEl = $('body');
            bodyEl.closeSelect();
            //生成对应的虚框
            var htmlArr = [];
             htmlArr.push('<div id="dottedLine" class="f-dotted-line" style="');
            // begin 20121213 hanyin 增加zIndex的设置
            var zIndex = parseInt(this.widgetEl.css("zIndex"));
            if (!isNaN(zIndex)) {
            	htmlArr.push('z-index:' + (zIndex+1)+";");
            }
            // end 20121213 hanyin 增加zIndex的设置
            htmlArr.push('width:' + w + 'px;');
            htmlArr.push('height:' + h + 'px;');
            htmlArr.push('top:' + position.top + 'px;');
            htmlArr.push('left:' + position.left + 'px;');
            htmlArr.push('"></div>');
            bodyEl.append(htmlArr.join(''));

            this.dottedLineEl = $('#dottedLine');
            var pageX = e.pageX,pageY = e.pageY;
            this.mousePos = {pageX:pageX,pageY:pageY};
            documentEl.mousemove($.proxy(this.onMousemove, this));
            documentEl.one('mouseup', $.proxy(this.onMouseup, this));
        }
    },

    onMousemove : function(e) {
        var pageX = e.pageX ,pageY = e.pageY ,dottedLineEl = this.dottedLineEl,mousePos = this.mousePos;
        var ox = pageX - mousePos.pageX,oy = pageY - mousePos.pageY;

        var position = dottedLineEl.position();
        var top = position.top + oy ;
        var left =  position.left + ox ;
        if(top<=0){
            top = 0;
            //{ 20130409 hanyin 避免鼠标超出窗口的情况下报js错的问题
            $(document).unbind('mouseup');
            this.onMouseup();
            //} 20130409 hanyin
        }
        var topPx = top + "px",leftPx = left+ 'px';

        var dottedLineStyle = dottedLineEl.get(0).style;
        dottedLineStyle.top = topPx;
        dottedLineStyle.left = leftPx;

        this.mousePos = {pageX:pageX,pageY:pageY};
    },

    onMouseup : function() {
        var documentEl = $(document);
        var bodyEl = $('body');
        var position = this.dottedLineEl.position();
        var widgetStyle = this.widgetEl.get(0).style;

        widgetStyle.top = position.top + 'px';
        widgetStyle.left = position.left + 'px';

        this.dottedLineEl.remove();
        this.dottedLineEl = null;
        bodyEl.openSelect();
        documentEl.unbind('mousemove');
    },

    start: function() {
        this.targetEl.mousedown($.proxy(this.onMousedown, this));
    },

    stop : function() {
        this.targetEl.unbind('mousedown', $.proxy(this.onMousedown, this));
    }
}


//组件的管理类

var WinIndex = (function() {

    var WIndex = function () {
        var winIndex = 10100 ;
        this.getIndex = function() {
            return winIndex +=10;
        };
    };

    var instance;
    var singleton = {
        getInstance : function() {
            if (instance == undefined) {
                instance = new WIndex();
            }
            return instance;
        }
    };
    return singleton ;
})();/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Pagingbar.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FPagingbar组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 2012-11-7    qudc                修改方法_doLoad，调用resetDataCache方法，用于清空缓存的数据，放置内存泄露。
 * 2012-12-14   qudc                修改方法_doLoad,当用户点击刷新按钮时，调用grid的resetDataCache方法，传递第二个参数isRefresh为true，将当前页中选中的记录从crosspageDataCache中删除.
 * 2012-12-14   qudc                修改getParams方法，返回参数中新增pageNum参数，用于保存当前页码。
 * 2012-12-14   qudc                修改getDefaultParams方法，参数中新增getDefaultParams参数，用于保存当前页码。
 * 2012-12-17   qudc               由于FUI.Utils.js中$Component的call方法无效，用tryCall方法替换。
 * 2013-01-09    qudc              修复bug：3976  grid的页数输入为0时，总的页数变成1页 。解决方案：分页输入框的正则表达式rgExp 由自然数修改成正整数，删除0和负数的判断
 * 2013-05-21    hanyin              STORY #5983 [基材ATS2.0/白鑫][TS:201305210005][FUI] grid支持在pagingbar上设置
 */

(function($) {


    /**
     * 设置分页栏中是否存在一个输入框，该输入框可供用户输入的自定义分页条数。默认值为：false。
     * @name hasCustomPageSize(todo)
     * @type Boolean
     * @default false
     * @example
     * 无
     */


    /**
     * 组件的唯一标示。
     * @name FPagingbar#id
     * @type String
     * @default
     *
     */

    /**
     * 返回pageSize的值
     * @function
     * @name FPagingbar#getPageSize
     * @return String
     * @example
     *
     */


    $.widget('FUI.FPagingbar', {
        options : {
            /**
             * 每页显示数据的条数。默认值为：10。
             * @name FPagingbar#pageSize
             * @type Number
             * @default 10
             * @example
             * 无
             */
            pageSize : 10,
            /**
             * 每页最多显示的行数，如果设置的pageSize超过此值则会设置为maxPageSize
             * @name FPagingbar#maxPageSize
             * @type Number
             * @default 300
             * @example
             * 无
             */
            maxPageSize : 300
        },
        _create : function() {
            var element = this.element;
            this.id = this.element.attr('id');
            this.start = 1;
            this.pageIndex = 1;
        },
        _init : function() {
            var id = this.element.attr('id');
            this.firstBtn = $I(id + '-page-first');
            this.prevBtn = $I(id + '-page-prev');
            this.nextBtn = $I(id + '-page-next');
            this.lastBtn = $I(id + '-page-last');
            this.refreshBtn = $I(id + '-page-refresh');

            this.beforePageTextSpan = $I(id + "-page-beforeText");
            this.afterPageTextSpan = $I(id + "-page-afterText");
            this.beforePageSizeTextSpan = $I(id + "-page-size-beforeText");
            this.afterPageSizeTextSpan = $I(id + "-page-size-afterText");
            
            // 当前页行数的输入框
            this.pageSizeInput = $I(id+"-page-size-input");

            //当前页输入框
            this.inputBtn = $I(id + '-page-input');

            //错误提示信息
            this.msgText = $I(id + '-page-totalcount');
            
            // 校验pageSize的合法性
            if (this.beforePageTextSpan.length > 0) {
	            this.options.pageSize = parseInt(this.options.pageSize) || 10;
	            this.options.maxPageSize = parseInt(this.options.maxPageSize) || 300;
	            if (this.options.maxPageSize < 0) {
	            	this.options.maxPageSize = 300;
	            }
	            if (this.options.pageSize < 1) {
	            	this.options.pageSize = 1;
	            }
	            if (this.options.pageSize > this.options.maxPageSize) {
	            	this.options.pageSize = this.options.maxPageSize;
	            }
	            this.pageSizeInput.val(this.options.pageSize);
            }

            this._initI18n();
            this._initMsg();
            this._bindPageEvent();
        },


        //获取ajax请求需要的参数，例如start，limit参数
        getParams : function() {
            var params = {};
            var pageSize = this.options.pageSize;
            var pageIndex = this.pageIndex;
            var start = 1 + ((pageIndex - 1) * pageSize);
            this.start = start;
            params["start"] = start;
            params["limit"] = pageSize;
            params["pageNum"] =  pageIndex ;

            return params;
        },
        //获取组件的默认参数，即start为1，limit为pageSize。
        getDefaultParams : function() {
            var params = {};
            var pageSize = this.options.pageSize;
            //重置pageIndex和start属性，使调用resetPagebar方法的时候重新计算相关提示信息。
            this.pageIndex = 1;
            this.start = 1;
            params["start"] = this.start;
            params["limit"] = pageSize;
            params["pageNum"] =  this.pageIndex ;

            return params;
        },


        //重置分页栏的按钮以及提示信息。
        resetPagebar : function(listCount, totalCount) {
            var UTILS = window['$Utils'];
            var pageIndex = this.pageIndex;
            this.totalCount = totalCount;
            var pageSize = this.options.pageSize;
            this.pageCount = parseInt(this.totalCount / pageSize);
            if (totalCount % pageSize > 0) {
                this.pageCount ++;
            }

            if (totalCount) {
                //有数据
                if (pageIndex < 2) {
                    this._disableButton(this.firstBtn);
                    this._disableButton(this.prevBtn);
                } else {
                    this._enableButton(this.firstBtn);
                    this._enableButton(this.prevBtn);
                }
                if (pageIndex < this.pageCount) {
                    this._enableButton(this.nextBtn);
                    this._enableButton(this.lastBtn);
                } else {
                    this._disableButton(this.nextBtn);
                    this._disableButton(this.lastBtn);
                }
            } else {
                //第一页没有数据
                this._disableButton(this.firstBtn);
                this._disableButton(this.prevBtn);
                this._disableButton(this.nextBtn);
                this._disableButton(this.lastBtn);
            }
            this._enableButton(this.refreshBtn);


            //更新分页栏显示信息
            var start = this.start;
            var end = start + pageSize - 1;
            (end > totalCount) && (end = totalCount);

            //更新当前页码
            this.inputBtn.val(pageIndex);
            //更新输入框的提示信息
            this.pageSizeInput.val(pageSize);

            this.afterPageTextSpan.text(UTILS.format(this.afterPageText, this.pageCount));
            this.msgText.text(UTILS.format(this.pageTotalMsg, start, end, totalCount));
        },
        _initI18n : function() {
            var lang = $.FUI.lang && $.FUI.lang.pagingbar || {};
            this.beforePageText = lang.beforePageText || "第";
            this.afterPageText = lang.afterPageText || "页 共{0} 页";
            this.pageTotalMsg = lang.pageTotalMsg || "显示{0}到{1},共{2}条数据";
            this.beforePageSizeText = lang.beforePageSizeText || "每页";
            this.afterPageSizeText = lang.afterPageSizeText || "条";
        },
        _initMsg : function() {
            var UTILS = window['$Utils'];
            this.beforePageTextSpan.text(this.beforePageText);
            this.afterPageTextSpan.text(UTILS.format(this.afterPageText, "0"));
            this.msgText.text(UTILS.format(this.pageTotalMsg, "0", "0", "0"));
            this.beforePageSizeTextSpan.text(this.beforePageSizeText);
            this.afterPageSizeTextSpan.text(this.afterPageSizeText);
        },

        _first : function() {
            this.pageIndex = 1;
            this._doLoad();
        },
        _prev : function() {
            var pageIndex = this.pageIndex - 1;
            pageIndex = pageIndex > 0 ? pageIndex : 1;
            this.pageIndex = pageIndex;
            this._doLoad();
        },
        _next : function() {
            this.pageIndex ++;
            this._doLoad();
        },
        _last : function() {
            this.pageIndex = this.pageCount;
            this._doLoad();
        },
        _refresh : function() {
        	this._tryPageSizeChange();
            this._doLoad(true);
        },
        
        _tryPageSizeChange : function() {
        	// 没有设置pageSize的接口
        	if (this.pageSizeInput.length == 0) {
        		return;
        	}
            var val = parseInt(this.pageSizeInput.val());
            if (isNaN(val)) {
            	this.pageSizeInput.val(this.options.pageSize);
            	return;
            }
            if (val < 1) {
            	val = 1;
            }
            if (val > this.options.maxPageSize) {
            	val = this.options.maxPageSize;
            }
            this.pageSizeInput.val(val);
            if (this.options.pageSize === val) {
            	return;
            }
            this.options.pageSize = val;
            
            this.start = 1;
            this.pageIndex = 1;
        },

        _doLoad : function(isRefresh) {
            var $C = window['$Component'];
            if (!this.gridId) {
                this.gridId = this.element.parent().attr('id');
            }
            //var gridId = this.options.gridId;
            var params = this.getParams();
            var gridEl = $I(this.gridId);
            if (isRefresh) {
                //刷新页面，且为跨页选中，那么将当前页选中的内容从crossPageDataCache属性中移除。
                $C.tryCall(gridEl, 'resetDataCache', false, isRefresh);
            } else {
                $C.tryCall(gridEl, 'resetDataCache', false);
            }

            $C.tryCall(gridEl, 'loadForPagingbar', params);
            gridEl = null;
        },

        //禁用按钮
        _disableButton : function(btn) {
            var status = btn.attr("f_grid_page_status");
            if ("enable" == status) {
                var type = btn.attr("f_grid_page_type");
                btn.get(0).className = "f-grid-page-button  f-grid-page-" + type + "-disabled";
                btn.attr("f_grid_page_status", "disabled");
            }
        },
        //启用按钮
        _enableButton : function (btn) {
            var status = btn.attr("f_grid_page_status");
            if ("disabled" == status) {
                var type = btn.attr("f_grid_page_type");
                btn.get(0).className = "f-grid-page-button f-grid-page-btn f-grid-page-" + type;
                btn.attr("f_grid_page_status", "enable");
            }
        },
        _bindPageEvent : function() {
            var ME = this;
            var pageEl = this.element;
            var inputBtnEl = this.inputBtn;
            var pageSizeInputEl = this.pageSizeInput;
            var UTILS = window['$Utils'];
            pageEl.bind({
                click:function(e) {
                    var tar = e.target;
                    var type = tar.getAttribute("f_grid_page_type");
                    var status = tar.getAttribute("f_grid_page_status");
                    if (type && status !== 'disabled') {
                        if ("first" == type) {
                            ME._first();
                        } else if ("prev" == type) {
                            ME._prev();
                        } else if ("next" == type) {
                            ME._next();
                        } else if ("last" == type) {
                            ME._last();
                        } else if ("refresh" == type) {
                            ME._refresh();
                        }
                    }

                },
                mouseover : function(e) {
                    var tar = e.target;
                    var type = tar.getAttribute("f_grid_page_type");
                    var status = tar.getAttribute("f_grid_page_status");
                    if (type && status === 'enable') {
                        UTILS.replaceClass(tar, "f-grid-page-button f-grid-page-btn f-grid-page-" + type + "-hover")
                    }
                },
                mouseout : function(e) {
                    var tar = e.target;
                    var type = tar.getAttribute("f_grid_page_type");
                    var status = tar.getAttribute("f_grid_page_status");
                    if (type && status === 'enable') {
                        UTILS.replaceClass(tar, "f-grid-page-button f-grid-page-btn f-grid-page-" + type)
                    }
                },
                mousedown:function(e) {
                    var tar = e.target;
                    var type = tar.getAttribute("f_grid_page_type");
                    var status = tar.getAttribute("f_grid_page_status");
                    if (type && status === 'enable') {
                        UTILS.replaceClass(tar, "f-grid-page-button f-grid-page-btn f-grid-page-" + type + "-active");
                    }
                },
                mouseup:function(e) {
                    var tar = e.target;
                    var type = tar.getAttribute("f_grid_page_type");
                    var status = tar.getAttribute("f_grid_page_status");
                    if (type && status === "enable") {
                        UTILS.replaceClass(tar, "f-grid-page-button f-grid-page-btn f-grid-page-" + type + "-hover");
                    }
                }
            });
            
            pageSizeInputEl.bind({
                keydown:function(e) {
                    var keyCode = e.keyCode;
                    if (keyCode == 13) {
                        ME._tryPageSizeChange();
                        ME._doLoad(true);
                    }
                }
            });

            inputBtnEl.bind({
                blur: function(e) {
                    ME.inputBtn.val(ME.pageIndex);
                },
                keydown:function(e) {
                    var tar = e.target;
                    var keyCode = e.keyCode;
                    if (keyCode == 13) {
                        var inputValue = parseInt(tar.value);
                        //2013-01-09  start  bug：3976  modify by qudc   将rgExp属性值由/\d+$/（自然数） 修改成 /^[0-9]*[1-9][0-9]*$/（正整数）
                        var rgExp = /^[0-9]*[1-9][0-9]*$/;
                        //2013-01-09  end bug：3976  modify by qudc end
                        var result = rgExp.exec(inputValue);
                        if (result) {
                            /* 2013-01-09  start bug：3976 delete  by qudc 注释掉该代码，因为正则校验修改成整数，所以不会出现inputValue值为0或者负数的情况。
                            if (inputValue < 1) {
                                inputValue = 1;
                                //ME.totalSpan.text(inputValue);
                                ME.afterPageTextSpan.text(UTILS.format(ME.afterPageText, inputValue));
                            }
                              2013-01-09  end  bug：3976 delete by qudc
                            */
                            if (inputValue > ME.pageCount) {
                                inputValue = ME.pageCount;
                                //ME.totalSpan.text(inputValue);
                                ME.afterPageTextSpan.text(UTILS.format(ME.afterPageText, inputValue));
                            }
                            if (ME.pageIndex != inputValue) {
                                ME.pageIndex = inputValue;
                                ME._doLoad();
                            }
                        } else {
                            ME.inputBtn.val(ME.pageIndex);
                        }
                    }
                }
            })

        },
         destroy : function() {
            this.element.unbind();
            this.inputBtn.unbind();
            this.inputBtn = null;
            this.firstBtn = null;
            this.prevBtn = null;
            this.nextBtn = null;
            this.lastBtn = null;
            this.refreshBtn = null;
            this.beforePageTextSpan = null;
            this.afterPageTextSpan = null;
            this.beforePageSizeTextSpan = null;
            this.afterPageSizeTextSpan = null;
            //错误提示信息
            this.msgText = null;
        }

    })
})(jQuery);
/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.ComboGrid.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FComboGrid组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 2013-01-11   qudc        修复bug：4523  修改readOnly属性的默认值描述。
 * 2013-01-23   qudc        将enabled属性改成disabled属性
 * 2013-01-23   qudc        将isEnabled方法修改成isDisabled方法
 * 2013-01-23   qudc        将setEnabled方法修改成setDisabled方法
 * 2013-01-23   qudc        readOnly属性修改成readonly属性
 * 2013-01-23   qudc        修改isReadOnly方法成isReadonly
 * 2013-01-23   qudc        修改setReadOnly方法成setReadonly
 * 2013-01-23   qudc        新增reset方法
 * 2013-01-23   qudc        新增多选功能
 * 2013-03-13   qudc        修改forceLoad的默认值，默认值修改成true
 * 2013-03-13   qudc        修复第二次列表展现时，输入框的值被清空的问题。
 * 2013-03-13   qudc        实现默认选中展开列表中的数据，只要列表中的数据存在输入框中。
 * 2013-03-13   qudc        修复ie、chrome下模糊查询有时无效的问题
 * 2013-03-14   qudc        修复通过setValue方法设置值以后，展开并关闭下拉列表，输入框中的值被清空的问题
 * 2013-03-14   qudc        修改方法_showList，支持碰撞检测。
 * 2013-03-14   qudc        keydown事件中，新增对keyCode==9（即tab键）的处理，当用户按tab键以后，隐藏下拉列表。
 * 2013-03-14    qudc       修复bug，combogrid组件检索后进行翻页，检索条件丢失的问题。
 * 2013-04-19    hanyin     修复需求5776，隐藏掉comboGrid下拉全选复选框
 * 20130509		hanyin		comboGrid的destroy方法移除与之关联的grid的dom，防止通过js删除comboGrid造成dom泄漏
 */
/**
 * @name FComboGrid
 * @class 
 * 选择下拉表格，当展现大量数据时，如果使用传统的FCombo组件，则在低端配置的机器或ie6浏览器下会遇到性能问题。使用FComboGrid组件，可以将数据分页展现，解决展现一次性展现大量数据的性能问题。
 */

/**@lends FComboGrid# */
/**
 * 组件的唯一标识。
 * @name FComboGrid#<b>id</b>
 * @type String
 * @default ""
 * @example
 * 无
 */

/**
 * 对应html中的表单元素的name属性。默认值为：""。
 * @name FComboGrid#<b>name</b>
 * @type String
 * @default ""
 * @example
 * 无
 */
/**
 * 按钮的DOM焦点序号即tab键时候得到焦点的序号
 * @name FComboGrid#<b>tabIndex</b>
 * @type String
 * @default null
 * @example
 * 无
 */
/**
 * 设置组件的url，用于AJAX加载数据。
 * @name FComboGrid#dataUrl
 * @type String
 * @default
 * @example
 * 无
 */


(function($, undefined) {
    // 分页栏的html模板
    var pagingBarArr = [];
    pagingBarArr.push('<div class="f-grid-page" id="{id}">');
    pagingBarArr.push('<div class="f-grid-page-bg">');
    pagingBarArr.push('<div style="float:left;">');
    pagingBarArr.push('<table cellspacing="0" cellpadding="0">');
    pagingBarArr.push('<tbody>');
    pagingBarArr.push('<tr>');
    pagingBarArr.push('<td><span id="{id}-page-first" f_grid_page_status="disabled" f_grid_page_type="first" class="f-grid-page-button  f-grid-page-first-disabled"></span></td>');
    pagingBarArr.push('<td><span id="{id}-page-prev" f_grid_page_status="disabled" f_grid_page_type="prev" class="f-grid-page-button  f-grid-page-prev-disabled"></span></td>');
    pagingBarArr.push('<td><span class="f-grid-page-split"></span></td>');
    pagingBarArr.push('<td><span id="{id}-page-beforeText" class="f-grid-page-content">第</span><input id="{id}-page-input" f_grid_page_type="pageIndex" value="0" class="f-grid-page-input"></td>');
    pagingBarArr.push('<td style="padding-left:4px;"><span id="{id}-page-afterText" class="grid-page-content">页 共0页</span></td>');
    pagingBarArr.push('<td><span class="f-grid-page-split"></span></td>');
    pagingBarArr.push('<td><span id="{id}-page-next" f_grid_page_status="disabled" f_grid_page_type="next" class="f-grid-page-button  f-grid-page-next-disabled"></span></td>');
    pagingBarArr.push('<td><span id="{id}-page-last" f_grid_page_status="disabled" f_grid_page_type="last" class="f-grid-page-button f-grid-page-last-disabled"></span></td>');
    pagingBarArr.push('<td><span class="f-grid-page-split"></span></td>');
    pagingBarArr.push('<td><span id="{id}-page-refresh" f_grid_page_status="enable" f_grid_page_type="refresh" class="f-grid-page-button f-grid-page-btn f-grid-page-refresh"></span></td>');
    pagingBarArr.push('</tr>');
    pagingBarArr.push('</tbody>');
    pagingBarArr.push('</table>');
    pagingBarArr.push('</div>');
    pagingBarArr.push('<div style="float:right;">');
    pagingBarArr.push('<table cellspacing="0" cellpadding="0" border="0">');
    pagingBarArr.push('<tbody>');
    pagingBarArr.push('<tr>');
    pagingBarArr.push('<td><span id="${id}-page-totalcount" class="f-total-count"></span></td>');
    pagingBarArr.push('</tr>');
    pagingBarArr.push('</tbody>');
    pagingBarArr.push('</table>');
    pagingBarArr.push('</div>');
    pagingBarArr.push('<div style="clear:both;"></div>');
    pagingBarArr.push('</div>');
    pagingBarArr.push('</div>');
    var pagingBarHtml = pagingBarArr.join('');

    $.widget("FUI.FComboGrid", {
        options:{
            /**
             * 设置组件的输入框是否可编辑，默认为false。即输入框可编辑。当selectable属性设置成false时，该属性设置无效.
             * @name FComboGrid#<b>readonly</b>
             * @type Boolean
             * @default false
             * @example
             * 无
             */
            readonly :false,

            enabled:true ,
            /**
             * 表示组件是否可用 ,false表示组件可用，true表示组件不可用(即在form表单中不能做submit提交)。默认值为false。
             * @name FComboGrid#<b>disabled</b>
             * @type Boolean
             * @default false
             * @example
             * 无
             */
            disabled:false ,
            /**
             * 设置组件是否只读。false表示输入框不可编辑，下拉图片不可点击 。默认值为“true”.该属性不能和readonly属性共用.
             * @name FComboGrid#selectable
             * @type Boolean
             * @default true
             * @example
             * 无
             */
            selectable:true,

            filterDelay:300,

            /**
             * 对应后台服务返回值中的某个字段，该字段对应的值将作为提交值。
             * @name FComboGrid#valueField
             * @type String
             * @default "value"
             * @example
             * 无
             */
            valueField :'value',
            /**
             * 对应后台服务返回值中的某个字段，该字段对应的值将作为显示值。
             * @name FComboGrid#displayField
             * @type String
             * @default "text"
             * @example
             * 无
             */
            displayField : 'text' ,
            /**
             * 组件的宽度
             * @name FComboGrid#width
             * @type String
             * @default "150"
             * @example
             * 无
             */
            width:150 ,
            /**
             * 每页显示数据的条数。默认值为：10。
             * @name FComboGrid#pageSize
             * @type Number
             * @default 10
             * @example
             * 无
             */
            pageSize : 10 ,
            /**
             * 设置组件下拉列表的高度（建议高度不要少于100）。默认值为：200 。该高度不包含表格列头的高度和分页栏的高度。
             * @name FComboGrid#listHeight
             * @type Number
             * @default "200"
             * @example
             * 无
             */
            listHeight :200 ,
            /**
             * true表示输入框中的值必须是下拉列表中的值，false表示允许用户输入不在下拉列表中的值。
             * @name FComboGrid#forceSelection
             * @type Boolean
             * @default
             * @example
             * 无
             */
            forceSelection:false ,
            /**
             * 设置组件下拉列表的宽度。如果不设置该值，下拉列表的宽度默认与输入框的宽度一致（包含下拉图片的宽度）,由于下拉表格包含分页栏，所以该属性最小值为260。
             * @name FComboGrid#listWidth
             * @type Number
             * @default "260"
             * @example
             * 无
             */
            listWidth :260 ,
            /**
             * 设置组件的初始化参数，默认为{}。
             * @name FComboGrid#baseParams
             * @type Object
             * @default   {}
             * @example
             *
             */
            baseParams:{},

            /**
             * 设置点击下拉图标时是否强制重新加载数据，默认值为true。如果设置成true，那么每次点击下拉图标时，都会重新加载数据。
             * @name FComboGrid#forceLoad
             * @type boolean
             * @default   true
             * @example
             *
             */
            forceLoad :true,
            /**
             * 设置组件的过滤字段。默认以valueField属性值当过滤字段。
             * @name FComboGrid#filterField
             * @type string
             * @default
             * @example
             *
             */
            filterField :null ,

            //多选配置属性
            /**
             * 设置组件的是否支持多选。
             * @name FComboGrid#multiSelect
             * @type string
             * @default
             * @example
             *
             */
            multiSelect : false,
            /**
             * comboGrid提供datahandler属性，默认为"inner"，即和现有的实现一致；如果datahandler为"custom"，comboGrid将只提供筛选和选择功能，所有的数据都不会保存，用户需要实现onSelect回调，在选择之后做自己的处理。
             * @name FComboGrid#dataHandler
             * @type string
             * @default
             * @example
             *
             */
            dataHandler : "inner"
        },
        _create : function() {
            var options = this.options,onFilter = options.onFilter,UTILS = window['$Utils'];
            this.isFirstShow = true;
            options.enabled = !options.disabled;
            //获取组件隐藏域的对象
            var element = this.element;
            //获取显示输入框的对象
            this.inputEl = element.next();
            //获取组件按钮的对象
            this.imgEl = this.inputEl.next();
            this.isShow = false;
            this.value = '';
            //如果enabled为true而且可以进行下拉选择，那么绑定输入框，下拉图片的相关事件
            if (options.enabled && options.selectable) {
                //绑定事件
                this._bindEvent();
            }
        },
        //设置list的位置以及展现list列表
        _showList : function() {
            var UTILS = window['$Utils'];
            var listEl = this.listEl;
            var inputEl =  this.inputEl;
            var pos =  UTILS.getAlignXY(inputEl,listEl);
            var top = pos.top ;
            var left = pos.left;
            var gridStyle = listEl.get(0).style;
            gridStyle.left = left + 'px';
            gridStyle.top = top + 'px';
            gridStyle.width = (this._getListWidth() - 2) + 'px';
            gridStyle.display = 'block';
        },
        _show : function(isImgClick, forceLoad, params) {
            var options = this.options,UTILS = window['$Utils'];
            if (isImgClick) {
                $(document).trigger('click.FComboGrid');
            }
            //如果下拉列表已经展现，则不展现
            if (this.isShow !== true) {
                if (this.isLoading) {
                    return;
                }
                var isFirstShow = this.isFirstShow;
                //生成列表
                this._prevShowList();
                //展现列表
                this._showList();
                //绑定click事件
                this._appendEvent();
                this.isShow = true;
            }
            if (isFirstShow || forceLoad) {
                /**
                 * 请求发送之前触发。
                 * @event
                 * @name FComboGrid#onBeforesend
                 * @example
                 */

                //触发onBeforesend事件，可供用户设置组件的参数
                options.onBeforesend && options.onBeforesend();
                var filterKey =  options.filterField || options.valueField;
                var filterValue = params && params[filterKey] || "";
                var p = {};
                //将检索条件存放到grid的参数中
                if(params && filterValue) {
                    p[filterKey] =  filterValue;
                    UTILS.apply(options.baseParams,p);
                    this.listEl.FGrid('setBaseParams', options.baseParams);
                }else {
                    delete options.baseParams[filterKey];
                    this.listEl.FGrid('setBaseParams', options.baseParams);
                }
                //如果首次是通过点击下拉图片来展开列表的，则调用grid的load方法 。
                this.listEl.FGrid('load', params || {});
            }
        },

        /**
         * 重新设置组件的基本参数。返回值： void
         * @name FComboGrid#setBaseParams
         * @function
         * @param params  类型:"object"。
         * @example
         */

        setBaseParams : function(params) {
            if (!params) {
                return;
            }
            this.options.baseParams = params;
            //设置combogrid组件的参数
            this.listEl.FGrid('setBaseParams', params);
        },
        hideList : function() {
            this._hideList();
        },
        _prevShowList : function() {
            var options = this.options;
//            if(options.multiSelect && options.forceLoad){
//                this.setValue("");
//            }
            if (this.isFirstShow) {
                //插入节点
                var gridHtml = [];
                var id = this.element.attr('id');
                var gridId = id + '-combogrid';
                var pagingId = gridId + "-combopage";
                gridHtml.push('<div id="');
                gridHtml.push(gridId);
                gridHtml.push('" class="f-combo-list-container f-grid" style="overflow:hidden; display:none;">');
                gridHtml.push('<div id="' + gridId + '-grid-head" class="f-grid-head" ></div>');
                gridHtml.push('<div id="' + gridId + '-grid-body" class="f-grid-body" ></div>');
                gridHtml.push(pagingBarHtml.replaceAll('{id}', pagingId));
                gridHtml.push('</div>');
                $('body').append(gridHtml.join(''));
                //存放列表外框容器对象，控制列表的高度，滚动条在该对象中出现
                this.listEl = $I(gridId);

                var displayField = options.displayField;
                var valueField = options.valueField;

                var onSelect = options.onSelect;
                delete options.onSelect;

                var generateValue = function(arrayObject, key) {
                    var length = arrayObject.length;
                    var result = ""
                    for (var i = 0; i < length; i++) {
                        if (i == 0) {
                            result += arrayObject[key];
                        } else {
                            result += "," + arrayObject[key];
                        }
                    }
                    return result;
                };


                $I(pagingId).FPagingbar({pageSize : options.pageSize});
                //将事件保存到临时变量，并删除与ComboGrid组件的引用


                var onLoadsuccessFn = options.onLoadsuccess;
                delete options.onLoadsuccess;
                /**
                 * 请求成功时触发
                 * @event
                 * @name FComboGrid#onLoadsuccess
                 * @param data  类型：Array[Object] 。请求返回的数据。
                 * @param textStatus   返回状态
                 * @param jqXHR   XMLHttpRequest对象
                 * @example
                 *
                 */
                var onLoadsuccess = function(data, textStatus, jqXHR) {
                    var gridEl = $I(gridId);
                    var inputEl = $I(id);
                    var value = inputEl.val();
                    var datas = value && value.split(',');
                    gridEl.FGrid('selectRowsBydata', datas, valueField)
                    inputEl = null;
                    gridEl = null;
                    onLoadsuccessFn && onLoadsuccessFn(data, textStatus, jqXHR);
                }
                /**
                 * returnCode为1或者-1的时候时触发，
                 * @event
                 * @name FComboGrid#onLoadfailure
                 * @param data  类型：Array[Object] 。请求返回的数据。
                 * @param textStatus   返回状态
                 * @param jqXHR   XMLHttpRequest对象
                 * @example
                 *
                 */
                var onLoadfailure = options.onLoadfailure;
                delete options.onLoadfailure;
                /**
                 * 请求失败时触发。例如：ajax超时，网络中断。
                 * @event
                 * @name FComboGrid#onError
                 * @param jqXHR      XMLHttpRequest对象
                 * @param textStatus   返回状态
                 * @param  errorThrown  （可能）捕获的错误对象
                 * @example
                 *
                 */
                var onError = options.onError;
                delete options.onError;

                var baseParams = options.baseParams;
                delete options.baseParams;
                options.baseParams = {};

                var gridWidth = this._getListWidth() - 2;
                var listHeight = options.listHeight;
                var dataUrl = options.dataUrl;

                var colModel = options.colModel;
                delete  options.colModel;

                var onRowDeselectFn = onRowSelectFn = onRowClickFn = function() {
                };
                if (options.multiSelect) {
                    onRowSelectFn = function(rowData, rowIndex) {
                        var element = $I(id);
                        var listEl = $I(gridId);
                        /*
                         //获取选中的数据，返回值类型array
                         var selectDatas = listEl.FGrid('getSelectedDatas');
                         //生成显示域的值
                         var displayValue = generateValue(selectDatas, displayField);
                         //生成隐藏域的值
                         var value = generateValue(selectDatas, valueField);
                         */
                        var displayValue = rowData[displayField];
                        var value = rowData[valueField];
                        var oldValue = element.val();
                        var oldDisplayValue = element.next().val();

                        if (oldDisplayValue) {
                            displayValue = oldDisplayValue + "," + displayValue
                        }
                        if (oldValue) {
                            value = oldValue + "," + value;
                        }

                        element.val(value);
                        element.next().val(displayValue);
                        element.FComboGrid('setDisplayValue', displayValue);
                        /**
                         * 选中下拉表格列中的一条记录时触发该事件。事件参数: record : object 被选中的记录的数据对象，value：string 隐藏域的值  ，displayValue：string 显示域的值
                         * @event
                         * @name FComboGrid#onSelect
                         * @param record 类型："Object"
                         * @param value 类型："String"
                         * @param displayValue 类型："String"
                         * @example
                         */
                        onSelect && onSelect(rowData, value, displayValue);
                    };

                    onRowDeselectFn = function(rowData, rowIndex) {
                        var element = $I(id);
                        var listEl = $I(gridId);
                        /*
                         //获取选中的数据，返回值类型array
                         var selectDatas = listEl.FGrid('getSelectedDatas');
                         //生成显示域的值
                         var displayValue = generateValue(selectDatas, displayField);
                         //生成隐藏域的值
                         var value = generateValue(selectDatas, valueField);
                         */
                        var displayValue = rowData[displayField];
                        var value = rowData[valueField];
                        var oldValue = element.val();
                        var oldDisplayValue = element.next().val();

                        if (oldDisplayValue) {
                            var displayValueArray = oldDisplayValue.split(",");
                            var length = displayValueArray.length;
                            var result = [];
                            for (var i = 0; i < length; i++) {
                                var temp = displayValueArray[i];
                                if (temp !== displayValue) {
                                    result.push(temp);
                                }
                            }
                            displayValue = result.join(",");
                        }
                        if (oldValue) {
                            var valueArray = oldValue.split(",");
                            var length = valueArray.length;
                            var result = [];
                            for (var i = 0; i < length; i++) {
                                var temp = valueArray[i];
                                if (temp !== value) {
                                    result.push(temp);
                                }
                            }
                            value = result.join(",");
                        }
                        
                        element.val(value);
                        element.next().val(displayValue);
                        element.FComboGrid('setDisplayValue', displayValue);
                        /**
                         * 选中下拉表格列中的一条记录时触发该事件。事件参数: record : object 被选中的记录的数据对象，value：string 隐藏域的值  ，displayValue：string 显示域的值
                         * @event
                         * @name FComboGrid#onSelect
                         * @param record 类型："Object"
                         * @param value 类型："String"
                         * @param displayValue 类型："String"
                         * @example
                         */
                        onSelect && onSelect(rowData, value, displayValue);
                    };


                    var uniqueKeyFn = function(dataCache) {
                        return dataCache[valueField] + dataCache[displayField];
                    };

                    //初始化grid组件
                    this.listEl.FGrid({
                        width:gridWidth,
                        height: listHeight,
                        dataUrl:dataUrl,
                        selectModel:"multiSelect",
                        crossPageSelect:true,
                        uniqueKey:uniqueKeyFn,
                        /**
                         * 配置下拉表格列中表格的列信息。例如:[{title:'标题1',dataIndex:'name' ,width:100},{title:'标题2',dataIndex:'age',width:100}]
                         * @name FComboGrid#colModel
                         * @type Array
                         * @default
                         * @example
                         * 无
                         */
                        colModel : colModel ,
                        pagingbarId :pagingId,
                        onRowDeselect :onRowDeselectFn,
                        onRowSelect : onRowSelectFn,
                        autoload :false,
                        onLoadError:onError,
                        onLoadfailure:onLoadfailure,
                        onLoadsuccess: onLoadsuccess,
                        baseParams : baseParams
                    });
                    // 需求5776，隐藏掉全选复选框
                    $("#"+this.listEl.attr("id")+"-head-table button", this.listEl).css({
                    	visibility: "hidden"
                    });

                } else {
                    onRowClickFn = function(rowData, rowIndex) {
                        var element = $I(id);
                        //准备值
                        var displayValue = rowData[displayField];
                        var value = rowData[valueField];
                        element.val(value);
                        element.next().val(displayValue);
                        element.FComboGrid('setDisplayValue', displayValue);
                        element.FComboGrid('hideList');
                        /**
                         * 选中下拉表格列中的一条记录时触发该事件。事件参数: record : object 被选中的记录的数据对象，value：string 隐藏域的值  ，displayValue：string 显示域的值
                         * @event
                         * @name FComboGrid#onSelect
                         * @param record 类型："Object"
                         * @param value 类型："String"
                         * @param displayValue 类型："String"
                         * @example
                         */
                        onSelect && onSelect(rowData, value, displayValue);
                    };
                    //初始化grid组件
                    this.listEl.FGrid({
                        width:gridWidth,
                        height: listHeight,
                        dataUrl:dataUrl,
                        /**
                         * 配置下拉表格列中表格的列信息。例如:[{title:'标题1',dataIndex:'name' ,width:100},{title:'标题2',dataIndex:'age',width:100}]
                         * @name FComboGrid#colModel
                         * @type Array
                         * @default
                         * @example
                         * 无
                         */
                        colModel : colModel ,
                        pagingbarId :pagingId,
                        onRowClick : onRowClickFn,
                        autoload :false,
                        onLoadError:onError,
                        onLoadfailure:onLoadfailure,
                        onLoadsuccess: onLoadsuccess,
                        baseParams : baseParams
                    });
                }

                this.isFirstShow = false;
                var listEvent = this._getEvent('list');
                this.listEl.bind(listEvent);
            }
        },
        _bindEvent : function() {
            var imgEvent = this._getEvent('img');
            this.imgEl.bind(imgEvent);
            var inputEvent = this._getEvent('input');
            this.inputEl.bind(inputEvent);
            if (!this.isFirstShow) {
                var listEvent = this._getEvent('list');
                this.listEl && this.listEl.bind(listEvent);
            }
        },
        _getEvent :function(type) {
            var ME = this,options = ME.options,element = this.element,inputEl = this.inputEl,UTILS = window["$Utils"],multiSeparator = options.multiSeparator,DOC = document;
            var showList = function() {
                if (ME.isShow) {
                    ME._hideList();
                } else {
                    //如果没有生成下拉列表则先生成下拉列，然后展现下拉列表
                    ME.inputEl.focus();
                    ME._show(true, options.forceLoad);
                    ME.inputEl.get(0).select();
                }
            };
            var imgEvent = {
                click : function(e) {
                    showList();
                    UTILS.stopPropagation(e);
                }
            }
            if (type == 'img') return imgEvent;


            var filter = function() {
                if (this.handler) {
                    clearTimeout(this.handler);
                }
                var options = this.options;
                var newValue = this.inputEl.val();
                var params = {};
                //将输入框中的数据当成参数，传入到grid中，并进行数据加载。
                params[options.filterField || options.valueField] = newValue;
                this._show(false, true, params);
                options = null;
            };
            var filterProxy = $.proxy(filter, ME);
            var filterFn = function() {
                if (ME.handler) {
                    clearTimeout(ME.handler);
                }
                ME.handler = setTimeout(filterProxy, ME.options.filterDelay);
            }
            var inputEvent = {
                mousedown : function(e) {
                    if (options.forceSelection) {
                        showList();
                    }
                },
                keyup: function(e) {
                    var keyCode = e.keyCode;
                    if ($.browser.mozilla && keyCode !== 38 && keyCode !== 40 && keyCode !== 13 && keyCode !== 33 && keyCode !== 34) {
                        filterFn();
                    }
                },
                keydown:function(e) {
                    var keyCode = e.keyCode;
                    if (keyCode === 38) {
                    } else if (keyCode === 40) {
                        //↓
                        if (ME.isShow) {
                            //如果列表以及展现，则往下滚;
                        } else {
                            //展现下拉列表
                            ME._show(false, options.forceLoad);
                        }
                    } else if (keyCode === 13) {
                        //enter 回车
                        if (ME.isShow) {

                        }
                    } else if (keyCode === 33) {
                        //page up  往上翻页

                    } else if (keyCode == 34) {
                        //page down   往下翻页
                    } else if(keyCode == 9) {
                        //tab 键 丢失焦点
                        $(DOC).trigger('click.FComboGrid');
                    } else {
                        //其他key值，用于筛选
                        if (!options.readonly && !$.browser.mozilla) {
                            filterFn();
                        }
                    }
                    UTILS.stopPropagation(e);
                }
            };
            if (type == 'input') return inputEvent;

            var listEvent = {
                click:function(e) {
                    ME.inputEl.focus();
                    e.stopImmediatePropagation();
                }
            }
            if (type == 'list') return listEvent;
        },
        //private 获取下拉列表的宽度
        _getListWidth : function() {
            var inputEl = this.inputEl;
            var imgEl = this.imgEl;
            var options = this.options;
            var listWidth = options.listWidth;
            if (listWidth && listWidth < 260) {
                options.listWidth = listWidth = 260;
            }
            var inputWidth = inputEl.outerWidth() + imgEl.outerWidth();
            var liWidth = listWidth ? listWidth : inputWidth;

            return liWidth;
        },
        //document添加click事件，用于隐藏下拉列表
        _appendEvent : function() {
            var ME = this,UTILS = window['$Utils'];
            var stop = function(e) {
                UTILS.stopPropagation(e);
            }
            var click = function() {
                ME._hideList();
                ME._resetValueOnBlur();
                ME.inputEl.unbind('click.FComboGrid', stop);
                $(document).unbind('click.FComboGrid');
            }
            $(document).one('click.FComboGrid', click);
            ME.inputEl.bind('click.FComboGrid', stop);
        },
        setDisplayValue : function(displayValue) {
            this.displayValue = displayValue;
        },
        //隐藏下拉列表时，清楚输入框中有不合法的内容
        _resetValueOnBlur  : function() {
            var value = this.inputEl.val();
            if (!value) {
                this.element.val('');
                this.inputEl.val('');
            } else {
                var displayValue = this.displayValue;
                this.inputEl.val(displayValue);
            }
        },
        _hideList : function() {
            if (this.isShow === true) {
                this.listEl.hide();
                this.isShow = false;
                if (this.options.dataHandler && this.options.dataHandler !== "inner") {
                	this.reset();
                }
            }
        },
        //销毁组件对象
        destroy : function() {
            this.inputEl.unbind();
            if (this.listEl) {
	            // add by hanyin 20130509 移除与之关联的grid的dom，防止通过js删除comboGrid造成dom泄漏
	            this.listEl.remove();
	            // end add by hanyin
	            //this.listEl.FGrid('destroy');
	            //this.listEl.unbind();
            }
            this.imgEl.unbind();
            $(document).unbind('click.FComboGrid');
            this.inputEl = null;
            this.listEl = null;
            this.imgEl = null;
            $.Widget.prototype.destroy.call(this);
        },
        /**
         * 判断组件下拉图片是否可点击 参数： 无 返回值： Boolean
         * @name FComboGrid#isSelectable
         * @function
         * @return Boolean
         * @example
         */
        isSelectable : function() {
            return this.options.selectable;
        },
        /**
         * 设置输入框是否可编辑，下拉图片是否可点击。selectable默认为true。setSelectable为false时，输入框不可编辑且下拉图片不可点击。参数： selectable : Boolean 返回值： void
         * @name FComboGrid#setSelectable
         * @function
         * @param selectable  类型:"Boolean"。
         * @example
         */
        setSelectable : function(selectable) {
            var ME = this,UTILS = window['$Utils'];
            if (ME.options.selectable === selectable) {
                return;
            }
            if (true === selectable) {
                var parentEl = ME.inputEl.parent();
                if (parentEl.length > 0) {
                    ME.inputEl.removeAttr('readonly');
                    ME.options.selectable = selectable;
                    UTILS.removeClass(parentEl.get(0), 'f-combo-selectable');
                    ME._bindEvent();
                }
            } else if (false === selectable) {
                var parentEl = ME.inputEl.parent();
                if (parentEl.length > 0) {
                    ME.inputEl.attr('readonly', 'readonly');
                    ME.options.selectable = selectable;
                    UTILS.addClass(parentEl.get(0), 'f-combo-selectable');

                    ME._unbindEvent();

                }
            }
        },
        /**
         * 返回组件是否无效。返回值为false，表示该组件有效。若返回值为true，表示该组件无效。 参数： 无 返回值: Boolean 组件是否无效
         * @name FComboGrid#isDisabled
         * @function
         * @return Boolean
         * @example
         */
        isDisabled : function() {
            return !this.options.enabled;
        },
        /**
         * 使用布尔值设置组件有效或无效。 参数： disabled ：Boolean false表示设置组件有效。true表示设置组件无效。 返回值: void
         * @name FComboGrid#setDisabled
         * @function
         * @param disabled  类型:"Boolean"。
         * @example
         */
        setDisabled : function(disabled) {
            var UTILS = window['$Utils'],ME = this;
            if (ME.options.enabled === !disabled) {
                return;
            }
            if (false === disabled) {
                var parent = this.element.parent();
                if (parent.length > 0) {
                    UTILS.removeClass(parent.get(0), 'f-combo-disable');
                    ME.element.removeAttr('disabled');
                    ME.inputEl.removeAttr('disabled');
                    ME.options.enabled = true;
                    ME._bindEvent();
                }
            } else if (true === disabled) {
                var parent = this.element.parent();
                if (parent.length > 0) {
                    UTILS.addClass(parent.get(0), 'f-combo-disable');
                    ME.element.attr('disabled', '');
                    ME.inputEl.attr('disabled', '');
                    ME.options.enabled = false;
                    ME._unbindEvent();
                }
            }
        },
        /**
         * 获取输入框的值。
         * @name FComboGrid#getValue
         * @function
         * @return String
         * @example
         */
        getValue :function() {
            return this.element.val();
        },
        /** 设置组件的值。如果用户没传第二个参数，那么显示域和隐藏域都设置成第一个参数的值。
         * @name FComboGrid#setValue
         * @function
         * @param value 隐藏域的值
         * @param displayValue （可选）显示域的值
         * @return String
         * @example
         */
        setValue : function(value, displayValue) {
            //如果该组件没有加载
            if ('' == value) {
                this.element.val('');
                this.inputEl.val('');
            } else {
                this.element.val(value);
                if (displayValue) {
                    this.inputEl.val(displayValue);
                    this.displayValue = displayValue;
                } else {
                    this.inputEl.val(value);
                    this.displayValue = value;
                }

            }
        },
        /**
         * 重置表单域的值为空，如果存在隐藏域，隐藏域也会被清空。但是不会去除表单域的校验信息，如果需要去除表单域的校验信息，请调用FForm的reset方法。
         * @name FComboGrid#reset
         * @function
         * @return void
         * @example
         */
        reset : function() {
            this.setValue('');
        },
        /**
         * 判断组件是否可编辑 参数： 无 返回值： Boolean
         * @name FComboGrid#isReadonly
         * @function
         * @return Boolean
         * @example
         */
        isReadonly : function() {
            return this.options.readonly;
        },
        /**
         * 设置组件是否可编辑 参数： readonly 。 返回值： void
         * @name FComboGrid#setReadonly
         * @function
         * @param readonly  类型:"Boolean"。
         * @example
         */
        setReadonly : function(readonly) {
            var ME = this , options = ME.options,UTILS = window['$Utils'];
            if (options.readonly === readonly) {
                return;
            }
            if (true == readonly) {
                var parentEl = ME.inputEl.parent();
                if (parentEl.length > 0) {
                    options.readonly = readonly;
                    ME.inputEl.attr('readonly', 'readonly');
                    UTILS.addClass(parentEl.get(0), 'f-combo-readonly');
                }
            } else if (false == readonly) {
                var parentEl = ME.inputEl.parent();
                if (parentEl.length > 0) {
                    options.readonly = readonly;
                    ME.inputEl.removeAttr('readonly');
                    UTILS.removeClass(parentEl.get(0), 'f-combo-readonly');
                }
            }
        },
        //解除绑定的事件
        _unbindEvent : function() {
            this.imgEl.unbind();
            this.inputEl.unbind();
            this.listEl && this.listEl.unbind();
            $(document).unbind('click.FCombo');
        }
    });

})(jQuery);
