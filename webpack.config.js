var webpack = require('webpack')
var path = require('path')

module.exports = {
    entry: './public/javascripts/src/main.js',
    output: {
        path: './public/javascripts/build/',
        filename: 'app.js'
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules'),
    },
    module: {
        loaders: [{
            test: /\.vue$/,
            loader: 'vue'
        }, {
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: 'style!css!autoprefixer'
        }, {
            test: /\.less/,
            loader: 'style!css!autoprefixer!less'
        }, {
            test: /\.json$/,
            loader: 'json'
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'url',
            query: {
                limit: 10000,
                name: '[name].[ext]?[hash]'
            }
        }]
    },
    vue: {
        loaders: {
            css: 'style!css!autoprefixer!less'
        }
    },
    devtool: 'source-map'
}