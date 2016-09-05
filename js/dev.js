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
            return new Element(document.querySelectorAll(arguments[0]));
        }
        if (arguments[0] instanceof HTMLElement) {
            return new Element([arguments[0]]);
        }
        if (typeof arguments[0] === 'function') {
            //todo after event done
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
            if (arg instanceof Element) {

                this.each(function (target, b) {
                    var afterNode = target.nextElementSibling;
                    console.log(afterNode && afterNode.innerText)
                    if (!afterNode) {
                        arg.each(function (ele) {
                            target.parentNode.appendChild(b === 0 ? ele : ele.cloneNode(true));
                        })
                    }
                    else {
                        // console.log(afterNode.innerText);
                        //todo copy 前
                        arg.each(function (ele) {
                            afterNode.parentNode.insertBefore(b === 0 ? ele : ele.cloneNode(true), afterNode);
                        })
                    }


                })
            }
            else if (arg instanceof HTMLElement) {//todo
                this[0].parentNode.insertBefore(arg, this[0].nextElementSibling);
            }
            else if (typeof arg === 'string') {
                this[0].insertAdjacentHTML('afterend', arg);
            }
            return this;
        },
        before: function () {
            var arg = arguments[0];
            if (arg instanceof Element) {
                var that = this;
                var targetNode = that[0];
                arg.each(function () {
                    that[0].parentNode.insertBefore(this, targetNode);
                })
            }
            else if (arg instanceof HTMLElement) {
                this[0].parentNode.insertBefore(arg, this[0]);
            }
            else if (typeof arg === 'string') {
                this[0].insertAdjacentHTML('afterend', arg);
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
        bind: function () {
        }
        //ajax
    };


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
                        // console.log(key)
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

