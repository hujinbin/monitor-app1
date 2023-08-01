const proxy = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        proxy.createProxyMiddleware(
            '/api', {
                target: 'http://card.leheavengame.com',
                changeOrigin: true,
            }
        )
    )
}