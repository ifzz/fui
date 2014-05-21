/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: TemplateEngineWrapper.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.te;

import java.io.Writer;
import java.util.Map;

import com.hundsun.jres.fui.core.FContext;
import com.hundsun.jres.fui.core.FException;

/**
 * 模板引擎的接口类
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-6 <br>
 */
public interface TemplateEngineWrapper
{
	/**
	 * 初始化模板引擎
	 * @param config
	 */
	void init(Map<String, String> config) throws Exception;

	/**
	 * 销毁资源
	 */
	void destroy();

	/**
	 * 调用模板引擎获取解析之后的结果
	 * @param context
	 *            FUI上下文
	 * @param url
	 *            要解析的文件路径
	 * @param teData
	 *            模板引擎中的数据
	 * @return 解析之后的数据
	 */
	String process(FContext context, String url, TEData teData) throws FException;

	/**
	 * 调用模板引擎获取解析之后的结果
	 * @param context
	 *            FUI上下文
	 * @param url
	 *            要解析的文件路径
	 * @param teData
	 *            模板引擎中的数据
	 * @param writer
	 *            输出器
	 */
	void process(FContext context, String url, TEData teData, Writer writer) throws FException;

	/**
	 * 获取模板的配置相关
	 * @return 模板引擎的配置实例
	 */
	Object getConfiguration();
}