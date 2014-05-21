/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FLOG.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-1 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FLOG
{
	private static final SimpleDateFormat	dateformat	= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss,SSS");

	public static void info(String msg)
	{
		System.out.println(DATE() + " INFO - " + msg);
	}

	public static void debug(String msg)
	{
		System.out.println(DATE() + " DEBUG -" + msg);
	}

	public static void warn(String msg)
	{
		System.out.println(DATE() + " WARN -" + msg);
	}

	public static void error(String msg)
	{
		System.out.println(DATE() + " ERROR -" + msg);
	}

	private static String DATE()
	{
		String str = dateformat.format(new Date());
		return "[" + str + "]";
	}

	public static void main(String[] args)
	{
		FLOG.info("这是 info 日志");
	}
}
