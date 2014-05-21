<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Panel.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： 面板组件FUI.Form的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120807		hanyin	 创建
-->
<#macro form id="" style="" class="" action="" enterSwitch="" params="" 
	beforeSubmit="" onSuccess="" onFailure="" onError="" isUpload="" uploadType="" onFileUploadEvent="">

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-form") />

<#-- 临时变量 -->
<@validateAndSet name="_collapsed" default=boolValue(collapsed)&&boolValue(collapsible) />

<#-- 组件DOM结构定义 -->
<form id="${id}" class="f-form f-widget ${class}"   style="${style}" action="${action}">
<#nested>
</form>
<#-- 组件初始化 -->
<@script>
$(function(){
	$("#${id}").FForm({action:"${action}",enterSwitch:"${enterSwitch}"${(params?length!=0)?string(', params:'+params,"")},
	  beforeSubmit:"${beforeSubmit}", onSuccess:"${onSuccess}", onFailure:"${onFailure}", onError:"${onError}"
    <#if strValue(isUpload)?length != 0>
        ,isUpload:${isUpload}
    </#if>
    <#if strValue(onFileUploadEvent)?length != 0>
        ,onFileUploadEvent:${onFileUploadEvent}
     </#if>
    <#if strValue(uploadType)?length != 0>
        ,uploadType:"${uploadType}"
     </#if>

    });
});
</@script>

</#macro>
