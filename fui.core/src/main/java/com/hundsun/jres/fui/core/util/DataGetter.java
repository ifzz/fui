/*
 * 系统名称: ARES 应用快速开发企业套件
 * 模块名称: 公共工具
 * 类  名  称 : DataGetter.java
 * 软件版权: 杭州恒生电子股份有限公司
 * 相关文档:
 * 修改记录:
 * 修改日期      修改人员                     修改说明 <br>
 * ========     ======  ============================================
 *   
 * ========     ======  ============================================
 */

package com.hundsun.jres.fui.core.util;

/**
 * 做值类型的转换，将Object转换为指定类型，如果转换失败则返回默认值
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2010-8-2 <br>
 */
public class DataGetter
{

	/**
	 * 将Object的数据尽量转换为int，如果转换失败则采用默认值返回
	 * @param value
	 *            要转换的数据
	 * @param defaultValue
	 *            默认值
	 * @return 转换后的数据，如果无法转换，则返回默认值
	 */
	public static int getInt(Object value, int defaultValue)
	{
		int resultValue = defaultValue;
		if (value != null) {
			try {
				resultValue = Integer.valueOf(value.toString());
			} catch (NumberFormatException e) {
				// 防止异常抛出去，这里采用默认值
			}
		}

		return resultValue;
	}

	/**
	 * 将Object的对象尽量转换为boolean，如果转换失败则采用默认值返回
	 * @param value
	 *            要转换的数据
	 * @param defaultValue
	 *            默认值
	 * @return 转换后的数据，如果无法转换，则返回默认值
	 */
	public static boolean getBoolean(Object value, boolean defaultValue)
	{
		boolean resultValue = defaultValue;
		if (value != null) {
			resultValue = Boolean.valueOf(value.toString());
		}
		return resultValue;
	}

	/**
	 * 如果传入的String非空，则原样返回，否则返回默认值
	 * @param value
	 *            要转换的数据
	 * @param defaultValue
	 *            默认值
	 * @return 转换后的数据，如果无法转换，则返回默认值
	 */
	public static String getString(Object value, String def)
	{
		String resultValue = def;
		if (value != null) {
			resultValue = value.toString();
		}
		return resultValue;
	}
}
