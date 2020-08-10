const _ = require('lodash'),
    { resolve } = require('path'),

    host = process.env.HOST || 'localhost',
    env = process.env.NODE_ENV || 'development',
    conf = require(resolve(__dirname, `./${env}.json`))

module.exports = _.assign({
    env,
    host
}, conf)