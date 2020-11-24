console.log("start")

setTimeout(() => {
    console.log("timeOut")
}, 0)

setTimeout(() => {
    console.log("timeOut1")
}, 0)

setTimeout(() => {
    console.log("timeOut2")
}, 1)

new Promise((resolve, reject) => {
    console.log("promise start")
    resolve()
}).then(() => {
    console.log("promise success")
}).catch(() => {
    console.log("promise fail")
})

console.log("end")