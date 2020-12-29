const { resolve } =  require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: '../src/index.js',
    output: {
        filename: 'main.js',
        path: resolve(__dirname, 'bound')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
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
            template: '../src/index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        })
    ],
    mode: 'development',
    devServer: {
        contentBase: resolve(__dirname, 'dist'),
        compress: true,
        port: 3000,
        hot: true,
        open: true
    }
}