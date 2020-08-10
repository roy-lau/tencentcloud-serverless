const api = require('../api')
const config =require('../config')
const mongoose= require('mongoose')
const {
  openidAndSessionKey,
  WXBizDataCrypt
} = require('../wechat-lib/mina')

const User = mongoose.model('User')

exports.decryptUserAsync = async (code, userInfo) => {
  const minaUser = await openidAndSessionKey(code)

  let user = await User.findOne({
    unionid: minaUser.unionid
  }).exec()

  if (!user) {
    let pc = new WXBizDataCrypt(minaUser.session_key)
    let data = pc.decryptData(userInfo.encryptedData, userInfo.iv)

    user = await User.findOne({
      unionid: data.unionId
    })

    if (!user) {
      let _userData = userInfo.userInfo

      user = new User({
        avatarUrl: _userData.avatarUrl,
        nickname: _userData.nickName,
        unionid: data.unionid,
        openid: [minaUser.openid],
        sex: _userData.gender,
        country: _userData.country,
        province: _userData.province,
        city: _userData.city
      })

      await user.save()
    }
  }

  return user
}

exports.getUserAsync = async (ctx, next)=> {
  const { code, userInfo } = ctx.query
  let user
  
  try {
    user = await decryptUserAsync(code, userInfo)
  } catch (err) {
    return (ctx.body = {
      success: false,
      err: err
    })
  }

  ctx.body = {
    success: true,
    data: {
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
      sex: user.sex
    }
  }
}

exports.loginAsync = async (ctx, next) =>{
  const {
    code,
    avatarUrl,
    nickName
  } = ctx.request.body

  try {
    const { openid, unionid } = await openidAndSessionKey(code)

    let user = await User.findOne({
      unionid
    }).exec()

    if (!user) {
      user = new User({
        openid: [openid],
        nickname: nickName,
        unionid,
        avatarUrl
      })

      user = await user.save()
    } else {
      user.avatarUrl = avatarUrl
      user.nickname = nickName
      user = await user.save()
    }

    ctx.body = {
      success: true,
      data: {
        nickname: nickname,
        avatarUrl: avatarUrl
      }
    }
  } catch (err) {
    ctx.body = {
      success: false,
      err: err
    }
  }
}