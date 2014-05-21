/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FLayoutTableTag.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.jsp.tag.layout;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithSubElements;
import com.hundsun.jres.fui.tag.layout.FLayoutTableProcessor;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-17 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FLayoutTableTag extends FTagWithSubElements
{
	private static final long	serialVersionUID	= 1L;

	/** 如果设为true，table布局宽度为100% */
	private String				width				= "100%";
	/** 内部元素的排布的列数，默认为1 */
	private int					columns				= 1;
	/** table布局下控件之间的间隔（单位：像素），默认值为4 */
	private int					cellspacing			= 4;

	public void setColumns(int columns)
	{
		this.columns = columns;
	}

	public void setWidth(String fullWidth)
	{
		this.width = fullWidth;
	}

	public void setCellspacing(int cellspacing)
	{
		this.cellspacing = cellspacing;
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
	 */
	public FTagProcessor getProcessor()
	{
		return new FLayoutTableProcessor();
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#doBeforeProcess()
	 */
	public void doBeforeProcess()
	{
		parameters.put("columns", columns);
		parameters.put("width", width);
		parameters.put("cellspacing", cellspacing);
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
	 */
	@Override
	public String getName()
	{
		return "flayout-table";
	}

	/*
	 * (non-Javadoc)
	 * @see
	 * com.hundsun.jres.fui.jsp.FBaseJspSupport#isChildAllowed(java.lang.String)
	 */
	@Override
	protected boolean isChildAllowed(String name)
	{
		if ("flayout-table-item".equals(name)) {
			return true;
		}
		return super.isChildAllowed(name);
	}
}
