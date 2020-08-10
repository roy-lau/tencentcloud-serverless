const { Route } = require('../decorator/router'),
	{ resolve } = require('path'),

    r = path => resolve(__dirname, path)

module.exports.router = app => {
    // 引入 routes 下的所有文件
    const apiPath = r('../routes')
    // 实例化装饰器 Route
    const router = new Route(app, apiPath)
    // 初始化
    router.init()
}
