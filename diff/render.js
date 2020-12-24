function render(vnode, container) {
    const prevVNode = container.vnode
    if(prevVNode == null) {
        mount(vnode, container)
        container.vnode = vnode
    } else {
        if(vnode) {
            patch(prevVNode, vnode, container)
            container.vnode = vnode
        } else {
            container.removeChild(prevVNode.el)
            container.vnode = null
        }
    }
}

function mount(vnode, container, isSVG) {
    const { flags } = vnode
    if(flags & VNodeFlags.ELEMENT) {
        mountElement(vnode, container, isSVG)
    } else if(flags & VNodeFlags.COMPONENT) {
        mountComponent(vnode, container, isSVG)
    } else if(flags & VNodeFlags.TEXT) {
        mountText(vnode, container)
    } else if(flags & VNodeFlags.FRAGMENT) {
        mountFragment(vnode, container, isSVG)
    } else if(flags & VNodeFlags.PORTAL) {
        mountPortal(vnode, container)
    }
}

const domPropsRE = /\[A-Z]|^(?:value|checked|selected|muted)$/
function mountElement(vnode, container, isSVG) {
    isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG
    const el = isSVG 
                ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
                : document.createElement(vnode.tag)
    const data = vnode.data
    vnode.el = el
    if(data) {
        for(let key in data) {
            patchData(el, key, null, nextVNode)
        }
    }

    const childFlags = vnode.childFlags
    const children = vnode.children

    if(childFlags !== ChildrenFlags.NO_CHILDREN) {
        if(childFlags & ChildrenFlags.SINGLE_VNODE) {
            mount(children, el, isSVG)
        } else if(childFlags & ChildrenFlags.MULTIPLE_VNODE) {
            for(let i = 0; i < children.length; i++) {
                mount(children[i], el, isSVG)
            }
        }
    }
    container.appendChild(el)
}

function mountText(vnode, container) {
    const el = document.createTextNode(vnode.children)
    vnode.el = el
    container.appendChild(el)
}

function mountFragment(vnode, container, isSVG) {
    const { children, childFlags } = vnode

    switch(childFlags) {
        case ChildrenFlags.SINGLE_VNODE:
            mount(children, container, isSVG)
            break
        case ChildrenFlags.NO_CHILDREN:
            const placeholder = createTextVNode('')
            mountText(placeholder, container)
        default:
            for(let i = 0; i < children.length; i++) {
                mount(children[i], container, isSVG)
            }
    }
}

function mountPortal(vnode, container) {
    const { tag, children, childFlags } = vnode
    const target = typeof tag === 'string' ? document.querySelector(tag) : tag
    debugger
    if(childFlags & ChildrenFlags.SINGLE_VNODE) {
        mount(children, target)
    } else if(childFlags & ChildrenFlags.MULTIPLE_VNODE) {
        for(let i = 0; i < children.length; i++) {
            mount(children[i], target)
        }
    }

    const placeholder = createTextVNode('')
    mountText(placeholder, container, null)
    vnode.el = placeholder.el
}

function mountComponent(vnode, container, isSVG) {
    if(vnode.flags & VNodeFlags.COMPONENT_STATEFUL) {
        mountStatefulComponent(vnode, container, isSVG)
    } else {
        mountFunctionalComponent(vnode, container, isSVG)
    }
}

// 有状态组件
// 自身的state变化触发主动更新
// 父元素的props变化触发被动更新
function mountStatefulComponent(vnode, container, isSVG) {
    // 创建组件实例
    const instance = (vnode.children = new vnode.tag())
    instance._update = function() {
        // 如果 instance._mounted 为真，说明组件已挂载，应该执行更新操作
        if(instance._mounted) {
            const prevVNode = instance.$vnode
            const nextVNode = (instance.$vnode = instance.render())
            patch(prevVNode, nextVNode, prevVNode.el.parentNode)
            instance.$el = vnode.el = instance.$vnode.el
        } else {
            instance.$vnode = instance.render()
            mount(instance.$vnode, container, isSVG)
            instance._mounted = true
            instance.$el = vnode.el = instance.$vnode.el
            instance.mounted && instance.mounted()
        }
    }
    instance._update()
}

function mountFunctionalComponent(vnode, container, isSVG) {
    const $vnode = vnode.tag()
    mount($vnode, container, isSVG)
    vnode.el = $vnode.el
}

function patchData(el, key, prevValue, nextValue) {
    switch(key) {
        case 'style':
            for(let k in nextValue) {
                el.style[k] = nextValue[k]
            }
            for(let k in prevValue) {
                if (!nextValue.hasOwnProperty(k)) {
                    el.style[k] = ''
                }
            }
            break
        case 'class':
            el.className = nextValue
        default: 
            if(key[0] === 'o' && key[1] === 'n') {
                if(prevValue) {
                    el.removeEventListener(key.slice(2), prevValue)
                }
                if(nextValue) {
                    el.addEventListener(key.slice(2), nextValue)
                }
            } else if(domPropsRE.test(key)) {
                el[key] = nextValue
            } else {
                el.setAttribute(key, nextValue)
            }
            break
    }
}