/*!
 * Dialog
 *
 * Copyright (c) 2015 F7
 *
 * Date: 2015-02
 * Edit: 2015-09
 * Revision: v3.1.2
 */

(function(G, D) {

    // 共用方法
    isIE = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined;
    /**
     * 获取ID
     * @param {String||HTMLElement} 节点ID或者节点本身
     */
    function F$(elem) {
        return typeof(elem)=="object" ? elem : document.getElementById(elem);
    };
    /**
     * 设置样式
     * @param {HTMLElement} elem 需要设置的节点
     * @param {Object} prop      CSS属性，键值对象
     */
    function setStyle(elem, prop) {
        if ( !elem ) { return false };
        for (var i in prop) {
            elem.style[i] = prop[i];
        }
    };
    /**
     * 获取节点css属性
     * @param  {HTMLElement} elem 需要获取的节点
     * @param  {String} name      css属性
     * @return {String}           属性值
     */
    function getStyle(elem, name) { // 获取CSS属性函数
        if (elem.style[name] != '') return elem.style[name];
        if (!!window.ActiveXObject) return elem.currentStyle[name];
        return document.defaultView.getComputedStyle(elem, "").getPropertyValue(name.replace(/([A-Z])/g, "-$1").toLowerCase());
    };

    /**
     * 获取鼠标光标相对于整个页面的位置
     * @return {String} 值
     */
    function getX(e) {
        e = e || window.event;
        var _left = document.documentElement.scrollLeft || document.body.scrollLeft;
        return e.pageX || e.clientX + _left;
    };

    function getY(e) {
        e = e || window.event;
        var _top = document.documentElement.scrollTop || document.body.scrollTop;
        return e.pageY || e.clientY + _top;
    };

    /**
     * 获取class命名的节点
     * @param  {String} className CSS命名
     * @param  {String} tag       标签名称/去全部标签时用 *
     * @param  {HTMLElement} parent    查找的范围，通常为包含内容的父节点
     * @return {Array}           返回筛选节点的数组集合
     */
    function getElementsByClassName(className, tag, parent) {
        parent = parent || document;
        tag = tag || "*";
        var allTags = (tag === "*" && parent.all) ? parent.all : parent.getElementsByTagName(tag);
        var classElems = [];
        className = className.replace(/\-/g, "\\-");
        var regex = new RegExp("(^|\\s)" + className + "(\\s|$)");
        var elenemt;
        for (var i = 0; i < allTags.length; i++) {
            elem = allTags[i];
            if (regex.test(elem.className)) {
                classElems.push(elem);
            };
        };
        return classElems;
    };

    /** 
     * 为目标元素添加事件监听器
     * @method on||addEvent
     * @static
     * @param {HTMLElement} elem 目标元素
     * @param {String} type 事件名称 如：click|mouseover
     * @param {Function} listener 需要添加的监听器
     * @return 返回操作的元素节点
     */
    function on(elem, type, listener) {
        type = type.replace(/^on/i, '').toLowerCase();
        var realListener = listener;
        // 事件监听器挂载
        if(elem.addEventListener){
            elem.addEventListener(type, realListener, false);
        }else if(elem.attachEvent){
            elem.attachEvent('on' + type, realListener);
        }
        return elem;
    };

    /**
     * 弹出浮层
     * @param {[Object]} o     配置参数对象
     * @config {[String]} id   浮层ID 必须是唯一值
     * @config {[String]} title   默认 友情提示，浮层名称
     * @config {[String]} msg   自定义显示的内容，支持HTML
     * @config {[Boolean]} lock   默认 false 布尔值，是否锁屏
     * @config {[String]} lockColor   默认 #000，锁屏颜色  lock:true下有效
     * @config {[Number]} lockOpacity   默认 50，锁屏透明度  范围0-100
     * @config {[Boolean]} lockClose   默认 true，锁屏的遮罩层是否点击关闭
     * @config {[String||HTMLElement]} position   默认 无参考 可传递mouse或HTMLElement，mouse时以鼠标为参照物，HTMLElement时以该元素为参照物
     * @config {[String||Number]} top   默认 无 浮层距窗口顶部距离，position有值时以position为参照物 【参照物时仅支持PX单位，设置其他单位无效，%不可使用，数字时默认单位px】
     * @config {[String||Number]} right   默认 无 浮层距窗口右侧距离 position下无效
     * @config {[String||Number]} bottom   默认 无 浮层距窗口底部距离 position下无效
     * @config {[String||Number]} left   默认 无 浮层距窗口左侧距离，position有值时以position为参照物 【参照物时仅支持PX单位，设置其他单位无效，%不可使用，数字时默认单位px】
     * @config {[String||Number]} width   默认 无 强行设定浮层宽度   百分比设定，用于响应式设计，具体宽度设置后出现滚动条不能完美展现
     * @config {[String||Number]} height   默认 无 强行设定浮层高度   简易实现，暂不推荐使用
     * @config {[String]} animation   默认 无 浮层打开动画【无关闭动画】该动画使用CSS3动画类库实现，调用前必须引入CSS3动画样式文件
     * @ animation param 参考案例
     * @config {[String]} outAnimation   默认 无 关闭浮层调用的动画【兼容IE10及以上、现代浏览器】
     * @config {[Boolean]} move   默认 true 窗口是否可以拖动【有定位属性拖动失效】
     * @config {[String]} style   默认 mydialog  皮肤自定义【请引入对应的CSS文件】
     * @config {[Number]} time   默认 无  多少毫秒后自动关闭，无此参数不关闭
     * @config {[Boolean]} closeButton   默认 true  关闭按钮“×”是否展示
     * @config {[Boolean]} showButtons   默认 false  页脚控制台按钮开关【简易模式下系统将该参数设置为true】
     * @config {[String||Boolean]} submitButton   默认“确定”， 为false时隐藏  showButtons:true下有效
     * @config {[String||Boolean]} cancelButton   默认“取消”， 为false时隐藏  showButtons:true下有效
     * @config {[Function]} onReady   加载完成回调 返回false时阻断执行【接受一个参数为当前实例】 例如：function(that) {}
     * @config {[Function]} onClose   关闭按钮回调 返回false时阻断执行【接受一个参数为当前实例】 例如：function(that) {}
     * @config {[Function]} onSubmit   确定按钮回调 返回false时阻断执行【接受一个参数为当前实例】 例如：function(that) {}
     * @config {[Function]} onCancel   取消按钮回调 返回false时阻断执行【接受一个参数为当前实例】 例如：function(that) {}
     * @config {[Function]} onBeforeClose   Dialog关闭前回调【不分任何关闭方式】 返回false时阻断执行【接受一个参数为当前实例】 例如：function(that) {}
     * @config {[Function]} onComplete   Dialog被关闭时都会回调【不分任何关闭方式】 在关闭浮层后才会执行【不接收参数】
     *
     * @remark 
     *        内部对外方法：
     *        var mydialog = new Dialog({});
     *        mydialog.reload();// 重置定位功能，重置大小
     *        mydialog.close();// 关闭浮层【关闭回调方法返回非false时才关闭】
     *        mydialog.submit();// 提交关闭浮层【提交回调方法返回非false时才关闭】
     *        mydialog.cancel();// 取消关闭浮层【取消回调方法返回非false时才关闭】
     *
     *        全局关闭接口
     *        Dialog.close('myclose');// 参数为浮层ID，仅执行关闭，不处理任何回调方法，参数为空时关闭所有Dialog
     *
     *        Esc键可关闭最高层对话框// 仅执行关闭，不处理任何回调方法
     */
    function Dialog(o) {

        if ( !(this instanceof Dialog) ) {
            return new Dialog(o);
        };

        var o;
        this.versions = "3.1.2";

        // 修正配置参数
        if ( typeof o === "string" ) {// alert效果的配置
            o = {
                "type": "alert",
                "msg": "<div class='D_alert'>" + o + "</div>",
                "lock": true,
                "lockClose": false,
                "showButtons": true,
                "cancelButton": false
            };
        }
        
        o = o || {};

        this.config_id = o.id || "";
        this.config_title = o.title || "\u53cb\u60c5\u63d0\u793a";// 友情提示
        this.config_msg = o.msg || "";

        this.config_lock = o.lock == true ? true : false;
        this.config_lockColor = o.lockColor || "#000";
        this.config_lockOpacity = parseInt(o.lockOpacity) || 50;
        this.config_lockClose = o.lockClose == false ? false : true;

        this.config_position = o.position || "";
        this.config_top = o.top || "";
        this.config_right = o.right || "";
        this.config_bottom = o.bottom || "";
        this.config_left = o.left || "";

        this.config_width = o.width || "";
        this.config_height = o.height || "";

        this.config_animation = o.animation || "";
        if ( isIE && isIE < 10 ) {
            this.config_outAnimation = "";
        } else {
            this.config_outAnimation = o.outAnimation || "";
        }

        this.config_fixed = o.fixed == false ? false : true;
        this.config_move = o.move == false ? false : true;

        this.config_style = o.style || "mydialog";

        this.config_time = parseInt(o.time) || "";

        this.config_closeButton = o.closeButton == false ? false : true;
        this.config_showButtons = o.showButtons == true ? true : false;
        this.config_submitButton = o.submitButton == undefined ? "\u786e\u5b9a" : o.submitButton;// 确定
        this.config_cancelButton = o.cancelButton == undefined ? "\u53d6\u6d88" : o.cancelButton;// 取消

        this.config_onReady = typeof o.onReady == "function" ? o.onReady : function() {};
        this.config_onClose = typeof o.onClose == "function" ? o.onClose : function() { return true };
        this.config_onSubmit = typeof o.onSubmit == "function" ? o.onSubmit : function() { return true };
        this.config_onCancel = typeof o.onCancel == "function" ? o.onCancel : function() { return true };
        this.config_onBeforeClose = typeof o.onBeforeClose == "function" ? o.onBeforeClose : function() { return true };
        this.config_onComplete = o.onComplete;

        this.timer = "";// 倒计时关闭浮层计时器

        this.name = this.config_id ? "dialog_" + this.config_id : "anonymous_" + (Dialog.anonymousIndex++);// Dialog的名称

        // 启动效果
        this.init();
    };

    Dialog.prototype.init = function() {
        if ( isIE && isIE == 6 ) {
            alert("\u5f88\u62b1\u6b49\uff0c\u60a8\u6240\u4f7f\u7528\u7684\u6d4f\u89c8\u5668\u8fc7\u4e8e\u53e4\u8001\uff0c\u672c\u63d2\u4ef6\u672a\u80fd\u517c\u987e\u5230\uff01");// 很抱歉，您所使用的浏览器过于古老，本插件未能兼顾到！
            return false;
        }

        if ( !F$(this.config_id) && !this.config_msg ) { return false };

        // 启动前修正单位
        this.config_top = fillUnit(this.config_top);
        this.config_right = fillUnit(this.config_right);
        this.config_bottom = fillUnit(this.config_bottom);
        this.config_left = fillUnit(this.config_left);

        this.config_width = fillUnit(this.config_width);
        this.config_height = fillUnit(this.config_height);

        // 默认让其居中
        if ( isNaN(parseInt(this.config_top)) ) {
            this.config_top = "50%";
        }
        if ( isNaN(parseInt(this.config_left)) ) {
            this.config_left = "50%";
        }        


        this.show();
        this.event();
        this.drage();



        // 填补单位
        function fillUnit(val) {
            if ( typeof val == "number" ) {
                return val + "px";
            } else if ( val == parseInt(val) ) {
                return val + "px";
            } else {
                return val;
            }
        }
    };
    
    Dialog.prototype.create = function() {
        var parent = document.createElement("div"),
            shade = document.createElement("div"),
            content = document.createElement("div"),
            head = document.createElement("div"),
            body = document.createElement("div"),
            foot = document.createElement("div"),
            page_body = document.getElementsByTagName("body")[0];
            head_html = '',
            foot_html = '',
            elem = D.getElementById(this.config_id),
            flag = 0;// 页面内存在ID的状态，0代表不存在，1代表页面内指定ID，2代表已弹出浮层

        // 检测已存在ID的属性
        if ( elem ) {
            // 页面内已存在的浮层
            if ( elem.parentNode.getAttribute("data-type") == "dialog" ) {
                flag = 2;
            } else {// 页面内已存在的ID
                flag = 1;
            }
        }
        
        if ( flag == 2 ) {// 已存在浮层的处理
            page_body.appendChild(elem.parentNode);
            
            // 为方法暴露相关节点
            this.parent = elem.parentNode;
            this.shade = getElementsByClassName("D_shade", "div", elem.parentNode)[0];
            this.content = D.getElementById(this.config_id);
            this.head = getElementsByClassName("D_head", "div", elem.parentNode)[0];
            this.body = getElementsByClassName("D_body", "div", elem.parentNode)[0];
        }

        if ( flag == 1 ) {// 面内指定ID的处理
            elem.style.display = "block";

            // 为方法暴露相关节点
            this.content = D.getElementById(this.config_id);
        }
        
        if ( flag == 0 ) {// 全新创建浮层
            // 插入相关属性
            parent.setAttribute("data-type", "dialog");
            parent.setAttribute("data-dialog-name", this.name);
            
            head.className = "D_head";
            content.className = "D_content";
            content.id = this.config_id;

            // 写入浮层head HTML
            if ( this.config_closeButton ) {
                head_html += '<a href="#" class="D_close" title="\u5173\u95ed" data-dialog-close>\u00d7</a>';//关闭 and ×
            }
            head_html += '<h2 class="D_title">'+ this.config_title +'</h2>';
            head.innerHTML = head_html;

            // 写入浮层body HTML
            body.innerHTML = this.config_msg;
            body.className = "D_body";

            // 锁屏内容
            if ( this.config_lock ) {
                parent.appendChild(shade);
                shade.className = "D_shade";
            }

            // 插入相关节点
            parent.appendChild(content);
            content.appendChild(head);
            content.appendChild(body);
            page_body.appendChild(parent);

            // 创建Button
            if ( this.config_showButtons ) {
                foot.className = "D_foot";
                if ( this.config_submitButton ) {
                    foot_html += '<input type="button" value="'+ this.config_submitButton +'" class="D_submit" data-dialog-submit />';
                }
                if ( this.config_cancelButton ) {
                    foot_html += '<input type="button" value="'+ this.config_cancelButton +'" class="D_cancel" data-dialog-cancel />';
                }
                foot.innerHTML = foot_html;
                content.appendChild(foot);
            }
            

            // 为方法暴露相关节点
            this.parent = parent;
            this.shade = shade;
            this.content = content;
            this.head = head;
            this.body = body;
        }

        // 加入移出动画记录
        if ( this.config_outAnimation ) {
            this.content.setAttribute("data-outanimation", this.config_outAnimation);
        }
    };
    Dialog.prototype.show = function() {
        this.create();
        this.setStyle();
        this.position();
        this.animation();

        if ( this.config_onReady ) {
            this.config_onReady(this);
        }
        Dialog.controller[this.name] = this;
    };

    // 样式设置
    Dialog.prototype.setStyle = function() {
        // 设置当前风格
        if ( this.parent ) {
            this.parent.className = this.config_style;
        }
        
        // 锁屏样式
        if ( this.config_lock ) {
            setStyle(this.shade, {
                background: this.config_lockColor,
                opacity: this.config_lockOpacity/100,
                filter: "alpha(opacity="+ this.config_lockOpacity +")"
            });
        }
        
        if ( this.config_move && this.head && !this.config_position ) {
            setStyle(this.head, {
                cursor: "move"
            });
        }
    };

    // 进行定位
    Dialog.prototype.position = function(e) {
        // 锁屏定位
        if ( this.config_lock ) {
            setStyle(this.shade, {
                position:"fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%"
            });
        }

        // 宽度限制
        if ( this.config_width ) {
            setStyle( this.content, {
                width: this.config_width,
                overflow: "hidden"
            } );
            setStyle( this.body, {
                overflowX: "auto"
            } );
        }
        // 高度限制
        if ( this.config_height ) {
            setStyle( this.content, {
                height: this.config_height,
                overflowY: "auto"
            } );
        }

        // 内容定位
        if ( this.parent && !this.config_position ) {// 存在父框没有参照物默认居中定位，top、left、right、bottom次之

            // 先要设置position属性后再取宽高才有效
            setStyle(this.content, {
                position: "fixed"
            });
            
            setStyle(this.content, {
                top: this.config_top,
                right: this.config_right,
                bottom: this.config_bottom,
                left: this.config_left,
                margin: "-" + this.content.offsetHeight/2 + "px 0 0 -" + this.content.offsetWidth/2 + "px"
            });

            if ( this.config_top != "50%" ) {
                this.content.style.marginTop = "0";
            }
            if ( this.config_left != "50%" ) {
                this.content.style.marginLeft = "0";
            }
            if ( this.config_right !== "" ) {
                this.content.style.left = "auto";
                this.content.style.marginLeft = "auto";
            }
            if ( this.config_bottom !== "" ) {
                this.content.style.top = "auto";
                this.content.style.marginTop = "auto";
            }
        }
        
        // 参照物定位
        if ( this.config_position ) {
            var _x, _y
            // 根据鼠标定位获取坐标
            if ( this.config_position == "mouse" ) {
                _x = getX(e),
                _y = getY(e);
            }
            // 根据元素定位获取坐标
            if ( this.config_position.nodeType == 1 ) {
                _x = this.config_position.offsetLeft,
                _y = this.config_position.offsetTop;
            }
                
            // 单位是%无效
            if ( this.config_left.indexOf("%") < 0 ) {
                _x += parseInt(this.config_left);
            }
            if ( this.config_top.indexOf("%") < 0 ) {
                _y += parseInt(this.config_top);
            }

            setStyle(this.content, {
                position: "absolute",
                top: _y + "px",
                left: _x + "px"
            });
            
        }
        
        return this;
    };

    // 动画效果
    Dialog.prototype.animation = function() {
        // IE9 及以下浏览器不处理动画【他们不支持CSS3动画】
        if ( isIE && isIE < 10 ) {
            return false;
        }

        var that = this;
        if ( this.config_animation ) {
            this.content.className += " " + this.config_animation;


            // 以下操作为动画完成后移除动画class，并且仅执行一次
            var events = ["animationend", "webkitAnimationEnd", "mozAnimationEnd", "MSAnimationEnd", "oanimationend"];
            for ( var i=0; i<events.length; i++ ) {
                this.content.addEventListener(events[i], function() {
                    addFlash(arguments.callee);
                });
            }

            function addFlash(fn) {
                that.content.className = that.content.className.replace(that.config_animation, "");
                for ( var i=0; i<events.length; i++ ) {
                    that.content.removeEventListener(events[i], fn);
                }
            };

        }
    };

    Dialog.prototype.event = function() {
        var elems = this.content.getElementsByTagName("*"),
            that = this;
        // 添加关闭对话框的事件
        for ( var i=0,l=elems.length; i<l; i++ ) {
            if ( elems[i].getAttribute("data-dialog-close") != null ) {
                elems[i].onclick = function() {
                    that.close();
                    return false;
                };
            }
            if ( elems[i].getAttribute("data-dialog-submit") != null ) {
                elems[i].onclick = function() {
                    that.submit();
                    return false;
                };
            }
            if ( elems[i].getAttribute("data-dialog-cancel") != null ) {
                elems[i].onclick = function() {
                    that.cancel();
                    return false;
                };
            }
        }

        // 点击遮罩层关闭
        if ( this.shade && this.config_lockClose ) {
            this.shade.onclick = function() {
                that.close();
            }
        }

        // 限时关闭
        if ( this.config_time ) {
            this.timer = setTimeout(function() {
                that.remove();
            }, this.config_time);
        }


        // 窗口变化是重新定位设置大小
        on(window, "resize", function() {
            that.reload();
        });
    };

    Dialog.prototype.drage = function(e) {
        var that = this;
        if ( !this.config_move || !this.head || this.config_position ) { return false };

        var handle = this.head,
            elem = this.content;

        handle.onmousedown = function (e) {
            var e = e || window.event;
            var x = getX(e); // 光标坐标
            var y = getY(e);
            var elemX = getStyle(elem, "left"); // 元素到页面的距离
            var elemY = getStyle(elem, "top");

            elemX = elemX == "50%" ? that.content.offsetLeft + -parseInt(getStyle(that.content, "marginLeft")) : parseInt(elemX);
            elemY = elemY == "50%" ? that.content.offsetTop + -parseInt(getStyle(that.content, "marginTop")) : parseInt(elemY);

            if (handle.setCapture) { // 鼠标捕获 捕获后所有鼠标输入都针对该窗口，不会产生选中其他内容的问题
                handle.setCapture();
            } else if (window.captureEvents) {
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            };

            if (/msie (\d+\.\d)/i.test(navigator.userAgent) == false) {
                e.preventDefault();
            };

            document.onmousemove = function (e) {
                var e = e || window.event;
                var newX = getX(e);
                var newY = getY(e);
                var _left = newX - x + elemX;
                var _top = newY - y + elemY;
                
                setStyle(elem, {
                    top: _top + "px",
                    left: _left + "px"
                });
            };

            document.onmouseup = function () {
                if (handle.releaseCapture) { // 与鼠标捕获对应，释放鼠标事件
                    handle.releaseCapture();
                } else if (captureEvents) {
                    captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                };

                document.onmousemove = null;
                document.onmouseup = null;
            };

        };

    };

    Dialog.prototype.close = function() {
        if ( this.config_onClose(this) !== false ) {
            this.remove();
        }
    };
    Dialog.prototype.submit = function() {
        if ( this.config_onSubmit(this) !== false ) {
            this.remove();
        }
    };
    Dialog.prototype.cancel = function() {
        if ( this.config_onCancel(this) !== false ) {
            this.remove();
        }
    };
    
    Dialog.prototype.remove = function(id) {
        var elem = F$(id) || this.content;
        clearTimeout(this.timer);// 清除倒计时关闭对话框的计时器
        if ( !elem || elem.scrollHeight == 0 ) { return false };// elem.scrollHeight == 0 代表该节点被创建，但并未插入到页面

        if ( this.config_onBeforeClose(this) === false ) {
            return false;
        }
        
        if ( elem.parentNode.getAttribute("data-type") == "dialog" ) {// 组件创建的浮层
            removeDOM(elem.parentNode);
        } else {// 页面内存在的ID
            elem.style.display = "none";
        }

        // 销毁Dialog.controller中记录的索引
        delete Dialog.controller[this.name];

        if ( this.config_onComplete ) {
            this.config_onComplete();
        }

        function removeDOM(elem) {
            var animationElem = getElementsByClassName("D_content", "div", elem)[0],
                outAnimation = animationElem.getAttribute("data-outanimation"),
                events = ["animationend", "webkitAnimationEnd", "mozAnimationEnd", "MSAnimationEnd", "oanimationend"];
            
            if ( !outAnimation ) {
                elem.parentNode.removeChild(elem);
            } else {
                animationElem.className += " " + outAnimation;
                for ( var i=0; i<events.length; i++ ) {
                    animationElem.addEventListener(events[i], function() {
                        elem.parentNode.removeChild(elem);
                    });
                }
            }
        };
    };
    
    Dialog.prototype.reload = function() {
        this.position();// 当前仅实现了重新定位及计算大小
    };

    Dialog.controller = {};// 所有Dialog的管理中心
    Dialog.anonymousIndex = 0;// 匿名Dialog索引

    // 全局关闭接口，仅执行关闭
    Dialog.close = function(id) {
        var dialog_items = Dialog.controller;
        if ( typeof id === "boolean" && id === true ) {// 强行关闭所有对话框
            for ( key in dialog_items ) {
                dialog_items[key].remove();
            }
            return false;
        } else if ( !id ) {// 关闭所有已打开的Dialog【会检测onClose回调函数，如果有且返回true的才会关闭】
            for ( key in dialog_items ) {
                dialog_items[key].close();
            }
            return false;
        } else {// 传递为ID或者节点时关闭单个Dialog
            // 关闭指定ID
            var elem = F$(id),
                name,
                dialogID;
            if ( !elem ) { return false };
            // 获取Dialog的名称
            name = elem.getAttribute("data-dialog-name");
            // 没有名称时拼接ID名称
            if ( !name && elem.id ) {
                name = "dialog_" + elem.id;
            }
            // 依然没有名称时不执行
            if ( !name ) {
                return false;
            }

            // 没有这个控制器不处理
            if ( typeof Dialog.controller[name] == "undefined" ){
                return false;
            }
            Dialog.controller[name].close();
        }
    };


    /**
     * ESC关闭浮层【全局模式下通过节点的data-type=dialog属性，从后至前进行关闭】
     * @return
     */
    function escCloseDialog() {
        // 注册捕获键盘按下事件
        document.onkeydown = function(e) {
            var e = e || window.event;
            var childs = document.getElementsByTagName("body")[0].childNodes,
                dialog = [],
                elem;
            
            for ( var i=0,l=childs.length; i<l; i++ ) {
                if ( childs[i].nodeName == "DIV" && childs[i].getAttribute("data-type") == "dialog" ) {
                    dialog.push(childs[i]);
                }
            }
            if ( e.keyCode == 0x1B && dialog.length > 0 ) {// ESC
                elem = dialog[dialog.length-1];
                Dialog.close(elem);
                return false;
            };
        };
    };
    escCloseDialog();

    G.Dialog = Dialog;

    if ( typeof define === "function" ) {
        define( "dialog", [], function() {
            return Dialog;
        });
    }
    
})(window, document);