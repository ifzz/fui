/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: ServiceInvocation.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.interceptor;

import java.util.Iterator;
import java.util.List;

import com.hundsun.jres.fui.core.FIn;
import com.hundsun.jres.fui.core.FOut;

/**
 * 服务调用器，拦截器
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-28 <br>
 */
public class ServiceInvocation
{
	/** 拦截器列表 */
	private Iterator<Interceptor>	interceptors	= null;
	/** 请求参数 */
	private FIn						in;
	/** 应答数据 */
	private FOut					out;
	/** 服务执行包装器 */
	private ActionWrapper			action;

	/**
	 * 通过拦截器调用服务的静态方法
	 * @param in
	 *            请求参数
	 * @param interceptors
	 *            拦截器列表
	 * @return 服务调用的应答
	 */
	public static FOut callService(FIn in, ActionWrapper action, List<Interceptor> interceptors)
	{
		// 初始化服务执行器
		ServiceInvocation invocation = new ServiceInvocation(in);
		invocation.setInterceptors(interceptors);
		invocation.setAction(action);
		// 调用服务
		invocation.invoke();
		// 返回应答
		FOut out = invocation.getOut();
		return out;
	}

	private ServiceInvocation(FIn in)
	{
		this.in = in;
	}

	private void setAction(ActionWrapper action)
	{
		this.action = action;
	}

	/**
	 * 设置拦截器链
	 * @param interceptors
	 *            拦截器链
	 */
	private void setInterceptors(List<Interceptor> interceptors)
	{
		if (interceptors != null && interceptors.size() != 0) {
			this.interceptors = interceptors.iterator();
		}
	}

	/**
	 * 设置服务调用的应答
	 * @param out
	 *            服务调用的应答
	 */
	private void setOut(FOut out)
	{
		this.out = out;
	}

	/**
	 * 返回请求参数
	 * @return 请求参数
	 */
	public FIn getIn()
	{
		return this.in;
	}

	/**
	 * 获取服务调用的应答
	 * @return 服务调用的应答
	 */
	public FOut getOut()
	{
		return this.out;
	}

	/**
	 * 调用服务，如果存在连接器则递归的调用拦截器
	 */
	public void invoke()
	{
		if (interceptors != null) {
			if (interceptors.hasNext()) {
				Interceptor interceptor = (Interceptor) interceptors.next();
				Object o = interceptor.intercept(this);
				if (o != null) {
					// 中断递归调用
					if (o instanceof FOut) {
						setOut((FOut) o);
					} else {
						setOut(FOut.getOut(o));
					}
					return;
				}
			}
		}
		// 如果没有拦截器，或者没有被中断
		if (out == null) {
			this.out = action.execute(in);
		}
	}

}
