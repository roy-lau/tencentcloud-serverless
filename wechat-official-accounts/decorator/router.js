/**
 * 装饰器
 */

const { resolve } = require('path'),
    Router = require('koa-router'),
    _ = require('lodash'),
    glob = require('glob')

// https://github.com/pleerock/routing-controllers

let reqID = 0
const decorate = (args, middleware) => {
    let [target, key, descriptor] = args

    target[key] = isArray(target[key])
    target[key].unshift(middleware)

    return descriptor
}

/*
我们首先知道，Javascript 的任何值，都不外乎是这几种类型，对象类型 Object 或者 字符串类型 String 或者 布尔类型 Boolean 或者 数字类型 Number 或者 Undefined 未定义，或者是空值 Null

而整个 Symbol 算是第七种类型吧，但是它是比较特殊一点，它也是值，但又不是数字或者字符串，通过 Symbol 生成的值，与任何其他的值都不相等，也就是说，每一个 Symbol 都是独一无二的不会重复的，而且创建后不能修改，这就保证了它的唯一性，也不会被污染到。
*/

const symbolPrefix = Symbol('prefix')
let routersMap = new Map()

const isArray = c => _.isArray(c) ? c : [c]

const normalizePath = path => path.startsWith('/') ? path : `/${path}`

class Route {
    constructor(app, apiPath) {
        this.app = app
        this.router = new Router()
        this.apiPath = apiPath
    }

    init() {
        glob.sync(resolve(this.apiPath, './*.js')).forEach(require)
        _.forIn(routersMap, (value, key) => {
            console.log(value, key)
        })

        for (let [conf, controller] of routersMap) {
            const controllers = isArray(controller)
            let prefixPath = conf.target[symbolPrefix]
            if (prefixPath) prefixPath = normalizePath(prefixPath)
            const routerPath = prefixPath + conf.path

            this.router[conf.method](routerPath, ...controllers)
        }

        this.app.use(this.router.routes())
        this.app.use(this.router.allowedMethods())
    }
}


const router = conf => (target, key, descriptor) => {
    conf.path = normalizePath(conf.path)

    routersMap.set({
        target: target,
        ...conf
    }, target[key])
}

const controller = path => target => target.prototype[symbolPrefix] = path

const get = path => router({
    method: 'get',
    path: path
})

const post = path => router({
    method: 'post',
    path: path
})

const put = path => router({
    method: 'put',
    path: path
})

const del = path => router({
    method: 'del',
    path: path
})

const convert = middleware => (...args) => decorate(args, middleware)

const log = convert(async (ctx, next) => {
    let currentReqID = reqID++
    console.time(`${currentReqID} ${ctx.method} ${ctx.url}`)
    await next()
    console.timeEnd(`${currentReqID} ${ctx.method} ${ctx.url}`)
})

/*
  @required({
    body: ['username', 'password'],
    query: ['token']
  })
*/

const required = rules => convert(async (ctx, next) => {
    let errors = []
    const passRules = R.forEachObjIndexed(
        (value, key) => {
            errors = R.filter(i => !R.has(i, ctx.request[key]))(value)
        }
    )
    passRules(rules)

    if (errors.length) ctx.throw(412, `${errors.join(',')} is required`)
    await next()
})


module.exports = {
    symbolPrefix: symbolPrefix,
    routersMap: routersMap,
    isArray: isArray,
    normalizePath: normalizePath,
    Route: Route,
    router: router,
    controller: controller,
    get: get,
    post: post,
    put: put,
    del: del,
    convert: convert,
    log: log,
    required: required
}