/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: ResI18n.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.resource;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Locale;
import java.util.ResourceBundle;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-25 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class ResI18n implements RefreshableResource
{
	private ArrayList<String>	i18nResources;

	public ResI18n(String customI18nPaths)
	{
		ArrayList<String> i18nResources = new ArrayList<String>();
		String[] i18nPaths = customI18nPaths.split(",");
		for (String resName : i18nPaths) {
			resName = resName.trim();
			if (resName.length() != 0) {
				i18nResources.add(resName);
			}
		}
		this.i18nResources = i18nResources;
	}

	public String getMessage(String key, Locale locale)
	{
		ArrayList<String> i18nResources = this.i18nResources;
		int size = i18nResources.size();
		// TODO 这里也许存在较为严重的性能问题，待优化：bundle的getString方法如果获取不到不是返回null而是则抛出异常
		for (int i = 0; i < size; i++) {
			try {
				ResourceBundle bundle = ResourceBundle.getBundle(i18nResources.get(i), locale);
				String value = bundle.getString(key);
				if (value != null) {
					return value;
				}
			} catch (Exception e) {
				// 资源文件缺失
				continue;
			}
		}
		return null;
	}

	public String getMessage(String key, Locale locale, Object[] args)
	{
		ArrayList<String> i18nResources = this.i18nResources;
		int size = i18nResources.size();
		// TODO 这里也许存在较为严重的性能问题，待优化
		for (int i = 0; i < size; i++) {
			try {
				ResourceBundle bundle = ResourceBundle.getBundle(i18nResources.get(i), locale);
				String value = bundle.getString(key);
				if (value != null) {
					return MessageFormat.format(value, args);
				}
			} catch (Exception e) {
				// 资源文件缺失
				continue;
			}
		}
		return null;
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.resource.RefreshableResource#refresh()
	 */
	public boolean refresh()
	{
		// 暂时不支持刷新
		return false;
	}

}
