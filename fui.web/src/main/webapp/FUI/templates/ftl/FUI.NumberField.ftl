<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.NumberField.ftl
 # 作者：
 # 邮箱：
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： numberField组件的dom结构
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20121204		hanyin	新建
 # 20130110		hanyin 	将脚本区域使用由原生的<script>改为<@script>
 # 20130315		hanyin   新增 check属性
 # 20130328		hanyin   新增afterChange属性
-->
<#include "FUI.TextHField.ftl">
<#macro numberField id="" style="" class="" title="" disabled="" readonly="" name="" width="" height="" tabIndex="" iconPos="" iconCls=""
	decimals="" moneyFormat="" defaultValue="" check="" afterChange="">

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-numberField") />
<@validateAndSet name="decimals" default="2" />
<@validateAndSet name="afterChange" default="null" />

<#-- 组件DOM结构定义 -->
<@textHField id="${id}" style="${style}" class="f-numberField ${class}" title="${title}" disabled="${disabled}" readonly="${readonly}" name="${name}" 
	width="${width}" height="${height}" tabIndex="${tabIndex}"
	iconPos="${iconPos}" iconCls="${iconCls}" check="${check}"/>

<#-- 组件初始化 -->
<@script>
    $(function() {
    	$("#${id}").FNumberField({decimals:"${decimals}", moneyFormat:"${moneyFormat}", defaultValue:"${defaultValue}", onValueChanged:"${onValueChanged}", afterChange:${afterChange}});
    });
</@script>

</#macro>
