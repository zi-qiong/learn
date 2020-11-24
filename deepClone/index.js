function deepClone(source) {
    if(typeof source !== "object") return;
    let target = source.constructor === Array ? [] : {};
    for(let key in source) {
        if(source.hasOwnProperty(key)) {
            // target[key] = typeof source[key] === 'object' ? deepClone(source[key]) : source[key]
            if(source[key] && typeof source[key] === 'object') {
                target[key] = deepClone(source[key])
            } else {
                target[key] = source[key]
            }
        }
    }
    return target
}

// 循环引用a.circleRef = a;会报错

function deepClone(source, hash = new WeakMap()) {
    if(typeof source !== Object && source === null) return;
    if(hash.has(source)) {
        return hash.get(source)
    }
    let target = source.constructor === Array ? [] : {}
    hash.set(source, target)
    console.log(hash)
    for(let key in source) {
        if(source.hasOwnProperty(key)) {
            // Object.prototype.hasOwnProperty.call(source, key)
            if(source[key] && typeof source[key] === 'object') {
                target[key] = deepClone(source[key], hash)
            } else {
                target[key] = source[key]
            }
        }
    }
    return target
}

let a = {
    name: [1, 2, 3]
}

a.a = a
console.log(a)
let b = deepClone(a)
console.log(a)
console.log(b)