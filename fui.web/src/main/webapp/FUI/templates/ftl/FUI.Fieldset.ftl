<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Fieldset.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： 面板组件FUI.Fieldset的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120807		hanyin	 创建
-->
<#macro fieldset id="" style="" class="" title="" width="auto" height="auto" collapsed="false" collapsible="true" autoscroll="true"
 onCollapse="" onExpand="" >

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-fieldset") />
<@validateAndSet name="width" default="auto" />
<@validateAndSet name="height" default="auto" />
<@validateAndSet name="collapsed" default="false" />
<@validateAndSet name="collapsible" default="true" />
<@validateAndSet name="autoscroll" default="true" />

<#-- 临时变量 -->
<@validateAndSet name="_collapsed" default=boolValue(collapsed)&&boolValue(collapsible) />

<#-- 组件DOM结构定义 -->
<fieldset id="${id}" class="f-fieldset ${(_collapsed)?string('f-collapsed', 'f-collapsible')} ${class}" style="${style}">
  <legend id="${id}-legend" class="f-fieldset-header">
  	<#if boolValue(collapsible)>
    <div id="${id}-toggle" class="f-tool f-tool-toggle">&nbsp;</div>
  	</#if>
    <span id="${id}-title" class="f-fieldset-header-text">${title}</span>
  </legend>
  <div id="${id}-bwrap" class="f-fieldset-bwrap" style="position:relative;${(_collapsed)?string('display: none;', 'display: block;')}
   ${boolValue(autoscroll)?string('overflow:auto;','overflow:hidden;')}">
    <#nested>
  </div>
</fieldset>

<#-- 组件初始化 -->
<@script>
$(function(){
	$("#${id}").FFieldset({width: "${width}", height: "${height}", autoscroll: ${autoscroll},
	onCollapse:${(strValue(onCollapse)?length==0)?string('null', onCollapse)}, 
	onExpand:${(strValue(onExpand)?length==0)?string('null', onExpand)} });
});
</@script>

</#macro>
