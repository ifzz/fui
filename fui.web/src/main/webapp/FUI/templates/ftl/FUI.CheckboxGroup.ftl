<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Panel.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： 面板组件FUI.Panel的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120807		hanyin	 创建
-->
<#macro checkboxGroup id="" style="" class="" name="" seperator="" defaultValue="">

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-checkboxGroup") />
<@validateAndSet name="seperator" default="," />

<#-- 临时变量 -->

<#-- 组件DOM结构定义 -->
<div id="${id}-box" class="f-checkboxGroup-box f-border f-widget ${class}" style="${style}" >
	<input type="hidden" name="${name}" id="${id}" class="f-checkboxGroup">
	<div id="${id}-wrapper">
		<#nested>
	</div>
</div>

<#-- 组件初始化 -->
<@script>
$(function(){
	$("#${id}").FCheckboxGroup({seperator:"${seperator}",defaultValue:"${defaultValue}"});
});
</@script>

</#macro>
