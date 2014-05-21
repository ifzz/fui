/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES XML插件
 * 文件名称: HtmlTag.java
 * 软件版权: 杭州恒生电子股份有限公司
 * 修改记录:
 * 修改日期      修改人员                     修改说明<BR>
 * ========     ======  ============================================
 *   
 * ========     ======  ============================================
 */
package com.hundsun.jres.fui.core.xml;

import java.util.ArrayList;
import java.util.Enumeration;


/**
 * 功能说明: Html标记,该类是Tag接口的Html实现<br>
 * 系统版本: v1.0<br>
 * 开发人员: <br>
 * 开发时间: 2010-7-21<br>
 * 功能描述: <br>
 */
public class HtmlTag extends Tag
{
	public static ArrayList	singleWord	= null;
	// 加载singleWord
	static {
		if (singleWord == null) {
			singleWord = new ArrayList();
			XmlParser xp = new XmlParser();
			try {
				XmlTag xt = xp.parseURL(HtmlTag.class.getResource("SingleTag.xml"));
				ArrayList al = xt.getTagListByName("SingleWord");
				for (int i = 0; i < al.size(); i++) {
					XmlTag t = (XmlTag) al.get(i);
					singleWord.add(t.getContent());
				}

			} catch (Exception e) {
				// 这里不可能会出错，除非有人把jar包中的配置文件删掉了
			}
		}
	}

	/**
	 * 返回全部的纯文本
	 * @return
	 */
	public String getPureTextContent()
	{
		StringBuffer sb = new StringBuffer();
		getPureTextContent(sb);
		return sb.toString();
	}

	/**
	 * 返回全部的纯文本
	 * @param sb
	 */
	private void getPureTextContent(StringBuffer sb)
	{
		if (getType() == Tag.TYPE_COMMON_TAG || getType() == Tag.TYPE_CONTENT_TAG
				|| getType() == Tag.TYPE_DESCRIPTION_TAG) {
			String str = getContentText();
			if (str != null) {
				sb.append(str);
			}
			for (int i = 0; i < tagList.size(); i++) {
				HtmlTag t = (HtmlTag) tagList.get(i);
				t.getPureTextContent(sb);
			}
		}
	}

	/**
	 * 获得编码
	 * @return String 编码
	 */
	public String getEncode()
	{
		ArrayList al = getTagListByName("meta");
		String ret = null;
		for (int i = 0; i < al.size(); i++) {
			Tag tag = (Tag) al.get(i);
			ret = tag.getProperty("charset");
			if (ret != null) {
				break;
			}
		}
		return ret;
	}

	/**
	 * 返回属性值
	 * @param key
	 *            String
	 * @return String
	 */

	public String getProperty(String key)
	{
		Enumeration e = properties.keys();
		while (e.hasMoreElements()) {
			String str = (String) e.nextElement();
			if (key.equalsIgnoreCase(str)) {
				return properties.getProperty(str);
			}
		}
		return null;
	}

	/**
	 * 返回属性值
	 * @param key
	 *            String
	 * @param value
	 *            String
	 */
	public String getProperty(String key, String value)
	{
		Enumeration e = properties.keys();
		while (e.hasMoreElements()) {
			String str = (String) e.nextElement();
			if (key.equalsIgnoreCase(str)) {
				return properties.getProperty(str, value);
			}
		}
		return null;
	}

	/**
	 * 获得克隆的HtmlTag
	 * @return
	 * @throws Exception
	 */
	public HtmlTag cloneHtmlTag() throws Exception
	{
		HtmlParser hp = new HtmlParser();
		return hp.parseString(toString());
	}

	/**
	 * 比较字符串是否相同
	 * @param a
	 *            String
	 * @param b
	 *            String
	 * @return boolean
	 */
	public boolean compareString(String a, String b)
	{
		boolean ret = false;
		if (a != null && b != null && a.equalsIgnoreCase(b)) {
			ret = true;
		}
		return ret;
	}

	/**
	 * 构造方法
	 */
	public HtmlTag()
	{
		tagType = 1;
	}

	/**
	 * 构造方法
	 * @param tag
	 *            标记
	 */
	public HtmlTag(String tag)
	{
		this();
		super.setTagName(tag);
	}

	public void setTagName(String name)
	{
		super.setTagName(name);
	}

	/**
	 * 设置标记中的内容
	 * @param content
	 *            String
	 */
	public void setContent(String content)
	{
		super.setContent(unescapeString(content));
	}

	/**
	 * 返回标记中的内容
	 * @return String
	 */

	public String getContent()
	{
		return super.getContent();
	}

	/**
	 * 返回是否是单个的标记
	 * @return boolean
	 */
	public boolean isSingleTag()
	{
		boolean ret = false;
		for (int i = 0; i < singleWord.size(); i++) {
			String str = (String) singleWord.get(i);
			if (str.equalsIgnoreCase(getTagName())) {
				ret = true;
				break;
			}
		}
		return ret;
	}

	/**
	 * 对内容中的禁止使用字符进行处理
	 */
	public String escapeString(String v)
	{
		if (v == null) {
			return null;
		}
		String str = v;
		// str = str.replaceAll("&", "&amp;");
		// str = str.replaceAll("<", "&lt;");
		// str = str.replaceAll(">", "&gt;");
		// str = str.replaceAll("'", "&apos;");
		// str = str.replaceAll("\"", "&quot;");
		// str = str.replaceAll(" ", "&nbsp;");
		// str = str.replaceAll("\n", "\\\\n");
		// str = str.replaceAll("\t", "\\\\t");
		return str;
	}

	/**
	 * 对内容中的禁止使用字符进行处理
	 */
	public String unescapeString(String v)
	{
		if (v == null) {
			return null;
		}
		String str = v;
		// str = str.replaceAll("&lt;", "<");
		// str = str.replaceAll("&gt;", ">");
		// str = str.replaceAll("&apos;", "'");
		// str = str.replaceAll("&quot;", "\"");
		// str = str.replaceAll("&nbsp;", " ");
		// str = str.replaceAll("&amp;", "&");
		return str;
	}

	/**
	 * 克隆标记
	 */
	public Tag cloneTag() throws Exception
	{
		return cloneHtmlTag();
	}

	public boolean isIgnoreCase()
	{
		return true;
	}

}
