(function($) {
    /**
     *-------------------------- ajax 组件相关提示信息的国际化 START
     */

//ajax 自定义的错误处理函数
$.FUI.FAjax._errorHandlerMap = {
        "1001" : function(result) {
            alert("function处理：1001错误信息");
        },
        "1002" : "字符串处理：1002错误信息"
    }

})(jQuery);