const { Route } = require('../decorator/router'),
	{ resolve } = require('path'),

    r = path => resolve(__dirname, path)

module.exports.router = app => {
    const apiPath = r('../routes')
    const router = new Route(app, apiPath)

    router.init()
}
