<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Tree-impl.ftl
 # 作者：qudc
 # 邮箱：qudc@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： Tree组件FUI.Tree宏实现，主要用JSP等模板引擎API使用模板标签
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120815		qudc	 创建
-->


<#-- 引入模板定义文件 -->
<#include "*/FUI.Tree.ftl">

<#-- 模板使用，主要用于JSP等模板引擎使用 -->
<@tree id="${id}" width="${width}" height="${height}"  syncLoad="${syncLoad}" baseParams="${baseParams}" dataUrl="${dataUrl}" selectModel="${selectModel}" rootVisible="${rootVisible}" rootNode="${rootNode}"  onNodeDblClick="${onNodeDblClick}"  staticData="${staticData}" onNodeClick="${onNodeClick}" onNodeSelect="${onNodeSelect}" onNodeUnSelect="${onNodeUnSelect}" onLoadsuccess="${onLoadsuccess}" onLoadfailure="${onLoadfailure}" onLoadError="${onLoadError}" title="${title}">
</@tree>
