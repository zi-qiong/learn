import 'core-js/modules/es.object.to-string.js';
import 'core-js/modules/es.promise.js';
import 'core-js/modules/web.timers.js';
// import '@babel/polyfill';
import data from './data.json';
import './index.css';
import './index.less';
import './assets/font/iconfont.css'; // 下一行不进行eslint检查
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
