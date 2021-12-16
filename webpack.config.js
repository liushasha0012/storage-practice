const path = require('path');

const VueLoaderPlugin = require('vue-loader/lib/plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: "production", // "production" | "development" | "none"
    // entry: "./src/index.js", // string | object | array
    entry: {
        home: './src/home/home.js',
        manage: './src/manage/manage.js',
        manage2: './src/manage2/manage2.js'
    },
    // 默认为 ./src
    // 这里应用程序开始执行
    // webpack 开始打包
    output: {
      // webpack 如何输出结果的相关选项
      // 输出的路径
      path: path.resolve(__dirname, "dist"), // string (default)
      // 输出的文件名称
      filename: "[name].js", // string (default)
    },
    module: {
        // 模块配置相关
        rules: [
            // 模块规则（配置 loader、解析器等选项）
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        // new CleanWebpackPlugin(),
        // new HtmlWebpackPlugin({
        //     title: 'Hot Module Replacement',
        // }),
    ],
    resolve: {
        alias: {
            "vue": "vue/dist/vue.js"
        }
    },
}
