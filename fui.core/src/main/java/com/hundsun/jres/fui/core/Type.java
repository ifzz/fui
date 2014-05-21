/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: Type.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-4-17 <br>
 */
public class Type
{
	private String	mockName;
	/** 前缀 */
	private String	prefix;
	/** 类型名 */
	private String	name;

	public Type(String name)
	{
		if (name == null) {
			throw new IllegalArgumentException("name is null");
		}
		name = name.trim();
		int index = name.indexOf(':');
		if (index == 0 || index == name.length() - 1) {
			throw new IllegalArgumentException("invalid type name[" + name + "]");
		}
		if (index == -1) {
			this.name = name;
		} else {
			this.prefix = name.substring(0, index);
			this.name = name.substring(index + 1);
		}
		this.mockName = name;
	}

	public Type(String prefix, String name)
	{
		if (name == null) {
			throw new IllegalArgumentException("name is null");
		}
		this.name = name;
		if (prefix != null) {
			this.prefix = prefix;
			this.mockName = prefix + ":" + name;
		} else {
			this.mockName = name;
		}
	}

	/*
	 * (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString()
	{
		return mockName;
	}

	public boolean isGlobal()
	{
		if (prefix == null) {
			return true;
		} else {
			return false;
		}
	}

	/*
	 * (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj)
	{
		if (obj == null || !(obj instanceof Type)) {
			return false;
		}
		if (mockName.equals(obj.toString())) {
			return true;
		} else {
			return false;
		}
	}

	/*
	 * (non-Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode()
	{
		return mockName.hashCode();
	}

	/**
	 * @return the prefix
	 */
	public String getPrefix()
	{
		return prefix;
	}

	/**
	 * @return the name
	 */
	public String getName()
	{
		return name;
	}
}