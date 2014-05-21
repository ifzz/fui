<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.PopupMessage.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： FUI.PopupMessage的DOM结构定义，主要用于右下角消息弹出框
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120807		hanyin	 创建
 # 20130125		hanyin  popuoMessage不上漏掉的 style="${style}"
-->
<#macro popupMessage id="" style="" class="" title="" timeout="" closable="">

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-popupMessage") />

<#-- 临时变量 -->
<@validateAndSet name="_closable" default=boolValue(closable, true) />
<@validateAndSet name="_hasTitle" default=strValue(title, "")?length!=0 />

<#-- 组件DOM结构定义 -->
<div id="${id}" class="f-popupMessage f-widget f-corner-all" style="${style}">
  <div id="${id}-header" ${_hasTitle?string("","style='display:none;'")} class="f-popupMessage-header">
    ${title}
    <span id="${id}-icon" ${_closable?string("","style='display:none;'")} class="f-popupMessage-icon f-tool f-tool-close">&nbsp;</span>
  </div>
  <div id="${id}-body" class="f-popupMessage-body" >
<#nested>
  </div>
</div>

<#-- 组件初始化 -->
<@script>
$(function(){
	$("#${id}").FPopupMessage({timeout:"${timeout}", closable:${(_closable)?string("true", "false")}});
});
</@script>

</#macro>
