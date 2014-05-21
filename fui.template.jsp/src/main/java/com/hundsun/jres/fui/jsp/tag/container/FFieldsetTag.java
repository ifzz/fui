/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FPanelTag.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.jsp.tag.container;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithContent;
import com.hundsun.jres.fui.tag.container.FFieldsetProcessor;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-17 <br>
 */
public class FFieldsetTag extends FTagWithContent
{
	/**  */
	private static final long	serialVersionUID	= 1L;

	private String				id;
	private String				style;
	private String				classes;
	private String				title;
	private String				height;
	private String				width;
	private boolean				collapsed			= false;
	private boolean				collapsible			= true;
	private boolean				autoscroll			= true;
	private String				onCollapse;
	private String				onExpand;

	public void setId(String id)
	{
		this.id = id;
	}

	public void setStyle(String style)
	{
		this.style = style;
	}

	public void setClasses(String classes)
	{
		this.classes = classes;
	}

	public void setTitle(String title)
	{
		this.title = title;
	}

	public void setHeight(String height)
	{
		this.height = height;
	}

	public void setWidth(String width)
	{
		this.width = width;
	}

	public void setCollapsed(boolean collapsed)
	{
		this.collapsed = collapsed;
	}

	public void setCollapsible(boolean collapsible)
	{
		this.collapsible = collapsible;
	}

	public void setAutoscroll(boolean autoscroll)
	{
		this.autoscroll = autoscroll;
	}

	public void setOnCollapse(String onCollapse)
	{
		this.onCollapse = onCollapse;
	}

	public void setOnExpand(String onExpand)
	{
		this.onExpand = onExpand;
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
	 */
	public FTagProcessor getProcessor()
	{
		return new FFieldsetProcessor();
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#doBeforeProcess()
	 */
	public void doBeforeProcess()
	{
		parameters.put("id", id);
		parameters.put("style", style);
		parameters.put("class", classes);
		parameters.put("title", title);
		parameters.put("height", height);
		parameters.put("width", width);
		parameters.put("collapsed", collapsed);
		parameters.put("collapsible", collapsible);
		parameters.put("autoscroll", autoscroll);
		parameters.put("onExpand", onExpand);
		parameters.put("onCollapse", onCollapse);
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
	 */
	@Override
	public String getName()
	{
		return "container";
	}

}
