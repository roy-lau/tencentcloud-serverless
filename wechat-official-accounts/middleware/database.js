const fs = require('fs'),
    mongoose = require('mongoose'),
    { resolve } = require('path'),
    config = require('../config'),


    // 加载 “../database/schema” 文件夹先所有的 js 文件 （可能会很多）
    models = resolve(__dirname, '../database/schema')

fs.readdirSync(models)
    .filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(file => require(resolve(models, file)))



// 安装 mongoose
// resolve
// err = error
// ../config
// , save token

module.exports.database = app => {

        if (config.env === 'development') {
            mongoose.set('debug', true)
        }
        // 连接 mongodb
        mongoose.connect(config.db,{ useNewUrlParser: true,useUnifiedTopology: true })

        // 断开 mongodb 连接
        mongoose.connection.on('disconnected', () => {
            mongoose.connect(config.db,{ useNewUrlParser: true,useUnifiedTopology: true })
        })

        // mongodb 出错
        mongoose.connection.on('error', err => {
            console.error(err)
        })
        // 打开 mongodb
        mongoose.connection.once('open', async () => {
            console.log('MongoDB 连接到 》》', config.db)

        })
}