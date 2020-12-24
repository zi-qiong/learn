function patch(prevVNode, nextVNode, container) {
    const nextFlags = nextVNode.flags
    const prevFlags = prevVNode.flags
    // 检查新旧 VNode 的类型是否相同，如果类型不同，则直接调用 replaceVNode 函数替换 VNode
    // 如果新旧 VNode 的类型相同，则根据不同的类型调用不同的比对函数
    if(prevFlags!== nextFlags) {
        replaceVNode(prevVNode, nextVNode, container)
    } else if(nextFlags & VNodeFlags.ELEMENT) {
        patchElement(prevVNode, nextVNode, container)
    } else if(nextFlags & VNodeFlags.COMPONENT) {

    } else if(nextFlags & VNodeFlags.TEXT) {
        patchText(prevVNode, nextVNode)
    } else if(nextFlags & VNodeFlags.FRAGMENT) {
        patchFragment(prevVNode, nextVNode, container)
    } else if(nextFlags & VNodeFlags.PORTAL) {
        patchPortal(prevVNode, nextVNode)
    }
}

function replaceVNode(prevVNode, nextVNode, container) {
    container.removeChild(prevVNode.el)
    mount(nextVNode, container)
}

function patchElement(prevVNode, nextVNode, container) {
    if(prevVNode.tag !== nextVNode.tag) {
        replaceVNode(prevVNode, nextVNode, container)
        return
    }

    const el =  (nextVNode.el = prevVNode.el)
    const prevData = prevVNode.data
    const nextData = nextVNode.data

    if(nextData) {
        for(let key in nextData) {
            const prevValue = prevData[key]
            const nextValue = nextData[key]
            patchData(el, key, prevValue, nextValue)
        }
    }
    if(prevData) {
        for(let key in prevData) {
            const prevValue = prevData[key]
            if(prevValue && !nextData.hasOwnProperty(key)) {
                patchData(el, key, prevValue, null)
            }
        }
    }

    patchChildren(
        prevVNode.childFlags,
        nextVNode.childFlags,
        prevVNode.children,
        nextVNode.children,
        container
    )
}

function patchChildren(
    prevChildFlags,
    nextChildFlags,
    prevChildren,
    nextChildren,
    container
) {
    switch(prevChildFlags) {
        case ChildrenFlags.SINGLE_VNODE:
            switch(nextChildFlags) {
                case ChildrenFlags.SINGLE_VNODE:
                    patch(prevChildren, nextChildren, container)
                    break
                case ChildrenFlags.NO_CHILDREN:
                    container.removeChild(prevChildren.el)
                    break
                default: 
                    container.removeChild(prevChildren.el)
                    for(let i = 0; i < nextChildren.length; i++) {
                        mount(nextChildren[i], container)
                    }
                    break
            }
            break
        case ChildrenFlags.NO_CHILDREN:
            switch(nextChildFlags) {
                case ChildrenFlags.SINGLE_VNODE:
                    mount(nextChildren, container)
                    break
                case ChildrenFlags.NO_CHILDREN:
                    // 什么都不做
                    break
                default: 
                    for(let i = 0; i < nextChildren.length; i++) {
                        mount(nextChildren[i], container)
                    }
                    break
            }
            break
        default:
            switch(nextChildFlags) {
                case ChildrenFlags.SINGLE_VNODE:
                    for(let i = 0; i < prevChildren.length; i++) {
                        container.removeChild(prevChildren[i], el)
                    }
                    mount(nextChildren, container)
                    break
                case ChildrenFlags.NO_CHILDREN:
                    for(let i = 0; i < prevChildren.length; i++) {
                        container.removeChild(prevChildren[i], el)
                    }
                    break
                default: 
                    for(let i = 0; i < prevChildren.length; i++) {
                        container.removeChild(prevChildren[i], el)
                    }
                    for(let i = 0; i < nextChildren.length; i++) {
                        mount(prevChildren[i], container)
                    }
                    break
            }
            break
    }
}

function patchText(prevVNode, nextVNode) {
    const el = (nextVNode.el =  prevVNode.el)
    if(nextVNode.children !== prevVNode.children) {
        el.nodeVlaue = nextVNode.children
    }
}

function patchFragment(prevVNode, nextVNode, container) {
    patchChildren(
        prevVNode.childFlags,
        nextVNode.childFlags,
        prevVNode.children,
        nextVNode.children,
        container
    )

    switch(nextVNode.childFlags) {
        case ChildrenFlags.SINGLE_VNODE:
            nextVNode.el = nextVNode.children.el
            break
        case ChildrenFlags.NO_CHILDREN:
            nextVNode.el = prevVNode.el
            break
        default:
            nextVNode.el = nextVNode.children[0].el
    }
}

function patchPortal(prevVNode, nextVNode) {
    patchChildren(
        prevVNode.childFlags,
        nextVNode.childFlags,
        prevVNode.children,
        nextVNode.children,
        prevVNode.tag
    )

    nextVNode.el = prevVNode.el
    if(nextVNode.tag !== prevVNode.tag) {
        const container = typeof nextVNode.tag === 'string'
                ? document.querySelector(nextVNode.tag)
                : nextVNode.tag
        switch (nextVNode.childFlags) {
            case ChildrenFlags.SINGLE_VNODE:
                container.appendChild(nextVNode.children.el)
                break
            case ChildrenFlags.NO_CHILDREN:
                break
            default:
                for(let i=0; i < nextVNode.children.length; i++) {
                    container.appendChild(nextVNode.children[i].el)
                }
                break
        }
    }
}

function patchComponent(prevVNode, nextVNode, container) {
    if (nextVNode.flags & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
        // 1、获取组件实例
        const instance = (nextVNode.children = prevVNode.children)
        // 2、更新props
        instance.$props = nextVNode.data
        // 3、更新组件
        instance._update()
    }
}