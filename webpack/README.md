### 1、webpack是一种前端构建工具，一个静态资源打包器
### 2、五个核心概念
#### 1、Entry
入口起点
```
module.exports = {
    entry: "./src/index.js",
    entry: [
        "./src/index.js",
        "./src/add.js"
    ],
    entry: {
        index: "./src/index.js",
        add: "./src/add.js"
    },
    // 上面两种结合
    entry: {
        index: [
            "./src/index.js",
            "./src/count.js"
        ],
        add: "./src/add.js"
    },
}
```
- 字符串：单入口文件，输出一个打包文件，默认名字是main
- 数组：多入口：所有入口文件最终只会生成一个chunk，默认名字main --> **只有在HMR功能中让html** 这点还没懂
- 对象：多入口，有几个入口文件就形成几个chunk，此时chunk的名字是key

#### 2、Output

```
const { resolve } = require('path')
module.exports = {
    output: {
        // 文件名称，指定名称+目录
        filename: 'js/[name].js',
        // 输出文件目录
        path: resolve(__dirname, 'dist'),
        // 一般用于生产环境 所有输出资源的公共路径 --> 路径的前面
        publicPath: '/',
        // 非入口chunk的名称
        // eg:  import和optimization 引入的文件
        chunkFilename: '[name]_chunk.js'
        // 暴露一个变量名称
        library: 'name',
        // 变量名添加到哪个属性上
        // global --> node
        // 'commonjs'
        libraryTarget: 'window', // browser
        
    }
}
```

#### 3、Module
webpack默认只能处理js和json资源，可以将es6模块化编译成浏览器能识别的模块化

使用哪些loader进行处理,use数组中loader执行顺序，从右到左，从下到上依次执行

```
module.exports = {
    module: {
        rules: [
            {
                test: '/\.css$/',
                // 多个loader用use
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.js$/,
                // 排除那些文件
                exclude: /node_modules/,
                // 只检查src文件下面的js文件
                include: resolve(__dirname, 'src'),
                // 有限执行: 'pre'
                // 延后执行：'post'
                enforce: 'pre',
                loader: 'eslint-loader',
                options: {
                    fix: true
                }
            }, {
                // 以下配置只会生效一个
                oneOf: []
            }
        ]
    }
}
```
1. 下载
1. 使用（webpack.config.js里面配置）
#### 4、Plugins

```
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            // 相当于压缩了
            minify: {
                // 移除空格
                collapseWhitespace: true,
                // 移除注释
                removeComments: true
            }
        })
    ]
}
```
1. 下载
1. 引入
1. 使用

#### 5、mode

```
module.exports = {
    mode: 'development'
    // production
    // 生产环境比开发环境多了压缩
}
```
### 其他配置

#### 1、resolve

```
module.exports = {
    // 解析模块的规则
    resolve: {
        // 配置解析路径别名: 简写路径
        alias: {
            @: resolve(__dirname, 'src')
        },
        // 配置路径的后缀名，下面是默认
        extensions: ['.js', '.json'],
        // 告诉webpack解析模块是去哪个目录
        modules: [resolve(__dirname, '../../node_modules') ,'node_modules']
    }
}
```

#### 2、devServer

```
<!--运行npx webpack-dev-server  也需要下载-->
module.exports = {
    devServer: {
        // 运行代码的目录
        contentBase: resolve(__dirname, 'dist'),
        // 监视contenBase目录下的所有文件
        <!--watchContentBase: true,-->
        <!--watchOptions {-->
        // 忽略监听文件
        <!--    ignored: /node_modules/-->
        <!--},-->
        // 启动gzip压缩
        compress: true,
        // 端口号
        port: 5000,
        // 域名
        host: 'localhost',
        // 浏览器自动打开
        open: true,
        // HMR
        hot: true,
        // 不要启动服务器日志信息
        clientLogLevel: 'none',
        // 除了一些基本信息以外，其他内容不要显示
        quiet: true,
        // 如果出错了，不要全屏提示
        overlay: false,
        // 服务器代理--> 解决开发环境跨域问题
        proxy: {
            // 一旦devServer(5000)接收到/api/xxx的请求，就会把请求转发到另一个服务器（3000）
            '/api': {
                target: 'http://localhost: 3000',
                // 发送请求时，请求路径重写，将/api/xxx --> /xxx （去掉/api）
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
```
#### 3、optimization

```
module.exports = {
    optimazition: {
        splitChunks: {
            chunks: 'all'
        }
    }
}
```

#### 打包样式资源

```
<!--js文件中-->
<!--import './index.css'-->
module.exports = {
    module: {
        rules: [
            {
                //style-loader:创建style标签，将js中的样式资源插入到head中生效
                //css-loader:将css文件变成commonjs模块加载js中，里面内容是样式字符串
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }, {
               test: /\.less$/,
               use: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    }
}
```
#### 生产环境css文件处理

```
// 提取css为单独文件下载mini-css-extract-plugin
// css兼容处理：postcss-loader postcss-preset-env 
// 压缩css  optimize-css-assets-webpack-plugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

process.env.NODE_ENV = "deveopment"

module.exports = {
    module: {
      rules: [{
          test: /\.css$/,
          use: [
            // 提取js中的css成单独文件
            MiniCssExtractPlugin.loader, 
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    ident: 'postcss',
                    plugins: () => {
                        // postcss的插件
                        // 帮postcss找到package.json中browserslist里面的配置，通过加载指定的css兼容性样式
                        require('postcss-preset-env')()
                    }
                }
            }
            ]
      }]  
    },
    plugins: [
        //new HtmlWebpackPlugin()
        new MiniCssExtractPlugin({
            // 对输出文件重命名
            filename: './src/build.css'
        }),
        new OptimizeCssAssetsWebpackPlugin()
    ]
}

// package.json
"browserslist": {
    "development": [
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version",
    ],
    "production": [
        ">0.2%",
        "not dead",
        "not op_mini all"
    ]
}
```

#### 打包html资源

```
const HtmlWebpackPlugin = requirez('html-webpack-plugin')

module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: {
                // 移除空格
                collapseWhitespace: true,
                // 移除注释
                removeComments: true
            }
        })
    ]
}
```

#### 打包图片资源

```
// 下载url-loader file-loader html-loader
module.exports = {
    module: {
        rules: [{
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader',
            options: {
                //base64处理，减少请求数量，增加文件体积
                limit: 8 * 1024,
                //问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片图片是commonjs，所以解析会报错
                //解决，关闭url-loader的es6模块化，使用commonjs解析
                //上面是看视频讲解说有问题，但是实际上我没有遇到
                //esModule: fase,
                name: '[hash:10].[ext]'
            }
        }, {
            test: /\.html$/,
            loader: "html-loader"
        }]
    }
}
```
#### 打包其他资源

```
module.exports = {
    module: {
        rules: [{
            exclude: /\.(css|less|js|png|jpg|gif|html|json)/,
            loader: 'file-loader',
            options: {
                name: '[hash:10].[ext]',
                outputPath: 'media'
            }
        }]
    }
}
```

#### js语法检查--> eslint

```
// 下载 eslint-loader eslint
module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                options: {
                    // 自动修复
                    fix: true
                }
            }
        ]
    }
}
// 配置检查规则：package.json中eslintConfig
// airbnb --> eslint-config-airbnb-base eslint eslint-plugin-import

"eslintConfig": {
    "extends": "airbnb-base"
}

```

#### js兼容性处理

```
// 下载 babel-loader @babel/preset-env @babel/core core-js
// 基本js兼容性处理 @babel/preset-env
// @babel/polyfill 在js文件中直接引入 @import '@babel/polyfill'
// 问题：我只需要解决部分兼容性处理，但是将所有的兼容性代码都全部引入，体积太大
// 3、需要做兼容性处理的就做：按需加载 --> core-js
module.exports = {
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                // 预设：指示babel做怎样的兼容性处理
                presets: [[
                '@babel/preset-env',
                {
                    // 按需加载
                    useBuiltIns: 'usage',
                    // 指定core-js版本
                    corejs: {
                        version: 3
                    },
                    // 指定兼容性做到哪个版本的浏览器
                    targets: {
                       chrome: '60',
                       firefox: '60',
                       ie: '9',
                       safari: '10',
                       edge: '17'
                    }
                }
                ]]
            }
        }]
    }
}
```
