/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: SessionInterceptor.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.interceptor;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import com.hundsun.jres.fui.core.FIn;

/**
 * 功能说明: 用户将session中的信息映射为服务的请求参数
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2013-2-21 <br>
 */
public class SessionInterceptor extends InitiableInterceptor
{
	// 为了避免每次去遍历map，将要筛选的内容存储在list中
	private List<Item>	maplist	= new ArrayList<Item>();

	/*
	 * (non-Javadoc)
	 * @see
	 * com.hundsun.jres.fui.core.interceptor.Interceptor#init(java.util.Map)
	 */
	public void init(String params) throws Exception
	{
		if (params == null || params.length() == 0) {
			return;
		}
		// 去除所有的换行符、回车符以及空格字符等空字符
		params = params.replaceAll("\\s", "");
		String[] paramStrs = params.split(",");
		for (String param : paramStrs) {
			int eqIndex = param.indexOf('=');
			if (eqIndex == -1 || eqIndex == 0 || eqIndex == param.length() - 1) {
				continue;
			}
			String map = param.substring(0, eqIndex); // 需要存储的名字
			String key = param.substring(eqIndex + 1); // session中的属性名
			maplist.add(new Item(key, map));
		}
	}

	/*
	 * (non-Javadoc)
	 * @see
	 * com.hundsun.jres.fui.core.interceptor.Interceptor#intercept(com.hundsun
	 * .jres.fui.core.interceptor.ServiceInvocation)
	 */
	public Object intercept(ServiceInvocation invocation)
	{
		if (maplist.size() != 0) {
			FIn in = invocation.getIn();
			HttpSession session = in.getContext().getHttpRequest().getSession(false);
			if (session != null) {
				int size = maplist.size();
				for (int i = 0; i < size; i++) {
					Item item = maplist.get(i);
					Object value = session.getAttribute(item.getKey());
					if (value != null) {
						in.addParam(item.getMap(), value);
					}
				}
			}
		}
		invocation.invoke();
		return null;
	}

	// 缓存内容，key：session中的属性名，map：映射为请求中的参数名
	private class Item
	{
		private String	key;
		private String	map;

		public Item(String key, String map)
		{
			this.key = key;
			this.map = map;
		}

		public String getKey()
		{
			return key;
		}

		public String getMap()
		{
			return map;
		}

		/*
		 * (non-Javadoc)
		 * @see java.lang.Object#toString()
		 */
		@Override
		public String toString()
		{
			return "{" + key + "," + map + "}";
		}
	}

}
