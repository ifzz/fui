/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: com.hundsun.jres.impl.uiengine
 * 文件名称: FileUploadServiceImpl.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录: 
 * 修改日期      修改人员                     修改说明
 * ========    =======  ============================================
 *   
 * ========    =======  ============================================
 */
package com.hundsun.jres.fui.core.web.upload;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.hundsun.jres.fui.core.FEnvironment;
import com.hundsun.jres.fui.core.FException;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;



import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 功能说明: 文件上传接口服务的实现<br>
 * 系统版本: v1.0<br>
 * 开发人员: zhangsu@hundsun.com <br>
 * 开发时间: 2010-7-23<br>
 * 功能描述: 文件上传的实现采用两种方式：(tempFile/memory) 修改记录：20110609
 * 修改文件上传的默认方式，当获取uploadType为空时， 设置默认值为memory
 * 
 */

public class FUIFileUploadService {

    private Logger LOG				= LoggerFactory.getLogger(FEnvironment.LOG_NAME);

	private HttpServletResponse response;
	private HttpServletRequest request;

    private static final String	TEMP_PATH = "fui.custom.fileupload.tempPath";
    private static final String	SIZE_MAX = "fui.custom.fileupload.sizeMax";
    private static final String	FILE_SIZE_MAX = "fui.custom.fileupload.fileSizeMax";
    private static final String	SIZE_THRESHOLD = "fui.custom.fileupload.sizeThreshold";

	/**
	 * 临时文件目录
	 */
	private String tempPath = "";
	/**
	 * 临时文件
	 */
	File tempPathFile;
	/**
	 * 设置一次上传文件总和大小 4MB
	 */
	private long sizeMax = 4194304;

	/**
	 * 设置单个文件最大尺寸 1MB
	 */
	private long fileSizeMax = 1024 * 1024;
	/**
	 * 设置内存最大占用大小 1MB
	 */
	private int sizeThreshold = 1024 * 1024;
	/**
	 * 保存普通form表单域
	 */
	private Map<String, Object> parameters = new HashMap<String, Object>();
	/**
	 * 保存上传文件信息的map
	 */
	private Map<String, FileItem> files = new HashMap<String, FileItem>();

	/**
	 * 保存上传文件大小的map
	 */
	private Map<String, Long> filesSize = new HashMap<String, Long>();

	/**
	 * 是否为文件上传请求
	 */
	private boolean isMultipart = false;

	private DiskFileItemFactory factory = new DiskFileItemFactory();

	private ServletFileUpload sfu = new ServletFileUpload(factory);

	// 上传到服务器端的文件
	private List<File> uploadFile = new ArrayList<File>(2);
	// 是否为文件上传
	private boolean fileUpload;

	public boolean isFileUpload() {
		return fileUpload;
	}

	public void setFileUpload(boolean fileUplod) {
		this.fileUpload = fileUplod;
	}

	public FUIFileUploadService(HttpServletRequest request,
                                HttpServletResponse response) {
		this.response = response;
		this.request = request;

	}

	public FUIFileUploadService() {

        Object temp_path =  FEnvironment.get().getProperty(TEMP_PATH);
        Object size_max = FEnvironment.get().getProperty(SIZE_MAX) ;
        Object file_size_max = FEnvironment.get().getProperty(FILE_SIZE_MAX) ;
        Object size_threshold = FEnvironment.get().getProperty(SIZE_THRESHOLD) ;
        //如果没有配置，则使用默认的配置 ：sizeMax = 4194304  fileSizeMax = 1024 * 1024  sizeThreshold = 1024 * 1024;
        if(temp_path != null ){
            this.setTempPath(temp_path.toString());
        }
        if(size_max !=null ){
            this.setSizeMax(Long.valueOf(size_max.toString()));
        }
        if(file_size_max !=null){
            this.setFileSizeMax( Long.valueOf(file_size_max.toString()));
        }
        if(size_threshold != null){
            this.setSizeThreshold(Integer.valueOf(size_threshold.toString()));
        }

	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.hundsun.jres.interfaces.uiengine.engineservice.FileUploadService#
	 * setSizeMax(int)
	 */
	public void setSizeMax(long sizeMax) {
		this.sizeMax = sizeMax;
	}

	/*
	 * fileSizeMax the fileSizeMax to set
	 * 
	 * @see
	 * com.hundsun.jres.interfaces.uiengine.engineservice.FileUploadService#
	 * setFileSizeMax(int)
	 */
	public void setFileSizeMax(long fileSizeMax) {
		this.fileSizeMax = fileSizeMax;

	}

	/*
	 * sizeThreshold the sizeThreshold to set
	 * 
	 * @see
	 * com.hundsun.jres.interfaces.uiengine.engineservice.FileUploadService#
	 * setSizeThreshold(int)
	 */
	public void setSizeThreshold(int sizeThreshold) {
		this.sizeThreshold = sizeThreshold;
		factory.setSizeThreshold(sizeThreshold);
	}

	/*
	 * tempPath the tempPath to set
	 * 
	 * @see
	 * com.hundsun.jres.interfaces.uiengine.engineservice.FileUploadService#
	 * setTempPath(java.lang.String)
	 */
	public void setTempPath(String tempPath) {
		this.tempPath = tempPath;
	}

	/**
	 * 初始化操作
	 */
	public void beforeUploadAction() {
		this.tempPathFile = new File(tempPath);
		if (!tempPathFile.exists()) {
			tempPathFile.mkdirs();
			// 临时文件目录
			factory.setRepository(tempPathFile);
		} else {

		}
	}

	/**
	 * 执行上传操作
	 */
	public boolean doUploadAction() throws FException {
		// 是否为文件上传
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);
		setFileUpload(isMultipart);
		if (isMultipart) {
			this.beforeUploadAction();
			sfu.setFileSizeMax(fileSizeMax);
			sfu.setSizeMax(sizeMax);
			sfu.setHeaderEncoding("UTF-8");

			List<FileItem> items = null;

			try {
				items = sfu.parseRequest(request);
			} catch (FileUploadException e) {
				//log.error(e.getMessage(), e);
				throw new FException(e.getMessage());
			}

			processFields(items);
			String uploadType = (getUploadType() == null) ? "memory"
					: getUploadType();
			processFileFields(uploadType);
		}
		return isMultipart;
	}

	/*
	 * 获取文件上传处理类型
	 */
	public String getUploadType() {
		String val = (String) parameters.get("uploadType");
		return val;

	}

	/**
	 * 根据文件上传处理类型来处理文件
	 * 
	 * @param type
	 *            文件上传处理类型
	 * @throws Exception
	 */
	public void processFileFields(String type) throws FException {
		Set<Entry<String, FileItem>> set = files.entrySet();
		if (type.equals("tempFile")) {
			int count = 1;
			for (Entry<String, FileItem> entry : set) {
				Entry<String, FileItem> entryTemp = entry;
				String name = entryTemp.getKey(); // fieldName
				FileItem item = entryTemp.getValue();

				String fileNameString = item.getName();
				int start = fileNameString.lastIndexOf("\\");
				fileNameString = fileNameString.substring(start + 1);
				File file = new File(tempPath, fileNameString);
				// {上传的文件是否存在
				if (file.exists()) {
					// String dateStr = new
					// java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new
					// Date());
					// dateStr ="["+dateStr+"("+(count++)+")]";
					// String _filePath = fileNameString+dateStr;
					String _filePath = UUID.randomUUID().toString() + "_"
							+ fileNameString;

					file = new File(tempPath, _filePath);
				}
				// }
				// 缓存上传文件句柄
				this.uploadFile.add(file);

				try {
					item.write(file);
				} catch (Exception e) {
					throw new FException(e.getMessage());
				}

				parameters.put(name, file.getPath());
			}

		} else if (type.equals("memory")) {
			for (Entry<String, FileItem> entry : set) {
				Entry<String, FileItem> entryTemp = entry;
				String name = entryTemp.getKey();
				FileItem item = entryTemp.getValue();

				byte[] result = new byte[filesSize.get(name).intValue()];
				int cnt = 0;
				BufferedInputStream bin = null;
				try {
					bin = new BufferedInputStream(item.getInputStream());
					int b;
					while ((b = bin.read()) != -1) {
						result[cnt++] = (byte) b;
					}
					parameters.put(name, result);
				} catch (Exception e) {
					throw new FException( e.getMessage());
				} finally {
					if (bin != null) {
						try {
							bin.close();
						} catch (Exception e) {
							throw new FException( e);
						}
					}
				}
			}
		}
	}

	/**
	 * 遍历处理每个FileItem项
	 * 
	 * @param items
	 * @throws com.hundsun.jres.fui.core.FException
	 */
	public void processFields(List<FileItem> items) throws FException {
		Iterator<FileItem> it = items.iterator();
		while (it.hasNext()) {
			FileItem item = (FileItem) it.next();

			if (item.isFormField()) {
				String fieldName = item.getFieldName(); // fieldName不允许相同
				String value;
				try {
					value = item.getString("UTF-8");
				} catch (UnsupportedEncodingException e) {
					LOG.error(e.getMessage(), e);
					throw new FException(e.getMessage());
				}

				if (fieldName == null || fieldName.equals(""))
					continue;

				parameters.put(fieldName, value);
			} else {
				String fieldName = item.getFieldName();// fieldName不允许相同
				String fileName = item.getName();
				String contentType = item.getContentType();
				boolean isInMemory = item.isInMemory();
				long sizeInBytes = item.getSize();
				/*
				 * if (sizeInBytes > this.fileSizeMax) { throw new
				 * UIEngineException("文件大小超过单个文件上传最大值限制 ,单个文件最大值[ " +
				 * (fileSizeMax / 1024) + "K]"); } if (sizeInBytes >
				 * this.sizeMax) { throw new
				 * UIEngineException("文件大小超过一次上传文件总和大小 ,文件总和大小[ " + (sizeMax /
				 * 1024) + "K]"); }
				 */
				if (fieldName == null || fieldName.equals(""))
					continue;
				files.put(fieldName, item);
				filesSize.put(fieldName, sizeInBytes);
			}
		}
	}

	/**
	 * method comments here
	 * 
	 * @param request
	 */
	public void setServletRequest(HttpServletRequest request) {
		if (request == null) {

		}
		this.request = request;

	}

	/**
	 * method comments here
	 * 
	 * @param response
	 */
	public void setServletResponse(HttpServletResponse response) {
		if (response == null) {
			//throw new JRESBaseRuntimeException(JRESCommonError.NULL_POINTER_ERROR, "response");
		}
		this.response = response;

	}

	public Map<String, Object> getParameters() {
		return parameters;
	}

	public void setParameters(Map<String, Object> parameters) {
		this.parameters = parameters;
	}

	public Map<String, Object> getRequestMap(HttpServletRequest request) {
		setServletRequest(request);
		sfu.setSizeMax(sizeMax);
		sfu.setHeaderEncoding("UTF-8");
		try {
			processFields(sfu.parseRequest(request));
		} catch (FException e) {
			LOG.error(e.getMessage(), e);
		} catch (FileUploadException e) {
			LOG.error(e.getMessage(), e);
		}
		return this.parameters;
	}

	public List<File> getUploadFile() {
		return uploadFile;
	}

	public void setUploadFile(List<File> uploadFile) {
		this.uploadFile = uploadFile;
	}
}
