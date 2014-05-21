/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FHttpIn.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * ========    =======  ============================================
 */
package com.hundsun.jres.fui.core.web;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hundsun.jres.fui.core.FContext;
import com.hundsun.jres.fui.core.FEnvironment;
import com.hundsun.jres.fui.core.FException;
import com.hundsun.jres.fui.core.FIn;
import com.hundsun.jres.fui.core.web.upload.FUIFileUploadService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
/**
 * 文件上传请求用的FIn实现
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: qudc <br>
 * 开发时间: 2013-1-9 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FHttpUploadIn extends FIn
{
	private static final long	serialVersionUID	= 1L;

	private Logger LOG				= LoggerFactory.getLogger(FEnvironment.LOG_NAME);
	
	public static final String	PARAM_REQUEST_TYPE	= "_reqType";
	public static final String	PARAM_RESPONSE_TYPE	= "_respType";
	public static final String	PARAM_RESP_MAPPING	= "_respMapping";

	public FHttpUploadIn(HttpServletRequest req ,HttpServletResponse resp,FContext context)
	{

        FUIFileUploadService fus = new FUIFileUploadService();
        fus.setServletRequest(req);
        fus.setServletResponse(resp);
        
		// 请求的数据模型
		String requestDM = req.getParameter(PARAM_REQUEST_TYPE);
		super.setRequestDM(requestDM);
		// 应答数据模型
		String responseDM = req.getParameter(PARAM_RESPONSE_TYPE);
		super.setResponseDM(responseDM);
		// 应答参数映射关系
		String respMapping = req.getParameter(PARAM_RESP_MAPPING);
		super.setResponseMappings(respMapping);
		// 服务号
		super.setServiceId(calcServiceId(req));
		// 请求参数
		super.setParams(calcParams(req,fus));
		
		context.setProperty("FUIFileUploadService", fus);
	}


	public  Map calcParams(HttpServletRequest req,FUIFileUploadService fus)
	{
		Map result = null;		
		try{
			fus.doUploadAction();
            boolean  isFileUpload =  fus.isFileUpload();
            if(isFileUpload){
            	result = fus.getParameters();
            }
            result.remove(PARAM_REQUEST_TYPE);
    		result.remove(PARAM_RESPONSE_TYPE);
    		result.remove(PARAM_RESP_MAPPING);
       }catch (FException e){
          LOG.error(e.getMessage());
       }
		return result;
	}

	/**
	 * 根据请求的URL计算出服务号
	 * @param req
	 *            http请求
	 * @return 服务号（带后缀）
	 */
	private String calcServiceId(HttpServletRequest req)
	{
		// /f.fservice
		String serviceId = req.getServletPath();
		// .f.fservice
		serviceId = serviceId.replace('/', '.');
		// f.fservice
		return serviceId.substring(1);
	}

}
