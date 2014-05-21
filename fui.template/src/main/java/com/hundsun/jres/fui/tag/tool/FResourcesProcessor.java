/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FResourcesProcessor.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.tag.tool;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

import com.hundsun.jres.fui.core.FEnvironment;
import com.hundsun.jres.fui.core.FException;
import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.core.resource.FResourceManager;
import com.hundsun.jres.fui.core.resource.ResComponent;
import com.hundsun.jres.fui.core.resource.ResJsModule;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-27 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FResourcesProcessor extends FTagProcessor
{
	private ArrayList<ResJsModule>		compModules;
	private Map<String, String>			compNames;
	/** 显示指定带min的资源 */
	private Map<ResComponent, Object>	specialComponents;
	private LinkedList<ResComponent>	urlList;

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FTagProcessor#process()
	 */
	public String process() throws FException
	{
		FResourceManager resManager = FEnvironment.get().getResourceManager();
		compModules = resManager.getComponentModules();

		compNames = new HashMap<String, String>();
		specialComponents = new HashMap<ResComponent, Object>();
		urlList = new LinkedList<ResComponent>();

		List<Map<String, Object>> elementParams = super.elementParams;
		if (elementParams != null) {
			int size = elementParams.size();
			for (int i = 0; i < size; i++) {
				Map<String, Object> params = elementParams.get(i);
				String name = (String) params.get("name");
				String group = (String) params.get("group");
				String url = (String) params.get("url");
				if (name != null) {
					addComponentWithName(name, null);
				} else if (group != null) {
					group = group.trim();
					addComponentWithGroup(group, null);
				} else if (url != null) {
					// TODO 暂不支持
				}
			}
		}

		boolean devMode = fcontext.isDevMode();
		boolean realMode;

		StringBuilder sb = new StringBuilder();
		sb.append("<!-- BEGIN : component resources -->");
		Iterator<ResComponent> it = urlList.iterator();
		while (it.hasNext()) {
			ResComponent comp = it.next();
			realMode = devMode && !specialComponents.containsKey(comp);
			String compPath = fcontext.getHttpRequest().getContextPath() + comp.getPath(realMode);
			sb.append("<script type=\"text/javascript\" src=\"");
			sb.append(compPath);
			sb.append("\"></script>");
		}
		sb.append("<!-- END : component resources -->");

		return sb.toString();
	}

	private void addComponentWithName(String name, String depended)
	{
		boolean isMin = false;
		if (name.endsWith(".min") || name.endsWith("-min") || name.endsWith("_min")) {
			name = name.substring(0, name.length() - 4);
			isMin = true;
		}
		if (compNames.get(name) != null) { // 已经添加了，防止递归死循环
			return;
		}

		int size = compModules.size();
		for (int i = 0; i < size; i++) {
			ResJsModule jsModule = compModules.get(i);
			ResComponent resComponent = jsModule.getModuleJs().get(name);
			if (resComponent == null) {
				resComponent = jsModule.getModuleComponents().get(name);
			}
			if (resComponent != null) {
				if (depended == null) {
					urlList.add(resComponent);
				} else {
					ListIterator<ResComponent> lit = urlList.listIterator(urlList.size());
					boolean success = false;
					while (lit.hasPrevious()) {
						ResComponent comp = lit.previous();
						if (comp.getName().equals(depended)) {
							lit.add(resComponent); // 在被依赖的前面组件前面插入
							success = true;
							break;
						}
					}
					if (!success) {
						urlList.add(resComponent);
					}
				}
				compNames.put(name, name);
				if (isMin) {
					specialComponents.put(resComponent, resComponent);
				}

				// 建立依赖关系
				for (ResJsModule resJsModule : compModules) {
					List<String> dependencies = resJsModule.getModuleCompDepends().get(name);
					if (dependencies != null) {
						for (String de : dependencies) {
							addComponentWithName(de, name); // 递归遍历
						}
						break;
					}
				}

				break;
			}
		}
	}

	/**
	 * method comments here
	 * @param group
	 * @param object
	 */
	private void addComponentWithGroup(String group, Object object)
	{
		int size = compModules.size();
		for (int i = 0; i < size; i++) {
			List<String> groupMems = compModules.get(i).getModuleCompGroups().get(group);
			if (groupMems != null) {
				int memSize = groupMems.size();
				for (int j = 0; j < memSize; j++) {
					String memName = groupMems.get(j);
					addComponentWithName(memName, null);
				}
			}
		}
	}

	public static void main(String[] args)
	{
		LinkedList<String> strList = new LinkedList<String>();
		strList.add("a");
		strList.add("b");
		strList.add("c");
		strList.add("d");

		ListIterator<String> lit = strList.listIterator(strList.size());
		while (lit.hasPrevious()) {
			String ss = lit.previous();
			System.out.println(ss);

			if (ss.equals("a")) {
				lit.add("M");
				break;
			}
		}
		System.out.println(strList);
	}
}
