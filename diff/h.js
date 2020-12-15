// Fragment和纯文本类型的tag都是空，为了区分创建一个唯一标识
const Fragment = Symbol()
const Portal = Symbol()

function normalizeVNodes(children) {
    children.map((child, index) => {
        !child.key && (child.key = '|' + index);
    })
    return children
    // const newChildren = []
    // for(let i = 0; i < children.length; i++) {
    //     const child = children[i]
    //     if(child.key = null) {
    //         child.key = "|" + i
    //     }
    //     newChildren.push(child)
    // }
    // return newChildren
}

function createTextVNode(text) {
    return {
        _isVNode: true,
        flags: VNodeFlags.TEXT,
        tag: null,
        data: null,
        children: text,
        childFlags: ChildrenFlags.NO_CHILDREN,
        el: null
    }
}

function h(tag, data = null, children = null) {
    let flags = null
    if(typeof tag === 'string') {
        flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML
    } else if(tag === Fragment) {
        flags = VNodeFlags.FRAGMENT
    } else if(tag === Portal) {
        // <template>
        //     <Portal target="#app-root">
        //         <div class="overlay"></div>
        //     </Portal>
        // </template>
        flags = VNodeFlags.PORTAL
        tag = data && data.target
    } else {
        // 兼容 Vue2 的对象式组件
        if(tag !== null && typeof tag === 'object') {
            flags = tag.functional ? VNodeFlags.COMPONENT_FUNCTIONAL : VNodeFlags.COMPONENT_STATEFUL_NORMAL
        } else if(typeof tag === 'function') {
            // Vue3 的类组件
            flags = tag.prototype && tag.prototype.render
                    ? VNodeFlags.COMPONENT_STATEFUL_NORMAL
                    : VNodeFlags.COMPONENT_FUNCTIONAL
        }
    }

    let childFlags = null
    if(Array.isArray(children)) {
        const { length } = children
        if(length === 0) {
            // 没有 children
            childFlags = ChildrenFlags.NO_CHILDREN
        } else if(length === 1) {
            // 单个子节点
            childFlags = ChildrenFlags.SINGLE_VNODE
            children = children[0]
        } else {
            // 多个子节点，且子节点使用key
            childFlags = ChildrenFlags.KEYED_VNODES
            children = normalizeVNodes(children)
        }
    } else if(children == null) {
        // 没有子节点
        childFlags = ChildrenFlags.NO_CHILDREN
    } else if(children._isVNode) {
        // 单个子节点
        childFlags = ChildrenFlags.SINGLE_VNODE
    } else {
        // 其他情况都作为文本节点处理，即单个子节点，会调用 createTextVNode 创建纯文本类型的 VNode
        childFlags = ChildrenFlags.SINGLE_VNODE
        children = createTextVNode(children, "")
    }

    return {
        _isVNode: true,
        flags: flags,
        tag: tag,
        data: data,
        children: children,
        childFlags: childFlags,
        el: null
    }
}