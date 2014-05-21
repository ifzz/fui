/*
 * 系统名称: ARES 应用快速开发企业套件
 * 模块名称:
 * 类 名 称: URLBean.java
 * 软件版权: 杭州恒生电子股份有限公司
 * 相关文档:
 * 修改记录:
 * 修改日期      修改人员                     修改说明<BR>
 * ========     ======  ============================================
 *   
 * ========     ======  ============================================
 * 评审记录：
 * 
 * 评审人员：
 * 评审日期：
 * 发现问题：
 */
package com.hundsun.jres.fui.core.util;

import java.net.URL;

/**
 * 功能说明: 保存URL的相关信息，用于从文件夹或者jar包里读取的url
 * 系统版本: v1.0 <BR>
 * 开发人员: wjun@hudnsun.com<BR>
 * 开发时间: 2009-8-28<BR>
 *<BR>
 */
public class URLBean {
	private URL url;
	private long lastModifed;//最后修改时间
	private String rootPath;
	private String pathType;//存储类型，值可能是inFolder或inJar或者unknown
	
	public final static  String PATHTYPE_UNKNOWN="unknown";
	public final static  String PATHTYPE_IN_FOLDER="inFolder";//在文件夹中
	public final static  String PATHTYPE_IN_JAR="inJar";//在jar包里
	
	
	/**
	 * 得到url
	 * @return
	 */
	public URL getUrl() {
		return url;
	}
	/**
	 * 设置url
	 * @param url
	 */
	public void setUrl(URL url) {
		this.url = url;
	}
	/**
	 * 得到最后修改时间
	 * @return
	 */
	public long getLastModifed() {
		return lastModifed;
	}
	/**
	 * 设置修改时间
	 * @param lastModifed
	 */
	public void setLastModifed(long lastModifed) {
		this.lastModifed = lastModifed;
	}
	
	/**
	 * 得到根路径
	 * @return
	 */
	public String getRootPath() {
		return rootPath;
	}
	/**
	 * 生成根路径
	 * @param rootPath
	 */
	public void setRootPath(String rootPath) {
		this.rootPath = rootPath;
	}
	/**
	 * 得到路径类型
	 * @return
	 */
	public String getPathType() {
		return pathType;
	}
	/**
	 * 设置路径类型
	 * @param pathType
	 */
	public void setPathType(String pathType) {
		this.pathType = pathType;
	}
	
	public URLBean(URL url,long lastModified,String rootPath,String pathType){
		this.url=url;
		this.lastModifed=lastModified;
		this.rootPath=rootPath;
		this.pathType=pathType;
	}
	
	public URLBean() {
		
	}
}
