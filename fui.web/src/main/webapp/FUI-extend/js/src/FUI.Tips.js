/**
 * @name FTips
 * @class <b>小贴士组件</b><br/><br/>
 * <img src="../resource/images/tips.png"/><br/>
 * <b>使用场景</b>
 * <ol>
 * <span style="color:red;">暂不发布</span> 
 * 用户与页面交互时，需要知道如何操作或者操作的反馈，这样的提示信息使用小贴士形式，以独立项目的方式展示给用户
 * </ol>
 * <b>功能描述：</b><br/>
 * <ol>
 *      <li>有折角指向需要提供帮助提示的组件</li>
 *      <li>用户能够通过autoclose自动关闭，也可以通过方法进行手动关闭</li>
 *      <li>信息内容支持HTML</li>
 *      <li>需要异步加载，以方便动态展示</li>
 * </ol>

 * 
 * <b>示例：</b><br/>
 * <pre>
 * 无
 * </pre>
 * 
 * 
 */
	
  	/**@lends FTips# */

	/**
	 * 创建并显示
	 * @name FTips#show
	 * @function
	 * @param ops ops配置对象，结构是：
	 * <br/>
      *        <ul style="margin-left:40px">
      *             <li>content：弹出窗口的提示内容，String类型，可以使用普通字符串，也可以使用html代码。无默认值。</li>
      *             <li>url：动态加载的HTML片断地址。</li>
      *             <li>closable：是否提供关闭按钮，boolean类型。默认值为true。</li>
      *             <li>autoClose：自动关闭，boolean类型。畎认值为false，开启自动关闭时，当鼠标停留在该窗体上时，窗体关闭会被取消。当鼠标离开时，开启并重新计算时间</li>
      *             <li>target：tips的目标对象,为JQuery选择器选择出来的对象，默认显示在组件的靠右中间的位置，和position只能配置一项，都配时，以这个position为准</li>
      *             <li>position：左上角的位置，结构是：{left:100,top:200}，和target只能配置一项，都配时，以这个属性为准</li>
      *         </ul>
	 * @example
      *             $(.select).tips('show',{
      *                 content:'请先操作用户数据..',
      *                 autoClose:true
      *             });
      * 
	 */

	/**
	 * 关闭并销毁，
	 * @name FTips#close
	 * @function
	 * @example
      *      $(.select).tips('close');
      * 
	 */
