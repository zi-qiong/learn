
```
// 首先promise有三种状态，我们用常量定义
const PENDING = "PENGDING";
const FULFILLED = "filfulled"
const REJECTED = "rejected"
class Promise1 {
    constructor(handle) {
        // 初始化状态时pending
        this._status  = PENDING
        this._value = undefined
        // 保存then方法里面的函数，等到改变状态的时候去执行
        this.callBacks = []
        // 监听异常处理
        try {
        // 需要用bind去绑定this，不然执行的时候会指向window
            handle(this.resolve.bind(this), this.reject.bind(this))
        } catch (error) {
            reject(error)
        }

    }

    resolve(value) {
        // 只有在pending的时候才能去改变状态，状态不可逆
        if(this._status === PENDING) {
            this._status = FULFILLED
            this._value = value
            // 用setTimeout是因为事件循环机制，promise是微任务
            setTimeout(() => {
                // 状态改变时，执行then里面的方法
                this.callBacks.map(callBack => {
                    callBack.onFulfilled(value)
                })
            })
        }
    }

    reject(value) {
        if(this._status === PENDING) {
            this._status = REJECTED
            this._value = value
            setTimeout(() => {
                this.callBacks.map(callBack => {
                    callBack.onRejected(value)
                })
            })
        }
    }

    then(onFulfilled, onRejected) {
        // then接受两个函数作为参数，第二个函数可以传也可以不传，第一个参数可以为null
        // 为了不报错我们下面做兼容处理
        if(typeof onFulfilled !== 'function') {
        // 返回this._value是then的穿透
            onFulfilled = () => this._value
        }
        if(typeof onRejected !== 'function') {
            onRejected = () => this._value
        }
        // then方法返回的也是promise
        let promise = new Promise1((resolve, reject) => {
            // pending记录回调函数，状态改变后再去执行函数
            if(this._status === PENDING) {
                this.callBacks.push({
                    onFulfilled: (value) => {
                        this.parse(promise, onFulfilled(value), resolve, reject)
                    },
                    onRejected: (value) => {
                        this.parse(promise, onRejected(value), resolve, reject)
                    }
                })
            }
            if(this._status === FULFILLED) {
                // setTimeout也是因为微任务
                setTimeout(() => {
                    this.parse(promise, onFulfilled(this._value), resolve, reject)
                })
            }
            if(this._status === REJECTED) {
                setTimeout(() => {
                    this.parse(promise, onRejected(this._value), resolve, reject)
                })
            }
        })
        return promise;
    }
    
    //为了防止重复的代码

    parse(promise, result, resolve, reject) {
        // promise不允许返回同样的promise
        if(promise == result) {
            throw new TypeError("Chaining cycle detected")
        }
        try {
            if(result instanceof Promise1) {
                // 如果then返回的是个promise我们要做处理，只接受结果不要promise
                result.then(resolve, reject)
            } else {
                resolve(result)
            }
        } catch (error) {
            reject(error)
        }
    }

    static resolve(value) {
        // resolv也是返回的一个promise
        return new Promise1((resolve, reject) => {
            // 同parse
            if(value instanceof Promise1) {
                value.then(resolve, reject)
            } else {
                resolve(value)
            }
        })
    }

    static reject(error) {
        return new Promise1((resolve, reject) => {
            reject(error)
        })
    }

    static all(promises) {
        // 任何一个promise失败，就改变promise的状态
        return new Promise1((resolve, reject) => {
            let values = []
            promises.forEach(promise => {
                promise.then((value) => {
                    values.push(value)
                    // resolve全部成功就返回所有的value
                    if(value.length === promises.length) {
                        resolve(values)
                    }
                }, (error) => {
                    reject(error)
                })
            })
        })
        
    }

    static race(promises) {
        // 谁率先改变状态就跟着改变
        return new Promise1((resolve, reject) => {
            promises.forEach(promise => {
                Promise.then(value => {
                    resolve(value)
                }, error => {
                    reject(error)
                })
            })
        })
    }
}

new Promise1((resolve, reject) => {
    console.log(2)
    setTimeout(() => {
        console.log(3)
        resolve("成功")
        console.log(4)
    }, 1000)
    // reject("失败")
}).then().then((value) => {
    console.log(value)
}, (error) => {
    console.log('error' + error)
})

console.log(1)

new Promise((resolve, reject) => {
    console.log(2)
    setTimeout(() => {
        console.log(3)
        resolve("成功")
        console.log(4)
    }, 1000)
    // reject("失败")
}).then((value) => {
    console.log(value)
}, (error) => {
    console.log('error' + error)
})

console.log(1)
```
