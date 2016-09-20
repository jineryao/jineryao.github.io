/**
 * Created by jiner on 2016/9/17.
 */
var path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.join(__dirname,'./dist'),
        filename: 'bundle.js',
        publicPath:'/dist/'
    },
    devServer:{
        historyApiFallback: true,
        hot: false,
        inline: true,
        grogress: true,
    },
    module:{
        loaders:[
            { test: /\.vue$/, loader:'vue' },
            { test: /\.css$/, loader: 'style!css'},
            { test: /\.html$/, loader: 'html-loader' },
            { test: /\.(png|jpg|PNG)$/, loader: 'url-loader?limit=10000' },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-runtime']
                }
            }
        ]
    },
    resolve: {
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['', '.js', '.vue'],
        // 别名，可以直接使用别名来代表设定的路径以及其他
        alias: {
            filter: path.join(__dirname, './src/filters'),
            components: path.join(__dirname, './src/components')
        }
    }
    //,
    //devtool: 'eval-source-map'
}