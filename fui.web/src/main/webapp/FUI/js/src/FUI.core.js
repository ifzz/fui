(function($, undefined) {

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
    $.FUI = $.FUI || {};
    if ($.FUI.version) {
        return;
    }
    $.extend($.FUI, {
        version: "FVersion@",

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
