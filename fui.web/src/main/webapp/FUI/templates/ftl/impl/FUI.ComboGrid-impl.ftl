<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.ComboGrid-impl.ftl
 # 作者：qudc
 # 邮箱：qudc@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： ComboGrid组件FUI.ComboGrid宏实现，主要用JSP等模板引擎API使用模板标签
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 2012-12-21		qudc	 创建
 # 2013-01-23       qudc           修改readOnly属性成readonly属性
 # 2013-01-23       qudc           修改enabled属性成disabled属性
 # 20130315		hanyin	 增加check属性
-->


<#-- 引入模板定义文件 -->
<#include "*/FUI.ComboGrid.ftl">

<#-- 模板使用，主要用于JSP等模板引擎使用 -->
<@comboGrid id="${id}" check="${check}" width="${width}" name="${name}"  valueField="${valueField}" forceSelection="${forceSelection}" displayField="${displayField}" tabIndex ="${tabIndex}" baseParams ="${baseParams}" dataUrl="${dataUrl}"   disabled="${disabled}" readonly="${readonly}" listHeight="${listHeight}" listWidth="${listWidth}" pageSize="${pageSize}"   selectable="${selectable}" onLoadsuccess="${onLoadsuccess}" onError="${onError}" onLoadfailure ="${onLoadfailure}"   onSelect="${onSelect}" colModel="${colModel}" forceLoad="${forceLoad}" onBeforesend="${onBeforesend}" filterField="${filterField}" multiSelect="${multiSelect}" dataHandler="${dataHandler}">
</@comboGrid>
