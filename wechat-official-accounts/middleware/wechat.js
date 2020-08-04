const Router = require('koa-router'),
    request = require('request-promise'),
    sha1 = require('sha1'),
    opts = require('../config/wechat.js')

const prefix = 'https://api.weixin.qq.com/cgi-bin/'
let api = {
    accessToken: prefix + 'token?grant_type=client_credential'
}

class Wechat {
    constructor(ctx, next) {
        let self = this;
        this.appID = opts.appID;
        this.appsecret = opts.appsecret;
        this.getAccessToken = opts.getAccessToken;
        this.saveAccessToken = opts.saveAccessToken;

        this._init(ctx)

        this.getAccessToken()
            .then(data => {
                /**
                 * 判断获取的数据是否超时（try）
                 * 如果超时则更新数据
                 *
                 * 验证获取的数据是否正确（_isValidAccessToken）
                 * 如果正确向下传递，不正确则更新。
                 */
                try {
                    data = JSON.parse(data)
                } catch (e) {
                    return self._updateAccessToken(data)
                }
                if (self._isValidAccessToken(data)) {
                    Promise.resolve(data)
                } else {
                    return self._updateAccessToken(data)
                }
            }).then(data => {
                this.access_token = data.access_token
                this.expires_in = data.expires_in
                this.saveAccessToken(data)
            })
    }
    _init(ctx) {
        console.log(ctx.query)
        let token = opts.token,
            signature = ctx.query.signature,
            nonce = ctx.query.nonce,
            timestamp = ctx.query.timestamp,
            echostr = ctx.query.echostr,
            str = [token, timestamp, nonce].sort().join('')
        sha = sha1(str)

        if (sha === signature) {
            ctx.body = echostr + ''
        } else {
            ctx.body = '请在微信中请求'
        }
    }
    /**
     * 校验 access_token 是否过期
     * @return {Boolean}
     * @description
     *  true： access_token 正常
     *  false： access_token 过期
     */
    _isValidAccessToken(data) {
        if (!data || !data.access_token || !data.expires_in) {
            return false
        }


        let // 过期时间
            expires_in = data.expires_in,
            // 当前时间
            now = (new Date().getTime())

        // 如果当前时间小于过期时间，说明还没过期 true
        if (now < expires_in) {
            return true
        } else {
            return false
        }
    }
    /**
     * 更新 access_token
     */
    _updateAccessToken() {
        let appId = this.appID,
            appsecret = this.appsecret,
            url = api.accessToken + '&appid=' + appId + '&secret=' + appsecret

        return new Promise((resolve, reject) => {
            request({ url: url, json: true }).then(res => {
                try{
                    let data = res.body,
                        now = (new Date().getTime()),
                        // 更新 accessToken 的时间 = 当前时间 + 过期时间 - 2s
                        // 注： 2s 考虑到网络延迟 等一些情况（提前2s刷新）
                        expires_in = now + (data.expires_in - 20) + 1000;

                    data.expires_in = expires_in
                    resolve(data)
                }catch(e){
                    reject(e)
                    console.error("更新 AccessToken 失败",e)
                }
            })
        })
    }

}

module.exports = function() {
    return async function(ctx, next) {
        new Wechat(ctx, next);
        await next()
    }
}
// exports.Wechat