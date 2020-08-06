const mongoose = require('mongoose')

const User = mongoose.model('User')
/**
 * 根据 unionid 获取用户信息
 * @param {String} unionid 微信侧用户唯一id
 */
exports.findUserByUnionId = async (unionid) => {
  const user = await User.findOne({ unionid: unionid }).exec()

  return user
}

/**
 * 保存 session 到 mongoose user model
 * @param {Object} session 缓存对象
 */
exports.saveFromSession = async (session) => {
  let user = new User({
    openid: [session.user.openid],
    unionid: session.user.unionid,
    nickname: session.user.nickname,
    address: session.user.address,
    province: session.user.province,
    country: session.user.country,
    city: session.user.city,
    sex: session.user.sex,
    headimgurl: session.user.headimgurl,
    avatarUrl: session.user.avatarUrl
  })

  user = await user.save()

  return user
}