/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FTreeTag.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 *
 * ========    =======  ============================================
 */
package com.hundsun.jres.fui.jsp.tag.container;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithoutContent;
import com.hundsun.jres.fui.tag.container.FTreeProcessor;


/**
 * 功能说明:
 * <p/>
 * 系统版本: v1.0<br>
 * 开发人员: qudc <br>
 * 开发时间: 2012-8-22 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FTreeTag extends FTagWithoutContent {
    /**  */
    private static final long serialVersionUID = 1L;

    private String id;
    private String width;
    private String height;
    private String syncLoad;
    private String baseParams;
    private String dataUrl;
    private String selectModel;
    private String rootVisible;
    private String rootNode;
    private String onBeforeLoad;
    private String onNodeDblClick ;
    private String staticData;
    private String onNodeClick;
    private String onNodeSelect;
    private String onNodeUnSelect;
    private String onLoadsuccess;
    private String onLoadfailure;
    private String onLoadError;
    private String title;

    public void setId(String id) {
        this.id = id;
    }

    public void setWidth(String width) {
        this.width = width;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public void setSyncLoad(String syncLoad) {
        this.syncLoad = syncLoad;
    }

    public void setBaseParams(String baseParams) {
        this.baseParams = baseParams;
    }

    public void setDataUrl(String dataUrl) {
        this.dataUrl = dataUrl;
    }

    public void setSelectModel(String selectModel) {
        this.selectModel = selectModel;
    }

    public void setRootVisible(String rootVisible) {
        this.rootVisible = rootVisible;
    }

    public void setRootNode(String rootNode) {
        this.rootNode = rootNode;
    }

    public void setOnBeforeLoad(String onBeforeLoad) {
        this.onBeforeLoad = onBeforeLoad;
    }

    public void setOnNodeDblClick(String onNodeDblClick) {
        this.onNodeDblClick = onNodeDblClick;
    }

    public void setStaticData(String staticData) {
        this.staticData = staticData;
    }

    public void setOnNodeClick(String onNodeClick) {
        this.onNodeClick = onNodeClick;
    }

    public void setOnNodeSelect(String onNodeSelect) {
        this.onNodeSelect = onNodeSelect;
    }

    public void setOnNodeUnSelect(String onNodeUnSelect) {
        this.onNodeUnSelect = onNodeUnSelect;
    }

    public void setOnLoadsuccess(String onLoadsuccess) {
        this.onLoadsuccess = onLoadsuccess;
    }

    public void setOnLoadfailure(String onLoadfailure) {
        this.onLoadfailure = onLoadfailure;
    }

    public void setOnLoadError(String onLoadError) {
        this.onLoadError = onLoadError;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    /*
    * (non-Javadoc)
    * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
    */
    public FTagProcessor getProcessor() {
        return new FTreeProcessor();
    }

    /*
      * (non-Javadoc)
      * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#doBeforeProcess()
      */
    public void doBeforeProcess() {
        parameters.put("id", id);
        parameters.put("width", width);
        parameters.put("height", height);
        parameters.put("syncLoad", syncLoad);
        parameters.put("baseParams", baseParams);
        parameters.put("dataUrl", dataUrl);
        parameters.put("selectModel", selectModel);
        parameters.put("rootVisible", rootVisible);
        parameters.put("rootNode", rootNode);
        parameters.put("onBeforeLoad", onBeforeLoad);
        parameters.put("onNodeDblClick", onNodeDblClick);
        parameters.put("staticData", staticData);
        parameters.put("onNodeClick", onNodeClick);
        parameters.put("onNodeSelect", onNodeSelect);
        parameters.put("onNodeUnSelect", onNodeUnSelect);
        parameters.put("onLoadsuccess", onLoadsuccess);
        parameters.put("onLoadfailure", onLoadfailure);
        parameters.put("onLoadError", onLoadError);
        parameters.put("title", title);
    }

    /*
      * (non-Javadoc)
      * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
      */
    @Override
    public String getName() {
        return "f-tree";
    }
}
