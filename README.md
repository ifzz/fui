FUI
===

一组用来构建适用于低配置低版本浏览器下的WEB UI组件库，虽然简单但更加快速!<br>

  FUI提供一组JSP标签库，使用JQuery作为Javascript核心库（目前使用JQuery1.7.2）；<br>
  FUI组件对原生HTML组件功能进行了扩充和替代，如表单组件、combo替代select、message替代alert等；<br>
  FUI组件对性能慢的组件进行了替换、封装，如grid，tree等；<br>
  FUI组件样式统一风格（EXT UI样式）；<br>
  FUI组件支持的浏览器（IE6,IE7,IE8,Chrome）；<br>
  FUI目前已经提供了JSP的标签库和freemark的标签库<br>

http://rdc.hundsun.com:9032/fui/
### FUI 工程构建方式
FUI采用maven进行工程管理。
FUI 模块说明
---
### fui.core
fui的核心处理包，包含环境启动、请求处理相关的内容。
### fui.template
fui组件的模板处理包，包含fui的组件渲染时所需的模板处理功能。
### fui.template.jsp
fui的jsp tag方式使用支持包。
### fui.web
fui的静态资源文件和模板资源文件，包含js\css\img\ftl等等。

FUI目前支持的组件清单
---
![组件](http://rdc.hundsun.com:9032/fui/resource/images/fui.png)

### 表单组件
表单（FForm）<br/>
文本输入（FTextField）<br/>
数字输入（FNumberField）<br/>
下拉输入（FCombo）<br/>
目标选择（FTargetSelect）<br/>
日历（FCalendar）<br/>
### 按钮与菜单
按钮（FButton）<br/>
菜单（FMenu）<br/>
工具栏（FToolbar）<br/>
按钮组（FButtonGroup）<br/>
选择框组（FCheckboxGroup）<br/>
### 窗口
弹出窗口（FWin）<br/>
消息框（FMessage）<br/>
### 辅助
验证（FValidate）<br/>
异步交互（FAjax）<br/>
### 数据展示
表格（FGrid）<br/>
树（FTree）<br/>
### 容器
抽屉（FAccordion）<br/>
标签页（FTabs）<br/>
控件集（FFieldset）<br/>

