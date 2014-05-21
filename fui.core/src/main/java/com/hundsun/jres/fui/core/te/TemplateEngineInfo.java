/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: TemplateEngineInfo.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.te;

import java.util.HashMap;
import java.util.Properties;

import com.hundsun.jres.fui.core.version.Version;

/**
 * 模板引擎的配置信息
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-9-19 <br>
 */
public class TemplateEngineInfo
{
	/** 模板引擎的名字 */
	private String					name;
	/** 模板引擎的版本 */
	private Version					version;
	/** 类名 */
	private String					className;
	/** 初始化参数 */
	private HashMap<String, String>	initParams	= new HashMap<String, String>();

	public TemplateEngineInfo(Properties properties)
	{
		name = properties.getProperty("name");
		version = new Version(properties.getProperty("version", "0.0.0.0"));
		className = properties.getProperty("class");
	}

	public String getName()
	{
		return name;
	}

	public Version getVersion()
	{
		return version;
	}

	public String getClassName()
	{
		return className;
	}

	public HashMap<String, String> getInitParams()
	{
		return initParams;
	}

}
