/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FTextFieldProcessorWrapper.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 2012-10-23   qudc    将属性 enabled 、readOnly 、autoload 、multiSelect 、selectable 、forceSelection 、selectFirst 属性的类型修改成String类型，原先是boolean类型。
 * 2013-01-18   qudc    新增displaySeparate属性
 * 2013-01-23   qudc    为了统一标准，将enabled属性修改成disabled属性。
 * 2013-01-23   qudc    readOnly属性修改成readonly属性
 * 20130315		hanyin	 增加check属性
 * 2013-03-18   qudc    新增onBeforesend属性
 * 2013-03-28   hanyin   新增filterTarget属性
 * 20130507     hanyin   新增onBlur事件
 * 2013-08-05       hanyin          新增filterCallback回调方法
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.jsp.tag.form;

import com.hundsun.jres.fui.core.FContext;
import com.hundsun.jres.fui.core.FEnvironment;
import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithoutContent;
import com.hundsun.jres.fui.tag.form.FComboProcessor;
import com.hundsun.jres.fui.tag.form.FTextFieldProcessor;

import javax.servlet.http.HttpServletRequest;
import java.lang.String;

/**
 * 功能说明:
 * <p/>
 * 系统版本: v1.0<br>
 * 开发人员: qudc <br>
 * 开发时间: 2012-7-31 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FComboTag extends FTagWithoutContent {
    /**  */
    private static final long serialVersionUID = 1L;
    //属性
    private String id;
    private String name;
    private String valueField;
    private String displayField;
    private String tabIndex;
    private String baseParams;
    private String dataUrl;
    private String defaultValue;
    private String defaultIndex;
    private String displayFormat;
    private String staticData;
    private String width;
    private String disabled ;
    private String readonly;
    private String autoload;
    private String multiSelect;
    private String selectable ;
    private String forceSelection ;
    private String selectFirst ;
    private String multiSeparator;
    private String displaySeparate;
    private String check;
    private String filterTarget;
    private String filterCallback;


    //事件
    private String onLoadsuccess;
    private String onLoadfailure;
    private String onFilter;
    private String onSelect;

    private  String onError ;
    private String onBeforesend ;
    private String onBlur;

    public void setOnBeforesend(String onBeforesend) {
        this.onBeforesend = onBeforesend;
    }

    public void setFilterCallback(String filterCallback) {
        this.filterCallback = filterCallback;
    }

    public void setDisabled(String disabled) {
        this.disabled = disabled;
    }

    public void setReadonly(String readonly) {
        this.readonly = readonly;
    }

    public String getAutoload() {
        return autoload;
    }

    public void setAutoload(String autoload) {
        this.autoload = autoload;
    }

    public String getMultiSelect() {
        return multiSelect;
    }

    public void setMultiSelect(String multiSelect) {
        this.multiSelect = multiSelect;
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

    public String getSelectFirst() {
        return selectFirst;
    }

    public void setSelectFirst(String selectFirst) {
        this.selectFirst = selectFirst;
    }

    public void setCheck(String check) {
        this.check = check;
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

    public String getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
    }

    public String getDefaultIndex() {
        return defaultIndex;
    }

    public void setDefaultIndex(String defaultIndex) {
        this.defaultIndex = defaultIndex;
    }

    public String getDisplayFormat() {
        return displayFormat;
    }

    public void setDisplayFormat(String displayFormat) {
        this.displayFormat = displayFormat;
    }

    public String getStaticData() {
        return staticData;
    }

    public void setStaticData(String staticData) {
        this.staticData = staticData;
    }

    public String getWidth() {
        return width;
    }

    public void setWidth(String width) {
        this.width = width;
    }
    
    public void setFilterTarget(String filterTarget) {
    	this.filterTarget = filterTarget;
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

    public String getOnFilter() {
        return onFilter;
    }

    public void setOnFilter(String onFilter) {
        this.onFilter = onFilter;
    }

    public String getOnSelect() {
        return onSelect;
    }

    public void setOnSelect(String onSelect) {
        this.onSelect = onSelect;
    }

    public String getMultiSeparator() {
        return multiSeparator;
    }

    public void setMultiSeparator(String multiSeparator) {
        this.multiSeparator = multiSeparator;
    }

    public String getOnError() {
        return onError;
    }

    public void setOnError(String onError) {
        this.onError = onError;
    }

    public void setDisplaySeparate(String displaySeparate) {
        this.displaySeparate = displaySeparate;
    }

    public void setOnBlur(String onBlur) {
		this.onBlur = onBlur;
	}

	/*
    * (non-Javadoc)
    * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
    */
    public FTagProcessor getProcessor() {
        return new FComboProcessor();
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
        parameters.put("staticData", staticData);
        parameters.put("tabIndex", tabIndex);
        parameters.put("baseParams", baseParams);
        parameters.put("dataUrl", dataUrl);
        parameters.put("defaultValue", defaultValue);
        parameters.put("defaultIndex", defaultIndex);
        parameters.put("displayFormat", displayFormat);
        parameters.put("width", width);
        parameters.put("disabled", disabled);
        parameters.put("readonly", readonly);
        parameters.put("autoload", autoload);
        parameters.put("multiSelect", multiSelect);
        parameters.put("selectable", selectable);
        parameters.put("onLoadsuccess", onLoadsuccess);
        parameters.put("onLoadfailure", onLoadfailure);
        parameters.put("onError", onError);
        parameters.put("onFilter", onFilter);
        parameters.put("onSelect", onSelect);
        parameters.put("forceSelection", forceSelection);
        parameters.put("selectFirst", selectFirst);
        parameters.put("multiSeparator", multiSeparator);
        parameters.put("displaySeparate", displaySeparate);
        parameters.put("check", check);
        parameters.put("onBeforesend",onBeforesend);
        parameters.put("filterTarget",filterTarget);
        parameters.put("onBlur",onBlur);
        parameters.put("filterCallback",filterCallback);


    }

}
