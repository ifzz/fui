/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FTemplateBoolModel.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.te.freemarker;

import freemarker.template.TemplateBooleanModel;
import freemarker.template.TemplateModel;
import freemarker.template.TemplateModelException;

/**
 * 屏蔽Freemarker的TemplateBoolModel类在toString的时候的bug
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-8-9 <br>
 */

/**
 * Objects that will be interpreted as true/false in the appropriate context
 * must implement this interface.
 * @version $Id: TemplateBooleanModel.java,v 1.8 2003/01/12 23:40:21 revusky Exp
 *          $
 */
public interface FTemplateBooleanModel extends TemplateModel
{

	/**
	 * @return whether to interpret this object as true or false in a boolean
	 *         context
	 */

	boolean getAsBoolean() throws TemplateModelException;

	/**
	 * A singleton object to represent boolean false
	 */
	TemplateBooleanModel	FALSE	= new TemplateBooleanModel()
									{
										public boolean getAsBoolean()
										{
											return false;
										}

										private Object readResolve()
										{
											return FALSE;
										}

										public String toString()
										{
											return "false";
										};
									};

	/**
	 * A singleton object to represent boolean true
	 */
	TemplateBooleanModel	TRUE	= new TemplateBooleanModel()
									{
										public boolean getAsBoolean()
										{
											return true;
										}

										private Object readResolve()
										{
											return TRUE;
										}

										public String toString()
										{
											return "true";
										};
									};
}