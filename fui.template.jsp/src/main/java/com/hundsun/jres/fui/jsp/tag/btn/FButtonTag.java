/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FButtonTag.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.jsp.tag.btn;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithoutContent;
import com.hundsun.jres.fui.tag.bnt.FButtonProcessor;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-10 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FButtonTag extends FTagWithoutContent
{
	private static final long	serialVersionUID	= 1L;

	private String				id;
	private String				style;
	private String				cls;
	private String				text;
	private String				type;
	private String				width;
	private String				height;
	private String				iconPath;
	private String				iconCls;
	private String				disabled			= "false";
	private String				visible				= "true";
	private String				isSplit				= "false";
	private String				size				= "small";
	private String				iconPos				= "left";
	private String				tabIndex			= "";
	private String				onClick;

	public void setId(String id)
	{
		this.id = id;
	}

	public void setStyle(String style)
	{
		this.style = style;
	}

	public void setClasses(String cls)
	{
		this.cls = cls;
	}

	public void setText(String title)
	{
		this.text = title;
	}

	public void setType(String type)
	{
		this.type = type;
	}

	public void setWidth(String width)
	{
		this.width = width;
	}

	public void setHeight(String height)
	{
		this.height = height;
	}

	public void setIconPath(String iconPath)
	{
		this.iconPath = iconPath;
	}

	public void setIconCls(String iconCls)
	{
		this.iconCls = iconCls;
	}

	public void setDisabled(String disabled)
	{
		this.disabled = disabled;
	}

	public void setVisible(String visible)
	{
		this.visible = visible;
	}

	public void setIsSplit(String isSplit)
	{
		this.isSplit = isSplit;
	}

	public void setSize(String size)
	{
		this.size = size;
	}

	public void setIconPos(String iconPos)
	{
		this.iconPos = iconPos;
	}

	public void setTabIndex(String tabIndex)
	{
		this.tabIndex = tabIndex;
	}

	public void setOnClick(String onClick)
	{
		this.onClick = onClick;
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
	 */
	public FTagProcessor getProcessor()
	{
		return new FButtonProcessor();
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#doBeforeProcess()
	 */
	public void doBeforeProcess()
	{
		parameters.put("id", id);
		parameters.put("style", style);
		parameters.put("class", cls);
		parameters.put("text", text);
		parameters.put("type", type);
		parameters.put("width", width);
		parameters.put("height", height);
		parameters.put("iconPath", iconPath);
		parameters.put("iconCls", iconCls);
		parameters.put("iconPos", iconPos);
		parameters.put("disabled", disabled);
		parameters.put("visible", visible);
		parameters.put("isSplit", isSplit);
		parameters.put("size", size);
		parameters.put("tabIndex", tabIndex);
		parameters.put("onClick", onClick);
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
	 */
	@Override
	public String getName()
	{
		return "button";
	}

}
