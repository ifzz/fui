/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: IServiceChannel.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.channel;

import java.util.Map;

import com.hundsun.jres.fui.core.FException;
import com.hundsun.jres.fui.core.FIn;
import com.hundsun.jres.fui.core.FOut;

/**
 * 功能说明: 服务接入通道的接口
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-4-12 <br>
 */
public interface IServiceChannel
{
	/**
	 * 初始化
	 * @param params
	 *            初始化参数，从配置文件中读取
	 * @throws FException
	 *             初始化的过程中出现异常
	 */
	public void init(Map<String, String> params) throws FException;

	/**
	 * 销毁通道
	 */
	public void destroy() throws FException;

	/**
	 * 调用服务
	 * @param context
	 *            上下文
	 * @return 服务返回结果
	 */
	public FOut callService(FIn in) throws FException;
}
