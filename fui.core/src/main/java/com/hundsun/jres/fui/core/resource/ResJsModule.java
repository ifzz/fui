/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: ResJsModule.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.resource;

import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hundsun.jres.fui.core.FEnvironment;
import com.hundsun.jres.fui.core.xml.Tag;
import com.hundsun.jres.fui.core.xml.XmlParser;
import com.hundsun.jres.fui.core.xml.XmlTag;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-26 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class ResJsModule implements RefreshableResource
{
	/** 日志实例 */
	private final Logger				LOG					= LoggerFactory.getLogger(FEnvironment.LOG_NAME);

	/** 模块路径 */
	private final String				modulePath;
	private final String				absoluteModulePath;
	/** *.js文件 */
	private final ResourceMonitor		moduleJsMonitor;
	/** component*.js文件 */
	private final ResourceMonitor		moduleXmlMonitor;
	/** lang/*.js文件 */
	private final ResourceMonitor		moduleLangMonitor;
	/** src/*.js文件 */
	private final ResourceMonitor		moduleSrcMonitor;

	/** 模块JS组件 */
	private Map<String, ResComponent>	moduleJs			= new HashMap<String, ResComponent>();
	/** 组件依赖关系 */
	private Map<String, List<String>>	moduleCompDepends	= new HashMap<String, List<String>>();
	/** 组件版本 */
	private Map<String, String>			moduleCompVersion	= new HashMap<String, String>();
	/** 组件成组 */
	private Map<String, List<String>>	moduleCompGroups	= new HashMap<String, List<String>>();
	/** JS国际化资源文件 */
	private ArrayList<String>			moduleLangJsFiles	= new ArrayList<String>();
	/** 组件列表 */
	private Map<String, ResComponent>	moduleComponents	= new HashMap<String, ResComponent>();

	public ResJsModule(String modulePath)
	{
		this.modulePath = modulePath;
		this.absoluteModulePath = FEnvironment.get().getProperty(FEnvironment.F_ROOT_PATH) + modulePath;

		// 模块js
		moduleJsMonitor = new ResourceMonitor(absoluteModulePath, new FileFilter()
		{
			public boolean accept(File pathname)
			{
				if (pathname.isFile() && pathname.getName().endsWith(".js")) {
					return true;
				}
				return false;
			}
		});

		// 组件配置文件
		moduleXmlMonitor = new ResourceMonitor(absoluteModulePath, new FileFilter()
		{
			public boolean accept(File pathname)
			{
				if (pathname.isFile()) {
					String filename = pathname.getName();
					if (filename.startsWith("component") && filename.endsWith(".xml")) {
						return true;
					}
				}
				return false;
			}
		});

		// 国际化js
		moduleLangMonitor = new ResourceMonitor(absoluteModulePath + "/lang", new FileFilter()
		{
			public boolean accept(File pathname)
			{
				if (pathname.isFile() && pathname.getName().endsWith(".js")) {
					return true;
				}
				return false;
			}
		});

		// 组件js
		moduleSrcMonitor = new ResourceMonitor(absoluteModulePath + "/src", new FileFilter()
		{
			public boolean accept(File pathname)
			{
				if (pathname.isFile() && pathname.getName().endsWith(".js")) {
					return true;
				}
				return false;
			}
		});

		// 初始化刷新
		refresh();
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.resource.RefreshableResource#refresh()
	 */
	synchronized public boolean refresh()
	{
		boolean result = true;
		if (!moduleJsMonitor.refresh()) {
			if (moduleJsMonitor.hasFileAddOrRemove()) {
				result = false;
				String[] moduleJsFiles = moduleJsMonitor.getCacheCurrentFiles();
				moduleJs = refreshModuleCompJs(moduleJsFiles, modulePath);
			}
			// 恢复刷新
			moduleJsMonitor.resumeRefresh();
		}
		if (!moduleXmlMonitor.refresh()) {
			result = false;
			// 需要重新解析的文件，只要有文件变化都需要重新建立
			String[] moduleXmlFiles = moduleXmlMonitor.getCacheCurrentFiles();
			Map<String, List<String>> moduleCompDepends = new HashMap<String, List<String>>();
			Map<String, String> moduleCompVersion = new HashMap<String, String>();
			Map<String, List<String>> moduleCompGroups = new HashMap<String, List<String>>();
			if (moduleXmlFiles.length != 0) {
				for (String filename : moduleXmlFiles) {
					try {
						refreshModuleXmlFiles(absoluteModulePath + "/" + filename, moduleCompDepends,
								moduleCompVersion, moduleCompGroups);
					} catch (Exception e) {
						LOG.warn("An error occurred while parsing component XML [" + absoluteModulePath + "/"
								+ filename + "]", e);
					}
				}
			}
			this.moduleCompDepends = moduleCompDepends;
			this.moduleCompVersion = moduleCompVersion;
			this.moduleCompGroups = moduleCompGroups;

			// 恢复刷新
			moduleXmlMonitor.resumeRefresh();
		}
		if (!moduleLangMonitor.refresh()) {
			if (moduleJsMonitor.hasFileAddOrRemove()) {
				result = false;
				ArrayList<String> moduleLangJsFiles = new ArrayList<String>();
				String[] moduleLangFiles = moduleJsMonitor.getCacheCurrentFiles();
				for (String filename : moduleLangFiles) {
					moduleLangJsFiles.add(modulePath + "/lang/" + filename);
				}
				this.moduleLangJsFiles = moduleLangJsFiles;
			}
			moduleLangMonitor.resumeRefresh();
		}
		if (!moduleSrcMonitor.refresh()) {
			if (moduleSrcMonitor.hasFileAddOrRemove()) {
				result = false;
				String[] moduleSrcJsFiles = moduleSrcMonitor.getCacheCurrentFiles();
				this.moduleComponents = refreshModuleCompJs(moduleSrcJsFiles, modulePath + "/src");
			}
			moduleSrcMonitor.resumeRefresh();
		}
		return result;
	}

	/**
	 * method comments here
	 * @param moduleJsFiles
	 * @return
	 */
	private Map<String, ResComponent> refreshModuleCompJs(String[] moduleJsFiles, String basePath)
	{
		Map<String, ResComponent> components = new HashMap<String, ResComponent>();
		for (String filename : moduleJsFiles) {
			boolean isMin = false;
			String componentName;
			if (filename.endsWith(".min.js") || filename.endsWith("-min.js") || filename.endsWith("_min.js")) {
				componentName = filename.substring(0, filename.lastIndexOf("min.js") - 1);
				isMin = true;
			} else {
				componentName = filename.substring(0, filename.lastIndexOf(".js"));
			}
			ResComponent resComponent = components.get(componentName);
			if (resComponent == null) {
				resComponent = new ResComponent(componentName);
				components.put(componentName, resComponent);
			}
			if (isMin) {
				resComponent.setMinCompPath(basePath + "/" + filename);
			} else {
				resComponent.setCompPath(basePath + "/" + filename);
			}
		}
		return components;
	}

	/**
	 * method comments here
	 * @param string
	 * @param moduleCompDepends2
	 * @param moduleCompVersion2
	 * @param moduleGroups2
	 * @throws Exception
	 * @throws FileNotFoundException
	 */
	private void refreshModuleXmlFiles(String xmlFilename, Map<String, List<String>> moduleCompDepends,
			Map<String, String> moduleCompVersion, Map<String, List<String>> moduleGroups) throws Exception
	{
		File xmlFile = new File(xmlFilename);
		XmlParser parser = new XmlParser();
		XmlTag rootTag = parser.parseStream(new FileInputStream(xmlFile));

		// 解析所有的group
		ArrayList<Tag> groupTags = rootTag.getSubListByName("group");
		for (Tag groupTag : groupTags) {
			Tag nameTag = groupTag.getSubTagByName("name");
			if (nameTag == null) {
				continue;
			}
			String name = nameTag.getContent();
			if (name == null || name.trim().length() == 0) {
				continue;
			}
			name = name.trim();
			ArrayList<Tag> subCompTags = groupTag.getSubListByName("component");
			ArrayList<String> components = new ArrayList<String>();
			for (Tag subComp : subCompTags) {
				String ref = subComp.getProperty("ref");
				if (ref != null && ref.trim().length() != 0) {
					ref = ref.trim();
					components.add(ref);
				}
			}
			moduleGroups.put(name, components);
		}

		// 解析所有的components
		ArrayList<Tag> componentTags = rootTag.getSubListByName("component");
		for (Tag componentTag : componentTags) {
			Tag nameTag = componentTag.getSubTagByName("name");
			if (nameTag == null) {
				continue;
			}
			String name = nameTag.getContent();
			if (name == null || name.trim().length() == 0) {
				continue;
			}
			name = name.trim();
			Tag versionTag = componentTag.getSubTagByName("version");
			String version = "";
			if (versionTag != null) {
				version = versionTag.getContent();
			}

			Tag dependenciesTag = componentTag.getSubTagByName("dependencies");
			ArrayList<String> dependencies = new ArrayList<String>();
			if (dependenciesTag != null) {
				String dependenciesString = dependenciesTag.getContent();
				String[] depends = dependenciesString.split(",");
				for (String dep : depends) {
					dep = dep.trim();
					if (dep.length() != 0) {
						dependencies.add(dep);
					}
				}
			}
			moduleCompDepends.put(name, dependencies);
			moduleCompVersion.put(name, version);
		}
	}

	protected void release()
	{
		moduleJsMonitor.release();
		moduleXmlMonitor.release();
		moduleLangMonitor.release();
		moduleSrcMonitor.release();
	}

	public String getModulePath()
	{
		return modulePath;
	}

	public Map<String, ResComponent> getModuleJs()
	{
		return moduleJs;
	}

	public Map<String, List<String>> getModuleCompDepends()
	{
		return moduleCompDepends;
	}

	public Map<String, String> getModuleCompVersion()
	{
		return moduleCompVersion;
	}

	public Map<String, List<String>> getModuleCompGroups()
	{
		return moduleCompGroups;
	}

	public ArrayList<String> getModuleLangJsFiles()
	{
		return moduleLangJsFiles;
	}

	public Map<String, ResComponent> getModuleComponents()
	{
		return moduleComponents;
	}
}
