/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: BooleanValueMethod.java
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
 * 判断值是否为"true"，如果该值为空，并且存在默认值则返回默认值
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-8 <br>
 */
public class BooleanValueMethod implements TemplateMethodModel
{

	/*
	 * (non-Javadoc)
	 * @see freemarker.template.TemplateMethodModel#exec(java.util.List)
	 */
	public Object exec(List arguments) throws TemplateModelException
	{
		if (arguments.size() == 0) {
			return false;
		}
		String value = DataGetter.getString(arguments.get(0), "").trim();
		if (value.length() != 0) {
			if (value.equalsIgnoreCase("true")) {
				return true;
			} else {
				return false;
			}
		}
		// 传入了默认值
		if (arguments.size() == 2) {
			return Boolean.parseBoolean(arguments.get(1).toString());
		}
		return false;
	}

}
