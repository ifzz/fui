<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Column.ftl
 # 作者：qudc
 # 邮箱：qudc@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述：column组件的dom结构
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 2012-10-24		qudc	 创建
-->
<#macro column   title="" dataIndex="" width="" textAlign="" headerAlign="" renderer="" wordWrap="" sortable="" defaultSortDir="">
{ <#t>
    <#if strValue(title)?length != 0>
        title:"${title}"<#t>
    </#if>
    <#if strValue(dataIndex)?length != 0>
        ,dataIndex:"${dataIndex}"<#t>
    </#if>
    <#if strValue(width)?length != 0>
        ,width:${width}<#t>
    </#if>
    <#if strValue(textAlign)?length != 0>
        ,textAlign:"${textAlign}"
    </#if>
    <#if strValue(headerAlign)?length != 0>
        ,headerAlign:"${headerAlign}"<#t>
    </#if>
    <#if strValue(renderer)?length != 0>
        ,renderer:${renderer}<#t>
    </#if>
    <#if strValue(wordWrap)?length != 0>
        ,wordWrap:${wordWrap}<#t>
    </#if>
    <#if strValue(sortable)?length != 0>
        ,sortable:${sortable}<#t>
    </#if>
    <#if strValue(defaultSortDir)?length != 0>
        ,defaultSortDir:"${defaultSortDir}"<#t>
    </#if>

}
</#macro>
