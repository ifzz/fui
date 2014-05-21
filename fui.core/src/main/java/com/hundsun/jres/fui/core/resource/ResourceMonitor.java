/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: ResourceMonitor.java
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
import java.util.Iterator;
import java.util.Map.Entry;
import java.util.Vector;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-26 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class ResourceMonitor implements RefreshableResource
{
	private final File				root;
	/** 文件过滤器，如果是null，则表示接受所有文件 */
	private final FileFilter		fileFilter;
	/** 能够正常刷新 */
	private volatile boolean		canRefresh				= true;
	/** 是否开启监控 */
	private volatile boolean		monitoring				= true;

	/** 子文件目录 */
	private HashMap<String, File>	subFiles				= new HashMap<String, File>();
	/** 所有子文件的最后修改时间 */
	private HashMap<String, Long>	subFilesLastModified	= new HashMap<String, Long>();

	/** 新增文件的缓存 */
	private Vector<String>			cacheAppendedFiles		= new Vector<String>();
	/** 删除的文件的列表缓存 */
	private Vector<String>			cacheDeletedFiles		= new Vector<String>();
	/** 修改了的文件的列表缓存 */
	private Vector<String>			cacheModifiedFiles		= new Vector<String>();
	/** 目前全部文件 */
	private Vector<String>			cacheCurrentFiles		= new Vector<String>();

	// 文件绝对路径
	public ResourceMonitor(String filename, FileFilter fileFilter)
	{
		root = new File(filename);
		this.fileFilter = fileFilter;
	}

	/**
	 * 根目录是否存在，是否被删除
	 * @return true 表示存在，false表示删除
	 */
	public boolean isRootExists()
	{
		return root.exists();
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.resource.RefreshableResource#refresh()
	 */
	synchronized public boolean refresh()
	{
		if (!monitoring) { // 已经停止监控
			return true;
		}
		// 防止数据还没有读取完毕就重复刷新
		if (!canRefresh) {
			return true;
		}
		// canRefresh = false;
		clearCache();

		// 如果此时文件夹被删除，listFiles返回null
		File[] files = root.listFiles(fileFilter);
		if (files != null) {
			for (File file : files) {
				if (!monitoring) { // 已经停止监控
					return true;
				}
				String filename = file.getName();
				long lastModified = file.lastModified();
				if (lastModified == 0) { // 如果文件被删除lastModified=0，此处跳过
					continue;
				}
				// 新增文件
				if (subFiles.get(filename) == null) {
					cacheAppendedFiles.add(filename);
					subFiles.put(filename, file);
					subFilesLastModified.put(filename, lastModified);
				} else {
					// 修改文件
					if (subFilesLastModified.get(filename) < lastModified) {
						cacheModifiedFiles.add(filename);
						subFilesLastModified.put(filename, lastModified);
					}
				}
			}
		}

		if (!monitoring) { // 已经停止监控
			return true;
		}
		// 判断文件是否已经被删除
		Iterator<Entry<String, File>> it = subFiles.entrySet().iterator();
		while (it.hasNext()) {
			if (!monitoring) { // 已经停止监控
				return true;
			}
			Entry<String, File> entity = it.next();
			if (!entity.getValue().exists()) {
				cacheDeletedFiles.add(entity.getKey());
				subFilesLastModified.remove(entity.getKey());
				it.remove();
			} else {
				// 当前的所有文件
				cacheCurrentFiles.add(entity.getKey());
			}
		}
		if (!monitoring) { // 已经停止监控
			return true;
		}
		boolean result = cacheAppendedFiles.isEmpty() && cacheDeletedFiles.isEmpty() && cacheModifiedFiles.isEmpty();
		if (!result) {
			canRefresh = false;
		}
		return result;
	}

	private void clearCache()
	{
		if (cacheAppendedFiles.size() != 0) {
			cacheAppendedFiles.clear();
		}
		if (cacheDeletedFiles.size() != 0) {
			cacheDeletedFiles.clear();
		}
		if (cacheModifiedFiles.size() != 0) {
			cacheModifiedFiles.clear();
		}
		if (cacheCurrentFiles.size() != 0) {
			cacheCurrentFiles.clear();
		}
	}

	/**
	 * 清除缓存并恢复刷新
	 */
	public void resumeRefresh()
	{
		canRefresh = true;
		clearCache();
	}

	public void stopMonitor()
	{
		monitoring = false;
	}

	public void release()
	{
		// 停止监控
		monitoring = false;
		synchronized (this) {
			subFiles.clear();
			subFilesLastModified.clear();
			clearCache();
		}
	}

	public String[] getCacheAppendedFiles()
	{
		return cacheAppendedFiles.toArray(new String[] {});
	}

	public String[] getCacheDeletedFiles()
	{
		return cacheDeletedFiles.toArray(new String[] {});
	}

	public String[] getCacheModifiedFiles()
	{
		return cacheModifiedFiles.toArray(new String[] {});
	}

	public String[] getCacheCurrentFiles()
	{
		return cacheCurrentFiles.toArray(new String[] {});
	}

	public boolean hasFileAppended()
	{
		return !cacheAppendedFiles.isEmpty();
	}

	public boolean hasFileDeleted()
	{
		return !cacheDeletedFiles.isEmpty();
	}

	public boolean hasFileModified()
	{
		return !cacheModifiedFiles.isEmpty();
	}

	public boolean hasFileAddOrRemove()
	{
		return !cacheDeletedFiles.isEmpty() || !cacheAppendedFiles.isEmpty();
	}
}
