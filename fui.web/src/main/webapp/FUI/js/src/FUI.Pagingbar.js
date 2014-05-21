/* *
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
