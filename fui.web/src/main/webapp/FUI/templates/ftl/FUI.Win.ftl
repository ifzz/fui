<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Win.ftl
 # 作者：qudc
 # 邮箱：qudc@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述：Window组件的dom结构定义
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 20120822		qudc	 创建
 # 20121206     qudc     新增maximized属性
 # 20130304     qudc    完成需求：4864，新增属性 hasCloseBtn
 # 20130407     hanyin   [基材二部/贾云龙][TS:201304030008][FUI]【开发】 IE6下FWin弹出出现js错误并且win显示有问题
-->
<#macro win  id="" pageUrl="" isIframe="" width="" height="" buttons="" title="" modal="" buttonAlign="" dragable="" maxable="" onSetHtml="" onResize="" onClose="" onShow="" maximized="" hasCloseBtn="">

<@validateAndSet name="id" default=genId("f-win") />


<div id="${id}"  class="f-win" style="display:none;">
<textarea id="${id}-textarea" style="display:none;"><#nested></textarea>
</div>

<#-- 组件初始化 -->
<@script>
    $(function() {
    		if ($("body>#f-win-area").length == 0) {
    			$("body").append("<div id='f-win-area'></div>");
    		}
    		$(".f-win").each(function() {
    			var el = $(this);
    			if (el.parent().is("#f-win-area")) {
    				return;
    			}
    			$("#f-win-area").append(el.detach());
    		});

        $I('${id}').FWin({
            title :"${title}"
            <#if strValue(width)?length != 0>
                , width :${width}
            </#if>
            <#if strValue(height)?length != 0>
                , height :${height}
            </#if>
            <#if strValue(buttons)?length != 0>
                ,buttons:${buttons}
            </#if>
            <#if strValue(isIframe)?length != 0>
                ,isIframe:${isIframe}
            </#if>
            <#if strValue(pageUrl)?length != 0>
                ,pageUrl:"${pageUrl}"
            </#if>
            <#if strValue(modal)?length != 0>
                ,modal:${modal}
            </#if>
            <#if strValue(buttonAlign)?length != 0>
                ,buttonAlign:"${buttonAlign}"
            </#if>
            <#if strValue(dragable)?length != 0>
                ,dragable:${dragable}
            </#if>
            <#if strValue(maxable)?length != 0>
                ,maxable:${maxable}
            </#if>
            <#if strValue(onSetHtml)?length != 0>
                ,onSetHtml:${onSetHtml}
            </#if>
            <#if strValue(onResize)?length != 0>
                ,onResize:${onResize}
            </#if>
            <#if strValue(onClose)?length != 0>
                ,onClose:${onClose}
            </#if>
            <#if strValue(maximized)?length != 0>
                ,maximized:${maximized}
            </#if>
            <#if strValue(onShow)?length != 0>
                ,onShow:${onShow}
            </#if>
            <#if strValue(hasCloseBtn)?length != 0>
                ,hasCloseBtn:${hasCloseBtn}
            </#if>



        });
    });

</@script>

</#macro>
