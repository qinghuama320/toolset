const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const SvgSpritePlugin = require(`svg-sprite-loader/plugin`);

const webpackConf = require('./config');

const isProd = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'local';

module.exports = {
    entry: {
        // 第三方组件，拉下来的静态资源。必须在index之前，依赖关系
        vendor: [
            // webpackConf.WEBSITE_ROOT_PATH + '/vendor/api/compiled',
            webpackConf.WEBSITE_ROOT_PATH + '/vendor/gt/gt',
            webpackConf.WEBSITE_ROOT_PATH + '/vendor/amcharts_lib/amcharts',
            webpackConf.WEBSITE_ROOT_PATH + '/vendor/amcharts_lib/serial',
            webpackConf.WEBSITE_ROOT_PATH + '/vendor/amcharts_lib/black',
        ],

        index: './app/index.js',
        // 框架性资源
        // common: ['react', 'react-dom', 'react-router-dom', 'react-intl-universal', 'mobx', 'mobx-react', 'prop-types'],
    },
    // 输出文件配置 详见：webpack-output
    output: {
        path: path.resolve(isProd ? webpackConf.webpackRelease.proDirectory : webpackConf.webpackRelease.devDirectory),
        filename: isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
        chunkFilename: isProd ? 'js/[name]-[id].[chunkhash:8].js' : 'js/[name]-[id].js', // 按需加载或提取公共代码的时候用到；如没有按需加载，则该规则无效
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx', '.css', '.less'],
        alias: {
            '~': path.resolve(webpackConf.WEBSITE_ROOT_PATH + '/app'),
            style: path.resolve(webpackConf.WEBSITE_ROOT_PATH + '/app/style'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                include: isProd ? webpackConf.WEBSITE_ROOT_PATH + '/app' : [webpackConf.WEBSITE_ROOT_PATH + '/app', webpackConf.WEBSITE_ROOT_PATH + '/app/pages'],
                exclude: webpackConf.WEBSITE_ROOT_PATH + '/node_modules/',
            },
            {
                // loader 后面 limit 字段代表图片打包限制，这个限制并不是说超过了就不能打包，而是指当图片大小小于限制时会自动转成 base64 码引用。上例中大于8192字节的图片正常打包，小于8192字节的图片以 base64 的方式引用。
                // url-loader 后面除了 limit 字段，还可以通过 name 字段来指定图片打包的目录与文件名

                test: /\.(png|jpg|gif|ttf|eot|woff|woff2|swf|svg)$/,
                // loader: isProd ? 'url-loader?limit=8192&name=[name].[hash:8].[ext]&publicPath=' + webpackConf.webpackRelease.resourcePrefix + '&outputPath=' + webpackConf.webpackRelease.resource + '/' : 'url-loader?name=[name].[ext]&outputPath=' + webpackConf.webpackRelease.resource + '/',
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: isProd ? 4096 : 4,
                            name: isProd ? '[name].[hash:8].[ext]' : '[name].[ext]',
                            publicPath: '/resource/',
                            outputPath: 'resource/',
                        },
                    },
                ],
                exclude: [webpackConf.WEBSITE_ROOT_PATH + '/node_modules/', webpackConf.WEBSITE_ROOT_PATH + '/app/style/icon/svg'],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            extract: true,
                            // publicPath: '/resource/',
                            spriteFilename: 'sprite-[hash:6].svg',
                            // symbolId: 'svg-[name]',
                        },
                    },
                ],
                include: [webpackConf.WEBSITE_ROOT_PATH + '/app/style/icon/svg'],
            },
            {
                test: /\.swf$/,
                loader: 'file-loader?name=js/[name].[ext]',
            },
        ],
    },
    plugins: [
        // 通过配置生产html可访问文件 详见：https://github.com/jantimon/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
            },
            chunks: ['vendor', 'index', 'common', 'manifest'], // 跟entry以及splitChunks里的配置对应
            hash: false,
            // chunksSortMode: 'dependency',
        }),

        // new StyleLintPlugin({
        //     files: ['src/css/*.css', 'app/style/**/*.l?(e|c)ss', 'app/pages/**/*.l?(e|c)ss'],
        //     fix: true,
        //     cache: true,
        //     emitErrors: true,
        //     failOnError: false,
        // }),

        new SvgSpritePlugin(),

        new SpritesmithPlugin({
            // 目标小图标
            src: {
                cwd: webpackConf.WEBSITE_ROOT_PATH + '/app/style/icon/png',
                glob: '*.png',
            },
            // 输出雪碧图文件及样式文件
            target: {
                image: webpackConf.WEBSITE_ROOT_PATH + '/app/style/icon/sprite.png',
                css: webpackConf.WEBSITE_ROOT_PATH + '/app/style/sprite.css',
            },
            // 样式文件中调用雪碧图地址写法
            apiOptions: {
                cssImageRef: '~style/icon/sprite.png',
            },
        }),

        // 将不符合引入规范的文件单独处理成可以通过requrie方式引入
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            jquery: 'jquery',
            'window.jQuery': 'jquery',
            'window.proto': 'proto',
            'window.goog': 'goog',
        }),
    ],

    // 排除不需要打入包内的第三方资源，需要同时设置参考资料：webpack官方 externals jquery的例子
    externals: {
        jquery: 'jQuery',
        proto: 'proto',
        goog: 'goog',
    },
};
