/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FResourceNotExistException.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.exception;

import com.hundsun.jres.fui.core.FException;

/**
 * 资源文件不存在的异常
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-6 <br>
 */
public class FSrcNotExistException extends FException
{
	private static final long	serialVersionUID	= 1L;
	/** 不存在的资源文件名 */
	private String				srcName;

	/**
	 * @param errorNo
	 * @param errorInfo
	 */
	public FSrcNotExistException(String resourceName)
	{
		super("fui_404", "resource not exsit [" + resourceName + "]");
		this.srcName = resourceName;
	}

	public String getSrcName()
	{
		return srcName;
	}

}
