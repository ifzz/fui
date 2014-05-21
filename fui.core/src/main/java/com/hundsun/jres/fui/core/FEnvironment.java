/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FEnvironment.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;

import com.hundsun.jres.fui.core.interceptor.Interceptor;
import com.hundsun.jres.fui.core.json.JSONConvertor;
import com.hundsun.jres.fui.core.json.JacksonJSONConvertor;
import com.hundsun.jres.fui.core.resource.FResourceManager;
import com.hundsun.jres.fui.core.te.TemplateEngineWrapper;

/**
 * 功能说明:FUI配置的全局共享，运行时状态数据，除了getProperty方法之外,所有的方法都是同步方法，保证线程安全，
 * getProperty方法不保证线程安全
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-3-31 <br>
 */
public final class FEnvironment
{

	// {! 系统常量定义，可以通过配置文件来指定
	/** 开发模式，打印更多日志信息 */
	public static final String		CONSTANT_DEBUG					= "fui.devMode";
	/** 指定Web应用的默认编码集,相当于调用HttpServletRequest的setCharacterEncoding方法. */
	public static final String		CONSTANT_I18N_ENCODING			= "fui.i18n.encoding";
	/** 默认本地化. */
	public static final String		CONSTANT_DEFAULT_LOCALE			= "fui.i18n.default.locale";
	/** 国际化配置（相对于classpath），按照配置顺序查找. */
	public static final String		CONSTANT_CUSTOM_i18n_RESOURCES	= "fui.custom.i18n.resources";
	/** 皮肤路径配置，按照配置顺序查找. */
	public static final String		CONSTANT_CUSTOM_THEMES			= "fui.custom.themes";
	/** 组件js路径，按照配置顺序查找. */
	public static final String		CONSTANT_CUSTOM_COMPONENTS		= "fui.custom.components";
	/** jquery版指定，可以通过此参数更换jquery的版本. */
	public static final String		CONSTANT_CUSTOM_JS_JQUERY		= "fui.custom.js.jquery";
	/** FUI核心js指定. */
	public static final String		CONSTANT_CUSTOM_JS_CORE			= "fui.custom.js.core";
	/** 指定屏蔽浏览器差异的核心css. */
	public static final String		CONSTANT_CUSTOM_CSS_CORE		= "fui.custom.css.core";
	/** FUI在运行时的国际化. */
	public static final String		CONSTANT_RUNTIME_CONTEXT_PATH	= "fui.runtime.contextPath";
	/** 是否开启FUI主题管理器 . */
	public static final String		CONSTANT_RUNTIME_THEME_ENABLE	= "fui.runtime.theme.enable";
	/** FUI在运行时的主题回调. */
	public static final String		CONSTANT_RUNTIME_THEME			= "fui.runtime.theme";
	/** 是否开启FUI国际化资源管理器. */
	public static final String		CONSTANT_RUNTIME_I18N_ENABLE	= "fui.runtime.i18n.enable";
	/** FUI在运行时的国际化. */
	public static final String		CONSTANT_RUNTIME_I18N			= "fui.runtime.i18n";
	// }!

	/** FUI的初始化器 */
	public static final String		F_INITIALIZER					= "F_INITIALIZER";
	/** FUI启动的时间，单位毫秒 */
	public static final String		F_START_TIME					= "F_START_TIME";
	/** FUI工程当前根目录的绝对路径. */
	public static final String		F_ROOT_PATH						= "F_ROOT_PATH";

	/** 日志实例的名字 */
	public static final String		LOG_NAME						= "FUI";

	/** 空属性占位 */
	public static final Object		NULL_PROPERTY					= new byte[0];

	/** 单例 */
	private static FEnvironment		instance						= new FEnvironment();
	/** 属性容器 */
	private Map<String, Object>		properties						= new HashMap<String, Object>();
	/** 资源管理器 */
	private FResourceManager		resourceManager;
	/** JSON转换器 */
	private JSONConvertor			jsonConvertor					= new JacksonJSONConvertor();
	/** 是否是开发模式 */
	private boolean					devMode							= false;
	/** Servlet的上下文路径 */
	private String					contextPath;
	/** 服务调用API */
	private FServiceClient			serviceClient;
	/** 拦截器列表 */
	private List<Interceptor>		interceptors;
	/** 当前的Servlet上下文 */
	private ServletContext			servletContext;
	/** 模板引擎包装器 */
	private TemplateEngineWrapper	templateEngineWrapper;

	/**
	 * 获取运行时环境实例，单例
	 * @return 运行时环境实例
	 */
	public static FEnvironment get()
	{
		return instance;
	}

	/**
	 * 从FUI运行时环境中获取指定的属性，如果没有对应的属性，则返回null
	 * @param name
	 *            属性名
	 * @return 属性的值，如果不存在则返回 null
	 */
	public Object getProperty(String name)
	{
		return properties.get(name);
	}

	/**
	 * 从运行时环境中移除指定的属性，如果存在则返回属性的值，否则返回null
	 * @param name
	 *            属性名
	 * @return 移除的属性的值，如果不存在则返回null
	 */
	synchronized public Object removeProperty(String name)
	{
		return properties.remove(name);
	}

	/**
	 * 设置属性名已经对应的属性的值，如果该属性已经存在则覆盖原有属性的值，并返回原属性
	 * @param name
	 *            属性名
	 * @param pro
	 *            新属性的值
	 * @return 原属性的值，如果不存在则返回null
	 */
	synchronized public Object setProperty(String name, Object pro)
	{
		return properties.put(name, pro);
	}

	synchronized public void clear()
	{
		properties.clear();
	}

	/**
	 * 获取资源管理器接口
	 * @return 资源管理器接口
	 */
	public FResourceManager getResourceManager()
	{
		return resourceManager;
	}

	public void setResourceManager(FResourceManager resourceManager)
	{
		this.resourceManager = resourceManager;
	}

	public boolean isDevMode()
	{
		return devMode;
	}

	public void setDevMode(boolean devMode)
	{
		this.devMode = devMode;
	}

	/**
	 * 获取工程名，格式如下“/FUI”，不会出现“/FUI/”的情况
	 * @return 工程名
	 */
	public String getContextPath()
	{
		return contextPath;
	}

	public void setContextPath(String contextPath)
	{
		this.contextPath = contextPath;
	}

	/**
	 * 获取服务调用API
	 * @return 服务调用API
	 */
	public FServiceClient getServiceClient()
	{
		return serviceClient;
	}

	public void setServiceClient(FServiceClient serviceClient)
	{
		this.serviceClient = serviceClient;
	}

	public List<Interceptor> getInterceptors()
	{
		return interceptors;
	}

	public void setInterceptors(List<Interceptor> interceptors)
	{
		this.interceptors = interceptors;
	}

	public ServletContext getServletContext()
	{
		return servletContext;
	}

	public void setServletContext(ServletContext servletContext)
	{
		this.servletContext = servletContext;
	}

	public JSONConvertor getJsonConvertor()
	{
		return jsonConvertor;
	}

	public void setJsonConvertor(JSONConvertor jsonConvertor)
	{
		this.jsonConvertor = jsonConvertor;
	}

	public TemplateEngineWrapper getTemplateEngineWrapper()
	{
		return templateEngineWrapper;
	}

	public void setTemplateEngineWrapper(TemplateEngineWrapper templateEngineWrapper)
	{
		this.templateEngineWrapper = templateEngineWrapper;
	}
}
