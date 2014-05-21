/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: TemplateEngineService.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.te;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Enumeration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hundsun.jres.fui.core.FEnvironment;
import com.hundsun.jres.fui.core.FException;
import com.hundsun.jres.fui.core.util.FResourceResolver;
import com.hundsun.jres.fui.core.util.URLBean;
import com.hundsun.jres.fui.core.xml.Parser;
import com.hundsun.jres.fui.core.xml.Tag;

/**
 * 模板引擎启动器
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-9-19 <br>
 */
public class TemplateEngineService
{
	private final String			F_TEMPLATE_FILE	= "classpath*:ftemplate/*.ftemplate";
	/** 日志实例 */
	private Logger					LOG				= LoggerFactory.getLogger(FEnvironment.LOG_NAME);
	/** 模板包装器实例 */
	private TemplateEngineWrapper	wrapper;

	public void init() throws Exception
	{
		TemplateEngineInfo info = parseTemplateFile();
		if (info != null) {
			String className = info.getClassName();
			if (className != null) {
				try {
					Class<?> clz = TemplateEngineService.class.getClassLoader().loadClass(className);
					TemplateEngineWrapper wrapper = (TemplateEngineWrapper) clz.newInstance();
					wrapper.init(info.getInitParams());
					this.wrapper = wrapper;
					return;
				} catch (Exception e) {
					throw new FException("Failed to initialize template engine[" + info.getName() + "]", e);
				}
			}
		}
		throw new FException("No template engine specified, please check it");
	}

	private TemplateEngineInfo parseTemplateFile()
	{
		// 查找满足 classpath*:ftemplate/*.ftemplate 通配的通道引导文件（classes目录和jar中等）
		FResourceResolver resolver = new FResourceResolver(FEnvironment.class.getClassLoader());
		Enumeration<URLBean> urls = null;
		try {
			urls = resolver.getResources(F_TEMPLATE_FILE);
		} catch (Exception e) {
			LOG.error("search [" + F_TEMPLATE_FILE + "] has error", e);
			return null;
		}

		if (urls.hasMoreElements()) {
			URLBean bean = urls.nextElement();
			URL url = bean.getUrl();
			InputStream is = null;
			try {
				is = url.openStream();
				Parser parser = new Parser(is);
				Tag rootTag = parser.parse();
				if (rootTag != null) {
					TemplateEngineInfo teInfo = new TemplateEngineInfo(rootTag.getProperties());
					return teInfo;
				}
			} catch (Exception e) {
				// 记录日志并忽略
				LOG.error("parse template config file [ " + url + "] has error", e);
			} finally {
				try {
					if (is != null) {
						is.close();
					}
				} catch (IOException e) {
					// 忽略文件关闭错误
				}
			}
		}
		return null;
	}

	public TemplateEngineWrapper getTemplateEngineWrapper()
	{
		return wrapper;
	}

	/**
	 * method comments here
	 */
	public void destroy()
	{
	}
}
