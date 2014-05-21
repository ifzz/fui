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
 # 20120807		hanyin	 创建
-->
<#macro label id="" style="" class="" text="" for="" height="" width="" textAlign="right" >

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-label") />
<@validateAndSet name="width" default="auto" />
<@validateAndSet name="textAlign" default="left" />

<#-- 组件DOM结构定义 -->
<label id="${id}" for="${for}" class="f-label f-label-text-${textAlign} ${class}" style="<#t>
<#if (strValue(height)?length!=0 && height!='auto')>height:${height};line-height:${height};</#if><#t>
width:${width};${style}">${text}</label>

<#-- 组件初始化 -->
</#macro>
