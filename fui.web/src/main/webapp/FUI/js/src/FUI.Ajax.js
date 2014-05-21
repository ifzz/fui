/* *
 * 版本：1.0.0.1
 * 系统名称: FUI
 * 模块名称: JRES
 * 文件名称: FUI.Ajax.js
 * 作者：qudc
 * 邮箱：qudc@hundsun.com
 * 软件版权: 恒生电子股份有限公司
 * 功能描述：FAjax组件对应的代码。
 * 修改记录:
 * 修改日期      修改人员                     修改说明
 * 2012-11-15   qudc     修改ajax的默认发生模式，默认为”post“方法发送请求。
 * 20130219    hanyin    增加数据模型“jres”和ajax数据模型的完整描述说明
 */

/**
 * @name FAjax
 * @class 
 * 异步交互，提供简化的与后台交互的方法。并为其它组件提供远程交互能力。
 */

/**@lends FAjax# */
(function($, undefined) {

    $.FUI.FAjax = {
        _errorHandlerMap:{},
        _defaultErrorHandler:{},


        /**
         * 统一的AJAX操作接口,如果FAjax设置了_errorHandlerMap或者_defaultErrorHandler，failure回调函数的返回值不為true，则不执行默认的错误处理函数，认为用户自行处理错误处理。<br/>
         * 用户请求不同的数据类型时，需要在data参数中传递_respType参数，_respType参数需要指定需要的数据类型。类型有：list，page等。
         * 另外，还支持的参数有：
         * <ol>
         * <li>_respType : 应答的数据模型，支持list、listsimple、pojo、page、tree和jres，其中数据模型“jres”支持多数据集IDataset；</li>
         * <li>_respMapping : 应答结果字段的映射关系，比如返回的结果集有字段“userId”和“upperId”，但是需要的是“id”和“pid”，
         * 那么可以设置此值为"id=userId,pid=upperId"，每个字段使用英文逗号","分隔，FUI的Servlet会自动做字段转换。</li>
         * </ol>
         * @name FAjax#remote
         * @function
         * @param options FAjax的配置参数，结构是{url:服务,data:{请求参数},success:function(data，textStatus, jqXHR){//returnCode==0的情况},failure:function(data,textStatus, jqXHR){//returnCode为 1或者 -1的情况 },error:function(jqXHR, textStatus, errorThrown){//请求错误时，例如请求超时}}
         * @example
         * $.FAjax.remote({
         *             url:"com.hundsun.user.add",
         *             data:$('#formId').getValues(),
         *          success:function(data,textStatus, jqXHR){
         *              //请求正常，returnCode ==0 时触发
         *           },
         *          failure:function(data,textStatus, jqXHR){
         *               //请求正常，returnCode !=0时触发
         *          },
         *          error : function(jqXHR, textStatus, errorThrown){
         *              //请求失败时错发，例如请求超时。
         *          }
         *          //其他一些参数。
         *          );
         */
        remote:function(options) {
            var UTILS = window['$Utils'];
            var url = options.url;
            var success = options.success;
            var failure = options.failure;
            var ME = this;
            options.success = function(data, textStatus, jqXHR) {
                //ajax执行成功的前提下，如果有returnCode,则说明是JRES服务，那么按照retrunCode是不是为1来执行成功还是会掉函数。
                if (data.returnCode === 1 || data.returnCode === -1) {
                    if (failure) {
                        //判断用户是否退出指定错误号的处理
                        if (true !== failure(data, textStatus, jqXHR)) {
                            return;
                        }
                    }
                    var errorNo = data.errorNo;
                    var errorHandler = ME._errorHandlerMap[data.errorNo];
                    //如果用户有制定对应错误号的处理函数，则调用对应的处理函数
                    if ($.isFunction(errorHandler)) {
                        errorHandler(data, textStatus, jqXHR);
                    } else if ("string" == $.type(errorHandler)) {
                        // 按照默认的方式提示信息
                        data.errorInfo = errorHandler
                        ME._defaultErrorHandler(data);
                    } else {
                        ME._defaultErrorHandler(data);
                    }
                } else {
                    /**
                     * 这里有两种情况：
                     * 1、一种情况是返回值中returnCode为0，表示jres的业务执行成功。
                     * 2、一种情况是返回值中returnCode为undefined，表示非jres的服务
                     */
                    if (success) {
                        success(data, textStatus, jqXHR);
                    }
                }
            };
            if (!options.error) {
                options.error = function(jqXHR, textStatus, errorThrown) {
                    //todo 说明是真正的ajax超时，提示默认的超时信息。
                    alert("ajax超时：" + textStatus);
                }
            }
            //判断是否需要加上上下文路径，规则是，以“/”开头不加，否则加
            if (url.indexOf("/") !== 0) {
                options.url = UTILS.getContextPath() + "/" + url;
            }
            if (!options.dataType) {
                options.dataType = 'json';
            }
            //默认以post的方式发送请求。
            if (!options.type) {
               options.type = 'post';
            }
            $.ajax(options);
        },
        /**
         * 获取应答中的对象，FAjax请求的数据类型需要为pojo和page，在success回调中的data参数为object类型。<br/>
         * 用户请求不同的数据类型时，需要在data参数中传递_respType参数，_respType参数需要指定需要的数据类型。类型有：pojo，page。
         * @name FAjax#getObject
         * @function
         * @param options FAjax的配置参数，结构是{url:服务,data:{请求参数},success:function(data，textStatus, jqXHR){//returnCode==0的情况},failure:function(data,textStatus, jqXHR){//returnCode为 1或者 -1的情况 },error:function(jqXHR, textStatus, errorThrown){//请求错误时，例如请求超时}}
         * @example
         * $.FAjax.getObject({
         *              url:'com.hundusn.user.object.fservice',
         *              data:params,
         *              success:function(data,textStatus, jqXHR){
         *                  //请求正常，returnCode ==0 时触发
         *              },
         *              failure:function(data,textStatus, jqXHR){
         *                  //请求正常，returnCode !=0时触发
         *              },
         *              error : function(jqXHR, textStatus, errorThrown){
         *                  //请求失败时错发，例如请求超时。
         *              });
         */
        getObject:function(options) {
            var UTILS = window['$Utils'];
            if (!options) {
                //todo debug 模式下，提示错误信息。
                return;
            }
            var success = options.success;

            options.success = function(result) {
                if (success) {
                    var object = UTILS.getJRESObject(result);
                    success(object);
                }
            }
            this.remote(options);
        },

        /**
         * 获取应答中的列表对象，FAjax请求的数据类型需要为list、listsimple、tree，在success回调中的data参数为Array类型。<br/>
         * 用户请求不同的数据类型时，需要在data参数中传递_respType参数，_respType参数需要指定需要的数据类型。类型有：list，listsimple，tree。
         * @name FAjax#getList
         * @function
         * @param options FAjax的配置参数，结构是{url:服务,data:{请求参数},success:function(data，textStatus, jqXHR){//returnCode==0的情况},failure:function(data,textStatus, jqXHR){//returnCode为 1或者 -1的情况 },error:function(jqXHR, textStatus, errorThrown){//请求错误时，例如请求超时}}
         * @example
         * $.FAjax.getList({
         *              url:'com.hundusn.user.list.fservice',
         *              data:params,
         *              success:function(data,textStatus, jqXHR){
         *                  //请求正常，returnCode ==0 时触发
         *              },
         *              failure:function(data,textStatus, jqXHR){
         *                  //请求正常，returnCode !=0时触发
         *              },
         *              error : function(jqXHR, textStatus, errorThrown){
         *                  //请求失败时错发，例如请求超时。
         *              }
         *              );
         */
        getList:function(options) {
            var UTILS = window['$Utils'];
            if (!options) {
                //todo debug 模式下，提示错误信息。
                return;
            }
            var success = options.success;

            options.success = function(result) {
                if (success) {
                    var list = UTILS.getJRESList(result);
                    success(list);
                }
            }
            this.remote(options);
        }
    }

})(jQuery);

	