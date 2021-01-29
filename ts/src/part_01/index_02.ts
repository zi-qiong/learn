// 字面量声明，不可变
let a: 10;
// 此行代码会报错，不可变
// a = 11;
// 只能赋值下面两个值
let b: "male" | "female";
b = "male";
b = "female";
// 此行代码会报错
// b = "string"

// any 类型，任意类型，可以任意赋值，设置any后相当于关闭ts的类型检测，不建议使用
// 不指定类型，默认为any
let c: any;
let d;
c = 1;
c = "1";
c = true;

// 设置未知类型的变量
let e: unknown;
e = 1;
e = "1";
e = true;

let f: string;
// 此行代码会报错，不能将类型“unknown”分配给类型“string”
// f = e;
// 下面不报错，但是有问题f为string，但是可以赋值为c布尔值
f = c 