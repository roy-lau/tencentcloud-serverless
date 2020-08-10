const koa = require('koa'),

    app = new koa(),
    {resolve} = require('path'),
    database = require('./middleware/database.js'),
    general = require('./middleware/general.js'),
    router = require('./middleware/router.js'),
    R = require('ramda')



const r = path => resolve(__dirname, path)
const MIDDLEWARE = ['database', 'general', 'router']

const useMiddleware = (app) => {
  // 中间件的个数不定，通过 Ramda 的特性，从右往左进行函数组合，右侧函数的返回结果总是左侧函数的输入参数
  // R.map(console.log)([1, 2, 3])
  // MIDDLEWARE 数组交给了 R.map
  // 分别拿到的单个数组中的值，我们可以通过 R.compose 再次进行组合。
  return R.map(R.compose(
    R.map(i => i(app)),
    require,
    i => `${r('./middleware')}/${i}`)
  )
}

// 加载中间件
useMiddleware(app)(MIDDLEWARE)

module.exports = app