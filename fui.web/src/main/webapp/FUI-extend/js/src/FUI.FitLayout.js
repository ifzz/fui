/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.FitLayout.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FFitLayout组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员        修改说明
 * 20121022	    hanyin			支持可扩展的组件自适应
 * 2013-03-07   qudc            修改resize事件，延迟200毫秒计算布局。
 */

/**
 * @name FFitLayout
 * @class <b>适配布局容器</b><br/><br/>
 * <b>使用场景：</b><br/>
 * <ol>
 * 使用fit布局，让组件或者DIV自适应其父容器。值适合panel、grid、tree组件.
 * </ol>
 * <b>功能描述：</b><br/>
 * <ol>
 *      <li>
 *      </li>
 *
 * </ol>
 *
 * <b>示例：</b><br/>
 * <pre>
 * 无
 * </pre>
 *
 *
 */

/**
 * 需要自适应的HTML元素的的ID。<br/>
 * 需要保证此元素的父亲只有它一个子元素，否则会造成元素显示异常。
 * 可以通过设置FitLayout组件的parentId来指定父元素，否则FitLayout会自动去采用jquery的parent()方法来查找父亲元素。
 * @name FFitLayout#forId
 * @type String
 * @default 无
 * @example
 * 无
 *
 */

/**
 * 要自适应的元素的父元素ID。<br/>
 * 此值并非必须项：如果没有设置此值，FitLayout组件将会通过jquery的parent()方法来查找父元素。当然，使用parent()方法定位元素远没有通过指定ID来定位元素快，特别是在页面较为复杂的情况下。<br/>
 * 另外，如果想要占满整个窗口，则需要设置parentId为"window"。
 * @name FFitLayout#parentId
 * @type String
 * @default null
 * @example
 * 无
 */

/**@lends FFitLayout# */
(function($, undefined) {
	$Utils["FFitLayout"] = function(options) {
        /**
         * 根据父节点的高宽，重置子容器对象的高宽，如果是fpanel、fgrid、ftree等则调用各组件的setSize方法；否则直接设置元素的高宽值
         * @param $parent 父亲元素的jquery对象
         * @param $subWidget 要自适应元素的jquery对象
         * @param type 自适应元素的类型
         */
		this._resizeSubWidget = function($parent, $subWidget, type) {
            if (!$parent) {
                return;
            }
            var w = $parent.width();
            var h = $parent.height();
            var result = $Component.tryCall($subWidget, "setSize", w, h);
    		if (!result.hasFunc) {
    			$subWidget.width(w);
    			$subWidget.height(h);
    		}
        }

		options = options || {};
		// 本元素的Id
    	var forId =  options.forId || "";
    	// 父亲元素的Id
    	var parentId = options.parentId || "";
    	
    	if (forId == null || forId.length == 0) {
    		return;
    	}
        // 缓存jQuery对象：elment
        var selfEl = $I(forId);
        // 缓存jQuery对象：parentElement
        var parentEl = null;
        // 如果没有指定父元素的ID，则使用jquery的parent()方法定位元素
        if (parentId == null || parentId.length == 0) {
    		parentEl = selfEl.parent();
    	} else {
            if (parentId === "window") {
            	parentEl = $(window);
            } else {
	    		parentEl = $I(parentId);
	    		if (parentEl.size() == 0) {
	    			parentEl = selfEl.parent();
	    		}
	    	}
    	}

        //根据传入的jquery对象，返回組件的類型，只能识别以下组件：fpanel，fgrid，ftree
    	var subWidgetType = function(widget, op) {
            var type = widget.data("ftype");
            return type;
        }(selfEl, options);
        
        // 绑定resize事件
        var ME = this;
        var resizeSubWidgetProxy = $.proxy(ME, "_resizeSubWidget", parentEl, selfEl, subWidgetType);

        var resizeFn = function() {
            if (ME.handler) {
                clearTimeout(ME.handler);
            }
            ME.handler = setTimeout(resizeSubWidgetProxy, 200);
        }
        $(window).bind('resize', resizeFn);
        //$(window).bind('resize', resizeSubWidgetProxy);
        // 在父容器上绑定onResize事件，用于一些复杂的嵌套模型
        //parentEl.bind("onResize", resizeSubWidgetProxy);
        // 主动触发一次执行
        this._resizeSubWidget(parentEl, selfEl, subWidgetType);
	};
})(jQuery);

	