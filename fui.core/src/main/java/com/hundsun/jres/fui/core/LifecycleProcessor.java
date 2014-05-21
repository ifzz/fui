/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: LifecycleProcessor.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core;

/**
 * 生命周期处理类
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-3 <br>
 */
public class LifecycleProcessor
{
	/**
	 * 在FUI启动之前被调用，如果抛出任何异常都会终止服务器启动
	 */
	public void onBeforeStart() throws Exception
	{
	}

	/**
	 * 在FUI正式启动之后被指定，抛出的任何异常都会被忽略
	 */
	public void onStarted()
	{
	}

	/**
	 * 在FUI正式销毁之前被调用，抛出的任何异常都会被忽略
	 */
	public void onBeforeDestroy()
	{
	}

	/**
	 * 在FUI销毁完毕之后被调用，抛出的任何异常都会被忽略
	 */
	public void onDestroyed()
	{
	}
}