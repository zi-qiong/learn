const { resolve } = require("path") 
const HtmlWebpackPlugin = require("html-webpack-plugin")
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
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
                                    chrome: '58',
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
        extensions: ['.ts', '.js'],
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    devServer: {
        contentBase: resolve(__dirname, 'dist'),
        compress: true,
        port: 3000,
        hot: true,
        open: true
    }
})