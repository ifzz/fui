/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FGirdProcessor.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.tag.container;

import com.hundsun.jres.fui.core.FContext;
import com.hundsun.jres.fui.core.FEnvironment;
import com.hundsun.jres.fui.core.FException;
import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.core.te.TEData;

/**
 * 功能说明:
 * <p/>
 * 系统版本: v1.0<br>
 * 开发人员: qudc <br>
 * 开发时间: 2012-08-22 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FColumnProcessor extends FTagProcessor {

    /*
      * (non-Javadoc)
      * @see com.hundsun.jres.fui.core.page.tag.FTagProcessor#process()
      */
    @Override
    public String process() throws FException {
        // 生成DOM结构
        TEData data = new TEData();
        data.setContent(this.content);
        data.setParameters(parameters);
        // 调用模板引擎
        String result = FEnvironment.get().getTemplateEngineWrapper()
                .process(FContext.getCurrentContext(), "impl/FUI.Column-impl.ftl", data);
        return result;
    }
}
