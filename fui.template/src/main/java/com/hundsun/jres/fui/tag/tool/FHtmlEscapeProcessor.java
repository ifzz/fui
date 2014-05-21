/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FScriptProcessor.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.tag.tool;

import com.hundsun.jres.fui.core.FException;
import com.hundsun.jres.fui.core.page.tag.FTagProcessor;

/**
 * 将 &lt;和&gt;转义
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-9-24 <br>
 */
public class FHtmlEscapeProcessor extends FTagProcessor
{

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FTagProcessor#process()
	 */
	public String process() throws FException
	{
		String content = this.content;
		if (content != null) {
			content = content.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
		} else {
			content = "";
		}
		return content;
		// if (content != null) {
		// return content.trim();
		// } else {
		// return "";
		// }
	}

}
