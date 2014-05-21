/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES XML插件
 * 文件名称: HtmlParser.java
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
import java.io.InputStreamReader;
import java.net.URL;


/**
 * 功能说明: 对Html文件进行分析<br>
 * 系统版本: v1.0<br>
 * 开发人员: <br>
 * 开发时间: 2010-7-21<br>
 * 功能描述: <br>
 */
public class HtmlParser extends Parser
{
	public HtmlParser()
	{
		setHtmlParser(true);
	}

	/**
	 * 分析一个文件
	 * @param filename
	 *            String
	 * @return HtmlTag
	 * @throws Exception
	 */
	public HtmlTag parse(String filename) throws Exception
	{
		return parseFile(filename);
	}

	/**
	 * 用指定编码分析文件
	 * @param filename
	 *            String
	 * @param codename
	 *            String
	 * @return HtmlTag
	 * @throws Exception
	 */
	public HtmlTag parseFile(String filename, String codename) throws Exception
	{
		String cn = codename;
		if (cn == null) {
			cn = CommonFunction.getFileEncode(filename);
		}
		BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream(filename),
				cn));
		tokenizer = new Tokenizer(in);
		Tag tag = parse();
		in.close();
		if (codename == null) {
			String encode = tag.getEncode();
			if (encode != null && !encode.equalsIgnoreCase(cn)) {
				tag = parseFile(filename, encode);
			}
		}
		return (HtmlTag) tag;
	}

	/**
	 * 用分析文件
	 * @param filename
	 *            String
	 * @return HtmlTag
	 * @throws Exception
	 */
	public HtmlTag parseFile(String filename) throws Exception
	{
		return parseFile(filename, null);
	}

	/**
	 * 分析一段文本串
	 * @param str
	 * @return
	 * @throws Exception
	 */
	public HtmlTag parseString(String str) throws Exception
	{
		tokenizer = new Tokenizer(str);
		Tag tag = parse();
		return (HtmlTag) tag;
	}

	/**
	 * 用指定编码分析URL
	 * @param filename
	 * @param codename
	 * @return
	 * @throws Exception
	 */
	public HtmlTag parseURL(String urlStr, String codename) throws Exception
	{
		URL url = new URL(urlStr);
		String cn = codename;
		if (cn == null) {
			cn = CommonFunction.getURLEncode(url);
		}
		BufferedReader rd = new BufferedReader(new InputStreamReader(url.openStream(), cn));
		tokenizer = new Tokenizer(rd);
		Tag tag = parse();
		rd.close();
		if (codename == null) {
			String encode = tag.getEncode();
			if (encode != null && !encode.equalsIgnoreCase(cn)) {
				tag = parseURL(urlStr, encode);
			}
		}
		return (HtmlTag) tag;
	}

	/**
	 * 分析地址
	 * @param urlStr
	 * @return
	 * @throws Exception
	 */
	public HtmlTag parseURL(String urlStr) throws Exception
	{
		return parseURL(urlStr, null);
	}

	/**
	 * 分析地址
	 * @param url
	 *            URL
	 * @return HtmlTag
	 * @throws Exception
	 */
	public HtmlTag parseURL(URL url) throws Exception
	{
		return parseURL(url, null);
	}

	/**
	 * 分析地址
	 * @param url
	 * @param encode
	 * @return
	 * @throws Exception
	 */
	public HtmlTag parseURL(URL url, String encode) throws Exception
	{
		return parseURL(url.toString(), encode);
	}

}
