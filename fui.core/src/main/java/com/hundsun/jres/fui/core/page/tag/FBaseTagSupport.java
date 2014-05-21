/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FBaseTagSupport.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.page.tag;

import com.hundsun.jres.fui.core.FContext;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-12 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public interface FBaseTagSupport
{
    /**
     * 获取FUI的上下文
     * @return FUI上下文
     */
	FContext getFContext();

	/**
	 * 获取本标签的处理器，需要保证每次调用都是单实例，并且线程安全
	 * @return 标签处理器
	 */
	FTagProcessor getProcessor();
}
