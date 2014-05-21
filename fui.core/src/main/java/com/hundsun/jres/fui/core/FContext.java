/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FContext.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 20130216    hanyin    增加兼容jres的DataServlet的数据模型DM_JRES
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.hundsun.jres.fui.core.interceptor.ActionWrapper;
import com.hundsun.jres.fui.core.interceptor.ServiceInvocation;

/**
 * 功能说明: FUI的服务调用上下文
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-3-31 <br>
 */
public final class FContext implements Cloneable, Serializable
{
	private static final long				serialVersionUID	= 3884617902278971108L;

	// FUI上下文区域，此上下文与REQUEST_SCOPE的生命周期一致，但是无法在JSP页面中直接通过EL表达式获取
	public static final int					CONTEXT_SCOPE		= 1;

	// 请求区域
	public static final int					REQUEST_SCOPE		= 2;

	// 回话区域
	public static final int					SESSION_SCOPE		= 3;

	// 应用程序区域
	public static final int					APPLICATION_SCOPE	= 4;

	/** 类似于list&lt;pojo&gt;的类型 ，一般作为应答的数据模型 */
	public static final String				DM_LIST				= "list";
	/** 类似于list&lt;简单类型&gt; */
	public static final String				DM_LIST_SIMPLE		= "listsimple";
	/** 类似于map&lt;String,Object&gt;类型，一般作为请求的数据类型 */
	public static final String				DM_POJO				= "pojo";
	/** 类似于JRES分页形式的数据结构 int + list，一般作为Grid组件分页的数据模型 */
	public static final String				DM_PAGE				= "page";
	/** 树形的数据模型 */
	public static final String				DM_TREE				= "tree";
	/** 忽略类型校验，是什么则返回什么，请求和应答的默认数据模型 */
	public static final String				DM_IGNORE			= "ignore";
	/** 支持请求为JSON，参数名固定为 'jsonParam' */
	public static final String				DM_JSON				= "json";
	/** 返回jres2.0的DataServlet的简单数据类型，支持多数据集 */
	// { add 20130216 hanyin 增加兼容jres的DataServlet的数据模型
	public static final String				DM_JRES				= "jres";
	// } end add 20130216 hanyin

	/** HTTP请求 */
	private HttpServletRequest				request;
	/** HTTP应答 */
	private HttpServletResponse				response;
	/** WEB工程路径 */
	private String							contextPath;
	/** Http Servlet上下文 */
	private ServletContext					servletContext;

	/** 上下文中的属性 */
	private Map<String, Object>				properties			= new HashMap<String, Object>();
	/** 运行时环境 */
	private FEnvironment					environment;

	protected static ThreadLocal<FContext>	currentContext		= new ThreadLocal<FContext>();

	/** 缓存服务执行包装器 */
	private ActionWrapper					actionWrapper		= new ServiceActionWrapper();

	/**
	 * 请在servlet或者第一次调用模板前调用此方法获取FContext实例，而不要使用getCurrentContext()方法，
	 * 否则会造成FContext实例混乱
	 * @param environment
	 *            当前的FUI环境变量
	 * @param servletRequest
	 *            HTTP请求
	 * @param servletResponse
	 *            HTTP应答
	 * @param servletContext
	 *            Servlet上下文
	 */
	public FContext(FEnvironment environment, ServletRequest servletRequest, ServletResponse servletResponse,
			ServletContext servletContext)
	{
		this.environment = environment;
		this.request = (HttpServletRequest) servletRequest;
		this.response = (HttpServletResponse) servletResponse;
		this.servletContext = servletContext;
		currentContext.set(this);
	}

	/**
	 * 获取当前的FContext实例，线程安全（在解析页面开始，请慎重使用此方法），本方法只会被FUI框架所调用
	 * 如果在servlet或者filter中请使用new FContext(...)构造方法
	 * @return 当前线程中的FContext实例
	 */
	@Deprecated
	public static FContext getCurrentContext()
	{
		return currentContext.get();
	}

	/**
	 * TODO 复制构造函数，暂不提供
	 * @param other
	 *            待拷贝的上下文
	 */
	// public FContext(FContext other)
	// {
	// this.environment = other.environment;
	//
	// if (other.properties != null) {
	// this.properties.putAll(other.properties);
	// }
	// }

	/**
	 * 获取HTTP请求，没有则返回null
	 * @return HTTP请求
	 */
	public HttpServletRequest getHttpRequest()
	{
		return request;
	}

	/**
	 * 获取HTTP应答
	 * @return HTTP应答
	 */
	public HttpServletResponse getHttpResponse()
	{
		return response;
	}

	/**
	 * 获取Servlet上下文
	 * @return Servlet上下文
	 */
	public ServletContext getServletContext()
	{
		return servletContext;
	}

	/**
	 * @return the properties
	 */
	public Map<String, Object> getProperties()
	{
		return new HashMap<String, Object>(properties);
	}

	/**
	 * 获取指定属性的值
	 * @param name
	 *            属性名
	 * @return 属性值
	 */
	public Object getProperty(String name)
	{
		Object obj = properties.get(name);
		return obj;
	}

	/**
	 * 设置属性
	 * @param name
	 *            属性名
	 * @param prop
	 *            属性值
	 */
	public void setProperty(String name, Object prop)
	{
		this.properties.put(name, prop);
	}

	/**
	 * 判断是否存在指定的属性
	 * @param name
	 *            属性名
	 * @return 属性值
	 */
	public boolean hasProperty(String name)
	{
		return properties.containsKey(name);
	}

	/**
	 * 移除指定的属性
	 * @param name
	 *            属性名
	 * @return 属性值
	 */
	public Object removeProperty(String name)
	{
		return properties.remove(name);
	}

	/**
	 * @return the environment
	 */
	public FEnvironment getEnvironment()
	{
		return environment;
	}

	/** 是否是开发模式（调试模式），在此模式下会有更详细的日志 */
	private Boolean	isDebugMode	= null;

	/**
	 * 是否是调试模式
	 * @return true 表示调试模式（开发模式），false表示正常模式
	 */
	public boolean isDevMode()
	{
		if (isDebugMode == null) {
			Boolean debug = null;

			// 判断此次请求是否设置了调试开关
			HttpServletRequest request = getHttpRequest();
			if (request != null) {
				String sDebug = request.getParameter("fui.devMode");
				if (sDebug != null) {
					debug = Boolean.parseBoolean(sDebug);
				}
			}
			if (debug == null) {
				// 根据系统环境变量，获取调试开关
				Object oDebug = environment.getProperty(FEnvironment.CONSTANT_DEBUG);
				if (oDebug != null) {
					debug = Boolean.parseBoolean(oDebug.toString());
				}
			}
			// 默认为false
			if (debug == null) {
				debug = false;
			}
			setDevMode(debug);
		}
		return isDebugMode;
	}

	public void setDevMode(boolean b)
	{
		isDebugMode = b;
	}

	/**
	 * 调用服务，并调用拦截器
	 * @param in
	 *            服务请求参数
	 * @return 服务应答
	 */
	public FOut callService(FIn in)
	{
		in.setContext(this);
		// 返回应答
		FOut out = ServiceInvocation.callService(in, actionWrapper, FEnvironment.get().getInterceptors());
		out.setContext(this);
		return out;
	}

	/**
	 * 设置FUI属性，默认在REQUEST_SCOPE区域
	 * @param name
	 *            属性名
	 * @param value
	 *            属性值
	 */
	public void setAttribute(String name, Object value)
	{
		setAttribute(name, value, CONTEXT_SCOPE);
	}

	/**
	 * 设置FUI属性，并指定作用域
	 * @param name
	 *            属性名
	 * @param value
	 *            属性值
	 * @param scope
	 *            属性的作用范围
	 */
	public void setAttribute(String name, Object value, int scope)
	{
		if (scope == CONTEXT_SCOPE) {
			setProperty(name, value);
		} else if (scope == REQUEST_SCOPE) {
			request.setAttribute(name, value);
		} else if (scope == SESSION_SCOPE) {
			request.getSession().setAttribute(name, value);
		} else if (scope == APPLICATION_SCOPE) {
			servletContext.setAttribute(name, value);
		}
	}

	/**
	 * 获取属性
	 * @param name
	 *            属性名
	 * @return 属性值
	 */
	public Object getAttribute(String name)
	{
		Object result = null;
		result = getProperty(name);
		if (result == null && request != null) {
			result = request.getAttribute(name);
		}
		if (result == null && request != null) {
			HttpSession session = request.getSession();
			if (session != null) {
				result = session.getAttribute(name);
			}
		}
		if (result == null && servletContext != null) {
			result = servletContext.getAttribute(name);
		}
		return result;
	}

	public Object getAttribute(String name, int scope)
	{
		Object result = null;
		if (scope == CONTEXT_SCOPE) {
			result = getProperty(name);
		} else if (scope == REQUEST_SCOPE) {
			if (request != null) {
				result = request.getAttribute(name);
			}
		} else if (scope == SESSION_SCOPE) {
			if (request != null) {
				HttpSession session = request.getSession();
				if (session != null) {
					result = session.getAttribute(name);
				}
			}
		} else if (scope == APPLICATION_SCOPE) {
			if (servletContext != null) {
				result = servletContext.getAttribute(name);
			}
		}
		return result;
	}

	public String getContextPath()
	{
		if (contextPath == null && environment != null) {
			return environment.getContextPath();
		}
		return contextPath;
	}

	public void setContextPath(String contextPath)
	{
		this.contextPath = contextPath;
		if (environment != null && environment.getContextPath() == null) {
			environment.setContextPath(contextPath);
		}
	}

	private static class ServiceActionWrapper implements ActionWrapper
	{
		/*
		 * (non-Javadoc)
		 * @see
		 * com.hundsun.jres.fui.core.interceptor.ActionWrapper#execute(com.hundsun
		 * .jres.fui.core.FIn)
		 */
		public FOut execute(FIn in)
		{
			return FEnvironment.get().getServiceClient().callService(in);
		}

	}

}
