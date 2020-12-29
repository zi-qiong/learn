import 'core-js/modules/es.object.to-string.js';
import 'core-js/modules/es.promise.js';
import 'core-js/modules/web.timers.js';

import $ from "jquery";
console.log($)

// import print from "./print";
// print()

console.log('index.js文件被加载了')
// import '@babel/polyfill';
import data from './data.json';
import './index.css';
import './index.less';
import './assets/font/iconfont.css'; // 下一行不进行eslint检查y
// eslint-disable-next-line

console.log(data);

function add(x, y) {
  return x + y;
} // eslint-disable-next-line

console.log(add(1, 2)); // 不做浏览器兼容处理的话，输出的代码还是es语法
// es6的语法，在不支持es6的浏览器会报错

const add2 = function add2(x, y) {
  return x + y;
};

console.log(add2(1, 2));
const promise = new Promise((resolve) => {
  setTimeout(() => {
    console.log('定时器执行完成');
    resolve();
  }, 1000);
});
console.log(promise);

if (module.hot) {
  // 一旦module.hot为true，说明开始了HMR功能，-->让HMR功能代码生效
  module.hot.accept('./print.js', function () {
    // 方法会监听print.js文件的变化，一旦发生变化，其他模块不会重新打包构建，会执行后面的回调函数
    print()
  })
}

document.getElementById('btn').onclick = function () {
  // 懒加载 异步回调函数：当文件使用时才加载
  // 预加载 prefetch：会在使用之前，提前加载js文件
  // 正常加载可以认为是并行加载（同一时间加载多个文件），预加载prefetch 等其他资源加载完毕，浏览器空闲了，再偷偷加载资源（兼容性比较差）
  import(/* webpackChunkName: 'test', webpackPrefetch: true */'./print').then(({print}) => {
    print()
  })
}

if('serviceWorker' in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register('/service-worker.js')
    .then(() => {
      console.log('成功')
    })
    .catch(() => {
      console.log('失败')
    })
  })
}