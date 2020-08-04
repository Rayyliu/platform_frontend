// const proxy = require('http-proxy-middleware');
const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        createProxyMiddleware('/platform_server', {
            target: 'http://localhost:8082',
            // target: 'http://localhost:8081',
            changeOrigin: true,
                pathRewrite:{
                //user
                '^/platform_server/user/register' : '/user/register',
                '^/platform_server/user/findByUsername' : '/user/findByUsername',
                '^/platform_server/login' : '/user/login',

                //project
                '^/platform_server/project/add' : '/project/save',
                '^/platform_server/project/queryProject' : '/project/query',
                '^/platform_server/project/edit': '/project/edit',
                '^/platform_server/project/queryById' : '/project/queryById',
                '^/platform_server/project/delById' : '/project/delById',
                '^/platform_server/project/updateValid' : '/project/updateValid',
                '^/platform_server/project/deletes' : '/project/deletes',
                '^/platform_server/project/queryDistProject' : '/project/queryDistProject',

                //env
                '^/platform_server/env/add' : '/env/add',
                '^/platform_server/env/queryPage' : '/env/queryPage',
                '^/platform_server/env/singleDelet' : '/env/singleDelet',
                '^/platform_server/env/deletes' : '/env/deletes',
                '^/platform_server/env/edit' : '/env/edit',


                //interface
                '^/platform_server/interface/add' : '/interface/add',
                '^/platform_server/interface/queryAll' : '/interface/queryAll',
                '^/platform_server/interface/queryPage' : '/interface/queryPage',
                '^/platform_server/interface/edit' : '/interface/edit',
                '^/platform_server/interface/queryDistInterFace' : '/interface/queryDistInterFace',
                '^/platform_server/interface/findByName' : '/interface/findByName'

                }
        }
    ))
};
