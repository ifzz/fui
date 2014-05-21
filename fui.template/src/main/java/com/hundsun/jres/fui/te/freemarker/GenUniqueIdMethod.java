/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: GenUniqueIdMethod.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.te.freemarker;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import freemarker.template.TemplateMethodModel;
import freemarker.template.TemplateModelException;

/**
 * 根据组件名动态生成唯一的ID值
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-7 <br>
 */
public class GenUniqueIdMethod implements TemplateMethodModel
{
	private static final String	ID_PREFIX	= "_id_";

	/*
	 * (non-Javadoc)
	 * @see freemarker.template.TemplateMethodModel#exec(java.util.List)
	 */
	public Object exec(List arguments) throws TemplateModelException
	{
		// 保证线程安全
		String componentName = "";
		if (!arguments.isEmpty()) {
			componentName = arguments.get(0).toString();
		}
		StringBuilder sb = new StringBuilder(20);
		sb.append(componentName);
		sb.append('-');
		sb.append("gen");
		sb.append(IdGenerator.genId(componentName));
		return sb.toString();
	}

	private static class IdGenerator
	{
		private static ConcurrentHashMap<String, AtomicLong>	ids	= new ConcurrentHashMap<String, AtomicLong>();

		/**
		 * 获取指定名字的唯一的ID
		 * @param compName
		 *            组件名
		 * @return 唯一的ID
		 */
		public static long genId(String compName)
		{
			AtomicLong id = new AtomicLong();
			AtomicLong preid = ids.putIfAbsent(compName, id);
			if (preid == null) {
				return id.incrementAndGet();
			} else {
				return preid.incrementAndGet();
			}
		}
	}
}
