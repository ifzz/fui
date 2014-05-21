/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES XML插件
 * 类 名 称: Parser.java
 * 软件版权: 杭州恒生电子股份有限公司
 * 修改记录:
 * 修改日期      修改人员                     修改说明<BR>
 * ========     ======  ============================================
 *   
 * ========     ======  ============================================
 */
package com.hundsun.jres.fui.core.xml;

import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.io.StreamTokenizer;


/**
 * 功能说明: 标记文件分析类<br>
 * 系统版本: v1.0<br>
 * 开发人员: <br>
 * 开发时间: 2010-7-21<br>
 * 功能描述: <br>
 */
public class Parser {
	protected Tokenizer tokenizer = null;

	boolean htmlParser = true;

	/**
	 * 分析一段文本内容
	 * 
	 * @param content
	 *            String 目标文本
	 */
	public Parser(String content) {
		tokenizer = new Tokenizer(content);
	}

	/**
	 * 新建一个标记
	 * 
	 * @return 标记
	 */
	private Tag newTag() {
		if (htmlParser) {
			return new HtmlTag();
		} else {
			return new XmlTag();
		}
	}

	/**
	 * 构造函数
	 * 
	 */
	public Parser() {
	}

	/**
	 * 分析一个文件
	 * 
	 * @param stream
	 *            InputStream 目标文件
	 */
	public Parser(InputStream stream) {
		tokenizer = new Tokenizer(stream);
	}

	/**
	 * 分析Reader
	 * 
	 * @param reader
	 *            Reader 目标Reader
	 */
	public Parser(Reader reader) {
		tokenizer = new Tokenizer(reader);
	}

	/**
	 * 获得标记
	 * 
	 * @param fathertag
	 *            HtmlTag 父标记
	 * @return String
	 * @throws IOException
	 */
	private String getTag(Tag fathertag) throws IOException {
		int token = tokenizer.nextToken();
		Tag tag = null;
		while (token != StreamTokenizer.TT_EOF) {
			if (tokenizer.sval == null) {
				if (token > 32) {
					tokenizer.pushBack();
					tag = newTag();
					tag.setLineNo(tokenizer.lineno());
					fathertag.addTag(tag);
					tag.setType(Tag.TYPE_DESCRIPTION_TAG);
					readContentTag(tag);
				}
			} else if (tokenizer.sval.startsWith("<!--")) {
				tokenizer.pushBack();
				// 
				tag = readMemoTag();
				fathertag.addTag(tag);
			} else if (tokenizer.sval.startsWith("<?")) {
				tokenizer.pushBack();
				// 
				this.tokenizer.enableQuote = true;
				tag = readXmlTag();
				this.tokenizer.enableQuote = false;
				fathertag.addTag(tag);
			} else if (tokenizer.sval.startsWith("<![")) {
				tokenizer.pushBack();
				// ˵����
				tag = readContentTag();
				fathertag.addTag(tag);
			} else if (tokenizer.sval.startsWith("<!")) {
				tokenizer.pushBack();
				// 
				tag = readReserveTag();
				fathertag.addTag(tag);
			} else if (tokenizer.sval.startsWith("<")) {
				tokenizer.nextToken();
				if (tokenizer.sval == null) {

				} else if (tokenizer.sval.startsWith("/")) {
					// ˵����
					String v = tokenizer.sval.substring(1);
					tokenizer.nextToken();
					if (tokenizer.sval != null && tokenizer.sval.equals(">")) {
						// 
						if (tag == null) {
							// 这里是处理表示的意思是：如果有</xxx>标记时，如果前面没有xxx标记，则忽略之
							Tag t = fathertag;
							while (t != null) {
								if (t.getTagName() != null
										&& t.compareString(t.getTagName(), v)) {
									return v;
								} else {
									t = t.getParent();
								}
							}
							return v;
						} else {
							if (v.equalsIgnoreCase("")
									|| tag.compareString(v, tag.getTagName())) {
								continue;
							} else {
								return v;
							}
						}
					}
				} else {
					tokenizer.pushBack();
					// 读入普通标记˵����yfn ty uocesfyn
					String endtagname = readCommonTag(fathertag);
					if (tag == null && endtagname != null) {
						return endtagname;
					} else {
						if (tag == null && endtagname == null) {

						} else {
							if (endtagname == null
									|| endtagname.equalsIgnoreCase(tag
											.getTagName())) {
							} else {
								return endtagname;
							}
						}
					}
				}
			} else {
				tokenizer.pushBack();
				tag = newTag();
				tag.setLineNo(tokenizer.lineno());
				fathertag.addTag(tag);
				tag.setType(Tag.TYPE_DESCRIPTION_TAG);
				readContentTag(tag);
			}
			token = tokenizer.nextToken();
		}
		return null;
	}

	/**
	 * 读入标记内容
	 * 
	 * @param tag
	 *            标记
	 * @throws IOException
	 */
	private void readContentTag(Tag tag) throws IOException {
		int token = tokenizer.nextToken();
		StringBuffer sb = new StringBuffer();
		while (token != StreamTokenizer.TT_EOF) {
			if (tokenizer.sval == null) {
				sb.append((char) token);
			} else if (!tokenizer.sval.startsWith("<")) {
				if (token == '\'') {
					sb.append("'" + tokenizer.sval + "'");
				} else if (token == '"') {
					sb.append("\"" + tokenizer.sval + "\"");
				} else {
					sb.append(tokenizer.sval);
				}
			} else {
				break;
			}
			token = tokenizer.nextToken();
		}
		if (token != StreamTokenizer.TT_EOF) {
			tokenizer.pushBack();
		}
		tag.setContent(tag.unescapeString(sb.toString().trim()));
	}

	/**
	 * 开始分析并返回分析结果
	 * 
	 * @return Tag 返回标记
	 */
	public Tag parse() throws IOException {
		Tag tag = newTag();

		int p = tokenizer.nextToken();
		while (p != Tokenizer.TT_EOF) {
			tokenizer.pushBack();
			getTag(tag);
			p = tokenizer.nextToken();
		}
		if (tag.getTagList().size() == 1) {
			tag = (Tag) tag.getTagList().get(0);
			tag.setParent(null);
		}
		return tag;
	}

	/**
	 * 读入一般标记
	 * 
	 * @return Tag 一般标记
	 * @throws IOException
	 */
	private String readCommonTag(Tag ft) throws IOException {
		String ret = null;
		Tag tag = newTag();
		tag.setLineNo(tokenizer.lineno());
		ft.addTag(tag);
		tag.setType(Tag.TYPE_COMMON_TAG);
		this.tokenizer.enableQuote = true;
		ret = readHeader(tag);
		this.tokenizer.enableQuote = false;
		if (ret == null) {
			if (tag.getTagName().equalsIgnoreCase("script")
					&& (tag instanceof HtmlTag)) {
				readContent(tag);
			} else {
				ret = getTag(tag);
				if (ret == null || ret.equalsIgnoreCase(tag.getTagName())) {
					ret = null;
				}
			}
		} else {
			if (ret.equals(tag.getTagName())) {
				ret = null;
			}
		}
		return ret;
	}

	/**
	 * 读入内容
	 * 
	 * @param tag
	 *            Tag 标记
	 * @throws IOException
	 */
	private void readContent(Tag tag) throws IOException {
		int token = tokenizer.nextToken();
		StringBuffer sb = new StringBuffer();
		while (token != Tokenizer.TT_EOF) {
			if (tokenizer.sval == null) {
				sb.append((char) token);
			} else if (!tokenizer.sval.equals("<")) {
				if (token == '"') {
					sb.append("\"" + tokenizer.sval + "\"");
				} else if (token == '\'') {
					sb.append("'" + tokenizer.sval + "'");
				} else {
					sb.append(tokenizer.sval);
				}
			} else {
				tokenizer.nextToken();
				if (tokenizer.sval != null) {
					if (tokenizer.sval.equalsIgnoreCase("/" + tag.getTagName())) {
						String v = tokenizer.sval;
						tokenizer.nextToken();
						if (tokenizer.sval.equals(">")) {
							tag.setContent(sb.toString().trim());
							return;
						} else {
							sb.append("<" + v + tokenizer.sval);
						}
					} else {
						sb.append("<" + tokenizer.sval);
					}
				}

			}
			token = tokenizer.nextToken();
		}
		tag.setContent(tag.unescapeString(sb.toString().trim()));
	}

	/**
	 * 读入标记头
	 * 
	 * @param tag
	 *            Tag 标记
	 * @throws IOException
	 * @return
	 */
	private String readHeader(Tag tag) throws IOException {
		int token = tokenizer.nextNoneBlankToken();
		while (token != StreamTokenizer.TT_EOF) {
			if (tokenizer.sval == null) {

			} else if (tokenizer.sval.equals("<")) {
				tokenizer.pushBack();
				return tag.getTagName();
			} else if (tokenizer.sval.equals("/")) {
				tokenizer.nextToken();
				if (tokenizer.sval != null && tokenizer.sval.equals(">")) {
					return tag.getTagName();
				} else {
					tokenizer.pushBack();
				}

			} else if (tokenizer.sval.equals(">")) {
				// 标记结束
				if (tag.isSingleTag()) {
					return tag.getTagName();
				} else {
					return null;
				}
			} else {
				// 其它标记内容
				if (tag.getTagName() == null) {
					tag.setTagName(tokenizer.sval);
				} else {
					String k = tokenizer.sval;
					tokenizer.nextNoneBlankToken();
					if (tokenizer.sval != null) {
						if (tokenizer.sval.equals("=")) {
							tokenizer.nextNoneBlankToken();
							if (tokenizer.ttype == '\"'
									|| tokenizer.ttype == '\'') {
								tag.setProperty(k, tag
										.unescapeString(tokenizer.sval));

							} else {
								StringBuffer sb = new StringBuffer();
								while (tokenizer.nval != Tokenizer.TT_BLANK
										&& tokenizer.ttype != Tokenizer.TT_EOF) {
									if (tokenizer.sval == null) {
										break;
									} else {
										if (tokenizer.sval.equals(">")) {
											tokenizer.pushBack();
											break;
										}
										if (tokenizer.sval.equals("/")) {
											tokenizer.nextNoneBlankToken();
											if (tokenizer.sval.equals(">"))
												return tag.getTagName();
											else {
												sb.append("/" + tokenizer.sval);
											}
										} else {
											if (tokenizer.ttype == '\'') {
												sb.append("'" + tokenizer.sval
														+ "'");
											} else if (tokenizer.ttype == '\'') {
												sb.append("\"" + tokenizer.sval
														+ "\"");
											} else
												sb.append(tokenizer.sval);
										}
									}
									tokenizer.nextToken();
								}
								tag.setProperty(k, tag.unescapeString(sb
										.toString()));

							}
						} else if (tokenizer.sval.equals(">")) {
							tag.addSingleWordProperty(k);
							return null;
						} else if (tokenizer.sval.equals("/")) {
							tag.addSingleWordProperty(k);
						}
					} else {
						// 说明是单个标记
						if (k.equals("/") && tokenizer.sval.equals(">")) {
							return tag.getTagName();
						} else {
							if (k != null && k.length() > 0)
								tag.addSingleWordProperty(k);
							tokenizer.pushBack();
						}
					}
				}
			}
			token = tokenizer.nextNoneBlankToken();
		}
		return tag.getTagName();
	}

	/**
	 * 读入注释标记
	 * 
	 * @param tag
	 *            Tag 标记
	 */
	private Tag readMemoTag() throws IOException {
		Tag tag = newTag();
		tag.setLineNo(tokenizer.lineno());
		tag.setType(Tag.TYPE_MEMO_TAG);
		StringBuffer sb = new StringBuffer();
		int token = tokenizer.nextToken();
		while (token != StreamTokenizer.TT_EOF) {
			if (tokenizer.sval == null) {
				sb.append((char) token);
			} else if (tokenizer.sval.startsWith("<!--")) {
				if (tokenizer.sval.length() > 4) {
					sb.append(tokenizer.sval.substring(4));
				}

			} else if (tokenizer.sval.endsWith("-->")) {
				if (tokenizer.sval.length() > 3) {
					sb.append(tokenizer.sval.substring(0, tokenizer.sval
							.length() - 3));
				}
				break;
			} else {
				if (token == '\'') {
					sb.append("'" + tokenizer.sval + "'");
				} else if (token == '"') {
					sb.append("\"" + tokenizer.sval + "\"");
				} else {
					sb.append(tokenizer.sval);
				}
			}
			token = tokenizer.nextToken();
		}
		tag.setContent(sb.toString().trim());
		return tag;
	}

	/**
	 * 读入Xml的标记信息
	 * 
	 * @return 标记
	 * @throws IOException
	 */
	private Tag readXmlTag() throws IOException {
		Tag tag = newTag();
		tag.setLineNo(tokenizer.lineno());
		tag.setType(Tag.TYPE_XML_TAG);
		int token = tokenizer.nextToken();
		while (token != StreamTokenizer.TT_EOF) {
			if (tokenizer.sval == null) {
			} else if (tokenizer.sval.startsWith("<?")) {
				tokenizer.nextNoneBlankToken();
				if (!tokenizer.sval.equals("xml")) {

				}
			} else if (tokenizer.sval.endsWith("?>")) {
				break;
			} else {
				String key = tokenizer.sval;
				tokenizer.nextNoneBlankToken();
				if (tokenizer.sval != null) {
					if (tokenizer.sval.equals("=")) {
						tokenizer.nextNoneBlankToken();
						tag.setProperty(key, tokenizer.sval);
					}
				}
			}
			token = tokenizer.nextNoneBlankToken();
		}
		return tag;
	}

	/**
	 * 读入&lt![CDATA[abc]]&gl;标记中的内容
	 * 
	 * @return 标记
	 * @throws IOException
	 */
	private Tag readContentTag() throws IOException {
		Tag tag = newTag();
		tag.setLineNo(tokenizer.lineno());
		tag.setType(Tag.TYPE_CONTENT_TAG);
		StringBuffer sb = new StringBuffer();
		int token = tokenizer.nextToken();

		while (token != StreamTokenizer.TT_EOF) {
			if (tokenizer.sval == null) {
				sb.append((char) token);
			} else if (tokenizer.sval.startsWith("<![")) {
				token = tokenizer.nextToken();
				if (tokenizer.sval != null && tokenizer.sval.equals("CDATA")) {
					token = tokenizer.nextToken();
					if (tokenizer.sval != null
							&& tokenizer.sval.startsWith("[")) {
						// 开始读入
						sb.append(tokenizer.sval.substring(1));
					}
				}
			} else if (tokenizer.sval.endsWith("]]>")) {
				tokenizer.enableQuote = true;
				sb.append(tokenizer.sval.substring(0,
						tokenizer.sval.length() - 3));
				break;
			} else {
				if (token == '\'') {
					sb.append("'" + tokenizer.sval + "'");
				} else if (token == '"') {
					sb.append("\"" + tokenizer.sval + "\"");
				} else {
					sb.append(tokenizer.sval);
				}
			}
			token = tokenizer.nextToken();
		}
		tag.setContent(sb.toString().trim());
		return tag;
	}

	/**
	 * 读取储备标记
	 * 
	 * @return 标记
	 * @throws IOException
	 */
	private Tag readReserveTag() throws IOException {
		Tag tag = newTag();
		tag.setLineNo(tokenizer.lineno());
		tag.setType(Tag.TYPE_RESERVE_TAG);
		StringBuffer sb = new StringBuffer();
		int token = tokenizer.nextToken();
		while (token != StreamTokenizer.TT_EOF) {
			if (tokenizer.sval == null) {
				sb.append((char) token);
			} else if (tokenizer.sval.startsWith("<!")) {
			} else if (tokenizer.sval.endsWith(">")) {
				break;
			} else {
				if (token == '\'') {
					sb.append("'" + tokenizer.sval + "'");
				}
				if (token == '"') {
					sb.append("\"" + tokenizer.sval + "\"");
				} else {
					sb.append(tokenizer.sval);
				}
			}
			token = tokenizer.nextToken();
		}
		tag.setContent(sb.toString().trim());
		return tag;
	}

	/**
	 * 返回是否是Html标记
	 * 
	 * @return 
	 */
	public boolean isHtmlParser() {
		return htmlParser;
	}

	/**
	 * 设置是否是Html标记
	 * 
	 * @param htmlParser 
	 */
	public void setHtmlParser(boolean htmlParser) {
		this.htmlParser = htmlParser;
	}
}
