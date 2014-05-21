/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FOut.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core;

import java.io.Serializable;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-4-12 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
@JsonIgnoreProperties({ "context" })
public class FOut implements Serializable
{
	private static final long	serialVersionUID	= 1L;

	/** 服务的输出结果 */
	private Object				data;
	/** 错误码 */
	private int					returnCode			= 0;
	/** 错误号 */
	private String				errorNo				= "0";
	/** 错误信息 */
	private String				errorInfo			= "";
	/** 上下文 */
	private transient FContext	context;

	private FOut()
	{
	}

	private FOut(Object data)
	{
		this.data = data;
	}

	public FOut(FOut other)
	{
		this.data = other.data;
		this.returnCode = other.returnCode;
		this.errorNo = other.errorNo;
		this.errorInfo = other.errorInfo;
		this.context = other.context;
	}

	/*
	 * (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append('{');
		sb.append("returnCode:" + returnCode);
		sb.append(",errorNo:" + errorNo);
		sb.append(",errorInfo:" + errorInfo);
		sb.append(",data:" + data);
		sb.append('}');
		return sb.toString();
	}

	/**
	 * @return the out
	 */
	public Object getData()
	{
		return data;
	}

	/**
	 * @param out
	 *            the out to set
	 */
	public FOut setData(Object out)
	{
		this.data = out;
		return this;
	}

	/**
	 * @return the returnCode
	 */
	public int getReturnCode()
	{
		return returnCode;
	}

	/**
	 * @param returnCode
	 *            the returnCode to set
	 */
	public FOut setReturnCode(int returnCode)
	{
		this.returnCode = returnCode;
		return this;
	}

	/**
	 * @return the errorNo
	 */
	public String getErrorNo()
	{
		return errorNo;
	}

	/**
	 * @param errorNo
	 *            the errorNo to set
	 */
	public FOut setErrorNo(String errorNo)
	{
		if (errorNo == null) {
			return this;
		}
		this.errorNo = errorNo;
		if (returnCode == 0 && !errorNo.equals("0")) {
			returnCode = -1;
		}
		return this;
	}

	/**
	 * @return the errorInfo
	 */
	public String getErrorInfo()
	{
		return errorInfo;
	}

	/**
	 * @param errorInfo
	 *            the errorInfo to set
	 */
	public FOut setErrorInfo(String errorInfo)
	{
		this.errorInfo = errorInfo;
		return this;
	}

	public FContext getContext()
	{
		return context;
	}

	public void setContext(FContext context)
	{
		this.context = context;
	}

	public static FOut getOut(int returnCode, String errorNo, String errorInfo)
	{
		FOut out = new FOut();
		out.setErrorNo(errorNo);
		out.setErrorInfo(errorInfo);
		out.setReturnCode(returnCode);
		return out;
	}

	public static FOut getOut(Object data)
	{
		return new FOut(data);
	}
}
