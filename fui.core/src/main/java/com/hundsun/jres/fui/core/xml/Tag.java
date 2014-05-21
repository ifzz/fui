/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES XML插件
 * 类 名 称: Tag.java
 * 软件版权: 杭州恒生电子股份有限公司
 * 修改记录:
 * 修改日期      修改人员                     修改说明<BR>
 * ========     ======  ============================================
 * 2010-6-12    罗果   修改注释，增加了getTagByPath方法
 * ========     ======  ============================================
 */
package com.hundsun.jres.fui.core.xml;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Map;
import java.util.Properties;

/**
 * 功能说明: Tag标记的类<br>
 * 系统版本: v1.0<br>
 * 开发人员: 罗果<br>
 * 开发时间: 2010-6-12<br>
 * 功能描述: <br>
 */
public abstract class Tag
{
	private int		lineNo		= 0;	// 行号
	boolean			returnNull	= true;	// 是否在找不到节点的时候返回NULL
	protected int	tagType		= 0;

	public boolean isReturnNull()
	{
		return returnNull;
	}

	public void setReturnNull(boolean returnNull)
	{
		this.returnNull = returnNull;
	}

	public int getLineNo()
	{
		return lineNo;
	}

	public void setLineNo(int lineNo)
	{
		this.lineNo = lineNo;
	}

	public static final int		TYPE_UNKNOW_TAG			= 0;						// 未知标记

	public static final int		TYPE_CONTENT_TAG		= 1;						// 内容标记

	public static final int		TYPE_MEMO_TAG			= 2;						// 注释标记

	public static final int		TYPE_COMMON_TAG			= 3;						// 一般标记

	public static final int		TYPE_DESCRIPTION_TAG	= 4;						// 描述标记

	public static final int		TYPE_RESERVE_TAG		= 5;						// 保留标记

	public static final int		TYPE_XML_TAG			= 6;						// Xml标记

	private String				tagName					= null;					// 标记名称

	protected String			content					= null;					// 标记名称

	protected int				type					= TYPE_COMMON_TAG;			// 默认为一般标记

	protected Properties		properties				= new Properties();		// 标记属性

	protected ArrayList<Tag>	tagList					= new ArrayList<Tag>();	// 下级标记列表

	protected ArrayList<String>	singleWordPropertyList	= new ArrayList<String>();

	protected Tag				parent					= null;

	public abstract boolean compareString(String a, String b);

	public abstract Tag cloneTag() throws Exception;

	public abstract String getEncode();

	/**
	 * 构造函数
	 */
	public Tag()
	{
	}

	public ArrayList<Tag> getTagListByType(int t)
	{
		ArrayList<Tag> al = new ArrayList<Tag>();
		getTagListByType(t, al);
		return al;
	}

	/**
	 * 返回根节点
	 * @return rootTag;
	 */
	public Tag getRootTag()
	{
		if (getType() == Tag.TYPE_COMMON_TAG && getTagName() != null) {
			return this;
		} else {
			if (getSubTagList() != null) {
				for (int i = 0; i < getSubTagList().size(); i++) {
					Tag t = getSubTagList().get(i);
					if (t.getType() == Tag.TYPE_COMMON_TAG && t.getTagName() != null) {
						return t;
					}
				}
			}
		}
		return null;
	}

	/**
	 * 返回根节点
	 * @param tag
	 * @return
	 */

	public static Tag getRootTag(Tag tag)
	{
		if (tag.getType() == Tag.TYPE_COMMON_TAG && tag.getTagName() != null) {
			return tag;
		} else {
			if (tag.getSubTagList() != null) {
				for (int i = 0; i < tag.getSubTagList().size(); i++) {
					Tag t = tag.getSubTagList().get(i);
					if (t.getType() == Tag.TYPE_COMMON_TAG && t.getTagName() != null) {
						return t;
					}
				}
			}
		}
		return null;
	}

	/**
	 * 把节点重置
	 */
	public void clearTag()
	{
		tagName = null;
		content = null;
		tagList.clear();
		properties.clear();
		singleWordPropertyList.clear();

	}

	/**
	 * 递归遍历Tag,返回指定类型的Tag集合
	 * @param t
	 *            类型
	 * @param al
	 *            Tag集合
	 */
	private void getTagListByType(int t, ArrayList<Tag> al)
	{
		if (type == t) {
			al.add(this);
		}
		for (int i = 0; i < tagList.size(); i++) {
			Tag tag = tagList.get(i);
			tag.getTagListByType(t, al);
		}
	}

	/**
	 * 构造函数
	 * @param name
	 *            标记名称
	 */
	public Tag(String name)
	{
		setTagName(name);
	}

	/**
	 * 转换成带格式的文本，阅读时使用
	 * @return 带格式的文本
	 */
	public String format()
	{
		return format("  ", 0);
	}

	/**
	 * 格式化文本
	 * @param spaces
	 * @param subs
	 * @return
	 */
	private String format(String spaces, int subs)
	{
		StringBuffer sb = new StringBuffer();
		StringBuffer tab = new StringBuffer();
		for (int i = 0; i < subs; i++) {
			tab.append(spaces);
		}
		if (tagName != null) {
			sb.append(tab).append(getTagHeader()).append("\r\n");
		}
		if (content != null) {
			sb.append(tab);
			if (type == Tag.TYPE_CONTENT_TAG) {
				sb.append("<![CDATA[");
				sb.append(content);
			} else if (type == Tag.TYPE_MEMO_TAG) {
				sb.append("<!--");
				sb.append(escapeString(content));
			} else {
				sb.append(escapeString(content)).append("\r\n");
			}
			if (type == Tag.TYPE_CONTENT_TAG) {
				sb.append("]]>\r\n");
			} else if (type == Tag.TYPE_MEMO_TAG) {
				sb.append("-->\r\n");
			}
		}
		if (tagList.size() > 0) {
			for (int i = 0; i < tagList.size(); i++) {
				Tag t = tagList.get(i);
				if (tagName == null) {
					sb.append(t.format(spaces, subs));
				} else {
					sb.append(t.format(spaces, subs + 1));
				}
			}
		}
		if (tagName != null) {
			sb.append(tab).append(getTagFooter()).append("\r\n");
		}
		return sb.toString();
	}

	/**
	 * 格式化行
	 * @return
	 */
	public String formatInRow()
	{
		StringBuffer sb = new StringBuffer();
		if (tagName != null) {
			sb.append(getTagHeader());
		}
		if (content != null) {
			if (type == Tag.TYPE_CONTENT_TAG) {
				sb.append("<![CDATA[");
				sb.append(content);
			} else if (type == Tag.TYPE_MEMO_TAG) {
				sb.append("<!--");
				sb.append(escapeString(content));
			} else {
				sb.append(escapeString(content));
			}
			if (type == Tag.TYPE_CONTENT_TAG) {
				sb.append("]]>");
			} else if (type == Tag.TYPE_MEMO_TAG) {
				sb.append("-->");
			}
		}
		if (tagList.size() > 0) {
			for (int i = 0; i < tagList.size(); i++) {
				Tag t = tagList.get(i);
				if (tagName == null) {
					sb.append(t.formatInRow());
				} else {
					sb.append(t.formatInRow());
				}
			}
		}
		if (tagName != null) {
			sb.append(getTagFooter());
		}
		return sb.toString();
	}

	/**
	 * 返回如果有属性propertyname的所有节点
	 * @param propertyname
	 *            String
	 * @return ArrayList
	 */
	public ArrayList<Tag> getTagListIfHasProperty(String propertyname)
	{
		ArrayList<Tag> al = new ArrayList<Tag>();
		String v = getProperty(propertyname);
		if (v != null) {
			al.add(this);
		}
		for (int i = 0; i < getTagList().size(); i++) {
			Tag ht = getTagList().get(i);
			al.addAll(ht.getTagListIfHasProperty(propertyname));
		}
		return al;
	}

	/**
	 * 根据路径查找标记，路径用/分开<br>
	 * 2010-6-12 add by luoguo <br>
	 * path可以有两种方式，一种是/a/b/c表示从根节点开始<br>
	 * 也开始是a/b/c，表示当前节点是a，找当前节点下第二层是b，第三层是c的节点，以此类推
	 * @param path
	 *            String
	 * @return XmlTag
	 */
	public ArrayList<Tag> getTagListByPath(String path)
	{
		if (path.startsWith("/")) {
			path = path.substring(1);
		}
		if (path.endsWith("/")) {
			path = path.substring(0, path.length() - 1);
		}
		String[] paths = path.split("/");
		return getTagListByPath(paths, 0);
	}

	/**
	 * 根据路径查找匹配的标记，如果有多个，只返回第一个<br>
	 * 2010-6-12 add by luoguo
	 * @param path
	 *            路径是指/a/b/c或 a/b/c的形式<br>
	 *            第一种的“/”是指根节点，具体根节点名称是什么不关心<br>
	 *            第二种是指从当前节点找起，当前节点的节点名称是什么不必关心
	 * @return
	 */
	public Tag getTagWithPath(String path)
	{
		return getNullReturn(getTagWithPath(path, 0));
	}

	/**
	 * 根据路径及索引号读取标记<br>
	 * 2010-6-12 add by luoguo
	 * @param path
	 *            路径是指/a/b/c或 a/b/c的形式<br>
	 *            第一种的“/”是指根节点，具体根节点名称是什么不关心<br>
	 *            第二种是指从当前节点找起，当前节点的节点名称是什么不必关心
	 * @param index
	 * @return 如果没有找到或索引越界，返回null
	 */
	public Tag getTagWithPath(String path, int index)
	{

		ArrayList<Tag> list = getTagListWithPath(path);
		if (list != null && list.size() > index) {
			return list.get(index);
		}
		return getNullReturn();
	}

	/**
	 * 通过路径返回节点列表
	 * @param path
	 *            路径是指/a/b/c或 a/b/c的形式<br>
	 *            第一种的“/”是指根节点，具体根节点名称是什么不关心<br>
	 *            第二种是指从当前节点找起，当前节点的节点名称是什么不必关心
	 * @return 节点列表
	 */
	public ArrayList<Tag> getTagListWithPath(String path)
	{
		ArrayList<Tag> ret = new ArrayList();
		Tag t = this;
		if (path.startsWith("/")) {
			path = path.substring(1);
			t = this.getRootTag();
		}
		if (path.endsWith("/")) {
			path = path.substring(0, path.length() - 1);
		}
		String[] paths = path.split("/");
		getTagListWithPath(paths, 0, ret);
		return ret;
	}

	private void getTagListWithPath(String[] paths, int s, ArrayList ret)
	{

		ArrayList<Tag> al = getSubListByName(paths[s]);
		if (s == paths.length - 1) {
			ret.addAll(al);
		} else {
			for (Tag t : al) {
				t.getTagListWithPath(paths, s + 1, ret);
			}
		}
	}

	/**
	 * 根据路径查找匹配的标记，如果有多个，只返回第一个<br>
	 * path可以有两种方式，一种是/a/b/c表示从根节点开始<br>
	 * 也开始是a/b/c，表示当前节点是a，找当前节点下第二层是b，第三层是c的节点，以此类推<br>
	 * 2010-6-12 add by luoguo
	 * @param path
	 * @return
	 */
	public Tag getTagByPath(String path)
	{
		return getNullReturn(getTagByPath(path, 0));
	}

	/**
	 * 根据路径及索引号读取标记<br>
	 * path可以有两种方式，一种是/a/b/c表示从根节点开始<br>
	 * 也开始是a/b/c，表示当前节点是a，找当前节点下第二层是b，第三层是c的节点，以此类推<br>
	 * 2010-6-12 add by luoguo
	 * @param path
	 * @param index
	 * @return 如果没有找到或索引越界，返回null
	 */
	public Tag getTagByPath(String path, int index)
	{

		ArrayList<Tag> list = getTagListByPath(path);
		if (list != null && list.size() > index) {
			return list.get(index);
		}
		return getNullReturn();
	}

	/**
	 * 根据属性查找节点
	 * @param propertyname
	 *            String
	 * @param value
	 *            String
	 * @return XmlTag
	 */
	public Tag getTagByProperty(String propertyname, String value)
	{
		String str = properties.getProperty(propertyname);

		if (str != null && compareString(str, value)) {
			return this;
		}
		for (int i = 0; i < getTagList().size(); i++) {
			Tag a = getTagList().get(i);
			str = a.properties.getProperty(propertyname);
			if (str != null && compareString(str, value)) {
				return a;
			}
			Tag t = a.getTagByProperty(propertyname, value);
			if (t != null) {
				return t;
			}
		}
		return getNullReturn();
	}

	/**
	 * 返回节点路径
	 * @return 节点路径
	 */
	public String getPath()
	{
		String p = "";
		if (tagName != null) {
			p = tagName;
		}
		if (parent == null) {
			return p;
		} else {
			String pp = parent.getPath();
			if (p.length() == 0) {
				return p;
			} else {
				return pp + "/" + p;
			}
		}
	}

	/**
	 * 查找当前节点下节点名是name的节点列表
	 * @param name
	 *            节点名称
	 * @return 匹配的节点列表
	 */
	public ArrayList<Tag> getSubListByName(String name)
	{
		ArrayList<Tag> al = new ArrayList<Tag>();
		if (tagName == null) {
			for (int i = 0; i < tagList.size(); i++) {
				Tag t = tagList.get(i);
				al.addAll(t.getSubListByName(name));
			}
		} else {
			for (int i = 0; i < tagList.size(); i++) {
				Tag t = tagList.get(i);
				if (t.getTagName() == null) {
					al.addAll(t.getSubListByName(name));
				} else {
					if (compareString(t.getTagName(), name)) {
						al.add(t);
					}
				}
			}
		}
		return al;
	}

	/**
	 * 删除所有标记名是tagName，且包含属性propertyName的值为value的节点
	 * @param tagName
	 * @param propertyName
	 * @param value
	 */
	public void removeSubListByProperty(String tagName, String propertyName, String value)
	{
		ArrayList<Tag> al = this.getTagListByNameAndProperty(tagName, propertyName, value);
		for (int i = 0; i < al.size(); i++) {
			removeTag(al.get(i));
		}
	}

	/**
	 * 删除所有节点名为name的节点
	 * @param name
	 */
	public void removeSubListByName(String name)
	{
		if (tagName == null) {
			for (int i = tagList.size() - 1; i >= 0; i--) {
				Tag t = tagList.get(i);
				t.removeSubListByName(name);
			}
		} else {
			for (int i = tagList.size() - 1; i >= 0; i--) {
				Tag t = tagList.get(i);
				if (t.getTagName() == null) {
					t.removeSubListByName(name);
				} else {
					if (compareString(t.getTagName(), name)) {
						tagList.remove(i);
					}
				}
			}
		}
	}

	/**
	 * 返回当前节点下级节点中节点名是name的节点,如果有多个，返回第一个
	 * @param name
	 * @return
	 */
	public Tag getSubTagByName(String name)
	{
		Tag ret = null;
		ArrayList<Tag> al = getSubListByName(name);
		if (al.size() > 0) {
			ret = al.get(0);
		}
		return ret;
	}

	/**
	 * 根据路径查找标记，路径用/分开<br>
	 * path可以有两种方式，一种是/a/b/c表示从根节点开始<br>
	 * 也开始是a/b/c，表示当前节点是a，找当前节点下第二层是b，第三层是c的节点，以此类推
	 * @param paths
	 *            路径列表
	 * @param s
	 *            起始序号
	 * @return 查找到的Tag集合
	 */
	private ArrayList<Tag> getTagListByPath(String[] paths, int s)
	{
		ArrayList<Tag> al = new ArrayList<Tag>();
		if (tagName != null) {
			if (compareString(tagName, paths[s])) {
				if (s == paths.length - 1) {
					al.add(this);
				} else if (s < paths.length - 1) {
					for (int i = 0; i < tagList.size(); i++) {
						Tag t = tagList.get(i);
						al.addAll(t.getTagListByPath(paths, s + 1));
					}
				} else {
					return al;
				}
			}
		} else {
			for (int i = 0; i < tagList.size(); i++) {
				Tag t = tagList.get(i);
				al.addAll(t.getTagListByPath(paths, s));
			}
		}
		return al;
	}

	/**
	 * 添加单个标记
	 * @param property
	 *            String
	 */
	public void addSingleWordProperty(String property)
	{
		singleWordPropertyList.add(property);
	}

	/**
	 * 根据名称返回节点列表
	 * @param name
	 *            String
	 * @return ArrayList
	 */
	public ArrayList<Tag> getTagListByName(String name)
	{
		ArrayList<Tag> al = new ArrayList<Tag>();
		getTagListByName(name, al);
		return al;
	}

	/**
	 * 设置encode<br>
	 * 如果原来没有节点用来声明编码，则无效，如果有，则会把编码设置为新的编码类型
	 * @param encode
	 */
	public void setEncode(String encode)
	{
		Tag p = this;
		while (p.parent != null) {
			p = p.parent;
		}
		if (p.getType() == Tag.TYPE_XML_TAG) {
			p.setProperty("encoding", encode);
		}
		for (Tag t : p.getTagList()) {
			if (t.getType() == Tag.TYPE_XML_TAG && t.getProperty("encoding") != null) {
				t.setProperty("encoding", encode);
				break;
			}
		}
	}

	/**
	 * 返回指定名字及属性的列表
	 * @param name
	 *            String
	 * @param propertyname
	 *            String
	 * @param value
	 *            String
	 * @return ArrayList
	 */
	public ArrayList<Tag> getTagListByNameAndProperty(String tagName, String propertyname,
			String value)
	{
		ArrayList<Tag> al = new ArrayList<Tag>();
		if (getTagName() != null && compareString(getTagName(), tagName)) {
			String str = properties.getProperty(propertyname);
			if (str != null && compareString(str, value)) {
				al.add(this);
			}
		}
		for (int i = 0; i < getTagList().size(); i++) {
			Tag a = getTagList().get(i);
			a.getTagListByNameAndProperty(tagName, al, propertyname, value);
		}
		return al;
	}

	private void getTagListByNameAndProperty(String tagName, ArrayList<Tag> al, String property,
			String propettyValue)
	{
		if (getTagName() != null && compareString(getTagName(), tagName)) {
			String str = properties.getProperty(property);
			if (str != null && compareString(str, propettyValue)) {
				al.add(this);
			}
		} else {
			for (int i = 0; i < getTagList().size(); i++) {
				Tag xt = getTagList().get(i);
				xt.getTagListByNameAndProperty(tagName, al, property, propettyValue);
			}
		}

	}

	/**
	 * 根据名称返回节点列表
	 * @param name
	 *            String
	 * @param al
	 *            ArrayList
	 */
	private void getTagListByName(String name, ArrayList<Tag> al)
	{
		if (getTagName() != null && compareString(getTagName(), name)) {
			al.add(this);
		}
		for (int i = 0; i < getTagList().size(); i++) {
			Tag xt = getTagList().get(i);
			xt.getTagListByName(name, al);
		}

	}

	/**
	 * 根据标记名称返回节点
	 * @param name
	 *            String
	 * @return Tag
	 */
	public Tag getTagByName(String name)
	{
		if (getTagName() != null && compareString(name, getTagName())) {
			return this;
		}
		// 做两次循环是为了先找到第丄1�7层的
		for (int i = 0; i < getTagList().size(); i++) {
			Tag a = getTagList().get(i);
			if (a.getTagName() != null && compareString(a.getTagName(), name)) {
				return a;
			}
		}
		for (int i = 0; i < getTagList().size(); i++) {
			Tag a = getTagList().get(i);
			Tag t = a.getTagByName(name);
			if (t != null) {
				return t;
			}
		}
		return getNullReturn();
	}

	Tag getNullReturn()
	{
		if (returnNull) {
			return null;
		} else {
			if (tagType == 1) {
				return new HtmlTag();
			} else if (tagType == 2) {
				return new XmlTag();
			} else {
				return null;
			}
		}
	}

	Tag getNullReturn(Tag tag)
	{
		if (tag != null) {
			return tag;
		}
		if (returnNull) {
			return null;
		} else {
			if (tagType == 1) {
				return new HtmlTag();
			} else if (tagType == 2) {
				return new HtmlTag();
			} else {
				return null;
			}
		}

	}

	/**
	 * 根据名称删除标记
	 * @param name
	 */
	public void removeTagByName(String name)
	{
		for (int i = getTagList().size() - 1; i >= 0; i--) {
			Tag a = getTagList().get(i);
			if (compareString(a.getTagName(), name)) {
				getTagList().remove(i);
			} else {
				a.removeTagByName(name);
			}
		}
	}

	/**
	 * 添加子标记
	 * @param tag
	 *            Tag
	 */
	public void addTag(Tag tag)
	{
		tag.setParent(this);
		tagList.add(tag);
	}

	/**
	 * 添加一组标记
	 * @param al
	 *            ArrayList
	 */
	public void addAll(ArrayList<Tag> al)
	{
		for (int i = 0; i < al.size(); i++) {
			Tag t = al.get(i);
			addTag(t);
		}
	}

	/**
	 * 返回某个标记是否是单标记，默认为全否
	 * @return boolean
	 */
	public boolean isSingleTag()
	{
		return false;
	}

	/**
	 * 设置标记或属性比较时是否忽略大小写，默认为不忽略
	 * @return boolean
	 */
	public abstract boolean isIgnoreCase();

	/**
	 * 根据标记名称和属性查找节点
	 * @param tagName
	 *            String
	 * @param propertyname
	 *            String
	 * @param value
	 *            String
	 * @return Tag
	 */
	public Tag getTagByTagNameAndProperty(String tagName, String propertyname, String value)
	{
		if (getTagName() != null && compareString(getTagName(), tagName)) {
			String str = properties.getProperty(propertyname);
			if (str != null && compareString(str, value)) {
				return this;
			}
		}
		for (int i = 0; i < getTagList().size(); i++) {
			Tag a = getTagList().get(i);
			if (compareString(tagName, a.getTagName())) {
				String str = a.getProperty(propertyname);
				if (str != null && compareString(str, value)) {
					return a;
				}
			}
			Tag t = a.getTagByTagNameAndProperty(tagName, propertyname, value);
			if (t != null) {
				return t;
			}
		}
		return getNullReturn();
	}

	/**
	 * 根据标记名称和属性查找节点
	 * @param tagName
	 * @param propertyname
	 * @param value
	 * @return
	 */
	public Tag getSubTagByTagNameAndProperty(String tagName, String propertyname, String value)
	{
		if (getTagName() != null && compareString(getTagName(), tagName)) {
			String str = properties.getProperty(propertyname);
			if (str != null && compareString(str, value)) {
				return this;
			}
		}
		for (int i = 0; i < getTagList().size(); i++) {
			Tag a = getTagList().get(i);
			if (compareString(tagName, a.getTagName())) {
				String str = a.getProperty(propertyname);
				if (str != null && compareString(str, value)) {
					return a;
				}
			}
		}
		return null;
	}

	/**
	 * 返回标记内容
	 * @return String
	 */
	public String getContent()
	{
		return getText();
	}

	/**
	 * 返回标记中的文本内容，如果本标签没有，则查找下级
	 * @return String
	 */
	public String getText()
	{
		String ret = content;
		if (ret == null) {
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < tagList.size(); i++) {
				Tag tag = tagList.get(i);
				if (tag.getTagName() == null || tag.getTagName().length() == 0) {
					String t = tag.getContent();
					if (t != null) {
						sb.append(t);
					}
				}
			}
			ret = sb.toString();
		}
		return ret;
	}

	/**
	 * 返回当前标记的文本内容
	 * @return
	 */
	public String getContentText()
	{
		return content;
	}

	/**
	 * 返回标记名称
	 * @return String
	 */
	public String getTagName()
	{

		return tagName;
	}

	/**
	 * 把tag及其内容转换成String形式
	 */
	public String toString()
	{
		return toString("");
	}

	/**
	 * 返回保留的内容
	 * @return
	 */
	public String getReserveContent()
	{
		StringBuffer sb = new StringBuffer();
		sb.append("<!DOCTYPE ");
		if (content != null) {
			sb.append(content);
		}
		sb.append(">\n");
		return sb.toString();
	}

	/**
	 * 带缩进的结果
	 * @param t
	 * @return
	 */
	private String toString(String t)
	{
		StringBuffer sb = new StringBuffer();
		sb.append(getTagHeader());
		if (content != null) {
			sb.append(content);
		}
		if (tagList.size() > 0) {
			if (tagName == null) {
				sb.append(getSubTagString(t));
			} else {
				sb.append(getSubTagString(t));
			}
		}
		sb.append(t);
		sb.append(getTagFooter());
		return sb.toString();
	}

	/**
	 * getSubContent
	 * @return
	 */
	public String getSubContent()
	{
		StringBuffer sb = new StringBuffer();
		if (content != null) {
			sb.append(escapeString(content));
		}
		if (tagList.size() > 0) {
			if (tagName == null) {
				sb.append(getSubTagString(""));
			} else {
				sb.append(getSubTagString(""));
			}
		}
		return sb.toString();
	}

	/**
	 * 返回标记处TagHeader
	 * @return
	 */
	public String getTagHeader()
	{
		String ret = "";
		if (getType() == TYPE_MEMO_TAG) {
			ret = "<!--\n";
		} else if (getType() == TYPE_CONTENT_TAG) {
			ret = "<![CDATA[\n";
		} else if (getType() == TYPE_XML_TAG) {
			ret = "<?xml " + getPropertyString() + getSingleWordPropertyString() + " ?>";
		} else if (getType() == TYPE_RESERVE_TAG) {
			ret = "<!DOCTYPE ";
		} else if (getType() == TYPE_COMMON_TAG) {
			if (tagName != null) {
				ret = "<" + tagName + getPropertyString() + getSingleWordPropertyString()
						+ (isSingleTag() ? " /" : "") + ">";
			}
		} else {
			ret = "";
		}
		return ret;
	}

	/**
	 * 返回子标记
	 * @return
	 */
	private String getSubTagString(String t)
	{
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < tagList.size(); i++) {
			Tag tag = tagList.get(i);
			sb.append(tag.toString(t));
		}
		return sb.toString();
	}

	/**
	 * 返回singleWordPropertyList
	 * @return
	 */
	private String getSingleWordPropertyString()
	{
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < singleWordPropertyList.size(); i++) {
			sb.append(" " + singleWordPropertyList.get(i));
		}
		return sb.toString();
	}

	/**
	 * 返回属性字符串
	 * @return
	 */
	private String getPropertyString()
	{
		String ret = "";
		if (properties.size() > 0) {
			Enumeration<Object> e = properties.keys();
			while (e.hasMoreElements()) {
				String k = (String) e.nextElement();
				String v = properties.getProperty(k);
				ret += ' ' + k + "=" + "\"" + escapeString(v) + "\"";
			}
		}
		return ret;
	}

	/**
	 * 对禁用的标识进行转换
	 * @param v
	 * @return
	 */
	public abstract String escapeString(String v);

	/**
	 * 对禁用的标识进行转换
	 * @param v
	 * @return
	 */
	public abstract String unescapeString(String v);

	/**
	 * 返回标记页脚
	 * @return
	 */
	public String getTagFooter()
	{
		String ret = "";
		if (getType() == TYPE_MEMO_TAG) {
			ret = "\n-->\n";
		} else if (getType() == TYPE_CONTENT_TAG) {
			ret = "]]>\n";
		} else if (getType() == TYPE_XML_TAG) {
			// ret = "?>\n";
		} else if (getType() == TYPE_RESERVE_TAG) {
			ret = ">";
		} else if (getType() == TYPE_COMMON_TAG) {
			if (tagName != null && !isSingleTag()) {
				ret = "</" + tagName + ">";
			}
		} else {
			ret = "";
		}
		return ret;
	}

	/**
	 * 返回所有属性
	 * @return Properties
	 */
	public Properties getProperties()
	{
		return properties;
	}

	/**
	 * 返回当前节点的下级节点列表
	 * @return ArrayList
	 */
	public ArrayList<Tag> getTagList()
	{

		return tagList;
	}

	/**
	 * 返回当前节点的下级节点列表
	 * @return ArrayList
	 */
	public ArrayList<Tag> getSubTagList()
	{
		if (tagList.size() == 1) {
			Tag tag = tagList.get(0);
			if (tag.getType() == TYPE_DESCRIPTION_TAG) {
				return new ArrayList<Tag>();
			}
		}
		return tagList;
	}

	/**
	 * 返回节点类型
	 * @return String
	 */
	public int getType()
	{
		return type;
	}

	/**
	 * 设置标记类型
	 * @param type
	 *            String
	 */
	public void setType(int type)
	{
		this.type = type;
	}

	/**
	 * 设置子标记列表
	 * @param subList
	 *            ArrayList
	 */
	public void setTagList(ArrayList<Tag> tagList)
	{

		this.tagList = tagList;
	}

	/**
	 * 设置标记属性列表,所有的属性都被此属性列表代替
	 * @param properties
	 *            Properties
	 */
	public void setProperties(Properties properties)
	{
		this.properties = properties;
	}

	/**
	 * 设置属性
	 * @param map
	 */
	public void setProperty(Map<String, String> map)
	{
		for (String key : map.keySet()) {
			properties.setProperty(key, map.get(key));
		}
	}

	/**
	 * 设置一组属性项，如果属性名字与原有的冲突，则覆盖原有
	 * @param p
	 *            Properties
	 */
	public void setProperty(Properties p)
	{
		if (p != null) {
			String key;
			Enumeration<Object> e = p.keys();
			while (e.hasMoreElements()) {
				key = (String) e.nextElement();
				properties.setProperty(key, p.getProperty(key));
			}
		}
	}

	/**
	 * 设置一个属性值
	 * @param key
	 *            String
	 * @param value
	 *            String
	 */
	public void setProperty(String key, String value)
	{
		if (key != null && value != null) {
			properties.setProperty(key, unescapeString(value));
		}
	}

	/**
	 * 返回属性值
	 * @param key
	 *            String
	 * @return String
	 */
	public String getProperty(String key)
	{
		return properties.getProperty(key);
	}

	/**
	 * 带有默认值的返回属性值，如果属性值不存在，则返回默认值
	 * @param key
	 *            String
	 * @param value
	 *            默认值 String
	 * @return String
	 */
	public String getProperty(String key, String value)
	{
		return properties.getProperty(key, value);
	}

	/**
	 * 设置标记名称
	 * @param tagName
	 *            String
	 */
	public void setTagName(String tagName)
	{
		this.tagName = tagName;
	}

	/**
	 * 设置标记内容
	 * @param content
	 *            String
	 */
	public void setContent(String content)
	{
		boolean flag = true;
		for (int i = 0; i < this.tagList.size(); i++) {
			Tag t = tagList.get(i);
			if (t.getType() == Tag.TYPE_CONTENT_TAG) {
				flag = false;
				t.setContent(content);
				continue;
			}
			if (t.getTagName() == null || t.getTagName().length() == 0) {
				removeTag(t);
				break;
			}
		}
		if (flag) {
			this.content = content;
		}
	}

	/**
	 * 删除标记，无层次限制
	 */
	public void removeTag(Tag tag)
	{
		tagList.remove(tag);
		for (int i = 0; i < tagList.size(); i++) {
			Tag t = tagList.get(i);
			t.removeTag(tag);
		}
	}

	/**
	 * 返回上级标记
	 */
	public Tag getParent()
	{
		return parent;
	}

	/**
	 * 返回单标记属性列表，仅用于HTML
	 */
	public ArrayList<String> getSingleWordPropertyList()
	{
		return singleWordPropertyList;
	}

	/**
	 * 设置父标记
	 */
	public void setParent(Tag parent)
	{
		this.parent = parent;
	}
}
