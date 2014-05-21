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
import com.hundsun.jres.fui.tag.container.FMenuItemProcessor;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-17 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FMenuItemTag extends FTagWithContent
{
	/**  */
	private static final long	serialVersionUID	= 1L;

	private String				id;
	private String				text;
	private String				iconCls;
	private String				subMenu;
	private String				disable;
	private String				onClick;
	private String				url;
	private String				checked;

	public void setId(String id)
	{
		this.id = id;
	}

	public void setText(String text)
	{
		this.text = text;
	}

	public void setIconCls(String iconCls)
	{
		this.iconCls = iconCls;
	}

	public void setSubMenu(String subMenu)
	{
		this.subMenu = subMenu;
	}

	public void setDisable(String disable)
	{
		this.disable = disable;
	}

	public void setOnClick(String onClick)
	{
		this.onClick = onClick;
	}

	public void setUrl(String url)
	{
		this.url = url;
	}

	public void setChecked(String checked)
	{
		this.checked = checked;
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
	 */
	public FTagProcessor getProcessor()
	{
		return new FMenuItemProcessor();
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#doBeforeProcess()
	 */
	public void doBeforeProcess()
	{
		parameters.put("id", id);
		parameters.put("text", text);
		parameters.put("iconCls", iconCls);
		parameters.put("subMenu", subMenu);
		parameters.put("disable", disable);
		parameters.put("onClick", onClick);
		parameters.put("url", url);
		parameters.put("checked", checked);
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
	 */
	@Override
	public String getName()
	{
		return "f-menuItem";
	}

}
