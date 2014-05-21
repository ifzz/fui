/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES XML插件
 * 文件名称: XmlParser.java
 * 软件版权: 杭州恒生电子股份有限公司
 * 修改记录:
 * 修改日期      修改人员                     修改说明<BR>
 * ========     ======  ============================================
 *   
 * ========     ======  ============================================
 */
package com.hundsun.jres.fui.core.xml;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;


/**
 * 功能说明: Xml分析器<br>
 * 系统版本: v1.0<br>
 * 开发人员: <br>
 * 开发时间: 2010-7-21<br>
 * 功能描述: <br>
 */
public class XmlParser extends Parser
{
	public XmlParser()
	{
		super.setHtmlParser(false);
	}

	/**
	 * 分析一个文件，等同于pasreFile
	 * @param fillename
	 *            String
	 * @return XmlTag
	 * @throws Exception
	 */
	public XmlTag parse(String fillename) throws Exception
	{
		// getLogger().info("正在分析文件" + fillename);
		return parseFile(fillename);
	}

	/**
	 * 分析jar包中的文件
	 * @param cls
	 *            String 要分析文件名同目录的类
	 * @param fillename
	 *            String 仅文件名
	 * @return XmlTag
	 * @throws Exception
	 */
	public XmlTag parseJarFile(String className, String fillename) throws Exception
	{
		Class cls = Class.forName(className);
		// getLogger().info("正在分析" + cls + "同一目录中的文件" + fillename);
		String cn = CommonFunction.getFileEncode(fillename);
		BufferedReader in = new BufferedReader(new InputStreamReader(cls.getClass()
				.getResourceAsStream(fillename), cn));
		// 预读编码特征字符逻辑不正确，所以注释掉。不预读不影响解析
		// if (!cn.equalsIgnoreCase(CommonFunction.getDefaultCharset())) {
		// in.read();
		// }
		tokenizer = new Tokenizer(in);
		Tag tag = parse();
		in.close();
		return (XmlTag) tag;
	}

	/**
	 * 对流中的数据进行分析
	 * @param stream
	 * @return
	 * @throws Exception
	 */
	public XmlTag parseStream(InputStream stream) throws Exception
	{
		return parseStream(stream, "UTF-8");
	}

	/**
	 * 对流中的数据进行分析
	 * @param stream
	 * @return
	 * @throws Exception
	 */
	public XmlTag parseStream(InputStream stream, String encode) throws Exception
	{
		BufferedReader in = new BufferedReader(new InputStreamReader(stream, encode));
		tokenizer = new Tokenizer(in);
		Tag tag = parse();
		in.close();
		return (XmlTag) tag;
	}

	/**
	 * 分析文件
	 * @param fillename
	 * @param codename
	 * @return
	 * @throws Exception
	 */
	public XmlTag parseFile(String filename, String codename) throws Exception
	{
		String cn = codename;
		if (cn == null) {
			cn = CommonFunction.getFileEncode(filename);
		}
		// getLogger().info("采用编码" + cn + "分析文件" + filename);
		BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream(filename),
				cn));
		// 预读编码特征字符逻辑不正确，所以注释掉。不预读不影响解析
		// if (!cn.equalsIgnoreCase(CommonFunction.getDefaultCharset())) {
		// in.read();
		// }
		tokenizer = new Tokenizer(in);
		Tag tag = parse();
		in.close();
		String encode = tag.getEncode();
		if (encode != null && !isSameEncode(encode, cn)) {
			tag = parseFile(filename, encode);
		}
		return (XmlTag) tag;
	}

	/**
	 * 分析文件
	 * @param filename
	 * @return
	 * @throws Exception
	 */
	public XmlTag parseFile(String filename) throws Exception
	{
		// getLogger().info("分析Xml文件:" + filename);
		return parseFile(filename, null);
	}

	/**
	 * 分析字符串
	 * @param str
	 * @return
	 * @throws Exception
	 */
	public XmlTag parseString(String str) throws Exception
	{
		// getLogger().debug("分析字符串" + str);
		tokenizer = new Tokenizer(str);
		Tag tag = parse();
		return (XmlTag) tag;
	}

	/**
	 * 分析URL中的内容
	 * @param urlStr
	 * @param codename
	 *            编码
	 * @return XmlTag
	 * @throws Exception
	 */
	public XmlTag parseURL(String urlStr, String codename) throws Exception
	{
		URL url = new URL(urlStr);
		String cn = codename;
		if (cn == null) {
			cn = CommonFunction.getURLEncode(url);
		}
		// getLogger().info("采用编码" + cn + "分析URL:" + urlStr);
		BufferedReader rd = new BufferedReader(new InputStreamReader(url.openStream(), cn));
		// 预读编码特征字符逻辑不正确，所以注释掉。不预读不影响解析
		// if (!cn.equalsIgnoreCase(CommonFunction.getDefaultCharset())) {
		// rd.read();
		// }
		tokenizer = new Tokenizer(rd);
		Tag tag = parse();

		rd.close();
		String encode = tag.getEncode();
		if (encode != null && !isSameEncode(encode, cn)) {
			tag = parseURL(urlStr, encode);
		}
		return (XmlTag) tag;
	}

	/**
	 * 分析URL中的内容
	 * @param url
	 * @return
	 * @throws Exception
	 */
	public XmlTag parseURL(URL url) throws Exception
	{
		// getLogger().info("正在分析URL:" + url.toString());
		String cn = CommonFunction.getURLEncode(url);
		BufferedReader rd = new BufferedReader(new InputStreamReader(url.openStream(), cn));
		// 预读编码特征字符逻辑不正确，所以注释掉。不预读不影响解析
		// if (!cn.equalsIgnoreCase(CommonFunction.getDefaultCharset())) {
		// rd.read();
		// }
		tokenizer = new Tokenizer(rd);
		Tag tag = parse();
		rd.close();
		String encode = tag.getEncode();
		if (encode != null && !isSameEncode(encode, cn)) {
			tag = parseURL(url.toString(), encode);
		}

		return (XmlTag) tag;
	}

	/**
	 * 分析URL中的内容
	 * @param urlStr
	 * @return
	 * @throws Exception
	 */
	public XmlTag parseURL(String urlStr) throws Exception
	{
		// getLogger().info("正在分析URL:" + urlStr);
		return parseURL(urlStr, CommonFunction.getDefaultCharset());
	}

	/**
	 * 判别2个编码规则是否一样，比如UTF-8和UTF8是一样的
	 * @param encode1
	 * @param encode2
	 * @return
	 */
	private boolean isSameEncode(String encode1, String encode2)
	{
		boolean flag = false;
		if (encode1 != null && encode2 != null) {
			encode1 = encode1.replaceAll("-", "");
			encode2 = encode2.replaceAll("-", "");
			if (encode1.equalsIgnoreCase(encode2)) {
				flag = true;
			}
		}
		return flag;
	}

}
