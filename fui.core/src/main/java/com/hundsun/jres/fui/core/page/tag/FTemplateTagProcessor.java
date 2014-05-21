/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FTemplateTagProcessor.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.page.tag;

import com.hundsun.jres.fui.core.te.TEData;

/**
 * 模板标签的处理器
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-10-25 <br>
 */
public class FTemplateTagProcessor extends FTagProcessor
{

	/**
	 * 生成模板数据，用于调用模板
	 * @return 模板数据
	 */
	protected TEData getTemplateData()
	{
		TEData data = new TEData();
		data.setContent(content);
		data.setParameters(parameters);
		data.setElementNames(elementNames);
		data.setElementParams(elementParams);
		data.setElementContents(elementContents);
		data.setParsedElements(parsedElements);
		return data;
	}
}
