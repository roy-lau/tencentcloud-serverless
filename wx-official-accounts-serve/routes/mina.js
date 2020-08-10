const { controller, get, post, required } = require('../decorator/router')
const config = require('../config')
const { openidAndSessionKey, WXBizDataCrypt } = require('../wechat-lib/mina')
const { getUserAsync, loginAsync } = require('../controllers/user')

/**
 * 小程序路由控制器
 */
@controller('/mina')
class MinaController {
    @get('codeAndSessionKey')
    @required({ query: ['code'] })
    async getCodeAndSessionKey (ctx, next) {
        const { code } = ctx.query
        let res = await openidAndSessionKey(code)

        ctx.body = {
            success: true,
            data: res
        }
    }

    @get('user')
    @required({ query: ['code', 'userInfo'] })
    async getUser (ctx, next) {
        await getUserAsync(ctx, next)
    }

    @post('login')
    @required({ body: ['code', 'avatarUrl', 'nickName'] })
    async login (ctx, next) {
        await loginAsync(ctx, next)
    }
}

module.exports = MinaController