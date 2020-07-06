const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        proxy('/admin_client', {
            target: 'https://www.xypsp.com',
            // target: 'http://localhost:8081',
            changeOrigin: true
        }
    ))
};
