/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: ActionWrapper.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.interceptor;

import com.hundsun.jres.fui.core.FIn;
import com.hundsun.jres.fui.core.FOut;

/**
 * action的包装器
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-28 <br>
 */
public interface ActionWrapper
{
	/**
	 * 执行Action
	 */
	FOut execute(FIn in);
}
