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
import com.hundsun.jres.fui.tag.container.FMenuProcessor;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-17 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FMenuTag extends FTagWithContent
{
	/**  */
	private static final long	serialVersionUID	= 1L;

	private String				id;
	private String				style;
	private String				classes;
	private String				attach;
	private String				staticData;
	private String				onClick;
	private String				beforeShow;
	private String				onShow;
	private String				onHide;
	private String				beforeHide;

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

	public void setAttach(String attach)
	{
		this.attach = attach;
	}

	public void setStaticData(String staticData)
	{
		this.staticData = staticData;
	}

	public void setOnClick(String onClick)
	{
		this.onClick = onClick;
	}

	public void setBeforeShow(String beforeShow)
	{
		this.beforeShow = beforeShow;
	}

	public void setOnShow(String onShow)
	{
		this.onShow = onShow;
	}

	public void setOnHide(String onHide)
	{
		this.onHide = onHide;
	}

	public void setBeforeHide(String beforeHide)
	{
		this.beforeHide = beforeHide;
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
	 */
	public FTagProcessor getProcessor()
	{
		return new FMenuProcessor();
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
		parameters.put("attach", attach);
		parameters.put("staticData", staticData);
		parameters.put("onClick", onClick);
		parameters.put("beforeShow", beforeShow);
		parameters.put("onShow", onShow);
		parameters.put("onHide", onHide);
		parameters.put("beforeHide", beforeHide);
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
	 */
	@Override
	public String getName()
	{
		return "f-menu";
	}

}
