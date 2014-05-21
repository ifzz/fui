/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: Version.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.version;

/**
 * 版本号类，准从GNU风格，可以比较两个版本号的大小
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-1 <br>
 */
public class Version implements Comparable<Version>
{
	/** 主版本号，重大改动，不保证向前兼容 */
	private int	majorVersion	= 0;
	/** 次版本号，较大功能改进，但是向前兼容 */
	private int	minorVersion	= 0;
	/** 修复版本号，有缺陷修复或者较小的改进 */
	private int	revisionVersion	= 0;
	/** 内部版本号，区分不同平台 */
	private int	buildVersion	= 0;

	public Version(String version)
	{
		String[] little = version.split("[.]");
		if (little.length < 2) {
			throw new IllegalArgumentException("majorVersion and minorVersion missing.");
		}
		majorVersion = Integer.parseInt(little[0]);
		minorVersion = Integer.parseInt(little[1]);
		if (little.length >= 3) {
			revisionVersion = Integer.parseInt(little[2]);
		}
		if (little.length >= 4) {
			buildVersion = Integer.parseInt(little[3]);
		}
	}

	/*
	 * (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj)
	{
		if (obj == null) {
			return false;
		}
		if (!(obj instanceof Version)) {
			return false;
		}
		Version v = (Version) obj;
		return this.compareTo(v) == 0;
	}

	/*
	 * (non-Javadoc)
	 * @see java.lang.Comparable#compareTo(java.lang.Object)
	 */
	public int compareTo(Version o)
	{
		if (o == null) {
			return 1;
		}
		if (majorVersion - o.majorVersion != 0) {
			return majorVersion - o.majorVersion;
		}
		if (minorVersion - o.minorVersion != 0) {
			return minorVersion - o.minorVersion;
		}
		if (revisionVersion - o.revisionVersion != 0) {
			return revisionVersion - o.revisionVersion;
		}
		if (buildVersion - o.buildVersion != 0) {
			return buildVersion - o.buildVersion;
		}
		return 0;
	}

	/*
	 * (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString()
	{
		return (majorVersion + "." + minorVersion + "." + revisionVersion + "." + buildVersion);
	}

	public int getMajorVersion()
	{
		return majorVersion;
	}

	public int getMinorVersion()
	{
		return minorVersion;
	}

	public int getRevisionVersion()
	{
		return revisionVersion;
	}

	public int getBuildVersion()
	{
		return buildVersion;
	}

	/**
	 * 是否是 "0.0.0.0"
	 * @return true表示是初始版本，否则不是
	 */
	public boolean isZero()
	{
		return (majorVersion + minorVersion + revisionVersion + buildVersion == 0);
	}

	public static void main(String[] args)
	{
		Version v = new Version("1.2.34");
		System.out.println(v);

		Version o = new Version("1.2.3");
		System.out.println(o);
		System.out.println(v.compareTo(o));

		System.out.println(v.equals(o));
	}
}
