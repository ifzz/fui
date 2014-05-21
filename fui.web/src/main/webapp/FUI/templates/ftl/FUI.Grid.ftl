<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Grid.ftl
 # 作者：qudc
 # 邮箱：qudc@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述：Gird组件的dom结构
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 2012-10-24		qudc	 创建
 # 2013-2-22        qudc           删除多余的半个div标签，解决ie下tabs组件无iframe模式下异步加载含有grid组件的页面时，不能正常展现的问题
 # 20130415         hanyin         需求5698 ，在不设置宽度的情况下，自动撑开父亲的宽度
-->
<#macro grid id="" width="" height="" emptyMsg="" dataUrl=""  selectModel="" autoload="" baseParams="" hasRowNumber="" hasTips="" onLoadsuccess="" onLoadfailure="" onLoadError="" onBeforesend="" onRowClick="" onRowDbClick="" onRowSelect="" onRowDeselect="" crossPageSelect="" uniqueKey="" onContextMenu="">

<@validateAndSet name="id" default=genId("f-grid") />


<div id="${id}" class="f-grid" <#if (width?length!=0)>style="width:${width}px;"</#if>>
<#-- 存放该组件的toolbar  <f:toolbar></f:toolbar>-->
    <#assign "_toolbar"="">
    <#assign "_colModel"="">
    <#assign "_pagingbar"="">
    <#assign "_isFirst"="true">
    <#assign "_toolbarId"="">
    <#assign "_pagingbarId"="">

    <#list _parsedElements as part>
        <#assign tagName>${strValue(valueInList(_subTagNames , part_index), '')}</#assign>
            <#if tagName == "f-toolbar">
                <#assign _toolbarId>${strValue(valueInList(_subTagParams,part_index)["id"],'')}</#assign>
                <#assign _toolbar>${part}</#assign>
            <#elseif tagName == "f-column">
                <#if _isFirst == "true">
                    <#assign _colModel>${_colModel + part}</#assign>
                    <#assign _isFirst>"false"</#assign>
                <#else >
                    <#assign _colModel>${_colModel +","+ part}</#assign>
                </#if>
            <#elseif tagName == "f-pagingbar" >
                <#assign _pagingbarId>${strValue(valueInList(_subTagParams , part_index)["id"], '')}</#assign>
                <#assign _pagingbar>${part}</#assign>
        </#if>

    </#list>
${_toolbar}
    <div id="${id}-grid-head" class="f-grid-head" ></div>
    <div id="${id}-grid-body" class="f-grid-body" ></div>
${_pagingbar}
<#-- 存放该组件的分页栏  <f:pagingBar></f:pagingBar>-->

</div>


<#-- 组件初始化 -->
<@script>
$(function() {
$I('${id}').FGrid({
    dataUrl :"${dataUrl}"
    <#if strValue(_colModel)?length != 0>
    , colModel :[${_colModel}]
    </#if>
    <#if strValue(width)?length != 0>
    , width :${width}
    <#else>
    , width :""
    </#if>
    <#if strValue(height)?length != 0>
    , height :${height}
    </#if>
    <#if strValue(emptyMsg)?length != 0>
    , emptyMsg :"${emptyMsg}"
    </#if>
    <#if strValue(selectModel)?length != 0>
    , selectModel :"${selectModel}"
    </#if>
    <#if strValue(autoload)?length != 0>
    , autoload :${autoload}
    </#if>
    <#if strValue(baseParams)?length != 0>
    , baseParams :${baseParams}
    </#if>
    <#if strValue(hasRowNumber)?length != 0>
    , hasRowNumber :${hasRowNumber}
    </#if>
    <#if strValue(hasTips)?length != 0>
    , hasTips :${hasTips}
    </#if>
    <#if strValue(_toolbarId)?length != 0>
    , toolbarId :"${_toolbarId}"
    </#if>
    <#if strValue(_pagingbarId)?length != 0>
    , pagingbarId :"${_pagingbarId}"
    </#if>
    <#if strValue(onBeforesend)?length != 0>
    , onBeforesend :${onBeforesend}
    </#if>
    <#if strValue(onLoadsuccess)?length != 0>
    , onLoadsuccess :${onLoadsuccess}
    </#if>
    <#if strValue(onLoadfailure)?length != 0>
    , onLoadfailure :${onLoadfailure}
    </#if>
    <#if strValue(onLoadError)?length != 0>
    , onLoadError :${onLoadError}
    </#if>
    <#if strValue(onRowClick)?length != 0>
    , onRowClick :${onRowClick}
    </#if>
    <#if strValue(onRowDbClick)?length != 0>
    , onRowDbClick :${onRowDbClick}
    </#if>
    <#if strValue(onRowSelect)?length != 0>
    , onRowSelect :${onRowSelect}
    </#if>
    <#if strValue(onRowDeselect)?length != 0>
    , onRowDeselect :${onRowDeselect}
    </#if>
    <#if strValue(crossPageSelect)?length != 0>
    , crossPageSelect :${crossPageSelect}
    </#if>
    <#if strValue(uniqueKey)?length != 0>
    , uniqueKey :${uniqueKey}
    </#if>
    <#if strValue(onContextMenu)?length != 0>
    , onContextMenu :${onContextMenu}
    </#if>




});
});

</@script>

</#macro>
