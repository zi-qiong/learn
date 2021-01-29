import "./style/index.less";
// a 变量设置了类型，所以只能复制当前类型的值
let a: number;
a = 10; 
// 此行代码会报错
// a = "123" 


// 声明变量直接进行复制，并指定类型
let b = true; 
b = false;
// 此行代码会报错
// b = "123";


// 不考虑参数的类型和数量，默认为any累心，不安全，
// function sum(a, b) {
//     return a + b
// }
// sum(123, 456) // 579
// sum(123, "456") // "123456"

// 默认返回值类型，会根据检测结果提示，也可以自己指定类型function sum(a: number, b: number) :number{}
function sum(a: number, b: number) {
    return a + b
}
sum(123, 456) // 579
// 下面代码会报错
// sum(123, "456")
// sum(123, 456, 789)

// 总结：变量声明用类型
// 函数入参和返回声明类型