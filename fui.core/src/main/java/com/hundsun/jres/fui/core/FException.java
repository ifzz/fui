/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FUIException.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core;

/**
 * 功能说明: FUI的非运行时异常
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-4-5 <br>
 */
public class FException extends Exception
{
	private static final long	serialVersionUID	= -2078720978783055967L;
	/** 错误号 */
	protected String			errorNo				= "-1";
	/** 错误信息 */
	protected String			errorInfo			= "";

	public FException(String errorInfo)
	{
		super(errorInfo);
		this.errorInfo = errorInfo;
	}

	public FException(String errorInfo, Throwable e)
	{
		super(errorInfo, e);
		this.errorInfo = errorInfo;
	}

	public FException(Throwable e)
	{
		this(e.getMessage(), e);
	}

	public FException(String errorNo, String errorInfo)
	{
		this(errorInfo);
		this.errorNo = errorNo;
	}

	public FException(String errorNo, String errorInfo, Throwable e)
	{
		this(errorInfo, e);
		this.errorNo = errorNo;
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
	public void setErrorNo(String errorNo)
	{
		this.errorNo = errorNo;
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
	public void setErrorInfo(String errorInfo)
	{
		this.errorInfo = errorInfo;
	}
}
