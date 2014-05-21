/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: IResources.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core;

/**
 * 功能说明: IResources定义了FUI相关资源（主要是js、样式资源和模板资源等）的别名常量以及对应资源URI的获取方法，用”/”来表示工程部署的根目录，也就是常用Java Web工程的WebContent或者WebRoot目录。
 * 实际路径的详细说明请见上一节的相关内容：
 * <p>
<table class="MsoNormalTable" border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none">
 <tbody><tr>
  <td width="137" valign="top" style="width:102.8pt;border-top:1.5pt;border-left:
  1.5pt;border-bottom:1.0pt;border-right:1.0pt;border-color:black;border-style:
  solid;padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span style="font-family:宋体">资源别名</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:solid black 1.5pt;
  border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span style="font-family:宋体">实际路径（默认）</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:solid black 1.5pt;
  border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span style="font-family:宋体">获取方法</span></p>
  </td>
  <td width="137" valign="top" style="width:102.85pt;border-top:solid black 1.5pt;
  border-left:none;border-bottom:solid black 1.0pt;border-right:solid black 1.5pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span style="font-family:宋体">说明</span></p>
  </td>
 </tr>
 <tr>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  solid black 1.5pt;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">f_root</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">/FUI/</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">getFRootPath()</span></p>
  </td>
  <td width="137" valign="top" style="width:102.85pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.5pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">&nbsp;</span></p>
  </td>
 </tr>
 <tr>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  solid black 1.5pt;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">f_css</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">/FUI/css/core.css</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">getFCssPath()</span></p>
  </td>
  <td width="137" valign="top" style="width:102.85pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.5pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">FUI</span><span style="font-family:宋体">基本样式</span></p>
  </td>
 </tr>
 <tr>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  solid black 1.5pt;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">f_js</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">/FUI/js/</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">getFJsPath()</span></p>
  </td>
  <td width="137" valign="top" style="width:102.85pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.5pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">&nbsp;</span></p>
  </td>
 </tr>
 <tr>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  solid black 1.5pt;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">f_js_src</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">/FUI/js/src/</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">getFJsSrcPath()</span></p>
  </td>
  <td width="137" valign="top" style="width:102.85pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.5pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">&nbsp;</span></p>
  </td>
 </tr>
 <tr>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  solid black 1.5pt;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">f_themes</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">/FUI/themes/</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">getFThemes()</span></p>
  </td>
  <td width="137" valign="top" style="width:102.85pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.5pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">&nbsp;</span></p>
  </td>
 </tr>
 <tr>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  solid black 1.5pt;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">f_ex_root</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">/FUI-extend/</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">getExRootPath()</span></p>
  </td>
  <td width="137" valign="top" style="width:102.85pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.5pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">&nbsp;</span></p>
  </td>
 </tr>
 <tr>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  solid black 1.5pt;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">f_ex_js_src</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">/FUI-extend/js/src</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">getExJsSrcPath()</span></p>
  </td>
  <td width="137" valign="top" style="width:102.85pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.5pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">&nbsp;</span></p>
  </td>
 </tr>
 <tr>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  solid black 1.5pt;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">f_ex_templates</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">/WEB-INF/classes/templates/</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">getExTemplatesPath()</span></p>
  </td>
  <td width="137" valign="top" style="width:102.85pt;border-top:none;border-left:
  none;border-bottom:solid black 1.0pt;border-right:solid black 1.5pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">&nbsp;</span></p>
  </td>
 </tr>
 <tr>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  solid black 1.5pt;border-bottom:solid black 1.5pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">f_ex_themes</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  none;border-bottom:solid black 1.5pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">/FUI-extend/themes/</span></p>
  </td>
  <td width="137" valign="top" style="width:102.8pt;border-top:none;border-left:
  none;border-bottom:solid black 1.5pt;border-right:solid black 1.0pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">getExThemesPath()</span></p>
  </td>
  <td width="137" valign="top" style="width:102.85pt;border-top:none;border-left:
  none;border-bottom:solid black 1.5pt;border-right:solid black 1.5pt;
  padding:0cm 5.4pt 0cm 5.4pt">
  <p class="MsoNormal"><span lang="EN-US">&nbsp;</span></p>
  </td>
 </tr>
</tbody></table>
 * <p>
 * IResources还有一个方法“getResourcePath(String resAlias)”，该方法可以通过转入资源的别名来获取资源的URI。getContextPath()，返回Servlet的上下文路径，即部署的工程名，形式类似于“/工程名”，用于资源（比如css，图片等）的绝对路径
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-3-31 <br>
 */
public interface IResources
{
	/** 存放与FUI相关资源，比如核心css、js、资源模板等 */
	static final String	F_Root			= "f_root";
	/** 定义FUI的基础样式，主要用于屏蔽各种浏览器默认样式的差异 */
	static final String	F_Css			= "f_css";
	/** FUI的基础JS库，主要用于调试 */
	static final String	F_Js			= "f_js";
	/** FUI各个基础组件的js，按照”FUI.组件名.js”的方式存放 */
	static final String	F_JsSrc			= "f_js_src";
	/** FUI基础皮肤集合，每个皮肤都以文件夹的形式存在，以皮肤名作为文件夹名，以皮肤文件夹下的”style.css”作为皮肤的样式 */
	static final String	F_Themes		= "f_themes";
	/** 用户扩展资源，比如组件js、皮肤样式、页面模板等 */
	static final String	F_Ex_Root		= "f_ex_root";
	/** 用户扩展组件js，按照”名字空间.组件名.js”的方式存放 */
	static final String	F_Ex_JsSrc		= "f_ex_js_src";
	/**
	 * 用户扩展模板，根据模板引擎存放在相应目录下，比如Freemarker的模板文件，存放在”/FUI-extend/templates/ftl/”
	 * 目录下；相应的，JSP的标签模板存放在”tld”目录下
	 */
	static final String	F_Ex_Templates	= "f_ex_templates";
	/** 用户自定义皮肤集合，每个皮肤都以文件夹的形式存在，以皮肤名作为文件夹名，以皮肤文件夹下的”style.css”作为皮肤的样式 */
	static final String	F_Ex_Themes		= "f_ex_themes";

	/** 数据模型文件 */
	static final String	F_DATA_MODEL	= "f_data_model";

	/**
	 * 获取FUI资源总路径
	 * @return FUI资源总路径
	 */
	String getFRootPath(FContext context);

	/**
	 * 获取FUI基础css路径
	 * @return css路径
	 */
	String getFCssPath(FContext context);

	/**
	 * 获取FUI js总路径
	 * @return js总路径
	 */
	String getFJsPath(FContext context);

	/**
	 * 获取FUI组件js路径
	 * @return 组件js路径
	 */
	String getFJsSrcPath(FContext context);

	/**
	 * 获取FUI皮肤路径
	 * @return FUI皮肤路径
	 */
	String getFThemes(FContext context);

	/**
	 * 获取用户扩展总路径
	 * @return 用户扩展总路径
	 */
	String getExRootPath(FContext context);

	/**
	 * 获取用户扩展组件路径
	 * @return 用户扩展组件路径
	 */
	String getExJsSrcPath(FContext context);

	/**
	 * 获取用户扩展模板的路径
	 * @return 用户扩展模板路径
	 */
	String getExTemplatesPath(FContext context);

	/**
	 * 获取用户扩展皮肤路径
	 * @return 用户扩展皮肤路径
	 */
	String getExThemesPath(FContext context);

	/**
	 * 获取资源的路径
	 * @param resAlias
	 *            资源别名
	 * @return 资源路径
	 */
	String getResourcePath(String resAlias, FContext context);

	/**
	 * 获取带工程上下文环境路径，即工程名的资源路径
	 * @param resAlias
	 *            资源别名
	 * @param context
	 *            服务调用上下文
	 * @return
	 */
	String getResourcePathCtx(String resAlias, FContext context);

	void setResourcePath(String resAlias, String uri);

	void setResourcePath(String resAlias, ResourceCallback callback);

	boolean hasResource(String resAlias);

	/**
	 * 获取工程的上下文路径
	 * @return 工程的上下文路径
	 */
	String getContextPath();

}
