class Vue {
    constructor(options) {
        this.$el = options.el
        this.$data = options.data
        let methods = options.methods
        let computed = options.computed

        if(this.$el) {
            // 数据劫持
            new Observer(this.$data)
            for(let key in methods) {
                Object.defineProperty(this, key, {
                    get() {
                        return methods[key]
                    }
                })
            };
            for(let key in computed) {
                Object.defineProperty(this.$data, key, {
                    get() {
                        return computed[key].call(this)
                    }
                })
            }
            // 数据代理
            this.protyVm(this.$data)
            // 数据编译
            new Compiler(this.$el, this)
        }
    }

    protyVm(data) {
        for(let key in data) {
            Object.defineProperty(this, key, {
                get() {
                    return data[key]
                },
                set(newVal) {
                    data[key] = newVal
                }
            })
        }
    }
}
// 数据劫持
class Observer {
    constructor(data) {
        this.observer(data)
    }

    observer(data) {
        if(data && typeof data === 'object') {
            for(let key in data) {
                this.observer(data[key])
                this.defineReactive(data, key, data[key])
            }
        }
    }

    defineReactive(obj, key, value) {
        let dep = new Dep();
        Object.defineProperty(obj, key, {
            get() {
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set:(newVal) => {
                if(newVal !== value) {
                    this.observer(newVal)
                    value = newVal
                    dep.notify();
                }
            }
        })
    }
}
// 数据编译
class Compiler {
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el) 
        this.vm = vm
        let fragment = this.node2fragment(this.el)
        // 存到内存中然后解析，减少回流和重绘
        this.compil(fragment)
        this.el.appendChild(fragment)
    }

    isElementNode(node) {//是不是元素节点
        return node.nodeType === 1
    }

    node2fragment(node) {
        let fragment = document.createDocumentFragment() //创建一个虚拟的节点对象
        let firstChild;
        while(firstChild = node.firstChild) {
            fragment.appendChild(firstChild)
        }
        return fragment
    }

    compil(node) {
        let childNodes = node.childNodes;
        [...childNodes].forEach(child => {
            if(this.isElementNode(child)) {
                this.compilElement(child);
                this.compil(child);
            } else {
                this.compilText(child)
            }
        })
    }
    compilElement(node) {
        let attributes = node.attributes;
        [...attributes].forEach(attr => {
            let {name, value} = attr
            if(name.startsWith('v-')) {
                let [, directive] = name.split("-");
                let [directiveName, eventName] = directive.split(":");
                CompileUtil[directiveName](node, value, this.vm, eventName)
            }
        })
    }
    compilText(node) {
        let content = node.textContent;
        if(/\{\{(.+?)\}\}/.test(content)) {
            CompileUtil['text'](node, content, this.vm)
        }
    }
}

CompileUtil = {
    getVal(vm, expr) {
        return expr.split(".").reduce((data, current) => {
            return data[current]
        }, vm.$data)
    },
    setValue(vm, expr, value) {
        expr.split(".").reduce((data, current, index, arr) => {
            if(index === arr.length-1) {
                data[current] = value
            }
            return data[current]
        }, vm.$data)
    },
    getContentValue(vm, expr) {
        // 遍历表达式，将内容重新替换成一个完整的内容并返回
        return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
            return this.getVal(vm, args[1])
        })
    },
    model(node, expr, vm) {
        let fn = this.updater['updaterModel'];
        new Watcher(vm, expr, newVal => {
            fn(node, newVal)
        })
        node.addEventListener('input', e => {
            let value = e.target.value
            this.setValue(vm, expr, value)
        })
        let value = this.getVal(vm, expr);
        fn(node, value)
    },
    on(node, expr, vm, eventName) {
        node.addEventListener(eventName, (e) => {
            vm[expr].call(vm, e);
        })
    },
    html(node, expr, vm) {
        let fn = this.updater['updaterHtml'];
        new Watcher(vm, expr, newVal => {
            fn(node, newVal)
        })
        let value = this.getVal(vm, expr);
        fn(node, value)
    },
    text(node, expr, vm) {
        let fn = this.updater['textUpdater'];
        let content = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
            console.log(args)
            new Watcher(vm, args[1], newVal => { //给表达式每个{{}}都加上观察者
                fn(node, this.getContentValue(vm, expr));// 返回了一个全的字符串
            })
            return this.getVal(vm, args[1])
        })
        fn(node, content)
    },
    updater: {
        updaterModel(node, value) {
            node.value = value
        },
        updaterHtml(node, value) {
            node.innerHTML = value
        },
        textUpdater(node, value) {
            node.textContent = value
        }
    }
}

class Dep {
    constructor() {
        this.subs = []; //存放所有的watcher
    }
    // 订阅
    addSub(watcher) {
        this.subs.push(watcher)
    }
    // 发布
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}

class Watcher{
    constructor(vm, expr, cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        this.oldValue = this.get();
    }

    get() {
        Dep.target = this
        let value = CompileUtil.getVal(this.vm, this.expr)
        Dep.target = null
        return value
    }

    update() {
        let newVal = CompileUtil.getVal(this.vm, this.expr);
        if (newVal !== this.oldValue) {
            this.cb(newVal)
        }
    }
}