<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.AccordionItem.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： FUI.AccordionItem的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20121225		hanyin	 创建
 # 20130124		hanyin  accordion给title后面添加一个空格占位，防止设置title为空时造成抽屉变形
-->
<#macro accordionItem id="" title="" iconCls="">

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-accordionItem") />

<#local _class>${(iconCls?length==0)?string("", " f-accordion-icons")}</#local>

<#-- 组件DOM结构定义 -->
<div id="${id}" class="f-accordion-header f-unselectable${_class}" onselectstart="return false;">
	<#if _class?length!=0>
	<span class="f-accordion-icon f-icon ${iconCls}">&nbsp;</span>
	</#if>
	<div class="f-accordion-tool f-tool f-tool-expand">&nbsp;</div>
	<span class="f-accordion-header-text">${title}&nbsp;</span>
</div>
<div id="${id}-content" class="f-accordion-content f-state-hide">
<#nested>
</div>

</#macro>
