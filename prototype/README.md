[原型原型链](https://zhuanlan.zhihu.com/p/35790971)


上面文章我觉得讲的很好，浅显易懂，推荐给大家


```
function Person(name, age) {
    this.name = name
    this.age = age
}

Person.prototype.satName = function() {
    console.log(this.name)
}

let p1 = new Person('rose', 20)

let p2 = new Person('jack', 22)

// true
p1.__proto__ === p2.__proto__

p1.__proto__ === Person.prototype

Person.prototype.construtor === Person



//继承
function Teacher(name, age, sex) {
    Person.call(this, name, age)
    this.sex = sex
}

Teacher.prototype = Object.create(Person.prototype)

Teacher.prototype.construtor = Teacher

// hasOwnProperty 处理属性并且不会遍历原型链的方法


```

有了es6的class后我们可以改造下

```
// 用es6里面的class改造下

class Person {
    /* constructor是构造方法，this关键字则代表实例对象
    * 必须有，如果没有显式定义，一个空的constructor方法会被默认添加。
    */
    constructor(name, age) {
        this.name = name
        this.age = age
    }

    sayName() {
        console.log(this.name)
    }
}

let p1 = new Person('rose', 20)
let p2 = new Person('jack', 22)
p1.constructor === Person.prototype.constructor // true

class Teacher extends Person {
    constructor(name, age, sex) {
        /* 调用父类的constructor(x, y)
        * 子类的构造函数中，只有调用super之后，才可以使用this关键字，否则会报错
        */
        super(name, age)
        this.sex = sex
    }
}
```

涉及别的知识点：创建对象的几种方法及优缺点参考[js创建对象的6种方式总结](https://www.cnblogs.com/shirliey/p/11696412.html)


call、apply、bind之间的区别
