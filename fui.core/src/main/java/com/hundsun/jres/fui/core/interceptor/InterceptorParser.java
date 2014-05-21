/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: InterceptorParser.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.interceptor;

import java.util.HashMap;
import java.util.Map;

import com.hundsun.jres.fui.core.xml.Tag;

/**
 * 功能说明: 解析xml标签并生成拦截器实例
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2013-2-22 <br>
 */
public class InterceptorParser
{
	private static Map<String, String>	mapping	= new HashMap<String, String>();

	static {
		mapping.put("f-sessionInterceptor", "com.hundsun.jres.fui.core.interceptor.SessionInterceptor");
	}

	/**
	 * 解析在fui-config.xml中配置的拦截器tag
	 */
	public static Interceptor parseByXml(Tag tag) throws Exception
	{
		String clzName = tag.getProperty("class");
		String shortName = tag.getProperty("name");
		String params = null;
		Tag paramTag = tag.getSubTagByName("param-value");
		if (paramTag != null) {
			params = paramTag.getContent();
		}
		if (clzName != null && clzName.length() != 0) { // 根据class初始化
			return parseByClass(clzName, params);
		} else if (shortName != null && shortName.length() != 0) { // 根据shortName初始化
			return parseByName(shortName, params);
		}
		return null;
	}

	/**
	 * 根据shortName找到相应的拦截器实例，然后使用params中的参数进行初始化
	 */
	public static Interceptor parseByName(String shortName, String params) throws Exception
	{
		String clzName = mapping.get(shortName);
		if (clzName == null || clzName.length() == 0) {
			throw new Exception("No interceptor short for [" + shortName + "].");
		}
		return parseByClass(clzName, params);
	}

	/**
	 * 实例化clzName，并使用params初始化拦截器
	 */
	public static Interceptor parseByClass(String clzName, String params) throws Exception
	{
		if (clzName == null || clzName.length() == 0) { // 无用的class名字，忽略
			return null;
		}
		Class<?> clz = Class.forName(clzName);
		Interceptor interceptor = (Interceptor) clz.newInstance();
		if (interceptor instanceof InitiableInterceptor) {
			((InitiableInterceptor) interceptor).init(params);
		}
		return interceptor;
	}
}
