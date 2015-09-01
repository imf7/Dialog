/*!
 * F7 Dialog
 *
 * Copyright (c) 2015 F7
 *
 * Date: 2015-02
 * Revision: v3
 */

// 简洁版
Dialog("test");
// 指定显示网页内的ID
Dialog({"id": "dialod"});
// 自定义显示内容
Dialog({"msg": '<div>test</div> <input data-dialog-close  />'});



// 完整参数
Dialog({
    "id": "dialog",// 浮层ID 必须是唯一值

    "title": "友情提示",// 默认 友情提示，浮层名称

    "msg": '<div>test</div>',// 自定义显示的内容


    "lock": false,// 默认 false 是否锁屏
    "lockColor": "#000",// 默认 #000，锁屏颜色  lock:true下有效
    "lockOpacity": 50,// 默认 50，锁屏透明度  范围0-100
    "lockClose": true,// 默认 true，锁屏的遮罩层是否点击关闭


    "position": "mouse||HTMLElement",// 默认 无参考 传递mouse：参照物为根据鼠标，传递HTMLElement参照物为HTML元素
    "top": "100px",// 默认 无 浮层距窗口顶部距离，position有值时以position为参照物  没有参数请删掉属性保留会出错 【根据参照物定位可使用，仅支持PX单位，设置其他单位无效，%不可使用，数字时默认单位px】
    "right": "100px",// 默认 无 浮层距窗口右侧距离，position有值时以position为参照物  没有参数请删掉属性保留会出错
    "bottom": "100px",// 默认 无 浮层距窗口底部距离，position有值时以position为参照物  没有参数请删掉属性保留会出错
    "left": "100px",// 默认 无 浮层距窗口左侧距离，position有值时以position为参照物  【根据参照物定位可使用，仅支持PX单位，设置其他单位无效，%不可使用，数字时默认单位px】没有参数请删掉属性保留会出错


    "width": "300px",// 默认 无 强行设定浮层宽度   百分比设定，用于响应式设计，具体宽度设置后出现滚动条不能完美展现
    "height": "300px",// 默认 无 强行设定浮层高度   简易实现，暂不推荐使用

    // css3动画，仅支持现代浏览器
    "animation": "LightSpeedIn",// 默认 无 浮层打开动画【无关闭动画】该动画使用CSS3动画类库实现，调用前必须引入CSS3动画样式文件，参数类型案例中有
    "outAnimation": ""  // 默认 无 关闭浮层调用的动画【兼容IE10及以上、现代浏览器】


    "*** fixed": true,// 默认 true 随屏滚动  position下无效【暂不开发，没想好是否真的需要】

    "move": true,// 默认 true 窗口是否可以拖动【有定位属性拖动失效】

    "style": "mydialog",// 默认 mydialog  皮肤自定义

    "time": 2000,// 多少毫秒后自动关闭，无此参数不关闭


    "closeButton": false,// 默认 true  关闭按钮XX 开关

    "showButtons": false,// 默认 false  页脚控制台按钮开关

    "submitButton": "确定",// 默认“确定”， 为false时隐藏  showButtons:true下有效
    "cancelButton": "取消",// 默认“取消”， 为false时隐藏  showButtons:true下有效

    "onReady": function(that) {
        console.log(that.config_title);
    },// 加载完成回调 返回false时阻断执行
    "onClose": function() {},// 关闭按钮回调 返回false时阻断执行
    "onSubmit": function() {},// 确定按钮回调 返回false时阻断执行
    "onCancel": function() {},// 取消按钮回调 返回false时阻断执行
    "onBeforeClose": function() {},// Dialog关闭前回调【不分任何关闭方式】 返回false时阻断执行
    "onComplete": function() {},// Dialog被关闭时都会回调【不分任何关闭方式】 在关闭浮层后才会执行【不接收参数】    

});

// 内部对外方法
var mydialog = new Dialog({});
mydialog.reload();// 重置定位功能，重置大小

mydialog.close();// 关闭浮层【关闭回调方法返回非false时才关闭】
mydialog.remove(); // 直接跳过回到函数检测环节关闭浮层，非特殊情况不要使用
mydialog.submit();// 提交关闭浮层【提交回调方法返回非false时才关闭】
mydialog.cancel();// 取消关闭浮层【取消回调方法返回非false时才关闭】


// 全局关闭接口
Dialog.close('myclose'); // 参数为浮层ID，关闭时检测onClose回调方
Dialog.close();// 关闭所有已打开的Dialog【会检测onClose回调函数是否返回true】
Dialog.close(true);// 强行关闭所有已打开的Dialog，跳过回调函数检测

Esc键可关闭最高层对话框，页面内ID被弹出时，该关闭方式无效 // 关闭时检测onClose回调方法

*** 弹出浮层后将焦点锁定在第一个submit按钮上，以获得回车触发效果。【暂不开发，没想好是否真的需要】