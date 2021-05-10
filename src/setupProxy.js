// const proxy = require('http-proxy-middleware');
const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        createProxyMiddleware('/platform_server', {
            // target: 'http://10.244.76.32:8147',
            target: 'http://localhost:8082',
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
                '^/platform_server/env/queryEnvName' : '/env/queryEnvName',


                //interface
                '^/platform_server/interface/add' : '/interface/add',
                '^/platform_server/interface/queryAll' : '/interface/queryAll',
                '^/platform_server/interface/queryPage' : '/interface/queryPage',
                '^/platform_server/interface/edit' : '/interface/edit',
                '^/platform_server/interface/queryDistInterFace' : '/interface/queryDistInterFace',
                '^/platform_server/interface/findByName' : '/interface/findByName',

                //case
                '^/platform_server/single/case/execute' : '/single/case/execute',
                '^/platform_server/single/case/queryPage' : '/single/case/queryPage',
                '^/platform_server/execute/update' : '/execute/update',
                '^/platform_server/execute/deletes' : '/execute/deletes',

                //plan
                '^/platform_server/plan/execute' : '/plan/execute',

                }
        }
    ))

    app.use(
        createProxyMiddleware('/platform_data', {
            // target: 'http://10.244.76.32:8146',
                target: 'http://localhost:8081',
            changeOrigin: true,
            pathRewrite:{
                //env表
                '^/platform_data/env/queryAllEnv' : '/env/queryAllEnv',

                //execute表
                '^/platform_data/execute/update' : '/execute/update',
                '^/platform_data/execute/queryCase' : '/execute/queryCase',
                '^/platform_data/execute/delSingleById' : '/execute/delSingleById',
                '^/platform_data/execute/deletes' : '/execute/deletes',
                '^/platform_data/execute/queryByProject' : '/execute/queryByProject',

                //plan表
                '^/platform_data/plan/add' : '/plan/add',
                '^/platform_data/plan/queryPage' : '/plan/queryPage',

                //project表
                '^/platform_data/project/queryProject' : '/project/query',

                //env表
                '^/platform_data/env/queryPage' : '/env/queryPage',

                //interface表
                '^/platform_data/interface/queryPage' : '/interface/queryPage',

                //case表
                '^/platform_data/execute/queryPage' : '/execute/queryPage',

                //redis
                '^/platform_data/redis/get' : '/redis/get',
            }
        }
        ))
};
