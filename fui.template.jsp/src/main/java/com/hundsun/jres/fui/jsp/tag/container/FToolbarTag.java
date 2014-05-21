/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FToolGroupTag.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 *  2012-10-30  qudc     修改getName方法的返回值，”f_toolbar“ 改成 “f-toolbar”
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.jsp.tag.container;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithContent;
import com.hundsun.jres.fui.tag.container.FToolbarProcessor;

/**
 * 工具条组件
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-15 <br>
 */
public class FToolbarTag extends FTagWithContent
{
	private static final long	serialVersionUID	= 1L;

	private String				id;
	private String				style;
	private String				clz;
	private String				width;
	private String				height;
	private String				toolAlign;
	private String				toolspacing;
	private String				toolpadding;

	public void setId(String id)
	{
		this.id = id;
	}

	public void setStyle(String style)
	{
		this.style = style;
	}

	public void setClasses(String clz)
	{
		this.clz = clz;
	}

	public void setWidth(String width)
	{
		this.width = width;
	}

	public void setHeight(String height)
	{
		this.height = height;
	}

	public void setToolAlign(String toolAlign)
	{
		this.toolAlign = toolAlign;
	}

	public void setToolspacing(String toolspacing)
	{
		this.toolspacing = toolspacing;
	}

	public void setToolpadding(String toolpadding)
	{
		this.toolpadding = toolpadding;
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
	 */
	public FTagProcessor getProcessor()
	{
		return new FToolbarProcessor();
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
	 */
	@Override
	public String getName()
	{
		return "f-toolbar";
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#doBeforeProcess()
	 */
	@Override
	protected void doBeforeProcess()
	{
		parameters.put("id", id);
		parameters.put("style", style);
		parameters.put("class", clz);
		parameters.put("width", width);
		parameters.put("height", height);
		parameters.put("toolAlign", toolAlign);
		parameters.put("toolspacing", toolspacing);
		parameters.put("toolpadding", toolpadding);
	}

}
