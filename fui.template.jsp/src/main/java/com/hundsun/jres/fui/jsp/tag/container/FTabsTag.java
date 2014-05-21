/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FPanelTag.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 20130314    hanyin   增加fit属性
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.jsp.tag.container;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithSubElements;
import com.hundsun.jres.fui.tag.container.FTabsProcessor;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-17 <br>
 */
public class FTabsTag extends FTagWithSubElements
{
	/**  */
	private static final long	serialVersionUID	= 1L;

	private String				id;
	private String				style;
	private String				classes;
	private String				width;
	private String				height;
	private String				tabWidth;
	private String				tabsHeaderCls;
	private String				active;
	private String				fit;
	private String				onActive;
	private String				onBeforeActive;
	private String				onBeforeClose;
	private String				onClose;
	private String				onBeforeCloseAllOthers;
	private String				onCloseAllOthers;
	private String				onBeforeAdd;
	private String				onAdd;
	private String				onLoadComplete;
	private String				onTabDblClick;
	private String				onTabbarRClick;

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

	public void setFit(String fit)
	{
		this.fit = fit;
	}

	public void setTabWidth(String tabWidth)
	{
		this.tabWidth = tabWidth;
	}

	public void setTabsHeaderCls(String tabsHeaderCls)
	{
		this.tabsHeaderCls = tabsHeaderCls;
	}

	public void setActive(String active)
	{
		this.active = active;
	}

	public void setOnActive(String onActivate)
	{
		this.onActive = onActivate;
	}

	public void setOnBeforeActive(String onBeforeActivate)
	{
		this.onBeforeActive = onBeforeActivate;
	}

	public void setOnBeforeClose(String onBeforeClose)
	{
		this.onBeforeClose = onBeforeClose;
	}

	public void setOnClose(String onClose)
	{
		this.onClose = onClose;
	}

	public void setOnBeforeCloseAllOthers(String onBeforeCloseAllOthers)
	{
		this.onBeforeCloseAllOthers = onBeforeCloseAllOthers;
	}

	public void setOnCloseAllOthers(String onCloseAllOthers)
	{
		this.onCloseAllOthers = onCloseAllOthers;
	}

	public void setOnBeforeAdd(String onBeforeAdd)
	{
		this.onBeforeAdd = onBeforeAdd;
	}

	public void setOnAdd(String onAdd)
	{
		this.onAdd = onAdd;
	}

	public void setOnLoadComplete(String onLoadComplete)
	{
		this.onLoadComplete = onLoadComplete;
	}

	public void setOnTabDblClick(String onTabDblClick)
	{
		this.onTabDblClick = onTabDblClick;
	}

	public void setOnTabbarRClick(String onTabbarRClick)
	{
		this.onTabbarRClick = onTabbarRClick;
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
	 */
	public FTagProcessor getProcessor()
	{
		return new FTabsProcessor();
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
		parameters.put("tabWidth", tabWidth);
		parameters.put("tabsHeaderCls", tabsHeaderCls);
		parameters.put("active", active);
		parameters.put("fit", fit);
		parameters.put("onActive", onActive);
		parameters.put("onBeforeActive", onBeforeActive);
		parameters.put("onBeforeClose", onBeforeClose);
		parameters.put("onClose", onClose);
		parameters.put("onBeforeCloseAllOthers", onBeforeCloseAllOthers);
		parameters.put("onCloseAllOthers", onCloseAllOthers);
		parameters.put("onBeforeAdd", onBeforeAdd);
		parameters.put("onAdd", onAdd);
		parameters.put("onLoadComplete", onLoadComplete);
		parameters.put("onTabDblClick", onTabDblClick);
		parameters.put("onTabbarRClick", onTabbarRClick);
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
	 */
	@Override
	public String getName()
	{
		return "tabs";
	}

}
