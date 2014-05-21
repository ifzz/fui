/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: TEException.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.te;

import com.hundsun.jres.fui.core.FException;

/**
 * 模板引擎异常，比如解析过程中的异常等
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-6 <br>
 */
public class TEException extends FException
{
	private static final long	serialVersionUID	= 1L;

	public TEException(String errorInfo)
	{
		super(errorInfo);
	}

	public TEException(String errorInfo, Throwable e)
	{
		super(errorInfo, e);
	}

	public TEException(Throwable e)
	{
		super(e);
	}

	public TEException(String errorNo, String errorInfo)
	{
		super(errorNo, errorInfo);
	}

	public TEException(String errorNo, String errorInfo, Throwable e)
	{
		super(errorNo, errorInfo, e);
	}
}
