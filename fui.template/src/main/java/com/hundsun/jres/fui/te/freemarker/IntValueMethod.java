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
 * 截取以数字开头字符串，并将数字串转换为数值返回；否则返回默认值
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 */
public class IntValueMethod implements TemplateMethodModel
{

	/*
	 * (non-Javadoc)
	 * @see freemarker.template.TemplateMethodModel#exec(java.util.List)
	 */
	public Object exec(List arguments) throws TemplateModelException
	{
		if (arguments.size() == 0) {
			return new TemplateModelException("no arguments");
		}
		String value = DataGetter.getString(arguments.get(0), "").trim();
		if (value.length() != 0) {
			long l = parseToInt(value);
			if (l != Long.MAX_VALUE) {
				return l;
			}
		}
		// 传入了默认值
		if (arguments.size() == 2) {
			long l = parseToInt(DataGetter.getString(arguments.get(1), "").trim());
			if (l != Long.MAX_VALUE) {
				return l;
			}
		}
		return new TemplateModelException("Can not parse to int:" + arguments);
	}

	private long parseToInt(String value)
	{
		int size = value.length();
		StringBuffer sb = new StringBuffer(value.length());
		for (int i = 0; i < size; i++) {
			char c = value.charAt(i);
			if (Character.isDigit(c)) {
				sb.append(c);
			} else {
				break;
			}
		}
		String realValue = sb.toString();
		if (realValue.length() == 0) {
			return Long.MAX_VALUE;
		} else {
			return Long.parseLong(realValue);
		}
	}
}
