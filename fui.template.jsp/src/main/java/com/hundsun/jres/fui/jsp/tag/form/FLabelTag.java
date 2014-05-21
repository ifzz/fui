/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FCheckboxGroupTag.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.jsp.tag.form;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithoutContent;
import com.hundsun.jres.fui.tag.form.FLabelProcessor;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-21 <br>
 */
public class FLabelTag extends FTagWithoutContent
{
	private static final long	serialVersionUID	= 1L;
	private String				id;
	private String				style;
	private String				classes;
	private String				forId;
	private String				text;
	private String				height;
	private String				width;
	private String				textAlign;

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

	public void setForId(String forId)
	{
		this.forId = forId;
	}

	public void setText(String text)
	{
		this.text = text;
	}

	public void setHeight(String height)
	{
		this.height = height;
	}

	public void setWidth(String width)
	{
		this.width = width;
	}

	public void setTextAlign(String textAlign)
	{
		this.textAlign = textAlign;
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
	 */
	public FTagProcessor getProcessor()
	{
		return new FLabelProcessor();
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
	 */
	@Override
	public String getName()
	{
		return "flabel";
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
		parameters.put("for", forId);
		parameters.put("text", text);
		parameters.put("height", height);
		parameters.put("width", width);
		parameters.put("textAlign", textAlign);
	}

}
