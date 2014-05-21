<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.ToolGroup.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： 面板组件FUI.ToolGroup的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120810		hanyin	 创建
-->
<#macro _toolGroup id="" style="" class="" width="" height="" toolAlign="" toolspacing="" toolpadding="">

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-toolGroup") />
<@validateAndSet name="width" default="auto" />
<@validateAndSet name="height" default="auto" />
<@validateAndSet name="toolAlign" default="center" />

<div id="${id}" class="f-toolGroup f-tools-${toolAlign} ${class}" style="${style}">
	<table cellspacing="${strValue(toolspacing, '1')}" cellpadding="${strValue(toolpadding, '0')}" style="height:${height};width:${width};" class="f-toolGroup-ct">
		<tbody>
			<tr>
<#nested>
			</tr>
		</tbody>
	</table>
</div>

</#macro>
