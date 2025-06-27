const path = require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
// const { Templateemplate } = require('webpack');
module.exports={
    mode: 'development',
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
        plugins:[new HtmlWebpackPlugin({
        template:'index.html',
    })],
}