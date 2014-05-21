<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Menu.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： FUI.Menu的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120807		hanyin	 创建
 # 20130407		hanyin		修复IE6下jquery的弹出菜单报错的问题
-->
<#macro menu id="" style="" class="" attach="" staticData="" 
	onClick="" beforeShow="" onShow="" onHide="" beforeHide="">

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-menu") />
<@validateAndSet name="minWidth" default="100px" />
<@validateAndSet name="maxWidth" default="200px" />

<#-- 临时变量 -->

<#-- 组件DOM结构定义 -->
<ul id="${id}" style="display:none;${style}" class="f-menu f-menu-icons f-widget ${class}">
	<li id="${id}-icon-seperator" class="f-menu-icon-seperator"></li>
	<#nested>
</ul>

<#-- 组件初始化 -->
<@script>
$(function(){
	if ($("body>#f-menu-area").length == 0) {
		$("body").append("<div id='f-menu-area'></div>");
	}
	$(".f-menu").each(function() {
		var el = $(this);
		if (el.parent().is("#f-menu-area")) {
			return;
		}
		$("#f-menu-area").append(el.detach());
	});
	html= undefined;
	
	$("#${id}").FMenu({attach:"${attach}",staticData:"${staticData}",
	onClick:"${onClick}", beforeShow:"${beforeShow}", onShow:"${onShow}", beforeHide:"${beforeHide}", onHide:"${onHide}" });
});
</@script>

</#macro>
