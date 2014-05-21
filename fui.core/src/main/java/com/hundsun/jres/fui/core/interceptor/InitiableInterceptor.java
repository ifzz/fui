/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: Interceptor.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 20130221    hanyin   Interceptor接口增加带map参数的init方法
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.interceptor;

/**
 * 需要初始化的拦截器
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-28 <br>
 */
public abstract class InitiableInterceptor implements Interceptor
{
	/**
	 * 初始化请求参数
	 * @param params
	 *            请求参数
	 * @throws Exception
	 *             抛出异常则会造成FUI启动失败
	 */
	public abstract void init(String params) throws Exception;

}
