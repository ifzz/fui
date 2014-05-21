/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FUIServiceServlet.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 2012-12-28  qudc     新增文件上传服务的处理，包括文件载入以及后续文件删除
 * 2013-01-09  qudc     删除doFileUpLoad方法，将文件上传统一放到类FHttpUploadIn中进行处理
 * 2013-01-09  qudc     将FileUploadServiceImpl类换成.FileUploadService类
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.core.web;

import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.hundsun.jres.fui.core.*;
import com.hundsun.jres.fui.core.service.ServiceConstant;
import com.hundsun.jres.fui.core.web.FHttpUploadIn;
import com.hundsun.jres.fui.core.web.upload.FUIFileUploadService;
import com.hundsun.jres.fui.core.util.DataGetter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * FUI处理Ajax请求的Servlet
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-3 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FUIServiceServlet extends HttpServlet
{
	private static final long	serialVersionUID	= 1L;
	private boolean				myResponsibility	= false;
    private Logger LOG				= LoggerFactory.getLogger(FEnvironment.LOG_NAME);

	/*
	 * (non-Javadoc)
	 * @see javax.servlet.GenericServlet#init()
	 */
	@Override
	public void init() throws ServletException
	{
		myResponsibility = DefaultFUIInitializer.get().initialize(getServletContext());
	}

	/*
	 * (non-Javadoc)
	 * @see javax.servlet.GenericServlet#destroy()
	 */
	@Override
	public void destroy()
	{
		if (myResponsibility) {
			// 避免不必要的销毁
			DefaultFUIInitializer.get().destroy();
		}
	}

	/*
	 * (non-Javadoc)
	 * @see
	 * javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest
	 * , javax.servlet.http.HttpServletResponse)
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
	{
		doService(req, resp);
	}

	/*
	 * (non-Javadoc)
	 * @see
	 * javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest
	 * , javax.servlet.http.HttpServletResponse)
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
	{
		doService(req, resp);
	}

	protected void doService(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		FContext fcontext = getFContext(req, resp);
		fcontext.setContextPath(req.getContextPath());
        //2012-12-28 add by qudc 服务是否为文件上传服务 start
        boolean isFileUpload = isMultipartContent(req);
        //2012-12-28 add by qudc end
        FIn in   = null;


        if(isFileUpload){
            in = new FHttpUploadIn(req,resp,fcontext);
        }else {
            // 正常的请求
		    in = new FHttpIn(req);
        }


		// 调用服务
		FOut out = fcontext.callService(in);

        //2012-12-28 add by qudc 如果文件上传，且上传出错则删除上传的文件。    start
        if(isFileUpload){
            if( out.getReturnCode() != ServiceConstant.I_OK ){
                //returnCode 不为0 ，则删除原先上传的文件
            	FUIFileUploadService fileUploadService = (FUIFileUploadService)fcontext.getProperty("FUIFileUploadService");
                 deleteUploadFile(req,resp,fileUploadService);
            }
        }
        //2012-12-28 add by qudc end

		try {
			// 转换JSON
			String result = FEnvironment.get().getJsonConvertor().obj2JSON(out);
			// 应答输出
			processResponse(resp);
			resp.getWriter().write(result);
		} catch (Exception e) {
			throw new ServletException(e);
		}
	}

    //判断当前服务是否为文件上传
    private static boolean isMultipartContent(HttpServletRequest req){
        if(!"post".equals(req.getMethod().toLowerCase()))
            return false;
        String contentType = req.getContentType();
        if(contentType == null)
            return false;
        return contentType.toLowerCase().startsWith("multipart/");
    }

    /**
     * 如果文件上传服务执行失败，删除上传的文件。
     * @param request
     * @param response
     * @param fileUploadService
     */
    private void deleteUploadFile(HttpServletRequest request,HttpServletResponse response,FUIFileUploadService fileUploadService){
          if ( null != fileUploadService) {
			List<File> uploadFiles = fileUploadService.getUploadFile();
			if (uploadFiles.size() > 0) {
				for (File file : uploadFiles) {
					if (file.exists()) {
						try {
							file.delete();
						} catch (Exception e) {
                            //删除文件失败
                            LOG.error(e.getMessage());
						}
					}
				}
			}
		}
    }


	private FContext getFContext(HttpServletRequest req, HttpServletResponse resp)
	{
		FContext context = new FContext(FEnvironment.get(), req, resp, getServletContext());
		return context;
	}

	private void processResponse(HttpServletResponse resp)
	{
		String charset = DataGetter.getString(FEnvironment.get().getProperty(FEnvironment.CONSTANT_I18N_ENCODING),
				"utf-8");
		resp.setCharacterEncoding(charset);
		resp.setContentType("text/html");
		resp.setHeader("Pragma", "No-cache");
		resp.setHeader("Cache-Control", "no-cache");
		resp.setDateHeader("Expires", 0L);
	}

    



}
