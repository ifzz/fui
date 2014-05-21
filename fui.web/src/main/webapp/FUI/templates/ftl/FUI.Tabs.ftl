<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Tabs.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： 选项卡组件FUI.Tabs的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120807		hanyin	 创建
 # 20121218		hanyin 	修改DOM结构支持tab的左右滚动和标签弹出按钮
 # 20121227		hanyin 	删除tabHeight属性，tab的宽度自适应
 # 20130125		hanyin 	新增事件onTabDblClick、onTabbarRClick
 # 20130207		hanyin  STORY #4998 [内部需求][FUI] Tabs组件的tab页签增加iframe和iframeName两个属性
 # 20130314		hanyin  增加fit属性
 # 20130325		hanyin  如果没有设置高度和宽度，则设置高度和宽度为550X350
-->
<#macro tabs id="" style="" class="" tabWidth="" tabsHeaderCls="" active="" width="" height="" fit="" onBeforeActive="" onActive=""
	onBeforeClose="" onClose="" onBeforeCloseAllOthers="" onCloseAllOthers="" onBeforeAdd="" onAdd="" onLoadComplete=""
	onTabDblClick="" onTabbarRClick="">

<#-- 参数校验，如果值不存在或者为""，则设置为默认值  -->
<@validateAndSet name="id" default=genId("f-tabs") />
<@validateAndSet name="active" default="0" />
<@validateAndSet name="tabWidth" default="auto" />
<@validateAndSet name="tabsHeaderCls" default="f-tabs-normal-tab" />

<#-- 临时变量 -->
<@validateAndSet name="_width" default="${sizeValue(width, '550')}" />
<@validateAndSet name="_height" default="${sizeValue(height, '350')}" />
<#local _tabWidth>${sizeValue(tabWidth, 'auto')}</#local>

<#-- 组件DOM结构定义 -->
<div id="${id}" class="f-tabs f-widget ${class}" style="width:${_width};${style}">
	<div id="${id}-header" class="f-tabs-header f-unselectable">
	  <div class="f-tabs-scroller-left-wrapper" style="display:none;">
	    <div id="${id}-scroll-left" class="f-tabs-scroll-left f-unselectable"></div>
		<div class="f-tabs-bar-strip">&nbsp;</div>
	  </div>
	  <div id="${id}-header-ctl" class="f-tabs-header-ctl">
		<div class="f-tabs-header-list">
			<#list _subTagParams as tab>
			<#local _realClosable>${strValue(tab['closable'], "false")}</#local>
			<div class="f-tabs-head-item ${(_realClosable=="true")?string("f-tab-closable","")}" id="${genId("f-tabs-item")}">
				<#-- 如果设置了id，则采用指定的id，否则自动生成唯一id -->
				<#local _realId>${strValue(tab['id'], id+'-gen-'+tab_index)}</#local>
				<#local _realTitle>${strValue(tab['title'], _realId)}</#local>
				<#local _realWidth>${sizeValue(tab['width'], _tabWidth)}</#local>
				<a class="f-tabs-right ${(_realWidth=="auto")?string("f-tabs-right-ie6","")}" href="#${_realId}" onclick="return false;" title="${_realTitle}">
					<#if (_realClosable == "true")>
					<span class="f-tab-close-bnt">&nbsp;</span>
					</#if>
					<em class="f-tabs-left">
						<span class="f-tabs-strip-inner ${tabsHeaderCls}">
							<span class="f-tabs-strip-text"
								style="width:${_tabWidth};line-height:normal">${_realTitle}</span>
						</span>
					</em>
				</a>
			</div>
			</#list>
			<div id="${id}-items-edge" class="f-tabs-edge"></div><#-- 此div用于计算有效宽度 -->
			<div class="f-tabs-bar-strip" style="clear:left;width:auto;"></div>
		</div>
	  </div>
	  <#---->
	  <div class="f-tabs-scroller-right-wrapper" style="display:none;">
	  	<div id="${id}-tabmenu-right" class="f-tabs-tabmenu-right f-unselectable"></div>
		<div class="f-tabs-bar-strip">&nbsp;</div>
	  </div>
	  <div class="f-tabs-scroller-right-wrapper" style="display:none;">
	    <div id="${id}-scroll-right"  class="f-tabs-scroll-right f-unselectable"></div>
		<div class="f-tabs-bar-strip">&nbsp;</div>
	  </div>
	</div>
	<div id="${id}-body-wrapper" class="f-tabs-body-wrapper">
	<div id="${id}-body" class="f-tabs-body">
		<#list _parsedElements as tabContent>
		<#local _realId>${strValue(valueInList(_subTagParams, tabContent_index)['id'], id+'-gen-'+tabContent_index)}</#local>
		<#local _realUrl>${strValue(valueInList(_subTagParams, tabContent_index)['url'])}</#local>
		<#local _realIFrame>${strValue(valueInList(_subTagParams, tabContent_index)['iframe'])}</#local>
		<#local _realIFramName>${strValue(valueInList(_subTagParams, tabContent_index)['iframeName'])}</#local>
		<div id="${_realId}" class="f-panel" url="${_realUrl}" iframe="${_realIFrame}" iframeName="${_realIFramName}">
			<div class="f-panel-wrapper">
				<div id="${_realId}-panel-body" class="f-panel-body" style="position:relative;">
				${tabContent}
				</div>
			</div>
		</div>
		</#list>
	</div>
	</div>
</div>

<#-- 组件初始化 -->
<@script>
$(function(){
	$("#${id}").FTabs({active:"${active}",width:"${_width}",height:"${_height}",tabWidth:"${_tabWidth}",tabsHeaderCls:"${tabsHeaderCls}",fit:"${fit}",
		 onBeforeActive:"${onBeforeActive}", onActive:"${onActive}",
		 onBeforeClose:"${onBeforeClose}", onClose:"${onClose}",
		 onBeforeCloseAllOthers:"${onBeforeCloseAllOthers}",onCloseAllOthers:"${onCloseAllOthers}",
		 onBeforeAdd:"${onBeforeAdd}",onAdd:"${onAdd}",onLoadComplete:"${onLoadComplete}",
		 onTabDblClick:"${onTabDblClick}", onTabbarRClick:"${onTabbarRClick}"
	 });
});
</@script>

</#macro>
