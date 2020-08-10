/**
 * 用户 db 模型，非常有借鉴价值
 */
const mongoose = require('mongoose')
// const bcrypt = require('bcrypt') // constOS 上需要重新安装这个包

const SALT_WORK_FACTOR = 10 // 加盐因子
const MAX_LOGIN_ATTEMPTS = 5 // 最大尝试登陆次数
const LOCK_TIME = 2 * 60 * 60 * 1000 // 锁定时间
const Schema = mongoose.Schema

const UserSchema = new Schema({
  // 角色类型：user admin superAdmin
  role: {
    type: String,
    default: 'user'
  },
  openid: [String],
  unionid: String,
  nickname: String,
  address: String,
  province: String,
  country: String,
  city: String,
  sex: String,
  email: String,
  headimgurl: String,
  avatarUrl: String,
  password: String,
  hashed_password: String,
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: Number,
  meta: {
    createdAt: { // 创建时间
      type: Date,
      default: Date.now()
    },
    updatedAt: { // 修改/更新 时间
      type: Date,
      default: Date.now()
    }
  }
})


UserSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

/**
 * 保存时 如果是第一次保存增加创建时间和更新时间
 *        之后的保存都是修改更新时间 (updatedAt)
 */
UserSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

// UserSchema.pre('save', function (next) {
//   let user = this

//   // 如果没有修改 password ，return next()
//   if (!user.isModified('password')) return next()
  
//   // 如果修改(或新增) password ，保存加盐加密后的密码
//   bcrypt.genSalt(SALT_WORK_FACTOR, (saltError, salt) => {
//     if (saltError) return next(saltError)

//     bcrypt.hash(user.password, salt, (hashError, hash) => {
//       if (hashError) return next(hashError)

//       user.password = hash
//       next()
//     })
//   })
// })

UserSchema.methods = {
  /**
   * 对比两个密码是否相同
   * 
   * @param {String} _password 新密码
   * @param {String} password 旧密码
   */
  // comparePassword: function (_password, password) {
  //   return new Promise((resolve, reject) => {
  //     bcrypt.compare(_password, password, function (err, isMatch) {
  //       if (!err) resolve(isMatch)
  //       else reject(err)
  //     })
  //   })
  // },
  /**
   * 登陆尝试（对登陆次数和登陆时间进行校验）
   * 
   * 具体内容日后再理解理解
   */
  incLoginAttempts (user) {
    const self = this

    return new Promise((resolve, reject) => {
      if (self.lockUntil && self.lockUntil < Date.now()) {
        self.update({
          $set: {
            loginAttempts: 1
          }, 
          $unset: {
            lockUntil: 1
          }
        }, function (err) {
          if (!err) resolve(true)
          else reject(err)
        })
      } else {
        let updates = {
          $inc: {
            loginAttempts: 1
          }
        }

        if (self.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !self.isLocked) {
          updates.$set = {
            lockUntil: Date.now() + LOCK_TIME
          }
        }

        self.update(updates, err => {
          if (!err) resolve(true)
          else reject(err)
        })
      }
    })
  }
}

mongoose.model('User', UserSchema)