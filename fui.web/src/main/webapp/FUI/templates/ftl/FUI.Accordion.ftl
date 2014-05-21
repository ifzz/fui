<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Accordion.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： FUI.Accordion的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20121225		hanyin	 创建
 # 20130115		hanyin 	accordion增加组件初始化的width属性
-->
<#macro accordion id="" style="" class="" width="" height="" active="0" onActive="" onBeforeActive="" onBeforeCollapse="" onCollapse="">

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-accordion") />
<@validateAndSet name="width" default="auto" />
<@validateAndSet name="height" default="auto" />
<@validateAndSet name="active" default="0" />

<#-- 临时变量 -->
<#local _width>${sizeValue(width)}</#local>

<#-- 组件DOM结构定义 -->
<div id="${id}" class="f-accordion f-widget ${class}" style="width:${_width};height:${height};${style}">
<#nested>
</div>

<#-- 组件初始化 -->
<@script>
$(function() {
	$("#${id}").FAccordion({height:"${height}", active:"${active}", width:"${_width}",
		onActive:"${onActive}", onBeforeActive:"${onBeforeActive}", onBeforeCollapse:"${onBeforeCollapse}", onCollapse:"${onCollapse}"});
});
</@script>

</#macro>
