/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: DataModel.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core;

import java.util.ArrayList;
import java.util.List;

/**
 * 功能说明: 数据模型基类，用于标示数据结构
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-4-16 <br>
 */
public class DataModel
{
	public static final String		F_JSON			= "f_json";
	public static final String		F_LIST			= "f_list";
	public static final String		F_OBJECT		= "f_obj";
	public static final String		F_TREE			= "f_tree";
	public static final String		F_PAGE			= "f_page";
	public static final String		F_DEFAULT		= "f_default";

	public static final DataModel	F_DM_DEFAULT	= new DataModel(F_DEFAULT);
	public static final DataModel	F_DM_JSON		= new DataModel(F_JSON);
	public static final DataModel	F_DM_LIST;
	public static final DataModel	F_DM_OBJECT = new DataModel(DataModel.F_OBJECT);
	public static final DataModel	F_DM_TREE;
	public static final DataModel	F_DM_PAGE;

	static {
		F_DM_LIST = new DataModel(DataModel.F_LIST);
		F_DM_LIST.addParameter(Parameter.PARAM_MATCH_ALL);

        F_DM_OBJECT.addParameter(Parameter.PARAM_MATCH_ALL);

		F_DM_TREE = new DataModel(DataModel.F_TREE);
		F_DM_TREE.addParameter(new Parameter("id", null, "fui:string"));
		F_DM_TREE.addParameter(new Parameter("pid", null, "fui:string"));
		F_DM_TREE.addParameter(new Parameter("text", null, "fui:string"));
		F_DM_TREE.addParameter(Parameter.PARAM_MATCH_ALL);

		F_DM_PAGE = new DataModel(DataModel.F_PAGE);
		F_DM_PAGE.addParameter(new Parameter("totalCount", null, "fui:int"));
		DataModel list = new DataModel(DataModel.F_LIST);
		list.setName("dataList");
		list.addParameter(Parameter.PARAM_MATCH_ALL);
		F_DM_PAGE.addDataModel(list);
	}

	/** 数据模型的id */
	protected String				id;
	/** 父亲类型id */
	protected String				parentId;
	/** 数据模型对象的名字 */
	protected String				name;
	/** 数据模型参数 */
	protected ArrayList<Parameter>	params			= new ArrayList<Parameter>();
	/** 嵌套数据模型 */
	protected ArrayList<DataModel>	children		= new ArrayList<DataModel>();

	public DataModel()
	{
	}

	public DataModel(String id)
	{
		if (id == null) {
			throw new IllegalArgumentException("id is null");
		}
		this.id = id;
	}

	/**
	 * @return the name
	 */
	public String getName()
	{
		return name;
	}

	/**
	 * @param name
	 *            the name to set
	 */
	public void setName(String name)
	{
		this.name = name;
	}

	public boolean hasName()
	{
		return (name != null) && (name.length() != 0);
	}

	/**
	 * @return the params
	 */
	public List<Parameter> getParams()
	{
		return params;
	}

	public void addParameter(Parameter param)
	{
		params.add(param);
	}

	public boolean hasParameters()
	{
		return params.size() != 0;
	}

	/**
	 * @return the children
	 */
	public List<DataModel> getDataModels()
	{
		return children;
	}

	public void addDataModel(DataModel dm)
	{
		children.add(dm);
	}

	public boolean hasSubDatamodel()
	{
		return children.size() != 0;
	}

	/**
	 * @return the type
	 */
	public String getId()
	{
		return id;
	}

	/**
	 * @return the parentId
	 */
	public String getParentId()
	{
		return parentId;
	}

	/**
	 * @param parentId
	 *            the parentId to set
	 */
	public void setParentId(String parentId)
	{
		this.parentId = parentId;
	}

}
