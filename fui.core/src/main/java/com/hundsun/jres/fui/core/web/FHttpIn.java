/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FHttpIn.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.web;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;

import com.hundsun.jres.fui.core.FIn;

/**
 * HTTP请求用的FIn实现
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-3 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FHttpIn extends FIn
{
	private static final long	serialVersionUID	= 1L;

	public static final String	PARAM_REQUEST_TYPE	= "_reqType";
	public static final String	PARAM_RESPONSE_TYPE	= "_respType";
	public static final String	PARAM_RESP_MAPPING	= "_respMapping";

	public FHttpIn(HttpServletRequest req)
	{
		// 请求的数据模型
		String requestDM = req.getParameter(PARAM_REQUEST_TYPE);
		super.setRequestDM(requestDM);
		// 应答数据模型
		String responseDM = req.getParameter(PARAM_RESPONSE_TYPE);
		super.setResponseDM(responseDM);
		// 应答参数映射关系
		String respMapping = req.getParameter(PARAM_RESP_MAPPING);
		super.setResponseMappings(respMapping);
		// 服务号
		super.setServiceId(calcServiceId(req));
		// 请求参数
		super.setParams(calcParams(req));
	}

	public static Map calcParams(HttpServletRequest req)
	{
		Map reqMap = req.getParameterMap();
		HashMap<String, Object> result = new HashMap<String, Object>(reqMap.size());
		Iterator it = reqMap.entrySet().iterator();
		while (it.hasNext()) {
			Entry entity = (Entry) it.next();
			String key = entity.getKey().toString();
			Object value = entity.getValue();
			if (value == null) {
				continue;
			}
			if (value instanceof String[]) {
				String[] strs = (String[]) value;
				if (strs.length == 1) {
					result.put(key, strs[0]);
				} else if (strs.length == 0) {
					result.put(key, "");
				} else {
					result.put(key, strs);
				}
			} else {
				result.put(key, value);
			}
		}
		result.remove(PARAM_REQUEST_TYPE);
		result.remove(PARAM_RESPONSE_TYPE);
		result.remove(PARAM_RESP_MAPPING);
		return result;
	}

	/**
	 * 根据请求的URL计算出服务号
	 * @param req
	 *            http请求
	 * @return 服务号（带后缀）
	 */
	private String calcServiceId(HttpServletRequest req)
	{
		// /f.fservice
		String serviceId = req.getServletPath();
		// .f.fservice
		serviceId = serviceId.replace('/', '.');
		// f.fservice
		return serviceId.substring(1);
	}

}
