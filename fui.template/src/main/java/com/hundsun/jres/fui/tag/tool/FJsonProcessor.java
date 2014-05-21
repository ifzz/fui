/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FJsonProcessor.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.tag.tool;

import com.hundsun.jres.fui.core.FContext;
import com.hundsun.jres.fui.core.FEnvironment;
import com.hundsun.jres.fui.core.FException;
import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.core.util.DataGetter;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-3 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FJsonProcessor extends FTagProcessor
{

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FTagProcessor#process()
	 */
	@Override
	public String process() throws FException
	{
		Object value = parameters.get("value");
		String var = DataGetter.getString(parameters.get("var"), "");
		var = var.trim();

		String result = null;
		try {
			result = FEnvironment.get().getJsonConvertor().obj2JSON(value);
		} catch (Exception e) {
			throw new FException(e);
		}

		if (var.length() == 0) {
			return result;
		}

		String scope = DataGetter.getString(parameters.get("scope"), "");
		scope = scope.trim();
		if (scope.length() == 0) {
			scope = "request";
		}
		int dScope = FContext.REQUEST_SCOPE;
		if (scope != null) {
			if ("request".equalsIgnoreCase(scope)) {
				dScope = FContext.REQUEST_SCOPE;
			} else if ("session".equalsIgnoreCase(scope)) {
				dScope = FContext.SESSION_SCOPE;
			} else if ("application".equalsIgnoreCase(scope)) {
				dScope = FContext.APPLICATION_SCOPE;
			}
		}
		fcontext.setAttribute(var, result, dScope);
		return "";
	}

}
