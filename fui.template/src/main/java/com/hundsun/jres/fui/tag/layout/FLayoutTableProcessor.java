/*
 * 系统名称: JRES 应用快速开发企业套件
 * 模块名称: JRES内核
 * 文件名称: FLayoutTableProcessor.java
 * 软件版权: 恒生电子股份有限公司
 * 修改记录:
 * 修改日期            修改人员                     修改说明 <br>
 * ========    =======  ============================================
 * 
 * ========    =======  ============================================
 */

package com.hundsun.jres.fui.tag.layout;

import java.util.List;
import java.util.Map;

import com.hundsun.jres.fui.core.FException;
import com.hundsun.jres.fui.core.page.tag.FTagProcessor;
import com.hundsun.jres.fui.core.util.DataGetter;

/**
 * 功能说明:
 * <p>
 * 系统版本: v1.0<br>
 * 开发人员: hanyin <br>
 * 开发时间: 2012-7-17 <br>
 * 功能描述: 写明作用，调用方式，使用场景，以及特殊情况<br>
 */
public class FLayoutTableProcessor extends FTagProcessor
{

	private final String	EMPTY	= "$_EMPTY";

	/*
	 * (non-Javadoc)
	 * @see com.hundsun.jres.fui.core.page.tag.FTagProcessor#process()
	 */
	@Override
	public String process() throws FException
	{
		int columns = (Integer) parameters.get("columns");
		String width = DataGetter.getString(parameters.get("width"), "100%");
		String cellspacing = DataGetter.getString(parameters.get("cellspacing"), "4px");

		// 内部标签的所有属性列表
		List<Map<String, Object>> elementParams = super.elementParams;
		// 内部标签的标签体文本
		List<String> elementContents = super.elementContents;

		// 构造一个Table模型，并获取最终的Table结果
		TableModel tableModel = new TableModel(columns, elementParams, elementContents);
		String[] tableData = tableModel.getTable();
		int tdCount = tableModel.getRealCount();

		StringBuilder sb = new StringBuilder();
		sb.append("<table border='0' width='" + width + "' cellspacing='" + cellspacing + "'>");
		for (int i = 0; i < tdCount; i++) {
			boolean newRow = i % columns == 0;
			boolean endRow = (i + 1) % columns == 0;
			if (newRow) {
				sb.append("<tr>");
			}
			String content = tableData[i];
			if (content != EMPTY) {
				sb.append(content);
			}
			if (endRow) {
				sb.append("</tr>");
			}
		}
		sb.append("</table>");
		return sb.toString();
	}

	private class TableModel
	{
		private String[]					cache;
		private int							columns;
		private List<Map<String, Object>>	elementParams;
		private List<String>				elementContents;
		private int							realCount;

		public TableModel(int columns, List<Map<String, Object>> elementParams, List<String> elementContents)
		{
			this.columns = columns;
			this.elementParams = elementParams;
			this.elementContents = elementContents;

			// 构造表格
			constructTable();
		}

		public String[] getTable()
		{
			return cache;
		}

		public int getRealCount()
		{
			return realCount;
		}

		private void constructTable()
		{
			int cacheSize = columns * elementParams.size();
			cache = new String[cacheSize];

			int current = 0;
			int size = elementParams.size();
			for (int i = 0; i < size; i++) {
				// 定位当前位置
				while (cache[current] != null) {
					// 找出下一个位置
					current++;
				}

				StringBuilder sb = new StringBuilder();
				Map<String, Object> params = elementParams.get(i);
				String content = elementContents.get(i);
				if (content == null) {
					content = "";
				}
				int colspan = DataGetter.getInt(params.get("colspan"), 1);
				int rowspan = DataGetter.getInt(params.get("rowspan"), 1);

				sb.append("<td colspan='" + colspan + "' rowspan='" + rowspan + "'>");
				sb.append(content);
				sb.append("</td>");

				int x = current % columns;
				int y = current / columns;
				setValue(x, y, sb.toString());

				if (colspan > 1) {
					for (int c = 1; c < colspan; c++) {
						setValue(x + c, y, EMPTY);
					}
				}
				if (rowspan > 1) {
					for (int c = 1; c < rowspan; c++) {
						setValue(x, y + c, EMPTY);
					}
				}
			}
			realCount = current + 1;
		}

		private void setValue(int x, int y, String tdContent)
		{
			int index = y * columns + x;
			if (index > cache.length - 1) {
				int newSize = (y + 1) * columns * 2;
				String[] tmp = new String[newSize];
				System.arraycopy(cache, 0, tmp, 0, cache.length);
				cache = tmp;
			}
			cache[index] = tdContent;
		}
	}
}
