<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Radio-impl.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： 组件FUI.Radio宏实现，主要用JSP等模板引擎API使用模板标签
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120807		hanyin	 创建
-->

<#-- 引入模板定义文件 -->
<#include "*/FUI.Radio.ftl">

<#-- 模板使用，主要用于JSP等模板引擎使用 -->
<@radio id="${id}"  style="${style}" class="${class}" name="${name}" 
	tabIndex="${tabIndex}" value="${value}" label="${label}" >
</@radio>
