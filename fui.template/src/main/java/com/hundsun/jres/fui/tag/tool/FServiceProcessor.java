/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FServiceProcessor.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.tag.tool;

import java.util.List;
import java.util.Map;

import com.hundsun.jres.fui.core.FContext;
import com.hundsun.jres.fui.core.FException;
import com.hundsun.jres.fui.core.FIn;
import com.hundsun.jres.fui.core.FOut;
import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.core.util.DataGetter;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-16 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FServiceProcessor extends FTagProcessor
{

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FTagProcessor#process()
	 */
	@Override
	public String process() throws FException
	{
		String serviceId = DataGetter.getString(parameters.get("serviceId"), "");
		String var = DataGetter.getString(parameters.get("var"), "result");
		String varType = DataGetter.getString(parameters.get("varType"), FContext.DM_IGNORE);
		String reqType = DataGetter.getString(parameters.get("reqType"), FContext.DM_IGNORE);
		String scope = DataGetter.getString(parameters.get("scope"), "request");
		String respMapping = DataGetter.getString(parameters.get("respMapping"), null);

		if (serviceId.length() == 0) {
			throw new FException("invalid serviceId is required");
		}
		if (var.length() == 0) {
			var = "result";
		}
		if (varType.length() == 0) {
			varType = FContext.DM_IGNORE;
		}
		if (reqType.length() == 0) {
			reqType = FContext.DM_IGNORE;
		}
		if (scope.length() == 0) {
			scope = "request";
		}

		// 解析请求参数
		FIn in = parseRequestParams(elementParams);
		in.setServiceId(serviceId);
		in.setRequestDM(reqType);
		in.setResponseDM(varType);
		in.setResponseMappings(respMapping);

		// 发起服务调用
		// TODO 设置服务调用的值，对于Data区域的值类型应该如何确认？
		FOut out = fcontext.callService(in);
		int dScope = FContext.CONTEXT_SCOPE;
		if (scope != null) {
			if ("request".equalsIgnoreCase(scope)) {
				dScope = FContext.REQUEST_SCOPE;
			} else if ("session".equalsIgnoreCase(scope)) {
				dScope = FContext.SESSION_SCOPE;
			} else if ("application".equalsIgnoreCase(scope)) {
				dScope = FContext.APPLICATION_SCOPE;
			}
		}
		fcontext.setAttribute(var, out, dScope);

		// 不需要像页面输出任何内容
		return "";
	}

	private FIn parseRequestParams(List<Map<String, Object>> elementParams)
	{
		FIn in = new FIn();
		if (elementParams != null) {
			int size = elementParams.size();
			for (int i = 0; i < size; i++) {
				Map<String, Object> item = elementParams.get(i);
				String name = (String) item.get("name");
				Object value = item.get("value");
				if (name != null && value != null) {
					in.addParam(name, value);
				}
			}
		}
		return in;
	}

}
