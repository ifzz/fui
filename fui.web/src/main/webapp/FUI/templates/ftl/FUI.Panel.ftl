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
 # 20121226		hanyin	 在外层div中初始化width，避免屏幕闪烁
-->
<#macro panel id="" style="" class="" title="" width="auto" height="auto" iconCls="" collapsible="true" collapsed="false" autoscroll="true" isIFrame="false" pageUrl=""
 onCollapse="" onExpand="" onLoadSuccess="" onError="">

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-panel") />
<@validateAndSet name="collapsed" default="false" />
<@validateAndSet name="collapsible" default="true" />

<#-- 临时变量 -->
<@validateAndSet name="_collapsed" default=boolValue(collapsed)&&boolValue(collapsible) />

<#-- 组件DOM结构定义 -->
<div id="${id}" class="f-panel ${(_collapsed)?string('f-collapsed', 'f-collapsible')} ${class}" style="width:${width};${style}" >
	<div id="${id}-header" class="f-panel-header">
		<#if boolValue(collapsible)>
		<div id="${id}-toggle" class="f-tool f-tool-toggle">&nbsp;</div>
		</#if>
		<span id="${id}-icon" class="f-panel-header-icon ${iconCls}"></span>
		<span id="${id}-title" class="f-panel-header-title">${title}</span>
	</div>
	<div id="${id}-wrapper" class="f-panel-wrapper" ${boolValue(collapsed)?string('style="display: none; "', '')}>
		<div id="${id}-body" class="f-panel-body" style="overflow: ${boolValue(autoscroll, true)?string("auto", "hidden")}">
		<#if boolValue(isIFrame, 'false')>
		<iframe id="${id}-iframe" frameborder="0" marginheight="0" marginwidth="0" src="${pageUrl}" width="100%" height="100%">
			<p>Your browser does not support iframes.</p>
		</iframe>
		<#else>
			<#nested>
		</#if>
		</div>
	</div>
</div>

<#-- 组件初始化 -->
<@script>
$(function(){
	$("#${id}").FPanel({iconCls: "${iconCls}",width:"${width}",height:"${height}",isIFrame:${boolValue(isIFrame, false)?string("true", "false")},pageUrl:"${pageUrl}",
	 onLoadSuccess:${(strValue(onLoadSuccess)?length==0)?string('null', onLoadSuccess)},onError:${(strValue(onError)?length==0)?string('null', onError)},
	 onCollapse:${(strValue(onCollapse)?length==0)?string('null', onCollapse)},onExpand:${(strValue(onExpand)?length==0)?string('null', onExpand)}});
});
</@script>

</#macro>
