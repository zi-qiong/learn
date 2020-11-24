### JavaScript是单线程执行的：一个进程里面只有一个主线程

### 概念

执行依赖环境的，在浏览器和node环境下是有区别的

javaScript有一个主进程和调用栈，所有的任务都会放到调用栈中等待主进程执行

Event Loop 是伴随整个文件的生命周期，只要javaScript在运行中，就会一直循环，去任务队列(event queue)中去执行（队列是先进先出）

- 同步任务就是可以看成每个代码都是一个task queue 
- 异步任务就是进入到事件表（Event Table）并注册相对应的回调函数，异步任务完成后，会将这个函数从event Table移动到 event queue，等主线程任务执行完了后会从event queue中读取任务然后执行

### 宏任务（macroTask）和微任务（MicroTask）

macroTask：setTimeout、setInterval、I/O、UI Rendering 等都是宏任务

microTask: Process.nextTick、Promise.then catch、finally、MutationObserver

### 浏览器

**setTimeout**，等多场事件来执行这个函数，但是也是要等到主进程先执行完


```
let startTime = new Date().getTime();

console.log({startTime})

// 执行到setTimeout的时候会放到event Table，并注册回调函数，在1s后吧回调函数移动到event queue
setTimeout(()=>{
  console.log(`开始执行回调的相隔时差：${new Date().getTime()-startTime}`);
},1000);

// 下面的for循环在1s后还没执行完，上面的setTimeout里面的回调函数已经在event queue了，但是还是需要等待下面执行完才会去执行回调
for(let i = 0;i<40000;i++){
  console.log(1)
}
```
**setInterval** 每间隔多少秒将回调函数放入到event queue，**一旦 setInterval 的回调函数fn执行时间超过了xx ms，那么就完全看不出来有时间间隔了**

**Promise** 是微任务，会在宏任务之前先去执行

一次事件循环回来后，开始去执行 Event Queue 中的 task，但是这里的 task 有优先级。所以优先执行 MicroTask Queue 中的 task ，执行完后在执行MacroTask Queue 中的 task

### Node  
// 暂时看不懂


[参考文档](https://juejin.cn/post/6844903955286196237#heading-8)