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
            switch(key) {
                case 'style':
                    for(let k in data.style) {
                        el.style[k] = data.style[k]
                    }
                    break
                case 'class':
                    el.className = data[key]
                    break
                default:
                    if(key[0] === 'o' && key[1] === 'n') {
                        el.addEventListener(key.slice(2), data[key])
                    }else if(domPropsRE.test(key)) {
                        el[key] = data[key]
                    } else  {
                        el.setAttribute(key, data[key])
                    }
            }
            
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

function mountStatefulComponent(vnode, container, isSVG) {
    const instance = new vnode.tag()
    instance.$vnode = instance.render()
    mount(instance.$vnode, container, isSVG)
    instance.$el = vnode.el = instance.$vnode.el
}

function mountFunctionalComponent(vnode, container, isSVG) {
    const $vnode = vnode.tag()
    mount($vnode, container, isSVG)
    vnode.el = $vnode.el
}