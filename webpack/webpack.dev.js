const webpack = require('webpack');
const opn = require('opn');
const webpackMerge = require('webpack-merge');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const webpackComm = require('./webpack.comm');
const webpackConf = require('./config');

module.exports = webpackMerge(webpackComm, {
    mode: 'development',
    devtool: 'cheap-eval-source-map',
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
                // loader: 'style-loader?sourceMap!css-loader?sourceMap!postcss-loader?sourceMap!less-loader?sourceMap',
                exclude: webpackConf.WEBSITE_ROOT_PATH + '/node_modules/',
            },
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                use: [
                    {
                        options: {
                            formatter: eslintFormatter,
                            eslintPath: require.resolve('eslint'),
                            /* baseConfig: {
                                extends: [
                                    require.resolve('eslint-config-react-app'),
                                    require.resolve('eslint-config-airbnb')
                                ],
                            }, */
                            useEslintrc: true,
                        },
                        loader: require.resolve('eslint-loader'),
                    },
                ],
                include: [webpackConf.WEBSITE_ROOT_PATH + '/app'],
            },
        ],
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    devServer: {
        hot: true,
        inline: true,
        host: '0.0.0.0',
        port: 8080,
        // contentBase:path.resolve(webpackConf.webpackRelease.devDirectory),
        historyApiFallback: true,
        disableHostCheck: true,

        proxy: {
            // http接口的转发代理
            '/v1/': {
                target: 'https://api.biss.com/',
                changeOrigin: true,
                secure: false,
            },
            // 行情接口的代理，但是好像不起作用
            '/api/v1/biss.api.v1.push.PushChannel/': {
                target: 'https://www.biss.com/',
                changeOrigin: true,
                secure: false,
            },
        },

        after() {
            opn('http://localhost:' + this.port + '?BISS_API_HOST=10.2.0.5');
        },
    },
});
