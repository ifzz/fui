/*
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Message.js
 * 作者：hanyin
 * 邮箱：hanyin@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FMessage组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 20121231  hanyin		修复Message组件在Ie7下，先打开confirm，再打开alert，会出现图标遮蔽的问题
 */

/**
 * @name FMessage
 * @class 
 * 消息提示，用于提供提示信息的弹出窗口，类似于JavaScript中使用alert()、confirm()、prompt()函数时出现的那种提示信息的弹出窗口。
 */
	
  	/**@lends FMessage# */

(function($) {

	$.registerWidgetEvent("");

	// 绑定jquery对象的fui对象，用于事件绑定和逻辑处理
	$.widget("FUI.FMessage", {
	    options : {
	    	onBntClick : null,
	    	onCloseClick : null
	    },
	    
	    _create : function() {
	    	this.options.id = this.element.attr("id");
	    },
	    
	    _init : function() {
	    	var self = this;
	    	var selfEl = this.element;
	    	if (!$Component.hasFType(selfEl, "FPopupBox")) {
	    		// 如果还没有初始化popuoBox
	    		selfEl.FPopupBox({position:{left:"center", top:"center"}, zIndex:20001});
	    	}
	    	// 绑定事件
	    	self._bindEvent();
	    },
	    
	    destroy : function() {
		    var op = this.options;
		    if (op._dragable) {
		    	op._dragable.stop();
		    	op._dragable.destroy();
			    op._dragable = null;
		    }
		    // 调用父类的销毁方法
		    $.Widget.prototype.destroy.call(this);
	    },
	    
	    _bindEvent : function() {
	    	var op = this.options;
	    	var self = this;
	    	var selfEl = this.element;
	    	// 绑定按钮的事件
	    	self._bindBntsEvent();
	    	// 绑定右上角的关闭按钮事件
	    	self._bindCloseBntEvent();
	    	// 绑定标题事件，移动
	    	self._bindHeaderEvent();
	    },
	    
	    _bindBntsEvent : function() {
	    	var self = this;
	    	var bnts = [self._getOkEl(), self._getYesEl(), self._getNoEl(), self._getCancelEl()];
	    	var bntStrs = ["ok", "yes", "no", "cancel"];
	    	for (var i=0; i<bnts.length; i++) {
	    		var bntStr = bntStrs[i];
	    		var func = $.proxy(self.options, "onBntClick", bntStr);
	    		bnts[i].FSimpleButton({
	    			onClick : func
	    		});
	    	}
	    },
	    
	    _bindCloseBntEvent : function() {
	    	var self = this;
	    	var el = self._getCloseIconEl();
	    	el.hover(function() {
	    		$(this).addClass("f-tool-closethick").removeClass("f-tool-close");
	    	}, function() {
    		  	$(this).removeClass("f-tool-closethick").addClass("f-tool-close");
    		}).mousedown(function(e) {
    			e.stopPropagation(); // 防止因为点击按钮出现 窗口移动的虚框
    		}).click(function() {
    			self.options.onCloseClick();
    		});
	    },
	    
	    _bindHeaderEvent : function() {
	    	var self = this;
	    	var op = this.options;
	    	var selfEl = this.element;
	    	var headerEl = self._getHeaderEl();
	    	op._dragable = new $.Dragable(op.id+"-header", op.id);
	    },
	    
	    _getHeaderEl : function() {
	    	var op = this.options;
	    	var el = op._headerEl;
	    	if (!el) {
		    	var selfEl = this.element;
	    		op._headerEl = el = $I(op.id + "-header");
	    	}
	    	return el;
	    },
	    
	    _getCloseIconEl : function() {
	    	var op = this.options;
	    	var el = op._closeEl;
	    	if (!el) {
	    		op._closeEl = el = $I(op.id + "-closeIcon");
	    	}
	    	return el;
	    },
	    
	    _getOkEl : function() {
	    	var op = this.options;
	    	var el = op._okBntEl;
	    	if (!el) {
	    		el = op._okBntEl = $I(op.id + "-okBnt");
	    	}
	    	return el;
	    },
	    
	    _getCancelEl : function() {
	    	var op = this.options;
	    	var el = op._cancelBntEl;
	    	if (!el) {
	    		el = op._cancelBntEl = $I(op.id + "-cancelBnt");
	    	}
	    	return el;
	    },
	    
	    _getYesEl : function() {
	    	var op = this.options;
	    	var el = op._yesBntEl;
	    	if (!el) {
	    		el = op._yesBntEl = $I(op.id + "-yesBnt");
	    	}
	    	return el;
	    },
	    
	    _getNoEl : function() {
	    	var op = this.options;
	    	var el = op._noBntEl;
	    	if (!el) {
	    		el = op._noBntEl = $I(op.id + "-noBnt");
	    	}
	    	return el;
	    },
	    
	    show : function(op) {
	    	this.element.FPopupBox("show", op);
	    },
	    
	    hide : function(op) {
	    	this.element.FPopupBox("hide", op);
	    }
	});

	$.FMessage =  {
		_status : {
			// 窗口打开的类型: alert(ok), confirm(yes no), prompt(ok cancel),
			// mutilinePrompt(ok cancel), YNC(yes no cancel)
			type : "",
			choise : "",
			text : "" // 如果是prompt或者mutiLinePrompt则返回其中的文本内容
		},
		
		// 如果在没有关闭msg的情况下，再次弹出msg，则将msg的环境缓存，再本次msg关闭之后再弹出
		_cmdQueue : [],
		_isShow : false,
		
		_options : {
		},

		// 按钮标示
		OK :			0x0001,
		OKCANCEL :		0x1001,
		YES :			0x0010,
		NO : 			0x0100,
		YESNO :			0x0110,
		CANCEL :		0x1000,
		YESNOCANCEL:	0x1110,
		
		// 图标标示
		INFO : "f-message-icon-info",
		QUESTION : "f-message-icon-question",
		WARNING : "f-message-icon-warning",
		ERROR : "f-message-icon-error",

	    /**
	     * alert消息框
	     * @name FMessage#alert
	     * @function
	     * @param title 消息的标题
	     * @param msg 消息的内容
	     * @param callback 消息关闭的时候的回调方法
	     * @example
	     * <pre>
	     * $.FMessage.alert("Attention", "Everything is ok!");
	     * </pre>
	     */
		alert : function(title, msg, callback) {
			var self = this;
			self.show({
				title : title,
				msg : msg,
				callback : callback,
				buttons : self.OK,
				width : "250px"
			});
		},

	    /**
	     * confirm消息框
	     * @name FMessage#confirm
	     * @function
	     * @param title 消息的标题
	     * @param msg 消息的内容
	     * @param callback 消息关闭的时候的回调方法
	     * @example
	     * function showResult(btn) {
	     *   alert('You clicked the "' + btn +'" button');
	     * };
	     * $.FMessage.confirm('Confirm', 'Are you sure you want to do that?', showResult);
	     */
		confirm : function(title, msg, callback) {
			var self = this;
			self.show({
				title : title,
				msg : msg,
				callback : callback,
				buttons : self.YESNO,
				icon : self.QUESTION,
				width : "280px"
			});
		},

	    /**
	     * 带一个输入框的消息框
	     * @name FMessage#prompt
	     * @function
	     * @param title 消息的标题
	     * @param msg 消息的内容
	     * @param callback 消息关闭的时候的回调方法
	     * @example
	     * function showResultText(btn, text){
	     *   alert('You clicked the "' + btn +'" button and entered the text "' + text + '"');
	     * };
	     * $.FMessage.prompt('Confirm', 'Are you sure you want to do that?', showResultText);
	     */
		prompt : function(title, msg, callback) {
			var self = this;
			self.show({
				title : title,
				msg : msg,
				callback : callback,
				buttons : self.OKCANCEL,
				prompt : true,
				width : "250px"
			});
		},

		/*
		mutiLinePrompt : function(title, msg, callback) {
			
		},
		*/

	    /**
	     * 弹出指定参数的消息框
	     * @name FMessage#show
	     * @function
	     * @param op 消息框的弹出选项，可以有下列属性：
	     * <ol>
	     * <li><b>title:</b> 消息框标题；</li>
	     * <li><b>msg:</b> 消息的内容，对于prompt，就是输入框的提示信息；</li>
	     * <li><b>callback:</b> 输入框在关闭的时候出发的回调方法，非必须；</li>
	     * <li><b>width:</b> 输入框的宽度，默认情况下自动设置合适的宽度，也可以通过设置此属性修改；</li>
	     * <li><b>icon:</b> msg前的图标，目前只支持 $.FMessage.INFO、$.FMessage.QUESTION、
	     * $.FMessage.ERROR、$.FMessage.WARNING；如果没有设置此属性，则不显示图标；</li>
	     * <li><b>prompt:</b> boolean类型，true则表示显示一个带输入框的消息框，此时icon属性无效；</li>
	     * <li><b>buttons:</b> Message显示的按钮
	     * <pre>
	     * $.FMessage.OK 只显示一个"OK"按钮
	     * $.FMessage.OKCANCEL 显示一个"OK"按钮，一个"Cancel"按钮
	     * $.FMessage.YES 只显示一个"Yes"按钮
	     * $.FMessage.NO 只显示一个"No"按钮
	     * $.FMessage.YESNO 只显示一个"Yes"按钮，一个"No"按钮
	     * $.FMessage.CANCEL 只显示一个"Cancel"按钮
	     * $.FMessage.YESNOCANCEL 显示"Yes"、"No"、"Cancel"按钮
	     * 
	     * 这些按钮可以自由组合，比如 $.FMessage.OK|$.FMessage.CANCEL 效果与 $.FMessage.OKCANCEL一致
	     * </pre>
	     * </li>
	     * <li><b>buttonTexts:</b> 配置按钮对应文字
	     * <pre>
	     *  $.FMessage.show({
	     *    title: 'Icon Support',
	     *    msg: 'Here is a message with an icon!',
	     *    buttons:  $.FMessage.OK | $.FMessage.YESNOCANCEL,
	     *    icon: $.FMessage.QUESTION,
	     *    buttonTexts : {
	     *      yes : "I say yes!",
	     *      no : "No more...",
	     *      cancel : "Bye."
	     *    }
	     *  });
	     * </pre>
	     * </li>
	     *  <li><b>closeIcon</b> 是否显示右上角的关闭按钮，false则不显示按钮，默认显示</li>
	     * </ol>
	     * @example
	     */
		show : function(op) {
			var self = this;
			var msgEl = self._getMessageEl(); // 必须在前面调用
			
			if (self._isShow) {
				self._cmdQueue.push(op);
				return;
			}
			self._isShow = true;
			
			// 修改标题
			var title = op.title || "&nbsp;";
			self._getElement("title").html(title);
			// 重置按钮
			var bntCount = self._resetButtons(op.buttons, op.buttonTexts);
			
			// 调整message的大小
			var width = "345px";
			if (op.width) {
				width = op.width;
			} else {
				if (bntCount == 1) {
					width = "250px";
				} else if (bntCount == 2) {
					width = "280px";
				} else if (bntCount >= 3) {
					width = "345px";
				}
			}
			msgEl.width(width);
			
			// 重置body内容
			self._resetBody(op, width);
			
			// 是否有右上角的关闭按钮
			var iconEl = self._getElement("closeIcon");
			if (op.closeIcon === false) {
				iconEl.css("display", "none");
			} else {
				iconEl.css("display", "block");
			}
			
			// 显示message
			self._showMask();
			msgEl.FMessage("show", {
				show : {
					callback : function() {
						$(document).bind("keydown.FMessage", function(e) {
							if (e.which == 27) {
								self._bntClick("cancel");
							}
						});
					}
				},
				hide : {
					callback : function() {
						self._hideMask();
						$(document).unbind("keydown.FMessage");
						self._status.text = self._getElement("promptInput").val();
						if ($.isFunction(op.callback)) {
							op.callback(self._status.choise, self._status.text);
						}
						self._isShow = false;
						self._processQueue(); // 处理在弹出框过程中弹出来的框
					}
				}
			});
		},
		
		_processQueue : function() {
			var self = this;
			var queue = self._cmdQueue;
			if (queue.length == 0) {
				return;
			}
			self.show(queue.shift());
		},
		
		_showMask : function() {
			$("body").doMask("please choose!", {showImg:false});
		},
		
		_hideMask : function() {
			$("body").doUnMask();
		},
		
		hide : function() {
			var self = this;
			var msgEl = self._getMessageEl(); // 必须在前面调用
			msgEl.FMessage("hide");
		},
		
		_resetBody : function(op, width) {
			width = parseInt(width);
			var self = this;
			var tipIcon = op.icon;
			var msg = op.msg || "&nbsp;";
			var contentEl = self._getElement("content");
			var iconContentEl = self._getElement("iconContent");
			var promptEl = self._getElement("prompt");
			if (op.prompt == true) {
				contentEl.css("display", "none");
				promptEl.css("display", "block");
				iconContentEl.css("display", "none");
				self._getElement("promptMsg").html(msg);
				self._getElement("promptInput").val("");
			} else if (tipIcon) { // 有icon的内容
				var icons = [self.INFO, self.QUESTION, self.WARNING, self.ERROR];
				contentEl.css("display", "none");
				promptEl.css("display", "none");
				iconContentEl.css("display", "block");
				// 设置图标
				var iconEl = self._getElement("tipIcon");
				iconEl.removeClass(icons.join(" "));
				iconEl.addClass(tipIcon);
				// 设置内容
				var content = self._getElement("tipContent");
				// add 20121227 hanyin 修复icon无法隐藏的问题：将table布局改为float
				if (!isNaN(width)) {
					content.width(width-20-50);
				}
				// end add 
				content.html(msg);
			} else {
				contentEl.css("display", "block");
				promptEl.css("display", "none");
				iconContentEl.css("display", "none");
				self._getElement("content").html(msg);
			}
		},
		
		_resetButtons : function(buttons, buttonTexts) {
			var self = this;
			buttons = buttons || 0;
			if (buttons == 0) {
				var el = self._getElement("buttonGroup");
				el.css("display", "none");
				return 0;
			} else {
				buttonTexts = buttonTexts || {};
				self._getElement("buttonGroup").css("display", "block");
				var iconCount = 0;
				$.each(["ok", "yes", "no", "cancel"], function(i, name) {
					var el = self._getElement(name+"Bnt-wrapper");
					if (buttons & self[name.toUpperCase()]) {
						if (buttonTexts[name]) {
							self._getElement(name+"Bnt").text(buttonTexts[name]);
						}
						el.parent().show();
						iconCount ++ ;
					} else {
						el.parent().hide();
					}
				});
				return iconCount;
			}
		},
	    
	    _getElement : function(name) {
	    	var op = this._options;
	    	var el = op["_obj" + name + "El"];
	    	if (el) {
	    		return el;
	    	} else {
	    		el = op["_obj" + name + "El"] = $I(op.id + "-" + name);
	    	}
	    	return el;
	    },

		_bntClick : function(choice) {
			var self = this;
			self._status.choise = choice;
			self.hide();
		},
		
		_getMessageEl : function() {
			var self = this;
			var op = self._options;
			if (op.id) {
				return $I(op.id);
			} else {
				var id = $Utils.genId("f-message");
				var html = self._generateHtml({
					id : id,
					title : ("FMessage" + $Utils.UID)
				});
				$("body").append(html);
				$I(id).FMessage({
			    	onBntClick : function(choise) {
			    		self._bntClick(choise);
			    	},
			    	onCloseClick : function() {
			    		self._bntClick("cancel");
			    	}
				});
				op.id = id;
			}
			return $("#"+id);
		},
		
		_generateHtml : function(op) {
			var self = this;
			var id = op.id || $Utils.genId("f-message"); // 0
			var width = op.width || "350px"; // 1
			var title = op.title || "&nbsp;"; // 2
			var bodyContent = self._genContentHtml(id); // 3
			var buttonGroup = self._genButtonGroup(id); // 4
			
			var template = "\
			<div id='{0}' class='f-message f-popupMessage f-widget f-corner-all' style='width:{1};'> \
			  <div id='{0}-header' class='f-popupMessage-header f-form-unselectable f-message-header' onselectstart='return false;'> \
			  	<span id='{0}-title'>{2}</span> \
			    <span id='{0}-closeIcon' class='f-popupMessage-icon f-tool f-tool-close'>&nbsp;</span> \
			  </div> \
			  <div id='{0}-body' class='f-popupMessage-body'>{3}</div> \
			  {4} \
			</div>";
			return $Utils.format(template, id, width, title, bodyContent, buttonGroup);
		},
		
		_genContentHtml : function(id) {
			var template = "";
			// 生成alert的内容div
			template += " \
				<div id='{0}-content' style='margin-bottom:5px;'>&nbsp;</div> \
			";
			// 生成含有图标内容的div
			template += "\
				<div id='{0}-iconContent'>\
					<div id='{0}-tipIcon' style='width:50px;height:35px;float:left;' class='f-message-icon-question'>&nbsp;</div>\
					<div id='{0}-tipContent' style='float:left'>&nbsp;</div>\
					<div class='f-form-clear'></div>\
				</div>";
			// 生成输入框
			template += " \
				<div id='{0}-prompt'> \
					<div id='{0}-promptMsg' style='margin-bottom:3px;'>&nbsp;</div> \
					<input type='text' class='f-textInput f-textField' id='{0}-promptInput' style='margin-bottom:5px;'> \
				</div>";
			
			// 生成prompt内容的div
			// 生成mutiPrompt内容的div
			return $Utils.format(template, id);
		},
		
		_genButtonGroup : function(id) {
			var self = this;
			return  $.FUI.FButtonGroup.generateHtml({
		    	id : id+"-buttonGroup",
				toolspacing : "2",
				style : "margin-top: 5px;",
				items : [
				    $.FUI.FSimpleButton.generateHtml({
				    	text : "OK",
				    	id : id+"-okBnt",
				    	height : "22px",
				    	style : "margin: 0px 3px"
				    }),
				    $.FUI.FSimpleButton.generateHtml({
				    	text : "Yes",
					    id : id+"-yesBnt",
				    	height : "22px",
				    	style : "margin: 0px 3px"
				    }),
				    $.FUI.FSimpleButton.generateHtml({
				    	text : "No",
					    id : id+"-noBnt",
				    	height : "22px",
				    	style : "margin: 0px 3px"
				    }),
				    $.FUI.FSimpleButton.generateHtml({
				    	text : "Cancel",
					    id : id+"-cancelBnt",
				    	height : "22px",
				    	style : "margin: 0px 3px"
				    })
				 ]
			});
		}
	};
})(jQuery);
