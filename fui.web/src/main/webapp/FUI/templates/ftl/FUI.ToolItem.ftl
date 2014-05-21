<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.ToolItem.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： FUI.ToolItem的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120810		hanyin	 创建
-->
<#macro toolItem id="" width="">

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-toolItem") />

<#-- 临时变量 -->
<#assign _width>${strValue(width, "")}</#assign>
<#assign _hasWidth>${_width?length!=0}</#assign>

<td class="f-tool-cell" <#if _hasWidth>style="width: ${_width}"<#t></#if>>
	<#nested>
</td>
</#macro>
