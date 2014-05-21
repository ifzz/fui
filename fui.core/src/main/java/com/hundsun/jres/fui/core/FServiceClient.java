/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FServiceClient.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core;

/**
 * 调用服务的统一方法，所有的实现都不会抛出异常
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-4-1 <br>
 */
public interface FServiceClient
{
	/**
	 * 服务调用API
	 * @param in
	 *            输入
	 * @return 输出
	 */
	public FOut callService(FIn in);
}
