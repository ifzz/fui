/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FWinTag.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 2012-12-06  qudc     新增maximized属性
 * 2013-01-11  qudc     新增onShow属性
 * 2013-03-04  qudc    完成需求：4864，新增属性 hasCloseBtn
 * ========    =======  ============================================
 */
package com.hundsun.jres.fui.jsp.tag.container;

import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.jsp.FTagWithContent;
import com.hundsun.jres.fui.tag.container.FWinProcessor;

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
public class FWinTag extends FTagWithContent {
    /**  */
    private static final long serialVersionUID = 1L;

    private String id;
    private String pageUrl;
    private String isIframe;
    private String width;
    private String height;

    private String title;
    private String buttons;

    private String modal;
    private String buttonAlign;

    private String dragable ;
    private String maxable ;

    private  String onSetHtml ;
    private  String onResize ;
    private  String onClose ;
    private  String maximized ;
    private  String onShow ;
    private  String hasCloseBtn ;

    public void setHasCloseBtn(String hasCloseBtn) {
        this.hasCloseBtn = hasCloseBtn;
    }

    public void setOnShow(String onShow) {
        this.onShow = onShow;
    }

    public void setMaximized(String maximized) {
        this.maximized = maximized;
    }

    public String getIsIframe() {
        return isIframe;
    }

    public void setIsIframe(String isIframe) {
        this.isIframe = isIframe;
    }

    public String getModal() {
        return modal;
    }

    public void setModal(String modal) {
        this.modal = modal;
    }

    public String getDragable() {
        return dragable;
    }

    public void setDragable(String dragable) {
        this.dragable = dragable;
    }

    public String getMaxable() {
        return maxable;
    }

    public void setMaxable(String maxable) {
        this.maxable = maxable;
    }

    public String getOnResize() {
        return onResize;
    }

    public void setOnResize(String onResize) {
        this.onResize = onResize;
    }

    public String getOnClose() {
        return onClose;
    }

    public void setOnClose(String onClose) {
        this.onClose = onClose;
    }

    public String getOnSetHtml() {
        return onSetHtml;
    }

    public void setOnSetHtml(String onSetHtml) {
        this.onSetHtml = onSetHtml;
    }




    public String getButtonAlign() {
        return buttonAlign;
    }

    public void setButtonAlign(String buttonAlign) {
        this.buttonAlign = buttonAlign;
    }


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getButtons() {
        return buttons;
    }

    public void setButtons(String buttons) {
        this.buttons = buttons;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPageUrl() {
        return pageUrl;
    }

    public void setPageUrl(String pageUrl) {
        this.pageUrl = pageUrl;
    }



    public String getWidth() {
        return width;
    }

    public void setWidth(String width) {
        this.width = width;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    /*
    * (non-Javadoc)
    * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#getProcessor()
    */
    public FTagProcessor getProcessor() {
        return new FWinProcessor();
    }

    /*
      * (non-Javadoc)
      * @see com.hundsun.jres.fui.core.page.tag.FBaseTagSupport#doBeforeProcess()
      */
    public void doBeforeProcess() {
        parameters.put("id", id);
        parameters.put("pageUrl", pageUrl);
        parameters.put("isIframe", isIframe);
        parameters.put("width", width);
        parameters.put("height", height);
        parameters.put("title", title);
        parameters.put("buttons", buttons);
        parameters.put("modal", modal);
        parameters.put("buttonAlign", buttonAlign);
        parameters.put("dragable", dragable);
        parameters.put("maxable", maxable);
        parameters.put("onSetHtml", onSetHtml);
        parameters.put("onResize", onResize);
        parameters.put("onClose", onClose);
        parameters.put("maximized", maximized);
        parameters.put("onShow", onShow);
        parameters.put("hasCloseBtn", hasCloseBtn);

    }

    /*
      * (non-Javadoc)
      * @see com.hundsun.jres.fui.jsp.FBaseJspSupport#getName()
      */
    @Override
    public String getName() {
        return "fwin";
    }
}
