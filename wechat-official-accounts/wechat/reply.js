/*
  回复策略
 */
const request = require('request-promise'),
    config = require('../config')

const tip = '终于等到你~ 还好没放弃~ \n' +
    '你就是我等待千年的那只…… /坏笑\n' +
    '是不是觉得我很聪明/疑问 no？ 我有以下这些能力呢！\n' +
    '日期查询\n列车查询\n数字计算\n快递查询\n菜谱大全\n天气查询\n图片搜索\n星座运势\n新闻资讯\n成语接龙\n故事大全\n聊天对话\n笑话大全\n城市邮编\n顺口溜\n绕口令\n歇后语\n股票查询\n汽油报价\n脑筋急转弯\n附近酒店\n中英互译'

const sayHi = '你好呀！/坏笑'


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
            if (message.EventKey === 'about') {
                ctx.body = [{
                    title: 'RoyLau github',
                    description: 'my github，Where there is life, struggle',
                    picUrl: 'https://avatars0.githubusercontent.com/u/22829291?s=400&u=b291223649da14dfcb7e95a39a205d73acefc5be&v=4',
                    url: 'https://github.com/roy-lau'
                }, {
                    title: 'RoyLau yuque',
                    description: '我的语雀博客知识库',
                    picUrl: 'https://cdn.nlark.com/yuque/0/2019/jpeg/anonymous/1565053269508-38580540-738f-4433-8806-f2a910aac549.jpeg?x-oss-process=image%2Fresize%2Cm_fill%2Cw_192%2Ch_192%2Fformat%2Cpng',
                    url: 'https://www.yuque.com/roylau/blog'
                }]
            } else if (message.EventKey === 'batchMaterial') {
                const res = await client.handle('batchMaterial') // 获取永久素材
                ctx.body = JSON.stringify(res, null, 2)
            }
        } else {
            ctx.body = tip
        }
        /**
         * 处理接收文本的回复
         * @param  {[type]} message.MsgType [text]
         * @return {[type]}                 [图灵机器人返回的文本]
         */
    } else if (message.MsgType === 'text') {
        if (message.Content === '获取菜单') {
            const res = await client.handle('getCurrentMenuInfo')
            ctx.body = JSON.stringify(res, null, 2)
        } else if (message.Content === '更新菜单') {
            let menuMsg
            try {
                await client.handle('delMenu')
            } catch (e) {
                console.error('删除菜单失败')
                console.error(e)

                menuMsg = '删除失败' + e
            }

            try {
                const menu = require('./menu')
                const res = await client.handle('createMenu', menu)
                menuMsg = '创建成功 /擦汗\n' + res
            } catch (err) {
                console.error('创建菜单失败')
                console.error(err)
            }

            ctx.body = menuMsg
        } else if (message.Content === 'hi' || message.Content === 'hello') {
            ctx.body = sayHi + `<a href="https://${ctx.host}/test/fetchUserList">获取用户列表</a>`
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
            picUrl: 'https://tse2-mm.cn.bing.net/th/id/OIP.bWbFo_If80tApL4vyiDFugHaKh?pid=Api&rs=1',
            url: message.Url
        }]
    }
}