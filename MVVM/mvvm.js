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
            let {name, value} = attr;
            // 判断是不是指令
            if(this.isDirective(name)) {
                // console.log(node);
                let [, directive] = name.split('-');
                CompileUtil[directive](node, value, this.vm);
            }
            // console.log(name, value)
        })
    }
    // 编译文本 判断文本节点内容中是否包含{{}}
    compilText(node) {
        let content = node.textContent;
        // console.log(content)
        if(/\{\{(.+?)\}\}/.test(content)) {
            console.log(content)//找到所有文本
        }
    }
    // 编译内存中的dom节点
    compil(node) {
        let childNodes = node.childNodes;
        // console.log(childNodes, 'childNodes');
        [...childNodes].forEach(child => {
            if(this.isElementNode(child)) {
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
        return expr.split('.').reduce((data, current) => {
            return data[current];
        }, vm.$data)
    },
    // 节点 表达式 当前实例
    model(node, expr, vm) {
        // 双向绑定 node.value = xxx
        let fn = this.updater['modelUpdater']
        let value = this.getValue(vm, expr)
        fn(node, value)
        
    },
    updater: {
        modelUpdater(node, value) {
            node.value = value
        }
    }

}

class Vue {
    constructor(options) {
        // this.$el $data $options
        this.$el = options.el;
        this.$data = options.data;

        if (this.$el) {
            new Compiler(this.$el, this);
        }
    }


}