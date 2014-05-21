/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.BorderLayout.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FBorderLayout组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员      修改说明
 * 2013-1-14     qudc         修改_resizeSubWidget方法，注释掉对toolbar组件高度计算的代码。
 * 2013-1-14     qudc         修改_calculateRegion方法，调用northEl、southEl、westEl、eastEl、centerEl的方法时，对这些变量进行判断，放置用户没有配置，导致js执行报错
 * 2013-1-18     qudc         修改_resizeSubWidget方法，新增对faccordion组件的自适应功能
 * 2013-1-18     qudc         修改_resizeSubWidget方法，新增对tabs组件的自适应功能
 * 2013-1-31     qudc         修复bug：4641，即_resizeSubWidget方法对tabs组件的自适应无效的问题
 * 2013-02-19    qudc         修复需求：5020  修改方法_calculateRegion，解决FF下body绑定border布局，在缩小窗口的时候，下方右边出现空白条的问题。
 * 2013-03-09    qudc         修改如果body绑定borderlayout布局，在浏览器模式为IE8兼容性视图，文本模式为IE7标准的下，以iframe加载工作流页面会出现页面跳转的问题。
 *                            解决方法：如果是ie6 ie7 浏览器，将原先加在body上的样式f-mask-scroll-hide，加在html上。
 * 2013-03-09    qudc         修改代码，如果body元素绑定borderlayout布局，对于原先添加的样式f-mask-scroll-hide不做清理。防止不停的重绘回流。
 * 2013-03-07    qudc         修复需求：6588  修改_bindEvent方法，resiz延时执行
 */

/**
 * @name FBorderLayout
 * @class <b>边框布局容器</b><br/><br/>
 * <img src="../resource/images/borderlayout.png"/> <br/>
 * <b>使用场景：</b><br/>
 * <ol>
 * 用户希望以上下左右中的方式来排版页面时，采用FBorderLayout布局来实现。
 * </ol>
 * <b>功能描述：</b><br/>
 * <ol>
 *      <li>容器可以分成五个区域(north,south,west,center,east)。FBorderLayout布局中center区域必须有东西。</li>
 *      <li>左边(west)和右边(east)的面板还可设置expandToTop或者expandToBottom属性分别拉伸面板至顶部或底部。expandToTop和expandToBottom属性的默认值为false</li>
 *      <li>示例中的容器为页面的body元素，FBorderLayout布局的容器可以为div元素。使用方式详见示例</li>
 * </ol>
 * <b>示例：</b><br/>
 * <pre>
 *  &lt;div id="west"&gt;
 *      &lt;f:panel  title="Panel-west" &gt;&lt;/f:panel&gt ;
 *  &lt;/div&gt;
 *  &lt;div id="north"&gt;
 *      &lt;f:panel  title="Panel-north" &gt;&lt;/f:panel&gt;
 *  &lt;/div&gt;
 *  &lt;div id="east"&gt;
 *      &lt;f:panel  title="Panel-east"   &gt;&lt;/f:panel&gt;
 *  &lt;/div&gt;
 *  &lt;div id="south"&gt;
 *      &lt;f:panel  title="Panel-south" &gt;&lt;/f:panel&gt;
 *  &lt;/div&gt;
 *  &lt;div id="center"&gt;
 *      &lt;f:panel id="center11" title="Panel-center" &gt;&lt;/f:panel&gt;
 *  &lt;/div&gt;
 * &lt;script type="text/javascript" &gt;
 * $(document).ready(function() {
 *  $("body").FBorderLayout({
 *          west:{
 *               id:"west",
 *               width:200,
 *               expandToTop:true,
 *               expandToBottom:false
 *           },
 *          north:{
 *               id:"north",
 *               height:100
 *           },
 *           east:{
 *               id:"east",
 *               width:300,
 *               expandToTop:false,
 *               expandToBottom:false
 *           },
 *           south:{
 *               id:"south",
 *               height:150
 *           },
 *           center:{
 *               id:"center"
 *           }
 *       });
 * });
 *  &lt;/script &gt;
 * </pre>
 *
 *
 */

(function($, undefined) {

    $.widget("FUI.FBorderLayout", {
        options:{


        },
        //创建方法,准备组件的变量。
        _create :function() {
            var options = this.options;
            /**
             * 设定west区域的一些属性。参数：id，类型：string。参数：width(用于设置宽度)，类型：number。参数：expandToTop(是否延伸到顶部)，类型：boolean,默认值为：false。参数：expandToBottom(是否延伸到底部)，类型：boolean,默认值为：false。
             * @name FBorderLayout#west
             * @type object
             * @default ""
             * @example
             * west:{
             *      id:"east",
             *      width:200,
             *      expandToTop:true,
             *      expandToBottom:false
             *  }
             */
            var westOptions = options.west;
            /**
             * 设定east区域的一些属性。参数：id，类型：string。 参数：width(用于设置宽度)，类型：number。参数：expandToTop(是否延伸到顶部)，类型：boolean,默认值为：false。参数：expandToBottom(是否延伸到底部)，类型：boolean,默认值为：false。
             * @name FBorderLayout#east
             * @type object
             * @default ""
             * @example
             *  east:{
             *      id:"east",
             *      width:300,
             *      expandToTop:false,
             *      expandToBottom:false
             *  }
             */
            var eastOptions = options.east;
            /**
             * 设定north区域的一些属性。参数：id，类型：string。 参数：height(用于设置宽度)，类型：number。
             * @name FBorderLayout#north
             * @type object
             * @default ""
             * @example
             * north :{
             *     id:"north",
             *     height:200
             * }
             */
            var northOptions = options.north;
            /**
             * 设定south区域的一些属性。参数：id，类型：string。 参数：height(用于设置宽度)，类型：number。
             * @name FBorderLayout#south
             * @type object
             * @default ""
             * @example
             *  south:{
             *      id:"south",
             *      height:150
             *   }
             */
            var southOptions = options.south;
            /**
             * 设定center区域的一些属性，center区域必须存在。参数：id，类型：string。
             * @name FBorderLayout#center
             * @type object
             * @default ""
             * @example
             * center : {
             *     id:'center'
             * }
             */
            var centerOptions = options.center;
            this.northEl = false;
            this.southEl = false;
            this.westEl = false;
            this.eastEl = false;
            this.centerEl = false;

            var UTILS = $Utils;

            //查找center区域的对象
            if (centerOptions) {
                var id = centerOptions.id;
                var centerEl = this.centerEl = this.element.find(">#" + id);
                if (centerEl.size() > 0) {
                    UTILS.addClass(centerEl.get(0), 'f-borderlayout-position')
                }
            }
            //查找north区域的对象
            if (northOptions) {
                var id = northOptions.id;
                var northEl = this.northEl = this.element.find(">#" + id);
                if (northEl.size() > 0) {
                    UTILS.addClass(northEl.get(0), 'f-borderlayout-position')
                }
            }
            //查找south区域的对象
            if (southOptions) {
                var id = southOptions.id;
                var southEl = this.southEl = this.element.find(">#" + id);
                if (southEl.size() > 0) {
                    UTILS.addClass(southEl.get(0), 'f-borderlayout-position')
                }
            }
            //查找west区域的对象
            if (westOptions) {
                var id = westOptions.id;
                var westEl = this.westEl = this.element.find(">#" + id);
                if (westEl.size() > 0) {
                    UTILS.addClass(westEl.get(0), 'f-borderlayout-position')
                }
            }
            //查找east区域的对象
            if (eastOptions) {
                var id = eastOptions.id;
                var eastEl = this.eastEl = this.element.find(">#" + id);
                if (eastEl.size() > 0) {
                    UTILS.addClass(eastEl.get(0), 'f-borderlayout-position')
                }
            }
            this._bindEvent();
        },
        _init : function() {
            // 计算每个区域的宽高
            this._calculateRegion(true);
        },
        /**
         *
         */
        _calculateRegion : function(init) {
            // 需要考虑两种情况 ： 一种是布局不允许拖放，一种是布局允许拖放
            var UTILS = window['$Utils'];
            var options = this.options;
            var westOptions = options.west;
            var eastOptions = options.east;
            var northOptions = options.north;
            var southOptions = options.south;
            var centerOptions = options.center;
            var EL = this.element;
            var centerEl = this.centerEl;
            var northEl = this.northEl;
            var southEl = this.southEl;
            var westEl = this.westEl;
            var eastEl = this.eastEl;
            //用于保存body元素原先是否有f-mask-scroll-hide样式，因为可能mask组件会自动添加该样式。
            var hasClass = false;
            //如果父类是body，且body没有设置样式f-mask-scroll-hide，那么在计算布局的时候添加样式f-mask-scroll-hide，不出现滚动条，排除滚动条对计算高宽的影响。
            if (EL.is('body')) {
                if($.browser.msie && ($.browser.version =='6.0' || $.browser.version =='7.0')) {
                    var htmlEl = EL.parent();
                    hasClass = htmlEl.hasClass('f-mask-scroll-hide');
                    if (!hasClass) {
                        UTILS.addClass(htmlEl.get(0), 'f-mask-scroll-hide');
                    }
                } else {
                    hasClass = EL.hasClass('f-mask-scroll-hide');
                    if (!hasClass) {
                        UTILS.addClass(EL.get(0), 'f-mask-scroll-hide');
                    }
                }
            }
            var parentWidth = EL.width();
            var parentHeight = EL.height();
            //如果父类是body，且body没有设置样式f-mask-scroll-hide，移除添加的样式。
            //if (EL.is('body') && !hasClass) {
            //    UTILS.removeClass(EL.get(0), 'f-mask-scroll-hide');
            //}
            /* delete  by qudc  2013-02-19  删除以下代码，以下代码是解决FF下，body元素绑定border布局，
             当窗口缩小的时候，会出现滚动条，计算出来的高宽不包含滚动条的宽度，导致最后下方右方出现空白条
             if ($.browser.mozilla) {
             var documentEl = $(document);
             var documentWidth = documentEl.width();
             var documentHeight = documentEl.height();
             parentWidth = (parentWidth < documentWidth) ? parentWidth + 17 : parentWidth;
             parentHeight = (parentHeight < documentHeight) ? parentHeight + 17 : parentHeight;
             }
             */
            var centerWidth,centerHeight,
                    northWidth,northHeight,
                    southWidth,southHeight,
                    westWidth,westHeight,
                    eastWidth,eastHeight;

            // 计算每个区域的高宽
            if (init) {
                northHeight = parseInt(northOptions ? (northOptions.height || 0) : 0);
                southHeight = parseInt(southOptions ? (southOptions.height || 0) : 0);

                westWidth = parseInt(westOptions ? (westOptions.width || 0) : 0);
                eastWidth = parseInt(eastOptions ? (eastOptions.width || 0) : 0);

                centerWidth = parentWidth - westWidth - eastWidth;
                centerHeight = parentHeight - northHeight - southHeight;

                //alert(centerWidth+":"+centerHeight);

                var westExpandToTop = westOptions ? westOptions.expandToTop : false;
                var westExpandToBottom = westOptions ? westOptions.expandToBottom : false;
                var eastExpandToTop = eastOptions ? eastOptions.expandToTop : false;
                var eastExpandToBottom = eastOptions ? eastOptions.expandToBottom : false;

                northWidth = parentWidth - (westExpandToTop ? westWidth : 0) - (eastExpandToTop ? eastWidth : 0);
                southWidth = parentWidth - (westExpandToBottom ? westWidth : 0) - (eastExpandToBottom ? eastWidth : 0);

                westHeight = parentHeight - (westExpandToTop ? 0 : northHeight) - (westExpandToBottom ? 0 : southHeight);
                eastHeight = parentHeight - (eastExpandToTop ? 0 : northHeight) - (eastExpandToBottom ? 0 : southHeight);

                var northTop = 0;
                var northLeft = westExpandToTop ? westWidth : 0;
                var southTop = parentHeight - southHeight;
                var southLeft = westExpandToBottom ? westWidth : 0;
                var westTop = westExpandToTop ? 0 : northHeight;
                var westLeft = 0;
                var eastTop = eastExpandToTop ? 0 : northHeight;
                var eastLeft = westWidth + centerWidth;
                var centerTop = northHeight;
                var centerLeft = westWidth;

                //设置每个区域的大小
                // 2012-01-14 start modyfy by qudc  调用northEl、southEl、westEl、eastEl、centerEl的方法时,先对这些变量进行判断，放置用户没有配置其中一个区域导致js执行错误。
                northEl.length && northEl.css({top:northTop,left:northLeft});
                this._resizeSubWidget(northEl, northWidth, northHeight);
                northEl.length && northEl.width(northWidth);
                northEl.length && northEl.height(northHeight);
                //调用对应下面的组件的resize方法。

                southEl.length && southEl.css({top:southTop,left:southLeft});
                this._resizeSubWidget(southEl, southWidth, southHeight);
                southEl.length && southEl.width(southWidth);
                southEl.length && southEl.height(southHeight);
                //调用对应下面的组件的resize方法。

                westEl.length && westEl.css({top:westTop,left:westLeft});
                this._resizeSubWidget(westEl, westWidth, westHeight);
                westEl.length && westEl.width(westWidth);
                westEl.length && westEl.height(westHeight);
                //调用对应下面的组件的resize方法。


                eastEl.length && eastEl.css({top:eastTop,left:eastLeft});
                this._resizeSubWidget(eastEl, eastWidth, eastHeight);
                eastEl.length && eastEl.width(eastWidth);
                eastEl.length && eastEl.height(eastHeight);

                //调用对应下面的组件的resize方法。
                centerEl.css({top:centerTop,left:centerLeft});
                this._resizeSubWidget(centerEl, centerWidth, centerHeight);
                centerEl.width(centerWidth);
                centerEl.height(centerHeight);
                //2012-01-14 end modyfy by qudc  调用northEl、southEl、westEl、eastEl、centerEl方法时,先对这些变量进行判断，放置用户没有配置其中一个区域导致js执行错误。
                //调用对应下面的组件的resize方法。
                //this._resizeRegion();
            }

        },
        //对象销毁方法
        destroy : function() {
            this.northEl = null;
            this.southEl = null;
            this.westEl = null;
            this.eastEl = null;
            this.centerEl = null;
            $(window).unbind('resize');
        },
        /**
         * 綁定指定的事件
         */
        _bindEvent :function() {
            var ME=this;
            var calculateProxy = $.proxy(this, "_calculateRegion", true);
            var resizeFn = function() {
                if (ME.handler !== null) {
                    clearTimeout(ME.handler);
                }
                ME.handler = setTimeout(calculateProxy, 200);
            }
            $(window).bind('resize', resizeFn);
        },

        _resizeSubWidget: function($parent, width, height) {
            if (!$parent) {
                return;
            }
            var w = width;
            var h = height;

            /* 2012-01-14  start  delet by qudc 注释掉该代码，因为toolbar存放在grid组件容器中，grid组件设置高宽的时候会自动计算toolbar的高宽。
             //是否包含toolbar组件，如果有的话计算高度的时候去除toolbar的高宽
             //var toolbarEl = $parent.find(">.f-toolGroup");
             var toolbarEl = $parent.find("div[class^=f-toolGroup]");
             var hasToolbar = toolbarEl.size() > 0 ? true : false;
             var toolbarHeight = 0;
             if (hasToolbar) {
             //toolbarHeight = toolbarEl.outerHeight();
             }

             var w = parentWidth;
             var h = parentHeight - toolbarHeight;
             //2012-01-14  end  delet by qudc
             */

            //如果下面有grid组件
            var gridEl = $parent.find(">.f-grid");
            if (gridEl.size() > 0) {
                var id = gridEl.attr("id");
                //alert(id+":"+parentWidth+":"+parentHeight);
                $("#" + id).FGrid('setSize', w, h);
                return;
            }
            //如果下面有tree组件
            var treeEl = $parent.find(">.f-tree");
            if (treeEl.size() > 0) {
                var id = treeEl.attr("id");
                $("#" + id).FTree('setSize', w, h);
                return;
            }
            //如果下面有panel组件
            var panelEl = $parent.find(">.f-panel");
            if (panelEl.size() > 0) {
                var id = panelEl.attr("id");
                $("#" + id).FPanel('setSize', w, h);
                return;
            }

            //2013-1-18  start add by qudc  修改_resizeSubWidget方法，新增对faccordion组件的自适应功能
            //如果下面有accordion组件
            var panelEl = $parent.find("div[class^=f-accordion]");
            if (panelEl.size() > 0) {
                var id = panelEl.attr("id");
                $("#" + id).FAccordion('setSize', w, h);
                return;
            }
            //2013-1-18  end add by qudc

            //2013-1-18  start add by qudc  修改_resizeSubWidget方法，新增对tabs组件的自适应功能
            var panelEl = $parent.find("div[class^=f-tabs]");
            if (panelEl.size() > 0) {
                var id = panelEl.attr("id");
                $("#" + id).FTabs('setSize', w, h);
                return;
            }
            //2013-1-18  end add by qudc

        }
    });

})(jQuery);

	