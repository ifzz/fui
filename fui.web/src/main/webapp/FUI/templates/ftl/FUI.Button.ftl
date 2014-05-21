<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Button.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： 面板组件FUI.Button的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120810		hanyin	 创建
 # 20130129		hanyin	给button增加f-widget样式，统一字体
 # 20130129		hanyin 	给em元素增加“display:block;overflow:hidden;width:${intValue(_width)-6}px”，解决在IE下比Google下变大的问题
-->
<#macro button id="" text="" type="" style="" class="" iconCls="" disabled="false" onClick="">

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-btn") />

<a id="${id}" href="javascript:void(0)" class="f-new-btn f-new-btn-plain <#if disabled=="true">f-state-disabled</#if>" <#if style?length!=0>style="${style}"</#if>>
	<span class="f-new-btn-left">
		<span <#if (iconCls?length!=0)> style="PADDING-LEFT:20px" </#if> class="f-new-btn-text ${iconCls}">${text}</span>
	</span>
</a>

<#-- 组件初始化 -->
<@script>
$(function(){
	$("#${id}").FButton({onClick:${(strValue(onClick)?length==0)?string('null', onClick)}});
});
</@script>

</#macro>
