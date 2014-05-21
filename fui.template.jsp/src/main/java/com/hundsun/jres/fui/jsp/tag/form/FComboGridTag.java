/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FComboGridTag.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 *  2012-12-24  qudc    创建
 * 20130315		hanyin	 增加check属性
 * 20130418		hanyin	增加dataHandler属性
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.jsp.tag.form;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithoutContent;
import com.hundsun.jres.fui.tag.form.FComboGridProcessor;
import com.hundsun.jres.fui.tag.form.FComboProcessor;

/**
 * 功能说明:
 * <p/>
 * 系统版本: v1.0<br>
 * 开发人员: qudc <br>
 * 开发时间: 2012-7-31 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FComboGridTag extends FTagWithoutContent {
    /**  */
    private static final long serialVersionUID = 1L;
    //属性
    private String id;
    private String width;
    private String name;
    private String valueField;
    private String forceSelection ;
    private String displayField;
    private String tabIndex;
    private String baseParams;
    private String dataUrl;
    private String disabled ;
    private String readonly;
    private String listHeight;
    private String listWidth;
    private String pageSize;
    private String selectable ;
    private String colModel ;
    private String multiSelect ;
    private String check;
    private String dataHandler;




    //事件
    private String onLoadsuccess;
    private String onLoadfailure;
    private String onSelect;
    private  String onError ;

    private String forceLoad ;
    private String onBeforesend ;

    private String filterField ;

    public void setFilterField(String filterField) {
        this.filterField = filterField;
    }

    public void setForceLoad(String forceLoad) {
        this.forceLoad = forceLoad;
    }

    public void setOnBeforesend(String onBeforesend) {
        this.onBeforesend = onBeforesend;
    }

    public void setColModel(String colModel) {
        this.colModel = colModel;
    }

    public void setListHeight(String listHeight) {
        this.listHeight = listHeight;
    }

    public void setListWidth(String listWidth) {
        this.listWidth = listWidth;
    }

    public void setPageSize(String pageSize) {
        this.pageSize = pageSize;
    }

    public void setDisabled(String disabled) {
        this.disabled = disabled;
    }

    public void setReadonly(String readonly) {
        this.readonly = readonly;
    }

    public String getSelectable() {
        return selectable;
    }

    public void setSelectable(String selectable) {
        this.selectable = selectable;
    }

    public String getForceSelection() {
        return forceSelection;
    }

    public void setForceSelection(String forceSelection) {
        this.forceSelection = forceSelection;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return "f-combo";
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValueField() {
        return valueField;
    }

    public void setValueField(String valueField) {
        this.valueField = valueField;
    }

    public String getDisplayField() {
        return displayField;
    }

    public void setDisplayField(String displayField) {
        this.displayField = displayField;
    }

    public String getTabIndex() {
        return tabIndex;
    }

    public void setTabIndex(String tabIndex) {
        this.tabIndex = tabIndex;
    }

    public String getBaseParams() {
        return baseParams;
    }

    public void setBaseParams(String baseParams) {
        this.baseParams = baseParams;
    }

    public String getDataUrl() {
        return dataUrl;
    }

    public void setDataUrl(String dataUrl) {
        this.dataUrl = dataUrl;
    }

    public String getWidth() {
        return width;
    }

    public void setWidth(String width) {
        this.width = width;
    }

    public String getDataHandler() {
		return dataHandler;
	}

	public void setDataHandler(String dataHandler) {
		this.dataHandler = dataHandler;
	}

	public String getOnLoadsuccess() {
        return onLoadsuccess;
    }

    public void setOnLoadsuccess(String onLoadsuccess) {
        this.onLoadsuccess = onLoadsuccess;
    }

    public String getOnLoadfailure() {
        return onLoadfailure;
    }

    public void setOnLoadfailure(String onLoadfailure) {
        this.onLoadfailure = onLoadfailure;
    }

    public String getOnSelect() {
        return onSelect;
    }

    public void setOnSelect(String onSelect) {
        this.onSelect = onSelect;
    }

    public String getOnError() {
        return onError;
    }

    public void setOnError(String onError) {
        this.onError = onError;
    }

    public void setMultiSelect(String multiSelect) {
        this.multiSelect = multiSelect;
    }
    
    public void setCheck(String check) {
        this.check = check;
    }

    /*
    * (non-Javadoc)
    * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
    */
    public FTagProcessor getProcessor() {
        return new FComboGridProcessor();
    }

    /*
      * (non-Javadoc)
      * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#doBeforeEnd()
      */
    public void doBeforeProcess() {

        parameters.put("id", id);
        parameters.put("name", name);
        parameters.put("valueField", valueField);
        parameters.put("displayField", displayField);
        parameters.put("tabIndex", tabIndex);
        parameters.put("baseParams", baseParams);
        parameters.put("dataUrl", dataUrl);
        parameters.put("width", width);
        parameters.put("disabled", disabled);
        parameters.put("readonly", readonly);
        parameters.put("selectable", selectable);
        parameters.put("check", check);
        parameters.put("dataHandler", dataHandler);
        
        parameters.put("onLoadsuccess", onLoadsuccess);
        parameters.put("onLoadfailure", onLoadfailure);
        parameters.put("onError", onError);
        parameters.put("onSelect", onSelect);
        parameters.put("forceSelection", forceSelection);
        parameters.put("listHeight", listHeight);
        parameters.put("listWidth", listWidth);
        parameters.put("pageSize", pageSize);
        parameters.put("colModel", colModel);
        parameters.put("forceLoad", forceLoad);
        parameters.put("onBeforesend", onBeforesend);
        parameters.put("filterField", filterField);
        parameters.put("multiSelect", multiSelect);


    }

}
