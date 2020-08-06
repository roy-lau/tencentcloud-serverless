const mongoose =require('mongoose')

const User = mongoose.model('User')

/**
 * 管理员登陆
 * @param {String} email 邮箱|账号 
 * @param {String} password 密码
 */
exports.login = async (email, password) => {
  let match = false

  const user = await User.findOne({ email: email }).exec()

  if (user) {
    match = await user.comparePassword(password, user.password)
  }

  return {
    match,
    user
  }
}