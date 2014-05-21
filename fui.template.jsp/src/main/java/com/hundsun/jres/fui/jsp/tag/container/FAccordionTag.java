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
import com.hundsun.jres.fui.tag.container.FAccordionProcessor;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-17 <br>
 */
public class FAccordionTag extends FTagWithContent
{
	/**  */
	private static final long	serialVersionUID	= 1L;

	private String				id;
	private String				style;
	private String				classes;
	private String				width;
	private String				height;
	private String				active;
	private String				onActive;
	private String				onBeforeActive;
	private String				onBeforeCollapse;
	private String				onCollapse;

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

	public void setWidth(String width)
	{
		this.width = width;
	}

	public void setHeight(String height)
	{
		this.height = height;
	}

	public void setActive(String active)
	{
		this.active = active;
	}

	public void setOnActive(String onActive)
	{
		this.onActive = onActive;
	}

	public void setOnBeforeActive(String onBeforeActive)
	{
		this.onBeforeActive = onBeforeActive;
	}

	public void setOnBeforeCollapse(String onBeforeCollapse)
	{
		this.onBeforeCollapse = onBeforeCollapse;
	}

	public void setOnCollapse(String onCollapse)
	{
		this.onCollapse = onCollapse;
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
	 */
	public FTagProcessor getProcessor()
	{
		return new FAccordionProcessor();
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
		parameters.put("width", width);
		parameters.put("height", height);
		parameters.put("active", active);
		parameters.put("onActive", onActive);
		parameters.put("onBeforeActive", onBeforeActive);
		parameters.put("onBeforeCollapse", onBeforeCollapse);
		parameters.put("onCollapse", onCollapse);
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
	 */
	@Override
	public String getName()
	{
		return "f-accordion";
	}

}
