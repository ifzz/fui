/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FUIServiceServlet.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.web;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.hundsun.jres.fui.core.FContext;
import com.hundsun.jres.fui.core.FEnvironment;
import com.hundsun.jres.fui.core.FException;
import com.hundsun.jres.fui.core.te.TEData;
import com.hundsun.jres.fui.core.util.DataGetter;

/**
 * FUI处理Freemarker文件请求
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-3 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FUITemplateServlet extends HttpServlet
{
	private static final long	serialVersionUID	= 1L;
	private boolean				myResponsibility	= false;

	/*
	 * (non-Javadoc)
	 * @see javax.servlet.GenericServlet#init()
	 */
	@Override
	public void init() throws ServletException
	{
		myResponsibility = DefaultFUIInitializer.get().initialize(getServletContext());
	}

	/*
	 * (non-Javadoc)
	 * @see javax.servlet.GenericServlet#destroy()
	 */
	@Override
	public void destroy()
	{
		if (myResponsibility) {
			// 避免不必要的销毁
			DefaultFUIInitializer.get().destroy();
		}
	}

	/*
	 * (non-Javadoc)
	 * @see
	 * javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest
	 * , javax.servlet.http.HttpServletResponse)
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
	{
		doService(req, resp);
	}

	/*
	 * (non-Javadoc)
	 * @see
	 * javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest
	 * , javax.servlet.http.HttpServletResponse)
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
	{
		doService(req, resp);
	}

	@SuppressWarnings("unchecked")
	protected void doService(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
	{
		// 初始化上下文
		FContext context = getFContext(req, resp);
		context.setContextPath(req.getContextPath());
		// 获取要解析的文件名
		String url = requestUrlToTemplatePath(req);
		// 初始化数据容器
		TEData teData = new TEData();
		teData.setParameters(FHttpIn.calcParams(req));
		try {
			// 应答输出
			processResponse(resp);
			FEnvironment.get().getTemplateEngineWrapper().process(context, url, teData, resp.getWriter());
		} catch (FException e) {
			throw new ServletException(e);
		}
	}

	protected FContext getFContext(HttpServletRequest req, HttpServletResponse resp)
	{
		FContext context = new FContext(FEnvironment.get(), req, resp, getServletContext());
		return context;
	}

	private void processResponse(HttpServletResponse resp)
	{
		String charset = DataGetter.getString(FEnvironment.get().getProperty(FEnvironment.CONSTANT_I18N_ENCODING),
				"utf-8");
		resp.setCharacterEncoding(charset);
		resp.setContentType("text/html");
		resp.setHeader("Pragma", "No-cache");
		resp.setHeader("Cache-Control", "no-cache");
		resp.setDateHeader("Expires", 0L);
	}

	protected String requestUrlToTemplatePath(HttpServletRequest request)
	{
		// First, see if it is an included request
		String includeServletPath = (String) request.getAttribute("javax.servlet.include.servlet_path");
		if (includeServletPath != null) {
			// Try path info; only if that's null (servlet is mapped to an
			// URL extension instead of to prefix) use servlet path.
			String includePathInfo = (String) request.getAttribute("javax.servlet.include.path_info");
			return includePathInfo == null ? includeServletPath : includePathInfo;
		}
		// Seems that the servlet was not called as the result of a
		// RequestDispatcher.include(...). Try pathInfo then servletPath again,
		// only now directly on the request object:
		String path = request.getPathInfo();
		if (path != null)
			return path;
		path = request.getServletPath();
		if (path != null)
			return path;
		// Seems that it is a servlet mapped with prefix, and there was no extra
		// path info.
		return "";
	}

}
