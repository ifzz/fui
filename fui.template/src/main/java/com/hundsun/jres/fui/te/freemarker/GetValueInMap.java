/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: GetValueInList.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.te.freemarker;

import java.util.List;
import java.util.Map;

import freemarker.template.TemplateMethodModelEx;
import freemarker.template.TemplateModelException;

/**
 * 从Map中按照所以获取值
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-17 <br>
 */
public class GetValueInMap implements TemplateMethodModelEx
{
	/*
	 * (non-Javadoc)
	 * @see freemarker.template.TemplateMethodModel#exec(java.util.List)
	 */
	public Object exec(List arguments) throws TemplateModelException
	{
		if (arguments.size() < 2) {
			throw new TemplateModelException("No parameters");
		}

		Map map = (Map) arguments.get(0);
		String key = arguments.get(1).toString();
		return map.get(key);
	}

}
