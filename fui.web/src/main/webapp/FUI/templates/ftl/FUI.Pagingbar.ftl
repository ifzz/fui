<#--
 # 版本：FVersion@1.0.9-SNAPSHOT
 # 系统名称: FUI
 # 模块名称: JRES
 # 文件名称: FUI.Pagingbar.ftl
 # 作者：qudc
 # 邮箱：qudc@hundsun.com
 # 软件版权: 恒生电子股份有限公司
 # 功能描述： Pagingbar组件的dom结构
 # 修改记录:
 # 修改日期         修改人员         修改说明
 # 2012-10-24		qudc	 创建
 # 20130521		hanyin	 增加maxPageSize属性
-->
<#macro pagingbar  id="" pageSize ="" maxPageSize="">

<#-- 参数校验，如果值不存在或者为""，则设置为默认值 -->
<@validateAndSet name="maxPageSize" default="300" />

<#-- 临时变量 -->

<div class="f-grid-page" id="${id}">
        <div class="f-grid-page-bg">
            <div style="float:left;">
                <table cellspacing="0" cellpadding="0">
                    <tbody>
                    <tr>
                        <td><span id="${id}-page-first" f_grid_page_status="disabled" f_grid_page_type="first"
                                  class="f-grid-page-button  f-grid-page-first-disabled"></span></td>
                        <td><span id="${id}-page-prev" f_grid_page_status="disabled" f_grid_page_type="prev"
                                  class="f-grid-page-button  f-grid-page-prev-disabled"></span></td>
                        <td><span class="f-grid-page-split"></span></td>
                        <td><span id="${id}-page-beforeText" class="f-grid-page-content">第</span><input id="${id}-page-input" f_grid_page_type="pageIndex" value="0"
                                                                             class="f-grid-page-input"></td>
                        <td style="padding-left:4px;"><span id="${id}-page-afterText" class="grid-page-content">页 共0页</span></td>
                        <td><span class="f-grid-page-split"></span></td>
                        <td><span id="${id}-page-size-beforeText" class="f-grid-page-content">每页</span></td>
                        <td><input id="${id}-page-size-input" f_grid_page_type="pageSize" value="0" style="text-align: center;"
                                                                             class="f-grid-page-input f-grid-page-size-input"></td>
                        <td><span id="${id}-page-size-afterText" class="f-grid-page-content">条</span></td>
                        <td><span class="f-grid-page-split"></span></td>
                        <td><span id="${id}-page-next" f_grid_page_status="disabled" f_grid_page_type="next"
                                  class="f-grid-page-button  f-grid-page-next-disabled"></span></td>
                        <td><span id="${id}-page-last" f_grid_page_status="disabled" f_grid_page_type="last"
                                  class="f-grid-page-button f-grid-page-last-disabled"></span></td>
                        <td><span class="f-grid-page-split"></span></td>
                        <td><span id="${id}-page-refresh" f_grid_page_status="enable" f_grid_page_type="refresh"
                                  class="f-grid-page-button f-grid-page-btn f-grid-page-refresh"></span></td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div style="float:right;">
                <table cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                    <tr>
                        <td><span id="${id}-page-totalcount" class="f-total-count"></span></td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div style="clear:both;"></div>
        </div>
    </div>

<#-- 组件初始化 -->
<@script>
     $(function(){
        $('#${id}').FPagingbar({
        	maxPageSize : "${maxPageSize}"
            <#if strValue(pageSize)?length != 0>
                , pageSize : ${pageSize}
            </#if>
        });
    });
</@script>

</#macro>
