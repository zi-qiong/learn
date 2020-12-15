import Element from './element';

function createElement(type, props, children) {
    return new Element(type, props, children)
}

function setAttrs(node, prop, value) {
    switch(prop) {
        case 'value':
            if(['INPUT', 'TEXTAREA'].includes(NODE.TAG.tagName)) {
                node.value = value
            } else {
                node.setAttribute(prop, value)
            }
            break
        case 'style':
            node.style.cssText = value
        default:
            node.setAttribute(prop, value)
    }
}

function render(vDom) {
    const { type, props, children } = vDom
    const el = document.createElement(type)

    for(let key in props) {
        setAttrs(el, key, props[key])
    }

    console.log(children)

    children.map(child => {
        child = child instanceof Element ? render(child) : document.createTextNode(child);
        child && el.appendChild(child)
    })
    return el
}

function renderDom(el, rootEl) {
    rootEl.appendChild(el)
}

export {
    createElement,
    render,
    setAttrs,
    renderDom
}
