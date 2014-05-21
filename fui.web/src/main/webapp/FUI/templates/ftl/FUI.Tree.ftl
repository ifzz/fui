<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Tree.ftl
 # 作者：qudc
 # 邮箱：qudc@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： tree组件的dom结构
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20121127		qudc	 创建
-->
<#macro tree id="" width="" height=""  syncLoad="" baseParams="" dataUrl="" selectModel="" rootVisible="" rootNode=""  onNodeDblClick=""  staticData="" onNodeClick="" onNodeSelect="" onNodeUnSelect="" onLoadsuccess="" onLoadfailure="" onLoadError="" title="">

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="id" default=genId("f-tree") />
<@validateAndSet name="width" default="250" />
<@validateAndSet name="height" default="350" />

    <div id="${id}" class="f-tree" style="<#if strValue(width) != "auto" >width:${width}px;</#if> <#if strValue(height) != "auto" > height:${height}px;</#if>" >
        <#if strValue(title)?length != 0>
            <div id="${id}-head" class="f-tree-head">
                <span id="${id}-title" class="f-tree-title">${title}</span>
            </div>
        </#if>
        <div id="${id}-body" class="f-tree-body"></div>
    </div>

<#-- 组件初始化 -->
    <@script>
        $(function() {
            $("#${id}").FTree({
                width:"${width}",
                height:"${height}"
                <#if strValue(syncLoad)?length != 0>
                ,syncLoad:${syncLoad}
                </#if>
                <#if strValue(baseParams)?length != 0>
                ,baseParams:${baseParams}
                </#if>
                <#if strValue(dataUrl)?length != 0>
                ,dataUrl:"${dataUrl}"
                </#if>
                <#if strValue(selectModel)?length != 0>
                ,selectModel:"${selectModel}"
                </#if>
                <#if strValue(rootVisible)?length != 0>
                ,rootVisible:${rootVisible}
                </#if>
                <#if strValue(rootNode)?length != 0>
                ,rootNode:${rootNode}
                </#if>
                <#if strValue(onNodeDblClick)?length != 0>
                ,onNodeDblClick:${onNodeDblClick}
                </#if>
                <#if strValue(staticData)?length != 0>
                ,staticData:${staticData}
                </#if>
                <#if strValue(onNodeClick)?length != 0>
                ,onNodeClick:${onNodeClick}
                </#if>
                <#if strValue(onNodeSelect)?length != 0>
                ,onNodeSelect:${onNodeSelect}
                </#if>
                <#if strValue(onNodeUnSelect)?length != 0>
                ,onNodeUnSelect:${onNodeUnSelect}
                </#if>
                <#if strValue(onLoadsuccess)?length != 0>
                ,onLoadsuccess:${onLoadsuccess}
                </#if>
                <#if strValue(onLoadfailure)?length != 0>
                ,onLoadfailure:${onLoadfailure}
                </#if>
                <#if strValue(onLoadError)?length != 0>
                ,onLoadError:${onLoadError}
                </#if>
            });
        });
    </@script>

</#macro>
