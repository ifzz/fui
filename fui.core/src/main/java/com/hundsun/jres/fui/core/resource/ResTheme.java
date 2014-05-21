/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: ResThemes.java
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
import java.util.HashMap;
import java.util.Map;

import com.hundsun.jres.fui.core.FEnvironment;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-25 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class ResTheme implements RefreshableResource
{
	private final ResourceMonitor		themeDirMonitor;
	private final String				themePath;
	private final String				themeName;

	private Map<String, ResComponent>	components;

	/**
	 * @param themeName
	 *            主题名
	 * @param themePath
	 *            主题绝对路径
	 */
	public ResTheme(String themeName, String themePath)
	{
		this.themePath = themePath;
		this.themeName = themeName;

		String absolutePath = FEnvironment.get().getProperty(FEnvironment.F_ROOT_PATH) + themePath;
		themeDirMonitor = new ResourceMonitor(absolutePath, new FileFilter()
		{
			public boolean accept(File pathname)
			{
				// 筛选所有的css文件
				if (pathname.isFile()) {
					String filename = pathname.getName();
					if (filename.endsWith(".css")) {
						return true;
					}
				}
				return false;
			}
		});

		// 初始化资源
		refresh();
	}

	public Map<String, ResComponent> getResComponents()
	{
		Map<String, ResComponent> components = this.components;
		return components;
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.resource.RefreshableResource#refresh()
	 */
	synchronized public boolean refresh()
	{
		boolean result = true;
		if (!themeDirMonitor.refresh()) { // 文件出现变更
			if (themeDirMonitor.hasFileAddOrRemove()) {
				Map<String, ResComponent> components = new HashMap<String, ResComponent>();
				String[] currentFiles = themeDirMonitor.getCacheCurrentFiles();
				for (String filename : currentFiles) {
					boolean isMin = false;
					String componentName;
					if (filename.endsWith(".min.css") || filename.endsWith("-min.css") || filename.endsWith("_min.css")) {
						componentName = filename.substring(0, filename.lastIndexOf("min.css") - 1);
						isMin = true;
					} else {
						componentName = filename.substring(0, filename.lastIndexOf(".css"));
					}
					ResComponent resComponent = components.get(componentName);
					if (resComponent == null) {
						resComponent = new ResComponent(componentName);
						components.put(componentName, resComponent);
					}
					if (isMin) {
						resComponent.setMinCompPath(themePath + "/" + filename);
					} else {
						resComponent.setCompPath(themePath + "/" + filename);
					}
				}
				// 整体赋值，保证线程安全
				this.components = components;
				result = false;
			}
			// 恢复刷新
			themeDirMonitor.resumeRefresh();
		}
		return result;
	}

	public String getThemePath()
	{
		return themePath;
	}

	public String getThemeName()
	{
		return themeName;
	}

	/**
	 * 释放资源
	 */
	synchronized protected void release()
	{
		themeDirMonitor.release();
		components = new HashMap<String, ResComponent>();
	}
}
