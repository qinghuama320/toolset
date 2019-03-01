const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzer = require('webpack-bundle-analyzer');
const cssnano = require('cssnano');

const webpackComm = require('./webpack.comm');
const webpackConf = require('./config');

const BundleAnalyzerPlugin = BundleAnalyzer.BundleAnalyzerPlugin;
const isLocal = process.env.NODE_ENV === 'local';

const config = webpackMerge(webpackComm, {
    // devtool: "source-map",
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
            },
        ],
    },
    optimization: {
        minimizer: [
            // 压缩css
            new OptimizeCSSPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessor: cssnano,
                cssProcessorOptions: {
                    discardComments: {
                        removeAll: true,
                    },
                    safe: true,
                },
                canPrint: true,
            }),
            // 压缩js
            new UglifyJSPlugin({
                cache: true,
                parallel: true,
                /* output: {
                    //删除版权信息
                    comments: false
                }, */
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: true,
                    },
                },
                sourceMap: false,
            }),
        ],
        splitChunks: {
            // chunks: 'all',
            cacheGroups: {
                style: {
                    name: 'index',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
                // node_modules内的依赖库
                common: {
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/,
                    name: 'common',
                    minChunks: 1, // 被不同entry引用次数(import),1次的话没必要提取
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 100,
                    enforce: true,
                },
                // app 下的js文件，打开后体积并未减少，反而多了一个文件，注释掉了
                /* vendor: {
                    chunks: 'all',
                    test: mod => {
                        let modName = mod.resource || '';
                        let reg = /[\\/]node_modules[\\/]/;
                        if (!reg.test(modName) && modName.endsWith('.js')) {
                            console.log(modName);
                            return true;
                        }
                        return false;
                    },
                    name: 'vendor', // 生成文件名，依据output规则
                    minChunks: 3,
                    maxInitialRequests: 5,
                    minSize: 0,
                    priority: 1,
                }, */
            },
        },
        runtimeChunk: {
            name: 'manifest',
        },
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name]-[id].[contenthash:8].css',
            allChunks: true,
        }),
        // 清除 打包后的目录
        new CleanWebpackPlugin([webpackConf.webpackRelease.proDirectory], {
            root: webpackConf.WEBSITE_ROOT_PATH,
            verbose: true,
            dry: false,
        }),
    ],
});

// 拷贝静态资源
webpackConf.webpackRelease.vendor.forEach(data => {
    config.plugins.push(
        new CopyWebpackPlugin([
            {
                from: data.from,
                to: data.to,
                ignore: ['amcharts_lib/*.js', 'gt/gt.js', 'elliptic.js'], // 这些都打包了
            },
        ]),
    );
});

if (isLocal) {
    config.plugins.push(
        new BundleAnalyzerPlugin({
            openAnalyzer: isLocal,
        }),
    );
}

module.exports = config;
