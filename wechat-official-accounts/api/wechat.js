const wechatPay = require('../wechat/lib/pay'),
  { getWechat, getOAuth } = require('../wechat')

const wechatApi = getWechat()

module.exports = {
  async findBillsAsync(date) {
    const data = await wechatPay.getBillAsync(date)
    return data
  },

  async findOrdersAsync(params) {
    const data = await wechatPay.getOrderAsync(params)
    return data
  },

  async getQrcodeAsync(params) {
    const data = await wechatApi.createQrcode(params)

    data.qrcode = wechatApi.showQrcode(data.ticket)

    return data
  },
  /**
   * 签名
   * @param {Sring} url 
   */
  async getSignatureAsync(url) {
    const data = await wechatApi.fetchAccessToken()
    const token = data.access_token
    const ticketData = await wechatApi.fetchTicket(token)
    const ticket = ticketData.ticket
    
    let params = wechatApi.sign(ticket, url)
    console.log("Signature:",params)
    params.appId = wechatApi.appID

    return params
  },

  // 网页授权 url
  getAuthorizeURL(...args) {
    const oauth = getOAuth()

    return oauth.getAuthorizeURL(...args)
  },

  async getUserByCode(code) {
    const oauth = getOAuth()

    const data = await oauth.fetchAccessToken(code)
    const openid = data.openid
    const user = await oauth.getUserInfo(data.access_token, openid)

    return user
  }
}