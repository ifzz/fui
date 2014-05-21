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
