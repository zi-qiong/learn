const { resolve } = require("path") 
const HtmlWebpackPlugin = require("html-webpack-plugin")
// const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: "./src/index.ts",
    output: {
        path: resolve(__dirname, 'dist'),
        filename: "bundle.js"
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: ['style-loader', 
            "css-loader", 
            "less-loader"
        ]
        }, {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: [[
                            "@babel/preset-env",
                            {
                                targets: {
                                    chrome: '60',
                                    firefox: '60',
                                    ie: '9',
                                    safari: '10',
                                    edge: '17'
                                },
                                corejs: {
                                    version: 3
                                },
                                useBuiltIns: "usage"
                            }
                        ]]
                    }
                },
                'ts-loader'
            ]
        }]
    },
    plugins: [
        // new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        })
    ],
    mode: "development",
    resolve: {
        extensions: ['.ts', '.js']
    }
}