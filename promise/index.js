// 判断是否是函数

const isFunction = fn => typeof fn === "function"

class Promise {
    constructor(handle) {
        if (!isFunction(handle)) {
            // 不是函数就抛出错误
            throw new Error("Promise must accept a function as a parameser")
        }

        this._status = "pending"
        this._value = undefined

        try {
            handle(this._resolve.bind(this), this._reject.bind(this)) 
        } catch (err) {
            this._reject(err)
        }
    }

    _resolve(val) {
        if(this._status !== "pending") return

        this._status = "fulfilled"
        this._value = val
    }

    _resolve(err) {
        if(this._status !== "pending") return

        this._status = "rejected"
        this._value = err
    }
}

new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("resolve")
    }, 1000)
})