const wechat = require('../api/wechat'),
  config = require('../config'),
  urls = require('url'),
  qs = require('querystring')

module.exports = {
  // 签名接口响应
  async signature(ctx, next) {
    let url = ctx.query.url

    if (!url) ctx.throw(404)

    url = decodeURIComponent(url)
    try{
      let params = await wechat.getSignatureAsync(url)
  
      ctx.body = {
        success: 1,
        params: params
      }
    }catch(e){
      ctx.body = {
        success: 0,
        params: e
      }
    }
  },

  // 网页上点某按钮，直接跳转到 http://x.o/wechat-redirect?visit=a&id=b
  // 用户被重定向到 Wechat Redirect URL 授权验证
  // 验证后，自动二跳进入 http://x.o/oauth?code=xxxxxx&state=a_b
  async redirect(ctx, next) {
    let redirect = config.SITE_ROOT_URL + '/oauth'
    let scope = 'snsapi_userinfo'
    const { visit, id } = ctx.query
    const params = id ? `${visit}_${id}` : visit

    const url = wechat.getAuthorizeURL(scope, redirect, params)

    ctx.redirect(url)
  },
  async oauth(ctx, next) {
    const url = ctx.query.url
    const urlObj = urls.parse(decodeURIComponent(url))
    const params = qs.parse(urlObj.query)
    const code = params.code
    const user = await wechat.getUserByCode(code)

    console.log(user)
    ctx.session = {
      openid: user.openid
    }
    ctx.body = {
      success: true,
      user: user
    }
  }
}