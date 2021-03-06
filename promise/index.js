
const PENDING = "PENGDING";
const FULFILLED = "filfulled"
const REJECTED = "rejected"
class Promise1 {
    constructor(handle) {
        this._status  = PENDING
        this._value = undefined
        this.callBacks = []

        try {
            handle(this.resolve.bind(this), this.reject.bind(this))
        } catch (error) {
            reject(error)
        }

    }

    resolve(value) {
        if(this._status === PENDING) {
            this._status = FULFILLED
            this._value = value
            setTimeout(() => {
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
        if(typeof onFulfilled !== 'function') {
            onFulfilled = () => this._value
        }
        if(typeof onRejected !== 'function') {
            onRejected = () => this._value
        }
        let promise = new Promise1((resolve, reject) => {
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

    parse(promise, result, resolve, reject) {
        if(promise == result) {
            throw new TypeError("Chaining cycle detected")
        }
        try {
            if(result instanceof Promise1) {
                result.then(resolve, reject)
            } else {
                resolve(result)
            }
        } catch (error) {
            reject(error)
        }
    }

    static resolve(value) {
        return new Promise1((resolve, reject) => {
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