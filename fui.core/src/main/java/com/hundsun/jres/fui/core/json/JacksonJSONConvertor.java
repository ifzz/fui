/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: JacksonJSONConvertor.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.json;

import org.codehaus.jackson.map.ObjectMapper;

import com.hundsun.jres.fui.core.util.FByteArrayOutputStream;

/**
 * XStream的JSON转换器，需要特别注意的是，jackson的默认编码就是UTF-8
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-2 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class JacksonJSONConvertor implements JSONConvertor
{
	private ObjectMapper	objectMapper	= new ObjectMapper();

	public JacksonJSONConvertor()
	{
	}

	/*
	 * (non-Javadoc)
	 * @see
	 * com.hundsun.jres.fui.core.json.JSONConvertor#obj2JSON(java.lang.Object)
	 */
	public String obj2JSON(Object object) throws Exception
	{
		FByteArrayOutputStream baos = new FByteArrayOutputStream();
		objectMapper.writeValue(baos, object);
		// 由于jackson默认编码就是UTF的，因此这里必须做编码转换
		return baos.toString("UTF-8");
	}

	/*
	 * (non-Javadoc)
	 * @see
	 * com.hundsun.jres.fui.core.json.JSONConvertor#JSON2obj(java.lang.String,
	 * java.lang.Class)
	 */
	public Object JSON2obj(String json, Class clz) throws Exception
	{
		return objectMapper.readValue(json, clz);
	}

}
