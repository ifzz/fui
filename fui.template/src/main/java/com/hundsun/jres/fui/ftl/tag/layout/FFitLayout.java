/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FFitLayout.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.ftl.tag.layout;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.ftl.FTagWithContent;
import com.hundsun.jres.fui.tag.layout.FFitLayoutProcessor;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-10-16 <br>
 */
public class FFitLayout extends FTagWithContent
{

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
	 * @see com.hundsun.jres.fui.ftl.FBaseFreemarkerSupport#getName()
	 */
	@Override
	public String getName()
	{
		return "fitlayout";
	}

}
