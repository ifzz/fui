/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: TEData.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.te;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 当前模板引擎中的数据
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-6 <br>
 */
public class TEData
{
	/** 标签的属性列表 */
	private Map<String, Object>			parameters;
	/** 如果没有子标签，本标签的内容 */
	private String						content;
	/** 如果存在子标签，所有子标签的参数列表 */
	private List<Map<String, Object>>	elementParams;
	/** 如果存在子标签，所有子标签内容列表 */
	private List<String>				elementContents;
	/** 已经解析好的子节点内容 */
	private ArrayList<String>			parsedElements;
	/** 所有子标签的名字 */
	private ArrayList<String>			elementNames;
	/** 额外的参数 */
	private Map<String, Object>			additionalParams;

	public Map<String, Object> getParameters()
	{
		return parameters;
	}

	public void setParameters(Map<String, Object> parameters)
	{
		this.parameters = parameters;
	}

	public String getContent()
	{
		return content;
	}

	public void setContent(String content)
	{
		this.content = content;
	}

	public List<Map<String, Object>> getElementParams()
	{
		return elementParams;
	}

	public void setElementParams(List<Map<String, Object>> elementParams)
	{
		this.elementParams = elementParams;
	}

	public List<String> getElementContents()
	{
		return elementContents;
	}

	public void setElementContents(List<String> elementContents)
	{
		this.elementContents = elementContents;
	}

	public ArrayList<String> getParsedElements()
	{
		return parsedElements;
	}

	public void setParsedElements(ArrayList<String> parsedElements)
	{
		this.parsedElements = parsedElements;
	}

	public ArrayList<String> getElementNames()
	{
		return elementNames;
	}

	public void setElementNames(ArrayList<String> elementNames)
	{
		this.elementNames = elementNames;
	}

	public Map<String, Object> getAdditionalParams()
	{
		return additionalParams;
	}

	public void addAdditionalParam(String key, Object value)
	{
		if (additionalParams == null) {
			additionalParams = new HashMap<String, Object>();
		}
		additionalParams.put(key, value);
	}

}
