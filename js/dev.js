/**
 * Created by wuwanqiang on 2016/8/31.
 */
/**
 * @param {obj} domain:$作为属性绑定到domain上
 */
// define(function (require, exports, module) {


var w = {};

!function (domain) {
    var slice = Array.prototype.slice;

    var $ = domain.$ = function (arg) {

        if (!arg) return null;
        if (typeof arg === 'string') {
            if (arg.indexOf('<') > -1) return new Element([string2Dom(arg)]);
            else return new Element(document.querySelectorAll(arg));
        }
        if (arg instanceof HTMLElement || arg === window || arg === document) return new Element([arg]);

        if (typeof arg === 'function') {
            if (document.readyState != 'loading') arg();
            else document.addEventListener('DOMContentLoaded', arg);
        }
    };

    function Element(nodeList) {
        var length = 0;
        for (var i = 0; i < nodeList.length; i++) {
            this[i] = nodeList[i];
            length++;
        }
        this.length = length;
    }

    Element.prototype = {
        constructor: Element,
        //dom
        attr: function (attrName, attrContent) {
            if (!attrContent)
                return this[0].getAttribute(attrName);
            else {
                this.each(function () {
                    this.setAttribute(attrName, attrContent);
                });
            }
        },
        eq: function (n) {
            return new Element([this[n]]);
        },
        text: function (content) {
            if (!content) {
                var str = '';
                this.each(function () {
                    str += this.textContent
                });
                return str;
            }
            else {
                this.each(function () {
                    this.textContent = content.toString();
                });
                return this;
            }
        },
        html: function (content) {
            if (!content)
                return this[0].innerHTML;
            else {
                return this.each(function () {
                    this.innerHTML = content.toString()
                });
            }
        },
        find: function (str) {
            var arr = [];
            this.each(function () {
                var list = this.querySelectorAll(str),
                    listLength = list.length;
                for (var i = 0; i < listLength; i++) {
                    arr.push(list[i]);
                }
            });
            return new Element(arr);
        },
        index: function (arg) {
            if (!arg) {
                var nodeList = this[0].parentNode.children,
                    arr = slice.call(nodeList, 0);
                return arr.indexOf(this[0]);
            } else if (typeof arg === 'string') {
                return slice.call(this, 0).indexOf(document.querySelectorAll(arg)[0]);
            } else {
                var ele = arg instanceof HTMLElement ? arg : arg[0];
                return slice.call(this, 0).indexOf(ele);

            }
        },
        parent: function () {
            var nodeList = [];
            this.each(function (ele) {
                var node = ele.parentNode;
                if (nodeList.indexOf(node) < 0)
                    nodeList.push(node);
            });

            return new Element(nodeList);
        },
        parents: function (str) {
            var arr = [],
                node = this[0],
                match = typeof str === "string",
                nodes = null,
                nodesLength = 0;
            if (match) {
                nodes = $(str);
                nodesLength = nodes.length
            }
            while (node !== document.body.parentNode) {//不是html元素则重复上溯
                node = node.parentNode;
                if (match) {
                    var has = false;
                    for (var j = 0; j < nodesLength; j++) {
                        if (nodes[j] === node) {
                            has = true;
                            break;
                        }
                    }
                    if (has) return $(node);
                }
                else arr.push(node);
            }
            return arr;
        },
        append: function () {

        },
        is: function (str) {
            if (typeof str === 'string') {
                var sel = str;
                var matches = function (el, selector) {
                        return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
                    },
                    returnVal = false;
                this.each(function (ele) {
                    if (matches(ele, sel)) {
                        returnVal = true;
                        return;
                    }
                });
                return returnVal;
            }
            else {
                throw new Error('please pass a string as parameter')
            }
        },
        remove: function (str) {
            try {
                if (!str) {
                    this.each(function () {
                        this.parentNode.removeChild(this);
                    })
                }
                else if (typeof str === 'string') {
                    this.each(function () {
                        if ($(this).is(str)) {
                            $(this).remove();
                        }
                    })
                }
            }
            catch (e) {
            }
            return this;
        },
        clone: function () {
            return new Element([this[0].cloneNode(true)]);
        },
        append: function () {

        },
        prepend: function () {

        },

        after: function (arg) {
            if (arg instanceof Element) {
                arg.remove();
                this.each(function (target, b) {
                    var afterNode = target.nextElementSibling;
                    if (!afterNode) {
                        arg.each(function (ele) {
                            target.parentNode.appendChild(ele.cloneNode(true));
                        })
                    }
                    else {
                        arg.each(function (ele) {
                            afterNode.parentNode.insertBefore(ele.cloneNode(true), afterNode);
                        })
                    }
                })
            }
            else if (arg instanceof HTMLElement) {
                arg.parentNode.removeChild(arg);
                this.each(function (target) {
                    if (!target.nextElementSibling) {
                        target.parentNode.appendChild(arg.cloneNode(true));
                    }
                    else {
                        target.parentNode.insertBefore(arg.cloneNode(true), target.nextElementSibling);
                    }
                });
            }
            else if (typeof arg === 'string') {
                this.each(function (target) {
                    target.insertAdjacentHTML('afterend', arg);
                });
            }
            return this;
        },
        before: function (arg) {
            if (arg instanceof Element) {
                arg.remove();
                this.each(function (target, b) {
                    arg.each(function (ele) {
                        target.parentNode.insertBefore(ele.cloneNode(true), target);
                    })
                })
            }
            else if (arg instanceof HTMLElement) {
                arg.parentNode.removeChild(arg);
                this.each(function (target) {
                    target.parentNode.insertBefore(arg.cloneNode(true), target);
                });
            }
            else if (typeof arg === 'string') {
                this.each(function (target) {
                    target.insertAdjacentHTML('beforebegin', arg);
                });
            }
            return this;
        },
        scrollTop: function (arg) {
            var target = (this[0] === window || this[0] === document) ? document.body : this[0];

            if (arguments.length) {
                target.scrollTop = arg;
                return this;
            }
            else {
                return target.scrollTop;
            }
        },
        scrollLeft: function (arg) {
            var target = (this[0] === window || this[0] === document) ? document.body : this[0];

            if (arguments.length) {
                target.scrollLeft = arg;
                return this;
            }
            else {
                return target.scrollLeft;
            }
        },

        width: function (arg) {
            var target = this.eq(0);
            if (this[0] === window || this[0] === document) {
                target = $(document.body);
            }

            if (arguments.length) {
                target.css('width', arg + 'px');
                return this;
            }
            else {
                return target.css('width').split('px')[0];
            }
        },
        height: function (arg) {
            var target = this.eq(0);
            if (this[0] === window || this[0] === document) {
                target = $(document.body);
            }
            if (arguments.length) {
                target.css('height', arg + 'px');
                return this;
            }
            else {
                return target.css('height').split('px')[0];
            }
        },

        //Style
        addClass: function (className) {
            this.each(function () {
                if (this.classList)
                    this.classList.add(className);
                else
                    this.className += ' ' + className;
            });

        },

        removeClass: function (className) {
            this.each(function () {
                if (this.classList)
                    this.classList.remove(className);
                else
                    this.className = this.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            });
        },
        toggleClass: function (className) {
            this.each(function () {
                if (this.classList) {
                    this.classList.toggle(className);
                } else {
                    var classes = this.className.split(' '),
                        existingIndex = classes.indexOf(className);

                    if (existingIndex >= 0)
                        classes.splice(existingIndex, 1);
                    else
                        classes.push(className);

                    this.className = classes.join(' ');
                }
            });
        },
        css: function (arg, arg2) {
            if (arg && typeof arg !== 'object')
                return getComputedStyle(this[0])[arg];
            else {

                this.each(function (ele, i) {
                    if (typeof arg === 'object') {
                        for (var attr in arg) {
                            this.style[attr] = arg[attr];
                        }
                    }
                    else
                        this.style[arg] = arg2;
                });
                return this;
            }
        },
        hide: function () {
            this.each(function () {
                this.style.display = 'none';
            })
        },
        show: function () {
            this.each(function () {
                this.style.display = '';
                getComputedStyle(this).display === 'none' && (this.style.display = 'block');
            })
        },
        // fadeIn: function () {
        //     var interval = arguments[0];
        //     this.show();
        //     this.each(function (el, i) {
        //         el.style.opacity = 0;
        //         var last = +new Date();
        //         var tick = function () {
        //             el.style.opacity = +el.style.opacity + (new Date() - last) / interval;
        //             last = +new Date();
        //             if (+el.style.opacity < 1) {
        //                 (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        //             }
        //         };
        //         tick();
        //     })
        // },

        //tools
        each: function (f) {
            var length = this.length;
            for (var i = 0; i < length; i++) {
                if (!!f.apply(this[i], [this[i], i])) return this[i];
            }
            return this;
        },

        //Event
        on: function (arg0, arg1, arg2, arg3) {
            if (typeof arg0 === 'object') { //绑定对象中的所有事件
                var selector = '',
                    data = null;
                switch (arguments.length) {
                    case 2:
                        if (typeof arg1 === 'string') selector = arg1;  //传入选择器
                        else data = arg1;   //传入data
                        break;
                    case 3:
                        selector = arg1;
                        data = arg2;
                        break;
                }

                for (var type in arg0) {
                    var handler = arg0[type];   //回调函数
                    this.each(function (ele, i) {
                        bindEvent({
                            ele: ele,
                            type: type,
                            handler: handler,
                            data: data,
                            selector: selector
                        });
                    })
                }
                return this;
            }
            else if (arguments.length > 1) {
                var type = arg0,
                    selector = '',
                    data = '',
                    handler = null;
                switch (arguments.length) {
                    case 2:
                        handler = arg1;
                        break;
                    case 3:
                        if (typeof arg1 === 'string') selector = arg1;
                        else data = arg1;
                        handler = arg2;
                        break;
                    case 4:
                        selector = arg1;
                        data = arg2;
                        handler = arg3;
                        break;
                }
                this.each(function (ele) {
                    bindEvent({
                        ele: ele,
                        type: type,
                        handler: handler,
                        data: data,
                        selector: selector
                    });
                });
                return this;
            };
        },
        off: function (arg0) {
            var arg = arguments;
            if (!arg0) {    //移除元素上所有事件
                this.each(function (ele) {
                    for (var str in ele.event) {
                        var handlers = ele.event[str],
                            handlersLength = handlers.length;
                        for (var i = 0; i < handlersLength; i++) {
                            var obj = handlers[i],
                                originHandler = obj['originHandler'];
                            ele.removeEventListener(str.split('.')[0], originHandler);
                        }
                        ele.event[str] = [];
                    }
                });
                return this;
            }
            else if (arg.length === 1 && typeof arg0 === 'string') {    //移除命名空间内的事件
                this.each(function (ele) {
                    for (var str in ele.event) {
                        if (str.indexOf(arg0) > -1) {
                            var handlers = ele.event[str],
                                handlersLength = handlers.length;
                            for (var i = 0; i < handlersLength; i++) {
                                var obj = handlers[i],
                                    originHandler = obj['originHandler'];
                                ele.removeEventListener(str.split('.')[0], originHandler);
                            }
                            ele.event[str] = [];
                        }
                    }
                });
                return this;
            }
            else {  //移除命名空间内且符合回调函数的事件
                var handler = arg[arg.length - 1];
                this.each(function (ele) {
                    for (var str in ele.event) {
                        if (str.indexOf(arg0) > -1) {
                            var handlers = ele.event[str],
                                handlersLength = handlers.length,
                                newHandlers = [];
                            for (var i = 0; i < handlersLength; i++) {
                                var obj = handlers[i],
                                    originHandler = obj['originHandler'],
                                    $handler = obj['$handler'];

                                if (handler === $handler) {
                                    ele.removeEventListener(str.split('.')[0], originHandler);
                                }
                                else {
                                    newHandlers.push(obj)
                                }
                            }
                            ele.event[str] = newHandlers;
                        }
                    }
                });
                return this;
            }

        },
        trigger: function (arg) {
            var event = document.createEvent('HTMLEvents');
            event.initEvent(arg, true, false);
            this.each(function () {
                this.dispatchEvent(event);
            });
        },
        one:function () {
            
        }

    };


    function bindEvent(obj) {
        
        obj.ele.addEventListener(obj.type.split('.')[0], originHandler);
        obj.ele.event = obj.ele.event || {};
        obj.ele.event[obj.type] = obj.ele.event[obj.type] || [];
        obj.ele.event[obj.type].push({
            originHandler: originHandler,
            $handler: obj.handler
        });
        function originHandler(e) {
            e.data = obj.data;

            if (obj.selector) { //如果传入了选择器，则再绑定对象的子元素中选择符合的元素，执行回调。
                if ($(obj.ele).find(obj.selector).index(e.srcElement) > -1) {
                    obj.handler(e);
                }
            }
            else {
                obj.handler(e);
            }
        }

    }

    function string2Dom(text) {
        var a = document.createElement("div");
        a.innerHTML = text;
        return a.firstChild;
    }

    //设置原生事件
    !function (obj, arr) {

        function addFunction(type) {
            obj[type] = function (arg, arg1) {
                if (!arg) {
                    this.trigger(type);
                    return this;
                }
                if (typeof arg === 'function') {
                    this.on(type, arg);
                    return this;
                }
                else {
                    this.on(type, '', arg, arg1);
                    return this;
                }
            }
        }

        for (var i = 0; i < arr.length; i++) {
            addFunction(arr[i]);
        }
    }(Element.prototype, ['blur', 'focusin', 'mousedown', 'mouseup', 'change', 'focusout', 'mouseenter', 'resize', 'click', 'keydown', 'mouseleave', 'scroll', 'dbclick', 'keypress', 'mousemove', 'select', 'error', 'keyup', 'mouseout', 'submit', 'focus', 'load', 'mouseover', 'unload', 'tap', 'touchstart', 'touchmove', 'touchend'])

    //static function
    $.fn = Element.prototype;
    $.fn.extend = $.extend = function (arg0) {
        var arg = arguments,
            out = {};

        function shallowCopy() {
            var arg_s = arguments;
            out = arg_s[0];
            for (var i = 1; i < arg_s.length; i++) {
                var obj = arg_s[i];

                if (!obj)
                    continue;

                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        out[key] = obj[key];
                    }
                }
            }
            return out;
        }

        function deepCopy(out) {
            var arg_d = arguments;
            out = out || {};

            for (var i = 1; i < arg_d.length; i++) {
                var obj = arg_d[i];
                if (!obj)
                    continue;

                for (var key in obj)
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object')
                            out[key] = deepCopy(out[key], obj[key]);
                        else
                            out[key] = obj[key];
                    }
            }
            return out;
        }

        if (arg.length === 1) return this.extend(this, arg0);

        else if (typeof arg0 === 'boolean') {
            if (arg0)
                return deepCopy.apply(this, slice.call(arg, 1));
            else
                return shallowCopy.apply(this, slice.call(arg, 1));
        }
        else {
            return shallowCopy.apply(this, slice.call(arg, 0))
        }


    };
    $.isArray = function (arr) {
        return Object.prototype.toString.call(arr) === "[object Array]"
    };
    $.each = function (elements, callback) {
        var i, key;
        if (elements.length) {
            for (i = 0; i < elements.length; i++)
                if (callback.call(elements[i], i, elements[i]) === false) return elements
        } else {
            for (key in elements)
                if (callback.call(elements[key], key, elements[key]) === false) return elements
        }

        return elements
    };
    $.param = function (target) {
        var scope = [];

        function inner(target) {
            if (typeof target === 'object') {
                var result = '';
                for (var name in target) {

                    if (target.hasOwnProperty(name)) {
                        scope.push(name);
                        result += inner(target[name]);
                    }
                }
                scope.pop();
                return result;
            }
            else {
                var str = scope.join('][');
                scope.pop();
                return (str + ']=' + target + '&').replace(/]/, '');
            }
        }

        var str = inner(target);
        return str.substring(0, str.length - 1);
    };
    //ajax

    $.ajax = function (option) {
        var type = option.type && option.type.toUpperCase() || 'GET',
            url = option.url || window.location.href,
            data = option.data && $.param(option.data) || '',
            dataType = option.dataType || '',
            timeout = option.timeout || 0,
            nullFunction = function () {
            },
            beforeSend = option.beforeSend || nullFunction,
            success = option.success || nullFunction,
            error = option.error || nullFunction,
            complete = option.complete || nullFunction,
            async = option.async || true,
            headers = option.headers || '',
            jsonp = option.jsonp || 'callback', //设置函数名的键名
            jsonpCallBackName = 'jsonp' + new Date().getTime(),
            jsonpCallback = option.jsonpCallback || jsonpCallBackName;//函数名键值


        if (dataType.toLocaleLowerCase() === 'jsonp') {//jsonp
            var xhr = {},
                timeoutId = setTimeout(function () {    //设置超时
                    delete window[jsonpCallback];
                    error(xhr, 'timeout', null);
                    complete(xhr, 'timeout');
                }, timeout),
                ofterExecJs = function (obj) {//执行js后触发
                    clearTimeout(timeoutId);
                    document.getElementsByTagName("head")[0].removeChild(script);
                    delete window[jsonpCallback];
                    success(obj, 'success', xhr);
                    complete(obj, 'success');
                };

            window[jsonpCallback] = function (obj) {    //设置全局回调函数
                ofterExecJs(obj);
            };

            beforeSend(xhr);    //调用beforeSend

            //引用外部脚本
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url + (url.indexOf('?') < 0 ? '?' : '&') + jsonp + '=' + jsonpCallback;
            document.getElementsByTagName("head")[0].appendChild(script);
        }
        else {  //xhr
            var request = new XMLHttpRequest();
            if (type === 'GET') { //设置数据
                url += '?' + data;
            }
            request.open(type, url, async);

            request.onload = function () {
                if (request.status >= 200 && request.status < 400) {    //成功回调
                    // Success!
                    var data = null,
                        str = request.responseText
                    switch (dataType.toLocaleLowerCase()) {
                        case 'json':
                            data = JSON.parse(str);
                            break;
                        case 'xml':
                            data = string2Dom(str);
                            break;
                        default:
                            data = str;
                            break;
                    }
                    success(data, request.status, request);
                } else {    //网络正常的失败回调
                    error(request, 'error', request.statusText)
                }
                complete(request, request.status);
            };

            request.onerror = function () { //网络错误
                error(request, 'abort', null)
            };

            if (typeof headers === 'object') {  //设置头部
                for (var name in headers) {
                    var val = headers[name];
                    request.setRequestHeader(name, val);
                }
            }
            beforeSend(request);    //调用beforeSend

            request.send(data);

            if (timeout) {  //设置超时
                setTimeout(function () {
                    if (request.readyState !== 4) {
                        request.abort();
                    }
                }, timeout);
            }
        }
    };


}(w);

// module.exports = w.$;

// })