require('@babel/register')

const config = require('./config'),
    app = require('./app.js')

app.listen(config.port, () => {
    console.info("服务已启动 》》 " + config.baseUrl + ':' + config.port)
});