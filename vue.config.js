const webpack = require('webpack');
module.exports = {
    publicPath: "/",
    configureWebpack: {
        //支持jquery
        plugins: [
            new webpack.ProvidePlugin({
                $:"jquery",
                jQuery:"jquery",
                jquery:"jquery",
                "windows.jQuery":"jquery"
            })
        ]
    },
    // devServer: {
    //     // 端口
    //     port: 8080,
    //     proxy: {
    //         '/api': {
    //             target: 'http://localhost:3001/web/xlmc',
    //             changeOrigin: true,
    //             pathRewrite: {
    //                 '^/api': ''
    //             }
    //         }
    //     }
    // }
};