// 防抖
function delay(fn, delay) {
    let timer;//借助闭包

    return function() {
        if(timer) { // 如果存在timer就清除
            clearTimeout(timer)
        }
        // 清除上个timer后再加个，如果后面
        timer = setTimeout(() => {
            fn()
        }, delay)
    }
}

// 节流
function throttle(fn, delay) {
    let valid = true
    return function() {
        // valid = false 的时候不会执行直接返回
        if(!valid) {
            return false
        }
        // valid = false 用于上面函数不执行
        valid = false
        setTimeout(() => {
            fn()
            valid = true
        }, delay)
    }
}