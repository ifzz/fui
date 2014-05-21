/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: ResComponent.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.resource;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-20 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class ResComponent
{
	/** 组件名 */
	private String	name;
	/** 组件路径 */
	private String	compPath;
	/** 带min的组件路径 */
	private String	minCompPath;

	public final String getPath(boolean devMode)
	{
		if (devMode) {
			return compPath != null ? compPath : minCompPath;
		} else {
			return minCompPath != null ? minCompPath : compPath;
		}
	}

	/*
	 * (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		sb.append('{');
		sb.append("name:" + name);
		sb.append(",path:" + compPath);
		sb.append(",minPath:" + minCompPath);
		sb.append('}');
		return sb.toString();
	}

	/*
	 * (non-Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode()
	{
		return name.hashCode();
	}

	public ResComponent(String name)
	{
		this.name = name;
	}

	public String getName()
	{
		return name;
	}

	public String getCompPath()
	{
		return compPath;
	}

	public void setCompPath(String compPath)
	{
		this.compPath = compPath;
	}

	public String getMinCompPath()
	{
		return minCompPath;
	}

	public void setMinCompPath(String minCompPath)
	{
		this.minCompPath = minCompPath;
	}
}
