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
