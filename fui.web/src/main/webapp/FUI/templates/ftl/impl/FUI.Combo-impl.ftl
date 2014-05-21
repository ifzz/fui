<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Combo-impl.ftl
 # 作者：qudc
 # 邮箱：qudc@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： Combo组件FUI.Combo宏实现，主要用JSP等模板引擎API使用模板标签
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120815		qudc	 创建
 # 2013-01-18   qudc    新增displaySeparate属性
 # 2013-01-23    qudc    为了保持统一标准，将enabled属性修改成disabled属性。
 # 2013-01-23    qudc    修改readOnly属性成readonly
 # 20130315		hanyin	 增加check属性
 # 2013-03-28	hanyin          增加filterTarget属性
 # 2013-04-24	hanyin          增加onBlur事件
 # 2013-08-05       hanyin          新增filterCallback回调方法
-->


<#-- 引入模板定义文件 -->
<#include "*/FUI.Combo.ftl">

<#-- 模板使用，主要用于JSP等模板引擎使用 -->
<@combo id="${id}" fieldLabel="${fieldLabel}" check="${check}" width="${width}" name="${name}" valueField="${valueField}" displayField="${displayField}" tabIndex ="${tabIndex}" baseParams ="${baseParams}" dataUrl="${dataUrl}" defaultValue="${defaultValue}"  displayFormat="${displayFormat}" staticData="${staticData}" width="${width}"  disabled="${disabled}" readonly="${readonly}" autoload="${autoload}" multiSelect="${multiSelect}" selectable="${selectable}" forceSelection="${forceSelection}" onLoadsuccess = "${onLoadsuccess}" onLoadfailure="${onLoadfailure}" onError="${onError}" selectFirst="${selectFirst}"  multiSeparator="${multiSeparator}" onSelect="${onSelect}" onFilter="${onFilter}" displaySeparate="${displaySeparate}" onBeforesend="${onBeforesend}" filterTarget="${filterTarget}" onBlur="${onBlur}" filterCallback="${filterCallback}" >
</@combo>
