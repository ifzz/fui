/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: ChannelInfo.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.channel;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.hundsun.jres.fui.core.version.Version;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-4-13 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
class ChannelInfo
{
	/** 通道的名字 */
	private String				channelName;
	/** 通道的版本 */
	private Version				version;
	/** 通道的类名 */
	private String				className;
	/** 服务标识的后缀，用于路由 */
	private String				suffix;
	/** 初始化参数 */
	private Map<String, String>	params	= new HashMap<String, String>();
	/** 通道的实例 */
	private IServiceChannel		channelInstance;
	/** 拦截器名列表 */
	private List<String>		interceptors;

	/**
	 * @return the channelName
	 */
	public String getChannelName()
	{
		return channelName;
	}

	/**
	 * @param channelName
	 *            the channelName to set
	 */
	public void setChannelName(String channelName)
	{
		this.channelName = channelName;
	}

	/**
	 * @return the version
	 */
	public Version getVersion()
	{
		return version;
	}

	/**
	 * @param version
	 *            the version to set
	 */
	public void setVersion(Version version)
	{
		this.version = version;
	}

	/**
	 * @return the className
	 */
	public String getClassName()
	{
		return className;
	}

	/**
	 * @param className
	 *            the className to set
	 */
	public void setClassName(String className)
	{
		this.className = className;
	}

	public String getSuffix()
	{
		return suffix;
	}

	public void setSuffix(String suffix)
	{
		this.suffix = suffix;
	}

	/**
	 * @return the params
	 */
	public Map<String, String> getParams()
	{
		return params;
	}

	/**
	 * @param params
	 *            the params to set
	 */
	public void setParams(Map<String, String> params)
	{
		this.params = params;
	}

	/**
	 * @return the channelInstance
	 */
	public IServiceChannel getChannelInstance()
	{
		return channelInstance;
	}

	/**
	 * @param channelInstance
	 *            the channelInstance to set
	 */
	public void setChannelInstance(IServiceChannel channelInstance)
	{
		this.channelInstance = channelInstance;
	}

	public List<String> getInterceptors()
	{
		return interceptors;
	}

	public void setInterceptors(List<String> interceptors)
	{
		this.interceptors = interceptors;
	}

	/*
	 * (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString()
	{
		return ("{channelName[" + channelName + "],suffix[" + suffix + "],version[" + version + "],clz[" + className
				+ "], params[" + params + "],interceptors[" + interceptors + "]}");
	}
}
