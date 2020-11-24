
```
let person = {
    name: "jack"
}

let sayName = function(age, sex) {
    console.log(age)
    console.log(sex)
    console.log(this.name)
}

Function.prototype.call1 = function(context) {
    // 如果context不存在，this就指向的window
    var context = Object(context) || window

    context.fn = this

    let len = arguments.length; //arguments不是数组，只有length和索引，没得数组所含有的方法
    let arr = []

    for(let i=1; i < len; i++) {
        arr.push(arguments[i])
    }

    let result = context.fn(...arr)
    delete context.fn

    return result
}

Function.prototype.apply1 = function(context, arr) {
    var context = Object(context) || window

    context.fn = this

    let result;

    // 没有传值就直接执行
    if(!arr) {
        result = context.fn()
    } else {
        result = context.fn(...arr)
    }

    delete context.fn
    return result
}

sayName.apply1(person, [10, "男"])
sayName.call1(person, 10, "男")

//  bind() 方法创建一个新的函数，当被调用时，将this关键字设置为提供的值
Function.prototype.bind1 = function(oThis) {
    var aArgs = Array.prototype.slice.call(arguments, 1);
    var fToBind = this;
    var fNOP = function() {}

    var fBound = function() {
        fBound.prototype = this instanceof fNOP ? new fNOP : fBound.prototype;
        return fToBind.apply(this instanceof fNOP ? this : oThis || this, aArgs )
    }

    if(this.prototype) {
        fNOP.prototype = this.prototype
    }

    return fBound
}

function Person(name) {
    this.name = name
    this.sayName = function() {
        setTimeout(function() {
            console.log(this.name)
        }.bind(this), 100)
    }
}

let p1 = new Person('jack')
p1.sayName()
```


/* 总结
* 三者都是用来改变函数的this指向
* 三者的第一个参数都是this指向的对象
* bind是返回一个绑定函数可稍后执行，call、apply是立即调用
* 三者都可以给定参数传递
* call给定参数需要将参数全部列出，apply给定参数数组
*/