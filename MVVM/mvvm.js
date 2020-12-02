class Compiler {
    constructor(el, vm) {
        // 判断el属性是㐊一个元素，不是元素就获取
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        // console.log(this.el)
        // 把当前节点的元素获取到放到内存中,减少回流和重绘
        this.vm = vm;
        let fragment = this.node2fragment(this.el)

        // 把节点中的内容替换
        // 编译模板，用数据编译
        this.compil(fragment);
        // 把节点塞到页面中
        this.el.appendChild(fragment)
    }
    isElementNode(node) { //是不是元素节点
        return node.nodeType === 1
    }
    // 把节点移动到内存中
    node2fragment(node) {
        // 创建一个文档碎片
        let fragment = document.createDocumentFragment();
        let firstChild;
        while (firstChild = node.firstChild) {
            // appendChild具有移动性
            // console.log(firstChild)
            fragment.appendChild(firstChild);
        }
        return fragment;
    }
    isDirective(attrName) {
        return attrName.startsWith("v-");
    }
    // 编译元素
    compilElement(node) {
        let attributes = node.attributes;
        // console.log(attributes, 'attributes');
        [...attributes].forEach(attr => {
            let { name, value } = attr;
            // 判断是不是指令
            if (this.isDirective(name)) {
                // console.log(node);
                let [, directive] = name.split('-');
                let [directiveName, eventName] = directive.split(":")
                CompileUtil[directiveName](node, value, this.vm, eventName);
            }
            // console.log(name, value)
        })
    }
    // 编译文本 判断文本节点内容中是否包含{{}}
    compilText(node) {
        let content = node.textContent;
        // console.log(content)
        if (/\{\{(.+?)\}\}/.test(content)) {
            console.log(content)//找到所有文本
            CompileUtil['text'](node, content, this.vm);
        }
    }
    // 编译内存中的dom节点
    compil(node) {
        let childNodes = node.childNodes;
        // console.log(childNodes, 'childNodes');
        [...childNodes].forEach(child => {
            if (this.isElementNode(child)) {
                // console.log('element', child)
                // 如果是元素的话 需要把自己传进去 再去遍历子节点
                this.compilElement(child)
                this.compil(child)
            } else {
                // console.log('text', child)
                this.compilText(child)
            }
        })
    }
}

CompileUtil = {
    // 根据表达式取到对应的数据
    getValue(vm, expr) {
        let arr = expr.split(".");
        return arr.reduce((data, current) => {
            return data[current];
        }, vm.$data)
    },
    setValue(vm, expr, value) {
        expr.split('.').reduce((data, current, index, arr) => {
            if (index === arr.length - 1) {
                data[current] = value
            }
            return data[current];
        }, vm.$data)
    },
    // 节点 表达式 当前实例
    model(node, expr, vm) {
        // 双向绑定 node.value = xxx
        let fn = this.updater['modelUpdater']
        new Watcher(vm, expr, newVal => { //给输入框加一个观察者，如果稍后数据更新了会触发此方法，会拿新值
            fn(node, newVal)
        })
        node.addEventListener('input', e => {
            let value = e.target.value
            this.setValue(vm, expr, value)
        })
        let value = this.getValue(vm, expr)
        fn(node, value)
    },
    getContentValue(vm, expr) {
        // 遍历表达式，将内容重新替换成一个完整的内容并返回
        return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
            return this.getValue(vm, args[1])
        })
    },
    text(node, expr, vm) {
        let fn = this.updater['textUpdater']
        let content = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
            new Watcher(vm, args[1], newVal => { //给表达式每个{{}}都加上观察者
                fn(node, this.getContentValue(vm, expr));// 返回了一个全的字符串
            })
            return this.getValue(vm, args[1])
        })
        fn(node, content)
    },
    on(node, expr, vm, eventName) {
        node.addEventListener(eventName, (e) => {
            vm[expr].call(vm, e);
        })
    },
    html(node, expr, vm) {
        let fn = this.updater['htmlUpdater'];
        // new Watcher(vm, expr, )
        new Watcher(vm, expr, newVal => {
            fn(node, newVal)
        })
        let value = this.getValue(vm, expr)
        fn(node, value)
    },
    updater: {
        modelUpdater(node, value) {
            node.value = value
        },
        textUpdater(node, value) {
            node.textContent = value
        },
        htmlUpdater(node, value) { // xss攻击
            node.innerHTML = value
        }
    }
}

class Vue {
    constructor(options) {
        // this.$el $data $options
        this.$el = options.el;
        this.$data = options.data;
        let computed = options.computed;
        let methods = options.methods;

        if (this.$el) {
            // 把数据全部转化成 Object.defineProperty来定义
            new Observer(this.$data);

            for (let key in computed) {
                Object.defineProperty(this.$data, key, {
                    get: () => {
                        return computed[key].call(this)
                    }
                })
            }
            for (let key in methods) {
                Object.defineProperty(this, key, {
                    get() {
                        return methods[key]
                    }
                })
            }
            //把数据获取操作 vm上的取值操作都代理到vm.$data
            this.proxyVm(this.$data);
            console.log(this.$data);
            new Compiler(this.$el, this);
        }
    }

    proxyVm(data) {
        for (let key in data) {
            Object.defineProperty(this, key, { // 实现可以通过vm取到对应的内容
                get() {
                    return data[key]; //进行了转换效果
                },
                set(newVal) {
                    data[key] = newVal
                }
            })
        }
    }
}

class Dep {
    constructor() {
        this.subs = []; //存放所有的watcher
    }

    //订阅 
    addSub(watcher) { //添加watcher 
        this.subs.push(watcher);
    }

    // 发布
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}
// 观察者 【发布订阅】 观察者 被观察者
class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        // 默认你先存放一个老值
        this.oldValue = this.get();
    }

    get() {
        Dep.target = this;
        let value = CompileUtil.getValue(this.vm, this.expr);
        Dep.target = null;
        return value;
    }

    update() { //更新操作 数据变化后 会调用观察者的update方法
        let newVal = CompileUtil.getValue(this.vm, this.expr);
        if (newVal !== this.oldValue) {
            this.cb(newVal)
        }
    }
}
// vm.$watch(vm, "school.name", (newVal) => {})
//数据劫持
class Observer {
    constructor(data) {
        this.observer(data)
    }

    observer(data) {
        if (data && typeof data == 'object') {
            for (let key in data) {
                this.defineReactive(data, key, data[key])
            }
        }
    }

    defineReactive(obj, key, value) {
        this.observer(value);
        let dep = new Dep();//给每个属性都加上一个具有发布订阅的功能
        Object.defineProperty(obj, key, {
            get() {
                // 创建watcher时， 会取到对应的内容，并且把Watcher放到全局上
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set: (newVal) => {
                if (value !== newVal) {
                    this.observer(newVal)
                    value = newVal;
                    dep.notify();
                }
            }
        })
    }
}