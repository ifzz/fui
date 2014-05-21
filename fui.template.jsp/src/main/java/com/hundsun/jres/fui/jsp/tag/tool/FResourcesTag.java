/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FResourcesTag.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.jsp.tag.tool;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithSubElements;
import com.hundsun.jres.fui.tag.tool.FResourcesProcessor;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-18 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FResourcesTag extends FTagWithSubElements
{
	private static final long	serialVersionUID	= 1L;

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
	 */
	public FTagProcessor getProcessor()
	{
		return new FResourcesProcessor();
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
	 */
	public String getName()
	{
		return "fresources";
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#doBeforeProcess()
	 */
	protected void doBeforeProcess()
	{
		// 没有参数
	}

	/*
	 * (non-Javadoc)
	 * @see
	 * com.hundsun.jres.fui.jsp.FBaseJspSupport#isChildAllowed(java.lang.String)
	 */
	protected boolean isChildAllowed(String name)
	{
		if ("fcomponet".equals(name)) {
			return true;
		}
		return super.isChildAllowed(name);
	}

}
