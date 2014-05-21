<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Toolbar.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： 面板组件FUI.Toolbar的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120810		hanyin	 创建
 # 20130322		hanyin		简化dom，不再采用table布局
-->


<#macro toolbar id="" style="" class="">

<@validateAndSet name="id" default=genId("f-toolbar") />

<div id="${id}" class="f-new-toolbar ${class}" style="${style}">
<#nested>
</div>

</#macro>
