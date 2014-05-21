/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Validate.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FComboGrid组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员             修改说明
 * 2013-03-15   qudc                修改options.showErrors 函数，实现errorModel模式为qtip时，第二次提示错误信息报js错误的问题。
 * 2013-03-15   qudc                修改options.showErrors 函数，实现errorModel模式为qtip时，第一次校验失败（例如必输项没有输入内容），校验成功以后，鼠标移上去，原先错误信息仍然会显示。现在心中valid属相标志，获取组件校验是否成功，如果成功，则不做提示。
 */
/**
 * @name FValidate
 * @class 
 * 输入验证，可以方便地对表单进行校验.指导用户输入的准确性，当用户输入不符合业务规则时给予提示，并影响表单的提交。此组件在jquery.validate的基础上
 * 做了必要扩展：支持含有隐藏域的FUI的表单组件校验；支持类似ext的qtip的功能等。
 */

/**@lends FValidate# */







/**
 * 指定校验成功没有任何错误后加到元素的class名称<br/>
 * @name FValidate#validClass
 * @type String
 * @default 'valid'
 * @example
 * $(".selector").FValidate({
 *      validClass: "success"
 *   })
 */

/**
 * 指定校验成功没有任何错误后加到提示元素上面的样式名称<br/>
 * 和validClass的区别是它只加在提示元素上面，而不对校验的对象做任何变动。
 * @name FValidate#success
 * @type String
 * @default 无
 * @example
 * $(".selector").FValidate({
 *      success: "valid"
 *   })
 */





/**
 * 获得焦点的时候是否清除错误提示，这种清除是针对所有元素的，<br/>
 * 如果设置为true，则必须将focusInvalid设置为false，否则将没有校验效果。
 * @name FValidate#focusCleanup
 * @type Boolean
 * @default false
 * @example
 * $(".selector").FValidate({
 *      focusInvalid: false, //必须设置
 *      focusCleanup: true
 *   })
 */


/**
 * 在blur事件发生时是否进行校验，如果没有输入任何值，则将忽略校验。
 * @name FValidate#onfocusout
 * @type Boolean
 * @default true
 * @example
 * $(".selector").FValidate({
 *      onfocusout: false
 *   })
 */

/**
 * 在keyup事件发生时是否进行校验。
 * @name FValidate#onkeyup
 * @type Boolean
 * @default true
 * @example
 * $(".selector").FValidate({
 *      onkeyup: false
 *   })
 */




/**
 * 定制错误信息显示的回调方法，用于自定义错误提示格式。该方法有两个参数，第一个参数是错误信息的元素，第二个是触发校验错误的源元素。FCombo组件和FNumberField组件第二个参数为隐藏域元素。
 * @name FValidate#errorPlacement
 * @type Function
 * @default 无
 * @example
 * $("#myform").FValidate({
 *     errorPlacement: function(error, element) {
 *        // 用户自定义操作
 *        error.appendTo( element.parent("td").next("td") );
 *      }
 *    })
 */


/**
 * 定制校验通过后表单提交前的回调方法，用来替换默认提交，一般是Ajax提交方式需要使用到。
 * @type Function
 * @name FValidate#submitHandler
 * @param form 当前表单对象
 * @example
 * $(".selector").FValidate({
 *      submitHandler: function(form) {
 *       $(form).ajaxSubmit(); //校验通过之后调用ajaxSubmit提交表单
 *      }
 *   })
 */




/**
 * 检查表单是否通过校验
 * @name FValidate#valid
 * @function
 * @returns Boolean
 * @example
 *   $("#myform").FValidate();
 *   $("a.check").click(function() {
 *     alert("Valid: " + $("#myform").valid());
 *     return false;
 *   });
 */



/**
 * 触发表单校验
 * @name FValidate#form
 * @function
 * @returns Boolean
 * @example
 *  $("#myform").FValidate().form()
 */

/**
 * 校验选中的element
 * @name FValidate#element
 * @param element
 * @function
 * @returns Boolean
 * @example
 *  $("#myform").FValidate().element( "#myselect" );
 */

/**
 * 重置表单，调用此方法将去掉所有提示信息
 * @name FValidate#resetForm
 * @function
 * @returns 无
 * @example
 *  var validator = $("#myform").FValidate();
 *  validator.resetForm();
 */

/**
 *  添加并显示提示信息,其中示例中的firstname和firstname1为form表单下面的一个表单组件的name属性值。
 * @name FValidate#showErrors
 * @function
 * @param Object
 * @returns 无
 * @example
 * var validator = $("#myform").FValidate();
 * validator.showErrors({"firstname": "请重新选择！",'firstname1':'该字段输入信息有错误！'});
 */

/**
 *  统计没有通过校验的元素个数
 * @name FValidate#numberOfInvalids
 * @function
 * @returns Integer
 * @example
 * var validator = $("#myform").FValidate();
 * return validator.numberOfInvalids();
 */

/**
 * 针对选中的元素，动态添加删除校验规则的方法，有rules( "add", rules ) 和rules( "remove", [rules] )两种
 * @name FValidate#rules
 * @function
 * @returns rules Object{Options}
 * @example
 *  $('#username').rules('add',{
 *       minlength:5,
 *       messages: {
 *           minlength: jQuery.format("Please, at least {0} characters are necessary")
 *       }
 *   });
 *
 * $("#myinput").rules("remove", "min max"); //remove可以配置多个rule，空格隔开
 */

;
(function($) {
    $.extend($.fn, {
        /**
         * 创建表单的校验对象
         * @name FValidate#FValidate
         * @function
         * @returns 当前form的校验对象
         * @example
         *   $("#myform").FValidate({
         *      //options
         *   });
         */

        FValidate : function(options) {

            // if nothing is selected, return nothing; can't chain anyway
            if (!this.length) {
                options && options.debug && window.console && console.warn("nothing selected, can't validate, returning nothing");

                return;
            }

            // check if a validator for this form was already created
            var validator = $.data(this[0], 'validator');
            if (validator) {
                return validator;
            }

            // Add novalidate tag if HTML5.
            this.attr('novalidate', 'novalidate');
            //特殊处理onkeyup属性,如果用户设置true，则使用默认的onkeyup函数。即只接收false属性。
            if (options.onkeyup) {
                delete options.onkeyup;
            }
            //特殊处理onclick属性，如果用户设置true，则使用默认的onclick函数。即只接收false属性。
            if (options.onclick) {
                delete options.onclick;
            }
            //特殊处理onfocusout属性，如果用户设置true，则使用默认的onfocusout函数。即只接收false属性。
            if (options.onfocusout) {
                delete options.onfocusout;
            }
            //特殊处理onsubmit属性，如果用户设置true，则使用默认的onsubmit函数。即只接收false属性。
            if (options.onsubmit) {
                delete options.onsubmit;
            }
            /**
             * 如果用户设置了errorModel，且值为qtip或者under，则执行系统默认制定的方式。
             * 否则，如果用户自己制定显示方式，设置errorPlacement属性，则按照用户自己设置的方式进行。
             */
            if (!options.errorPlacement) {
                if ("qtip" === options.errorModel) {
                    options.errorMsgClass = "f-validate-errorMsg";
                    options.errorElement = "label";
                    options.errorPlacement = function(error, element) {
                        if (error.html()) {
                            var el = $(element);
                            //var error = error.wrap("<span id='fui-validate-qtip-msg' class='f-validate-errorMsg' style='display:none;' />").parent();

                            var qtipMsgEl = $('#fui-validate-qtip-msg');
                            if (!qtipMsgEl.length) {
                                $('body').append("<span id='fui-validate-qtip-msg' class='f-validate-errorMsg' style='display:none;' />");
                            }


                            var errorMsgTarget = el.attr("errorMsgTarget");
                            //例如combo number 组件有两个input
                            if (errorMsgTarget) {
                                if ("parent" == errorMsgTarget) {
                                    //制定节点查找其兄弟节点
                                    var parent = el.parent();
                                    parent.attr('f-validate-qtip-msg', error.html());
                                } else {
                                    //通过id来查找
                                    errorMsgTarget = $.trim(errorMsgTarget);
                                    if (errorMsgTarget.indexOf("#") !== 0) {
                                        errorMsgTarget = "#" + errorMsgTarget;
                                    }
                                    var parent = $(errorMsgTarget);
                                    parent.attr('f-validate-qtip-msg', error.html());
                                }
                            } else {
                                el.attr('f-validate-qtip-msg', error.html());
                            }
                        }
                    };
                    options.showErrors = function(errorMap, errorList) {
                        if (errorList && errorList.length > 0) {
                            $.each(errorList, function(index, obj) {
                                var msg = this.message;
                                var el = $(obj.element);
                                var errorMsgTarget = el.attr("errorMsgTarget");
                                //绑定一个次事件
                                if (el.attr("hasbindmouseevent") !== "true") {
                                    if (errorMsgTarget) {
                                        var parentEl = null;
                                        if ("parent" == errorMsgTarget) {
                                            //指定父节点查找其兄弟节点
                                            parentEl = el.parent();
                                        } else {
                                            //通过id来查找
                                            errorMsgTarget = $.trim(errorMsgTarget);
                                            if (errorMsgTarget.indexOf("#") !== 0) {
                                                errorMsgTarget = "#" + errorMsgTarget;
                                            }
                                            parentEl = $(errorMsgTarget);
                                        }
                                        //判断是否有错误提示消息
                                        //if (msgEl.html().length > 0 && msgEl.attr("class").length > 0 && msgEl.find("label").html().length > 0) {
                                        parentEl.bind('mouseover',
                                                function(e) {
                                                    var qtipMsgEl = $('#fui-validate-qtip-msg');
                                                    var el = $(this);
                                                    var msg = el.attr('f-validate-qtip-msg');
                                                    var valid =  el.attr('valid');
                                                    if (valid !== 'true' &&qtipMsgEl.length) {
                                                        qtipMsgEl.html(msg);
                                                        qtipMsgEl.css('display', 'inline').css({'top':e.pageY + 10 , 'left':e.pageX + 5});
                                                    }
                                                }).bind('mouseout',
                                                function() {
                                                    var qtipMsgEl = $('#fui-validate-qtip-msg');
                                                    if (qtipMsgEl.length) {
                                                        qtipMsgEl.css('display', 'none');
                                                    }
                                                });

                                    } else {
                                        //直接綁定
                                        el.bind('mouseover',
                                                function(e) {
                                                    var qtipMsgEl = $('#fui-validate-qtip-msg');
                                                    var el = $(this);
                                                    var msg = el.attr('f-validate-qtip-msg');
                                                    var valid =  el.attr('valid');
                                                     if (valid !== 'true' &&qtipMsgEl.length) {
                                                        qtipMsgEl.html(msg);
                                                        qtipMsgEl.css('display', 'inline').css({'top':e.pageY + 10 , 'left':e.pageX + 5});
                                                    }
                                                }).bind('mouseout',
                                                function() {
                                                    var qtipMsgEl = $('#fui-validate-qtip-msg');
                                                    if (qtipMsgEl.length) {
                                                        qtipMsgEl.css('display', 'none');
                                                    }
                                                });
                                    }
                                    el.attr("hasbindmouseevent", true);
                                }
                            });
                        } else {
                            $(this.currentElements).parents().map(function() {
                                if (this.tagName.toLowerCase() == 'td') {
                                    //$(this).children().eq(1).hide();
                                    $(this).children().eq(0).removeClass("error-border");
                                } else {
                                    $(this).removeClass("error-border");
                                }
                                $(this).children().eq(0).removeClass("x-form-invalid");
                            });
                        }
                        this.defaultShowErrors();
                    }
                } else {
                    //用户没有设置errorPlacement，errorModel使用默认值：under
                    options.errorPlacement = function(error, element) {
                        if (error.html()) {
                            var el = $(element);
                            var errorMsgTarget = el.attr("errorMsgTarget");
                            //例如combo number 组件有两个input
                            if (errorMsgTarget) {
                                if ("parent" == errorMsgTarget) {
                                    //制定节点查找其兄弟节点
                                    var parent = el.parent();
                                    error.insertAfter(parent);
                                    error.css('display', 'none');

                                } else {
                                    //通过id来查找
                                    errorMsgTarget = $.trim(errorMsgTarget);
                                    if (errorMsgTarget.indexOf("#") !== 0) {
                                        errorMsgTarget = "#" + errorMsgTarget;
                                    }
                                    var parent = $(errorMsgTarget);
                                    error.insertAfter(parent);
                                    error.css('display', 'none');
                                }
                            } else {
                                //纯的html元素，例如input
                                error.insertAfter(el);
                                error.css('display', 'none');
                            }
                        }
                    };
                }

            }


            validator = new $.fvalidator(options, this[0]);
            $.data(this[0], 'validator', validator);

            if (validator.settings.onsubmit) {

                //var inputsAndButtons = this.find("input, button");
                var inputs = this.find('input');
                var buttons = this.find('button');

                var inputsAndButtons = inputs.add(buttons);

                // allow suppresing validation by adding a cancel class to the submit button
                inputsAndButtons.filter(".cancel").click(function () {
                    validator.cancelSubmit = true;
                });

                // when a submitHandler is used, capture the submitting button
                if (validator.settings.submitHandler) {
                    inputsAndButtons.filter(":submit").click(function () {
                        validator.submitButton = this;
                    });
                }

                // validate the form on submit
                this.submit(function(event) {
                    if (validator.settings.debug)
                    // prevent form submit to be able to see console output
                        event.preventDefault();

                    function handle() {
                        if (validator.settings.submitHandler) {
                            if (validator.submitButton) {
                                // insert a hidden input as a replacement for the missing submit button
                                var hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
                            }
                            validator.settings.submitHandler.call(validator, validator.currentForm);
                            if (validator.submitButton) {
                                // and clean up afterwards; thanks to no-block-scope, hidden can be referenced
                                hidden.remove();
                            }
                            return false;
                        }
                        return true;
                    }

                    // prevent submit for invalid forms or custom submit handlers
                    if (validator.cancelSubmit) {
                        validator.cancelSubmit = false;
                        return handle();
                    }
                    if (validator.form()) {
                        if (validator.pendingRequest) {
                            validator.formSubmitted = true;
                            return false;
                        }
                        return handle();
                    } else {
                        validator.focusInvalid();
                        return false;
                    }
                });
            }
            //validator.checkForm();
            return validator;
        }

        //校验单个控件
        ,isValidate : function(formId) {
            if (formId) {
                var form = $I(formId);
                if (form.length > 0) {
                    var valid = false;
                    var validator = form.validate();
                    valid = validator.element(this);
                    return valid;
                } else {
                    return true;
                }
            } else {
                var valid = false;
                var element = this[0];
                if (element.form) {
                    var validator = $.data(element.form, 'validator');
                    if (validator) {
                        valid = validator.element(this);
                        return valid;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }

    });

    $.fvalidator = function(options, form) {
        this.settings = $.extend(true, {}, $.fvalidator.defaults, options);
        this.currentForm = form;
        this.init();
    }


    $.extend($.fvalidator, {
        prototype:$.validator.prototype,
        defaults: {
            /**
             * 键值对的校验错误信息.键是元素的name属性，值是错误信息的组合对象。<br/>
             * @name FValidate#messages
             * @type JSON
             * @default {}
             * @example
             * $("#formId").FValidate({
             *  rules: {
             *    name: {
             *      required: true,
             *      minlength: 2
             *    }
             *  },
             *  messages: {
             *    name: {
             *      required: "We need your email address to contact you",
             *      minlength: jQuery.format("At least {0} characters required!")
             *      //这里的{0}就是minlength定义的2
             *    }
             *  }
             *})
             */
            messages: {},
            /**
             * 错误消息分组,如果没有设置errorPlacement，则分组内的元素出现错误时只在第一个元素后面显示错误消息，
             * 如果设置了errorPlacement，则可以在errorPlacement回调中定义显示位置 <br/>
             * @name FValidate#groups
             * @type JSON
             * @default {}
             * @example
             * $("#myform").FValidate({
             *     groups: {
             *       username: "fname lname"
             *     },
             *     errorPlacement: function(error, element) {
             *        if (element.attr("name") == "fname"
             *                    || element.attr("name") == "lname" ){
             *          error.insertAfter("#lastname");
             *        }else{
             *          error.insertAfter(element);
             *        }
             *      },
             *    }) //将fname和lname的错误信息统一显示在lastname元素后面
             */
            groups: {},
            /**
             * 键值对的校验规则.键是元素的name属性，值是校验规则的组合对象，每一个规则都可以绑定一个依赖对象，<br/>
             * 通过depends设定，只有依赖对象成立才会执行验证<br/>
             * $(".selector").FValidate({
             *  rules: {
             *    contact: { //其中 contact为组件的name属性值
             *      required: true,
             *      maxlength:10
             *    }
             *  }
             *})
             */
            rules: {},
            /**
             * 指定错误提示标签的class名称，此class也将添加在校验的元素上面。<br/>
             * 说明：错误提示的样式包括输入框的样式以及提示信息的样式。该属性一般情况下不需要设置，使用默认值即可。除非用户自定义错误提示的样式。该样式具体制定详见demo。
             * @name FValidate#errorClass
             * @type String
             * @default 'error'
             * @example
             * $(".selector").FValidate({
             *      errorClass: "invalid"
             *   })
             */
            errorClass: "f-validate-error",
            validClass: "valid",
            /**
             * 指定错误信息的html标签名称<br/>
             * 说明：该属性只有当用户设置errorPlacement属性时才起作用。
             * @name FValidate#errorElement
             * @type String
             * @default 'div'
             * @example
             * $(".selector").FValidate({
             *      errorElement: "em"
             *   })
             */
            errorElement: "div",
            /**
             * 错误信息提示的模式。默认模式为“under”。有两种模式，“under”模式为：错误信息显示在输入框的下方。“qtip”模式为：错误信息悬浮显示。
             * @name  FValidate#errorModel
             * @type String
             * @default 'under'
             * @example
             * $(".selector").FValidate({
             *      errorModel: "qtip"
             *   })
             */
            errorModel : "under",
            /**
             * 校验错误的时候是否将聚焦元素。该属性如果为true，校验出错时会将光标聚焦到错误处。<br/>
             * 说明:使用该属性时，提交按钮类型必须是"submit"类型。
             * @name FValidate#focusInvalid
             * @type Boolean
             * @default true
             * @example
             * $(".selector").FValidate({
             *      focusInvalid: false
             *   })
             */
            focusInvalid: true,
            /**
             * 包含错误提示信息的容器，根据校验结果隐藏或者显示错误容器。其中该错误提示信息是由用户在页面设计的时候填写的内容。<br />
             * 与 errorLabelContainer 属性的区别是这个属性提示的错误信息是静态的，即为用户在页面设计时填写的内容。
             * @name FValidate#errorContainer
             * @type Selector
             * @default $( [] )
             * @example
             * $("#myform").FValidate({
             *      errorContainer: "#messageBox1, #messageBox2"
             *      //可以配置多个容器，这里的messageBox2元素没有被包装处理，只是错误发生的时候显示和隐藏此元素。
             *   })
             */
            errorContainer: $([]),
            /**
             * 设置统一存放错误信息的容器，根据校验结果隐藏或者显示错误容器。校验框架会将所有的错误提示信息存放到该容器下。
             * @name FValidate#errorLabelContainer
             * @type Selector
             * @default $( [] )
             * @example
             * $("#myform").FValidate({
             *      errorLabelContainer: "#messageBox1 ul"
             *      //messageBox为容器的id
             *   })
             *
             */
            errorLabelContainer: $([]),
            /**
             * 是否在提交时校验表单，如果设置为false，则提交的时候不校验表单，<br/>
             * 但是其它keyup、onblur等事件校验不受影响.
             * @name FValidate#onsubmit
             * @type Boolean
             * @default true
             * @example
             * $(".selector").FValidate({
             *      onsubmit: false
             *   })
             */
            onsubmit: true,
            //修改： ignore: ":hidden",
            /**
             * 校验时忽略指定的元素，可以配置需要校验的元素id和样式名称等jquery识别的选择器。<br/>
             * 说明：该属性值不能为 “：hidden”，否则会导致FCombo、FNumberField组件的校验无效。建议为复杂的选中器，用过不匹配个别标签。
             * @name FValidate#ignore
             * @type String
             * @default null
             * @example
             * $("#myform").FValidate({
             *      ignore: ".ignore"
             *      //此处还可以配置input[type='password']、#id等jquery的选择器
             *   })
             */
            ignore: [],
            ignoreTitle: false,
            onfocusin: function(element, event) {
                var elementEl = $(element);
                var hasprevioussbling = elementEl.attr("hasprevioussbling");
                var hasChecked = elementEl.attr('hasChecked');
                if (!hasChecked) {
                    if (hasprevioussbling == "true") {
                        var prevElement = elementEl.prev()[0];
                        this.check(prevElement);
                    } else {
                        this.check(element);
                    }
                    //this.element(element);
                    elementEl.attr('hasChecked', 'true');
                }
                this.lastActive = element;

                // hide error label and remove error class on focus if enabled
                if (this.settings.focusCleanup && !this.blockFocusCleanup) {
                    this.settings.unhighlight && this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);


                    //如果该输入框为FCombo和FNumberField组件的一部分，那么需要查找其前一节点并根据该节点隐藏错误信息。
                    if (hasprevioussbling === "true") {
                        var prevElement = elementEl.prev()[0];
                        this.addWrapper(this.errorsFor(prevElement)).hide();
                    } else {
                        this.addWrapper(this.errorsFor(element)).hide();
                    }
                }
            },

            onfocusout: function(element, event) {
                var elementEl = $(element);
                if (elementEl.attr("hasprevioussbling") === "true") {
                    // element.previousSibling
                    var prevElement = elementEl.prev()[0];
                    if (!this.checkable(prevElement) && (prevElement.name in this.submitted || !this.optional(prevElement))) {
                        this.element(prevElement);
                    }
                } else if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element))) {
                    this.element(element);
                }
            },

            onkeyup: function(element, event) {
                if (this.keyUpTimeout) {
                    clearTimeout(this.keyUpTimeout);
                }
                _this = this;
                this.keyUpTimeout = setTimeout(function() {
                    var elementEl = $(element);
                    if (elementEl.attr("hasprevioussbling") === "true") {
                        var prevElement = $(element).prev()[0];
                        if (prevElement.name in _this.submitted || prevElement == _this.lastElement) {
                            _this.element(prevElement);
                        }
                    } else {
                        if (element.name in _this.submitted || element == _this.lastElement) {
                            _this.element(element);
                        }
                    }
                }, 300);
            },
            /**
             * 在checkbox和radio的click事件发生后是否进行校验。
             * onclick
             *  Boolean
             *  true
             * $(".selector").FValidate({
             *      onclick: false
             *   })
             */
            onclick: function(element, event) {
                // click on selects, radiobuttons and checkboxes
                if (element.name in this.submitted)
                    this.element(element);
                // or option elements, check parent select in that case
                else if (element.parentNode.name in this.submitted)
                    this.element(element.parentNode);
            },
            highlight: function(element, errorClass, validClass) {
                if (element.type === 'radio') {
                    this.findByName(element.name).addClass(errorClass).removeClass(validClass);
                } else {
                    var el = $(element);
                    var errorValidateTarget = el.attr("errorValidateTarget");
                    var errorMsgTarget = el.attr("errorMsgTarget");
                    if (!errorValidateTarget) {
                        el.addClass(errorClass).removeClass(validClass);
                    } else {
                        if ('next' === errorValidateTarget) {
                            var validateEl = el.next();
                            validateEl.addClass(errorClass).removeClass(validClass);
                        } else {
                            $(errorValidateTarget).addClass(errorClass).removeClass(validClass);
                        }
                    }
                    if('parent' == errorMsgTarget){
                        var parentEl = el.parent();
                        parentEl.attr('valid','false');
                    } else {
                        el.attr('valid','false');
                    }
                }
            },
            unhighlight: function(element, errorClass, validClass) {
                if (element.type === 'radio') {
                    this.findByName(element.name).removeClass(errorClass);
                } else {
                    var el = $(element);
                    var errorValidateTarget = el.attr("errorValidateTarget");
                    var errorMsgTarget = el.attr("errorMsgTarget");
                    if (!errorValidateTarget) {
                        el.removeClass(errorClass).addClass(validClass);
                    } else {
                        if ('next' === errorValidateTarget) {
                            var validateEl = el.next();
                            validateEl.removeClass(errorClass).addClass(validClass);
                        } else {
                            $(errorValidateTarget).removeClass(errorClass).addClass(validClass);
                        }
                    }
                    if('parent' == errorMsgTarget){
                        var parentEl = el.parent();
                        parentEl.attr('valid','true');
                    } else {
                        el.attr('valid','true');
                    }

                }
            }
        }
    });

})(jQuery);
