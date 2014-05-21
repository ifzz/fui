<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Calendar.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： FUI.Calendar的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120810		hanyin	 创建
 # 20130315		hanyin   新增 check属性
-->


<#-- 引入模板定义文件 -->
<#include "FUI.TextHField.ftl">

<#macro calendar id="" style="" class="" title="" disabled="" readonly="" name="" width="" height="" tabIndex=""
	iconPos="" showOpts="" check="">

<@validateAndSet name="id" default=genId("f-calendar") />
<@validateAndSet name="_isInnerIcon" default=(iconPos?index_of("inner-")==0) />

<#-- 组件DOM结构定义 -->
<#if _isInnerIcon> <#-- 图标在内部 -->
<@textHField id="${id}" style="${style}" class="f-calendar ${class}" title="${title}" disabled="${disabled}" readonly="${readonly}" name="${name}" 
	width="${width}" height="${height}" tabIndex="${tabIndex}"
	iconPos="${iconPos}" iconCls="f-form-date-icon" check="${check}"/>
<#else> <#-- 图标在外部 -->
<@textHField id="${id}" style="${style}" class="f-calendar ${class}" title="${title}" disabled="${disabled}" readonly="${readonly}" name="${name}" 
	width="${width}" height="${height}" tabIndex="${tabIndex}"
	iconPos="${iconPos}" iconCls="f-form-trigger f-form-date-trigger" check="${check}"/>
</#if>

<#-- 组件初始化 -->
<@script>
$(function() {
	$("#${id}").FCalendar({showOpts:${(showOpts?length==0)?string("null",showOpts)}});
});
</@script>

</#macro>
