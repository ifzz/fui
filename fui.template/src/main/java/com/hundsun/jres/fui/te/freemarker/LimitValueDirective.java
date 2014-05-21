/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: ValidateAndSetDirective.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.te.freemarker;

import java.io.IOException;
import java.util.Map;

import com.hundsun.jres.fui.core.util.DataGetter;

import freemarker.core.Environment;
import freemarker.template.SimpleNumber;
import freemarker.template.TemplateDirectiveBody;
import freemarker.template.TemplateDirectiveModel;
import freemarker.template.TemplateException;
import freemarker.template.TemplateModel;
import freemarker.template.TemplateModelException;

/**
 * 限制传入的数值只能在指定的范围之内，如果低于最小值则取最小值，如果高于最大值则取最大值；否则原样返回
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-7 <br>
 */
public class LimitValueDirective implements TemplateDirectiveModel
{

	/*
	 * (non-Javadoc)
	 * @see freemarker.template.TemplateDirectiveModel#execute(freemarker.core.
	 * Environment, java.util.Map, freemarker.template.TemplateModel[],
	 * freemarker.template.TemplateDirectiveBody)
	 */
	public void execute(Environment env, Map params, TemplateModel[] loopVars, TemplateDirectiveBody body)
			throws TemplateException, IOException
	{
		Object nameModel = params.get("name");
		String name = DataGetter.getString(nameModel, "").trim();
		if (name.length() == 0) {
			throw new TemplateModelException("No name parameter");
		}
		// 获取要设置的值
		TemplateModel valueModel = env.getVariable(name);
		long value = DataGetter.getInt(valueModel, Integer.MIN_VALUE);
		if (value == Integer.MIN_VALUE) {
			return;
		}

		// 获取默认值
		TemplateModel minModel = (TemplateModel) params.get("min");
		long minValue = DataGetter.getInt(minModel, Integer.MIN_VALUE);
		if (minValue != Integer.MIN_VALUE) {
			if (value < minValue) {
				value = minValue;
			}
		}

		TemplateModel maxModel = (TemplateModel) params.get("max");
		long maxValue = DataGetter.getInt(maxModel, Integer.MIN_VALUE);
		if (maxValue != Integer.MIN_VALUE) {
			if (value > maxValue) {
				value = maxValue;
			}
		}
		env.setLocalVariable(name, new SimpleNumber(value));

	}
}
