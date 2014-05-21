/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FScriptProcessor.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.tag.tool;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Map;
import java.util.Map.Entry;

import com.hundsun.jres.fui.core.FException;
import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.core.util.DataGetter;

/**
 * 脚本&lt;script&gt;标签，用于批量输出，可以将脚本进行分组分批输出，也可以统一输出
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-9-24 <br>
 */
public class FScriptProcessor extends FTagProcessor
{
	/**
	 * 本标签准备执行的操作，"record"表示记录，"print"或者其他任意字串表示立即输出，"startRecord"表示开启记录；默认为
	 * "print"
	 */
	private static final String	PARAM_ACTION			= "action";
	/**
	 * 本标签中的脚本内容准备加入到那个分组中，用于批量记录和输出，需要和action一起来决定是记录还是输出，默认为"all"则表示将缓存的脚本全部输出
	 */
	private static final String	PARAM_GROUP				= "group";
	/** 默认的脚本处理方式，默认是print */
	private static final String	PARAM_DEFAULT_ACTION	= "_f_script_default_action_";
	/** 在FContext中脚本缓冲区的名字 */
	private static final String	PARAM_CONTEXT_NAME		= "_f_script_cache_";

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FTagProcessor#process()
	 */
	@SuppressWarnings("unchecked")
	public String process() throws FException
	{
		String defaultAction = DataGetter.getString(fcontext.getProperty(PARAM_DEFAULT_ACTION), "print").trim();
		if (defaultAction.length() == 0) {
			defaultAction = "print";
		}

		String action = DataGetter.getString(parameters.get(PARAM_ACTION), defaultAction).trim();
		String group = DataGetter.getString(parameters.get(PARAM_GROUP), "all").trim();
		if (action.length() == 0) {
			action = defaultAction;
		}

		// action="startRecord"开启记录
		if (action.equalsIgnoreCase("startRecord")) { // 开启记录
			fcontext.setProperty(PARAM_DEFAULT_ACTION, "record");
			return "";
		}

		if (group.length() == 0) {
			group = "all";
		}
		Map<String, LinkedList<String>> cache = (Map<String, LinkedList<String>>) fcontext
				.getProperty(PARAM_CONTEXT_NAME);
		if (cache == null) {
			cache = new HashMap<String, LinkedList<String>>();
			fcontext.setProperty(PARAM_CONTEXT_NAME, cache);
		}
		// 将当前的记录加入到缓存中
		String con = super.content;
		if (con == null) {
			con = "";
		}
		// action="record"缓存当前脚本
		if (action.equalsIgnoreCase("record")) {
			LinkedList<String> groupList = cache.get(group);
			if (groupList == null) {
				groupList = new LinkedList<String>();
				cache.put(group, groupList);
			}
			groupList.add(con);
			return "";
		} else if (action.equalsIgnoreCase("print")) {
			// action="print"打印当前脚本
			StringBuilder sb = new StringBuilder();
			outputOneScript(con, sb);
			return sb.toString();
		}

		// action="*"或者 action="printAll" 批量打印所有脚本
		StringBuilder sb = new StringBuilder();
		if (group.equalsIgnoreCase("all")) {
			// 将缓存中的所有脚本输出，并从缓存中删除
			Iterator<Entry<String, LinkedList<String>>> it = cache.entrySet().iterator();
			while (it.hasNext()) {
				Entry<String, LinkedList<String>> entity = it.next();
				LinkedList<String> contentList = entity.getValue();
				outputScriptGroup(group, contentList, sb);
				// 遍历完则从缓存中删除
				contentList.clear();
			}
		} else {
			// 输出指定组的所有脚本，并从缓存中删除
			LinkedList<String> contentList = cache.get(group);
			if (contentList != null) {
				outputScriptGroup(group, contentList, sb);
				cache.remove(group);
			}
		}
		return sb.toString();
	}

	private void outputOneScript(String content, StringBuilder sb)
	{
		sb.append("<!-- FUI Generated for Script -->");
		sb.append("<script type=\"text/javascript\">");
		sb.append(content);
		sb.append("</script>");
	}

	private void outputScriptGroup(String group, LinkedList<String> contentList, StringBuilder sb)
	{
		sb.append("<!-- FUI Generated for Script Group - " + group + "-->");
		sb.append("<script type=\"text/javascript\">");
		for (String content : contentList) {
			sb.append(content);
		}
		sb.append("</script>");
	}

}
