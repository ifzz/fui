<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Label.ftl 
 # 作者：hanyin
 # 邮箱：hanyin@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： 面板组件FUI.Label的DOM结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20130106		qudc	 创建
 # 20130315		hanyin	增加check属性
-->
<#macro upload id=""  classes="" size=""   width="" name="" tabIndex="" check="" >

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-upload") />
<@validateAndSet name="width" default="150" />
<@validateAndSet name="size" default="20" />


<#-- 组件DOM结构定义 -->
<input type="file" name="${name}" id="${id}" check="${check}" autocomplete="off" size="${size}" class=" f-form-field ${classes}" tabIndex="${tabIndex}"  style="padding:2px;width: ${width}px;  height: 22px;">

<#-- 组件初始化 -->
</#macro>
