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
import freemarker.template.TemplateDirectiveBody;
import freemarker.template.TemplateDirectiveModel;
import freemarker.template.TemplateException;
import freemarker.template.TemplateModel;
import freemarker.template.TemplateModelException;

/**
 * 判断某值是否是null或者""，如果是则使用default值替换
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-7 <br>
 */
public class ValidateAndSetDirective implements TemplateDirectiveModel
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
		String value = DataGetter.getString(valueModel, "").trim();
		if (value.length() != 0) {
			return;
		}
		// 获取默认值
		TemplateModel defaultModel = (TemplateModel) params.get("default");
		if (defaultModel != null) {
			env.setLocalVariable(name, defaultModel);
		}
	}

}
