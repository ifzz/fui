/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES XML插件
 * 文件名称: XmlTag.java
 * 软件版权: 杭州恒生电子股份有限公司
 * 修改记录:
 * 修改日期      修改人员                     修改说明<BR>
 * ========     ======  ============================================
 *   
 * ========     ======  ============================================
 */
package com.hundsun.jres.fui.core.xml;

import java.util.ArrayList;

/**
 * 功能说明: XmlTag是Xml描述的对象,用来生成XmlTag树及Xml标记遍历等功能,该类是Tag接口的Html实现<br>
 * 系统版本: v1.0<br>
 * 开发人员: <br>
 * 开发时间: 2010-7-21<br>
 * 功能描述: <br>
 */
public class XmlTag extends Tag
{

	public XmlTag()
	{
		tagType = 2;
	}

	public String getEncode()
	{
		ArrayList<Tag> al = getTagListByType(Tag.TYPE_XML_TAG);
		String ret = null;
		for (int i = 0; i < al.size(); i++) {
			Tag tag = (Tag) al.get(i);
			ret = tag.getProperty("encoding");
			if (ret != null)
				break;
		}
		return ret;
	}

	/**
	 * 构造函数
	 * @param tag
	 *            String 标记名称
	 */
	public XmlTag(String tag, int type)
	{
		this(tag);
		this.type = type;
	}

	/**
	 * 构造函数
	 * @param tag
	 *            String 标记名称
	 */
	public XmlTag(String tag)
	{
		this();
		super.setTagName(tag);
	}

	/**
	 * 比较方式,对于Xml来说是严格比较
	 * @param a
	 *            String
	 * @param b
	 *            String
	 * @return boolean
	 */
	public boolean compareString(String a, String b)
	{
		boolean ret = false;
		if (a != null && b != null && a.equals(b)) {
			ret = true;
		}
		return ret;
	}

	/**
	 * 克隆一棵XmlTag树，用于对XmlTag树进行修改，但是不影响原来的XmlTag树
	 * @return XmlTag
	 * @throws Exception
	 */
	public XmlTag cloneXmlTag() throws Exception
	{
		XmlParser hp = new XmlParser();
		return hp.parseString(toString());
	}

	/**
	 * 返回第一个下级节点
	 * @return XmlTag
	 */
	public XmlTag getFirstSubTag()
	{
		XmlTag ret = null;
		for (int i = 0; i < tagList.size(); i++) {
			XmlTag t = (XmlTag) tagList.get(i);
			if (t.getTagName() != null) {
				ret = t;
				break;
			}
		}
		return ret;
	}

	/**
	 * 对内容中的禁止使用字符进行处理
	 * @param v
	 *            String
	 * @return String
	 */
	public String escapeString(String v)
	{
		String str = v;
		if (v != null) {
			str = str.replaceAll("&", "&amp;");
			str = str.replaceAll("<", "&lt;");
			str = str.replaceAll(">", "&gt;");
			str = str.replaceAll("'", "&apos;");
			str = str.replaceAll("\"", "&quot;");
		}
		return str;
	}

	/**
	 * 对内容中禁止使用的内容进行处理
	 * @param v
	 *            String
	 * @return String
	 */
	public String unescapeString(String v)
	{
		String str = v;
		if (v != null) {
			str = str.replaceAll("&lt;", "<");
			str = str.replaceAll("&gt;", ">");
			str = str.replaceAll("&apos;", "'");
			str = str.replaceAll("&quot;", "\"");
			str = str.replaceAll("&amp;", "&");
		}
		return str;
	}

	/**
	 * 获得克隆Tag树
	 * @return Tag
	 */
	public Tag cloneTag() throws Exception
	{
		return cloneXmlTag();
	}

	public boolean isIgnoreCase()
	{
		return false;
	}

}
