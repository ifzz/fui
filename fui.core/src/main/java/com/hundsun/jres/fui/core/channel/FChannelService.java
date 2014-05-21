/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FChannelService.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.channel;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hundsun.jres.fui.core.FEnvironment;
import com.hundsun.jres.fui.core.FIn;
import com.hundsun.jres.fui.core.FLOG;
import com.hundsun.jres.fui.core.FOut;
import com.hundsun.jres.fui.core.FServiceClient;
import com.hundsun.jres.fui.core.util.FResourceResolver;
import com.hundsun.jres.fui.core.util.URLBean;
import com.hundsun.jres.fui.core.version.Version;
import com.hundsun.jres.fui.core.xml.Parser;
import com.hundsun.jres.fui.core.xml.Tag;

/**
 * 通道的容器，管理所有的通道的生命周期
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-4-1 <br>
 */
public class FChannelService implements FServiceClient
{
	private final String				F_CHANNEL_FILE	= "classpath*:fchannel/*.fchannel";
	/** 日志实例 */
	private Logger						LOG				= LoggerFactory.getLogger(FEnvironment.LOG_NAME);
	/** 所有通道的信息列表，用于初始化和管理功能 */
	private Map<String, ChannelInfo>	channelInfos	= new HashMap<String, ChannelInfo>();
	/** 所有通道的实例，用于路由 */
	private ArrayList<ChannelWrapper>	channels		= new ArrayList<ChannelWrapper>();

	public synchronized void init(Tag tag)
	{
		// 从"classpath:*.fchannel"中读取通道信息
		parseFChannelFiles();

		// fui-config.xml中读取通道的信息
		if (tag != null) {
			parseConfigFile(tag);
		}

		// 初始化通道包装器
		Iterator<Entry<String, ChannelInfo>> it = channelInfos.entrySet().iterator();
		while (it.hasNext()) {
			ChannelInfo info = it.next().getValue();
			if (info != null) {
				channels.add(new ChannelWrapper(info));
				if (LOG.isInfoEnabled()) {
					LOG.info("Channel loaded[" + info.getChannelName() + "].");
				} else {
					FLOG.info("Channel loaded[" + info.getChannelName() + "].");
				}
			}
		}
	}

	public synchronized void destroy()
	{
		// 为了减少在停止过程中，仍然有服务调用
		final ArrayList<ChannelWrapper> channels = this.channels;
		this.channels = new ArrayList<ChannelWrapper>(0);

		// 遍历所有的通道，并销毁
		for (ChannelWrapper wrapper : channels) {
			try {
				wrapper.destroy();
				if (LOG.isInfoEnabled()) {
					LOG.info("Channel destroyed[" + wrapper.getName() + "].");
				} else {
					FLOG.info("Channel destroyed[" + wrapper.getName() + "].");
				}
			} catch (Exception e) {
				LOG.error("Failed to destroy channel[" + wrapper.getName() + "].", e);
			}
		}
		// channels.clear();
	}

	public void parseFChannelFiles()
	{
		// 查找满足 classpath*:fchannel/*.fchannel 通配的通道引导文件（classes目录和jar中等）
		FResourceResolver resolver = new FResourceResolver(FEnvironment.class.getClassLoader());
		Enumeration<URLBean> urls = null;
		try {
			urls = resolver.getResources(F_CHANNEL_FILE);
		} catch (Exception e) {
			LOG.error("search [" + F_CHANNEL_FILE + "] has error", e);
			return;
		}

		while (urls.hasMoreElements()) {
			URLBean bean = urls.nextElement();
			URL url = bean.getUrl();
			InputStream is = null;
			try {
				is = url.openStream();
				Parser parser = new Parser(is);
				ChannelInfo info = parseServiceChannel(parser.parse());
				ChannelInfo infoTmp = channelInfos.get(info.getChannelName());
				if (infoTmp == null) {
					channelInfos.put(info.getChannelName(), info);
				} else {
					// 如果版本高于现有版本，则覆盖，否则忽略
					if (info.getVersion().compareTo(infoTmp.getVersion()) > 0) {
						channelInfos.put(info.getChannelName(), info);
					}
				}
			} catch (Exception e) {
				// 记录日志并忽略
				LOG.error("parse channel config file [ " + url + "] has error", e);
			} finally {
				try {
					if (is != null) {
						is.close();
					}
				} catch (IOException e) {
					// 忽略文件关闭错误
				}
			}
		}
	}

	private void parseConfigFile(Tag tag)
	{
		ArrayList<Tag> channels = tag.getSubListByName("channel");
		for (Tag channel : channels) {
			ChannelInfo info = parseServiceChannel(channel);
			ChannelInfo infoTmp = channelInfos.get(info.getChannelName());
			if (infoTmp == null) {
				channelInfos.put(info.getChannelName(), info);
			} else {
				if (info.getVersion().isZero()) { // 覆盖设置原始的基本信息
					if (info.getClassName() != null) {
						infoTmp.setClassName(info.getClassName());
					}
					if (info.getSuffix() != null) {
						infoTmp.setSuffix(info.getSuffix());
					}
					if (info.getInterceptors() != null) {
						infoTmp.setInterceptors(info.getInterceptors());
					}
					infoTmp.getParams().putAll(info.getParams());
				} else if (info.getVersion().compareTo(infoTmp.getVersion()) > 0) { // 如果版本比现有的高，则覆盖
					channelInfos.put(info.getChannelName(), info);
				}
			}
		}
	}

	private ChannelInfo parseServiceChannel(Tag tag)
	{
		String channelName = tag.getProperty("name");
		if ((channelName == null) || (channelName.trim().length() == 0)) {
			// 不是合法的名字则忽略
			return null;
		}
		ChannelInfo chInfo = new ChannelInfo();
		// 通道名
		channelName = channelName.trim();
		chInfo.setChannelName(channelName);
		// 版本信息
		String version = tag.getProperty("version");
		if (version == null) {
			version = "0.0";
		}
		Version v = new Version(version);
		chInfo.setVersion(v);
		// 类名
		String clz = tag.getProperty("class");
		if (clz != null) {
			chInfo.setClassName(clz);
		}
		// 服务标识后缀
		String suffix = tag.getProperty("suffix");
		if (suffix != null) {
			chInfo.setSuffix(suffix);
		}
		// 初始化参数
		ArrayList<Tag> params = tag.getSubListByName("param");
		for (Tag param : params) {
			String key = param.getProperty("key");
			String value = param.getProperty("value");
			if ((key == null) || (value == null)) {
				continue;
			}
			chInfo.getParams().put(key, value);
		}
		// 初始化拦截器
		List<String> interceptors = new ArrayList<String>();
		Tag interceptorTags = tag.getSubTagByName("interceptors");
		if (interceptorTags != null) {
			ArrayList<Tag> subInterTags = interceptorTags.getSubListByName("interceptor");
			for (Tag subTag : subInterTags) {
				String interClz = subTag.getProperty("class");
				if (interClz != null) {
					interClz = interClz.trim();
					if (interClz.length() != 0) {
						interceptors.add(interClz);
					}
				}
			}
		}
		if (interceptors.size() != 0) {
			chInfo.setInterceptors(interceptors);
		}
		return chInfo;
	}

	public FServiceClient getServiceClient()
	{
		return this;
	}

	/*
	 * (non-Javadoc)
	 * @see
	 * com.hundsun.jres.fui.core.FServiceClient#callService(com.hundsun.jres
	 * .fui.core.FIn)
	 */
	public FOut callService(FIn in)
	{
		String serviceId = in.getServiceId();
		ArrayList<ChannelWrapper> channels = this.channels;
		for (ChannelWrapper wrapper : channels) {
			if (wrapper.isSatisfied(serviceId)) {
				try {
					// TODO 这里可能会有 在此时此刻关闭通道的过程中，服务还在被执行，造成的线程安全问题。
					// 但是由于服务器已经停止，所以对于通道的实现，必须保证通道在关闭过程中，服务执行的完整性。
					// 为了保证性能，这里不加锁控制
					FOut out = wrapper.callService(in);
					out.setContext(in.getContext());
					return out;
				} catch (Exception e) {
					LOG.error("Failed to call Service[" + serviceId + "]", e);
					FOut out = FOut.getOut(1, "-1", e.getMessage());
					out.setContext(in.getContext());
					return out;
				}
			}
		}
		// 没有找到匹配的通道能够处理该服务号
		String errorInfo = "No matched channel handled serviceId[" + serviceId + "]";
		LOG.error(errorInfo);
		FOut out = FOut.getOut(1, "-1", errorInfo);
		out.setContext(in.getContext());
		return out;
	}
}
