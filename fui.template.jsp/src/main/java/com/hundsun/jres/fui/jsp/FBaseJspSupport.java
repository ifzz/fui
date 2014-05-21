/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FBaseTagSupport.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.jsp;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.PageContext;
import javax.servlet.jsp.tagext.BodyContent;
import javax.servlet.jsp.tagext.BodyTagSupport;
import javax.servlet.jsp.tagext.Tag;

import com.hundsun.jres.fui.core.FContext;
import com.hundsun.jres.fui.core.FEnvironment;
import com.hundsun.jres.fui.core.FException;
import com.hundsun.jres.fui.core.page.tag.FBaseTagSupport;
import com.hundsun.jres.fui.core.page.tag.FTagProcessor;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-3 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public abstract class FBaseJspSupport extends BodyTagSupport implements FBaseTagSupport
{
	private static final long				serialVersionUID		= 1L;

	public static final int					TAG_WITH_CONTENT		= 0;
	public static final int					TAG_WITHOUT_CONTENT		= 1;
	public static final int					TAG_WITH_SUB_ELEMENTS	= 2;

	private static final String				CURRENT_F_CONTEXT		= "fcontext";

	protected Map<String, Object>			parameters;
	/** 内部标签的名字 */
	private ArrayList<String>				elementNames;
	/** 内部标签的内容列表 */
	private ArrayList<Map<String, Object>>	elementParams;
	/** 内部标签的内容列表 */
	private ArrayList<String>				elementContents;
	/** 已经解析好的子节点内容 */
	private ArrayList<String>				parsedElements;

	protected ArrayList<String> getElementNames()
	{
		if (elementNames == null) {
			elementNames = new ArrayList<String>();
		}
		return elementNames;
	}

	protected ArrayList<Map<String, Object>> getElementParams()
	{
		if (elementParams == null) {
			elementParams = new ArrayList<Map<String, Object>>();
		}
		return elementParams;
	}

	protected ArrayList<String> getElementContents()
	{
		if (elementContents == null) {
			elementContents = new ArrayList<String>();
		}
		return elementContents;
	}

	protected ArrayList<String> getParsedElements()
	{
		if (parsedElements == null) {
			parsedElements = new ArrayList<String>();
		}
		return parsedElements;
	}

	/*
	 * (non-Javadoc)
	 * @see javax.servlet.jsp.tagext.BodyTagSupport#doStartTag()
	 */
	@Override
	public final int doStartTag() throws JspException
	{
		// 初始化FUI上下文环境
		initContext();
		parameters = new HashMap<String, Object>();

		return EVAL_BODY_BUFFERED;
	}

	/*
	 * (non-Javadoc)
	 * @see javax.servlet.jsp.tagext.BodyTagSupport#doInitBody()
	 */
	@Override
	public final void doInitBody() throws JspException
	{
		super.doInitBody();
	}

	/*
	 * (non-Javadoc)
	 * @see
	 * javax.servlet.jsp.tagext.BodyTagSupport#setBodyContent(javax.servlet.
	 * jsp.tagext.BodyContent)
	 */
	@Override
	public final void setBodyContent(BodyContent b)
	{
		// TODO Auto-generated method stub
		super.setBodyContent(b);
	}

	/*
	 * (non-Javadoc)
	 * @see javax.servlet.jsp.tagext.BodyTagSupport#doAfterBody()
	 */
	@Override
	public final int doAfterBody() throws JspException
	{
		// body只执行一遍
		return Tag.SKIP_BODY;
	}

	/*
	 * (non-Javadoc)
	 * @see javax.servlet.jsp.tagext.BodyTagSupport#doEndTag()
	 */
	@Override
	public final int doEndTag() throws JspException
	{
		try {
			// 前处理，主要用于设置参数
			doBeforeProcess();
			// 处理器处理
			FTagProcessor processor = getProcessor();
			processor.setParameters(parameters);
			processor.setFContext(getFContext());
			int type = getType();
			String content = null;
			if (bodyContent == null) {
				type = TAG_WITHOUT_CONTENT;
			}
			if (type == TAG_WITH_CONTENT) {
				content = bodyContent.getString();
			} else if (type == TAG_WITHOUT_CONTENT) {
				content = "";
			}
			if (content != null) {
				processor.setContent(content);
			} else {
				processor.setElementNames(elementNames);
				processor.setElementParams(elementParams);
				processor.setElementContents(elementContents);
				processor.setParsedElements(parsedElements);
			}
			String parsedContent = processor.process();

			Tag p = getParent();
			if (p != null && p instanceof FBaseJspSupport) {
				FBaseJspSupport parent = (FBaseJspSupport) p;
				String name = getName();
				if (parent.isChildAllowed(name)) {
					parent.getElementNames().add(name);
					parent.getElementParams().add(parameters);
					parent.getElementContents().add(content);
					parent.getParsedElements().add(parsedContent);
					return Tag.EVAL_PAGE;
				}
			}
			if (type == TAG_WITH_CONTENT) {
				bodyContent.getEnclosingWriter().write(parsedContent);
			} else if (type == TAG_WITHOUT_CONTENT || type == TAG_WITH_SUB_ELEMENTS) {
				pageContext.getOut().write(parsedContent);
			}
			return Tag.EVAL_PAGE;
		} catch (FException e) {
			throw new JspException(e);
		} catch (IOException e) {
			throw new JspException(e);
		} finally {
			release();
		}
	}

	/**
	 * 获取标签的名字，用于唯一标识一个标签
	 * @return 标签的名字
	 */
	public abstract String getName();

	/**
	 * 获取FUI的上下文环境
	 * @return FUI的上下文环境
	 */
	public final FContext getFContext()
	{
		return initContext();
	}

	/**
	 * 初始化FUI的上下文，如果该上下文还不存在则创建一个
	 */
	private final FContext initContext()
	{
		// PageContext.REQUEST_SCOPE中的变量，保证FContext在单次请求中，到应答返回浏览器（其中包括也转发）是同一个实例
		// 对于页面重定向，不在此REQUEST_SCOPE中，因此需要慎重使用重定向。
		FContext fcontext = (FContext) pageContext.getAttribute(CURRENT_F_CONTEXT, PageContext.REQUEST_SCOPE);
		if (fcontext == null) {
			fcontext = new FContext(FEnvironment.get(), pageContext.getRequest(), pageContext.getResponse(),
					pageContext.getServletContext()); // 新建一个FUI的上下文，并放到线程变量中
			pageContext.setAttribute(CURRENT_F_CONTEXT, fcontext, PageContext.REQUEST_SCOPE);
			fcontext.setContextPath(((HttpServletRequest) pageContext.getRequest()).getContextPath());
		}
		return fcontext;
	}

	/*
	 * (non-Javadoc)
	 * @see javax.servlet.jsp.tagext.BodyTagSupport#release()
	 */
	@Override
	public void release()
	{
		// !!! parameters 属性不能被销毁，否则可能造成参数值混乱
		// if (parameters != null) {
		// parameters.clear();
		// parameters = null;
		// }
		if (elementParams != null) {
			elementParams.clear();
			elementParams = null;
		}
		if (elementContents != null) {
			elementContents.clear();
			elementContents = null;
		}
		if (elementNames != null) {
			elementNames.clear();
			elementNames = null;
		}
		if (parsedElements != null) {
			parsedElements.clear();
			parsedElements = null;
		}
	}

	/**
	 * 判断是否调试模式
	 * @return true表示开发模式，需要有更多的调试信息；false，反之
	 */
	public final boolean isDevMode()
	{
		return getFContext().isDevMode();
	}

	/**
	 * 传入的tagName是否为子标签
	 * @param name
	 *            子标签名
	 * @return true表示允许，false表示不允许
	 */
	protected boolean isChildAllowed(String name)
	{
		return false;
	}

	protected abstract int getType();

	protected abstract void doBeforeProcess();
}
