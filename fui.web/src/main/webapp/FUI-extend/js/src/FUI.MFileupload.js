/**
 * @name FMFileUpload
 * @class <b>多文件上传组件</b><br/><br/>
 * <b>使用场景：</b><br/>
 * <ol>
 * 	 提供支持多文档，有上传进度的上传组件
 * </ol>
 * <b>功能描述：</b><br/>
 * <ol>
 *      <li>开发者可以设定文件上传的大小</li>
 *      <li>开发者可以设定文件上传的类型，类型可以是一种，也可以是多种</li>
 *      <li>存储的接收地址可以由用户设定</li>
 *      <li>内置进度条展示文件上传进度</li>
 *      <li>用户可以监听选中，上传成功，上传失败事件</li>
 *      <li>上传的图标可以由用户设定</li>
 * </ol>
 *
 * <b>示例：</b><br/>
 *
 *
 */

/**@lends FMFileUpload# */

/**
 * 标识(仅标签使用)
 * @name FMFileUpload#<b>id</b>
 * @type String
 * @default null
 * @example
 * 无
 */

/**
 * 是否隐藏(仅标签使用)
 * @name FMFileUpload#<b>visible</b>
 * @type boolean
 * @default 随机生成
 * @example
 * 无
 */

/**
 * 上传文件。如果不设置index参数则上传队列里面的所有文件
 * @name FMFileUpload#name
 * @function
 * @param index 文件在上传队列中的索引，从0开始
 * @example
 * $('#file_upload').FMFileUpload('upload'); // 上传队列中的所有文件
 * $('#file_upload').FMFileUpload('upload',1); // 上传队列中的第2个文件
 */

            /**
             * 上传文件。如果不设置index参数则上传队列里面的所有文件
             * @name FMFileUpload#upload
             * @function
             * @param index 文件在上传队列中的索引，从0开始
             * @example
             * $('#file_upload').FMFileUpload('upload'); // 上传队列中的所有文件
             * $('#file_upload').FMFileUpload('upload',1); // 上传队列中的第2个文件
             */

            /**
             * 取消上传文件。如果不设置index参数则取消队列里面的所有文件
             * @name FMFileUpload#cancel
             * @function
             * @param index 文件在上传队列中的索引，从0开始
             * @example
             * $('#file_upload').FMFileUpload('cancel'); // 取消上传队列中的所有文件
             * $('#file_upload').FMFileUpload('cancel',1); // 取消上传队列中的第2个文件
             */

            /**
             * 设置上传到服务端的附加数据。使用这个属性的时候必须把method设置为'GET'
             * @default empty object
             * @type Object
             * @name FMFileUpload#params
             * @example
             * $('#file_upload').FMFileUpload({method:'GET', params : {'name':'FUI','age':'5'}});
             */
         
            /**
             * 设置上传按钮的高度
             * @default 30
             * @name FMFileUpload#height
             * @type Number
             * @example
             * $('#file_upload').FMFileUpload({height : 50});
             */

            /**
             * 设置上传按钮的宽度
             * @default 120
             * @name FMFileUpload#width
             * @type Number
             * @example
             * $('#file_upload').FMFileUpload({width : 150});
             */
  
            /**
             * 上传按钮的文字
             * @default '选择文件'
             * @type String
             * @name FMFileUpload#buttonText
             * @example
             * $('#file_upload').FMFileUpload({buttonText: '选择图片'});
             */


            /**
             * 上传按钮的背景图片
             * @default null(swf内置图片)
             * @type String
             * @name FMFileUpload#buttonImg
             * @example
             * $('#file_upload').FMFileUpload({buttonImg: 'btn.jpg'});
             */


 
            /**
             * 文件上传的表单提交方式。
             * @default 'POST'
             * @type String
             * @name FMFileUpload#method
             * @example
             * $('#file_upload').FMFileUpload({method: 'GET'});
             */

            /**
             * 批量上传文件数量的最大限制
             * @default 999
             * @name FMFileUpload#queueSizeLimit
             * @type Number
             * @example
             * $('#file_upload').FMFileUpload({queueSizeLimit : 5});
             */

            /**
             * 文件上传完成后是否自动移除上传的状态提示框。如果设置false则文件上传完后需要点击提示框的关闭按钮进行关闭。
             * @default true
             * @name FMFileUpload#removeCompleted
             * @type Boolean
             * @example
             * $('#file_upload').FMFileUpload({removeCompleted : false});
             */
 
            /**
             * 上传文件的类型限制,这个属性必须和fileDesc属性一起使用。
             * @default '*.*'
             * @name FMFileUpload#fileExt
             * @type String
             * @example
             * $('#file_upload').FMFileUpload({fileExt : '*.jpg;*.png;*.gif',fileDesc:'Image Files'});
             */

            /**
             * 在选择文件的弹出窗口中“文件类型”下拉框中显示的文字。
             * @default null
             * @type String
             * @name FMFileUpload#fileDesc
             * @example
             * $('#file_upload').FMFileUpload({fileExt : '*.jpg;*.png;*.gif',fileDesc:'Image Files'});
             */

            /**
             * 上传文件的最大限制
             * @default null(无大小限制)
             * @name FMFileUpload#sizeLimit
             * @type Number
             * @example
             * $('#file_upload').FMFileUpload({sizeLimit : 1024});
             */

            /**
             * 选择上传文件后触发。
             * 返回的fileObj对象封装了文件的信息，包含以下属性：
             * <ol>
             * 	<li>name：文件名</li>
             * 	<li>size：文件大小</li>
             * 	<li>creationDate：文件创建时间</li>
             * 	<li>modificationDate：文件最后修改时间</li>
             * 	<li>type：文件类型</li>
             * </ol>
             * @event
             * @type Function
             * @default emptyFn
             * @param event,ID,fileObj
             * @name FMFileUpload#onSelect
             * @example
             * $('#file_upload').FMFileUpload({onSelect:function(event,ID,fileObj){alert('你选择了文件：'+fileObj.name);}});
             */

            /**
             * 批量上传的文件数量超过限制后触发
             * @event
             * @type Function
             * @default emptyFn
             * @param event,queueSizeLimit
             * @name FMFileUpload#onQueueFull
             * @example
             * $('#file_upload').FMFileUpload({onSelect:function(event,queueSizeLimit){alert('批量上传文件的数量不能超过：'+queueSizeLimit);}});
             */

            /**
             * 选择上传文件后触发。
             * 返回的fileObj对象封装了文件的信息，包含以下属性：
             * <ol>
             * 	<li>name：文件名</li>
             * 	<li>size：文件大小</li>
             * 	<li>creationDate：文件创建时间</li>
             * 	<li>modificationDate：文件最后修改时间</li>
             * 	<li>type：文件类型</li>
             * </ol>
             * 返回的data对象封装了文件上传的相关信息，包含以下属性：
             * <ol>
             * 	<li>fileCount：文件上传队列中剩余文件的数量</li>
             * 	<li>speed：文件上传的平均速度 KB/s</li>
             * </ol>
             * @event
             * @type Function
             * @default emptyFn
             * @param event,ID,fileObj,data
             * @name FMFileUpload#onCancel
             * @example
             * $('#file_upload').FMFileUpload({onCalcel:function(event,ID,fileObj,data){alert('取消上传：'+fileObj.name);}});
             */
 
            /**
             * 文件上传出错后触发。
             * 返回的fileObj对象封装了文件的信息，包含以下属性：
             * <ol>
             * 	<li>name：文件名</li>
             * 	<li>size：文件大小</li>
             * 	<li>creationDate：文件创建时间</li>
             * 	<li>modificationDate：文件最后修改时间</li>
             * 	<li>type：文件类型</li>
             * </ol>
             * 返回的errorObj对象封装了返回的出错信息，包含以下属性：
             * <ol>
             * 	<li>type：'HTTP'或'IO'或'Security'</li>
             * 	<li>info：返回的错误信息描述</li>
             * </ol>
             * @event
             * @type Function
             * @default emptyFn
             * @param event,ID,fileObj,errorObj
             * @name FMFileUpload#onError
             * @example
             * $('#file_upload').FMFileUpload({onError:function(event,ID,fileObj,errorObj){alert('文件'+fileObj.name+'上传失败。错误类型：'+errorObj.type+'。原因：'+errorObj.info);}});
             */

            /**
             * 每次更新文件的上传进度后触发。
             * 返回的fileObj对象封装了文件的信息，包含以下属性：
             * <ol>
             * 	<li>name：文件名</li>
             * 	<li>size：文件大小</li>
             * 	<li>creationDate：文件创建时间</li>
             * 	<li>modificationDate：文件最后修改时间</li>
             * 	<li>type：文件类型</li>
             * </ol>
             * 返回的data对象封装了文件上传的相关信息，包含以下属性：
             * <ol>
             * 	<li>fileCount：文件上传队列中剩余文件的数量</li>
             * 	<li>speed：文件上传的平均速度 KB/s</li>
             * </ol>
             * @event
             * @type Function
             * @default emptyFn
             * @param event,ID,fileObj,data
             * @name FMFileUpload#onProgress
             * @example
             * $('#file_upload').FMFileUpload({onProgress:function(event,ID,fileObj,data){alert(fileObj.name+'上传平均速度：'+data.speed);}});
             */

            /**
             * 每个文件完成上传后触发。
             * 返回的response参数表示服务端返回的内容。
             * 返回的fileObj对象封装了文件的信息，包含以下属性：
             * <ol>
             * 	<li>name：文件名</li>
             * 	<li>size：文件大小</li>
             * 	<li>creationDate：文件创建时间</li>
             * 	<li>modificationDate：文件最后修改时间</li>
             * 	<li>type：文件类型</li>
             * </ol>
             * 返回的data对象封装了文件上传的相关信息，包含以下属性：
             * <ol>
             * 	<li>fileCount：文件上传队列中剩余文件的数量</li>
             * 	<li>speed：文件上传的平均速度 KB/s</li>
             * </ol>
             * @event
             * @type Function
             * @default emptyFn
             * @param event,ID,fileObj,response,data
             * @name FMFileUpload#onComplete
             * @example
             * $('#file_upload').FMFileUpload({onComplete:function(event,ID,fileObj,response,data){alert(fileObj.name+'上传完成');}});
             */

            /**
             * 所有文件上传完后触发。
             * 返回的data对象封装了文件上传的相关信息，包含以下属性：
             * <ol>
             * 	<li>fileCount：文件上传队列中剩余文件的数量</li>
             * 	<li>speed：文件上传的平均速度 KB/s</li>
             * </ol>
             * @event
             * @type Function
             * @default emptyFn
             * @param event,data
             * @name FMFileUpload#onAllComplete
             * @example
             * $('#file_upload').FMFileUpload({onAllComplete:function(event,data){alert('所有文件上传完毕');}});
             */
 