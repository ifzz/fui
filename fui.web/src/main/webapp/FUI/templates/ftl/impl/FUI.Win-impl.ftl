<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Win-impl.ftl
 # 作者：qudc
 # 邮箱：qudc@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： 窗口组件FUI.Win宏实现，主要用JSP等模板引擎API使用模板标签
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120822		qudc	 创建
 # 20121206     qudc     新增maximized属性
 # 20130304     qudc     完成需求：4864，新增属性 hasCloseBtn
-->


<#-- 引入模板定义文件 -->
<#include "*/FUI.Win.ftl">

<#-- 模板使用，主要用于JSP等模板引擎使用 -->
<@win id="${id}" pageUrl="${pageUrl}" isIframe="${isIframe}" width="${width}" height="${height}" buttons="${buttons}" title="${title}" modal="${modal}" buttonAlign="${buttonAlign}" dragable="${dragable}" maxable="${maxable}" onSetHtml="${onSetHtml}"  onResize="${onResize}" onClose="${onClose}" maximized="${maximized}" onShow="${onShow}" hasCloseBtn="${hasCloseBtn}">
${_nestedContent}
</@win>
