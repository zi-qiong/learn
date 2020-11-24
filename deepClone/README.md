###  基础知识
- 堆：栈，只允许在一段进行插入或者删除操作的线性表，是一种先进后出的数据结构。
- 栈：堆是基于散列算法的数据结构
- 队列：先进先出

### js的数据类型

- 基本数据类型：Boolean、String、Number、undefined、null、Symbol
- 引用数据类型：Array、Object


两种数据类型所存储的位置就不一样：基本数据类型都是一些简单的数据段，它们是存储在栈内存中，引用数据类型栈内存中保存了一个地址，这个地址和堆内存中的实际值是相关的

> **为什么基础数据类型存在栈中，而引用数据类型存在堆中呢？**

1. 堆比栈大，栈比对速度快
1. 基本数据类型比较稳定，而且相对占用内存小
1. 引用数据类型大小是动态的，而且是无线的
1. 堆内存是无序存储，可以根据引用直接获取


### 浅拷贝（深浅拷贝都只是针对引用数据类型）

浅拷贝只是赋值了引用，而没有真正赋值值，改变原来的值，复制的也会随着改变


```
let obj = {
    name: "Jack",
    age: 20,
    sex: "男"
}

let obj1 = obj

obj.age = 21 //只改变了obj但是obj1会跟着改变

console.log(obj)
// { name: 'Jack', age: 21, sex: '男' }
console.log(obj1)
// { name: 'Jack', age: 21, sex: '男' }


let arr = ['jack', 'rose', 'sicily']
let arr1 = arr

arr1[0] = 'jack1'

console.log(arr)
// [ 'jack1', 'rose', 'sicily' ]
console.log(arr1)
// [ 'jack1', 'rose', 'sicily' ]
```
### 深拷贝就是对目标的完全拷贝，老死不相往来，谁也不会影响谁

实现深拷贝的方法不多，主要有两种

##### 1、利用JSON对象种的parse和stringify

**undefined、function、symbol在转换过程中会被忽略**

```
let arr = ['jack', 'rose', 'sicily']
let arr1 = JSON.parse(JSON.stringify(arr))

arr1[0] = 'jack1'

console.log(arr)
// [ 'jack', 'rose', 'sicily' ]
console.log(arr1)
// [ 'jack1', 'rose', 'sicily' ]


let obj = {
    name: "Jack",
    age: 20,
    sex: "男",
    sayName: function() {
        console.log(this.name)
    }
}

// undefined、function、symbol在转换过程中会被忽略
let obj1 = JSON.parse(JSON.stringify(obj))

console.log(obj)
//{ name: 'Jack', age: 20, sex: '男', sayName: [Function: sayName] }
console.log(obj1)
//{ name: 'Jack', age: 20, sex: '男' }
```


##### 2、利用递归来实现每一层都重新创建对象并赋值


```
function deepClone(source) {
    if(typeof source !== "object" && source === null) return source;
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
```

### javaScript中拷贝方法

**数组：concat和slice**

concat：链接两个或多个数组并返回新数组，但是多层的时候改变拷贝数组会影响原数组，结论是只对数组第一层进行了深拷贝


```
let arrConcat = ['jack', 'rose', 'sicily']
let arrConcat1 = arrConcat.concat()
arrConcat[0] = 'jack1'

console.log(arrConcat)
// [ 'jack1', 'rose', 'sicily' ]
console.log(arrConcat1)
// [ 'jack', 'rose', 'sicily' ]

let arrConcat = [{name: 'jack'}, [10, 21, 22], 'sicily']
let arrConcat1 = arrConcat.concat()
arrConcat[0].name = 'jack1'

console.log(arrConcat)
// [ { name: 'jack1' }, [ 10, 21, 22 ], 'sicily' ]
console.log(arrConcat1)
// [ { name: 'jack1' }, [ 10, 21, 22 ], 'sicily' ]
```

slice：从已有的数组中返回选定的元素，并返回一个新数组，但是拷贝的效果跟concat效果一样

**对象：Object.assign()、... 展开运算符**

上面两个也是对对象第一层的深拷贝，后面的都是拷贝引用值

```
let obj = {
    name: "Jack",
    age: 20,
    sex: "男",
    sayName: function() {
        console.log(this.name)
    }
}

let obj1 = Object.assign({}, obj)
obj1.name = "jack1"
console.log(obj)
// { name: 'Jack', age: 20, sex: '男', sayName: [Function: sayName] }
console.log(obj1)
// { name: 'jack1', age: 20, sex: '男', sayName: [Function: sayName] }

let obj = {
    name: {
        name1: "Jack"
    },
    age: [20, 21, 22],
    sex: "男"
}

let obj1 = Object.assign({}, obj)
obj1.name.name1 = "jack1"
console.log(obj)
// { name: { name1: 'jack1' }, age: [ 20, 21, 22 ], sex: '男' }
console.log(obj1)
// { name: { name1: 'jack1' }, age: [ 20, 21, 22 ], sex: '男' }
```

最后可以自己想想浅拷贝的方法实现

**上面只是简单地深拷贝，其实深拷贝还要涉及各种问题：
1、symbol、循环引用，递归爆栈等等问题  还要深入研究**