// var shoObj = {} // 定义发布者
// shoObj.list = [] // 缓存列表，存放订阅者回调函数
// // 增加订阅者
// shoObj.listen = function(key,fn) { 
//     if(!this.list[key]) {
//         // 如果还没有订阅过此类消息，给该类创建一个缓存列表
//         this.list[key] = [];
//     }
//     shoObj.list[key].push(fn) // 订阅消息添加到缓存列表
// }

// shoObj.trigger = function() {
//     var key = Array.prototype.shift.call(arguments) //去除消息类型名称
//     var fns = this.listen[key];
//     if(!fns || fns.length === 0) {
//         return;
//     }
//     for(var i=0,fn; fn = fns[i++];) {
//         fn.apply(this, arguments)
//     }
// }

// // 小红订阅如下消息
// // shoObj.listen(function(color,size) {
// //     console.log("颜色是："+color);
// //     console.log("尺码是："+size)
// // })
// shoObj.listen('red', function(size) {
//     console.log("尺码是："+size); 
// })

// // 小花订阅如下消息
// // shoObj.listen(function(color, size) {
// //     console.log("再次打印颜色是："+color);
// //     console.log("再次打印尺码是："+size); 
// // })

// shoObj.trigger("red", 40)
// shoObj.trigger("block", 42)


var event = {
    list: [],
    listen: function(key, fn) {
        if(!this.list[key]) {
            this.list[key] = []
        }

        this.list[key].push(fn)
    },
    trigger: function() {
        var key = Array.prototype.shift.call(arguments);
        var fns = this.list[key]
        if(!fns || fns.length === 0) {
            return
        }
        for(var i=0,fn; fn = fns[i++];) {
            fn.apply(this.arguments)
        }
    },
    remove: function(key, fn) {
        var fns = this.list[key]
        if(!fns) {
            return false
        }
        if(!fn) {
            fn && (fns.length = 0)
        } else {
            for(var i = fns.length-1;i>=0;i--) {
                var _fn = fns[i]
                if(_fn === fn) {
                    fns.splice(i, 1) // 删除订阅者的回调函数
                }
            }
        }
    }
}

var initEvent = function(obj) {
    for(var i in event) {
        obj[i] = event[i]
    }
}

var shoObj = {}
initEvent(shoObj)

