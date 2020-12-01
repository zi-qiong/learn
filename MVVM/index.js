let obj = {};
let song = '发如雪'; 
obj.singer = '周杰伦';

Object.defineProperty(obj, 'music', {
    configurable: true, // 可以删除
    // writable: true, // 可以修改
    enumerable: true, // 可以枚举
    get() {
        return song;
    },
    set(val) {
        song = val;
    }
});

console.log(obj)

delete obj.music

console.log(obj)