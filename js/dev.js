/**
 * Created by wuwanqiang on 2016/8/31.
 */
/**
 * @param {obj} domain:$作为属性绑定到domain上
 */

var w = {};

!function (domain) {
    domain.$ = function () {
        var arg = arguments;
        if (arg.length === 0)
            return null;
        if (typeof arg[0] === 'string') {
            if (arg[0].indexOf('<') > -1) { //html字符串
                return new Element([parseStringToHTML(arg[0])]);
            } else {
                return new Element(document.querySelectorAll(arg[0]));
            }
        }
        if (arg[0] instanceof HTMLElement || arg[0] === window || arg[0] === document) {
            return new Element([arg[0]]);
        }
        if (typeof arg[0] === 'function') {
            if (document.readyState != 'loading') {
                arg[0]();
            } else {
                document.addEventListener('DOMContentLoaded', arg[0]);
            }
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
                this.each(function () {
                    this.innerHTML = content.toString()
                });
                return this;
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
                    arr = Array.prototype.slice.call(nodeList, 0);
                return arr.indexOf(this[0]);
            } else if (typeof arg === 'string') {
                return Array.prototype.slice.call(this, 0).indexOf(document.querySelectorAll(arg)[0]);
            } else {
                var ele = arg instanceof HTMLElement ? arg : arg[0];
                return Array.prototype.slice.call(this, 0).indexOf(ele);

            }
        },
        parent: function () {
            var nodeList = [];
            this.each(function (ele) {
                var node = ele.parentNode;
                if (nodeList.indexOf(node) < 0) {
                    nodeList.push(node);
                }
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
                nodes = domain.$(str);
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
                    if (has) {
                        return domain.$(node);
                    }
                } else {
                    arr.push(node);
                }
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
                        if (domain.$(this).is(str)) {
                            domain.$(this).remove();
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
                    var classes = this.className.split(' ');
                    var existingIndex = classes.indexOf(className);

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
                f.apply(this[i], [this[i], i]);
            }
        },

        //Event
        on: function (arg0, arg1, arg2, arg3) {
            if (typeof arg0 === 'object') {
                var selector = '',
                    data = null;
                switch (arguments.length) {
                    case 2:
                        if (typeof arg1 === 'string') {
                            selector = arg1;
                        }
                        else {
                            data = arg1;
                        }
                        break;
                    case 3:
                        selector = arg1;
                        data = arg2;
                        break;
                }

                for (var type in arg0) {
                    var handler = arg0[type];
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
                        if (typeof arg1 === 'string') {
                            selector = arg1;
                        }
                        else {
                            data = arg1;
                        }
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
            }
        },
        off: function (arg0) {
            var arg = arguments;
            if (!arg0) {
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
            else if (arg.length === 1 && typeof arg0 === 'string') {
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
            else {
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
        }
        //ajax
    };

    function bindEvent(obj) {
        function originHandler(e) {
            e.data = obj.data;

            if (obj.selector) {
                if ($(obj.ele).find(obj.selector).index(e.srcElement) > -1) {
                    obj.handler(e);
                }
            }
            else {
                obj.handler(e);
            }
        }

        obj.ele.addEventListener(obj.type.split('.')[0], originHandler);
        obj.ele.event = obj.ele.event || {};
        obj.ele.event[obj.type] = obj.ele.event[obj.type] || [];
        obj.ele.event[obj.type].push({
            originHandler: originHandler,
            $handler: obj.handler
        })
    }
    function parseStringToHTML(text) {
        var i, a = document.createElement("div"),
            b = document.createDocumentFragment();
        a.innerHTML = text;
        while (i = a.firstChild) b.appendChild(i);
        return b;
    }

    //static function
    domain.$.fn = Element.prototype;
    domain.$.fn.extend = domain.$.extend = function (arg0) {
        var arg = arguments
        if (arg0) {
            if (typeof arg0 === 'object') {
                return this.extend(this, arguments[0]);
            }
        }
        else if (typeof arg0 === 'boolean') {
            if (arg0) {
                return deepCopy.apply(this, Array.prototype.slice.call(arg, 1));
            }
            else {
                return shallowCopy.apply(this, Array.prototype.slice.call(arg, 1));
            }
        }
        else {
            return shallowCopy.apply(this, arg)
        }
        var out = {};

        function shallowCopy() {
            var args = arguments
            out = args[0];
            for (var i = 1; i < args.length; i++) {
                var obj = args[i];

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
            var argd = arguments;
            out = out || {};

            for (var i = 1; i < argd.length; i++) {
                var obj = argd[i];
                if (!obj)
                    continue;

                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (typeof obj[key] === 'object')
                            out[key] = deepCopy(out[key], obj[key]);
                        else
                            out[key] = obj[key];
                    }
                }
            }
            return out;
        }
    }


}(w);

