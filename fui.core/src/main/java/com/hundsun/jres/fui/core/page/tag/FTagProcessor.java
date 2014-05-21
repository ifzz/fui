/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FTagProcessor.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.page.tag;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.hundsun.jres.fui.core.FContext;
import com.hundsun.jres.fui.core.FException;

/**
 * 标签的处理器
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-13 <br>
 */
public class FTagProcessor
{
	/** FUI的运行时环境 */
	protected FContext					fcontext;
	/** 父亲处理器，主要用于存在嵌套关系的处理器，比如FTagWithElementsProcessorWrapper等，其他情况下，此值为null */
	protected FTagProcessor				parent;
	/** 参数列表 */
	protected Map<String, Object>		parameters;
	/** 标签的内部内容 */
	protected String					content;
	/** 内部标签的名字 */
	protected ArrayList<String>			elementNames;
	/** 内部标签的内容列表 */
	protected List<Map<String, Object>>	elementParams;
	/** 内部标签的内容列表 */
	protected List<String>				elementContents;
	/** 已经解析好的子节点内容 */
	protected ArrayList<String>			parsedElements;

	/**
	 * 注入FUI的上下文
	 * @param context
	 */
	public final void setFContext(FContext context)
	{
		fcontext = context;
	}

	/**
	 * 设置标签的参数列表
	 * @param parameters
	 *            参数列表
	 */
	public final void setParameters(Map<String, Object> parameters)
	{
		this.parameters = parameters;
	}

	/**
	 * 设置父亲处理器
	 * @param parent
	 *            父亲处理器
	 */
	public final void setParent(FTagProcessor parent)
	{
		this.parent = parent;
	}

	public void setContent(String content)
	{
		this.content = content;
	}

	public void setElementNames(ArrayList<String> elementNames)
	{
		this.elementNames = elementNames;
	}

	public void setElementParams(ArrayList<Map<String, Object>> elementParams)
	{
		this.elementParams = elementParams;
	}

	public void setElementContents(List<String> elementContents)
	{
		this.elementContents = elementContents;
	}

	public void setParsedElements(ArrayList<String> parsedElements)
	{
		this.parsedElements = parsedElements;
	}

	/**
	 * 处理标签的内容，并生成相应的页面文本
	 * @return
	 * @throws FException
	 */
	public String process() throws FException
	{
		return null;
	}

}
