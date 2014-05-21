/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FUploadTag.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 20130315		hanyin	 增加check属性
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.jsp.tag.form;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithoutContent;
import com.hundsun.jres.fui.tag.form.FLabelProcessor;
import com.hundsun.jres.fui.tag.form.FUploadProcessor;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-21 <br>
 */
public class FUploadTag extends FTagWithoutContent
{
	private static final long	serialVersionUID	= 1L;
	private String				id;
	private String				classes;
	private String				width;
	private String				name;
	private String				tabIndex;
    private String				size;
    private String check;


    public void setId(String id) {
        this.id = id;
    }


    public void setClasses(String classes) {
        this.classes = classes;
    }


    public void setWidth(String width) {
        this.width = width;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setTabIndex(String tabIndex) {
        this.tabIndex = tabIndex;
    }

    public void setSize(String size) {
        this.size = size;
    }

	public void setCheck(String check)
	{
		this.check = check;
	}

    /*
    * (non-Javadoc)
    * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
    */
	public FTagProcessor getProcessor()
	{
		return new FUploadProcessor();
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
	 */
	@Override
	public String getName()
	{
		return "fupload";
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#doBeforeProcess()
	 */
	@Override
	protected void doBeforeProcess()
	{
		parameters.put("id", id);
		parameters.put("classes", classes);
		parameters.put("width", width);
		parameters.put("name", name);
		parameters.put("tabIndex", tabIndex);
		parameters.put("size", size);
		parameters.put("check", check);
	}

}
