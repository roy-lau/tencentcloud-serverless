const
    path = require('path'),
    koa = require('koa'),
    cors = require('koa2-cors'),
    bodyParser = require('koa-bodyparser'),
    koaBody = require('koa-body'),
    static = require('koa-static'),
    { responseTime, errors } = require('./middleware'),
    router = require('./routes');

const app = new koa()

app
    // Error handler
    .use(errors)

    .use(bodyParser({
        enableTypes: ['json', 'form', 'text'],
        onerror: (err, ctx) => {
            ctx.throw('数据解析出错： ' + err, 422);
        }
    }))
    // 使用 ctx.request.files 获取文件信息
    .use(koaBody({
        multipart: true, // 支持文件上传
        formidable: {
            keepExtensions: true, // 保留后缀
            //设置文件的默认保存目录，不设置则保存在系统临时目录下  os.tmpdir()
            uploadDir: path.resolve(path.join(__dirname) + '/static/uploads'),
            // maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
            // onFileBegin: (name, file) => {
            //     console.log(name, file)
            // },
            onError: (err, ctx) => {
                ctx.throw('文件上传出错：' + err, 423);
            }
        }
    }))
    // 静态网页 把静态页统一放到public中管理
    .use(static(path.join(__dirname) + '/static/'))

    // Enable CORS for all routes
    .use(cors({
        origin: '*',
        allowMethods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowHeaders: ['Content-Type', 'Accept'],
        exposeHeaders: ['roylau-sls-api-cache', 'roylau-sls-api-response-time'],
    }))

    // Set header with API response time
    .use(responseTime)

    // router routes
    .use(router.routes());



module.exports = app
