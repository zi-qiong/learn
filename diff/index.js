// const elementVnode = h(
//   'div',
//   {
//     style: {
//       height: '100px',
//       width: '100px',
//       background: 'red'
//     }
//   },
//   h('div', {
//     style: {
//       height: '50px',
//       width: '50px',
//       background: 'green'
//     }
//   })
// )

// const elementVnode = h('input', {
//   class: 'cls-a',
//   type: 'checkbox',
//   checked: true,
//   custom: '1'
// })

// function handler() {
//   alert('click me')
// }

// // VNode
// const elementVnode = h('div', {
//   style: {
//     width: '100px',
//     height: '100px',
//     backgroundColor: 'red'
//   },
//   // 点击事件
//   onclick: handler
// }, h(Portal, { target: '#portal-box' }, [
//   h('span', null, '我是标题1......'),
//   h('span', null, '我是标题2......')
// ]))

// console.log(elementVnode)

// render(elementVnode, document.getElementById('app'))

// class MyComponent {
//   render() {
//     return h(
//       'div',
//       {
//         style: {
//           background: 'green'
//         }
//       },
//       [
//         h('span', null, '我是组件的标题1......'),
//         h('span', null, '我是组件的标题2......')
//       ]
//     )
//   }
// }

// // h 函数的第一个参数是组件类
// const compVnode = h(MyComponent)
// console.log(compVnode)
// render(compVnode, document.getElementById('app'))


const prevVNode = h('div', {
  style: {
    width: '100px',
    height: '100px',
    backgroundColor: 'red'
  }
})

// 新的 VNode
const nextVNode = h('div', {
  style: {
    width: '100px',
    height: '100px',
    border: '1px solid green'
  }
})

// 先后渲染新旧 VNode 到 #app
render(prevVNode, document.getElementById('app'))
render(nextVNode, document.getElementById('app'))
