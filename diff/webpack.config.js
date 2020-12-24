const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// 定义nodejs环境变量，指定browserslist的那个环境
process.env.NODE_ENV = 'production'

// 复用loader
const commonCssLoader = [
    MiniCssExtractPlugin.loader,
    'css-loader',
    // 兼容性处理
    {
        // 还需在package.json中定义browserslist
        loader: 'postcss-loader',
        options: {
            ident: 'postcss',
            plugins: () => {
                require('postcss-preset-env')
            }
        }
    }
]

module.exports = {
    entry: './index.js',
    output: {
        filename: 'main.js',
        path: resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [...commonCssLoader]
        }, {
            test: /\.less$/,
            use: [
                ...commonCssLoader,
                'less-loader'
            ]
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            // 优先执行
            enforce: 'pre',
            loader: 'eslint-loader',
            options: {
                fix: true
            }
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: [[
                    '@babel/preset-env',
                    {
                        useBuiltIns: 'usage',
                        corejs: {
                            version: 3
                        },
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
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader',
            options: {
                limit: 8 * 1024,
                name: '[hash:10].[ext]',
                outputPath: 'img'
            }
        }, {
            test: /\.html$/,
            loader: 'html-loader'
        }, {
            exclude: /\.(css|less|js|html|png|jpg|gif)$/,
            loader: "file-loader",
            options: {
                name: '[hash:10].[ext]',
                outputPath: 'media'
            }
        }]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/main.css'
        }),
        new OptimizeCssAssetsWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        })
    ],
    mode: 'production',
    devServer: {
        contentBase: resolve(__dirname, 'dist'),
        compress: true,
        port: 3000,
        open: true
    }
}