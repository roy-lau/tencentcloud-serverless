/*
  回复策略
 */
const request = require('request-promise'),
    config = require('../config')

const features = `<a href="weixin://bizmsgmenu?msgmenucontent=日期查询&msgmenuid=1">1.日期查询</a>
<a href="weixin://bizmsgmenu?msgmenucontent=列车查询&msgmenuid=2">2.列车查询</a>
<a href="weixin://bizmsgmenu?msgmenucontent=数字计算&msgmenuid=3">3.数字计算</a>
<a href="weixin://bizmsgmenu?msgmenucontent=快递查询&msgmenuid=4">4.快递查询</a>
<a href="weixin://bizmsgmenu?msgmenucontent=菜谱大全&msgmenuid=5">5.菜谱大全</a>
<a href="weixin://bizmsgmenu?msgmenucontent=天气查询&msgmenuid=6">6.天气查询</a>
<a href="weixin://bizmsgmenu?msgmenucontent=图片搜索&msgmenuid=7">7.图片搜索</a>
<a href="weixin://bizmsgmenu?msgmenucontent=星座运势&msgmenuid=8">8.星座运势</a>
<a href="weixin://bizmsgmenu?msgmenucontent=新闻资讯&msgmenuid=9">9.新闻资讯</a>
<a href="weixin://bizmsgmenu?msgmenucontent=成语接龙&msgmenuid=10">10.成语接龙</a>
<a href="weixin://bizmsgmenu?msgmenucontent=故事大全&msgmenuid=11">11.故事大全</a>
<a href="weixin://bizmsgmenu?msgmenucontent=聊天对话&msgmenuid=12">12.聊天对话</a>
<a href="weixin://bizmsgmenu?msgmenucontent=笑话大全&msgmenuid=13">13.笑话大全</a>
<a href="weixin://bizmsgmenu?msgmenucontent=城市邮编&msgmenuid=14">14.城市邮编</a>
<a href="weixin://bizmsgmenu?msgmenucontent=顺口溜&msgmenuid=15">15.顺口溜</a>
<a href="weixin://bizmsgmenu?msgmenucontent=绕口令&msgmenuid=16">16.绕口令</a>
<a href="weixin://bizmsgmenu?msgmenucontent=歇后语&msgmenuid=17">17.歇后语</a>
<a href="weixin://bizmsgmenu?msgmenucontent=脑筋急转弯&msgmenuid=18">18.脑筋急转弯</a>
<a href="weixin://bizmsgmenu?msgmenucontent=中英互译&msgmenuid=19">19.中英互译</a>
<a href="weixin://bizmsgmenu?msgmenucontent=获取菜单&msgmenuid=20">20.获取菜单</a>
<a href="weixin://bizmsgmenu?msgmenucontent=更新菜单&msgmenuid=21">21.更新菜单</a>`

const tip = '终于等到你~ 还好没放弃~ \n' +
    '你就是我等待千年的那只…… /坏笑\n' +
    '是不是觉得我很聪明/疑问 /No？ \n' +
    '手机上点击 <a href="weixin://bizmsgmenu?msgmenucontent=服务&msgmenuid=0">服务</a> 看看我的能力吧！'

const sayHelp = '我可以为您提供以下服务：\n' + features


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
        } else if ( /1|hi|hello|服务/.test(message.Content) ) {
            ctx.body = sayHelp
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