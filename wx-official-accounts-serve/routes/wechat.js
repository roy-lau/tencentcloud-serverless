const { controller, get, post, log } = require('../decorator/router'),
    config = require('../config'),
    wechat = require('../controllers/wechat'),
    wechatMiddle = require('../wechat-lib/middleware'),
    reply = require('../wechat/reply'),
    mp = require('../wechat/index')


/**
 * 微信公众号路由控制器
 */
@controller('')
class WxController {
    @get('/wechat-hear')
    @log
    async wxHear (ctx, next) {
        const middle = wechatMiddle(config.wechat, reply)
        await middle(ctx, next)
    }

    @post('/wechat-hear')
    @log
    async wxHear (ctx, next) {
        const middle = wechatMiddle(config.wechat, reply)
        await middle(ctx, next)
    }
    // 签名（返回js-sdk config 信息）
    @get('/wechat-signature')
    async wxSignature (ctx, next) {
        await wechat.signature(ctx, next)
    }
    // 二跳地址
    @get('/wechat-redirect')
    async wxRedirect (ctx, next) {
        console.log('into redirect')
        await wechat.redirect(ctx, next)
    }

    @get('/wechat-oauth')
    async wxOAuth (ctx, next) {
        await wechat.oauth(ctx, next)
    }

    @get('/:dynamic')
    @log
    async dynamic (ctx, next) {
        const { url: reqUrl, query: reqData } = ctx.request
        if (reqUrl == '/favicon.ico') return next()
        let _data = Object.values(reqData).length ? Object.values(reqData) : ''
        console.log(_data)
        let client = mp.getWechat()
        const resWx = await client.handle(reqUrl.replace('/', ''), _data)
        ctx.body = resWx || { success: false, info: 'response wx unknown !' }
    }
}

module.exports = WxController