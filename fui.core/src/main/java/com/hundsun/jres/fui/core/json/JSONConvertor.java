/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: JSONConvertor.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.json;

/**
 * JSON转换器
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-2 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public interface JSONConvertor
{
	/**
	 * 将对象转换为JSON格式的字串
	 * @param object
	 *            对象
	 * @return JSON格式的字串
	 */
	public String obj2JSON(Object object) throws Exception;

	/**
	 * 将JSON格式的字串转换为对象
	 * @param json
	 *            JSON格式的字串
	 * @return 对象
	 */
	public Object JSON2obj(String json, Class clz) throws Exception;
}
