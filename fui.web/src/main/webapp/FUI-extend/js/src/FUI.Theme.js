/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Theme.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FTheme组件,提供设置切换css样式的API，用于实现切换皮肤功能。
 * 修改记录:
 * 修改日期      修改人员                     修改说明
 */

/**
 * @_name FTheme
 * @_class <b>皮肤组件</b><br/>
 * 提供FUI皮肤切换的基本API。
 */

/**@_lends FTheme# */


(function($, undefined) {

    $.FUI.FTheme = {
        /**
         * 设置当前皮肤
         * @name FTheme#setTheme
         * @function
         * @param id  link标签的id
         * @param path  样式文件的路径
         * @example
         * $.FUI.FTheme.setTheme('themeStyle',"/FUI/css/red.css");
         */
        setTheme: function(id, path) {
            var UTILS = window['$Utils'];
            if (!id || !path || $.type(id) !== "string" || $.type(path) !== "string") {
                return;
            }
            id = $.trim(id);
            path = $.trim(path);
            if (path.indexOf("/") !== 0) {
                path = UTILS.getContextPath()+'/'+ path;
            }
            var linkEl = $("link[id='" + id + "']");
            var oldPath = $.trim(linkEl.attr("href"));
            if (oldPath == path) {
                return;
            } else {
                linkEl.attr("href", path);
            }
        },
        /**
         * 获得当前皮肤
         * @name FTheme#getTheme
         * @function
         * @param id  link标签的id
         * @return 皮肤样式的路径
         * @type String
         * @example
         * var FThemePath=$.FUI.FTheme.getTheme("themeStyle");
         */
        getTheme:function(id) {
            if (!id || $.type($.trim(id)) !== "string") {
                return "";
            }
            var linkEl = $("link[id='" + id + "']");
            var path = $.trim(linkEl.attr("href"));
            return path;
        }

    }
})(jQuery);


