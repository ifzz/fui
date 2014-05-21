/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FRequest.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * 功能说明: FUI请求的数据结构
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-4-12 <br>
 */
public class FIn implements Serializable
{
	private static final long		serialVersionUID	= 1L;
	/** 请求的数据模型 */
	public static final String		$_DM_REQUEST		= "_reqType";
	/** 应答的数据模型 */
	public static final String		$_DM_RESPONSE		= "_resultType";

	/** 请求参数 */
	protected Map					params				= new HashMap();
	/** 服务号 */
	protected String				serviceId;
	/** 请求的数据模型 */
	protected String				requestDM			= FContext.DM_IGNORE;
	/** 应答的数据模型 */
	protected String				responseDM			= FContext.DM_IGNORE;
	/** 应答的参数映射列表，格式类似于 “id=userId,pid=supperId,text=desc” */
	protected String				responseMappings;
	/** 上下文 */
	protected transient FContext	context;

	/*
	 * (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString()
	{
		return "{serviceId:" + serviceId + ",requestDM:" + requestDM + ",responseDM:" + responseDM + ",params:"
				+ params + "}";
	}

	/**
	 * 获取请求参数
	 * @param name
	 *            参数名
	 * @return 参数值
	 */
	public Object getParameter(String name)
	{
		return params.get(name);
	}

	/**
	 * 获取请求的Map形式
	 * @return 请求
	 */
	public Map getParameterMap()
	{
		return params;
	}

	/**
	 * 添加一个请求参数
	 * @param key
	 *            参数名
	 * @param value
	 *            参数值
	 */
	public void addParam(String key, Object value)
	{
		params.put(key, value);
	}

	/**
	 * 移除一个请求参数
	 * @param key
	 *            参数名
	 */
	public void removeParam(String key)
	{
		params.remove(key);
	}

	public Map getParams()
	{
		return params;
	}

	public void setParams(Map params)
	{
		this.params = params;
	}

	public String getServiceId()
	{
		return serviceId;
	}

	public void setServiceId(String serviceId)
	{
		this.serviceId = serviceId;
	}

	public String getRequestDM()
	{
		return requestDM;
	}

	public void setRequestDM(String requestDM)
	{
		this.requestDM = requestDM;
	}

	public String getResponseDM()
	{
		return responseDM;
	}

	public void setResponseDM(String responseDM)
	{
		this.responseDM = responseDM;
	}

	public String getResponseMappings()
	{
		return responseMappings;
	}

	public void setResponseMappings(String responseMappings)
	{
		this.responseMappings = responseMappings;
	}

	public FContext getContext()
	{
		return context;
	}

	public void setContext(FContext context)
	{
		this.context = context;
	}

}
