/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES XML插件
 * 文件名称: CommonFunction.java
 * 软件版权: 杭州恒生电子股份有限公司
 * 修改记录:
 * 修改日期      修改人员                     修改说明<BR>
 * ========     ======  ============================================
 * 2010-7-21   赵真       代码修整
 * ========     ======  ============================================
 */
package com.hundsun.jres.fui.core.xml;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.RandomAccessFile;
import java.io.Writer;
import java.net.URL;
import java.net.URLDecoder;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Map;
import java.util.Properties;


/**
 * 功能说明: 公用的函数<br>
 * 系统版本: v1.0<br>
 * 开发人员: <br>
 * 开发时间: 2010-7-21<br>
 * 功能描述: <br>
 */
public class CommonFunction
{

	/**
	 * 追加字符串，追加时用“,”号分隔
	 * @param s
	 *            String 目标串
	 * @param str
	 *            String 要追加的字符串
	 * @return String 追加后的串
	 */
	public static String appendString(String s, String str)
	{
		if (str != null) {
			if (s == null) {
				s = str;
			} else {
				s += "," + str;
			}
		}
		return s;
	}

	/**
	 * 返回某个Map或HashTable中的值
	 * @param o
	 *            目标
	 * @param k
	 *            键
	 * @return 键对应的值,找不到返回null
	 * @throws Exception
	 */
	public static Object getMapTableValue(Object o, Object k) throws Exception
	{
		Object v = null;
		if (o instanceof Map) {
			Map m = (Map) o;
			v = m.get(k);
		} else if (o instanceof Hashtable) {
			Hashtable h = (Hashtable) o;
			v = h.get(k);
		} else {
			throw new Exception("不支持的类型" + o.getClass().getName());
		}
		return v;
	}

	/**
	 * 把Properties中的所有Key值变成小写
	 * @param prop
	 *            目标配置
	 * @return key转为小写的Properties
	 */
	public static Properties getLowerCaseKeyProperties(Properties prop)
	{
		Properties p = new Properties();
		Enumeration e = prop.keys();
		while (e.hasMoreElements()) {
			String k = (String) e.nextElement();
			p.setProperty(k.toLowerCase(), prop.getProperty(k));
		}
		return p;
	}

	/**
	 * 分析一段字符串成Xml标记
	 * @param s
	 *            目标XML串
	 * @return XmlTag
	 * @throws Exception
	 */
	public static XmlTag parserXmlString(String s) throws Exception
	{
		XmlParser xp = new XmlParser();
		XmlTag t = xp.parseString(s);
		return t;
	}

	/**
	 * 分析一段Html字符串为Html标记
	 * @param s
	 *            目标HTML串
	 * @return HtmlTag
	 * @throws Exception
	 */
	public static HtmlTag parserHtmlString(String s) throws Exception
	{
		HtmlParser xp = new HtmlParser();
		HtmlTag t = xp.parseString(s);
		return t;
	}

	/**
	 * 复制文件
	 * @param in
	 *            源
	 * @param out
	 *            目标
	 * @throws Exception
	 */
	public static void copyFile(String in, String out) throws Exception
	{
		FileInputStream fis = new FileInputStream(new File(in));
		FileOutputStream fos = new FileOutputStream(new File(out));
		byte[] buf = new byte[1024];
		int i = 0;
		while ((i = fis.read(buf)) != -1) {
			fos.write(buf, 0, i);
		}
		fis.close();
		fos.close();
	}

	/**
	 * 过滤空字符串为""
	 * @param v
	 * @return
	 */
	public static String passNull(Object v)
	{
		if (v == null) {
			return "";
		} else {
			return v.toString();
		}
	}

	/**
	 * 返回一个类的类名
	 * @param cn
	 *            类名
	 * @return 去掉.class的类名
	 */
	public static String getClassName(String cn)
	{
		String s[] = cn.split("[.]");
		return s[s.length - 1];
	}

	/**
	 * 把一段文字写入文本文件中
	 * @param filename
	 *            目标文件名
	 * @param text
	 *            拟写入的字符串
	 * @throws IOException
	 */
	public static void writeTextToFile(String filename, String text) throws IOException
	{
		writeTextToFile(filename, text, null);
	}

	/**
	 * 用某种编码把某段文字写入文本文件中
	 * @param filename
	 *            文件名
	 * @param text
	 *            拟写入的信息
	 * @param encode
	 *            编码
	 * @throws Exception
	 */
	public static void writeTextToFile(String filename, String text, String encode)
			throws IOException
	{
		if (encode == null) {
			encode = "UTF8";
		}
		Writer out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(filename),
				encode));
		/**
		 * 00 00 FE FF = UTF-32, big-endian FF FE 00 00 = UTF-32, little-endian
		 * FE FF = UTF-16, big-endian FF FE = UTF-16, little-endian EF BB BF =
		 * UTF-8
		 */
		// if (encode.equalsIgnoreCase("UTF-8")) {
		// out.write(0xFEFF);
		// } else if (encode.equalsIgnoreCase("UTF-16BE")) {
		// // out.write(0xFFFE);
		// } else if (encode.equalsIgnoreCase("UTF-16LE")) {
		// // out.write(0xFFFE);
		// } else if (encode.equalsIgnoreCase("UTF-32BE")) {
		// // out.write(0x0000FFFE);
		// } else if (encode.equalsIgnoreCase("UTF-32LE")) {
		// // out.write(0xFFFE0000);
		// }
		out.write(text);
		out.close();

	}

	public static String readTextFromFile(String filename) throws Exception
	{
		return readTextFromFile(filename, null);
	}

	public static String readTextFromURL(URL url) throws Exception
	{
		return readTextFromURL(url, null);
	}

	public static String readTextFromURL(String url) throws Exception
	{
		return readTextFromURL(new URL(url));
	}

	public static String readTextFromURL(String url, String cn) throws Exception
	{
		return readTextFromURL(new URL(url), cn);
	}

	/**
	 * 从URL读取文本内容
	 * @param url
	 *            URL
	 * @param cn
	 *            缓冲区大小
	 * @return 读取的文本
	 * @throws Exception
	 */
	public static String readTextFromURL(URL url, String cn) throws Exception
	{
		if (cn == null) {
			cn = getURLEncode(url);
		}
		BufferedReader rd = new BufferedReader(new InputStreamReader(url.openStream(), cn));
		if (!cn.equalsIgnoreCase(CommonFunction.getDefaultCharset())) {
			rd.read();
		}
		StringBuffer sb = new StringBuffer();
		String c;
		while ((c = rd.readLine()) != null) {
			sb.append(c + "\n");
		}
		rd.close();
		return sb.toString();
	}

	/**
	 * 从文件读取文本内容
	 * @param filename
	 *            文件名
	 * @param encode
	 *            编码
	 * @return 读取的文本
	 * @throws Exception
	 */
	public static String readTextFromFile(String filename, String encode) throws Exception
	{
		String ec = encode;
		if (ec == null) {
			ec = CommonFunction.getFileEncode(filename);
		}

		BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream(filename),
				ec));
		if (ec.startsWith("UTF")) {
			in.read();
		}
		String str;

		StringBuffer sb = new StringBuffer();
		while ((str = in.readLine()) != null) {
			sb.append(str + '\n');
		}
		in.close();
		return sb.toString();
	}

	/**
	 * 把一段Xml文本写入文件中
	 * @param filename
	 *            文件名
	 * @param text
	 *            拟写入的XML文本
	 * @param encode
	 *            编码
	 */
	public static void writeTextToXmlFile(String filename, String text, String encode)
			throws Exception
	{
		writeTextToFile(filename, "<?xml version=\"1.0\" encoding=\"" + encode + "\"?>\n" + text,
				encode);

	}

	/**
	 * 日期转换为文本串
	 * @param date
	 *            日期对象
	 * @param format
	 *            日期格式
	 * @return 文本串
	 */
	public static String DateToString(Date date, String format)
	{
		if (format == null) {
			format = "yyyy-MM-dd";
		}
		DateFormat df = new SimpleDateFormat(format);
		return df.format(date);

	}

	/**
	 * 文本串转换为日期对象
	 * @param str
	 *            日期的字符串表示
	 * @return 日期对象
	 * @throws ParseException
	 */
	public static Date StringToDate(String str) throws ParseException
	{
		return StringToDate(str, null);
	}

	/**
	 * 文本串转换为日期对象
	 * @param str
	 *            日期的字符串表示
	 * @param format
	 *            日期格式
	 * @return 日期对象
	 * @throws ParseException
	 */
	public static Date StringToDate(String str, String format) throws ParseException
	{
		if (str == null) {
			return null;
		}
		if (format == null) {
			format = "yyyy-MM-dd";
		}
		DateFormat df = new SimpleDateFormat(format);
		return df.parse(str);

	}

	/**
	 * 返回一段CDATA的标记
	 * @param s
	 *            目标串
	 * @return CDATA标记
	 */
	public static String StringToXmlDataField(String s)
	{
		return "<![CDATA[" + s + "]]>";
	}

	/**
	 * 把字符串转换成Xml方式的转码文件
	 * @param string
	 *            目标串
	 * @return XML格式
	 */
	public static String StringToXmL(String string)
	{
		if (string == null) {
			return null;
		}
		String str = string.replaceAll("<", "&lt;");
		str = str.replaceAll(">", "&gt;");
		str = str.replaceAll("'", "&apos;");
		str = str.replaceAll("&", "&amp;");
		str = str.replaceAll("\"", "&quot;");
		return str;
	}

	/**
	 * 把一段XML编码后的文本转换成正常文本
	 * @param string
	 *            XML格式
	 * @return 文本
	 */
	public static String XmlToString(String string)
	{
		if (string == null) {
			return null;
		}
		String str = string.replaceAll("&lt;", "<");
		str = str.replaceAll("&gt;", ">");
		str = str.replaceAll("&gt;", ">");
		str = str.replaceAll("&apos;", "'");
		str = str.replaceAll("&amp;", "&");
		str = str.replaceAll("&quot;", "\"");
		return str;

	}

	/**
	 * 把java.util.Date类型转换成java.sql.Date类型
	 * @param d
	 *            日期
	 * @return Sql.Date
	 */
	public static java.sql.Date UtilDateToSqlDate(java.util.Date d)
	{
		java.sql.Date dn = new java.sql.Date(d.getTime());
		return dn;
	}

	/**
	 * 返回文件扩展名
	 * @param filename
	 *            文件名
	 * @return 扩展名
	 */
	public static String getExtFileName(String filename)
	{
		if (filename.indexOf(".") < 0) {
			return "";
		} else {
			return filename.substring(filename.lastIndexOf("."));
		}
	}

	/**
	 * 返回默认编码
	 * @return 默认编码
	 */
	public static String getDefaultCharset()
	{
		String encoding = null;
		OutputStreamWriter writer = new OutputStreamWriter(new ByteArrayOutputStream());
		encoding = writer.getEncoding();

		return encoding;
	}

	/**
	 * 返回文件的编码方式
	 * @param file
	 *            文件名
	 * @return 文件编码
	 * @throws Exception
	 */
	public static String getFileEncode(String file) throws Exception
	{
		File f = new File(file);
		RandomAccessFile raf = new RandomAccessFile(f, "r");
		int len = 0;
		byte[] chars = new byte[4];
		len = raf.read(chars, 0, 4);
		raf.close();
		String ret = CommonFunction.getDefaultCharset();
		/**
		 * 00 00 FE FF = UTF-32, big-endian FF FE 00 00 = UTF-32, little-endian
		 * FE FF = UTF-16, big-endian FF FE = UTF-16, little-endian EF BB BF =
		 * UTF-8
		 */
		if (len == 4) {
			if (chars[0] == (byte) 0xFF && chars[1] == (byte) 0xFE && chars[2] == (byte) 0
					&& chars[3] == (byte) 0) {
				ret = "UTF-32LE";
			} else if (chars[0] == (byte) 0 && chars[1] == (byte) 0 && chars[2] == (byte) 0xFF
					&& chars[3] == (byte) 0xFE) {
				ret = "UTF-32BE";
			} else if (chars[0] == (byte) 0xEF && chars[1] == (byte) 0xBB
					&& chars[2] == (byte) 0xBF) {
				ret = "UTF8";
			} else if (chars[0] == (byte) 0xFE && chars[1] == (byte) 0xFF) {
				ret = "UTF-16BE";
			} else if (chars[0] == (byte) 0xFF && chars[1] == (byte) 0xFE) {
				ret = "UTF-16LE";
			}
		}
		return ret;
	}

	/**
	 * 获得URL编码
	 * @param url
	 * @return
	 * @throws Exception
	 */
	public static String getURLEncode(URL url) throws Exception
	{
		return getURLEncode(url, "UTF-8");
	}

	public static String getURLEncode(URL url, String encode) throws Exception
	{
		String ret = encode;
		if (url != null && url.toString().startsWith("file:/")) {
			File f = new File(URLDecoder.decode(url.getFile(), "UTF-8"));
			RandomAccessFile raf = new RandomAccessFile(f, "rw");
			int len = 0;
			byte[] chars = new byte[4];
			while (len < raf.length() && len < 4) {
				chars[len++] = raf.readByte();
			}
			raf.close();
			/**
			 * 00 00 FE FF = UTF-32, big-endian FF FE 00 00 = UTF-32,
			 * little-endian FE FF = UTF-16, big-endian FF FE = UTF-16,
			 * little-endian EF BB BF = UTF-8
			 */
			if (len == 4) {
				if (chars[0] == (byte) 0xFF && chars[1] == (byte) 0xFE && chars[2] == (byte) 0
						&& chars[3] == (byte) 0) {
					ret = "UTF-32LE";
				} else if (chars[0] == (byte) 0 && chars[1] == (byte) 0 && chars[2] == (byte) 0xFF
						&& chars[3] == (byte) 0xFE) {
					ret = "UTF-32BE";
				} else if (chars[0] == (byte) 0xEF && chars[1] == (byte) 0xBB
						&& chars[2] == (byte) 0xBF) {
					ret = "UTF8";
				} else if (chars[0] == (byte) 0xFE && chars[1] == (byte) 0xFF) {
					ret = "UTF-16BE";
				} else if (chars[0] == (byte) 0xFF && chars[1] == (byte) 0xFE) {
					ret = "UTF-16LE";
				}
			}
		}
		return ret;
	}

	/**
	 * 根据URL生成访问地址
	 * @param url
	 *            目标url
	 * @return 访问地址
	 */
	public static String getServerInfo(URL url)
	{
		StringBuffer sb = new StringBuffer();
		sb.append(url.getProtocol() + "://" + url.getHost());
		if (url.getPort() != url.getDefaultPort()) {
			sb.append(":" + url.getPort());
		}
		sb.append("/");
		return sb.toString();
	}

	// 20111021 通过inputstream获得该流的编码格式
	public static String getStreamEncode(InputStream stream, String encode) throws IOException
	{

		if (encode != null) {
			return encode;
		}
		int len = 0;
		stream.mark(4);
		byte[] chars = new byte[4];
		len = stream.read(chars, 0, 4);
		stream.reset();
		/**
		 * 00 00 FE FF = UTF-32, big-endian FF FE 00 00 = UTF-32, little-endian
		 * FE FF = UTF-16, big-endian FF FE = UTF-16, little-endian EF BB BF =
		 * UTF-8
		 */
		String ret = CommonFunction.getDefaultCharset();
		if (len == 4) {
			if (chars[0] == (byte) 0xFF && chars[1] == (byte) 0xFE && chars[2] == (byte) 0
					&& chars[3] == (byte) 0) {
				ret = "UTF-32LE";
			} else if (chars[0] == (byte) 0 && chars[1] == (byte) 0 && chars[2] == (byte) 0xFF
					&& chars[3] == (byte) 0xFE) {
				ret = "UTF-32BE";
			} else if (chars[0] == (byte) 0xEF && chars[1] == (byte) 0xBB
					&& chars[2] == (byte) 0xBF) {
				ret = "UTF8";
			} else if (chars[0] == (byte) 0xFE && chars[1] == (byte) 0xFF) {
				ret = "UTF-16BE";
			} else if (chars[0] == (byte) 0xFF && chars[1] == (byte) 0xFE) {
				ret = "UTF-16LE";
			}
		}
		return ret;

	}

}
