/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FServiceTag.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.jsp.tag.tool;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithSubElements;
import com.hundsun.jres.fui.tag.tool.FServiceProcessor;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-12 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FServiceTag extends FTagWithSubElements
{
	private static final long	serialVersionUID	= 1L;

	/** 服务号 */
	private String				serviceId;
	/** 服务调用结果保存到的变量 */
	private String				var					= "result";
	/**
	 * 结果的存在形式：list、listsimple、pojo、page(int+list)、ignore，其中ignore表示忽略类型校验，
	 * 默认为ignore
	 */
	private String				varType				= "ignore";
	/** 服务结果需要保存到的作用域：request、session、page、application */
	private String				scope				= "request";
	private String				respMapping;

	public void setServiceId(String serviceId)
	{
		this.serviceId = serviceId;
	}

	public void setVar(String var)
	{
		this.var = var;
	}

	public void setVarType(String varType)
	{
		this.varType = varType;
	}

	public void setScope(String scope)
	{
		this.scope = scope;
	}

	public void setRespMapping(String respMapping)
	{
		this.respMapping = respMapping;
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
	 */
	public FTagProcessor getProcessor()
	{
		return new FServiceProcessor();
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#doBeforeEnd()
	 */
	public void doBeforeProcess()
	{
		parameters.put("serviceId", serviceId);
		parameters.put("var", var);
		parameters.put("varType", varType);
		parameters.put("scope", scope);
		parameters.put("respMapping", respMapping);
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FParamContainerTag#release()
	 */
	public void release()
	{
		super.release();
		serviceId = null;
		var = null;
		varType = null;
		scope = null;
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
	 */
	public String getName()
	{
		return "fservice";
	}

	/*
	 * (non-Javadoc)
	 * @see
	 * com.hundsun.jres.fui.jsp.FBaseJspSupport#isChildAllowed(java.lang.String)
	 */
	protected boolean isChildAllowed(String name)
	{
		if ("fservice-param".equals(name)) {
			return true;
		}
		return super.isChildAllowed(name);
	}
}
