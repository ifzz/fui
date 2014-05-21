/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: ChannelWrapper.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.channel;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hundsun.jres.fui.core.FEnvironment;
import com.hundsun.jres.fui.core.FException;
import com.hundsun.jres.fui.core.FIn;
import com.hundsun.jres.fui.core.FLOG;
import com.hundsun.jres.fui.core.FOut;
import com.hundsun.jres.fui.core.FRuntimeException;
import com.hundsun.jres.fui.core.interceptor.ActionWrapper;
import com.hundsun.jres.fui.core.interceptor.Interceptor;
import com.hundsun.jres.fui.core.interceptor.ServiceInvocation;

/**
 * 通道的包装器
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-1 <br>
 */
public class ChannelWrapper
{
	/** 通道的基本信息 */
	private ChannelInfo			info;
	/** 日志实例 */
	private Logger				LOG				= LoggerFactory.getLogger(FEnvironment.LOG_NAME);
	/** 包装器是否已经停止 */
	private boolean				hasStop			= false;
	/** 服务调用包装器 */
	private ActionWrapper		actionWrapper;
	/** 拦截器 */
	private List<Interceptor>	interceptors	= new ArrayList<Interceptor>();

	public ChannelWrapper(ChannelInfo info)
	{
		this.info = info;
	}

	public boolean isSatisfied(String serviceId)
	{
		String suffix = info.getSuffix();
		if (suffix == null || serviceId == null) {
			return false;
		}
		return serviceId.endsWith("." + suffix);
	}

	/**
	 * 获取通道的名字
	 * @return 通道名称
	 */
	public String getName()
	{
		return info.getChannelName();
	}

	/**
	 * 获取通道的后缀
	 * @return 通道的后缀
	 */
	public String getSuffix()
	{
		return info.getSuffix();
	}

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.channel.IServiceChannel#destroy()
	 */
	public void destroy() throws FException
	{
		hasStop = true;
		ensureDestroy();
	}

	/*
	 * (non-Javadoc)
	 * @see
	 * com.hundsun.jres.fui.core.channel.IServiceChannel#callService(com.hundsun
	 * .jres.fui.core.FIn)
	 */
	public FOut callService(FIn in) throws FException
	{
		if (hasStop) {
			throw new FException("Channel has stopped.");
		}
		// 确保通道已经正常启动
		IServiceChannel channel = info.getChannelInstance();
		if (channel == null) {
			channel = ensureInit();
		}
		// 调用服务，拦截器
		return ServiceInvocation.callService(in, actionWrapper, interceptors);
	}

	// 保证调用完此方法之后，通道实例被实例化，且初始化成功
	synchronized private IServiceChannel ensureInit() throws FException
	{
		IServiceChannel channel = info.getChannelInstance();
		if (channel != null) { // 避免由于并发造成通道被初始化多次
			return channel;
		}
		try {
			Class<?> clz = ChannelWrapper.class.getClassLoader().loadClass(info.getClassName());
			channel = (IServiceChannel) clz.newInstance();
			channel.init(info.getParams());
			// 初始化拦截器
			List<String> interceptorClses = info.getInterceptors();
			if (interceptorClses != null) {
				for (String interceptorClz : interceptorClses) {
					Class cls = Class.forName(interceptorClz);
					Interceptor interceptor = (Interceptor) cls.newInstance();
					interceptors.add(interceptor);
				}

			}
			if (LOG.isInfoEnabled()) {
				LOG.info("Channel initialized: " + info);
			} else {
				FLOG.info("Channel initialized: " + info);
			}
			actionWrapper = new ChannelActionWrapper(channel);
			info.setChannelInstance(channel);
		} catch (Exception e) {
			interceptors.clear();
			throw new FException("Failed to init channel: " + info, e);
		}

		return channel;
	}

	// 保证通道实例被销毁
	synchronized private void ensureDestroy() throws FException
	{
		IServiceChannel channel = info.getChannelInstance();
		if (channel == null) { // 防止由于并发造成通道被销毁多次
			return;
		}
		channel.destroy();
		info.setChannelInstance(null);
	}

	/**
	 * 通道服务包装器，用于拦截器
	 * <p>
	 * 系统版本: v1.0<br>
	 * 开发人员: hanyin <br>
	 * 开发时间: 2012-8-28 <br>
	 */
	private class ChannelActionWrapper implements ActionWrapper
	{

		private IServiceChannel	channel;

		public ChannelActionWrapper(IServiceChannel channel)
		{
			this.channel = channel;
		}

		/*
		 * (non-Javadoc)
		 * @see
		 * com.hundsun.jres.fui.core.interceptor.ActionWrapper#execute(com.hundsun
		 * .jres.fui.core.FIn)
		 */
		public FOut execute(FIn in)
		{
			try {
				return channel.callService(in);
			} catch (FException e) {
				// 这里捕捉到的异常都是系统异常
				FOut out = FOut.getOut(1, e.getErrorNo(), e.getErrorInfo());
				out.setContext(in.getContext());
				return out;
			} catch (FRuntimeException e) {
				// 这里捕捉到的异常都是系统异常
				FOut out = FOut.getOut(1, e.getErrorNo(), e.getErrorInfo());
				out.setContext(in.getContext());
				return out;
			} catch (Throwable e) {
				LOG.error("An unexpected exception occurred while processing[" + in + "]", e);
				// 这里捕捉到的异常都是系统异常
				FOut out = FOut.getOut(1, "-1", e.getMessage());
				out.setContext(in.getContext());
				return out;
			}
		}
	}

}
