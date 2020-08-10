const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * 定义 token 模型
 *
 * neme： access_token || token
 * access_token：
 * expires_in： 过期时间
 * meta: {
    createAt: 创建时间
    updateAt： 更新时间
    }
 */
const TokenSchema = new Schema({
  name: String,
  access_token: String,
  expires_in: Number,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

/**
 *
 * 每次save保存都会调用这个函数，添加创建时间和更新时间
 *
 */
TokenSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})



/**
 * TokenSchema 的静态方法
 */

TokenSchema.statics = {
	// 获取 AccessToken
  async getAccessToken () {
    const token = await this.findOne({ name: 'access_token' }).exec()
    return token
  },

  // 保存 AccessToken
  async saveAccessToken (data) {
    // 先查找 access_token
    let token = await this.findOne({ name: 'access_token' }).exec()

    /*
    	如果 access_token 存在，更新 access_token 和 expires_in
    	如果 access_token 不存在，新增 access_token 和 expires_in
     */
    if (token) {
      token.access_token = data.access_token
      token.expires_in = data.expires_in
    } else {
      token = new Token({
        name: 'access_token',
        expires_in: data.expires_in,
        access_token: data.access_token
      })
    }
    
    try {
      await token.save() // 保存 token
    } catch (e) {
      console.error('access_token 存储失败')
      console.error(e)
    }

    return data
  }
}

const Token = mongoose.model('Token', TokenSchema)
