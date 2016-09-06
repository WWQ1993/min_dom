/**
 * Created by wuwanqiang on 2016/8/31.
 */
/**
 * @param {obj} domain:$作为属性绑定到domain上
 */

var w = {};

!function (domain) {
    domain.$ = function () {
        if (arguments.length === 0)
            return null;
        if (typeof arguments[0] === 'string') {
            if (arguments[0].indexOf('<') > -1) {
                var ele = document.createElement('div'),
                    par = document.createElement('div'),
                    fragment = document.createDocumentFragment();
                fragment.appendChild(par);
                document.body.appendChild(ele);
                console.log(arguments[0])
                ele.outerHTML = arguments[0];
                return new Element([ele]);
            } else {
                return new Element(document.querySelectorAll(arguments[0]));
            }
        }
        if (arguments[0] instanceof HTMLElement || arguments[0] === window || arguments[0] === document) {
            return new Element([arguments[0]]);
        }
        if (typeof arguments[0] === 'function') {
            if (document.readyState != 'loading') {
                arguments[0]();
            } else {
                document.addEventListener('DOMContentLoaded', arguments[0]);
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
            if (arguments.length <= 1)
                return this[0].getAttribute(attrName);
            else {
                this.each(function () {
                    this.setAttribute(attrName, attrContent);

                });
            }
        },
        eq: function () {
            if (arguments.length < 1)
                return null;
            else {
                return new Element([this[arguments[0]]]);
            }
        },
        text: function () {
            if (arguments.length < 1) {
                var str = '';
                this.each(function () {

                    str += this.textContent
                });
                return str;
            }
            else {
                var arg = arguments;
                this.each(function () {
                    this.textContent = arg[0].toString()
                });
                return this;
            }
        },
        html: function () {
            if (arguments.length < 1)
                return this[0].innerHTML;
            else {
                var arg = arguments;
                this.each(function () {
                    this.innerHTML = arg[0].toString()
                });
                return this;
            }
        },
        find: function () {
            var arg = arguments,
                arr = [];
            this.each(function () {
                var list = this.querySelectorAll(arg[0]),
                    listLength = list.length;
                for (var i = 0; i < listLength; i++) {
                    arr.push(list[i]);
                }
            });
            return new Element(arr);
        },
        index: function () {
            if (arguments.length === 0) {
                var nodeList = this[0].parentNode.children,
                    arr = Array.prototype.slice.call(nodeList, 0);
                return arr.indexOf(this[0]);
            } else if (typeof arguments[0] === 'string') {
                return Array.prototype.slice.call(this, 0).indexOf(document.querySelectorAll(arguments[0])[0]);
            } else {
                var ele = arguments[0] instanceof HTMLElement ? arguments[0] : arguments[0][0];
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
        parents: function () {
            var arr = [],
                node = this[0],
                match = typeof arguments[0] === "string",
                nodes = null,
                nodesLength = 0;
            if (match) {
                nodes = domain.$(arguments[0]);
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
        is: function () {
            if (typeof arguments[0] === 'string') {
                var sel = arguments[0];
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
        remove: function () {
            if (arguments.length < 1) {
                this.each(function () {
                    this.parentNode.removeChild(this);
                })
            }
            else if (typeof arguments[0] === 'string') {
                var sel = arguments[0];
                this.each(function () {
                    if (domain.$(this).is(sel)) {
                        domain.$(this).remove();
                    }
                })
            }
            return this;
        },
        clone: function () {
            return new Element([this[0].cloneNode(true)]);
        },
        after: function () {
            var arg = arguments[0];
            if (Object.prototype.toString.call(arg) === "[object Object]" && arg[0] instanceof HTMLElement) {
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
        before: function () {
            var arg = arguments[0];
            if (Object.prototype.toString.call(arg) === "[object Object]" && arg[0] instanceof HTMLElement) {
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
        addClass: function () {
            var className = arguments[0];
            this.each(function () {
                if (this.classList)
                    this.classList.add(className);
                else
                    this.className += ' ' + className;
            });

        },

        removeClass: function () {
            var className = arguments[0];
            this.each(function () {
                if (this.classList)
                    this.classList.remove(className);
                else
                    this.className = this.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            });
        },
        toggleClass: function () {
            var className = arguments[0];
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
        css: function () {
            if (arguments.length === 1 && typeof arguments[0] !== 'object')
                return getComputedStyle(this[0])[arguments[0]];
            else {
                var arg = arguments;

                this.each(function (ele, i) {
                    if (typeof arg[0] === 'object') {
                        for (var attr in arg[0]) {
                            this.style[attr] = arg[0][attr];
                        }
                    }
                    else
                        this.style[arg[0]] = arg[1];
                });
                return this;
            }
        },
        hide: function () {
            this.each(function (ele, i) {
                this.style.display = 'none';
            })
        },
        show: function () {
            this.each(function (ele, i) {
                this.style.display = '';
                getComputedStyle(this).display === 'none' && (this.style.display = 'block');
            })
        },
        fadeIn: function () {
            var interval = arguments[0];
            this.show();
            this.each(function (el, i) {
                el.style.opacity = 0;
                var last = +new Date();
                var tick = function () {
                    el.style.opacity = +el.style.opacity + (new Date() - last) / interval;
                    last = +new Date();
                    if (+el.style.opacity < 1) {
                        (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
                    }
                };
                tick();
            })
        },

        //tools
        each: function () {
            var length = this.length;
            for (var i = 0; i < length; i++) {
                arguments[0].apply(this[i], [this[i], i]);
            }
        },

        //Event
        on: function () {
            if (typeof arguments[0] === 'object') {
                var selector = '',
                    data = null;
                switch (arguments.length) {
                    case 2:
                        if (typeof arguments[1] === 'string') {
                            selector = arguments[1];
                        }
                        else {
                            data = arguments[1];
                        }
                        break;
                    case 3:
                        selector = arguments[1];
                        data = arguments[2];
                        break;
                }

                for (var type in arguments[0]) {
                    var handler = arguments[0][type];
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
                var type = arguments[0],
                    selector = '',
                    data = '',
                    handler = null;
                switch (arguments.length) {
                    case 2:
                        handler = arguments[1];
                        break;
                    case 3:
                        if (typeof arguments[1] === 'string') {
                            selector = arguments[1];
                        }
                        else {
                            data = arguments[1];
                        }
                        handler = arguments[2];
                        break;
                    case 4:
                        selector = arguments[1];
                        data = arguments[2];
                        handler = arguments[3];
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
        off: function () {
            if (arguments.length === 0) {
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
            else if (arguments.length === 1 && typeof arguments[0] === 'string') {
                var arg = arguments;
                this.each(function (ele) {
                    for (var str in ele.event) {
                        if (str.indexOf(arg[0]) > -1) {
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
                var handler = arguments[arguments.length - 1],
                    arg = arguments;
                this.each(function (ele) {
                    for (var str in ele.event) {
                        if (str.indexOf(arg[0]) > -1) {
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
        trigger: function () {
            var event = document.createEvent('HTMLEvents');
            event.initEvent(arguments[0], true, false);
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

    //static function
    domain.$.fn = Element.prototype;
    domain.$.fn.extend = domain.$.extend = function () {
        if (arguments.length === 1) {
            if (typeof arguments[0] === 'object') {
                return this.extend(this, arguments[0]);
            }
        }
        else if (typeof arguments[0] === 'boolean') {
            if (arguments[0]) {
                return deepCopy.apply(this, Array.prototype.slice.call(arguments, 1));
            }
            else {
                return shallowCopy.apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }
        else {
            return shallowCopy.apply(this, arguments)
        }
        var out = {};

        function shallowCopy() {
            out = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
                var obj = arguments[i];

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
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                var obj = arguments[i];

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

