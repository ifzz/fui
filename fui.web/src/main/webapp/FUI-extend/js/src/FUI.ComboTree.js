/**
 * @name FComboTree
 * @class <b>选择下拉菜单树组件</b><br/>
 * <span style="color:red;">暂不发布</span> 
 * FComboTree的基本功能与Combo组件类似，但是下拉组件是一棵树。此组件结合了树组件和下拉组件的功能。
 */

/**@lends FComboTree# */

/**
 * 输入栏的初始值。如果该控件有emptyText属性，则不允许与emptyText属性的值一样，否则该属性值无效。
 * @name FComboTree#<b>defaultValue</b>
 * @type String
 * @default ''
 * @example
 * 无
 */

/**
 *  fieldName属性对应html中的表单元素的name
 * @name FComboTree#<b>fieldName</b>
 * @type String
 * @default ''
 * @example
 * 无
 */
/**
 * 紧靠此控件显示的标签文本
 * @name FComboTree#<b>fieldLabel</b>
 * @type String
 * @default ${fieldName}
 * @example
 * 无
 */

/**
 * 是否允许为空，如果为false，输入长度>0时才合法(默认值为 true)，控件输入的值为空，则会出现红色波浪线
 * @name FComboTree#<b>allowBlank</b>
 * @type Boolean
 * @default true
 * @example
 * 无
 */

/**
 * 是否可编辑，默认为true，false为不可编辑
 * @name FComboTree#<b>editable</b>
 * @type Boolean
 * @default true 
 * @example
 * 无 
 */

/**
 * 控件宽度的像素值(默认值为250)。如果该父容器的布局为“table”布局，且fullWidth属性为true时，宽度可以设置成百分比。
 * @name FComboTree#<b>width</b>
 * @type String 
 * @default '250'
 * @example
 * 无 
 */

/**
 *  控件高度的像素值(默认值为22)。
 * @name FComboTree#<b>height</b>
 * @type String
 * @default 22
 * @example
 * 无 
 */

/**
 * 获取下拉树内容数据的URL。
 * @name FComboTree#<b>url</b>
 * @type String
 * @default 
 * @example
 * 无 
 */

/**
 * 下拉树的根节点id，默认值为‘root’。
 * @name FComboTree#<b>rootId</b>
 * @type String
 * @default 'root'
 * @example
 * 无 
 */

/**
 * 根节点的提示信息。
 * @name FComboTree#<b>rootQtip</b>
 * @type String
 * @default ''
 * @example
 * 无 
 */

/**
 * 根节点的文本信息。
 * @name FComboTree#<b>rootText</b>
 * @type String
 * @default ''
 * @example
 * 无 
 */

/**
 * 下拉树控件是否多选,默认不支持
 * @name FComboTree#<b>multiSelect</b>
 * @type Boolean
 * @default false
 * @example
 * 无 
 */

/**
 * 下拉树控件中树的根节点是否可见,设置为false将隐藏根节点(默认值为false)
 * @name FComboTree#<b>rootVisible</b>
 * @type Boolean
 * @default false
 * @example
 * 无 
 */


/**
 * 控件的隐藏域的fieldName，下拉树取值时设置下拉树的id属性
 * @name FComboTree#<b>hiddenName</b>
 * @type String
 * @default ''
 * @example
 * 无 
 */



/**
 * 获取显示出来的文本值
 * @name FComboTree#getValue
 * @function
 * @return String 返回显示出来的文本值
 * @example
 */

/**
 * 设置显示出来的文本值
 * @name FComboTree#setValue
 * @function
 * @param value : String 需要设置的文本值
 * @return void
 * @example
 */

/**
 * 获取隐藏域的值
 * @name FComboTree#getHiddenValue
 * @function
 * @return String 返回隐藏域的值
 * @example
 */

/**
 * 获取下拉列表中展示的树控件
 * @name FComboTree#getTree
 * @function
 * @return FTree 下拉列表中的树组件
 * @example
 */

/**
 * 判断控件是否可编辑
 * @name FComboTree#isEditable
 * @function
 * @return Boolean 
 * @example
 */

/**
 * 设置该控件是否可编辑(editable为true则可以编辑)
 * @name FComboTree#setEditable
 * @function
 * @param editable : Boolean
 * @return void
 * @example
 */

/**
 * 设置此组件是否允许为空。
 * @name FComboTree#setAllowBlank
 * @function
 * @param allowBlank : Boolean
 * @return void
 * @example
 */

/**
 * 当multiSelect为false时，点击树节点的时候触发。当multiSelect为true时，点击下拉列表中的确定按钮时触发。
 * @event
 * @name FComboTree#select
 * @param thisComp 类型：控件本身
 * @param nodes 类型：数组 选中的树节点的对象数组
 * @param tree 类型：FTree对象
 * @example
 */
