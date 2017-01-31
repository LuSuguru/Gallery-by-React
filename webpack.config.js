var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: 'eval-source-map',

    entry: [__dirname + "/entry/main.js"],

    output: {
        path: __dirname + "/output",
        filename: "bundle.js"
    },

    module: {
        loaders: [{
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
                loader: 'url?limit=8192'
            },
            {
                test: /\.(mp4|ogg|svg)$/,
                loader: 'file-loader'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json', '.css'],
        alias: {
            js: path.join(__dirname, 'entry/js'),
            css: path.join(__dirname, 'entry/css'),
            data: path.join(__dirname, 'entry/data'),
            images: path.join(__dirname, 'entry/images')
        }
    }
}