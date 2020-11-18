### [sass](https://www.sass.hk/docs/)


```
npm install -g sass //全局安装sass

sass input.scss output.css //把input.scss文件解析到output.css

sass --watch input.scss:output.css //监听文件 之间用：

sass --watch app/sass:public/stylesheets //监听文件夹的变化
```

> #### 1、嵌套


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

**@extend-Only 选择器**

选择器# 或 . 被替换成了 % 可以像 class 或者 id 选择器那样使用，当它们单独使用时，不会被编译到 CSS 文件中。

```
// .scss
#context a%extreme {
    color: blue;
    font-weight: bold;
    font-size: 2em;
}

.notice {
    @extend %extreme;
}

// .css
#context a.notice {
    color: blue;
    font-weight: bold;
    font-size: 2em; 
}
```
**!optional 声明**

@extend 后面的选择器没有声明就会报错，但是有了!optional就不会报错了

***注意：** 如果在 @media （或者其他 CSS 指令）中使用 @extend，必须延伸给相同指令层中的选择器。


```
// 可
@media print {
  .error {
    border: 1px #f00;
    background-color: #fdd;
  }
  .seriousError {
    @extend .error;
    border-width: 3px;
  }
}
// 不可
.error {
  border: 1px #f00;
  background-color: #fdd;
}

@media print {
  .seriousError {
    // INVALID EXTEND: .error is used outside of the "@media print" directive
    @extend .error;
    border-width: 3px;
  }
}
```

###### 13、@at-root

解析后是在文档的根发出，而不是父选择器


```
// .scss
.context {
    font-size: 16px;
    @at-root .name {
        font-size: 14px;
    }
}

// .css
.context {
    font-size: 16px;
}
.name {
    font-size: 14px;
}
```

**@at-root (without: ...) and @at-root (with: ...)**


```
// .scss
@media print {
    .page {
        width: 8in;
        @at-root (without: media) {
            color: red;
        }
    }
}

// .css
@media print {
    .page {
        width: 8in;
    }
}
.page {
    color: red;
}
```

###### 14、@debug

同js的debugger一样用于调试
```
@debug 10em + 12em;
```
###### 15、@warn

###### 16、@if 、 @else if、 @else
当 @if 的表达式返回值不是 false 或者 null 时，条件成立，输出 {} 内的代码

```
// .scss
$type: monster;
p {
    @if $type == ocean {
        color: blue;
    } @else if $type == matador {
        color: red;
    } @else if $type == monster {
        color: green;
    } @else {
        color: black;
    }
}

// .css
p {
    color: green; 
}
```

###### 17、@each

$var in <list>

```
// .scss
@each $animal,
$color,
$cursor in (puma, black, default),
(sea-slug, blue, pointer),
(egret, white, move) {
    .#{$animal}-icon {
        background-image: url('/images/#{$animal}.png');
        border: 2px solid $color;
        cursor: $cursor;
    }
}

@each $header,
$size in (h1: 2em, h2: 1.5em, h3: 1.2em) {
    #{$header} {
        font-size: $size;
    }
}

// .css
.puma-icon {
  background-image: url("/images/puma.png");
  border: 2px solid black;
  cursor: default;
}

.sea-slug-icon {
  background-image: url("/images/sea-slug.png");
  border: 2px solid blue;
  cursor: pointer;
}

.egret-icon {
  background-image: url("/images/egret.png");
  border: 2px solid white;
  cursor: move;
}

h1 {
  font-size: 2em;
}

h2 {
  font-size: 1.5em;
}

h3 {
  font-size: 1.2em;
}
```

###### 18、@for

- @for $var from <start> through <end>
- @for $var from <start> to <end>

区别在于through包含最后end，to不包含

```
// .scss
@for $i from 1 through 3 {
    .item-#{$i} { width: 2em * $i; }
}

// .css
.item-1 {
  width: 2em;
}

.item-2 {
  width: 4em;
}

.item-3 {
  width: 6em;
}
```

###### 19、@while


```
// .scss
$i: 6;
@while $i > 0 {
    .item-#{$i} { width: 2em * $i; }
    $i: $i - 2;
}

// .css
.item-6 {
    width: 12em; 
}

.item-4 {
    width: 8em; 
}

.item-2 {
    width: 4em;
}
```
###### 20、@mixin和@include  混合样式


```
// .scss
$namespace: "el";
@mixin b($block: div) { // 可以有参数也可以没有，还可以定义默认值
    $B: $namespace+'-'+$block !global;
    
    .#{$B} {
        @content;
    }
}

@include b(button) {
    color: red;
}

// .css
.el-button {
    color: red;
}
```

不能确定混合指令需要使用多少个参数可以使用参数变量 … 声明


```
// .scss
@mixin box-shadow($shadows...) {
    -moz-box-shadow: $shadows;
    -webkit-box-shadow: $shadows;
    box-shadow: $shadows;
}
.shadows {
    @include box-shadow(0px 4px 5px #666, 2px 6px 10px #999);
}

// .css
.shadowed {
    -moz-box-shadow: 0px 4px 5px #666, 2px 6px 10px #999;
    -webkit-box-shadow: 0px 4px 5px #666, 2px 6px 10px #999;
    box-shadow: 0px 4px 5px #666, 2px 6px 10px #999;
}
```
向混合样式中导入内容 **@content**

为便于书写，@mixin 可以用 = 表示，而 @include 可以用 + 表示

###### @function


```
// .scss
$grid-width: 40px;
$gutter-width: 10px;

@function grid-width($n) {
    @return $n * $grid-width+($n - 1) * $gutter-width;
}

#sidebar {
    width: grid-width(5);
}

// .css
#sidebar {
    width: 240px;
}
```


#### end  开心





