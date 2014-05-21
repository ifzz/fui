<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.TargetSelect.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： FUI.TargetSelect的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120810		hanyin	 创建
 # 20130315		hanyin	 增加check属性
-->

<#-- 引入模板定义文件 -->
<#include "FUI.TextField.ftl">

<#macro targetSelect id="" style="" class="" title="" disabled="" readonly="" name="" check=""
 width="" height="" tabIndex="" accept="" iconPos="" iconCls="" onTriggerClick="">

<@validateAndSet name="id" default=genId("f-targetSelect") />
<@validateAndSet name="readonly" default="true" />
<@validateAndSet name="iconPos" default="right" />
<@validateAndSet name="iconCls" default="f-form-trigger f-form-search-trigger" />

<#-- 组件DOM结构定义 -->
<@textField id="${id}" style="${style}" class="f-targetSelect ${class}" title="${title}" disabled="${disabled}" readonly="${readonly}" name="${name}" 
	width="${width}" height="${height}" tabIndex="${tabIndex}" accept="${accept}"
	iconPos="${iconPos}" iconCls="${iconCls}" check="${check}"/>

<#-- 组件初始化 -->
<@script>
$(function() {
	$("#${id}").FTargetSelect({onTriggerClick:"${onTriggerClick}"});
});
</@script>

</#macro>
