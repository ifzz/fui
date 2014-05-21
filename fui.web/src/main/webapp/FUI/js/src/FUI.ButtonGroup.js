/**
 * @name FButtonGroup
 * @class 
 * 按钮组， 管理多个Button组件，管理button的排布位置等
 */

/**@lends FButtonGroup# */

/**
 * 所有的button的排布：'center':表示居中，'left':居左，'right':居右。
 * @name FButtonGroup#<ins>buttonAlign</ins>
 * @type String
 * @default 'center'
 * @example
 * 无
 */

(function($) {
	$.FUI.FToolGroup = $.FUI.FToolGroup || {};
	$.FUI.FToolGroup.generateHtml = function(op) {
		var id = op.id || $Utils.genId("f-toolGroup"); // 0
		var style = op.style || ""; // 1
		var classes = op.classes || ""; // 2
		var width = op.width || "auto"; // 3
		var height = op.height || "auto"; // 4
		var toolAlign = op.toolAlign || "center"; //5
		var toolspacing = op.toolspacing || "2"; // 6
		var toolpadding = op.toolpadding || "0"; // 7
		var nested = ""; // 8
		
		function genItemHtml(item) {
			var html = "<td class='f-tool-cell'>" + item + "</td>"; 
			return html;
		}
		
		var items = op.items;
		for (var i=0; i<items.length; i++) {
			nested += genItemHtml(items[i]);
		}
		
		var template = "\
			<div id='{0}' class='f-toolGroup f-tools-{5} {2}' style='{1}'> \
				<table cellspacing='{6}' cellpadding='{7}' \
						style='height:{4};width:{3};' class='f-toolGroup-ct'> \
					<tbody><tr>{8}</tr> \
					</tbody> \
				</table> \
			</div>\
		";
		return $Utils.format(template, id, style, classes, width, height, 
				toolAlign, toolspacing, toolpadding, nested);
	};

	$.FUI.FButtonGroup = $.FUI.FButtonGroup || {};
	$.FUI.FButtonGroup.generateHtml = function(op) {
		op.id = op.id || $Utils.genId("f-buttonGroup");
		op.classes = (op.classes || "") + " f-buttonGroup ";
		op.toolAlign = op.buttonAlign;
		return $.FUI.FToolGroup.generateHtml(op);
	};
	
})(jQuery);
