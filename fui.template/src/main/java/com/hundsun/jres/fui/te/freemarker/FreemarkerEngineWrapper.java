/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FreemarkerEngineWrapper.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.te.freemarker;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.io.Writer;
import java.net.URL;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hundsun.jres.fui.core.FContext;
import com.hundsun.jres.fui.core.FEnvironment;
import com.hundsun.jres.fui.core.FException;
import com.hundsun.jres.fui.core.te.TEData;
import com.hundsun.jres.fui.core.te.TemplateEngineWrapper;
import com.hundsun.jres.fui.core.util.DataGetter;
import com.hundsun.jres.fui.core.util.FResourceResolver;
import com.hundsun.jres.fui.core.util.URLBean;

import freemarker.cache.ClassTemplateLoader;
import freemarker.cache.FileTemplateLoader;
import freemarker.cache.MultiTemplateLoader;
import freemarker.cache.TemplateLoader;
import freemarker.cache.WebappTemplateLoader;
import freemarker.core.Configurable;
import freemarker.template.Configuration;
import freemarker.template.ObjectWrapper;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import freemarker.template.TemplateExceptionHandler;
import freemarker.template.TemplateModel;
import freemarker.template.TemplateModelException;
import freemarker.template.utility.StringUtil;

/**
 * Freemarker模板引擎包装器
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-6 <br>
 */
public class FreemarkerEngineWrapper implements TemplateEngineWrapper
{
	private static final String	RESOURCE_PATH											= "fui.custom.templateEngine.ftl.filepath";

	private final String		F_COMP_FILE												= "classpath*:ftemplate/*fcomponents.properties";
	private final String		F_COMP_EXTEND_FILE										= "classpath*:ftemplate/*fcomponents-extend.properties";
	/** 日志实例 */
	private Logger				LOG														= LoggerFactory
																								.getLogger(FEnvironment.LOG_NAME);
	private Configuration		config;
	protected boolean			debug;
	private ObjectWrapper		wrapper;
	private String				templatePath;

	private static final String	INITPARAM_TEMPLATE_PATH									= "TemplatePath";
	private static final String	INITPARAM_DEBUG											= "Debug";

	private static final String	DEPR_INITPARAM_TEMPLATE_DELAY							= "TemplateDelay";
	private static final String	DEPR_INITPARAM_ENCODING									= "DefaultEncoding";
	private static final String	DEPR_INITPARAM_OBJECT_WRAPPER							= "ObjectWrapper";
	private static final String	DEPR_INITPARAM_WRAPPER_SIMPLE							= "simple";
	private static final String	DEPR_INITPARAM_WRAPPER_BEANS							= "beans";
	private static final String	DEPR_INITPARAM_WRAPPER_JYTHON							= "jython";
	private static final String	DEPR_INITPARAM_TEMPLATE_EXCEPTION_HANDLER				= "TemplateExceptionHandler";
	private static final String	DEPR_INITPARAM_TEMPLATE_EXCEPTION_HANDLER_RETHROW		= "rethrow";
	private static final String	DEPR_INITPARAM_TEMPLATE_EXCEPTION_HANDLER_DEBUG			= "debug";
	private static final String	DEPR_INITPARAM_TEMPLATE_EXCEPTION_HANDLER_HTML_DEBUG	= "htmlDebug";
	private static final String	DEPR_INITPARAM_TEMPLATE_EXCEPTION_HANDLER_IGNORE		= "ignore";
	private static final String	DEPR_INITPARAM_DEBUG									= "debug";

	/*
	 * (non-Javadoc)
	 * @see
	 * com.hundsun.jres.fui.core.page.TemplateEngineWrapper#init(java.util.Map)
	 */
	public void init(Map<String, String> params) throws Exception
	{
		// 参看Freemarker提供的servlet中的初始化方式，支持除INITPARAM_TEMPLATE_PATH之外的所有初始化参数
		doFreemarkerInit(params);

		// 查看
		doFuiInit(params);
	}

	protected void doFreemarkerInit(Map<String, String> params) throws Exception
	{
		// Set defaults:
		config = new Configuration();
		config.setTemplateExceptionHandler(TemplateExceptionHandler.HTML_DEBUG_HANDLER);
		// 设置默认编码为UTF-8
		config.setDefaultEncoding(DataGetter.getString(
				FEnvironment.get().getProperty(FEnvironment.CONSTANT_I18N_ENCODING), "utf-8"));

		// Process object_wrapper init-param out of order:
		wrapper = createObjectWrapper(params);
		if (LOG.isInfoEnabled() && FEnvironment.get().isDevMode()) {
			LOG.info("Using object wrapper of class " + wrapper.getClass().getName());
		}
		config.setObjectWrapper(wrapper);

		// Process TemplatePath init-param out of order:
		templatePath = params.get(INITPARAM_TEMPLATE_PATH);
		// config.setTemplateLoader(createTemplateLoader(templatePath));

		// Process all other init-params:
		Iterator<Entry<String, String>> initpnames = params.entrySet().iterator();
		while (initpnames.hasNext()) {
			Entry<String, String> it = initpnames.next();
			String name = it.getKey();
			String value = it.getValue();

			if (name.equals(DEPR_INITPARAM_OBJECT_WRAPPER) || name.equals(Configurable.OBJECT_WRAPPER_KEY)
					|| name.equals(INITPARAM_TEMPLATE_PATH)) {
				// ignore: we have already processed these
			} else if (name.equals(DEPR_INITPARAM_ENCODING)) { // BC
				if (params.get(Configuration.DEFAULT_ENCODING_KEY) != null) {
					throw new FException("Conflicting init-params: " + Configuration.DEFAULT_ENCODING_KEY + " and "
							+ DEPR_INITPARAM_ENCODING);
				}
				config.setDefaultEncoding(value);
			} else if (name.equals(DEPR_INITPARAM_TEMPLATE_DELAY)) { // BC
				if (params.get(Configuration.TEMPLATE_UPDATE_DELAY_KEY) != null) {
					throw new FException("Conflicting init-params: " + Configuration.TEMPLATE_UPDATE_DELAY_KEY
							+ " and " + DEPR_INITPARAM_TEMPLATE_DELAY);
				}
				try {
					config.setTemplateUpdateDelay(Integer.parseInt(value));
				} catch (NumberFormatException e) {
					// Intentionally ignored
				}
			} else if (name.equals(DEPR_INITPARAM_TEMPLATE_EXCEPTION_HANDLER)) { // BC
				if (params.get(Configurable.TEMPLATE_EXCEPTION_HANDLER_KEY) != null) {
					throw new FException("Conflicting init-params: " + Configurable.TEMPLATE_EXCEPTION_HANDLER_KEY
							+ " and " + DEPR_INITPARAM_TEMPLATE_EXCEPTION_HANDLER);
				}

				if (DEPR_INITPARAM_TEMPLATE_EXCEPTION_HANDLER_RETHROW.equals(value)) {
					config.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
				} else if (DEPR_INITPARAM_TEMPLATE_EXCEPTION_HANDLER_DEBUG.equals(value)) {
					config.setTemplateExceptionHandler(TemplateExceptionHandler.DEBUG_HANDLER);
				} else if (DEPR_INITPARAM_TEMPLATE_EXCEPTION_HANDLER_HTML_DEBUG.equals(value)) {
					config.setTemplateExceptionHandler(TemplateExceptionHandler.HTML_DEBUG_HANDLER);
				} else if (DEPR_INITPARAM_TEMPLATE_EXCEPTION_HANDLER_IGNORE.equals(value)) {
					config.setTemplateExceptionHandler(TemplateExceptionHandler.IGNORE_HANDLER);
				} else {
					throw new FException("Invalid value for servlet init-param "
							+ DEPR_INITPARAM_TEMPLATE_EXCEPTION_HANDLER + ": " + value);
				}
			} else if (name.equals(DEPR_INITPARAM_DEBUG)) { // BC
				if (params.get(INITPARAM_DEBUG) != null) {
					throw new FException("Conflicting init-params: " + INITPARAM_DEBUG + " and " + DEPR_INITPARAM_DEBUG);
				}
				debug = StringUtil.getYesNo(value);
			} else if (name.equals(INITPARAM_DEBUG)) {
				debug = StringUtil.getYesNo(value);
			} else {
				try {
					config.setSetting(name, value);
				} catch (Exception e) {
					// 如果设置失败，则忽略
				}
			}
		} // while initpnames
	}

	protected void doFuiInit(Map<String, String> params) throws Exception
	{
		// 设置多个模板加载器
		ArrayList<TemplateLoader> loaders = getTemplateLoaders();
		TemplateLoader loader = config.getTemplateLoader();
		if (loader != null) {
			loaders.add(loader);
		}
		MultiTemplateLoader multiLoader = new MultiTemplateLoader(loaders.toArray(new TemplateLoader[0]));
		config.setTemplateLoader(multiLoader);
		// 使freemarker将null解释为空的字符串
		config.setClassicCompatible(true);

		// config.setTemplateUpdateDelay(2);

		// 从配置文件加载FUI扩展的组件
		loadDirective();
	}

	/**
	 * 加载FUI组件和扩展的方法和指令
	 */
	private void loadDirective()
	{
		ArrayList<URL> urls = new ArrayList<URL>();
		// 获取FUI组件和自定义方法、指令
		urls.addAll(loadFuiDirective());
		// 获取用户扩展的组件和自定义方法和指令
		urls.addAll(loadExtendDirective());

		Properties properties = new Properties();
		for (URL url : urls) {
			InputStream is = null;
			try {
				is = url.openStream();
				properties.load(url.openStream());
			} catch (Exception e) {
				// 记录日志并忽略
				LOG.error("Load Ftl properties config file [ " + url + "] has error", e);
			} finally {
				try {
					if (is != null) {
						is.close();
					}
				} catch (IOException e) {
					// 忽略文件关闭错误
				}
				is = null;
			}
		}
		Iterator<Entry<Object, Object>> it = properties.entrySet().iterator();
		while (it.hasNext()) {
			Entry<Object, Object> entity = it.next();
			String key = DataGetter.getString(entity.getKey(), "");
			String value = DataGetter.getString(entity.getValue(), "");
			if (key.length() == 0 || value.length() == 0) {
				continue;
			}
			try {
				Object directive = Class.forName(value).newInstance();
				config.setSharedVariable(key, directive);
			} catch (Exception e) {
				LOG.error("Failed to instantialize FTL Directive[" + key + "], skip it.", e);
			}
		}
	}

	private ArrayList<URL> loadFuiDirective()
	{
		ArrayList<URL> urls = new ArrayList<URL>();
		FResourceResolver resolver = new FResourceResolver(FEnvironment.class.getClassLoader());
		Enumeration<URLBean> enumeration = null;
		try {
			enumeration = resolver.getResources(F_COMP_FILE);
		} catch (Exception e) {
			LOG.error("Search [" + F_COMP_FILE + "] has error", e);
		}

		if (enumeration.hasMoreElements()) {
			URLBean bean = enumeration.nextElement();
			urls.add(bean.getUrl());
		}
		return urls;
	}

	private ArrayList<URL> loadExtendDirective()
	{
		ArrayList<URL> urls = new ArrayList<URL>();
		FResourceResolver resolver = new FResourceResolver(FEnvironment.class.getClassLoader());
		Enumeration<URLBean> enumeration = null;
		try {
			enumeration = resolver.getResources(F_COMP_EXTEND_FILE);
		} catch (Exception e) {
			LOG.error("search [" + F_COMP_FILE + "] has error", e);
		}

		if (enumeration.hasMoreElements()) {
			URLBean bean = enumeration.nextElement();
			urls.add(bean.getUrl());
		}
		return urls;
	}

	/**
	 * 获取内部模板源和扩展模板源的模板加载器的列表，如果相应的模板加载路径不存在，则忽略该模板加载器
	 */
	private ArrayList<TemplateLoader> getTemplateLoaders() throws Exception
	{
		templatePath = DataGetter.getString(FEnvironment.get().getProperty(RESOURCE_PATH), this.templatePath);
		if (templatePath == null) {
			templatePath = "/FUI-extend/templates/ftl,/FUI/templates/ftl,/,class://templates/ftl";
		}

		ArrayList<TemplateLoader> loaders = new ArrayList<TemplateLoader>();
		String[] paths = templatePath.split("[,]");
		for (String path : paths) {
			if (path.trim().length() != 0) {
				try {
					TemplateLoader loader = createTemplateLoader(path);
					loaders.add(loader);
				} catch (Exception e) {
					LOG.warn("Template path is invalid [" + path + "], skipped it.", e);
				}
			}
		}
		// 将classpath加入到引擎加载器中
		loaders.add(createTemplateLoader("class://"));
		return loaders;
	}

	/**
	 * Create the template loader. The default implementation will create a
	 * {@link ClassTemplateLoader} if the template path starts with "class://",
	 * a {@link FileTemplateLoader} if the template path starts with "file://",
	 * and a {@link WebappTemplateLoader} otherwise.
	 * @param templatePath
	 *            the template path to create a loader for
	 * @return a newly created template loader
	 * @throws IOException
	 */
	private TemplateLoader createTemplateLoader(String templatePath) throws IOException
	{
		if (templatePath.startsWith("class://")) {
			// substring(7) is intentional as we "reuse" the last slash
			return new ClassTemplateLoader(getClass(), templatePath.substring(7));
		} else {
			if (templatePath.startsWith("file://")) {
				templatePath = templatePath.substring(7);
				return new FileTemplateLoader(new File(templatePath));
			} else {
				return new WebappTemplateLoader(FEnvironment.get().getServletContext(), templatePath);
			}
		}
	}

	/**
	 * This method is called from doFreemarkerInit() to create the FreeMarker
	 * object wrapper object that this servlet will use for adapting request,
	 * session, and servlet context attributes into template models.. This is a
	 * hook that allows you to custom-configure the wrapper object in a
	 * subclass. The default implementation returns a wrapper that depends on
	 * the value of <code>ObjectWrapper</code> init parameter. If
	 * <code>simple</code> is specified, {@link ObjectWrapper#SIMPLE_WRAPPER} is
	 * used; if <code>jython</code> is specified,
	 * {@link freemarker.ext.jython.JythonWrapper} is used. In every other case
	 * {@link ObjectWrapper#DEFAULT_WRAPPER} is used.
	 */
	protected ObjectWrapper createObjectWrapper(Map<String, String> params)
	{
		String wrapper = params.get(DEPR_INITPARAM_OBJECT_WRAPPER);
		if (wrapper != null) { // BC
			if (params.get(Configurable.OBJECT_WRAPPER_KEY) != null) {
				throw new RuntimeException("Conflicting init-params: " + Configurable.OBJECT_WRAPPER_KEY + " and "
						+ DEPR_INITPARAM_OBJECT_WRAPPER);
			}
			if (DEPR_INITPARAM_WRAPPER_BEANS.equals(wrapper)) {
				return ObjectWrapper.BEANS_WRAPPER;
			}
			if (DEPR_INITPARAM_WRAPPER_SIMPLE.equals(wrapper)) {
				return ObjectWrapper.SIMPLE_WRAPPER;
			}
			if (DEPR_INITPARAM_WRAPPER_JYTHON.equals(wrapper)) {
				// Avoiding compile-time dependency on Jython package
				try {
					return (ObjectWrapper) Class.forName("freemarker.ext.jython.JythonWrapper").newInstance();
				} catch (InstantiationException e) {
					throw new InstantiationError(e.getMessage());
				} catch (IllegalAccessException e) {
					throw new IllegalAccessError(e.getMessage());
				} catch (ClassNotFoundException e) {
					throw new NoClassDefFoundError(e.getMessage());
				}
			}
			// return BeansWrapper.getDefaultInstance();
			return ObjectWrapper.DEFAULT_WRAPPER;
		} else {
			wrapper = params.get(Configurable.OBJECT_WRAPPER_KEY);
			if (wrapper == null) {
				// return BeansWrapper.getDefaultInstance();
				return ObjectWrapper.DEFAULT_WRAPPER;
			} else {
				try {
					config.setSetting(Configurable.OBJECT_WRAPPER_KEY, wrapper);
				} catch (TemplateException e) {
					throw new RuntimeException(e.toString());
				}
				return config.getObjectWrapper();
			}
		}
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.TemplateEngineWrapper#destroy()
	 */
	public void destroy()
	{
		config.clearEncodingMap();
		config.clearSharedVariables();
		config.clearTemplateCache();
	}

	/*
	 * (non-Javadoc)
	 * @see
	 * com.hundsun.jres.fui.core.page.TemplateEngineWrapper#process(java.lang
	 * .String, com.hundsun.jres.fui.core.FContext)
	 */
	public String process(FContext context, String uri, TEData teData) throws FException
	{
		StringWriter sw = new StringWriter();
		// 解析模板
		process(context, uri, teData, sw);
		return sw.toString();
	}

	/*
	 * (non-Javadoc)
	 * @see
	 * com.hundsun.jres.fui.core.te.TemplateEngineWrapper#process(com.hundsun
	 * .jres.fui.core.FContext, java.lang.String,
	 * com.hundsun.jres.fui.core.te.TEData, java.io.Writer)
	 */
	public void process(FContext context, String uri, TEData teData, Writer writer) throws FException
	{
		if (context == null) {
			context = new FContext(FEnvironment.get(), null, null, null);
		}
		if (teData == null) {
			teData = new TEData();
		}
		Template template = null;
		try {
			// 创建模板实例，如果该模板已经被创建，则从缓存中直接获取
			template = config.getTemplate(uri, deduceLocale(context, uri));
		} catch (IOException e) {
			throw new FException("Failed to load template file[" + uri + "]", e);
		}

		try {
			// 创建根模型，并递归调用模板解析引擎
			TemplateModel model = createModel(teData, wrapper, context);
			template.process(model, writer);
		} catch (Exception te) {
			throw new FException("Error executing FreeMarker template[" + template.toString() + "]", te);
		}
	}

	protected TemplateModel createModel(TEData teData, ObjectWrapper wrapper, FContext context)
			throws TemplateModelException
	{
		// 如果是采用servlet的方式调用，contextPath为真实的contextPath，否则contextPath为""
		String contextPath = context.getContextPath();
		if (contextPath == null) {
			contextPath = "";
		}
		teData.addAdditionalParam("contextPath", contextPath);
		return new TEDataHashModel(teData, wrapper, context.getServletContext(), context.getHttpRequest());
	}

	/**
	 * Returns the locale used for the
	 * {@link Configuration#getTemplate(String, Locale)} call. The base
	 * implementation simply returns the locale setting of the configuration.
	 * Override this method to provide different behaviour, i.e. to use the
	 * locale indicated in the request.
	 * @param context
	 */
	protected Locale deduceLocale(FContext context, String templatePath)
	{
		// 从FUI上下文中是否有本地化资源设置
		Locale locale = (Locale) context.getAttribute(FEnvironment.CONSTANT_RUNTIME_I18N);
		// 如果没有，则使用环境变量中的默认本地化
		if (locale == null) {
			locale = (Locale) FEnvironment.get().getProperty(FEnvironment.CONSTANT_DEFAULT_LOCALE);
		}
		return locale;
	}

	public Configuration getConfiguration()
	{
		return config;
	}

}