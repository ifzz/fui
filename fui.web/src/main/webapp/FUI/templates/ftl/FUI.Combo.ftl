<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Combo.ftl
 # 作者：qudc
 # 邮箱：qudc@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： combo组件的dom结构
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120815		    qudc	        创建
 # 2012-12-17       qudc            使用组件的隐藏域进行初始化组件。修改dom结构中id的生成，将原先隐藏域中的id（combo-hidden-${id}）修改成${id},将显示域中的id(${id})修改成combobox-input-${id}
 # 2013-01-18       qudc            新增displaySeparate属性
 # 2013-01-23       qudc            为了保持统一标准，将enabled属性修改成disabled属性。
 # 2013-03-28       hanyin          增加filterTarget属性
 # 2013-04-24       hanyin          增加onBlur事件
 # 2013-08-05       hanyin          新增filterCallback回调方法
-->
<#macro combo id=""  width="" name="" check="" filterTarget="" onBlur="" filterCallback=""
 fieldLabel=""  valueField="" selectFirst="" forceSelection="" displayField="" tabIndex ="" baseParams ="" dataUrl="" defaultValue=""  displayFormat="" staticData="" width=""  disabled="" readonly="" autoload=""  multiSelect="" selectable="" onLoadsuccess="" onError="" onLoadfailure ="" multiSeparator="" onSelect="" onFilter="" displaySeparate="" onBeforesend="">

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-combo") />
<@validateAndSet name="width" default="150" />
<@validateAndSet name="readonly" default="false" />
<@validateAndSet name="tabIndex" default="0" />



    <#if boolValue(disabled, false)>
    <div style="WIDTH: ${width}px" class="f-combo f-combo-disable">
        <#elseif !boolValue(selectable, true)>
        <div style="WIDTH: ${width}px" class="f-combo f-combo-selectable">
        <#elseif boolValue(readonly, false)>
        <div style="WIDTH: ${width}px" class="f-combo f-combo-readonly">
        <#else >
        <div style="WIDTH: ${width}px" class="f-combo">
    </#if>
    <input type="hidden" id="${id}" ${!boolValue(disabled, false)?string("","disabled=''")}  name="${name}" check="${check}"
           errorValidateTarget="next" errorMsgTarget="parent"/>
    <input type="text" hasprevioussbling="true" id="combobox-input-${id}" tabindex="${tabIndex}"
           class="f-combo-input f-input-bg ${boolValue(forceSelection,false)?string(' f-combo-input-forceselect','')}" ${!boolValue(disabled, false)?string("","disabled=''")}  ${boolValue(readonly, false)?string("readonly='readonly'","")}  ${boolValue(selectable, true)?string("","readonly='readonly'")}
           autocomplete="off"
           style="WIDTH: ${width?number-25 }px;height:18px;"/><img class="f-combo-trigger"
                                                                   src="${contextPath}/FUI/themes/default/images/s.gif"/>
    <div style="clear:both;"></div>
</div>


<#-- 组件初始化 -->
    <@script>
        $(function() {
            $("#${id}").FCombo({
                valueField : "${valueField}",
                displayField :"${displayField}"

                <#if strValue(disabled)?length != 0>
                    ,disabled : ${disabled}
                </#if>
                <#if strValue(displayFormat)?length != 0>
                    <#if displayFormat?index_of("{")!=-1 >
                        ,displayFormat : "${displayFormat}"
                        <#else >
                            ,displayFormat : ${displayFormat}
                    </#if>
                </#if>
                <#if strValue(multiSelect)?length != 0>
                    ,multiSelect : ${multiSelect}
                </#if>
                <#if strValue(staticData)?length != 0>
                    ,staticData : ${staticData![]}
                </#if>

                <#if strValue(onBlur)?length != 0>
                    ,onBlur : ${onBlur}
                </#if>

                <#if strValue(onSelect)?length != 0>
                    ,onSelect : ${onSelect}
                </#if>
                
                <#if strValue(onFilter)?length != 0>
                    ,onFilter : ${onFilter}
                </#if>
                <#if strValue(defaultValue)?length != 0>
                    ,defaultValue : "${defaultValue}"
                </#if>
                <#if strValue(readonly)?length != 0>
                    ,readonly : ${readonly}
                </#if>
                <#if strValue(selectable)?length != 0>
                    ,selectable : ${selectable}
                </#if>
                <#if strValue(forceSelection)?length != 0>
                    ,forceSelection : ${forceSelection}
                </#if>
                <#if strValue(autoload)?length != 0>
                    ,autoload : ${autoload}
                </#if>
                <#if strValue(dataUrl)?length != 0>
                    ,dataUrl : "${dataUrl}"
                </#if>
                <#if strValue(baseParams)?length != 0>
                    ,baseParams : ${baseParams}
                </#if>
                <#if strValue(onLoadsuccess)?length != 0>
                    ,onLoadsuccess : ${onLoadsuccess}
                </#if>
                <#if strValue(onLoadfailure)?length != 0>
                    ,onLoadfailure : ${onLoadfailure}
                </#if>
                <#if strValue(selectFirst)?length != 0>
                    ,selectFirst : ${selectFirst}
                </#if>
                <#if strValue(multiSeparator)?length != 0>
                    ,multiSeparator : "${multiSeparator}"
                </#if>
                 <#if strValue(onError)?length != 0>
                    ,onError : ${onError}
                </#if>
                <#if strValue(displaySeparate)?length != 0>
                    ,displaySeparate : "${displaySeparate}"
                </#if>
                <#if strValue(onBeforesend)?length != 0>
                    ,onBeforesend : ${onBeforesend}
                </#if>
                <#if strValue(filterTarget)?length != 0>
                    ,filterTarget : "${filterTarget}"
                </#if>
                <#if strValue(filterCallback)?length != 0>
                    ,filterCallback : ${filterCallback}
                </#if>
            });
        });
    </@script>

</#macro>
