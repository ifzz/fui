/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FTagWithContent.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.jsp;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-14 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public abstract class FTagWithContent extends FBaseJspSupport
{
	private static final long	serialVersionUID	= 1L;

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getType()
	 */
	@Override
	protected final int getType()
	{
		return TAG_WITH_CONTENT;
	}

	/*
	 * (non-Javadoc)
	 * @see
	 * com.hundsun.jres.fui.jsp.FBaseJspSupport#isChildAllowed(java.lang.String)
	 */
	@Override
	protected final boolean isChildAllowed(String name)
	{
		return false;
	}
}
