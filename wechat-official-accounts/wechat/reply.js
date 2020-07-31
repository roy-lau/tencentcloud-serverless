/*
  回复策略
 */
const request = require('request-promise'),
    config = require('../config')

const tip = '终于等到你~ 还好没放弃~ \n' +
    '你就是我等待千年的那只…… /坏笑\n' +
    '是不是觉得我很聪明/疑问 no？ 我有以下这些能力呢！\n' +
    '日期查询\n列车查询\n数字计算\n快递查询\n菜谱大全\n天气查询\n图片搜索\n星座运势\n新闻资讯\n成语接龙\n故事大全\n聊天对话\n笑话大全\n城市邮编\n顺口溜\n绕口令\n歇后语\n股票查询\n汽油报价\n脑筋急转弯\n附近酒店\n中英互译'
    '回复 1，穿越到到冰火查身份\n' +
    '回复 2，进入冰火手办商城\n' +
    '回复 3，获取最新的种子资源\n' +
    '回复 4，查看 9 大家族秘密\n' +
    '或者点击 <a href="' + config.SITE_ROOT_URL + '/exam">开始查身份</a>'

const bt = '权力的游戏 第六季 <a href="https://pan.baidu.com/s/1hsO4tl6">第一集</a>'


module.exports = async (ctx, next) => {
    const message = ctx.weixin
    let mp = require('./index.js')
    let client = mp.getWechat()

    /**
     * 响应事件
     * @param  {[type]} message.MsgType [description]
     * @return {[type]}                 [description]
     */
    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            ctx.body = tip
        } else if (message.Event === 'unsubscribe') {
            console.log('取关了')
        } else if (message.Event === 'LOCATION') {
            ctx.body = message.Latitude + ' : ' + message.Longitude
        } else if (message.Event === 'view') {
            ctx.body = message.EventKey + message.MenuId
        } else if (message.Event === 'pic_sysphoto') {
            ctx.body = message.Count + ' photos sent'
        } else if (message.Event === 'CLICK') {
            if (message.EventKey === 'bt') {
                ctx.body = bt
            }
        } else {
            ctx.body = tip
        }
    /**
     * 文本
     * @param  {[type]} message.MsgType [text]
     * @return {[type]}                 [图灵机器人返回的文本]
     */
    } else if (message.MsgType === 'text') {
        if (message.Content === '更新按钮吧') {
            const menu = require('./menu').default
            let menuMsg = '创建成功'

            try {
                await client.handle('delMenu')
            } catch (e) {
                console.log('删除菜单失败')
                console.log(e)

                menuMsg = '删除失败'
            }

            try {
                await client.handle('createMenu', menu)
            } catch (err) {
                console.log('创建菜单失败')
                console.log(err)
                menuMsg += menuMsg
            }

            ctx.body = menuMsg
        } else if (message.Content === 'bt' || message.Content === '3') {
            ctx.body = bt
        } else {
            /*
              调用图灵机器人处理文本消息
             */
            try {
                const apiUrl = 'http://www.tuling123.com/openapi/api',
                    key = 'cf646304e42a47b48ea9e7e6a980f526',
                    info = message.Content,
                    userid = message.FromUserName,

                    { text } = await request.get(`${apiUrl}?key=${key}&info=${encodeURI(info)}&userid=${userid}`, { json: true })

                ctx.body = text
            } catch (e) {
                console.error("图灵AI ERROR： " + e)
            }
        }

    } else if (message.MsgType === 'image') {
        ctx.body = {
            type: 'image',
            mediaId: message.MediaId
        }
    } else if (message.MsgType === 'voice') {
        ctx.body = {
            type: 'voice',
            mediaId: message.MediaId
        }
    } else if (message.MsgType === 'video') {
        ctx.body = {
            type: 'video',
            mediaId: message.MediaId
        }
    } else if (message.MsgType === 'location') {
        ctx.body = message.Location_X + ' : ' + message.Location_Y + ' : ' + message.Label
    } else if (message.MsgType === 'link') {
        ctx.body = [{
            title: message.Title,
            description: message.Description,
            picUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/xAyPZaQZmH09wYBjskFEQSoM4te0SnXR9YgbJxlDPVPDZtgLCW5FacWUlxFiaZ7d8vgGY6mzmF9aRibn05VvdtTw/0',
            url: message.Url
        }]
    }
}