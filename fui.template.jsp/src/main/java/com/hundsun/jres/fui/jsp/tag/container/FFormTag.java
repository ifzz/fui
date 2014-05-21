/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FToolGroupTag.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 *  2012-10-30  qudc     修改getName方法的返回值，”f_toolbar“ 改成 “f-toolbar”
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.jsp.tag.container;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithContent;
import com.hundsun.jres.fui.tag.container.FFormProcessor;

/**
 * Form表单组件
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-15 <br>
 */
public class FFormTag extends FTagWithContent
{
	private static final long	serialVersionUID	= 1L;

	private String				id;
	private String				clz;
	private String				style;
	private String				action;
	private String				enterSwitch;
	private String				params;
	private String				beforeSubmit;
	private String				onSuccess;
	private String				onFailure;
	private String				onError;
    private String				isUpload;
    private String				onFileUploadEvent;
    private String				uploadType;


    public void setUploadType(String uploadType) {
        this.uploadType = uploadType;
    }

    public void setId(String id)
	{
		this.id = id;
	}

	public void setClasses(String clz)
	{
		this.clz = clz;
	}

	public void setStyle(String style)
	{
		this.style = style;
	}

	public void setAction(String action)
	{
		this.action = action;
	}

	public void setEnterSwitch(String enterSwitch)
	{
		this.enterSwitch = enterSwitch;
	}

	public void setParams(String params)
	{
		this.params = params;
	}

	public void setBeforeSubmit(String beforeSubmit)
	{
		this.beforeSubmit = beforeSubmit;
	}

	public void setOnSuccess(String onSuccess)
	{
		this.onSuccess = onSuccess;
	}

	public void setOnFailure(String onFailure)
	{
		this.onFailure = onFailure;
	}

	public void setOnError(String onError)
	{
		this.onError = onError;
	}

    public void setIsUpload(String upload) {
        isUpload = upload;
    }

    public void setOnFileUploadEvent(String onFileUploadEvent) {
        this.onFileUploadEvent = onFileUploadEvent;
    }

    /*
      * (non-Javadoc)
      * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
      */
	public FTagProcessor getProcessor()
	{
		return new FFormProcessor();
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
	 */
	@Override
	public String getName()
	{
		return "f-form";
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#doBeforeProcess()
	 */
	@Override
	protected void doBeforeProcess()
	{
		parameters.put("id", id);
		parameters.put("class", clz);
		parameters.put("style", style);
		parameters.put("action", action);
		parameters.put("enterSwitch", enterSwitch);
		parameters.put("params", params);
		parameters.put("beforeSubmit", beforeSubmit);
		parameters.put("onError", onError);
		parameters.put("onFailure", onFailure);
		parameters.put("onSuccess", onSuccess);
        parameters.put("isUpload", isUpload);
        parameters.put("onFileUploadEvent", onFileUploadEvent);
        parameters.put("uploadType", uploadType);
	}

}
