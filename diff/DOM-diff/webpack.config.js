const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');

module.exports = {
    entry: './src/js/index.js',
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'boundle.js'
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve(__dirname, 'src/index.html')
        })
    ],
    devServer: {
        contentBase: './',
        open: true
    }
}