const {resolve} =  require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
process.env.NODE_ENV = "production"


const commonCssLoader = [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
        loader: 'postcss-loader',
        options: {
            ident: 'postcss',
            plugins: () => {
                require('postcss-preset-env')()
            }
        }
    }
]

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [...commonCssLoader]
            }, {
                test: /\.less$/,
                use: [...commonCssLoader, 'less-loader']
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: 'pre',
                loader: 'eslint-loader',
                options: {
                    fix: true
                }
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: [[
                    '@babel/preset-env',
                    {
                        useBultIns: 'usage',
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
            }, {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8 * 1024,
                    name: '[hash:10].[ext]'
                }
            }, {
                test: /\.html$/,
                loader: 'html-loader',
            }, {
                exclude: /\.(css|less|js|json|png|jpg|gif|html)/,
                loader: "file-loader",
                options: {
                    name: '[hash:10].[ext]',
                    ouputPath: 'media'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'css/index.css'
        }),
        new OptimizeCssAssetsWebpackPlugin()
    ],
    mode: 'production',
}