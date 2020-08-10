const koaBody = require('koa-bodyparser'),
    session = require('koa-session'),
    cors = require('koa2-cors')


module.exports.general = app => {
        app.use(koaBody())
        app.use(cors())


        app.keys = ['got']
        const CONFIG = {
            key: 'koa:sess',
            maxAge: 86400000,
            overwrite: true,
            signed: true,
            rolling: false,
        }
        app.use(session(CONFIG, app))

}