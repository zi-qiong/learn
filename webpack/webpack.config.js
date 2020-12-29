// webpack配置文件：指示webpack干什么活，当运行webpack时会加载里面的配置

// 所有的构建工具都是基于nodejs平台运行，模块化采用commonjs

/* 
    1、loader：1、下载 2、使用（配置loader）
    2、plugind: 1、下载 2、引入 3、使用
*/

/* HMR: hot module replacement 热模块替换
    作用：一个模块发生变化，只会重新打包这一个模块，而不是打包所有，
    极大提升构建速度

    样式文件：可以使用HMR功能，因为style-loader内部实现了
    js文件：默认是没有HMR功能的--> 修改js代码，添加支持HMR功能的代码
        注意：HMR功能对js的处理，只能处理非入口js文件的其他文件
    html文件：默认是没有HMR功能的，同事会导致问题：html文件不能热更新了~
    解决：修改entry入口，将html文件引入（不用做HMR功能）
 */

// resolve用来拼接绝对路径的方法
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const workboxWebpackPlugin = require('workbox-webpack-plugin')
// const webpack = require("webpack")

module.exports = {
    // webpack配置
    // 入口起点
    entry: ["./src/index.js", "./src/index.html"],
    // 输出
    output: {
        // 输出的文件名
        filename: 'build.js',
        // __dirname表示nodejs的变量，代表当前文件的目录绝对路径
        path: resolve(__dirname, 'dist')
    },
    // loader的配置
    module: {
        rules: [
            // 详细loader配置, 不同文件必须匹配不同loader
            {
                // 匹配哪些文件
                test: /\.css$/,
                // 使用哪些loader进行处理,use数组中loader执行顺序，从右到左，从下到上依次执行
                // style-loader:创建style标签，将js中的样式资源插入到head中生效
                // css-loader:将css文件变成commonjs模块加载js中，里面内容是样式字符串
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                // less-loader将less文件编译成css文件,需要下载less和less-loader
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(jpg|png|gif)$/,
                // 只有一个loader就只写loader，多个就用数组
                // 下载url-loader和file-loader
                // 默认处理不了html中的img图片
                use: {
                    loader: 'url-loader',
                    options: {
                        // 图片大小小于8kb,就会被base64处理
                        // 优点：减少请求数量（减少服务器压力）
                        // 缺点：图片体积会更大（文件请求速度会更慢）
                        limit: 5 * 1024,
                        // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片图片是commonjs，所以解析会报错
                        // 解决，关闭url-loader的es6模块化，使用commonjs解析
                        // 上面是看视频讲解说有问题，但是实际上我没有遇到
                        // esModule: fase,
                        name: '[hash:10].[ext]',
                        // 输出文件是base64的话不会打包到文件夹中，不是base64才会打包到img文件夹中
                        outputPath: 'img'
                    }
                },
            },
            {
                test: /\.html$/,
                // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
                loader: 'html-loader'
            },
            // 打包其他资源（除了html、js、css资源以外的资源）
            {
                // 排除
                exclude: /\.(css|js|html|json|png|jpg|gif|less)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]',
                    outputPath: 'media'
                }
            },
            /*
            语法检测：eslint eslint-loader
            注意：只检查自己的源代码，第三方的不用检查

            设置检查规则：
            "eslintConfig": {
                "extends": "airbnb-base"
            }

            airbnb: eslint-config-airbnb-base eslint-plugin-import

            eslint不认识window，navigator全局变量，
            解决：需要修改package.json中eslintConfig配置
            "env": {
                "browser": true //支持浏览器全局变量
            }
            */
            // {
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: 'eslint-loader',
            //     options: {
            //         // 自动修复eslint的错误
            //         fix: true
            //     }
            // },
            /*
            js兼容性处理：babel-loader @babel/core @babel/preset-env
            1、基本js兼容性处理 --> @babel/preset-env
            问题：只能转换基本语法，如promise不能转换
            2、全部js兼容性处理 --> @babel/polyfill
            问题：我只需要解决部分兼容性处理，但是将所有的兼容性代码都全部引入，体积太大
            3、需要做兼容性处理的就做：按需加载 --> core-js

            2和3不可以同时使用
            */
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    /* 开启多进程打包 thread-loader
                        进程启动大概为600ms,进程通信也有开销。
                        只有工作消耗时间比较长，才需要多进程打包
                     */
                    // 'thread-loader',
                    // {
                    //     loader: 'thread-loader',
                    //     options: {
                    //         workers: 2 // 进程2个
                    //     }
                    // },
                    {
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
                    }
                ]
            }
        ]
    },
    // plugins的配置
    plugins: [
        // 详细plugins的配置
        // 功能：默认会创建一个空的html文件，引入打包输出的所有资源（js/css）
        // 需求：需要有结构的HTM文件
        new CleanWebpackPlugin(),
        // 告诉webpack哪些库不参与打包，同事使用时的名称也得变~
        // new webpack.DllReferencePlugin({
        //     manifest: resolve(__dirname, 'dll/manifest.json')
        // }),
        // 将某个文件打包输出去，并在html中自动引入该资源
        // new AddAssetHtmlWebpackPlugin({
        //     filePath: resolve(__dirname, 'dll/jquery.js')
        // }),
        new HtmlWebpackPlugin({
            // 复制'./src/index.html'文件，并自动引入打包输出的所有资源
            template: './src/index.html',
            minify: {
                // 移除空格
                collapseWhitespace: true,
                // 移除注释
                removeComments: true
            }
        }),
        new workboxWebpackPlugin.GenerateSW({
            /* 1、帮助serviceWorker快速启动
                2、删除旧的serviceWorker

                生成一个serviceWorker配置文件
             */
            clientsClaim: true,
            skipWaiting: true
        })
    ],
    // 模式
    mode: 'development', // 'development'和'production' 开发和生产环境，生产环境会自动压缩js代码
    // 开发服务器 devServer:用来自动化（自动编译，自动打开浏览器，自动刷新浏览器）
    // 特点：只会在内存中编译打包，不会有任何输出
    // 启动devServer指令为：npx webpack-dev-server
    devServer: {
        // 项目构建后的路径
        contentBase: resolve(__dirname, 'dist'),
        // 启动gzip压缩
        compress: true,
        // 端口号
        port: 3000,
        // 自动打开浏览器
        open: true,
        // 开启HMR功能
        // 当修改了webpack配置，新配合要想生效，必须重启生效
        hot: true
    },
    devtool: 'source-map',
    externals: {
        // 忽略的库名---npm包名
        // 拒绝jquery被打包进来
        jquery: 'jQuery'
    }
}

// 开发环境的配置：能让代码运行

/*
    source-map: 一种提供源代码到构建后代映射技术（如果构建后代码出错了，通过映射关系可以追踪源代码错误）
    [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map
    inline-source-map: 内联（只生成一个内联source-map）
    hidden-source-map: 外部
    eval-source-map: 内联（每个文件都生成一个source-map，都在eval）
    内联和外部的区别：1、外部生成了文件，内联没有 2、内联构建速度更快

    开发环境：eval-source-map
    生产环境： source-map
 */

/*
   pwa:渐进式网络开发应用程序（离线可访问）
   workbox --> workbox-webpack-plugin

   sw必须运行在服务器上
   --> nodejs
   --> npm i serve -g
   serve -s build //启动服务器，将build目录下所有资源作为静态资源暴露出去
 */

