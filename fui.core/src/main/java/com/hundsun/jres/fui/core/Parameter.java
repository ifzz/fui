/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: Parameter.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core;

/**
 * 功能说明: 数据模型中参数的描述
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-4-16 <br>
 */
public class Parameter
{
	public static final Parameter	PARAM_MATCH_ALL	= new Parameter("*");

	/** 参数名 */
	private String					id;
	/** 原始参数名 */
	private String					mapping;
	/** 参数类型 */
	private Type					type;

	public Parameter()
	{
	}

	public Parameter(String id)
	{
		this.id = id;
	}

	public Parameter(String id, String mapping, String type)
	{
		this.id = id;
		this.mapping = mapping;

		if (type != null) {
			this.type = new Type(type);
		}
	}

	public Parameter(String id, String mapping, Type type)
	{
		this.id = id;
		this.mapping = mapping;
		this.type = type;
	}

	/**
	 * @return the id
	 */
	public String getId()
	{
		return id;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	public void setId(String id)
	{
		this.id = id;
	}

	/**
	 * @return the mapping
	 */
	public String getMapping()
	{
		return mapping;
	}

	/**
	 * @param mapping
	 *            the mapping to set
	 */
	public void setMapping(String mapping)
	{
		this.mapping = mapping;
	}

	/**
	 * @return the type
	 */
	public Type getType()
	{
		return type;
	}

	/**
	 * @param type
	 *            the type to set
	 */
	public void setType(Type type)
	{
		this.type = type;
	}

}
