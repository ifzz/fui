<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Checkbox.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： FUI.Checkbox的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120807		hanyin	 创建
-->
<#include "FUI.ToolItem.ftl">
<#include "FUI._ToolGroup.ftl">

<#macro checkbox id="" style="" class="" name="" tabIndex="" value="" label="">

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-checkbox") />
<@validateAndSet name="width" default="auto" />
<@validateAndSet name="tabIndex" default="0" />

<#-- 临时变量 -->
<@validateAndSet name="_hasName" default=name?length!=0 />

<#-- 组件DOM结构定义 -->
<@_toolGroup class="f-checkbox ${class}" style="text-align: left;${style}">
	<@toolItem width="16px">
		<input id="${id}" style="cursor:pointer;" type="checkbox" tabindex="${tabIndex}" <#t>
			value="${value}" ${_hasName?string("name='"+name+"'", "")}>
	</@toolItem>
	<@toolItem width="100%">
		<label style="cursor:pointer;padding-left:2px" class="f-form-unselectable" for="${id}">${label}</label>
	</@toolItem>
</@_toolGroup>
</#macro>
