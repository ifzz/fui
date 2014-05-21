/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FInitializer.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.web;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;

/**
 * FUI启动器
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-3 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public interface FInitializer
{
	/**
	 * 判断FUI是否已经启动
	 * @return true表示已经启动，false表示没有启动
	 */
	public boolean hasStarted();

	/**
	 * 尝试开启FUI，如果没有开启则开启，否则没有任何效果
	 * @param servletContext
	 *            servlet上下文
	 * @return 如果此次调用成功启动了FUI则返回true，如果FUI已经启动则返回false
	 * @throws ServletException
	 *             FUI启动失败的异常
	 */
	public boolean initialize(ServletContext servletContext) throws ServletException;

	/**
	 * 尝试销毁FUI，如果没有销毁则尝试销毁，否则没有任何效果
	 */
	public void destroy();

}
