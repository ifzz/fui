/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FGridTag.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 *
 * ========    =======  ============================================
 */
package com.hundsun.jres.fui.jsp.tag.container;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithSubElements;
import com.hundsun.jres.fui.tag.container.FGridProcessor;

import java.lang.Boolean;
import java.lang.String;


/**
 * 功能说明:
 * <p/>
 * 系统版本: v1.0<br>
 * 开发人员: qudc <br>
 * 开发时间: 2012-8-22 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FGridTag extends FTagWithSubElements {
    /**  */
    private static final long serialVersionUID = 1L;

    private String id;
    private String width;
    private String height;
    private String emptyMsg;
    private String dataUrl;
    private String selectModel;
    private String autoload;
    private String baseParams;
    private String hasRowNumber;
    private String hasTips;
    private String onBeforesend ;
    private String onLoadsuccess;
    private String onLoadfailure;
    private String onLoadError;
    private String onRowClick;
    private String onRowDbClick;
    private String onRowDeselect;
    private String onRowSelect;
    private String crossPageSelect;
    private String uniqueKey;
    private String onContextMenu ;

    public void setOnContextMenu(String onContextMenu) {
        this.onContextMenu = onContextMenu;
    }

    public void setCrossPageSelect(String crossPageSelect) {
        this.crossPageSelect = crossPageSelect;
    }

    public void setUniqueKey(String uniqueKey) {
        this.uniqueKey = uniqueKey;
    }

    public void setOnLoadError(String onLoadError) {
        this.onLoadError = onLoadError;
    }

    public void setOnRowClick(String onRowClick) {
        this.onRowClick = onRowClick;
    }

    public void setOnRowDbClick(String onRowDbClick) {
        this.onRowDbClick = onRowDbClick;
    }

    public void setOnRowDeselect(String onRowDeselect) {
        this.onRowDeselect = onRowDeselect;
    }

    public void setOnRowSelect(String onRowSelect) {
        this.onRowSelect = onRowSelect;
    }

    public void setOnBeforesend(String onBeforesend) {
        this.onBeforesend = onBeforesend;
    }

    public void setOnLoadsuccess(String onLoadsuccess) {
        this.onLoadsuccess = onLoadsuccess;
    }

    public void setOnLoadfailure(String onLoadfailure) {
        this.onLoadfailure = onLoadfailure;
    }



    public void setId(String id) {
        this.id = id;
    }

    public void setWidth(String width) {
        this.width = width;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public void setEmptyMsg(String emptyMsg) {
        this.emptyMsg = emptyMsg;
    }

    public void setDataUrl(String dataUrl) {
        this.dataUrl = dataUrl;
    }

    public void setSelectModel(String selectModel) {
        this.selectModel = selectModel;
    }

    public void setAutoload(String autoload) {
        this.autoload = autoload;
    }

    public void setBaseParams(String baseParams) {
        this.baseParams = baseParams;
    }

    public void setHasRowNumber(String hasRowNumber) {
        this.hasRowNumber = hasRowNumber;
    }

    public void setHasTips(String hasTips) {
        this.hasTips = hasTips;
    }

    /*
    * (non-Javadoc)
    * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
    */
    public FTagProcessor getProcessor() {
        return new FGridProcessor();
    }

    /*
      * (non-Javadoc)
      * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#doBeforeProcess()
      */
    public void doBeforeProcess() {
        parameters.put("id", id);
        parameters.put("width", width);
        parameters.put("height", height);
        parameters.put("emptyMsg", emptyMsg);
        parameters.put("dataUrl", dataUrl);
        parameters.put("selectModel", selectModel);
        parameters.put("autoload", autoload);
        parameters.put("baseParams", baseParams);
        parameters.put("hasRowNumber", hasRowNumber);
        parameters.put("hasTips", hasTips);
        parameters.put("onBeforesend", onBeforesend);
        parameters.put("onLoadsuccess", onLoadsuccess);
        parameters.put("onLoadfailure", onLoadfailure);
        parameters.put("onLoadError", onLoadError);

        parameters.put("onRowClick", onRowClick);
        parameters.put("onRowDbClick", onRowDbClick);
        parameters.put("onRowSelect", onRowSelect);
        parameters.put("onRowDeselect", onRowDeselect);
        parameters.put("crossPageSelect", crossPageSelect);
        parameters.put("uniqueKey", uniqueKey);
        parameters.put("onContextMenu", onContextMenu);

    }

    /*
      * (non-Javadoc)
      * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
      */
    @Override
    public String getName() {
        return "f-grid";
    }
}
