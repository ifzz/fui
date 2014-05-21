/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: StringValueMethod.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.te.freemarker;

import java.util.List;

import com.hundsun.jres.fui.core.util.DataGetter;

import freemarker.template.TemplateMethodModel;
import freemarker.template.TemplateModelException;

/**
 * 将某值转换为String，并trim该值，如果该值为null，则返回""
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-8 <br>
 */
public class StringValueMethod implements TemplateMethodModel
{

	/*
	 * (non-Javadoc)
	 * @see freemarker.template.TemplateMethodModel#exec(java.util.List)
	 */
	public Object exec(List arguments) throws TemplateModelException
	{
		if (arguments.size() == 0) {
			return "";
		}

		String def = "";
		if (arguments.size() > 1) {
			def = DataGetter.getString(arguments.get(1), def);
		}
		String result = DataGetter.getString(arguments.get(0), def).trim();
		if (result.length() == 0) {
			return def;
		} else {
			return result;
		}
	}

}
