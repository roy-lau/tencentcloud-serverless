/*
	工具函数（微信相关的）
 */
const xml2js = require('xml2js'),
    template = require('./tpl'),
    sha1 = require('sha1')

/**
 * 解析 XML
 * @param  {[type]} xml [description]
 * @return {[type]}     [description]
 */
function parseXML(xml) {
	// console.log('parseXML >>>>>>',xml)
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, { trim: true }, (err, content) => {
            if (err) reject(err)
            else resolve(content)
        })
    })
}

/**
 * 格式化消息
 * @param  {[type]} result [description]
 * @return {[type]}        [description]
 */
function formatMessage(result) {
    let message = {}

    if (typeof result === 'object') {
        const keys = Object.keys(result)

        for (let i = 0; i < keys.length; i++) {
            let item = result[keys[i]]
            let key = keys[i]

            if (!(item instanceof Array) || item.length === 0) {
                continue
            }

            if (item.length === 1) {
                let val = item[0]

                if (typeof val === 'object') {
                    message[key] = formatMessage(val)
                } else {
                    message[key] = (val || '').trim()
                }
            } else {
                message[key] = []

                for (let j = 0; j < item.length; j++) {
                    message[key].push(formatMessage(item[j]))
                }
            }
        }
    }

    return message
}

/**
 * 处理消息模板
 * @param  {[type]} content [内容]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
function tpl(content, message) {
    // 默认类型是 text(文本)
    let type = 'text'

    // 如果微信服务器，响应的内容是个数组。修改 type 为 news
    if (Array.isArray(content)) {
        type = 'news'
    }

    // 如果微信服务器没有响应 content
    if (!content) {
        content = 'Empty News'
    }

    // 如果微信服务器，响应有内容 也有类型。 设置 type 为 微信响应的类型
    if (content && content.type) {
        type = content.type
    }

    // 整合数据，传给微信消息模板
    let info = Object.assign({}, {
        content: content,
        createTime: new Date().getTime(),
        msgType: type,
        toUserName: message.FromUserName,
        fromUserName: message.ToUserName
    })

    return template(info)
}

/**
 * 创建 nonce 
 * @return {String} 随机字符串
 */
function createNonce() {
    return Math.random().toString(36).substr(2, 15)
}

/**
 * 创建 Timestamp
 * @return {String} 当前时间戳
 */
function createTimestamp() {
    return parseInt(new Date().getTime() / 1000, 0) + ''
}

/**
 * 排序 转小写 拼接 截取
 * @param {Object} args keys
 */
function raw(args) {
    let keys = Object.keys(args)
    let newArgs = {}
    let str = ''

    // 排序
    keys = keys.sort()
    keys.forEach((key) => {
        // 转为小写字母
        newArgs[key.toLowerCase()] = args[key]
    })

    // 拼接
    for (let k in newArgs) {
        str += '&' + k + '=' + newArgs[k]
    }

    // 截取
    return str.substr(1)
}

/**
 * 签名算法
 * @param {String} nonce 随机字符串
 * @param {String} ticket 票据 
 * @param {String} timestamp  时间戳
 * @param {String} url 
 * @returns {String} sha 加密值
 */
function signIt(nonce, ticket, timestamp, url) {
    const ret = {
        jsapi_ticket: ticket,
        nonceStr: nonce,
        timestamp: timestamp,
        url: url
    }

    const string = raw(ret)
    const sha = sha1(string)

    return sha
}
/**
 * 签名
 * @param {String} ticket 票据
 * @param {String} url 
 * @returns
 * {
        noncestr: 随机字符串,
        timestamp: 当前时间戳,
        signature: 加密值
    }
 */
function sign(ticket, url) {
    const nonce = createNonce()
    const timestamp = createTimestamp()
    const signature = signIt(nonce, ticket, timestamp, url)

    return {
        noncestr: nonce,
        timestamp: timestamp,
        signature: signature
    }
}

module.exports = {
    formatMessage,
    parseXML,
    tpl,
    sign
}