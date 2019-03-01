/**
 *
 * 站点基础配置信息
 * @type {{WEBSITE_ROOT_PATH, webpackRelease: {proDirectory: string, resource: string, resourcePrefix: string}, webpackOptions: {entry: {index: string}, resolve: {extensions: string[]}}}}
 * WEBSITE_ROOT_PATH 站点根目录
 * webpackRelease 站点发布相关的配置项
 * ～proDirectory 发布后的文件目录
 * ～resource 待定
 * ～resourcePrefix 待定
 * ~vendor 需要同步到生产目录的文件配置
 *
 */
const path = require('path');

const webpackConf = {
    WEBSITE_ROOT_PATH: path.resolve(__dirname, '../'),
    webpackRelease: {
        devDirectory: 'WEB_DEV_ROOT',
        proDirectory: 'WEB_ROOT',
        resource: 'resource',
        resourcePrefix: '/',
        vendor: [
            {
                name: 'Interface',
                from: './vendor',
                to: 'vendor',
            },
            {
                name: 'Activity',
                from: './activity',
                to: 'activity',
            },
        ],
    },
};

module.exports = webpackConf;
