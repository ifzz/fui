/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Cookie.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FCookie组件,提供往cookie设置值和获取值的API。
 * 修改记录:
 * 修改日期      修改人员                     修改说明
 */

/**
 * @name FCookie
 * @class <b>Cookie组件</b><br/>
 * 在界面上，需要使用cookie进行一些记忆操作时，可以通过该类进行处理
 */
/**@lends FCookie# */

(function($, undefined) {
    $.FUI.FCookie = {
        /**
         * 在cookie中设置对应的值
         * @function
         * @name FCookie#setCookie
         * @param name 键值
         * @param value 值
         * @param options 配置对象，可选。结构：{
         *     <br/>expires：过期时间 ，可以是具体的数字，单位为毫秒，用于设置多少毫秒后cookie失效。也可以是Date对象，设置cookie过期的时间
         *   <br/>path:String类型 指定创建这个cookie的页面路径，默认为创建的那个页面
         *   <br/>domain: String类型 域名
         *   <br/>secure：是否要求安全模式来访问。比如使用https访问
         *
         * }
         * @example
         * $.FUI.FCookie.setCookie('FUI_THEME_NAME','the_value',
         * {'the_cookie', 'the_value', {expires: 7,
         * path: '/', domain: 'jquery.com', secure: true});
         */
        setCookie : function(name, value, options) {
            if (this._isSupportCookie()) {
                if (typeof (name) != 'string' || $.trim(name) === "") {
                    return;
                }
                var valueType = typeof (value);
                if (valueType == 'undefined') {
                    return;
                } else if (valueType == "object") {
                    //todo json对象转成string对象
                }
                options = options || {};
                var expires = options.expires || '';
                if (expires && (typeof expires == 'number' || expires.toGMTString)) {
                    var date;
                    if (typeof expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + expires);
                    } else {
                        date = expires;
                    }
                    expires = '; expires=' + date.toGMTString();
                }
                //path属性如果是string类型，则去空格。
                var path = options.path || '';
                if (path && typeof(path) == 'string') {
                    path = $.trim(path);
                    path = path ? '; path=' + trimPath : '';
                }
                //domain属性如果是string类型，则去空格。
                var domain = options.domain || '';
                if (domain && typeof(domain) == 'string') {
                    domain = $.trim(domain);
                    domain = domain ? '; domain=' + domain : '';
                }
                //secure属性如果是string类型，则去空格。
                var secure = options.secure || '';
                if (secure && typeof(secure) == 'string') {
                    secure = $.trim(secure);
                    secure = secure ? '; secure=' + secure : '';
                }
                //将数据写入到cookie中
                document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            } else {
                //todo debug模式下，提示不支持cookie
            }
        },

        /**
         * 读取cookie中指定name值所对应的值
         * @name FCookie#getCookie
         * @function
         * @param name 键值
         * @example
         * $.FUI.FCooie.getCookie('FUI_THEME_NAME');
         */
        getCookie : function(name) {
            var cookieValue = null;
            if (this._isSupportCookie()) {
                var cookies = document.cookie.split(';');
                var len = cookies.length;
                var nameLength = name.length;
                for (var i = len; i--;) {
                    var cookie = $.trim(cookies[i]);
                    if (cookie.substring(0, nameLength + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(nameLength + 1));
                        break;
                    }
                }
                //todo 如果存放的是json字符串，则需要转成json对象。
                return cookieValue;
            } else {
                //todo debug模式下，提示不支持cookie
            }
        }
        ,
        /**
         * 删除cookie中指定的值
         * @name FCookie#deleteCookie
         * @function
         * @param name 键值
         * @example
         * $.FUI.FCooie.deleteCookie('FUI_THEME_NAME');
         */
        deleteCookie : function(name) {
            if (this._isSupportCookie()) {
                var cookieValue =  this.getCookie(name) ;
                if (cookieValue !== null) {
                    var date =  new Date();
                    //设置过期时间
                    date.setTime(date.getTime()-1000);
                    //document.cookie = name + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
                    document.cookie = name + "=" + "; expires="+date.toGMTString();
                }
            }
        },
        /**
         * private  私有方法，用于判断浏览器是否支持cookie
         */
        _isSupportCookie :function() {
            if (document.cookie && document.cookie != '' && navigator.cookieEnabled) {
                return true;
            } else {
                return false;
            }
        }
    }
})(jQuery);