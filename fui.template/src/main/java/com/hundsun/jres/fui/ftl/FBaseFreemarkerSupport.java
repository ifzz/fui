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

package com.hundsun.jres.fui.ftl;

import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Map;
import java.util.Stack;

import com.hundsun.jres.fui.core.FContext;
import com.hundsun.jres.fui.core.page.tag.FBaseTagSupport;
import com.hundsun.jres.fui.core.page.tag.FTagProcessor;

import freemarker.core.Environment;
import freemarker.template.TemplateDirectiveBody;
import freemarker.template.TemplateDirectiveModel;
import freemarker.template.TemplateException;
import freemarker.template.TemplateModel;

/**
 * Freemarker引擎基类
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-3 <br>
 */
public abstract class FBaseFreemarkerSupport implements TemplateDirectiveModel, FBaseTagSupport
{
	public static final int							TAG_WITH_CONTENT		= 0;
	public static final int							TAG_WITHOUT_CONTENT		= 1;
	public static final int							TAG_WITH_SUB_ELEMENTS	= 2;

	/** 当前的环境变量 */
	private Environment								env						= null;
	/** 元素堆栈 */
	protected static ThreadLocal<Stack<StackItem>>	parentStack				= new ThreadLocal<Stack<StackItem>>()
																			{
																				protected Stack<StackItem> initialValue()
																				{
																					return new Stack<StackItem>();
																				}
																			};

	/*
	 * (non-Javadoc)
	 * @see freemarker.template.TemplateDirectiveModel#execute(freemarker.core.
	 * Environment, java.util.Map, freemarker.template.TemplateModel[],
	 * freemarker.template.TemplateDirectiveBody)
	 */
	public void execute(Environment env, Map params, TemplateModel[] loopVars, TemplateDirectiveBody directiveBody)
			throws TemplateException, IOException
	{

		try {
			// 保存本节点的父亲节点
			StackItem parentItem = getParent();
			// 将本节点压入堆栈
			StackItem self = pushSelf();
			// 前处理，主要用于设置参数
			self.setParameters(params);

			this.env = env;
			int type = getType();
			FTagProcessor processor = getProcessor();
			processor.setFContext(getFContext());
			processor.setParameters(self.getParameters());
			// 执行内容
			String content = "";
			if (directiveBody != null) {
				// 执行子标签
				StringWriter sw = new StringWriter();
				directiveBody.render(sw);
				content = sw.toString();
			}
			processor.setContent(content);
			if (type == TAG_WITH_SUB_ELEMENTS) {
				processor.setContent(content);
				processor.setElementNames(self.getElementNames());
				processor.setElementParams(self.getElementParams());
				processor.setElementContents(self.getElementContents());
				processor.setParsedElements(self.getParsedElements());
			}

			String parsedContent = processor.process();

			if (parentItem != null) {
				FBaseFreemarkerSupport parent = (FBaseFreemarkerSupport) parentItem.getInstance();
				String name = getName();
				if (parent.isChildAllowed(name)) {
					// 不直接输出，将所有信息缓存
					parentItem.getElementNames().add(name);
					parentItem.getElementParams().add(self.getParameters());
					parentItem.getElementContents().add(content);
					parentItem.getParsedElements().add(parsedContent);
					return;
				}
			}
			// 将处理之后的结果直接输出
			env.getOut().write(parsedContent);
		} catch (Exception e) {
			throw new TemplateException(e, env);
		} finally {
			popSelf();
		}
	}

	private StackItem pushSelf()
	{
		StackItem item = new StackItem(this);
		return parentStack.get().push(item);
	}

	private StackItem popSelf()
	{
		return parentStack.get().pop();
	}

	/**
	 * method comments here
	 * @return
	 */
	private StackItem getParent()
	{
		Stack<StackItem> stack = parentStack.get();
		if (stack.size() != 0) {
			return parentStack.get().peek();
		} else {
			return null;
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
		return FContext.getCurrentContext();
	}

	/**
	 * 获取当前Freemarker运行时环境
	 * @return Freemarker运行时环境变量
	 */
	public final Environment getEnvironment()
	{
		return env;
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

	private class StackItem
	{
		private FBaseFreemarkerSupport			instance;
		private Map<String, Object>				parameters;
		/** 内部标签的名字 */
		private ArrayList<String>				elementNames;
		/** 内部标签的内容列表 */
		private ArrayList<Map<String, Object>>	elementParams;
		/** 内部标签的内容列表 */
		private ArrayList<String>				elementContents;
		/** 已经解析好的子节点内容 */
		private ArrayList<String>				parsedElements;

		public StackItem(FBaseFreemarkerSupport instance)
		{
			this.instance = instance;
		}

		/**
		 * method comments here
		 */
		public void clear()
		{
			instance = null;
			parameters = null;
			elementNames = null;
			elementParams = null;
			elementContents = null;
			parsedElements = null;
		}

		public void setParameters(Map<String, Object> parameters)
		{
			this.parameters = parameters;
		}

		public FBaseFreemarkerSupport getInstance()
		{
			return instance;
		}

		public Map<String, Object> getParameters()
		{
			if (elementParams == null) {
				elementParams = new ArrayList<Map<String, Object>>();
			}
			return parameters;
		}

		public ArrayList<String> getElementNames()
		{
			if (elementNames == null) {
				elementNames = new ArrayList<String>();
			}
			return elementNames;
		}

		public ArrayList<Map<String, Object>> getElementParams()
		{
			if (elementParams == null) {
				elementParams = new ArrayList<Map<String, Object>>();
			}
			return elementParams;
		}

		public ArrayList<String> getElementContents()
		{
			if (elementContents == null) {
				elementContents = new ArrayList<String>();
			}
			return elementContents;
		}

		public ArrayList<String> getParsedElements()
		{
			if (parsedElements == null) {
				parsedElements = new ArrayList<String>();
			}
			return parsedElements;
		}
	}
}
