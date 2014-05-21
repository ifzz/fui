/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FToolGroupTag.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.jsp.tag.layout;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithContent;
import com.hundsun.jres.fui.tag.layout.FFitLayoutProcessor;

/**
 * 自适应布局标签
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-15 <br>
 */
public class FFitLayoutTag extends FTagWithContent
{
	private static final long	serialVersionUID	= 1L;

	private String				forId;
	private String				parentId;

	public void setForId(String forId)
	{
		this.forId = forId;
	}

	public void setParentId(String parentId)
	{
		this.parentId = parentId;
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
	 */
	public FTagProcessor getProcessor()
	{
		return new FFitLayoutProcessor();
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
	 */
	@Override
	public String getName()
	{
		return "fitlayout";
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#doBeforeProcess()
	 */
	@Override
	protected void doBeforeProcess()
	{
		parameters.put("forId", forId);
		parameters.put("parentId", parentId);
	}
}
