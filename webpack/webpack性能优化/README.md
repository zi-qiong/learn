### 开发环境性能优化
#### 优化打包构建速度
##### 1、HMR
```
// HMR: hot module replacement 热模块替换
// 作用：一个模块发生变化，只会重新打包这一个模块，而不是打包所有，极大提升构建速度
// 1、样式文件：可以使用HMR功能，因为style-loader内部实现了
// 2、js文件：默认是没有HMR功能的 --> 修改js代码，添加支持HMR功能的代码
// 注意：HMR功能对js的处理，只能处理非入口js文件的其他文件，js文件修改
if(module.hot) {
    module.hot.accept('./print.js', function() {
        print()
    }
}
// 3、html文件：默认是没有HMR功能的，同时会导致问题：html文件不能热更新了~
// 解决：修改entry入口，将html文件引入（不用做HMR功能）

module.exports = {
    // 解决html文件热更新
    entry: ['./src/index.js', './src/index.html']
    devServer: {
        hot: true
    }
}

```

#### 优化代码调试
##### 1、source-map
一种提供源代码到构建后代映射技术（如果构建后代码出错了，通过映射关系可以追踪源代码错误）

[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map

内联和外部的区别：
1. 外部生成了文件，内联没有
1. 内联构建速度更快

<html>

<table>
    <tr>
        <td>source-map</td>
        <td>外部:错误代码的准确信息和源代码的错误位置</td>
    </tr>
    <tr>
        <td>inline-source-map</td>
        <td>内联（只生成一个内联source-map）</td>
    </tr>
     <tr>
        <td>hidden-source-map</td>
        <td>外部：错误代码的的原因，但是没有源代码的错误位置</td>
    </tr>
     <tr>
        <td>eval-source-map</td>
        <td>每个文件都生成对应的source-map</td>
    </tr>
    <tr>
        <td>nosources-source-map</td>
        <td>外部：错误代码的准确信息，但是没有任何源代码信息</td>
    </tr>
    <tr>
        <td>cheap-source-map</td>
        <td>外部：只能提供一整行的错误</td>
    </tr>
    <tr>
        <td>cheap-module-source-map</td>
        <td>外部：同上</td>
    </tr>
</table>
</html>
速度（eval>inline>cheap>...）

> 总结
- 开发环境：eval-source-map
- 生产环境： source-map

```
module.exports = {
    devtool: 'source-map'
}
```

### 生产环境性能优化
#### 优化打包构建速度
##### tree shaking（去除无用代码）

- 使用es6模块换
- 开始production
减少代码体积，存在的问题，可能把css文件干掉了
解决：
```
// package.json中配置
"sideEffects": ["*.css"]
// 哪些文件不需要tree shaking的
```

##### oneOf

```
module.exports = {
    module: {
        rules: [{
            // loader只会匹配一个
            // 确保oneOf里面一个文件类型对应一个loader
            // 当一个文件要被多个loader处理，指定优先顺序
            oneOf: [
                ...xxx
            ]
        }]
    }
}
```

#### 优化代码运行性能
##### 缓存

```
module.exports = {
    entry: './src/index.js',
    ouput: {
        // 强制缓存后加载个hash，相当于访问别的文件
        filename: 'main.[contenthash:10].js',
        path: resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: [[
                '@babel/preset-env', {
                    useBuiltIn: 'usage',
                    corejs: {version: 3},
                    targets: {
                        chrome: '60',
                        firefox: '60',
                        ie: '9',
                        safari: '10',
                        edge: '17'
                    }
                }
                ]],
                // 开启babel缓存，第二次构建时才会读取缓存
                cacheDirectory: true
            }
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/index.[contenthash:10].css'
        })
    ]
}
```

服务器代码
```
const express = require('express')
const app = express();
// 强制缓存
app.use(express.static('dist', {maxAge: 1000 * 3600}))
app.listen(3000)

// node server.js 运行
```
强制缓存加hash值：contenthash：根据文件内容生成的hash值，不同文件的hash值不一样

##### code split 代码分割

1、入口传对象
```
module.exports = {
    entry: {
        main: './src/index.js',
        count: './src/count.js'
    },
    output: {
        filename: '[name].[contenthash].js',
        path: resolve(__dirname, 'dist')
    }
}
```
2、optimization

```
module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].[contenthash].js',
        path: resolve(__dirname, 'dist')
    },
    // 1、可以将node_modules中代码单独打包一个chunk最终输出
    // 2、自动分析多入口chunk中有没有公共的文件，如果有会打包成单独的一个chunk
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
}
```
3、通过js代码，让某个文件单独打包成一个chunk

import动态导入语法

```
// js文件
import(/* webpackChunkName: 'count' */'./count')
    .then(({count}) => {
        console.log('文件加载成功')
        console.log(count())
    })
    .catch(() => {
        console.log('文件加载失败')
    })
```

##### 懒加载和预加载

```
// js文件
document.getElementById('btn').onClick = function() {
    import(/* webpackChunkName: count, webpackPrefetch: true */'./count')
        .then(({count}) => {
            count(1, 3)
        })
}

/* webpackPrefetch: true */
// 预加载
```
#####  PWA 渐进式网络开发应用程序（离线可访问）
必须运行在服务器上

```
npm i serve -g
serve -s dist
```


```
// 下载 workbox-webpack-plugin
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

module.exports = {
    plugins: [
        new WorkboxWebpackPlugin.GenerateSW({
            // 1、帮助serviceWorker快速启动
            // 2、删除旧的serviceWorker
            
            // 生成一个serviceWorker配置文件
            clientsClaim: true,
            skipWaiting: true
        })
    ]
}

// 入口文件index.js
if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        nacigator.serviceworker.register('/service-worker.js')
        .then(() => {
            console.log('注册成功了')
        })
        .catch(() => {
            console.log('注册失败了')
        })
    })
}
```

##### externals 需要cdn请求的不需要打包

```
module.exports = {
    mode: 'production',
    externals: {
        // 忽略的库名对应的报名 
        jquery: 'jQuery'
    }
}
```

##### dll

```
// webpack.dll.js 使用dll技术，对第三方库进行单独打包
const webpack = require('webpack')

module.exports = {
    entry: {
        // 打包生成的name，以及要打包的库
        jquery: ['jquery']
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, 'dll')
    },
    // 打包的库里面向外暴露出去的内容叫什么名字
    library: '[name]_[hash]',
    plugins: [
        new webpack.DllPlugin({
            name: '[name]_[hash]', // 映射库的暴露名称
            path: resolve(__dirname, 'dll/manifest.json')
        })
    ],
    mode: 'production'
}

// webpack.config.js
const webpack = require('webpack')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
module.exports = {
    plugins: {
        new webpack.DllReferencenPlugin({
            manifest: resolve(__dirname, 'dll/manifest.json')
        }),
        // 将某个文件打包出去，并在html文件中自动引入
        new AddAssetHtmlWebpackPlugin({
            filePath: resolve(__dirname, 'dll/jquery.js')
        })
    }
}
```

