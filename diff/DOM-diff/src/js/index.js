import { createElement, render, renderDom } from './virtualDom';

const vDom = createElement('ul', {
    class: 'list',
    style: 'width: 300px; height: 300px; background-color: red'
}, [
    createElement('li', {
        class: 'item'
    }, ['第一个列表项']),
    createElement('li', {
        class: 'item'
    }, ['第二个列表项']),
    createElement('li', {
        class: 'item'
    }, [
        createElement('span', {}, ['第三个列表的span'])
    ])
])

let rDom = render(vDom)
console.log(rDom, 'rDom')
console.log(vDom)

renderDom(rDom, document.getElementById('app'))

const patches = domDiff(vDom1, vDom2)

console.log(patches)