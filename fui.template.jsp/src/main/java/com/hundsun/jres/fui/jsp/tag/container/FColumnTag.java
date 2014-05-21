/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FGridTag.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 2012-12-14  qudc     新增sortable属性 和defaultSortDir属性
 * ========    =======  ============================================
 */
package com.hundsun.jres.fui.jsp.tag.container;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithContent;
import com.hundsun.jres.fui.tag.container.FColumnProcessor;


/**
 * 功能说明:
 * <p/>
 * 系统版本: v1.0<br>
 * 开发人员: qudc <br>
 * 开发时间: 2012-8-22 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FColumnTag extends FTagWithContent {
    /**  */
    private static final long serialVersionUID = 1L;

    private String title;
    private String dataIndex;
    private String width;
    private String textAlign;
    private String headerAlign;
    private String renderer;
    private String wordWrap;
    private String sortable;
    private String defaultSortDir;

    public void setSortable(String sortable) {
        this.sortable = sortable;
    }

    public void setDefaultSortDir(String defaultSortDir) {
        this.defaultSortDir = defaultSortDir;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDataIndex(String dataIndex) {
        this.dataIndex = dataIndex;
    }

    public void setWidth(String width) {
        this.width = width;
    }

    public void setTextAlign(String textAlign) {
        this.textAlign = textAlign;
    }

    public void setHeaderAlign(String headerAlign) {
        this.headerAlign = headerAlign;
    }

    public void setRenderer(String renderer) {
        this.renderer = renderer;
    }

    public void setWordWrap(String wordWrap) {
        this.wordWrap = wordWrap;
    }

    /*
    * (non-Javadoc)
    * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
    */
    public FTagProcessor getProcessor() {
        return new FColumnProcessor();
    }

    /*
      * (non-Javadoc)
      * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#doBeforeProcess()
      */
    public void doBeforeProcess() {

        parameters.put("title", title);
        parameters.put("dataIndex", dataIndex);
        parameters.put("width", width);
        parameters.put("textAlign", textAlign);
        parameters.put("headerAlign", headerAlign);
        parameters.put("renderer", renderer);
        parameters.put("wordWrap", wordWrap);
        parameters.put("sortable", sortable);
        parameters.put("defaultSortDir", defaultSortDir);
    }

    /*
      * (non-Javadoc)
      * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
      */
    @Override
    public String getName() {
        return "f-column";
    }
}
