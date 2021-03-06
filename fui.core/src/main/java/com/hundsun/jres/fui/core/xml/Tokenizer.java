/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES XML插件
 * 类 名 称: Tokenizer.java
 * 软件版权: 杭州恒生电子股份有限公司
 * 修改记录:
 * 修改日期      修改人员                     修改说明<BR>
 * ========     ======  ============================================
 *   
 * ========     ======  ============================================
 */
package com.hundsun.jres.fui.core.xml;

import java.io.*;
/**
 * 功能说明: 分析器<br>
 * 系统版本: v1.0<br>
 * 开发人员: <br>
 * 开发时间: 2010-7-21<br>
 * 功能描述: <br>
 */
public class Tokenizer {

	boolean enableQuote = false; /* Only one of these will be non-null */

	private Reader reader = null;

	private InputStream input = null;

	private char[] content = null;

	private char buf[] = new char[20];

	private int startpos = 0;

	private int maxpos = 0;

	private int peekc = NEED_CHAR;

	private static final int NEED_CHAR = Integer.MAX_VALUE;

	private static final int SKIP_LF = Integer.MAX_VALUE - 1;

	private boolean pushedBack;

	private boolean forceLower;

	/** The line number of the last token read */
	private int LINENO = 1;

	private boolean eolIsSignificantP = false;

	private boolean slashSlashCommentsP = false;

	private boolean slashStarCommentsP = false;

	private byte ctype[] = new byte[256];

	private static final byte CT_WHITESPACE = 1;

	private static final byte CT_DIGIT = 2;

	private static final byte CT_ALPHA = 4;

	private static final byte CT_QUOTE = 8;

	private static final byte CT_COMMENT = 16;

	private static final byte CT_CHAR = 32;

	public int ttype = TT_NOTHING;

	/**
	 * A constant indicating that the end of the stream has been read.
	 */
	public static final int TT_EOF = -1;

	/**
	 * A constant indicating that the end of the line has been read.
	 */
	public static final int TT_EOL = '\n';

	/**
	 * A constant indicating that a number token has been read.
	 */
	public static final int TT_NUMBER = -2;

	/**
	 * A constant indicating that a word token has been read.
	 */
	public static final int TT_WORD = -3;

	public static final int TT_CHAR = -5;

	public static final int TT_BLANK = -6;

	private static final int TT_NOTHING = -4;

	public String sval;
	public double nval;

	private Tokenizer() {
		wordChars('a', 'z');
		wordChars('A', 'Z');
		chars('<');
		chars('>');
		chars('-');
		chars('?');
		chars('!');
		chars(32);
		chars(8);
		// chars(39);
		// chars(34);
		chars(61);

		wordChars(128 + 32, 255);
		wordChars(35, 38);
		wordChars(40, 59);
		wordChars(63, 64);
		wordChars(123, 126);
		wordChars('!', '!');
		whitespaceChars(0, ' ');
		quoteChar('"');
		quoteChar('\'');
		wordChars('/', '/');
		// parseNumbers();
		chars('\\');
		chars('[');
		chars(']');
		// chars('-');
		eolIsSignificant(true);
		ordinaryChars(0, ' ');
		wordChars('#', '#');
		wordChars(':', ':');
		wordChars('.', '.');
		// wordChars('>', '>');
		wordChars('\\', '\\');
		wordChars('-', '-');
		wordChars('_', '_');
		wordChars('%', '%');
	}

	public Tokenizer(InputStream is) {
		this();
		if (is == null) {
			throw new NullPointerException();
		}
		input = is;
	}

	public Tokenizer(Reader r) {
		this();
		if (r == null) {
			throw new NullPointerException();
		}
		reader = r;
	}

	public Tokenizer(String c) {
		this();
		if (c == null) {
			throw new NullPointerException();
		}
		content = c.toCharArray();
		maxpos = content.length;
	}

	public void resetSyntax() {
		for (int i = ctype.length; --i >= 0;) {
			ctype[i] = 0;
		}
	}

	public void chars(int low, int hi) {
		if (low < 0) {
			low = 0;
		}
		if (hi >= ctype.length) {
			hi = ctype.length - 1;
		}
		while (low <= hi) {
			ctype[low++] |= CT_CHAR;
		}
	}

	public void wordChars(int low, int hi) {
		if (low < 0) {
			low = 0;
		}
		if (hi >= ctype.length) {
			hi = ctype.length - 1;
		}
		while (low <= hi) {
			ctype[low++] |= CT_ALPHA;
		}
	}

	public void whitespaceChars(int low, int hi) {
		if (low < 0) {
			low = 0;
		}
		if (hi >= ctype.length) {
			hi = ctype.length - 1;
		}
		while (low <= hi) {
			ctype[low++] = CT_WHITESPACE;
		}
	}

	public void ordinaryChars(int low, int hi) {
		if (low < 0) {
			low = 0;
		}
		if (hi >= ctype.length) {
			hi = ctype.length - 1;
		}
		while (low <= hi) {
			ctype[low++] = 0;
		}
	}

	public void ordinaryChar(int ch) {
		if (ch >= 0 && ch < ctype.length) {
			ctype[ch] = 0;
		}
	}

	public void commentChar(int ch) {
		if (ch >= 0 && ch < ctype.length) {
			ctype[ch] = CT_COMMENT;
		}
	}

	public void chars(int ch) {
		if (ch >= 0 && ch < ctype.length) {
			ctype[ch] = CT_CHAR;
		}
	}

	public void quoteChar(int ch) {
		if (ch >= 0 && ch < ctype.length) {
			ctype[ch] = CT_QUOTE;
		}
	}

	public void parseNumbers() {
		for (int i = '0'; i <= '9'; i++) {
			ctype[i] |= CT_DIGIT;
		}
		ctype['.'] |= CT_DIGIT;
		ctype['-'] |= CT_DIGIT;
	}

	public void eolIsSignificant(boolean flag) {
		eolIsSignificantP = flag;
	}

	public void slashStarComments(boolean flag) {
		slashStarCommentsP = flag;
	}

	public void slashSlashComments(boolean flag) {
		slashSlashCommentsP = flag;
	}

	public void lowerCaseMode(boolean fl) {
		forceLower = fl;
	}

	/** Read the next character */
	private int read() throws IOException {
		if (reader != null) {
			return reader.read();
		} else if (input != null) {
			return input.read();
		} else if (content != null) {
			if (startpos == maxpos) {
				return TT_EOF;
			} else {
				return content[startpos++];
			}
		} else {
			throw new IllegalStateException();
		}
	}

	/**
	 * 返回下一个不为空的标记
	 * 
	 * @return int
	 * @throws IOException
	 */
	public int nextNoneBlankToken() throws IOException {
		int token = nextToken();
		while (token == ' ' || token == '\t' || token == Tokenizer.TT_EOL) {
			token = nextToken();
		}
		return token;
	}

	// public int nextNoneBlankTokenHeader() throws IOException {
	// int token = nextTokenHeader();
	// while (token == ' ' || token == '\t' || token == Tokenizer.TT_EOL) {
	// token = nextTokenHeader();
	// }
	// return token;
	// }

	/**
	 * 下一个标记
	 * 
	 * @return
	 * @throws IOException
	 */
	public int nextToken1() throws IOException {
		if (pushedBack) {
			pushedBack = false;
			return ttype;
		}
		byte ct[] = ctype;
		sval = null;

		int c = peekc;
		if (c < 0) {
			c = NEED_CHAR;
		}
		if (c == SKIP_LF) {
			c = read();
			if (c < 0) {
				return ttype = TT_EOF;
			}
			if (c == '\n') {
				c = NEED_CHAR;
			}
		}
		if (c == NEED_CHAR) {
			c = read();
			if (c < 0) {
				return ttype = TT_EOF;
			}
		}
		ttype = c; /* Just to be safe */

		peekc = NEED_CHAR;

		int ctype = c < 256 ? ct[c] : CT_ALPHA;
		while ((ctype & CT_WHITESPACE) != 0) {
			if (c == '\r') {
				LINENO++;
				if (eolIsSignificantP) {
					peekc = SKIP_LF;
					return ttype = TT_EOL;
				}
				c = read();
				if (c == '\n') {
					c = read();
				}
			} else {
				if (c == '\n') {
					LINENO++;
					if (eolIsSignificantP) {
						return ttype = TT_EOL;
					}
				}
				c = read();
			}
			if (c < 0) {
				return ttype = TT_EOF;
			}
			ctype = c < 256 ? ct[c] : CT_ALPHA;
		}

		if ((ctype & CT_CHAR) != 0) {
			int i = 0;
			do {
				if (i >= buf.length) {
					char nb[] = new char[buf.length * 2];
					System.arraycopy(buf, 0, nb, 0, buf.length);
					buf = nb;
				}
				buf[i++] = (char) c;
				c = read();

				ctype = c < 0 ? CT_WHITESPACE : c < 256 ? ct[c] : CT_ALPHA;
				if ((i >= 1 && buf[i - 1] == '[' && c == ']')) {
					break;
				}
				if (i >= 1 && buf[i - 1] == '>') {
					break;
				}
				if ((i >= 1 && c == '<')) {
					break;
				}
			} while ((ctype & CT_CHAR) != 0);
			peekc = c;
			sval = String.copyValueOf(buf, 0, i);
			if (forceLower) {
				sval = sval.toLowerCase();
			}
			return ttype = TT_CHAR;
		}
		/*
		 * if ((ctype & CT_DIGIT) != 0) { boolean neg = false; if (c == '-') { c
		 * = read(); if (c != '.' && (c < '0' || c > '9')) { peekc = c; return
		 * ttype = '-'; } neg = true; } double v = 0; int decexp = 0; int
		 * seendot = 0; while (true) { if (c == '.' && seendot == 0) { seendot =
		 * 1; } else if ('0' <= c && c <= '9') { v = v * 10 + (c - '0'); decexp
		 * += seendot; } else { break; } c = read(); } peekc = c; if (decexp !=
		 * 0) { double denom = 10; decexp--; while (decexp > 0) { denom *= 10;
		 * decexp--; } // Do one division of a likely-to-be-more-accurate number
		 * v = v / denom; } nval = neg ? -v : v; return ttype = TT_NUMBER; }
		 */
		if ((ctype & CT_ALPHA) != 0) {
			int i = 0;
			do {
				if (i >= buf.length) {
					char nb[] = new char[buf.length * 2];
					System.arraycopy(buf, 0, nb, 0, buf.length);
					buf = nb;
				}
				buf[i++] = (char) c;
				if (i >= 3 && buf[i - 2] == '-' && buf[i - 3] == '-'
						&& c == '>') {
					c = read();
					break;
				}
				c = read();
				ctype = c < 0 ? CT_WHITESPACE : c < 256 ? ct[c] : CT_ALPHA;
				if (i >= 2 && buf[i - 1] == '-' && buf[i - 2] == '-'
						&& c == '>') {
					ctype = CT_ALPHA;
				}
				if (i >= 1 && buf[i - 1] > 128 && c < 128 || i >= 1
						&& buf[i - 1] < 128 && c > 128) {
					break;
				}
				// 注释是为了给容错 href=aa-bb
				// if (i >= 1 && buf[i - 1] != '-' && c == '-') {
				// break;
				// }
			} while ((ctype & (CT_ALPHA | CT_DIGIT)) != 0);
			peekc = c;
			sval = String.copyValueOf(buf, 0, i);
			if (forceLower) {
				sval = sval.toLowerCase();
			}
			return ttype = TT_WORD;
		}

		if (((ctype & CT_QUOTE) != 0) && enableQuote) {
			ttype = c;
			int i = 0;
			int d = read();
			while (d >= 0 && d != ttype) {
				if (d == '\\') {
					c = read();
					int first = c; /* To allow \377, but not \477 */
					if (c >= '0' && c <= '7') {
						c = c - '0';
						int c2 = read();
						if ('0' <= c2 && c2 <= '7') {
							c = (c << 3) + (c2 - '0');
							c2 = read();
							if ('0' <= c2 && c2 <= '7' && first <= '3') {
								c = (c << 3) + (c2 - '0');
								d = read();
							} else {
								d = c2;
							}
						} else {
							d = c2;
						}
					} else {
						switch (c) {
						case 'a':
							c = 0x7;
							break;
						case 'b':
							c = '\b';
							break;
						case 'f':
							c = 0xC;
							break;
						case 'n':
							c = '\n';
							break;
						case 'r':
							c = '\r';
							break;
						case 't':
							c = '\t';
							break;
						case 'v':
							c = 0xB;
							break;
						}
						d = read();
					}
				} else {
					c = d;
					d = read();
				}
				if (i >= buf.length) {
					char nb[] = new char[buf.length * 2];
					System.arraycopy(buf, 0, nb, 0, buf.length);
					buf = nb;
				}
				buf[i++] = (char) c;
			}

			peekc = (d == ttype) ? NEED_CHAR : d;

			sval = String.copyValueOf(buf, 0, i);
			return ttype;
		}

		if (c == '/' && (slashSlashCommentsP || slashStarCommentsP)) {
			c = read();
			if (c == '*' && slashStarCommentsP) {
				int prevc = 0;
				while ((c = read()) != '/' || prevc != '*') {
					if (c == '\r') {
						LINENO++;
						c = read();
						if (c == '\n') {
							c = read();
						}
					} else {
						if (c == '\n') {
							LINENO++;
							c = read();
						}
					}
					if (c < 0) {
						return ttype = TT_EOF;
					}
					prevc = c;
				}
				return nextToken();
			} else if (c == '/' && slashSlashCommentsP) {
				while ((c = read()) != '\n' && c != '\r' && c >= 0) {
					;
				}
				peekc = c;
				return nextToken();
			} else {
				/* Now see if it is still a single line comment */
				if ((ct['/'] & CT_COMMENT) != 0) {
					while ((c = read()) != '\n' && c != '\r' && c >= 0) {
						;
					}
					peekc = c;
					return nextToken();
				} else {
					peekc = c;
					return ttype = '/';
				}
			}
		}

		if ((ctype & CT_COMMENT) != 0) {
			while ((c = read()) != '\n' && c != '\r' && c >= 0) {
				;
			}
			peekc = c;
			return nextToken();
		}

		return ttype = c;
	}

	public int nextToken() throws IOException {
		if (pushedBack) {
			pushedBack = false;
			return ttype;
		}
		byte ct[] = ctype;
		sval = null;

		int c = peekc;
		if (c < 0) {
			c = NEED_CHAR;
		}
		if (c == SKIP_LF) {
			c = read();
			if (c < 0) {
				return ttype = TT_EOF;
			}
			if (c == '\n') {
				c = NEED_CHAR;
			}
		}
		if (c == NEED_CHAR) {
			c = read();
			if (c < 0) {
				return ttype = TT_EOF;
			}
		}
		ttype = c; /* Just to be safe */

		peekc = NEED_CHAR;

		int ctype = c < 256 ? ct[c] : CT_ALPHA;
		while ((ctype & CT_WHITESPACE) != 0) {
			if (c == '\r') {
				LINENO++;
				if (eolIsSignificantP) {
					peekc = SKIP_LF;
					return ttype = TT_EOL;
				}
				c = read();
				if (c == '\n') {
					c = read();
				}
			} else {
				if (c == '\n') {
					LINENO++;
					if (eolIsSignificantP) {
						return ttype = TT_EOL;
					}
				}
				c = read();
			}
			if (c < 0) {
				return ttype = TT_EOF;
			}
			ctype = c < 256 ? ct[c] : CT_ALPHA;
		}

		if ((ctype & CT_CHAR) != 0) {
			int i = 0;
			do {
				if (i >= buf.length) {
					char nb[] = new char[buf.length * 2];
					System.arraycopy(buf, 0, nb, 0, buf.length);
					buf = nb;
				}
				buf[i++] = (char) c;
				c = read();

				ctype = c < 0 ? CT_WHITESPACE : c < 256 ? ct[c] : CT_ALPHA;
				if ((i >= 1 && buf[i - 1] == '[' && c == ']')) {
					break;
				}
				if ((i >= 3 && buf[i - 1] == '-' && buf[i - 2] == '-' && buf[i - 3] == '!')) {
					break;
				}
				if (i >= 1 && buf[i - 1] == '>') {
					break;
				}
				if ((i >= 1 && c == '<')) {
					break;
				}
			} while ((ctype & CT_CHAR) != 0);
			peekc = c;
			sval = String.copyValueOf(buf, 0, i);
			if (forceLower) {
				sval = sval.toLowerCase();
			}
			return ttype = TT_CHAR;
		}
		/*
		 * if ((ctype & CT_DIGIT) != 0) { boolean neg = false; if (c == '-') { c
		 * = read(); if (c != '.' && (c < '0' || c > '9')) { peekc = c; return
		 * ttype = '-'; } neg = true; } double v = 0; int decexp = 0; int
		 * seendot = 0; while (true) { if (c == '.' && seendot == 0) { seendot =
		 * 1; } else if ('0' <= c && c <= '9') { v = v * 10 + (c - '0'); decexp
		 * += seendot; } else { break; } c = read(); } peekc = c; if (decexp !=
		 * 0) { double denom = 10; decexp--; while (decexp > 0) { denom *= 10;
		 * decexp--; } // Do one division of a likely-to-be-more-accurate number
		 * v = v / denom; } nval = neg ? -v : v; return ttype = TT_NUMBER; }
		 */
		if ((ctype & CT_ALPHA) != 0) {
			int i = 0;
			do {
				if (i >= buf.length) {
					char nb[] = new char[buf.length * 2];
					System.arraycopy(buf, 0, nb, 0, buf.length);
					buf = nb;
				}
				buf[i++] = (char) c;
				if (i >= 3 && buf[i - 2] == '-' && buf[i - 3] == '-'
						&& c == '>') {
					c = read();
					break;
				}
				c = read();
				ctype = c < 0 ? CT_WHITESPACE : c < 256 ? ct[c] : CT_ALPHA;
				if (i >= 2 && buf[i - 1] == '-' && buf[i - 2] == '-'
						&& c == '>') {
					ctype = CT_ALPHA;
				}
				if (i >= 1 && buf[i - 1] > 128 && c < 128 || i >= 1
						&& buf[i - 1] < 128 && c > 128 || i >= 1 && c == '/') {
					break;
				}

				// 注释是为了给容错 href=aa-bb
				// if (i >= 1 && buf[i - 1] != '-' && c == '-') {
				// break;
				// }
			} while ((ctype & (CT_ALPHA | CT_DIGIT)) != 0);
			peekc = c;
			sval = String.copyValueOf(buf, 0, i);
			if (forceLower) {
				sval = sval.toLowerCase();
			}
			return ttype = TT_WORD;
		}

		if ((ctype & CT_QUOTE) != 0 && enableQuote) {
			ttype = c;
			int i = 0;
			int d = read();
			while (d >= 0 && d != ttype) {
				c = d;
				d = read();
				if (i >= buf.length) {
					char nb[] = new char[buf.length * 2];
					System.arraycopy(buf, 0, nb, 0, buf.length);
					buf = nb;
				}
				buf[i++] = (char) c;
			}
			peekc = (d == ttype) ? NEED_CHAR : d;

			sval = String.copyValueOf(buf, 0, i);
			if (d != ttype) {
				sval = (char) ttype + sval;
				ttype = CT_ALPHA;
			}
			return ttype;
		}

		if (c == '/' && (slashSlashCommentsP || slashStarCommentsP)) {
			c = read();
			if (c == '*' && slashStarCommentsP) {
				int prevc = 0;
				while ((c = read()) != '/' || prevc != '*') {
					if (c == '\r') {
						LINENO++;
						c = read();
						if (c == '\n') {
							c = read();
						}
					} else {
						if (c == '\n') {
							LINENO++;
							c = read();
						}
					}
					if (c < 0) {
						return ttype = TT_EOF;
					}
					prevc = c;
				}
				return nextToken();
			} else if (c == '/' && slashSlashCommentsP) {
				while ((c = read()) != '\n' && c != '\r' && c >= 0) {
					;
				}
				peekc = c;
				return nextToken();
			} else {
				/* Now see if it is still a single line comment */
				if ((ct['/'] & CT_COMMENT) != 0) {
					while ((c = read()) != '\n' && c != '\r' && c >= 0) {
						;
					}
					peekc = c;
					return nextToken();
				} else {
					peekc = c;
					return ttype = '/';
				}
			}
		}

		if ((ctype & CT_COMMENT) != 0) {
			while ((c = read()) != '\n' && c != '\r' && c >= 0) {
				;
			}
			peekc = c;
			return nextToken();
		}
		if(ttype==10){
			LINENO++;
		}
		return ttype = c;
	}

	public void pushBack() {
		if (ttype != TT_NOTHING) /* No-op if nextToken() not called */
		{
			pushedBack = true;
		}
	}

	public int lineno() {
		return LINENO;
	}

	public String toString() {
		String ret;
		switch (ttype) {
		case TT_EOF:
			ret = "EOF";
			break;
		case TT_EOL:
			ret = "EOL";
			break;
		case TT_WORD:
			ret = sval;
			break;
		case TT_NUMBER:
			ret = "n=" + nval;
			break;
		case TT_NOTHING:
			ret = "NOTHING";
			break;
		default: {
			if (ttype < 256 && ((ctype[ttype] & CT_QUOTE) != 0)) {
				ret = sval;
				break;
			}

			char s[] = new char[3];
			s[0] = s[2] = '\'';
			s[1] = (char) ttype;
			ret = new String(s);
			break;
		}
		}
		return "Token[" + ret + "], line " + LINENO;
	}

}
