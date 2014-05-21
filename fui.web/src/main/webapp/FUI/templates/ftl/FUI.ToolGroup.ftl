<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.ToolGroup.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： FUI.ToolGroup的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120810		hanyin	 创建
-->
<#macro toolGroup id="" style="" class="" width="" height="" toolAlign="" toolspacing="" toolpadding="">
<@_toolGroup id="${id}"  style="${style}" class="${class}"  width="${width}" height="${height}" 
	toolAlign="${toolAlign}" toolspacing="${toolspacing}" toolpadding="${toolpadding}" >
<#nested>
</@_toolGroup>
</#macro>
