/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FPagingbarTag.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 20130521		hanyin	增加maxPageSize属性
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.jsp.tag.pagingbar;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithoutContent;
import com.hundsun.jres.fui.tag.pagingbar.FPagingbarProcessor;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: qudc <br>
 * 开发时间: 2012-10-30 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FPagingbarTag extends FTagWithoutContent
{
	/**  */
	private static final long	serialVersionUID	= 1L;

    private String pageSize ;

    private String id ;
    
    private String maxPageSize;

    public void setMaxPageSize(String maxPageSize) {
		this.maxPageSize = maxPageSize;
	}

	public void setPageSize(String pageSize) {
        this.pageSize = pageSize;
    }

    public void setId(String id) {
        this.id = id;
    }

    /*
    * (non-Javadoc)
    * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
    */
	public FTagProcessor getProcessor()
	{
		return new FPagingbarProcessor();
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#doBeforeEnd()
	 */
	public void doBeforeProcess()
	{
		parameters.put("pageSize", pageSize);
		parameters.put("id", id);
		parameters.put("maxPageSize", maxPageSize);
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
	 */
	@Override
	public String getName()
	{
		return "f-pagingbar";
	}

}
