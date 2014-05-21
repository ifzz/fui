/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FCheckboxGroupTag.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 20130315		hanyin	 增加check属性
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.jsp.tag.form;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithContent;
import com.hundsun.jres.fui.tag.form.FTextHFieldProcessor;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-21 <br>
 */
public class FTextHFieldTag extends FTagWithContent
{
	private static final long	serialVersionUID	= 1L;
	private String				id;
	private String				style;
	private String				classes;
	private String				title;
	private String				disabled;
	private String				readonly;
	private String				name;
	private String				width;
	private String				height;
	private String				tabIndex;
	private String				iconPos;
	private String				iconCls;
	private String				accept;
	private String				type;
	private String 				check;

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

	public void setName(String name)
	{
		this.name = name;
	}

	public void setTitle(String title)
	{
		this.title = title;
	}

	public void setDisabled(String disabled)
	{
		this.disabled = disabled;
	}

	public void setReadonly(String readonly)
	{
		this.readonly = readonly;
	}

	public void setWidth(String width)
	{
		this.width = width;
	}

	public void setHeight(String height)
	{
		this.height = height;
	}

	public void setTabIndex(String tabIndex)
	{
		this.tabIndex = tabIndex;
	}

	public void setIconPos(String iconPos)
	{
		this.iconPos = iconPos;
	}

	public void setIconCls(String iconCls)
	{
		this.iconCls = iconCls;
	}

	public void setAccept(String accept)
	{
		this.accept = accept;
	}

	public void setType(String type)
	{
		this.type = type;
	}

	public void setCheck(String check)
	{
		this.check = check;
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
	 */
	public FTagProcessor getProcessor()
	{
		return new FTextHFieldProcessor();
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
	 */
	@Override
	public String getName()
	{
		return "f-textField";
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
		parameters.put("class", classes);
		parameters.put("title", title);
		parameters.put("disabled", disabled);
		parameters.put("readonly", readonly);
		parameters.put("name", name);
		parameters.put("width", width);
		parameters.put("height", height);
		parameters.put("tabIndex", tabIndex);
		parameters.put("iconPos", iconPos);
		parameters.put("iconCls", iconCls);
		parameters.put("accept", accept);
		parameters.put("type", type);
		parameters.put("check", check);
	}
}
