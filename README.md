### [sass](https://www.sass.hk/docs/)


```
npm install -g sass //全局安装sass

sass input.scss output.css //把input.scss文件解析到output.css

sass --watch input.scss:output.css //监听文件 之间用：

sass --watch app/sass:public/stylesheets //监听文件夹的变化
```

###### 1、嵌套


```
// .scss
.card {
    padding: 8px;
    
    .card-title {
        font-size: 16px
    }
}

// .css --- 解析之后
.card {
    padding: 8px;
}
.card .card-title {
    font-size: 16px;
}
```
###### 2、父选择器（&）


```
// .scss
.card {
    color: red;

    &:hover {  // 代替父元素
        color: rgb(255, 238, 0);
    }

    &-active { // &必须作为选择器的第一个字符，其后可以跟随后缀生成复合的选择器
        color: rgb(0, 255, 64);
    }
}

// .css
.card {
    color: red;
}
.card:hover {
    color: #ffee00;
}
.card-active {
    color: #00ff40;
}
```

###### 3、属性嵌套


```
// .scss
.card {
    border: 1px solid #333 { //border后面用的":"，且也可以跟自己的属性
        style: solid;
        color: #333;
    }
}
// .css
.card {
    border: 1px solid #333;
    border-style: solid;
    border-color: #333;
}
```

###### 4、注释 /* */ 或者 //

```
/* 注释
 * 注释
 * 注释
 * 注释 */
 
 // 注释
```
###### 5、SassScript ——变量

变量有块级作用域
若需将局部作用域转为全局可以用—!global（不怎么建议使用）

```
// .scss
$--color-primary: #67C23A;
.card {
    $--color-danger: #F56C6C !global;
    color: $--color-primary;
}
// .css
.card {
    color: #67C23A;
}
```

###### 6、数据类型
- 数字: 1, 2, 3, 10px
- 颜色: red, #fff, rgba(255, 0, 0, 0.5)
- 布尔: true, false
- 空：null
- 字符串: #{} 时，有引号字符串将被编译为无引号字符串
- 数组
- map

###### 7、运算
+, -, *, /, %, <, >, <=, >=, ==, !=

###### 8、插值语句#{}

###### 9、变量定义 !default

优先级最低 可以被重新复制

###### 10、@import导入

分音，不想被编译，在实际文件前加_,引入时不加

嵌套 

###### 11、@media
同css 一样，但是嵌套时编译会放在最外层

```
// .scss
.sidebar {
    width: 300px;
    @media screen and (orientation: landscape) {
        width: 500px;
    }
}

//.css
.sidebar {
    width: 300px;
}
@media screen and (orientation: landscape) {
     .sidebar {
        width: 500px;
     }
}
```

###### 12、 @extend 继承


```
// .scss
.error {
    border: 1px #f00;
    background-color: #fdd;
}

.error .intrusion {
    background-image: url("/image/hacked.png");
}

.seriousError {
    @extend .error;
    border-width: 3px;
}

//.css
.error, .seriousError {
  border: 1px #f00;
  background-color: #fdd;
}

.error .intrusion, .seriousError .intrusion {
  background-image: url("/image/hacked.png");
}

.seriousError {
  border-width: 3px;
}

// .error下所有的样式都会继承,可以继承多个，之间用"，"隔开
```

