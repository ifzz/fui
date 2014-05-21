<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.SimpleButton.ftl
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： 面板组件FUI.SimpleButton的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120810		hanyin	 创建
-->
<#macro simpleButton id="" text="" type="" style="" class="" width="" height="" tabIndex="" disabled="false"
	leftIconCls="" rightIconCls="" onClick="">

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-button") />
<@validateAndSet name="type" default="button" />
<@validateAndSet name="width" default="75px" />
<@validateAndSet name="height" default="22px" />
<@validateAndSet name="tabIndex" default="0" />

<#-- 临时变量 -->
<#assign _width>${intValue(width)}px</#assign>
<#assign _height>${intValue(height)}px</#assign>
<#assign _lineHeight>${intValue(height)/2 -1}px</#assign>
<#assign _disabled>${intValue(width)}px</#assign>

<#assign _style>width:${_width};line-height:${_height};height:${_height};margin-top:-${intValue(_lineHeight)+2}px</#assign>
<#assign _class><#if disabled=="true">f-state-disabled</#if> ${class}</#assign>

<div class="f-button f-widget f-form-unselectable ${_class}" id="${id}-wrapper" onselectstart="return false;" style="${style}">
<div class="f-button-box"  style="width:${_width};height:${_height}">
   <div class="f-button-t" style="line-height:${_lineHeight}">&nbsp;</div>
   <button id="${id}" hidefocus="true" class="f-button-text" style="text-align:center;${_style}"<#t>
   	<#if disabled=="true">disabled="disabled"</#if> type="${type}" tabIndex="${tabIndex}">
   	${text}
   </button>
</div>
</div>

<#-- 组件初始化 -->
<@script>
$(function(){
	$("#${id}").FSimpleButton({onClick:${(strValue(onClick)?length==0)?string('null', onClick)} });
});
</@script>

</#macro>
