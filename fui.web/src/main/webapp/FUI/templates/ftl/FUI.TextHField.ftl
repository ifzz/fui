<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.textHField.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： Form表单含有隐藏域的输入框组件FUI.textHField的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120807		hanyin	 创建
 # 20130315		hanyin	 增加check属性
-->

<#macro textHField id="" style="" class="" title="" disabled="" readonly="" name="" width="" height="" accept="" tabIndex=""
	iconPos="" iconCls="" type="" check=""
>

<#-- 参数校验，如果值不存在或者为""，则设置为默认值  -->
<@validateAndSet name="id" default=genId("f-textHField") />
<@validateAndSet name="tabIndex" default="0" />
<@validateAndSet name="type" default="text" />

<#-- 临时变量 -->
<@validateAndSet name="_hasIcon" default=(iconCls?length!=0) />
<@validateAndSet name="_isInnerIcon" default=(iconPos?index_of("inner-")==0) />
<@validateAndSet name="_iconPos" default=((iconPos?length==0)?string("right",iconPos)) />
<@validateAndSet name="_boxwidth" default=intValue(width, 150) />
<#if _hasIcon>
	<#if _isInnerIcon>
	<@validateAndSet name="_width" default=_boxwidth-23 /> <#-- 1+1+16+1+3+1 -->
	<#else>
	<@validateAndSet name="_width" default=_boxwidth-25 /> <#-- 1+3+3+1+17 -->
	</#if>
<#else>
	<@validateAndSet name="_width" default=_boxwidth-8 /> <#-- 1+3+3+1 -->
</#if>
<@validateAndSet name="_height" default=intValue(height, 22)-4 /> <#-- 1+1+1+1 -->
<#assign _class>${boolValue(disabled,false)?string("f-state-disabled ","")}${boolValue(readonly,false)?string("f-state-readonly","")}</#assign>

<#-- 组件DOM结构定义，这里枚举了input的所有（除了align、alt、checked、maxlength、size和src等）属性 -->
<div id="${id}-box" class="f-textField-box f-widget ${_hasIcon?string("f-textField-icon-"+_iconPos,"")} ${_class}"
	style="width:${_boxwidth}px;${style}">

<#if _hasIcon&&!_isInnerIcon>
	<#assign _iconCls>f-trigger f-textField-trigger ${iconCls}</#assign>
	<span id="${id}-trigger" class="${_iconCls}">&nbsp;</span>
</#if>

	<div id="${id}-wrapper" class="f-textField-wrapper">
		<input id="${id}" type="hidden" class="f-textHField-hidden" ${boolValue(disabled,false)?string("disabled","")} <#t>
		name="${name}" errorValidateTarget="next" errorMsgTarget="parent" check="${check}">

		<input id="${id}-input" type="${type}" class="f-textField ${class}" tabIndex="${tabIndex}" <#t>
		${(strValue(title)?length!=0)?string("title='"+title+"' ","")}<#t>
		${(strValue(accept)?length!=0)?string("accept='"+accept+"' ","")}<#t>
		${boolValue(disabled,false)?string("disabled ","")}<#t>
		${boolValue(readonly,false)?string("readonly ","")}<#t>
		hasprevioussbling="true" <#t>
		style="width:${_width}px;height:${_height}px;padding:0px;">
		<div class="f-form-clear"></div>
	
	<#if _hasIcon&&_isInnerIcon>
		<#assign _iconCls>f-icon ${iconCls}</#assign>
		<label id="${id}-icon" class="${_iconCls}" for="${id}-input">&nbsp;</label>
	</#if>
	</div>
</div>

<#-- 组件初始化 -->
<@script>
$(function() {
	$("#${id}").FTextField({hasHiddenField: true});
});
</@script>

</#macro>
