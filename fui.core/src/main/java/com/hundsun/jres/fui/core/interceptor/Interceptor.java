/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: Interceptor.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.interceptor;


/**
 * 拦截器接口定义
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-28 <br>
 */
public interface Interceptor
{
	/**
	 * 调用拦截器
	 * @param invocation
	 * @return
	 */
	public Object intercept(ServiceInvocation invocation);
}
