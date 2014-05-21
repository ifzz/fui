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
import com.hundsun.jres.fui.tag.container.FPanelProcessor;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-17 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FPanelTag extends FTagWithContent
{
	/**  */
	private static final long	serialVersionUID	= 1L;

	private String				id;
	private String				style;
	private String				classes;
	private String				title;
	private String				height;
	private String				width;
	private String				iconCls;
	private boolean				collapsible			= true;
	private boolean				collapsed			= false;
	private boolean				autoscroll			= true;
	private boolean				isIFrame			= false;
	private String				pageUrl;
	private String				onCollapse;
	private String				onExpand;
	private String				onLoadSuccess;
	private String				onError;

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

	public void setIconCls(String iconCls)
	{
		this.iconCls = iconCls;
	}

	public void setCollapsible(boolean collapsible)
	{
		this.collapsible = collapsible;
	}

	public void setCollapsed(boolean collapsed)
	{
		this.collapsed = collapsed;
	}

	public void setAutoscroll(boolean autoscroll)
	{
		this.autoscroll = autoscroll;
	}

	public void setIsIFrame(boolean isIFrame)
	{
		this.isIFrame = isIFrame;
	}

	public void setPageUrl(String pageUrl)
	{
		this.pageUrl = pageUrl;
	}

	public void setOnCollapse(String onCollapse)
	{
		this.onCollapse = onCollapse;
	}

	public void setOnExpand(String onExpand)
	{
		this.onExpand = onExpand;
	}

	public void setOnLoadSuccess(String onLoadSuccess)
	{
		this.onLoadSuccess = onLoadSuccess;
	}

	public void setOnError(String onError)
	{
		this.onError = onError;
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
	 */
	public FTagProcessor getProcessor()
	{
		return new FPanelProcessor();
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
		parameters.put("iconCls", iconCls);
		parameters.put("collapsible", collapsible);
		parameters.put("collapsed", collapsed);
		parameters.put("autoscroll", autoscroll);
		parameters.put("isIFrame", isIFrame);
		parameters.put("pageUrl", pageUrl);
		parameters.put("onCollapse", onCollapse);
		parameters.put("onExpand", onExpand);
		parameters.put("onLoadSuccess", onLoadSuccess);
		parameters.put("onError", onError);
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
