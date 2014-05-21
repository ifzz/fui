/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FResourceManager.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.resource;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hundsun.jres.fui.core.FContext;
import com.hundsun.jres.fui.core.FEnvironment;
import com.hundsun.jres.fui.core.FLOG;
import com.hundsun.jres.fui.core.ResourceCallback;
import com.hundsun.jres.fui.core.util.ResourceUtils;
import com.hundsun.jres.fui.core.xml.Tag;

/**
 * 功能说明: 资源管理的实现类
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-3-31 <br>
 */
public class FResourceManager
{
	/** 静态资源URI */
	private Map<String, String>				resUri			= new HashMap<String, String>();
	/** 回调资源URI */
	private Map<String, ResourceCallback>	resCallback		= new HashMap<String, ResourceCallback>();
	/** 日志实例 */
	private Logger							LOG				= LoggerFactory.getLogger(FEnvironment.LOG_NAME);
	/** 组件路径列表 */
	private ArrayList<ResJsModule>			componentDirs;
	/** 国际化资源管理器 */
	private ResI18n							i18nResource;
	/** 主题资源 */
	private ArrayList<ResThemes>			themeResources;
	/** 其他新注册的资源 */
	private ArrayList<RefreshableResource>	otherResources	= new ArrayList<RefreshableResource>();

	/** 资源刷新线程 */
	private ResourceRefreshThread			refreshThread;

	/** 工程根目录"/"，绝对路径 */
	private static final String				ROOT_PATH		= ResourceUtils.getWebRootAbsolutePath();

	public void init()
	{
		if (LOG.isInfoEnabled()) {
			LOG.info("ROOT_PATH: " + ROOT_PATH);
		} else {
			FLOG.info("ROOT_PATH[" + ROOT_PATH + "]");
		}

		// 在环境变量中设置当前工程更目录的绝对路径
		FEnvironment.get().setProperty(FEnvironment.F_ROOT_PATH, ROOT_PATH);

		// 刷新路径设置
		initResources();

		// 根据当前的启动模式，选择是否开启刷新线程
		if (FEnvironment.get().isDevMode()) {
			refreshThread = new ResourceRefreshThread();
			refreshThread.setDaemon(true);
			refreshThread.start();
		}
	}

	synchronized public void destroy()
	{
		resUri.clear();
		resCallback.clear();

		List<ResJsModule> componentDirs = this.componentDirs;
		ArrayList<ResThemes> themeResources = this.themeResources;

		if (componentDirs != null) {
			for (ResJsModule jsModule : componentDirs) {
				jsModule.release();
			}
		}
		if (themeResources != null) {
			for (ResThemes resThemes : themeResources) {
				resThemes.release();
			}
		}

		if (refreshThread != null) {
			refreshThread.maskStop();
		}
	}

	/**
	 * 刷新所有资源文件
	 */
	public synchronized void initResources()
	{
		FEnvironment env = FEnvironment.get();
		// 初始化国际化资源文件路径
		String i18nPaths = (String) env.getProperty(FEnvironment.CONSTANT_CUSTOM_i18n_RESOURCES);
		initI18nPaths(i18nPaths);

		// 初始化组件JS路径
		String customComps = (String) env.getProperty(FEnvironment.CONSTANT_CUSTOM_COMPONENTS);
		initCustomCompsPath(customComps);

		// 初始化主题theme路径
		String themePaths = (String) env.getProperty(FEnvironment.CONSTANT_CUSTOM_THEMES);
		initThemePaths(themePaths);

		// 初始化JQuery路径
		String jqueryPath = (String) env.getProperty(FEnvironment.CONSTANT_CUSTOM_JS_JQUERY);
		initJQueryPath(jqueryPath);

		// 初始化FUI核心js路径
		String corejsPath = (String) env.getProperty(FEnvironment.CONSTANT_CUSTOM_JS_CORE);
		initCoreJsPath(corejsPath);

		// 初始化核心css路径
		String coreCssPath = (String) env.getProperty(FEnvironment.CONSTANT_CUSTOM_CSS_CORE);
		initCoreCssPath(coreCssPath);

		// 初始化运行时主题管理器
		boolean runtimeThemeEnable = (Boolean) env.getProperty(FEnvironment.CONSTANT_RUNTIME_THEME_ENABLE);
		String runtimeTheme = (String) env.getProperty(FEnvironment.CONSTANT_RUNTIME_THEME);
		initRuntimeTheme(runtimeThemeEnable, runtimeTheme);

		// 初始化运行时国际化管理器
		boolean runtimeI18nEnable = (Boolean) env.getProperty(FEnvironment.CONSTANT_RUNTIME_I18N_ENABLE);
		String runtimeI18n = (String) env.getProperty(FEnvironment.CONSTANT_RUNTIME_I18N);
		initRuntimeI18n(runtimeI18nEnable, runtimeI18n);
	}

	private String formatPath(String path)
	{
		path = path.trim();
		path = path.replace('\\', '/');
		if (!path.startsWith("/")) {
			path = "/" + path;
		}
		if (path.endsWith("/")) {
			path = path.substring(0, path.length() - 1);
		}
		return path;
	}

	/**
	 * method comments here
	 * @param customComps
	 */
	private void initCustomCompsPath(String customComps)
	{
		String[] compPaths = customComps.split(",");
		ArrayList<ResJsModule> parserList = new ArrayList<ResJsModule>();
		for (String compPath : compPaths) {
			if (compPath != null && compPath.trim().length() != 0) {
				try {
					compPath = formatPath(compPath);
					ResJsModule resComponentJSDir = new ResJsModule(compPath);
					parserList.add(resComponentJSDir);
				} catch (Exception e) {
					LOG.warn("invalid component path[" + compPath + "]", e);
				}
			}
		}
		componentDirs = parserList;
	}

	/**
	 * method comments here
	 * @param i18nPaths
	 */
	private void initI18nPaths(String customI18nPaths)
	{
		ResI18n i18nResource = new ResI18n(customI18nPaths);
		this.i18nResource = i18nResource;
	}

	/**
	 * method comments here
	 * @param themePaths
	 */
	private void initThemePaths(String customThemePaths)
	{
		themeResources = new ArrayList<ResThemes>();
		String[] themePaths = customThemePaths.split(",");
		for (String themePath : themePaths) {
			themePath = formatPath(themePath);
			themeResources.add(new ResThemes(themePath));
		}
	}

	/**
	 * method comments here
	 * @param jqueryPath
	 */
	private void initJQueryPath(String jqueryPath)
	{
		// TODO Auto-generated method stub

	}

	/**
	 * method comments here
	 * @param corejsPath
	 */
	private void initCoreJsPath(String corejsPath)
	{
		// TODO Auto-generated method stub

	}

	/**
	 * method comments here
	 * @param coreCssPath
	 */
	private void initCoreCssPath(String coreCssPath)
	{
		// TODO Auto-generated method stub

	}

	/**
	 * method comments here
	 * @param runtimeThemeEnable
	 * @param runtimeTheme
	 */
	private void initRuntimeTheme(boolean runtimeThemeEnable, String runtimeTheme)
	{
		// TODO Auto-generated method stub

	}

	/**
	 * method comments here
	 * @param runtimeI18nEnable
	 * @param runtimeI18n
	 */
	private void initRuntimeI18n(boolean runtimeI18nEnable, String runtimeI18n)
	{
		// TODO Auto-generated method stub

	}

	/**
	 * 初始化FUI默认的资源路径
	 */
	// private void initDefaultUri()
	// {
	// resUri.put(F_Root, "/FUI");
	// resUri.put(F_Css, "{f_root}/css");
	// resUri.put(F_Js, "{f_root}/js");
	// resUri.put(F_JsSrc, "{f_js}/src");
	// resUri.put(F_Themes, "{f_root}/themes");
	// resUri.put(F_Ex_Root, "/FUI-extend");
	// resUri.put(F_Ex_JsSrc, "{f_ex_root}/js/src");
	// resUri.put(F_Ex_Themes, "{f_ex_root}/themes");
	// resUri.put(F_Ex_Templates, "classpath:templates");
	//
	// resUri.put(F_DATA_MODEL, "classpath*:dm/dataModel.xml");
	// }

	/**
	 * 从FUI-config.xml中读取配置的URI，并初始化
	 */
	private void initConfig(ArrayList<Tag> arrayList)
	{
		ArrayList<Tag> resources = arrayList;
		for (Tag res : resources) {
			String name = res.getProperty("name");
			if (name == null) {
				continue;
			} else {
				name = name.trim();
				if (name.length() == 0) {
					LOG.warn("init resource [" + res.toString() + "] has error and skip it");
					continue;
				}
			}
			// 初始化单个资源配置
			initConfigUri(name, res);
		}
	}

	private void initConfigUri(String name, Tag res)
	{
		String callback = res.getProperty("callback");
		String uri = res.getProperty("uri");

		if (callback != null) { // 动态URI回调
			ResourceCallback resCallback = null;
			try {
				Class<?> clz = Class.forName(callback);
				resCallback = (ResourceCallback) clz.newInstance();
			} catch (Exception e) {
				LOG.warn("init resource [" + res.toString() + "] has error and skip it", e);
				return;
			}

			// 读取初始化参数
			// Map<String, String> parameters = new HashMap<String, String>();
			// ArrayList<Tag> params = res.getSubListByName("param");
			// for (Tag param : params) {
			// String key = param.getProperty("key");
			// String value = param.getProperty("value");
			// if ((key != null) && (value != null) && (key.trim().length() !=
			// 0)) {
			// key = key.trim();
			// parameters.put(key, value);
			// }
			// }
			// try {
			// resCallback.init(parameters);
			// } catch (Exception e) {
			// LOG.warn("init resource [" + res.toString() +
			// "] has error and skip it", e);
			// return;
			// }

			// 放入容器
			this.resCallback.put(name, resCallback);
			LOG.debug("loaded resource[" + res.toString() + "]");
		} else { // 静态URI
			if ((uri != null) && (uri.trim().length() != 0)) {
				resUri.put(name, uri.trim());
				LOG.debug("loaded resource[" + res.toString() + "]");
			} else {
				LOG.warn("init resource [" + res.toString() + "] has error and skip it");
			}
		}
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.IResources#getContextPath()
	 */

	public String getContextPath()
	{
		return FEnvironment.get().getContextPath();
	}

	/*
	 * (non-Javadoc)
	 * @see
	 * com.hundsun.jres.fui.core.IResources#getResourcePath(java.lang.String)
	 */

	public String getResourcePath(String resAlias, FContext context)
	{
		String uri = null;
		ResourceCallback callback = resCallback.get(resAlias);
		if (callback != null) {
			uri = callback.getResource(context);
		}
		if (uri == null) {
			uri = resUri.get(resAlias);
		}
		return parse2RealPath(uri, context);
	}

	/*
	 * (non-Javadoc)
	 * @see
	 * com.hundsun.jres.fui.core.IResources#getResourcePathCtx(java.lang.String,
	 * com.hundsun.jres.fui.core.FContext)
	 */
	public String getResourcePathCtx(String resAlias, FContext context)
	{
		String uri = getResourcePath(resAlias, context);
		if (uri != null) {
			try {
				URI u = new URI(uri);
				if (u.getScheme() == null) {
					String realPart = u.getSchemeSpecificPart();
					realPart = realPart.replace('\\', '/');
					if (realPart.length() > 0) {
						if (realPart.charAt(0) != '/') {
							realPart = "/" + realPart;
						}
					}
					return getContextPath() + realPart;
				}
			} catch (URISyntaxException e) {
				// 解析错误
				return null;
			}
		}
		return uri;
	}

	// 将类似于 {xxx}/src 翻译成真正的路径，不允许表达式嵌套
	private String parse2RealPath(String uri, FContext context)
	{
		if (uri == null) {
			return null;
		}

		int size = uri.length();
		StringBuilder sb = new StringBuilder(size * 2);
		for (int i = 0; i < size; i++) {
			char c = uri.charAt(i);
			if (c == '{') {
				int index = uri.indexOf('}', i);
				if (i + 1 > index) { // 格式不正确
					return null;
				} else {
					sb.append(getResourcePath(uri.substring(i + 1, index), context));
				}
				i = index;
			} else {
				sb.append(c);
			}
		}

		return sb.toString();
	}

	public ArrayList<ResJsModule> getComponentModules()
	{
		return componentDirs;
	}

	public ResI18n getI18nResource()
	{
		return i18nResource;
	}

	public ArrayList<ResThemes> getThemeResources()
	{
		return themeResources;
	}

	public void addRefreshableResource(RefreshableResource res)
	{
		synchronized (otherResources) {
			otherResources.add(res);
		}
	}

	public void removeRefreshableResource(RefreshableResource res)
	{
		synchronized (otherResources) {
			otherResources.remove(res);
		}
	}

	private class ResourceRefreshThread extends Thread
	{
		private boolean	canRefresh	= true;

		/*
		 * (non-Javadoc)
		 * @see java.lang.Thread#run()
		 */
		@Override
		public void run()
		{
			while (canRefresh) {
				boolean noRefresh = true;
				ArrayList<ResJsModule> modules = FResourceManager.this.componentDirs;
				for (ResJsModule module : modules) {
					if (module != null) {
						noRefresh = module.refresh() && noRefresh;
					}
					if (!canRefresh) {
						return;
					}
				}
				ArrayList<ResThemes> themeResources = FResourceManager.this.themeResources;
				for (ResThemes theme : themeResources) {
					if (theme != null) {
						noRefresh = theme.refresh() && noRefresh;
					}
					if (!canRefresh) {
						return;
					}
				}
				// 其他资源
				synchronized (otherResources) {
					for (RefreshableResource resouce : otherResources) {
						noRefresh = resouce.refresh() && noRefresh;
					}
					if (!canRefresh) {
						return;
					}
				}

				if (!noRefresh) {
					LOG.info("Resource refreshed.");
				}
				try {
					Thread.sleep(2000);
				} catch (InterruptedException e) {
					canRefresh = false;
					return;
				}
			}

		}

		public void maskStop()
		{
			canRefresh = false;
		}
	}

	public static void main(String[] args)
	{
		// FResourceManager manager = new FResourceManager();
		// manager.init(null);

		// manager.resUri.put("testuri", "/ddd/{def}");
		// manager.resUri.put("abc", "/中文");
		// manager.resUri.put("def", "英文");
		//
		// System.out.println(manager.getExJsSrcPath(null));
		// System.out.println(manager.getFJsSrcPath(null));
		// System.out.println(manager.getExTemplatesPath(null));
		// System.out.println(manager.getResourcePath("testuri", null));
		// System.out.println(manager.getResourcePathCtx(F_Ex_Templates, null));

		// try {
		// System.out.println(new URI(
		// "http://localhost:8080/FUI/layout.ftl?key1=value1&key2=value2")
		// .getSchemeSpecificPart());
		//
		// String uri =
		// "http://localhost:8080/FUI/layout.ftl?key1=value1&key2=value2";
		// System.out.println(new URI(uri).getAuthority());
		// System.out.println(new URI(uri).getFragment());
		// System.out.println(new URI(uri).getHost());
		// System.out.println(new URI(uri).getPath());
		// System.out.println(new URI(uri).getPort());
		// System.out.println(new URI(uri).getQuery());
		// System.out.println(new URI(uri).getRawAuthority());
		// System.out.println(new URI(uri).getRawFragment());
		// System.out.println(new URI(uri).getRawPath());
		// System.out.println(new URI(uri).getRawQuery());
		// System.out.println(new URI(uri).getRawSchemeSpecificPart());
		// System.out.println(new URI(uri).getRawUserInfo());
		// System.out.println(new URI(uri).getScheme());
		// System.out.println(new URI(uri).getSchemeSpecificPart());
		// System.out.println(new URI(uri).getUserInfo());
		// } catch (URISyntaxException e) {
		// // TODO Auto-generated catch block
		// e.printStackTrace();
		// }
	}

}
