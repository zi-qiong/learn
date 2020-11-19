> AJAX（async javaScript and XML）

通过后台与服务器进行数据交换，使页面实现异步更新，在不重新加载整个页面的情况下，对网页的某部分进行更新

**XMLHttpRequest** （IE5和IE6使用ActiveX对象）

```
function handleClick(val) {
    var xmlhttp;
    /* 检查是否含有XMLHttpRequest
    * IE5 IE6 不包含XMLHttpReques,没有的话新建ActiveXObject
    */
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest()
    } else {
        xmlhttp = new ActiveXObject("Mcrosoft.XMLHTTP")
    }

    /* 异步 
    * 才会用onreadystatechange
    * 同步 xmlhttp.open("GET", "./index.asp?q="+val, false)
    * xmlhttp.send()
    * document.getElementById("myDiv").innerHTML = xmlhttp.responseText
    */
    xmlhttp.onreadystatechange = function () {
        /* readyState 0-4
        * 0: 请求未初始化
        * 1: 服务器连接已建立
        * 2: 请求已接收
        * 3: 请求处理中
        * 4: 请求已完成，且响应已就绪

        * status 200（成功） 404（未找到）
        */
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            /* responseText: 获得字符串形式的响应数据
            *responseXML: 获得 XML 形式的响应数据
            */
            document.getElementById("myDiv").innerHTML = xmlhttp.responseText
        }
    }

    

    /* open含有三个入参
    * 第一个入参：请求类型：GET、POST
    * 第二个入参：文件路由
    * 第三个入参：同步异步：true--异步，false--同步
    */
   
    /* GET
    * 请求参数跟在第二个参数后面?q=xxx

    * POST
    * xmlhttp.open("POST", "/index.asp", true)
    * 请求头
    * xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded")
    * 入参放在send里面
    * xmlhttp.send("q=xx&name=xx")
     */
    xmlhttp.open("GET", "/index.asp?q=" + val, true)
    // 发送请求
    xmlhttp.send()
}
```

responseText：获得字符串形式的响应数据

responseXML：获得 XML 形式的响应数据

onreadystatechange：每当 readyState 属性改变时，就会调用该函数

readyState：
- 0: 请求未初始化
- 1: 服务器连接已建立
- 2: 请求已接收
- 3: 请求处理中
- 4: 请求已完成，且响应已就绪

status：
- 200: "OK"
- 404: 未找到页面
