/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: DefaultFUIInitializer.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 20130222    hanyin   统一拦截器的解析方式到 InterceptorParser
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hundsun.jres.fui.core.FEnvironment;
import com.hundsun.jres.fui.core.FLOG;
import com.hundsun.jres.fui.core.LifecycleProcessor;
import com.hundsun.jres.fui.core.channel.FChannelService;
import com.hundsun.jres.fui.core.interceptor.Interceptor;
import com.hundsun.jres.fui.core.interceptor.InterceptorParser;
import com.hundsun.jres.fui.core.resource.FResourceManager;
import com.hundsun.jres.fui.core.te.TemplateEngineService;
import com.hundsun.jres.fui.core.util.DataGetter;
import com.hundsun.jres.fui.core.util.ResourceUtils;
import com.hundsun.jres.fui.core.xml.Parser;
import com.hundsun.jres.fui.core.xml.Tag;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-3 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class DefaultFUIInitializer implements FInitializer
{
	/** 日志实例 */
	private Logger	LOG	= LoggerFactory.getLogger(FEnvironment.LOG_NAME);

	private DefaultFUIInitializer()
	{
	}

	/** 单实例 */
	private static DefaultFUIInitializer	instance	= new DefaultFUIInitializer();

	/**
	 * 获取单实例
	 * @return 单实例
	 */
	public static DefaultFUIInitializer get()
	{
		return instance;
	}

	/** 初始化参数：config，FUI-config.xml的路径 */
	private static final String				INIT_PARM_CONFIG	= "fui-config";

	private FResourceManager				resManager;
	private FChannelService					channelService;
	private TemplateEngineService			engineWrapper;
	private ArrayList<LifecycleProcessor>	lifecycleProcessors	= new ArrayList<LifecycleProcessor>();
	private boolean							hasStarted			= false;

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.FUIInitializer#initialize(javax.servlet.
	 * ServletContext)
	 */
	public synchronized boolean initialize(ServletContext servletContext) throws ServletException
	{
		// 判断FUI是否已经启动，如果已经启动则跳过
		if (hasStarted()) {
			return false;
		}

		if (LOG.isInfoEnabled()) {
			LOG.info("FUI has been ready to start ...");
		} else {
			FLOG.info("FUI has been ready to start ...");
		}

		// 记录当前启动的时间，单位毫秒
		FEnvironment.get().setProperty(FEnvironment.F_START_TIME, new Date());

		// 设置Servlet上下文到FUI的运行环境中
		FEnvironment.get().setServletContext(servletContext);

		// 读取配置文件
		Tag root = getFUIConfigTag();

		// 初始化注册回调
		if (root != null) {
			Tag eventTag = root.getSubTagByName("lifecycle-processor");
			if (eventTag != null) {
				ArrayList<Tag> processorTags = eventTag.getSubListByName("processor");
				for (Tag procTag : processorTags) {
					String strCls = procTag.getProperty("class");
					try {
						Class clz = Class.forName(strCls);
						lifecycleProcessors.add((LifecycleProcessor) clz.newInstance());
					} catch (Exception e) {
						throw new ServletException("Failed to init LifeCycle Processor", e);
					}
				}
			}
		}

		// 调用启动前回调
		for (LifecycleProcessor processor : lifecycleProcessors) {
			try {
				processor.onBeforeStart();
			} catch (Exception e) {
				LOG.error("Starting FUI has been interrupted", e);
				throw new ServletException("Failed to call Lifecycle Processor[onBeforeStart]", e);
			}
		}

		if (LOG.isInfoEnabled()) {
			LOG.info("FUI is starting ...");
		} else {
			FLOG.info("FUI is starting ...");
		}

		// 初始化环境变量
		initEnvironment(root);

		// 初始化资源管理器
		resManager = new FResourceManager();
		resManager.init();
		FEnvironment.get().setResourceManager(resManager);

		// 初始化服务拦截器
		if (root != null) {
			List<Interceptor> interceptors;
			try {
				interceptors = initInterceptors(root.getSubTagByName("interceptors"));
				if (interceptors.size() != 0) {
					FEnvironment.get().setInterceptors(interceptors);
				}
			} catch (Exception e) {
				throw new ServletException("Failed to initialize interceptors", e);
			}
		}

		// 初始化服务接入通道
		channelService = new FChannelService();
		if (root != null) {
			channelService.init(root.getSubTagByName("channels"));
		} else {
			channelService.init(null);
		}
		FEnvironment.get().setServiceClient(channelService.getServiceClient());

		// 初始化页面模板生成模块
		engineWrapper = new TemplateEngineService();
		try {
			engineWrapper.init();
			FEnvironment.get().setTemplateEngineWrapper(engineWrapper.getTemplateEngineWrapper());
		} catch (Exception e) {
			throw new ServletException(e);
		}
		if (LOG.isInfoEnabled()) {
			LOG.info("Core TemplateEngine started[" + "freemarker" + "].");
		} else {
			FLOG.info("Core TemplateEngine started[" + "freemarker" + "].");
		}

		if (LOG.isInfoEnabled()) {
			LOG.info("FUI has started.");
		} else {
			FLOG.info("FUI has started.");
		}
		// 记录当前的启动器
		FEnvironment.get().setProperty(FEnvironment.F_INITIALIZER, this);
		hasStarted = true;

		for (LifecycleProcessor processor : lifecycleProcessors) {
			try {
				processor.onStarted();
			} catch (Exception e) {
				LOG.error("Failed to call Lifecycle Processor[onStarted]", e);
			}
		}
		return true;
	}

	private List<Interceptor> initInterceptors(Tag subTagByName) throws Exception
	{
		List<Interceptor> interceptors = new ArrayList<Interceptor>();
		if (subTagByName == null) {
			return interceptors;
		}

		ArrayList<Tag> interceptorTags = subTagByName.getSubListByName("interceptor");
		for (Tag tag : interceptorTags) {
			// begin mod 20130222 hanyin 统一拦截器的解析方式到 InterceptorParser
			Interceptor interceptor = InterceptorParser.parseByXml(tag);
			if (interceptor != null) {
				interceptors.add(interceptor);
			}
			// end mod 20130222
		}
		return interceptors;
	}

	/**
	 * 初始化FUI系统环境变量
	 * @param root
	 */
	private void initEnvironment(Tag root)
	{
		FEnvironment env = FEnvironment.get();
		if (root != null) {
			// 从配置中初始化环境变量
			ArrayList<Tag> constantsTag = root.getSubListByName("constant");
			for (Tag consTag : constantsTag) {
				String name = consTag.getProperty("name");
				String value = consTag.getProperty("value");
				String callback = consTag.getProperty("callback");
				if (name != null && name.length() != 0) {
					if (value != null) {
						// 设置环境变量值
						env.setProperty(name, value);
					} else if (callback != null) {
						// 设置环境变量回调
						env.setProperty(name, callback);
					} else {
						// 属性环境变量空值占位
						env.setProperty(name, FEnvironment.NULL_PROPERTY);
					}
				}
			}
		}
		// 格式化环境变量，将没有设置的环境变量设置为默认值
		formatEnvironment();
	}

	/**
	 * 格式系统环境变量，对没有设置的环境变量设置默认值
	 */
	private void formatEnvironment()
	{
		FEnvironment env = FEnvironment.get();
		// contextPath配置
		env.setContextPath(DataGetter.getString(env.getProperty(FEnvironment.CONSTANT_RUNTIME_CONTEXT_PATH), null));
		// 是否是开发模式
		env.setDevMode(DataGetter.getBoolean(env.getProperty(FEnvironment.CONSTANT_DEBUG), false));

		env.setProperty(FEnvironment.CONSTANT_I18N_ENCODING,
				DataGetter.getString(env.getProperty(FEnvironment.CONSTANT_I18N_ENCODING), "utf-8"));

		env.setProperty(FEnvironment.CONSTANT_CUSTOM_i18n_RESOURCES,
				DataGetter.getString(env.getProperty(FEnvironment.CONSTANT_CUSTOM_i18n_RESOURCES), ""));

		Locale defLocale = Locale.SIMPLIFIED_CHINESE;
		String localStr = DataGetter.getString(env.getProperty(FEnvironment.CONSTANT_DEFAULT_LOCALE), "").trim();
		if (localStr.length() != 0) {
			String language = "";
			String country = "";
			String variant = "";
			String[] items = localStr.split("[_]");
			if (items.length > 0) {
				language = items[0];
			}
			if (items.length > 1) {
				country = items[1];
			}
			if (items.length > 2) {
				variant = items[2];
			}
			defLocale = new Locale(language, country, variant);
		}
		env.setProperty(FEnvironment.CONSTANT_DEFAULT_LOCALE, defLocale);

		env.setProperty(FEnvironment.CONSTANT_CUSTOM_COMPONENTS, DataGetter.getString(
				env.getProperty(FEnvironment.CONSTANT_CUSTOM_COMPONENTS), "/FUI-extend/js,/FUI/js"));

		env.setProperty(FEnvironment.CONSTANT_CUSTOM_THEMES, DataGetter.getString(
				env.getProperty(FEnvironment.CONSTANT_CUSTOM_THEMES), "/FUI-extend/themes,/FUI/themes"));

		env.setProperty(FEnvironment.CONSTANT_CUSTOM_JS_JQUERY,
				DataGetter.getString(env.getProperty(FEnvironment.CONSTANT_CUSTOM_JS_JQUERY), "/FUI/js/jquery.js"));

		env.setProperty(FEnvironment.CONSTANT_CUSTOM_JS_CORE,
				DataGetter.getString(env.getProperty(FEnvironment.CONSTANT_CUSTOM_JS_CORE), "/FUI/js/src/FUI.core.js"));

		env.setProperty(FEnvironment.CONSTANT_CUSTOM_CSS_CORE,
				DataGetter.getString(env.getProperty(FEnvironment.CONSTANT_CUSTOM_CSS_CORE), "/FUI/css/core.css"));

		env.setProperty(FEnvironment.CONSTANT_RUNTIME_THEME_ENABLE,
				DataGetter.getBoolean(env.getProperty(FEnvironment.CONSTANT_RUNTIME_THEME_ENABLE), true));

		env.setProperty(FEnvironment.CONSTANT_RUNTIME_THEME,
				DataGetter.getString(env.getProperty(FEnvironment.CONSTANT_RUNTIME_THEME), ""));

		env.setProperty(FEnvironment.CONSTANT_RUNTIME_I18N_ENABLE,
				DataGetter.getBoolean(env.getProperty(FEnvironment.CONSTANT_RUNTIME_I18N_ENABLE), true));

		env.setProperty(FEnvironment.CONSTANT_RUNTIME_I18N,
				DataGetter.getString(env.getProperty(FEnvironment.CONSTANT_RUNTIME_I18N), ""));

	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.FUIInitializer#destroy()
	 */
	public synchronized void destroy()
	{
		// 判断FUI是否已经启动，如果已经启动则跳过
		if (!hasStarted()) {
			return;
		}

		int processorCount = lifecycleProcessors.size();
		for (int i = processorCount - 1; i >= 0; i--) {
			try {
				lifecycleProcessors.get(i).onBeforeDestroy();
			} catch (Exception e) {
				LOG.error("Failed to call Lifecycle Processor[onBeforeDestroy]", e);
			}
		}

		if (LOG.isInfoEnabled()) {
			LOG.info("FUI is stopping ...");
		} else {
			FLOG.info("FUI is stopping ...");
		}

		// 销毁页面模板生成模块
		// if (pageService != null) {
		// pageService.destroy();
		// pageService = null;
		// }
		if (engineWrapper != null) {
			engineWrapper.destroy();
			engineWrapper = null;
		}

		// 销毁ajax服务处理模块
		// if (ajaxService != null) {
		// ajaxService.destroy();
		// ajaxService = null;
		// }

		// 销毁服务接入通道
		if (channelService != null) {
			channelService.destroy();
			channelService = null;
		}

		// 销毁数据模型
		// if (datamodelManager != null) {
		// datamodelManager.destroy();
		// datamodelManager = null;
		// }

		// 销毁资源管理器
		if (resManager != null) {
			resManager.destroy();
			resManager = null;
		}

		// 销毁运行时环境
		FEnvironment environment = FEnvironment.get(); // 防止重复销毁
		if (environment != null) {
			environment.clear();
		}

		if (LOG.isInfoEnabled()) {
			LOG.info("FUI has stopped ...");
		} else {
			FLOG.info("FUI has stopped ...");
		}

		for (int i = processorCount - 1; i >= 0; i--) {
			try {
				lifecycleProcessors.get(i).onDestroyed();
			} catch (Exception e) {
				LOG.error("Failed to call Lifecycle Processor[onDestroyed]", e);
			}
		}
	}

	private Tag getFUIConfigTag()
	{
		// 如果无法从初始化参数中获取配置文件的路径，则尝试从classpath中查找
		String configPath = null;
		if (FEnvironment.get().getServletContext() != null) {
			configPath = FEnvironment.get().getServletContext().getInitParameter(INIT_PARM_CONFIG);
		}
		if (configPath == null) {
			configPath = "classpath:fui-config.xml";
		}

		File configFile = null;
		try {
			configFile = ResourceUtils.getFile(configPath);
		} catch (FileNotFoundException e) {
			LOG.info("FUI will start in default mode ...");
		}

		if (configFile != null) {
			FileInputStream fis = null;
			try {
				fis = new FileInputStream(configFile);
			} catch (FileNotFoundException e) {
				// 到这里的基本上是不可能的，除非刚执行上面的ResourceUtils.getFile方法之后，文件就马上被删了
				LOG.warn("Could not find file[\"fui-config.xml\"], FUI will start in default mode.");
				return null;
			}
			// 解析配置文件到内存
			Parser parser = new Parser(fis);
			try {
				return parser.parse();
			} catch (Exception e) {
				LOG.warn("Parse file[" + configFile.getAbsolutePath() + "] failed", e);
			}
		}
		return null;

	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.web.FInitializer#hasStarted()
	 */
	public boolean hasStarted()
	{
		return hasStarted;
	}

}
