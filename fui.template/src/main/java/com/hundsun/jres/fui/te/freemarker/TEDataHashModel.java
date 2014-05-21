/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: TEDataHashModel.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.te.freemarker;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.hundsun.jres.fui.core.te.TEData;

import freemarker.template.ObjectWrapper;
import freemarker.template.SimpleHash;
import freemarker.template.TemplateModel;
import freemarker.template.TemplateModelException;

/**
 * 包装模板参数的hash模型
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-8 <br>
 */
public class TEDataHashModel extends SimpleHash
{
	private static final long				serialVersionUID	= 1L;
	private ServletContext					context;
	private HttpServletRequest				request;
	/** 模板数据 */
	private TEData							teData;
	private HashMap<String, TemplateModel>	unlistedModels		= new HashMap<String, TemplateModel>();

	public TEDataHashModel(TEData data, ObjectWrapper wrapper, ServletContext context, HttpServletRequest request)
			throws TemplateModelException
	{
		setObjectWrapper(wrapper);
		this.teData = data;
		this.context = context;
		this.request = request;

		// 内容
		String content = teData.getContent();
		if (content == null) {
			content = "";
		}
		unlistedModels.put("_nestedContent", wrap(content));

		// 内部标签参数列表
		List<Map<String, Object>> subTagParams = teData.getElementParams();
		if (subTagParams == null) {
			subTagParams = new ArrayList<Map<String, Object>>();
		}
		unlistedModels.put("_subTagParams", wrap(subTagParams));

		// 内部标签参数列表
		List<String> subTagNames = teData.getElementNames();
		if (subTagNames == null) {
			subTagNames = new ArrayList<String>();
		}
		unlistedModels.put("_subTagNames", wrap(subTagNames));

		// 内部标签的内容
		List<String> subTagContents = teData.getElementContents();
		if (subTagContents == null) {
			subTagContents = new ArrayList<String>();
		}
		unlistedModels.put("_subTagContents", wrap(subTagContents));

		// 内部标签解析之后的结果
		List<String> parsedElements = teData.getParsedElements();
		if (parsedElements == null) {
			parsedElements = new ArrayList<String>();
		}
		unlistedModels.put("_parsedElements", wrap(parsedElements));
	}

	/*
	 * (non-Javadoc)
	 * @see freemarker.template.SimpleHash#get(java.lang.String)
	 */
	@Override
	public TemplateModel get(String key) throws TemplateModelException
	{
		TEData data = this.teData;
		// Lookup in page scope
		TemplateModel model = super.get(key);
		if (model != null) {
			return model;
		}

		// 从缓存里面读取
		model = unlistedModels.get(key);
		if (model != null) {
			return model;
		}

		Map<String, Object> parameters = data.getParameters();
		if (parameters != null) {
			Object obj = parameters.get(key);
			if (obj != null) {
				TemplateModel m;
				if (obj instanceof Boolean) {
					m = wrap((Boolean) obj ? "true" : "false");
				} else {
					m = wrap(obj);
				}
				unlistedModels.put(key, m);
				return m;
			} else {
				if (parameters.containsKey(key)) {
					return wrap(null);
				}
			}
		}
		Map<String, Object> additionalParams = data.getAdditionalParams();
		if (additionalParams != null) {
			Object obj = additionalParams.get(key);
			if (obj != null) {
				TemplateModel m;
				if (obj instanceof Boolean) {
					m = wrap((Boolean) obj ? "true" : "false");
				} else {
					m = wrap(obj);
				}
				unlistedModels.put(key, m);
				return m;
			} else {
				if (additionalParams.containsKey(key)) {
					return wrap(null);
				}
			}
		}
		// Lookup in request scope
		if (request != null) {
			Object obj = request.getAttribute(key);
			if (obj != null) {
				return wrap(obj);
			}

			// Lookup in session scope
			HttpSession session = request.getSession(false);
			if (session != null) {
				obj = session.getAttribute(key);
				if (obj != null) {
					return wrap(obj);
				}
			}
		}

		if (context != null) {
			// Lookup in application scope
			Object obj = context.getAttribute(key);
			if (obj != null) {
				return wrap(obj);
			}
		}

		// return wrapper's null object (probably null).
		return wrap(null);
	}

	/**
	 * Stores a model in the hash so that it doesn't show up in <tt>keys()</tt>
	 * and <tt>values()</tt> methods. Used to put the Application, Session,
	 * Request, RequestParameters and JspTaglibs objects.
	 * @param key
	 *            the key under which the model is stored
	 * @param model
	 *            the stored model
	 */
	public void putUnlistedModel(String key, TemplateModel model)
	{
		unlistedModels.put(key, model);
	}

}
