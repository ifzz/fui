<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.MenuItem.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： FUI.MenuItem的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120807		hanyin	 创建
 # 20130108		hanyin	为menuItem增加title属性，如果设置了则在鼠标移上去之后出现tip提示
-->
<#macro menuItem id="" text="" iconCls="" subMenu="" disable="" onClick="" url="" checked="" title="">

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-menuItem") />
<@validateAndSet name="disable" default=strValue(disable, false) />

<#-- 临时变量 -->
<#local _hasTitle=((title?length)!=0) />
<#assign _icon>${strValue(iconCls, "")}</#assign>
<@validateAndSet name="_hasIcon" default=(_icon?length!=0) />
<#assign _subRef>${strValue(subMenu, "")}</#assign>
<@validateAndSet name="_hasSubMenu" default=(_subRef?length!=0) />
<@validateAndSet name="_hasText" default=(text?length!=0) />
<#assign _text><#if _hasText>${text}<#else><#nested></#if></#assign>
<#-- 首先判断是否有复选框，然后判断是选中的还是没有选中的状态 -->
<@validateAndSet name="_hasChecked" default=(checked?length!=0) />
<#if _hasChecked>
	<#if boolValue(checked)>
		<#assign checkedClass>f-state-checked</#assign>
	<#else>
		<#assign checkedClass>f-state-unchecked</#assign>
	</#if>
<#else>
	<#assign checkedClass></#assign>
</#if>

<#-- 组件DOM结构定义 -->
<#if _text == '-'>
<li class="f-menu-item f-menu-item-seperator">&nbsp;</li>
<#else>
<li class="f-menu-item">
<a id="${id}" href="#${_hasSubMenu?string(_subRef,'')}" clickEvent="${onClick}" url="${url}"
		class="f-corner-all ${boolValue(disable, false)?string('f-state-disabled', '')} ${checkedClass}" 
		<#if _hasTitle>
		title="${title?replace("\"","'")}"
		</#if> >
	<#if (_hasIcon||_hasChecked)><span class="f-icon ${_icon}"></span></#if>
	<#if _hasSubMenu><span class="f-menu-icon f-icon f-icon-item-arrow"></span></#if>
	<#-- 如果设置了text属性则采用text属性，否则采用嵌套内容 -->
	${_text}
</a>
</li>
</#if>

</#macro>
