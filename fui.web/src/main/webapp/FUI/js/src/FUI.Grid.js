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
})(jQuery);