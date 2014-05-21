/**
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



