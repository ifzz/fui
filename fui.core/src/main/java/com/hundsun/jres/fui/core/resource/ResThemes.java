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
import java.util.concurrent.ConcurrentHashMap;

import com.hundsun.jres.fui.core.FEnvironment;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-25 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class ResThemes implements RefreshableResource
{
	private final String						themeDirPath;
	private final ResourceMonitor				themeDirMonitor;
	private ConcurrentHashMap<String, ResTheme>	resThemes	= new ConcurrentHashMap<String, ResTheme>();

	public ResThemes(String themeDirPath)
	{
		this.themeDirPath = themeDirPath;

		String absolutePath = FEnvironment.get().getProperty(FEnvironment.F_ROOT_PATH) + themeDirPath;
		themeDirMonitor = new ResourceMonitor(absolutePath, new FileFilter()
		{
			public boolean accept(File pathname)
			{
				// 筛选所有的css文件
				if (pathname.isDirectory() && !pathname.getName().startsWith(".")) {
					return true;
				}
				return false;
			}
		});
		// 初始化资源
		refresh();
	}

	public ResTheme getTheme(String themename)
	{
		return resThemes.get(themename);
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.resource.RefreshableResource#refresh()
	 */
	synchronized public boolean refresh()
	{
		boolean result = true;
		if (!themeDirMonitor.refresh()) {
			if (themeDirMonitor.hasFileAddOrRemove()) {
				String[] appendThemePaths = themeDirMonitor.getCacheAppendedFiles();
				for (String filename : appendThemePaths) {
					ResTheme theme = new ResTheme(filename, themeDirPath + "/" + filename);
					resThemes.put(filename, theme);
					result = false;
				}

				String[] deleteThemePaths = themeDirMonitor.getCacheDeletedFiles();
				for (String filename : deleteThemePaths) {
					ResTheme theme = resThemes.remove(filename);
					if (theme != null) {
						theme.release();
						result = false;
					}
				}
				result = false;
			}
			// 恢复刷新
			themeDirMonitor.resumeRefresh();
		}

		// 刷新所有的主题资源
		ResTheme[] themes = resThemes.values().toArray(new ResTheme[] {});
		for (ResTheme resTheme : themes) {
			if (!resTheme.refresh()) {
				result = false;
			}
		}
		return result;
	}

	/**
	 * 释放资源
	 */
	synchronized protected void release()
	{
		themeDirMonitor.release();
		ResTheme[] themes = resThemes.values().toArray(new ResTheme[] {});
		for (ResTheme resTheme : themes) {
			resTheme.release();
		}
		resThemes.clear();
	}

}
