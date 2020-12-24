// webpack配置文件：指示webpack干什么活，当运行webpack时会加载里面的配置

// 所有的构建工具都是基于nodejs平台运行，模块化采用commonjs

/* 
    1、loader：1、下载 2、使用（配置loader）
    2、plugind: 1、下载 2、引入 3、使用
*/

// resolve用来拼接绝对路径的方法
const { resolve } =  require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    // webpack配置
    // 入口起点
    entry: "./src/index.js",
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
            }
        ]
    },
    // plugins的配置
    plugins: [
        // 详细plugins的配置
        // 功能：默认会创建一个空的html文件，引入打包输出的所有资源（js/css）
        // 需求：需要有结构的HTM文件
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            // 复制'./src/index.html'文件，并自动引入打包输出的所有资源
            template: './src/index.html'
        })
    ],
    // 模式
    mode: 'development', // 'production' 开发和生产环境
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
        open: true
    }
}

// 开发环境的配置：能让代码运行